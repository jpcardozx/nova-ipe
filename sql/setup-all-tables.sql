-- =====================================================
-- SCRIPT COMPLETO - EXECUÇÃO ÚNICA
-- =====================================================
-- Este script cria todas as tabelas necessárias na ordem correta
-- sem conflitos de dependências

-- 1. Criar função para verificar se tabela existe
CREATE OR REPLACE FUNCTION table_exists(tbl_name text) 
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM information_schema.tables t
        WHERE lower(t.table_schema) = 'public' 
        AND lower(t.table_name) = lower(tbl_name)
    );
END;
$$ LANGUAGE plpgsql;

-- 2. TABELAS BÁSICAS PRIMEIRO
-- ============================

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
    estimated_duration INTEGER,
    actual_duration INTEGER,
    assigned_to VARCHAR(255),
    client_id UUID REFERENCES crm_clients(id),
    property_id UUID,
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
    property_id UUID,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGORA AS OUTRAS TABELAS
-- ===========================

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartamento', 'casa', 'terreno', 'comercial', 'rural')),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('venda', 'aluguel', 'ambos')),
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo')),
    
    address TEXT NOT NULL,
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    garage_spaces INTEGER DEFAULT 0,
    total_area DECIMAL(10, 2),
    built_area DECIMAL(10, 2),
    land_area DECIMAL(10, 2),
    
    sale_price DECIMAL(15, 2),
    rent_price DECIMAL(10, 2),
    condo_fee DECIMAL(10, 2),
    iptu DECIMAL(10, 2),
    
    owner_id UUID REFERENCES crm_clients(id),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agora podemos atualizar a referência de property_id
DO $$
BEGIN
    IF table_exists('properties') THEN
        ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_property_id_fkey;
        ALTER TABLE calendar_events DROP CONSTRAINT IF EXISTS calendar_events_property_id_fkey;
        
        ALTER TABLE tasks ADD CONSTRAINT tasks_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id);
        ALTER TABLE calendar_events ADD CONSTRAINT calendar_events_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id);
    END IF;
END $$;

-- Demais tabelas...
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
    interest_level INTEGER CHECK (interest_level BETWEEN 1 AND 5),
    assigned_agent UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FUNÇÕES E TRIGGERS (SEM PROBLEMAS DE NULL)
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers de updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função de notificações SEM problemas de NULL
CREATE OR REPLACE FUNCTION create_automatic_notifications()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'tasks' AND TG_OP = 'INSERT' THEN
        IF NEW.created_by IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, task_id)
            VALUES (
                NEW.created_by,
                'Nova tarefa criada',
                'A tarefa "' || NEW.title || '" foi criada',
                'info',
                NEW.id
            );
            
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
    
    IF TG_TABLE_NAME = 'visits' AND TG_OP = 'INSERT' THEN
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

-- Triggers de notificação
CREATE TRIGGER trigger_task_notifications AFTER INSERT ON tasks FOR EACH ROW EXECUTE FUNCTION create_automatic_notifications();
CREATE TRIGGER trigger_visit_notifications AFTER INSERT ON visits FOR EACH ROW EXECUTE FUNCTION create_automatic_notifications();

-- 5. ÍNDICES
-- ==========
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON visits(property_id);

-- 6. RLS
-- ======
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Remover função auxiliar
DROP FUNCTION IF EXISTS table_exists(text);

-- =====================================================
-- SCRIPT COMPLETO EXECUTADO COM SUCESSO!
-- =====================================================
