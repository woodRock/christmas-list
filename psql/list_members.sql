CREATE TABLE IF NOT EXISTS public.list_members (
  list_id uuid not null references public.lists(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member' not null, -- e.g., 'owner', 'member', 'admin'
  primary key (list_id, profile_id)
);

DROP POLICY IF EXISTS "Temp allow all reads" ON public.list_members;
CREATE POLICY "Temp allow all reads"
ON public.list_members
FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to join lists" ON public.list_members;
CREATE POLICY "Allow authenticated users to join lists"
ON public.list_members
FOR INSERT
WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Allow list owners to remove members" ON public.list_members;
CREATE POLICY "Allow list owners to remove members"
ON public.list_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM lists
    WHERE
      lists.id = list_members.list_id AND
      lists.user_id = auth.uid()
  )
);
