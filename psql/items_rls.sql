-- Enable RLS on the items table
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view items on lists they own or are a member of
DROP POLICY IF EXISTS "Users can view items on their lists or lists they are a member of" ON public.items;
CREATE POLICY "Users can view items on their lists or lists they are a member of"
ON public.items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.lists
    WHERE lists.id = items.list_id AND lists.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM public.list_members
    WHERE list_members.list_id = items.list_id AND list_members.profile_id = auth.uid()
  )
);

-- Policy for INSERT: Authenticated users can add items to lists they own or are a member of
DROP POLICY IF EXISTS "Authenticated users can add items to their lists or lists they are a member of" ON public.items;
CREATE POLICY "Authenticated users can add items to their lists or lists they are a member of"
ON public.items
FOR INSERT
WITH CHECK (
  items.user_id = auth.uid() AND (
    EXISTS (
      SELECT 1
      FROM public.lists
      WHERE lists.id = items.list_id AND lists.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1
      FROM public.list_members
      WHERE list_members.list_id = items.list_id AND list_members.profile_id = auth.uid()
    )
  )
);

-- Policy for UPDATE: Users can update their own items or claim/unclaim any item on a list they are a member of
DROP POLICY IF EXISTS "Users can update their own items or claim/unclaim items on lists they are a member of" ON public.items;
CREATE POLICY "Users can update their own items or claim/unclaim items on lists they are a member of"
ON public.items
FOR UPDATE
USING (
  items.user_id = auth.uid() OR ( -- User can update their own item
    EXISTS ( -- User is a member of the list
      SELECT 1
      FROM public.list_members
      WHERE list_members.list_id = items.list_id AND list_members.profile_id = auth.uid()
    )
  )
);

-- Policy for DELETE: Only list owners can delete any item, or users can delete their own items
DROP POLICY IF EXISTS "List owners can delete any item, or users can delete their own items" ON public.items;
CREATE POLICY "List owners can delete any item, or users can delete their own items"
ON public.items
FOR DELETE
USING (
  EXISTS ( -- User is the owner of the list
    SELECT 1
    FROM public.lists
    WHERE lists.id = items.list_id AND lists.user_id = auth.uid()
  ) OR items.user_id = auth.uid() -- User can delete their own item
);
