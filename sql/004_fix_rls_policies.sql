-- Fix Row Level Security policies that are blocking database operations
-- This script removes overly restrictive policies and creates more permissive ones

-- ========================================
-- DISABLE RLS TEMPORARILY FOR SETUP
-- ========================================
ALTER TABLE crm_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks DISABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP ALL EXISTING POLICIES
-- ========================================

-- Drop existing policies for crm_clients
DROP POLICY IF EXISTS "Users can view assigned clients" ON crm_clients;
DROP POLICY IF EXISTS "Users can create clients" ON crm_clients;
DROP POLICY IF EXISTS "Users can update assigned clients" ON crm_clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON crm_clients;

-- Drop existing policies for crm_tasks
DROP POLICY IF EXISTS "Users can view own and shared tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON crm_tasks;

-- ========================================
-- CREATE PERMISSIVE POLICIES FOR DEVELOPMENT
-- ========================================

-- Enable RLS back on tables
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CRM_CLIENTS POLICIES - More permissive for development/testing
-- ========================================

-- Allow authenticated users to view all clients (for now)
CREATE POLICY "Authenticated users can view clients" ON crm_clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert clients
CREATE POLICY "Authenticated users can create clients" ON crm_clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update clients
CREATE POLICY "Authenticated users can update clients" ON crm_clients
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete clients (optional, can be removed for production)
CREATE POLICY "Authenticated users can delete clients" ON crm_clients
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- CRM_TASKS POLICIES - More permissive for development/testing
-- ========================================

-- Allow authenticated users to view all tasks (for now)
CREATE POLICY "Authenticated users can view tasks" ON crm_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert tasks
CREATE POLICY "Authenticated users can create tasks" ON crm_tasks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update tasks
CREATE POLICY "Authenticated users can update tasks" ON crm_tasks
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete tasks
CREATE POLICY "Authenticated users can delete tasks" ON crm_tasks
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- ALTERNATIVE: DISABLE RLS COMPLETELY FOR DEVELOPMENT
-- ========================================
-- If the above policies still cause issues, uncomment the lines below
-- to disable RLS completely during development:

-- ALTER TABLE crm_clients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_tasks DISABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE SERVICE ROLE POLICIES (for admin operations)
-- ========================================

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Service role can manage clients" ON crm_clients
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage tasks" ON crm_tasks
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- GRANT NECESSARY PERMISSIONS
-- ========================================

-- Grant usage on auth schema
GRANT USAGE ON SCHEMA auth TO authenticated, anon;

-- Grant select on auth.users for authenticated users (to check auth.uid())
GRANT SELECT ON auth.users TO authenticated;

-- Grant permissions on the tables
GRANT ALL ON crm_clients TO authenticated;
GRANT ALL ON crm_tasks TO authenticated;
GRANT ALL ON crm_clients TO service_role;
GRANT ALL ON crm_tasks TO service_role;

-- Grant usage on sequences (for auto-incrementing ids if needed)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check current policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('crm_clients', 'crm_tasks')
ORDER BY tablename, policyname;

-- Check RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks');

-- Test queries (should work after applying this migration)
-- SELECT COUNT(*) FROM crm_clients;
-- SELECT COUNT(*) FROM crm_tasks;