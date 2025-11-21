-- Migration script for Subjects and Study Sessions
-- Run this in your Supabase SQL Editor

-- 1. Create Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    grade NUMERIC(4, 2) DEFAULT 0.00, -- e.g., 9.50
    progress INTEGER DEFAULT 0, -- 0 to 100
    color VARCHAR(50) DEFAULT 'blue', -- blue, red, green, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Study Sessions table (for hours tracking)
CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- 3. Add subject_id to Tasks table (optional link)
-- We use DO block to check if column exists to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='subject_id') THEN
        ALTER TABLE tasks ADD COLUMN subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for subjects
CREATE POLICY "Users can view their own subjects" ON subjects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects" ON subjects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" ON subjects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" ON subjects
    FOR DELETE USING (auth.uid() = user_id);

-- Policy for study_sessions
CREATE POLICY "Users can view their own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" ON study_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" ON study_sessions
    FOR DELETE USING (auth.uid() = user_id);
