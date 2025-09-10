-- =====================================================
-- SCRIPT SIMPLIFICADO - CRIAR TABELAS PRINCIPAIS PRIMEIRO
-- =====================================================
-- Execute este script PRIMEIRO, depois execute o complete-dashboard-tables.sql

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

-- Índices básicos
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS básico
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid()::text = created_by::text OR auth.uid()::text = assigned_to);

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =====================================================
-- TABELAS BÁSICAS CRIADAS
-- =====================================================
-- Agora você pode executar o complete-dashboard-tables.sql
-- para criar as demais tabelas do sistema
-- =====================================================
