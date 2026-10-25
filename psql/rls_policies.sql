-- Step 1 of 2: access rules for row-level security.
--
-- Safe to run at any time: policies have no effect until RLS is enabled
-- (psql/rls_enable.sql), and the new functions are only additions.
--
-- Membership checks live in SECURITY DEFINER helpers so policies never query
-- a table that is itself protected by a policy on list_members, which would
-- make Postgres fail with "infinite recursion detected in policy".

-- Helpers ---------------------------------------------------------------

create or replace function public.is_list_owner (p_list_id uuid)
returns boolean as $$
  select exists (select 1 from public.lists where id = p_list_id and user_id = auth.uid());
$$ language sql stable security definer set search_path = public;

create or replace function public.is_list_member (p_list_id uuid)
returns boolean as $$
  select public.is_list_owner(p_list_id)
    or exists (select 1 from public.list_members where list_id = p_list_id and profile_id = auth.uid());
$$ language sql stable security definer set search_path = public;

-- Whether a given person (not necessarily the caller) is on a list.
create or replace function public.profile_in_list (p_list_id uuid, p_profile_id uuid)
returns boolean as $$
  select exists (select 1 from public.lists where id = p_list_id and user_id = p_profile_id)
    or exists (select 1 from public.list_members where list_id = p_list_id and profile_id = p_profile_id);
$$ language sql stable security definer set search_path = public;

create or replace function public.shares_list_with (p_profile_id uuid)
returns boolean as $$
  select exists (
    select 1
    from public.list_members mine
    join public.list_members theirs on theirs.list_id = mine.list_id
    where mine.profile_id = auth.uid() and theirs.profile_id = p_profile_id
  );
$$ language sql stable security definer set search_path = public;

-- Actions that touch rows the caller can't otherwise write ------------------

-- Claim someone else's gift on a list you belong to.
create or replace function public.claim_item (p_item_id uuid)
returns void as $$
begin
  update public.items
  set is_purchased = true, purchased_by = auth.uid()
  where id = p_item_id
    and archived_at is null
    and user_id is distinct from auth.uid()
    and not coalesce(is_purchased, false)
    and public.is_list_member(list_id);

  if not found then
    raise exception 'This gift can''t be claimed. Someone may have just claimed it.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- Release a gift you claimed.
create or replace function public.unclaim_item (p_item_id uuid)
returns void as $$
begin
  update public.items
  set is_purchased = false, purchased_by = null
  where id = p_item_id and purchased_by = auth.uid() and archived_at is null;

  if not found then
    raise exception 'You haven''t claimed this gift.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- Join a list with an invite token. Links work for anyone until they expire,
-- so one QR code can be shared with the whole family.
create or replace function public.accept_invite (p_token text)
returns uuid as $$
declare
  v_invite public.list_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in to accept this invite.';
  end if;

  select * into v_invite from public.list_invites where token = p_token;

  if v_invite.id is null then
    raise exception 'Invite not found.';
  end if;
  if v_invite.expires_at < now() then
    delete from public.list_invites where id = v_invite.id;
    raise exception 'This invite has expired. Ask for a new link.';
  end if;

  insert into public.list_members (list_id, profile_id, role)
  values (v_invite.list_id, auth.uid(), 'member')
  on conflict (list_id, profile_id) do nothing;

  return v_invite.list_id;
end;
$$ language plpgsql security definer set search_path = public;

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'is_list_owner(uuid)', 'is_list_member(uuid)', 'profile_in_list(uuid, uuid)', 'shares_list_with(uuid)',
    'claim_item(uuid)', 'unclaim_item(uuid)', 'accept_invite(text)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', fn);
    execute format('grant execute on function public.%s to authenticated', fn);
  end loop;
end $$;

-- Policies -------------------------------------------------------------

-- Replace every existing policy on these tables.
do $$
declare
  p record;
begin
  for p in
    select tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('profiles', 'lists', 'list_members', 'items', 'list_invites')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- profiles: yourself, and people you share a list with.
create policy "profiles_select" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.shares_list_with(id));
create policy "profiles_insert" on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "profiles_update" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "profiles_delete" on public.profiles for delete to authenticated
  using (id = (select auth.uid()));

-- lists: members can see; only the owner can create, change or delete.
create policy "lists_select" on public.lists for select to authenticated
  using (user_id = (select auth.uid()) or public.is_list_member(id));
create policy "lists_insert" on public.lists for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "lists_update" on public.lists for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "lists_delete" on public.lists for delete to authenticated
  using (user_id = (select auth.uid()));

-- list_members: members see each other. The owner adds themselves when
-- creating a list; everyone else joins through accept_invite(). Owners can
-- remove anyone, and members can remove themselves (leave).
create policy "list_members_select" on public.list_members for select to authenticated
  using (public.is_list_member(list_id));
create policy "list_members_insert_owner" on public.list_members for insert to authenticated
  with check (profile_id = (select auth.uid()) and public.is_list_owner(list_id));
create policy "list_members_delete" on public.list_members for delete to authenticated
  using (public.is_list_owner(list_id) or profile_id = (select auth.uid()));

-- items: members see everything on their lists. You can add gifts for
-- anyone on the list; you manage your own; the owner can tidy any gift.
-- Claiming goes through claim_item() / unclaim_item().
create policy "items_select" on public.items for select to authenticated
  using (public.is_list_member(list_id));
create policy "items_insert" on public.items for insert to authenticated
  with check (
    public.is_list_member(list_id)
    and public.profile_in_list(list_id, user_id)
    and not coalesce(is_purchased, false)
    and purchased_by is null
    and archived_at is null
  );
create policy "items_update" on public.items for update to authenticated
  using (user_id = (select auth.uid()) or public.is_list_owner(list_id))
  with check ((user_id = (select auth.uid()) or public.is_list_owner(list_id)) and public.is_list_member(list_id));
create policy "items_delete" on public.items for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_list_owner(list_id));

-- list_invites: only members of the list can see, create or delete its
-- invites. Redeeming a token goes through accept_invite().
create policy "list_invites_select" on public.list_invites for select to authenticated
  using (public.is_list_member(list_id));
create policy "list_invites_insert" on public.list_invites for insert to authenticated
  with check (public.is_list_member(list_id));
create policy "list_invites_delete" on public.list_invites for delete to authenticated
  using (public.is_list_member(list_id));
