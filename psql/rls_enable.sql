-- Step 2 of 2: switch row-level security on.
--
-- Run this only AFTER psql/rls_policies.sql has been applied AND the app
-- version that uses claim_item / unclaim_item / accept_invite is deployed.
--
-- To undo in an emergency (re-opens the database, so fix forward instead
-- if you can):
--   alter table public.<table> disable row level security;

alter table public.profiles enable row level security;
alter table public.lists enable row level security;
alter table public.list_members enable row level security;
alter table public.items enable row level security;
alter table public.list_invites enable row level security;

-- Signed-out visitors never need table access: sign-up and sign-in go
-- through Supabase Auth, not these tables.
revoke all on public.profiles, public.lists, public.list_members, public.items, public.list_invites from anon;

-- Row-level security doesn't apply to TRUNCATE, so nobody using the public
-- API should be able to wipe a table outright.
revoke truncate, references, trigger on public.profiles, public.lists, public.list_members, public.items, public.list_invites from authenticated;
