-- Update default credits to 0 for new users
ALTER TABLE public.profiles ALTER COLUMN basic_credits SET DEFAULT 0;
ALTER TABLE public.profiles ALTER COLUMN premium_credits SET DEFAULT 0;

-- Update the handle_new_user function to set credits to 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, email, basic_credits, premium_credits)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email), NEW.email, 0, 0);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;