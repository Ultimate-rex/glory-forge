-- Drop existing INSERT policy if any, then create for profiles
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can assign themselves user role" ON public.user_roles;
END $$;

-- Allow trigger (SECURITY DEFINER) to insert into profiles table
CREATE POLICY "Allow service role insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Allow trigger (SECURITY DEFINER) to insert into user_roles table
CREATE POLICY "Allow service role insert user_roles"
ON public.user_roles
FOR INSERT
WITH CHECK (true);