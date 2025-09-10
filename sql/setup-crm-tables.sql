-- Script SQL para criar tabelas do CRM no Supabase
-- Execute este script no Supabase Dashboard > SQL Editor

-- Criar tabela de clientes (usar nome existente)
CREATE TABLE IF NOT EXISTS crm_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    document VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    source VARCHAR(50) CHECK (source IN ('website', 'referral', 'social_media', 'phone', 'walk_in')),
    status VARCHAR(50) DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'client', 'inactive')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to VARCHAR(255),
    notes TEXT,
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    property_type VARCHAR(50) CHECK (property_type IN ('apartment', 'house', 'commercial', 'land', 'other')),
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('buy', 'rent', 'sell')),
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    property_preferences JSONB,
    last_contact TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_crm_clients_status ON crm_clients(status);
CREATE INDEX IF NOT EXISTS idx_crm_clients_created_at ON crm_clients(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_clients_email ON crm_clients(email);
CREATE INDEX IF NOT EXISTS idx_crm_clients_phone ON crm_clients(phone);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_clients_updated_at 
    BEFORE UPDATE ON crm_clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitir tudo por enquanto - ajustar conforme necessário)
CREATE POLICY "Allow all operations for authenticated users" ON crm_clients
    FOR ALL USING (true);

-- Opcional: Inserir alguns dados de exemplo
INSERT INTO crm_clients (name, email, phone, source, status, priority, budget_min, budget_max, property_type, transaction_type) VALUES
('Maria Silva', 'maria.silva@email.com', '(11) 99999-1234', 'website', 'lead', 'high', 500000, 800000, 'apartment', 'buy'),
('João Santos', 'joao.santos@email.com', '(11) 88888-2222', 'referral', 'prospect', 'medium', 300000, 500000, 'house', 'buy'),
('Ana Costa', 'ana.costa@email.com', '(11) 77777-3333', 'social_media', 'client', 'high', 1000000, 1500000, 'apartment', 'buy')
ON CONFLICT DO NOTHING;
