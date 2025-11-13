CREATE TABLE IF NOT EXISTS public.list_invites (
  id uuid not null default gen_random_uuid (),
  list_id uuid not null,
  token text not null,
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone not null,
  constraint list_invites_pkey primary key (id),
  constraint list_invites_list_id_fkey foreign key (list_id) references lists (id) on delete cascade,
  constraint list_invites_token_key unique (token)
);

DROP POLICY IF EXISTS "Allow members to create invites" ON public.list_invites;
CREATE POLICY "Allow members to create invites"
ON public.list_invites
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM list_members
    WHERE
      list_members.list_id = list_invites.list_id AND
      list_members.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow authenticated users to read invites" ON public.list_invites;
CREATE POLICY "Allow authenticated users to read invites"
ON public.list_invites
FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete invites" ON public.list_invites;
CREATE POLICY "Allow authenticated users to delete invites"
ON public.list_invites
FOR DELETE
USING (auth.role() = 'authenticated');
