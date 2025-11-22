-- Migration to add 'role' column to public.users table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role text DEFAULT 'student' CHECK (role IN ('student', 'teacher'));

-- Optional: Create a trigger to sync automatically on new auth.users creation (Advanced)
-- For now, the application handles it via the /sync endpoint.
