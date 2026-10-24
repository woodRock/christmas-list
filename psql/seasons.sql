-- Seasons: a list is a long-lived family group, and each Christmas (or
-- birthday) is a season within it. Starting a new season archives the gifts
-- that were claimed last time and carries unclaimed wishes over.

alter table public.lists
  add column if not exists season_name text,
  -- null means the season began before seasons existed (i.e. last Christmas).
  add column if not exists season_started_at timestamptz;

alter table public.items
  add column if not exists archived_at timestamptz,
  add column if not exists archived_season text,
  add column if not exists carried_over boolean not null default false;

create index if not exists items_list_active_idx on public.items (list_id) where archived_at is null;

create or replace function public.start_new_season (p_list_id uuid, p_season_name text, p_rename_list boolean default false)
returns json as $$
declare
  v_list public.lists%rowtype;
  v_previous text;
  v_archived int;
  v_carried int;
begin
  select * into v_list from public.lists where id = p_list_id for update;

  if v_list.id is null then
    raise exception 'List not found';
  end if;
  if v_list.user_id is distinct from auth.uid() then
    raise exception 'Only the list owner can start a new season';
  end if;
  if coalesce(trim(p_season_name), '') = '' then
    raise exception 'Season name is required';
  end if;

  v_previous := coalesce(v_list.season_name, v_list.name, 'Previous season');

  -- Claimed gifts are assumed given: move them into history.
  update public.items
  set archived_at = now(), archived_season = v_previous
  where list_id = p_list_id and archived_at is null and is_purchased;
  get diagnostics v_archived = row_count;

  -- Unclaimed wishes stay, flagged so each person can keep or clear them.
  update public.items
  set carried_over = true
  where list_id = p_list_id and archived_at is null;
  get diagnostics v_carried = row_count;

  update public.lists
  set season_name = trim(p_season_name),
      season_started_at = now(),
      name = case when p_rename_list then trim(p_season_name) else name end
  where id = p_list_id;

  return json_build_object('archived', v_archived, 'carried_over', v_carried, 'previous_season', v_previous);
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.start_new_season (uuid, text, boolean) from public, anon;
grant execute on function public.start_new_season (uuid, text, boolean) to authenticated;
