CREATE TABLE IF NOT EXISTS diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_course_id ON diagrams(course_id);

-- Policy setup (if RLS is enabled)
-- Assuming the backend handles authorization via middleware, but RLS is good practice.
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagrams" ON diagrams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagrams" ON diagrams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagrams" ON diagrams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagrams" ON diagrams
  FOR DELETE USING (auth.uid() = user_id);
