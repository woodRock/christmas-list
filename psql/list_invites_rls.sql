-- Enable RLS on the list_invites table
ALTER TABLE public.list_invites ENABLE ROW LEVEL SECURITY;

-- Policy for INSERT: Allow members to create invites (existing policy, re-added for completeness)
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

-- Policy for SELECT: Allow authenticated users to read invites (existing policy, re-added for completeness)
-- This policy is broad to allow invite link validation. For managing invites, a more restrictive policy would be needed.
DROP POLICY IF EXISTS "Allow authenticated users to read invites" ON public.list_invites;
CREATE POLICY "Allow authenticated users to read invites"
ON public.list_invites
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy for DELETE: Only list owners or the user who generated the invite can delete it
DROP POLICY IF EXISTS "Only list owners or invite generator can delete invites" ON public.list_invites;
CREATE POLICY "Only list owners or invite generator can delete invites"
ON public.list_invites
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.lists
    WHERE lists.id = list_invites.list_id AND lists.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM public.list_members
    WHERE list_members.list_id = list_invites.list_id AND list_members.profile_id = auth.uid()
  ) -- Assuming the invite generator is a member of the list
);
