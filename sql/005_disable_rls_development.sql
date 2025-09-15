-- EMERGENCY FIX: Disable RLS completely for development
-- This script removes all RLS restrictions to allow normal database operations
-- Use this if the permissive policies in 004_fix_rls_policies.sql still cause issues

-- ========================================
-- DISABLE RLS COMPLETELY ON ALL TABLES
-- ========================================

-- Disable RLS on CRM tables
ALTER TABLE IF EXISTS crm_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS crm_tasks DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables that might be causing issues
ALTER TABLE IF EXISTS leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS migrations DISABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP ALL EXISTING POLICIES
-- ========================================

-- Drop all policies from crm_clients
DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'crm_clients'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON crm_clients';
    END LOOP;
END $$;

-- Drop all policies from crm_tasks
DO $$
DECLARE
    pol_name TEXT;
BEGIN
    FOR pol_name IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'crm_tasks'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON crm_tasks';
    END LOOP;
END $$;

-- ========================================
-- ENSURE PROPER PERMISSIONS
-- ========================================

-- Grant all permissions to authenticated users
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant all permissions to anon users (for public operations)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all permissions to service_role (for admin operations)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ========================================
-- CREATE TABLES IF THEY DON'T EXIST (WITHOUT RLS)
-- ========================================

-- Ensure crm_clients table exists and is accessible
CREATE TABLE IF NOT EXISTS crm_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    client_code VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'lead',
    priority VARCHAR(20) DEFAULT 'medium',
    document TEXT,
    notes TEXT,
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    property_type VARCHAR(50),
    transaction_type VARCHAR(20),
    urgency VARCHAR(20),
    source VARCHAR(50),
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    assigned_to UUID,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure crm_tasks table exists and is accessible
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to UUID,
    client_id UUID,
    property_id UUID,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    task_type VARCHAR(20) DEFAULT 'internal',
    visibility VARCHAR(20) DEFAULT 'private',
    category VARCHAR(50),
    estimated_duration INTEGER,
    reminders JSONB DEFAULT '[]'::jsonb
);

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Create indexes on crm_clients
CREATE INDEX IF NOT EXISTS idx_crm_clients_status ON crm_clients(status);
CREATE INDEX IF NOT EXISTS idx_crm_clients_priority ON crm_clients(priority);
CREATE INDEX IF NOT EXISTS idx_crm_clients_client_code ON crm_clients(client_code);
CREATE INDEX IF NOT EXISTS idx_crm_clients_assigned_to ON crm_clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_clients_created_at ON crm_clients(created_at);

-- Create indexes on crm_tasks
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_client_id ON crm_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_priority ON crm_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_task_type ON crm_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_at ON crm_tasks(created_at);

-- ========================================
-- VERIFICATION AND TEST
-- ========================================

-- Test basic operations
INSERT INTO crm_clients (name, email, phone, status)
VALUES ('Teste Cliente', 'teste@email.com', '11999999999', 'lead')
ON CONFLICT (email) DO NOTHING;

INSERT INTO crm_tasks (title, description, priority, status)
VALUES ('Teste Tarefa', 'Descrição de teste', 'medium', 'pending')
ON CONFLICT DO NOTHING;

-- Show table permissions
SELECT
    grantee,
    privilege_type,
    table_name
FROM information_schema.table_privileges
WHERE table_name IN ('crm_clients', 'crm_tasks')
ORDER BY table_name, grantee, privilege_type;

-- Show RLS status (should be disabled)
SELECT
    tablename,
    rowsecurity as "RLS Enabled",
    forcerowsecurity as "Force RLS"
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks');

-- Success message
SELECT 'RLS has been disabled and tables are now accessible' as status;