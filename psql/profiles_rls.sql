-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view their own profile or profiles of members on shared lists
DROP POLICY IF EXISTS "Users can view their own profile or profiles of members on shared lists" ON public.profiles;
CREATE POLICY "Users can view their own profile or profiles of members on shared lists"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid() OR EXISTS (
    SELECT 1
    FROM public.list_members lm1
    JOIN public.list_members lm2 ON lm1.list_id = lm2.list_id
    WHERE lm1.profile_id = auth.uid() AND lm2.profile_id = profiles.id
  )
);

-- Policy for INSERT: Authenticated users can create their own profile
DROP POLICY IF EXISTS "Authenticated users can create their own profile" ON public.profiles;
CREATE POLICY "Authenticated users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- Policy for UPDATE: Users can only update their own profile
DROP POLICY IF EXISTS "Users can only update their own profile" ON public.profiles;
CREATE POLICY "Users can only update their own profile"
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

-- Policy for DELETE: Users can only delete their own profile
DROP POLICY IF EXISTS "Users can only delete their own profile" ON public.profiles;
CREATE POLICY "Users can only delete their own profile"
ON public.profiles
FOR DELETE
USING (id = auth.uid());
