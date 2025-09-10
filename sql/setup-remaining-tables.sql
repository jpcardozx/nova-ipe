-- =====================================================
-- SCRIPT COMPLEMENTAR - TABELAS RESTANTES
-- =====================================================
-- Este script adiciona as tabelas que faltam para completar o dashboard

-- 1. CONTRATOS E DOCUMENTOS
-- ==========================

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    property_id UUID REFERENCES properties(id) NOT NULL,
    client_id UUID REFERENCES crm_clients(id) NOT NULL,
    contract_type VARCHAR(20) NOT NULL CHECK (contract_type IN ('venda', 'aluguel', 'reserva')),
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'assinado', 'cancelado', 'concluido')),
    
    -- Valores
    total_value DECIMAL(15, 2) NOT NULL,
    down_payment DECIMAL(15, 2),
    monthly_payment DECIMAL(10, 2),
    commission_percentage DECIMAL(5, 2),
    commission_value DECIMAL(15, 2),
    
    -- Datas
    start_date DATE,
    end_date DATE,
    signature_date DATE,
    
    -- Documentos
    contract_url TEXT,
    signed_contract_url TEXT,
    
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Assinaturas Digitais
CREATE TABLE IF NOT EXISTS contract_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) NOT NULL,
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signer_type VARCHAR(20) NOT NULL CHECK (signer_type IN ('cliente', 'proprietario', 'corretor', 'testemunha')),
    signature_url TEXT,
    signed_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GESTÃO FINANCEIRA
-- =====================

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id),
    client_id UUID REFERENCES crm_clients(id),
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('entrada', 'parcela', 'comissao', 'taxa', 'multa')),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
    
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_method VARCHAR(50), -- dinheiro, cartao, pix, transferencia, etc
    
    description TEXT,
    receipt_url TEXT,
    notes TEXT,
    
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Faturas
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES crm_clients(id),
    contract_id UUID REFERENCES contracts(id),
    
    total_amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'atrasada', 'cancelada')),
    
    invoice_url TEXT,
    notes TEXT,
    
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USUÁRIOS E PERMISSÕES
-- =========================

-- Tabela de Usuários do Sistema
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    role VARCHAR(20) DEFAULT 'corretor' CHECK (role IN ('admin', 'gerente', 'corretor', 'assistente')),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Permissões
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    resource VARCHAR(100), -- properties, clients, contracts, etc
    action VARCHAR(50), -- create, read, update, delete, manage
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. IMAGENS E CARACTERÍSTICAS DOS IMÓVEIS
-- =========================================

-- Tabela de Imagens dos Imóveis
CREATE TABLE IF NOT EXISTS property_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Características dos Imóveis
CREATE TABLE IF NOT EXISTS property_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255),
    category VARCHAR(50) DEFAULT 'geral', -- geral, lazer, seguranca, etc
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTATOS E HISTÓRICO DOS CLIENTES
-- =====================================

-- Tabela de Contatos dos Clientes
CREATE TABLE IF NOT EXISTS client_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
    contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('telefone', 'celular', 'email', 'whatsapp')),
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Histórico dos Clientes
CREATE TABLE IF NOT EXISTS client_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- call, email, meeting, visit, etc
    description TEXT NOT NULL,
    interaction_date TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER,
    outcome VARCHAR(100),
    next_action TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANALYTICS E RELATÓRIOS
-- ==========================

-- Tabela de Eventos para Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    
    properties JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Métricas do Dashboard
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- count, sum, avg, percentage, etc
    period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
    period_date DATE NOT NULL,
    
    filters JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(metric_name, period_type, period_date)
);

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- sales, leads, properties, financial, etc
    
    query_config JSONB NOT NULL, -- configuração da query/filtros
    chart_config JSONB DEFAULT '{}', -- configuração dos gráficos
    
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ÍNDICES PARA PERFORMANCE
-- ============================

-- Índices para Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_property_id ON contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_type ON contracts(contract_type);

-- Índices para Payments
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- Índices para Property Images
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_is_cover ON property_images(is_cover);

-- Índices para Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- 8. TRIGGERS PARA UPDATED_AT
-- ============================

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. RLS (ROW LEVEL SECURITY)
-- ============================

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de exemplo
CREATE POLICY "Users can view contracts they created" ON contracts FOR SELECT USING (auth.uid()::text = created_by::text);
CREATE POLICY "Users can create contracts" ON contracts FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

-- 10. DADOS INICIAIS
-- ===================

-- Inserir métricas iniciais do dashboard
INSERT INTO dashboard_metrics (metric_name, metric_value, metric_type, period_type, period_date) VALUES
('total_properties', 0, 'count', 'daily', CURRENT_DATE),
('total_clients', 0, 'count', 'daily', CURRENT_DATE),
('total_contracts', 0, 'count', 'daily', CURRENT_DATE),
('monthly_revenue', 0, 'sum', 'monthly', DATE_TRUNC('month', CURRENT_DATE)::date),
('pending_visits', 0, 'count', 'daily', CURRENT_DATE),
('completed_sales', 0, 'count', 'monthly', DATE_TRUNC('month', CURRENT_DATE)::date)
ON CONFLICT (metric_name, period_type, period_date) DO NOTHING;

-- =====================================================
-- TABELAS COMPLEMENTARES CRIADAS COM SUCESSO!
-- =====================================================
-- Agora o dashboard tem todas as funcionalidades necessárias:
-- ✅ Gestão completa de CRM
-- ✅ Sistema de tarefas e calendário
-- ✅ Gestão de imóveis com imagens e características
-- ✅ Contratos e assinaturas digitais
-- ✅ Sistema financeiro completo
-- ✅ Analytics e relatórios
-- ✅ Permissões e usuários
-- =====================================================
