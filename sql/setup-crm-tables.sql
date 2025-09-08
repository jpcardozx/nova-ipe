-- Configuração do CRM para Supabase
-- Execute estes comandos no SQL Editor do Supabase

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS crm_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    cpf_cnpj VARCHAR(20),
    address JSONB,
    status VARCHAR(50) DEFAULT 'active',
    lead_source VARCHAR(100),
    assigned_to UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Imóveis
CREATE TABLE IF NOT EXISTS crm_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    price DECIMAL(12,2),
    address JSONB,
    features JSONB,
    images JSONB,
    owner_id UUID REFERENCES crm_clients(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Interações/Atividades
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID REFERENCES crm_properties(id),
    activity_type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Documentos
CREATE TABLE IF NOT EXISTS crm_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID REFERENCES crm_properties(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    document_type VARCHAR(100),
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Propostas/Negociações
CREATE TABLE IF NOT EXISTS crm_deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID REFERENCES crm_properties(id),
    deal_type VARCHAR(50), -- 'sale' ou 'rent'
    proposed_price DECIMAL(12,2),
    final_price DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'negotiating',
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(12,2),
    closing_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON crm_clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON crm_clients(status);
CREATE INDEX IF NOT EXISTS idx_properties_status ON crm_properties(status);
CREATE INDEX IF NOT EXISTS idx_activities_client ON crm_activities(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON crm_activities(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_documents_client ON crm_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON crm_deals(status);

-- 7. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_clients_updated_at BEFORE UPDATE ON crm_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_properties_updated_at BEFORE UPDATE ON crm_properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at BEFORE UPDATE ON crm_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_deals_updated_at BEFORE UPDATE ON crm_deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS (Row Level Security) - Adicione depois de configurar auth
-- ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
