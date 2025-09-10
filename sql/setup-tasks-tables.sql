-- Script SQL para criar tabelas do sistema de tarefas e notificações
-- Execute este script no Supabase Dashboard > SQL Editor

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    category VARCHAR(100) DEFAULT 'general',
    assigned_to VARCHAR(255),
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_time TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER, -- em minutos
    actual_duration INTEGER, -- em minutos
    tags TEXT[],
    attachments JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    recurring_type VARCHAR(20) CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
    recurring_until TIMESTAMP WITH TIME ZONE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'reminder')),
    user_id VARCHAR(255) NOT NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    action_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos do calendário
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT false,
    location VARCHAR(255),
    event_type VARCHAR(50) DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'call', 'visit', 'deadline', 'reminder', 'other')),
    attendees TEXT[],
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    color VARCHAR(20) DEFAULT '#3b82f6',
    recurring_type VARCHAR(20) CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
    recurring_until TIMESTAMP WITH TIME ZONE,
    reminder_minutes INTEGER DEFAULT 15,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_sent ON notifications(is_sent);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_task_id ON calendar_events(task_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_client_id ON calendar_events(client_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at 
    BEFORE UPDATE ON calendar_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow all operations for authenticated users" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON calendar_events FOR ALL USING (true);

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION create_task_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar notificação quando tarefa é atribuída
    IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
        INSERT INTO notifications (
            title,
            message,
            type,
            user_id,
            task_id,
            scheduled_for
        ) VALUES (
            'Nova tarefa atribuída',
            'Você recebeu uma nova tarefa: ' || NEW.title,
            'info',
            NEW.assigned_to,
            NEW.id,
            NOW()
        );
    END IF;
    
    -- Criar reminder se data de lembrete foi definida
    IF NEW.reminder_time IS NOT NULL THEN
        INSERT INTO notifications (
            title,
            message,
            type,
            user_id,
            task_id,
            scheduled_for
        ) VALUES (
            'Lembrete de tarefa',
            'Lembrete: ' || NEW.title,
            'reminder',
            COALESCE(NEW.assigned_to, NEW.created_by),
            NEW.id,
            NEW.reminder_time
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER task_notification_trigger
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION create_task_notification();

-- Dados de exemplo
INSERT INTO tasks (title, description, priority, status, assigned_to, due_date, category) VALUES
('Ligar para Maria Silva', 'Follow-up sobre apartamento em Vila Madalena', 'high', 'pending', 'user123', NOW() + INTERVAL '2 hours', 'cliente'),
('Preparar contrato', 'Elaborar contrato de compra e venda', 'medium', 'in_progress', 'user123', NOW() + INTERVAL '1 day', 'documentos'),
('Visita ao imóvel', 'Agendar visita com João Santos', 'urgent', 'pending', 'user123', NOW() + INTERVAL '4 hours', 'visita')
ON CONFLICT DO NOTHING;

INSERT INTO calendar_events (title, description, start_time, end_time, event_type, color) VALUES
('Reunião de equipe', 'Reunião semanal da equipe de vendas', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 'meeting', '#10b981'),
('Ligação cliente', 'Follow-up Maria Silva', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '2 hours 30 minutes', 'call', '#f59e0b')
ON CONFLICT DO NOTHING;
