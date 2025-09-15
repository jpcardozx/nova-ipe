-- Update crm_clients table structure to match the enhanced CRM interface
-- This migration ensures the table structure matches our TypeScript interfaces

-- Add missing columns if they don't exist
ALTER TABLE crm_clients
ADD COLUMN IF NOT EXISTS budget_min DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS budget_max DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) CHECK (property_type IN ('apartment', 'house', 'commercial', 'land', 'other')),
ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(20) CHECK (transaction_type IN ('buy', 'rent', 'sell')),
ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) CHECK (urgency IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS source VARCHAR(50) CHECK (source IN ('website', 'referral', 'social_media', 'phone', 'walk_in')),
ADD COLUMN IF NOT EXISTS last_contact TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100),
ADD COLUMN IF NOT EXISTS document TEXT, -- Simplified document field
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update priority column if it doesn't match our enum
ALTER TABLE crm_clients
ALTER COLUMN priority TYPE VARCHAR(20),
ADD CONSTRAINT check_priority CHECK (priority IN ('low', 'medium', 'high'));

-- Update status column to match our interface
ALTER TABLE crm_clients
ALTER COLUMN status TYPE VARCHAR(20),
ADD CONSTRAINT check_status CHECK (status IN ('lead', 'prospect', 'client', 'inactive'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crm_clients_status ON crm_clients(status);
CREATE INDEX IF NOT EXISTS idx_crm_clients_priority ON crm_clients(priority);
CREATE INDEX IF NOT EXISTS idx_crm_clients_assigned_to ON crm_clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_clients_created_by ON crm_clients(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_clients_source ON crm_clients(source);
CREATE INDEX IF NOT EXISTS idx_crm_clients_property_type ON crm_clients(property_type);
CREATE INDEX IF NOT EXISTS idx_crm_clients_transaction_type ON crm_clients(transaction_type);
CREATE INDEX IF NOT EXISTS idx_crm_clients_next_follow_up ON crm_clients(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_crm_clients_created_at ON crm_clients(created_at);

-- Create or update the updated_at trigger for clients
CREATE TRIGGER update_crm_clients_updated_at
    BEFORE UPDATE ON crm_clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN crm_clients.client_code IS 'Internal client code for commercial control (not visible to clients)';
COMMENT ON COLUMN crm_clients.budget_min IS 'Minimum budget range for property search';
COMMENT ON COLUMN crm_clients.budget_max IS 'Maximum budget range for property search';
COMMENT ON COLUMN crm_clients.property_type IS 'Type of property the client is interested in';
COMMENT ON COLUMN crm_clients.transaction_type IS 'Type of transaction: buy, rent, or sell';
COMMENT ON COLUMN crm_clients.urgency IS 'How urgent is the client need';
COMMENT ON COLUMN crm_clients.last_contact IS 'Date of last contact with client';
COMMENT ON COLUMN crm_clients.next_follow_up IS 'Scheduled date for next follow-up';
COMMENT ON COLUMN crm_clients.assigned_to IS 'Real estate agent assigned to this client';
COMMENT ON COLUMN crm_clients.created_by IS 'User who created this client record';

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
-- Users can see clients assigned to them or created by them
CREATE POLICY "Users can view assigned clients" ON crm_clients
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        created_by = auth.uid()
    );

-- Users can create client records
CREATE POLICY "Users can create clients" ON crm_clients
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update clients assigned to them or created by them
CREATE POLICY "Users can update assigned clients" ON crm_clients
    FOR UPDATE USING (
        assigned_to = auth.uid() OR
        created_by = auth.uid()
    );

-- Users can delete clients they created
CREATE POLICY "Users can delete own clients" ON crm_clients
    FOR DELETE USING (created_by = auth.uid());