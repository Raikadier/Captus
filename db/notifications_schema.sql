-- Add new columns to existing notifications table
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS entity_id TEXT;

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  whatsapp_enabled boolean DEFAULT false,
  email text,
  whatsapp text,
  quiet_hours jsonb DEFAULT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create notification_logs table to prevent duplicates
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  entity_id text,
  sent_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_type, entity_id)
);
