-- Ultimate Focus App - Add Projects Feature
-- Migration: 002_add_projects.sql
-- Created: 2024-01-15
-- Description: Add projects table and update tasks/sessions to support projects

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#4F46E5',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
    estimated_pomodoros INTEGER NOT NULL DEFAULT 0,
    completed_pomodoros INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    CONSTRAINT valid_pomodoros CHECK (completed_pomodoros <= estimated_pomodoros)
);

-- Update tasks table to include project relationship and pomodoro tracking
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS estimated_pomodoros INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_pomodoros INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- Add constraint for tasks (drop first if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_task_pomodoros' 
        AND table_name = 'tasks'
    ) THEN
        ALTER TABLE public.tasks ADD CONSTRAINT valid_task_pomodoros CHECK (completed_pomodoros <= estimated_pomodoros);
    END IF;
END $$;

-- Update sessions table to include task and project relationships
ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL;

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_project ON public.tasks(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_task_id ON public.sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_sessions_project_id ON public.sessions(project_id);

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for project statistics
CREATE OR REPLACE VIEW public.project_stats AS
SELECT 
    p.id,
    p.name,
    p.estimated_pomodoros,
    p.completed_pomodoros,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_tasks,
    COALESCE(SUM(t.estimated_pomodoros), 0) as total_estimated_pomodoros,
    COALESCE(SUM(t.completed_pomodoros), 0) as total_completed_pomodoros,
    COUNT(s.id) as total_sessions,
    COALESCE(SUM(s.duration), 0) as total_focus_time
FROM public.projects p
LEFT JOIN public.tasks t ON p.id = t.project_id
LEFT JOIN public.sessions s ON p.id = s.project_id
GROUP BY p.id, p.name, p.estimated_pomodoros, p.completed_pomodoros;

-- Grant access to the view
GRANT SELECT ON public.project_stats TO authenticated;

-- Create function to update project completed pomodoros when task is updated
CREATE OR REPLACE FUNCTION update_project_pomodoros()
RETURNS TRIGGER AS $$
BEGIN
    -- Update project's completed pomodoros based on sum of task completed pomodoros
    IF NEW.project_id IS NOT NULL THEN
        UPDATE public.projects
        SET completed_pomodoros = (
            SELECT COALESCE(SUM(completed_pomodoros), 0)
            FROM public.tasks
            WHERE project_id = NEW.project_id AND completed = true
        )
        WHERE id = NEW.project_id;
    END IF;
    
    -- Also update if project_id changed from old to new
    IF OLD.project_id IS NOT NULL AND OLD.project_id != NEW.project_id THEN
        UPDATE public.projects
        SET completed_pomodoros = (
            SELECT COALESCE(SUM(completed_pomodoros), 0)
            FROM public.tasks
            WHERE project_id = OLD.project_id AND completed = true
        )
        WHERE id = OLD.project_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating project pomodoros
CREATE TRIGGER update_project_pomodoros_trigger
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_project_pomodoros();