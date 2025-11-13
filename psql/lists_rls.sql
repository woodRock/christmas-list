-- Enable RLS on the lists table
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can see lists they own or are a member of
DROP POLICY IF EXISTS "Users can view their own lists or lists they are a member of" ON public.lists;
CREATE POLICY "Users can view their own lists or lists they are a member of"
ON public.lists
FOR SELECT
USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1
    FROM public.list_members
    WHERE list_id = lists.id AND profile_id = auth.uid()
  )
);

-- Policy for INSERT: Authenticated users can create their own lists
DROP POLICY IF EXISTS "Authenticated users can create their own lists" ON public.lists;
CREATE POLICY "Authenticated users can create their own lists"
ON public.lists
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy for UPDATE: Only list owners can update their lists
DROP POLICY IF EXISTS "Only list owners can update their lists" ON public.lists;
CREATE POLICY "Only list owners can update their lists"
ON public.lists
FOR UPDATE
USING (user_id = auth.uid());

-- Policy for DELETE: Only list owners can delete their lists
DROP POLICY IF EXISTS "Only list owners can delete their lists" ON public.lists;
CREATE POLICY "Only list owners can delete their lists"
ON public.lists
FOR DELETE
USING (user_id = auth.uid());
