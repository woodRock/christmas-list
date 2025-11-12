create table public.list_members (
  list_id uuid not null references public.lists(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member' not null, -- e.g., 'owner', 'member', 'admin'
  primary key (list_id, profile_id)
);