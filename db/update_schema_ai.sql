-- Migration script for AI System (Events and Notifications)
-- Run this in your Supabase SQL Editor

-- 1. Create Events table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS for Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can view their own events'
    ) THEN
        CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can insert their own events'
    ) THEN
        CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can update their own events'
    ) THEN
        CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can delete their own events'
    ) THEN
        CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Notifications Table Check
-- The 'notifications' table should already exist based on the project schema.
-- Columns expected: id, user_id, title, body, type, read
-- If it does NOT exist, you can uncomment the following block:

/*
CREATE TABLE IF NOT EXISTS notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  body text,
  type text DEFAULT 'task',
  created_at timestamp with time zone DEFAULT now(),
  read boolean DEFAULT false,
  related_task uuid,
  PRIMARY KEY (id)
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
*/
