-- Add parent_task_id column to tasks table to support subtasks structure
-- This fixes the error: "column tasks.parent_task_id does not exist"

ALTER TABLE public.tasks
ADD COLUMN parent_task_id integer REFERENCES public.tasks(id) ON DELETE CASCADE;
