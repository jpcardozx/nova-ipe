-- =====================================================
-- SCRIPT COMPLETO DE TABELAS PARA DASHBOARD IMOBILIÁRIA
-- =====================================================
-- Este script cria apenas as tabelas que não existem
-- Tabelas existentes: crm_clients, documents, profiles
-- =====================================================

-- 1. GESTÃO DE TAREFAS E CALENDÁRIO
-- ===================================

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) DEFAULT 'geral',
    tags TEXT[],
    due_date TIMESTAMPTZ,
    estimated_duration INTEGER, -- em minutos
    actual_duration INTEGER, -- em minutos
    assigned_to VARCHAR(255),
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID, -- será referenciado quando criarmos properties
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success', 'reminder')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    task_id UUID REFERENCES tasks(id),
    scheduled_for TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Eventos do Calendário
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    event_type VARCHAR(50) DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'visit', 'call', 'deadline', 'other')),
    location VARCHAR(255),
    attendees TEXT[],
    task_id UUID REFERENCES tasks(id),
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID, -- será referenciado quando criarmos properties
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GESTÃO DE IMÓVEIS
-- =====================

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartamento', 'casa', 'terreno', 'comercial', 'rural')),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('venda', 'aluguel', 'ambos')),
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')),
    
    -- Localização
    address TEXT NOT NULL,
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Características
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    garage_spaces INTEGER DEFAULT 0,
    total_area DECIMAL(10, 2), -- m²
    built_area DECIMAL(10, 2), -- m²
    land_area DECIMAL(10, 2), -- m²
    
    -- Preços
    sale_price DECIMAL(15, 2),
    rent_price DECIMAL(10, 2),
    condo_fee DECIMAL(10, 2),
    iptu DECIMAL(10, 2),
    
    -- Dados do proprietário
    owner_id UUID REFERENCES crm_clients(id),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    
    -- Sistema
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 3. GESTÃO DE VISITAS
-- =====================

-- Tabela de Visitas Agendadas
CREATE TABLE IF NOT EXISTS visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) NOT NULL,
    client_id UUID REFERENCES crm_clients(id),
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(50) NOT NULL,
    visitor_email VARCHAR(255),
    scheduled_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada', 'reagendada')),
    notes TEXT,
    feedback TEXT,
    interest_level INTEGER CHECK (interest_level BETWEEN 1 AND 5), -- 1-5 escala de interesse
    assigned_agent UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTRATOS E DOCUMENTOS
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

-- 5. GESTÃO FINANCEIRA
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

-- 6. USUÁRIOS E PERMISSÕES
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

-- 7. ANALYTICS E RELATÓRIOS
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

-- 8. CONTATOS DOS CLIENTES
-- =========================

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

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- =====================================================

-- Índices para Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Índices para Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Índices para Calendar Events
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_date ON calendar_events(end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);

-- Índices para Properties
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_sale_price ON properties(sale_price);
CREATE INDEX IF NOT EXISTS idx_properties_rent_price ON properties(rent_price);

-- Índices para Visits
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_client_id ON visits(client_id);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);

-- Índices para Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_property_id ON contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_type ON contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_contracts_signature_date ON contracts(signature_date);

-- Índices para Payments
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas necessárias
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER PARA NOTIFICAÇÕES AUTOMÁTICAS
-- =====================================================

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION create_automatic_notifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificação quando uma tarefa é criada
    IF TG_TABLE_NAME = 'tasks' AND TG_OP = 'INSERT' THEN
        -- Só criar notificação se created_by não for NULL
        IF NEW.created_by IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, task_id)
            VALUES (
                NEW.created_by,
                'Nova tarefa criada',
                'A tarefa "' || NEW.title || '" foi criada',
                'info',
                NEW.id
            );
            
            -- Se tem data de vencimento, criar reminder
            IF NEW.due_date IS NOT NULL THEN
                INSERT INTO notifications (user_id, title, message, type, task_id, scheduled_for)
                VALUES (
                    NEW.created_by,
                    'Lembrete: ' || NEW.title,
                    'A tarefa "' || NEW.title || '" vence em breve',
                    'reminder',
                    NEW.id,
                    NEW.due_date - INTERVAL '1 hour'
                );
            END IF;
        END IF;
    END IF;
    
    -- Notificação quando uma visita é agendada
    IF TG_TABLE_NAME = 'visits' AND TG_OP = 'INSERT' THEN
        -- Só criar notificação se assigned_agent não for NULL
        IF NEW.assigned_agent IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, scheduled_for)
            VALUES (
                NEW.assigned_agent,
                'Visita agendada',
                'Visita agendada para ' || NEW.visitor_name || ' em ' || TO_CHAR(NEW.scheduled_date, 'DD/MM/YYYY HH24:MI'),
                'info',
                NEW.scheduled_date - INTERVAL '1 hour'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers para notificações
CREATE TRIGGER trigger_task_notifications AFTER INSERT ON tasks FOR EACH ROW EXECUTE FUNCTION create_automatic_notifications();
CREATE TRIGGER trigger_visit_notifications AFTER INSERT ON visits FOR EACH ROW EXECUTE FUNCTION create_automatic_notifications();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (exemplo para tasks)
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);

-- Políticas para notificações
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir algumas métricas iniciais
INSERT INTO dashboard_metrics (metric_name, metric_value, metric_type, period_type, period_date) VALUES
('total_properties', 0, 'count', 'daily', CURRENT_DATE),
('total_clients', 0, 'count', 'daily', CURRENT_DATE),
('total_contracts', 0, 'count', 'daily', CURRENT_DATE),
('monthly_revenue', 0, 'sum', 'monthly', DATE_TRUNC('month', CURRENT_DATE)::date)
ON CONFLICT (metric_name, period_type, period_date) DO NOTHING;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
-- Execute este script no seu Supabase SQL Editor
-- Todas as tabelas necessárias para um dashboard completo de imobiliária
-- serão criadas com relacionamentos, índices e triggers apropriados
-- =====================================================
