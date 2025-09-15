-- URGENT: Create missing tables first
-- Execute this BEFORE any other migration scripts
-- This creates the basic table structure that the system needs

-- ========================================
-- CREATE CRM_CLIENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS crm_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    client_code VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'client', 'inactive')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    document TEXT,
    notes TEXT,
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    property_type VARCHAR(50) CHECK (property_type IN ('apartment', 'house', 'commercial', 'land', 'other')),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('buy', 'rent', 'sell')),
    urgency VARCHAR(20) CHECK (urgency IN ('low', 'medium', 'high')),
    source VARCHAR(50) CHECK (source IN ('website', 'referral', 'social_media', 'phone', 'walk_in')),
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    assigned_to UUID, -- References auth.users(id) but no FK constraint to avoid issues
    created_by UUID,  -- References auth.users(id) but no FK constraint to avoid issues
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- CREATE CRM_TASKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID, -- References auth.users(id) but no FK constraint
    client_id UUID,   -- References crm_clients(id) but no FK constraint to avoid issues
    property_id UUID, -- For future property integration
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- References auth.users(id) but no FK constraint
    task_type VARCHAR(20) DEFAULT 'internal' CHECK (task_type IN ('internal', 'client', 'team')),
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'shared')),
    category VARCHAR(50) CHECK (category IN ('follow_up', 'property_visit', 'document_review', 'contract', 'marketing', 'administrative', 'other')),
    estimated_duration INTEGER, -- Duration in minutes
    reminders JSONB DEFAULT '[]'::jsonb
);

-- ========================================
-- CREATE BASIC INDEXES FOR PERFORMANCE
-- ========================================

-- Indexes for crm_clients
CREATE INDEX IF NOT EXISTS idx_crm_clients_status ON crm_clients(status);
CREATE INDEX IF NOT EXISTS idx_crm_clients_priority ON crm_clients(priority);
CREATE INDEX IF NOT EXISTS idx_crm_clients_client_code ON crm_clients(client_code);
CREATE INDEX IF NOT EXISTS idx_crm_clients_email ON crm_clients(email);
CREATE INDEX IF NOT EXISTS idx_crm_clients_phone ON crm_clients(phone);
CREATE INDEX IF NOT EXISTS idx_crm_clients_assigned_to ON crm_clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_clients_created_at ON crm_clients(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_clients_next_follow_up ON crm_clients(next_follow_up);

-- Indexes for crm_tasks
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_priority ON crm_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_client_id ON crm_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_task_type ON crm_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_visibility ON crm_tasks(visibility);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_at ON crm_tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_category ON crm_tasks(category);

-- ========================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to auto-update updated_at
CREATE TRIGGER IF NOT EXISTS update_crm_clients_updated_at
    BEFORE UPDATE ON crm_clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_crm_tasks_updated_at
    BEFORE UPDATE ON crm_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DISABLE RLS AND SET PERMISSIVE PERMISSIONS
-- ========================================

-- Disable RLS completely for development
ALTER TABLE crm_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to authenticated users
GRANT ALL PRIVILEGES ON crm_clients TO authenticated;
GRANT ALL PRIVILEGES ON crm_tasks TO authenticated;
GRANT ALL PRIVILEGES ON crm_clients TO anon;
GRANT ALL PRIVILEGES ON crm_tasks TO anon;

-- Grant all permissions to service_role
GRANT ALL PRIVILEGES ON crm_clients TO service_role;
GRANT ALL PRIVILEGES ON crm_tasks TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ========================================
-- INSERT SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample clients (will be ignored if they already exist)
INSERT INTO crm_clients (name, email, phone, client_code, status, priority) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-1111', 'LDJO24001', 'lead', 'high'),
('Maria Santos', 'maria.santos@email.com', '(11) 88888-2222', 'PRMA24002', 'prospect', 'medium'),
('Carlos Oliveira', 'carlos.oliveira@email.com', '(11) 77777-3333', 'CLCA24003', 'client', 'low')
ON CONFLICT (client_code) DO NOTHING;

-- Insert sample tasks
INSERT INTO crm_tasks (title, description, priority, status, task_type, visibility, category) VALUES
('Follow-up com João Silva', 'Entrar em contato para apresentar novas opções', 'high', 'pending', 'client', 'shared', 'follow_up'),
('Preparar apresentação de imóveis', 'Selecionar 5 imóveis que atendem ao perfil da Maria', 'medium', 'in_progress', 'internal', 'private', 'administrative'),
('Revisão de contrato - Carlos', 'Revisar contrato de compra antes da assinatura', 'high', 'pending', 'client', 'shared', 'contract')
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if tables were created successfully
SELECT
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks')
ORDER BY tablename;

-- Count records in each table
SELECT 'crm_clients' as table_name, COUNT(*) as record_count FROM crm_clients
UNION ALL
SELECT 'crm_tasks' as table_name, COUNT(*) as record_count FROM crm_tasks;

-- Check RLS status (should show disabled)
SELECT
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled",
    forcerowsecurity as "Force RLS"
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks');

-- Success message
SELECT 'SUCCESS: Tables created and configured successfully!' as status;