-- Enable RLS on the list_members table
ALTER TABLE public.list_members ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view list_members for lists they own or are a member of
DROP POLICY IF EXISTS "Users can view list_members for lists they own or are a member of" ON public.list_members;
CREATE POLICY "Users can view list_members for lists they own or are a member of"
ON public.list_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.lists
    WHERE lists.id = list_members.list_id AND lists.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM public.list_members lm_self
    WHERE lm_self.list_id = list_members.list_id AND lm_self.profile_id = auth.uid()
  )
);

-- Policy for INSERT: Allow authenticated users to join lists (existing policy, re-added for completeness)
DROP POLICY IF EXISTS "Allow authenticated users to join lists" ON public.list_members;
CREATE POLICY "Allow authenticated users to join lists"
ON public.list_members
FOR INSERT
WITH CHECK (auth.uid() = profile_id);

-- Policy for DELETE: Allow list owners to remove members (existing policy, re-added for completeness)
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
