-- Create or update the crm_tasks table with new fields for enhanced task management
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES auth.users(id),
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    property_id UUID, -- References to property management system
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),

    -- New enhanced fields for better task management
    task_type VARCHAR(20) DEFAULT 'internal' CHECK (task_type IN ('internal', 'client', 'team')),
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'shared')),
    category VARCHAR(50) CHECK (category IN ('follow_up', 'property_visit', 'document_review', 'contract', 'marketing', 'administrative', 'other')),
    estimated_duration INTEGER, -- Duration in minutes
    reminders JSONB DEFAULT '[]'::jsonb -- Array of reminder timestamps
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_client_id ON crm_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_priority ON crm_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_task_type ON crm_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_visibility ON crm_tasks(visibility);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_at ON crm_tasks(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_crm_tasks_updated_at
    BEFORE UPDATE ON crm_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE crm_tasks IS 'Enhanced task management table with client assignment and visibility controls';
COMMENT ON COLUMN crm_tasks.task_type IS 'Type of task: internal (personal/admin), client (client-related), team (collaborative)';
COMMENT ON COLUMN crm_tasks.visibility IS 'Visibility control: private (only creator sees), shared (team sees)';
COMMENT ON COLUMN crm_tasks.category IS 'Task category for better organization and filtering';
COMMENT ON COLUMN crm_tasks.estimated_duration IS 'Estimated duration in minutes for time management';
COMMENT ON COLUMN crm_tasks.reminders IS 'JSON array of reminder timestamps for notifications';

-- Enable Row Level Security (RLS)
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security
-- Users can see their own tasks and shared tasks assigned to them
CREATE POLICY "Users can view own and shared tasks" ON crm_tasks
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        created_by = auth.uid() OR
        (visibility = 'shared' AND assigned_to = auth.uid())
    );

-- Users can insert their own tasks
CREATE POLICY "Users can create tasks" ON crm_tasks
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update their own tasks or tasks assigned to them
CREATE POLICY "Users can update own tasks" ON crm_tasks
    FOR UPDATE USING (
        assigned_to = auth.uid() OR
        created_by = auth.uid()
    );

-- Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" ON crm_tasks
    FOR DELETE USING (created_by = auth.uid());