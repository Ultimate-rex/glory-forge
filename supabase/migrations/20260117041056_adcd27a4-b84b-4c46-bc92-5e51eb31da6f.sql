-- Remove overly permissive INSERT policies - trigger uses SECURITY DEFINER which bypasses RLS
DROP POLICY IF EXISTS "Allow service role insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role insert user_roles" ON public.user_roles;