-- Script SQL para criar sistema de tarefas e notificações
-- Execute este script no Supabase Dashboard > SQL Editor

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100) DEFAULT 'general',
    assigned_to VARCHAR(255),
    created_by VARCHAR(255),
    
    -- Datas e prazos
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Relacionamentos
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    property_id UUID,
    
    -- Configurações de reminder
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_minutes_before INTEGER DEFAULT 15,
    recurring_type VARCHAR(20) CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')) DEFAULT 'none',
    recurring_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('task_reminder', 'task_overdue', 'task_assigned', 'task_completed', 'custom')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Destinatário
    user_id VARCHAR(255) NOT NULL,
    
    -- Status
    read BOOLEAN DEFAULT false,
    sent BOOLEAN DEFAULT false,
    
    -- Relacionamentos
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    client_id UUID REFERENCES crm_clients(id) ON DELETE SET NULL,
    
    -- Agendamento
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Configurações de entrega
    delivery_methods JSONB DEFAULT '["in_app"]', -- ['in_app', 'email', 'push']
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de tarefas (customizável)
CREATE TABLE IF NOT EXISTS task_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    icon VARCHAR(50) DEFAULT 'folder',
    description TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO task_categories (name, color, icon, description) VALUES
('Vendas', '#10B981', 'shopping-cart', 'Tarefas relacionadas a vendas de imóveis'),
('Locação', '#3B82F6', 'home', 'Tarefas de locação e aluguel'),
('Atendimento', '#F59E0B', 'phone', 'Atendimento ao cliente e suporte'),
('Documentação', '#8B5CF6', 'file-text', 'Documentos e papelada'),
('Visitas', '#EF4444', 'map-pin', 'Agendamento de visitas'),
('Follow-up', '#06B6D4', 'refresh-cw', 'Acompanhamento de clientes'),
('Marketing', '#EC4899', 'megaphone', 'Ações de marketing e divulgação'),
('Financeiro', '#84CC16', 'dollar-sign', 'Questões financeiras e pagamentos')
ON CONFLICT (name) DO NOTHING;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_reminder_date ON tasks(reminder_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON notifications(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Trigger para atualizar updated_at
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

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION create_task_reminder_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar notificação de reminder se a tarefa tem reminder habilitado
    IF NEW.reminder_enabled = true AND NEW.reminder_date IS NOT NULL AND NEW.assigned_to IS NOT NULL THEN
        INSERT INTO notifications (
            type,
            title,
            message,
            user_id,
            task_id,
            scheduled_for,
            priority
        ) VALUES (
            'task_reminder',
            'Lembrete: ' || NEW.title,
            CASE 
                WHEN NEW.description IS NOT NULL THEN NEW.description
                ELSE 'Você tem uma tarefa agendada.'
            END,
            NEW.assigned_to,
            NEW.id,
            NEW.reminder_date,
            CASE NEW.priority
                WHEN 'urgent' THEN 'urgent'
                WHEN 'high' THEN 'high'
                ELSE 'normal'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar notificações automaticamente
CREATE TRIGGER create_task_reminder_on_insert 
    AFTER INSERT ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION create_task_reminder_notification();

CREATE TRIGGER create_task_reminder_on_update 
    AFTER UPDATE ON tasks 
    FOR EACH ROW 
    WHEN (OLD.reminder_date IS DISTINCT FROM NEW.reminder_date OR 
          OLD.reminder_enabled IS DISTINCT FROM NEW.reminder_enabled)
    EXECUTE FUNCTION create_task_reminder_notification();

-- Função para marcar tarefas como overdue
CREATE OR REPLACE FUNCTION mark_overdue_tasks()
RETURNS void AS $$
BEGIN
    UPDATE tasks 
    SET status = 'overdue'
    WHERE status IN ('pending', 'in_progress') 
    AND due_date < NOW() 
    AND due_date IS NOT NULL;
    
    -- Criar notificações para tarefas em atraso
    INSERT INTO notifications (
        type,
        title,
        message,
        user_id,
        task_id,
        scheduled_for,
        priority
    )
    SELECT 
        'task_overdue',
        'Tarefa em atraso: ' || title,
        'A tarefa "' || title || '" está em atraso desde ' || to_char(due_date, 'DD/MM/YYYY HH24:MI'),
        assigned_to,
        id,
        NOW(),
        'high'
    FROM tasks 
    WHERE status = 'overdue' 
    AND assigned_to IS NOT NULL
    AND id NOT IN (
        SELECT task_id FROM notifications 
        WHERE type = 'task_overdue' 
        AND task_id IS NOT NULL 
        AND created_at > NOW() - INTERVAL '1 day'
    );
END;
$$ language 'plpgsql';

-- Habilitar RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow all operations for authenticated users" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON task_categories FOR ALL USING (true);

-- Inserir algumas tarefas de exemplo
INSERT INTO tasks (title, description, status, priority, category, due_date, reminder_date, reminder_enabled) VALUES
('Ligar para cliente Maria Silva', 'Acompanhar interesse no apartamento na Vila Madalena', 'pending', 'high', 'Follow-up', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '1 hour', true),
('Preparar documentação - Apartamento 101', 'Organizar documentos para venda do apartamento', 'pending', 'medium', 'Documentação', NOW() + INTERVAL '1 day', NOW() + INTERVAL '12 hours', true),
('Visita técnica - Casa Jardins', 'Avaliar estado do imóvel para precificação', 'pending', 'high', 'Visitas', NOW() + INTERVAL '3 days', NOW() + INTERVAL '2 days', true)
ON CONFLICT DO NOTHING;
