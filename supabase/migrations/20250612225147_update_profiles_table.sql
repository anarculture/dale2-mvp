-- This migration updates the existing 'profiles' table to a more robust schema.

-- Drop dependent functions and triggers first to avoid errors during table alteration.
DROP TRIGGER if exists on_auth_user_updated on auth.users;
DROP FUNCTION if exists public.handle_user_update();
DROP TRIGGER if exists on_auth_user_created on auth.users;
DROP FUNCTION if exists public.handle_new_user();

-- Alter the profiles table to add new columns and modify existing ones.
ALTER TABLE public.profiles
  RENAME COLUMN name TO full_name;

ALTER TABLE public.profiles
  RENAME COLUMN avatar_url TO photo_url;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS birth_date,
  DROP COLUMN IF EXISTS email_confirmed_at,
  DROP COLUMN IF EXISTS phone_confirmed_at,
  ADD COLUMN phone_number TEXT,
  ADD COLUMN email TEXT,
  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN id_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  ADD COLUMN total_reviews INTEGER NOT NULL DEFAULT 0;


-- Recreate the function to handle new user creation with the updated schema.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, photo_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'photo_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger for new users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Recreate the function to handle user updates with the updated schema.
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    full_name = new.raw_user_meta_data->>'full_name',
    photo_url = new.raw_user_meta_data->>'photo_url',
    email = new.email,
    email_verified = (new.email_confirmed_at IS NOT NULL),
    phone_verified = (new.phone_confirmed_at IS NOT NULL)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger for user updates.
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();

-- One-time backfill to populate new/changed columns for existing users.
UPDATE public.profiles p
SET
  full_name = COALESCE(u.raw_user_meta_data->>'full_name', p.full_name),
  photo_url = COALESCE(u.raw_user_meta_data->>'photo_url', p.photo_url),
  email = u.email,
  email_verified = (u.email_confirmed_at IS NOT NULL),
  phone_verified = (u.phone_confirmed_at IS NOT NULL)
FROM auth.users u
WHERE p.id = u.id;
