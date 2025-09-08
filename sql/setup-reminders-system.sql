-- Sistema de Reminders e Notificações
-- Execute no SQL Editor do Supabase após as tabelas CRM

-- 1. Tabela de Reminders
CREATE TABLE IF NOT EXISTS crm_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(50) NOT NULL, -- 'call', 'visit', 'document', 'meeting', 'follow_up', 'payment'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    
    -- Relacionamentos
    client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
    property_id UUID REFERENCES crm_properties(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES crm_activities(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
    
    -- Timing
    reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    snooze_until TIMESTAMP WITH TIME ZONE,
    
    -- Recorrência
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB, -- {type: 'daily'|'weekly'|'monthly', interval: 1, end_date: '2024-12-31'}
    
    -- Notificações
    notification_channels JSONB DEFAULT '["email"]'::jsonb, -- ['email', 'sms', 'whatsapp', 'push']
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    notification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    
    -- Metadados
    assigned_to UUID, -- usuário responsável
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Notificações
CREATE TABLE IF NOT EXISTS crm_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- usuário que receberá a notificação
    reminder_id UUID REFERENCES crm_reminders(id) ON DELETE CASCADE,
    
    -- Conteúdo
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) NOT NULL, -- 'reminder', 'activity', 'deal_update', 'system'
    channel VARCHAR(20) NOT NULL, -- 'email', 'sms', 'whatsapp', 'push', 'in_app'
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'read', 'failed'
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Dados específicos do canal
    email_data JSONB, -- {subject, html_content, attachments}
    sms_data JSONB, -- {phone_number, message}
    whatsapp_data JSONB, -- {phone_number, message, media_url}
    push_data JSONB, -- {title, body, icon, click_action}
    
    -- Resultado
    delivery_status JSONB, -- response da API de envio
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Templates de Notificação
CREATE TABLE IF NOT EXISTS crm_notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'reminder', 'welcome', 'follow_up', etc
    channel VARCHAR(20) NOT NULL, -- 'email', 'sms', 'whatsapp'
    
    -- Conteúdo do template
    subject_template VARCHAR(255), -- para email
    content_template TEXT NOT NULL, -- suporte a variáveis {{client_name}}, {{property_title}}
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    variables JSONB DEFAULT '[]'::jsonb, -- lista de variáveis disponíveis
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Configurações de Usuário
CREATE TABLE IF NOT EXISTS crm_user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    
    -- Preferências de notificação
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    whatsapp_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Horários de notificação
    notification_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00"}'::jsonb,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    
    -- Frequência de reminders
    reminder_advance_time INTEGER DEFAULT 60, -- minutos antes
    daily_digest BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,
    
    -- Canais preferidos por tipo
    reminder_channel VARCHAR(20) DEFAULT 'email',
    urgent_channel VARCHAR(20) DEFAULT 'sms',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_reminders_date ON crm_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON crm_reminders(status);
CREATE INDEX IF NOT EXISTS idx_reminders_client ON crm_reminders(client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_assigned ON crm_reminders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON crm_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON crm_notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON crm_notifications(created_at);

-- 6. Triggers para updated_at
CREATE TRIGGER update_crm_reminders_updated_at 
    BEFORE UPDATE ON crm_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_notification_templates_updated_at 
    BEFORE UPDATE ON crm_notification_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_user_settings_updated_at 
    BEFORE UPDATE ON crm_user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Função para criar reminders automáticos
CREATE OR REPLACE FUNCTION create_automatic_reminder()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar reminder para follow-up após 3 dias de uma atividade
    IF NEW.activity_type = 'viewing' AND NEW.status = 'completed' THEN
        INSERT INTO crm_reminders (
            title,
            description,
            reminder_type,
            client_id,
            property_id,
            activity_id,
            reminder_date,
            assigned_to
        ) VALUES (
            'Follow-up após visita',
            'Entrar em contato com cliente após visita ao imóvel',
            'follow_up',
            NEW.client_id,
            NEW.property_id,
            NEW.id,
            NEW.completed_date + INTERVAL '3 days',
            NEW.assigned_to
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar reminders automáticos
CREATE TRIGGER auto_create_reminders
    AFTER UPDATE ON crm_activities
    FOR EACH ROW
    WHEN (OLD.status != NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION create_automatic_reminder();

-- 8. Função para processar notificações pendentes
CREATE OR REPLACE FUNCTION process_pending_reminders()
RETURNS TABLE(reminder_id UUID, user_id UUID, title TEXT, message TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as reminder_id,
        r.assigned_to as user_id,
        r.title,
        COALESCE(r.description, '') as message
    FROM crm_reminders r
    LEFT JOIN crm_user_settings us ON us.user_id = r.assigned_to
    WHERE 
        r.status = 'pending'
        AND r.reminder_date <= NOW()
        AND (r.snooze_until IS NULL OR r.snooze_until <= NOW())
        AND (us.notification_hours IS NULL OR 
             EXTRACT(HOUR FROM NOW() AT TIME ZONE COALESCE(us.timezone, 'UTC')) BETWEEN 
             (us.notification_hours->>'start')::TIME::HOUR AND 
             (us.notification_hours->>'end')::TIME::HOUR);
END;
$$ LANGUAGE plpgsql;

-- 9. Templates padrão
INSERT INTO crm_notification_templates (name, description, type, channel, subject_template, content_template, variables) VALUES
('reminder_call', 'Template para lembrete de ligação', 'reminder', 'email', 'Lembrete: Ligar para {{client_name}}', 'Olá! Você tem um lembrete para ligar para o cliente {{client_name}} sobre {{property_title}}.', '["client_name", "property_title", "reminder_date"]'),
('reminder_visit', 'Template para lembrete de visita', 'reminder', 'email', 'Lembrete: Visita agendada com {{client_name}}', 'Lembrete: Você tem uma visita agendada com {{client_name}} para o imóvel {{property_title}} em {{reminder_date}}.', '["client_name", "property_title", "reminder_date"]'),
('follow_up_sms', 'Template SMS para follow-up', 'follow_up', 'sms', NULL, 'Olá {{client_name}}! Como foi sua visita ao imóvel? Ficou alguma dúvida? Estou à disposição!', '["client_name"]'),
('welcome_whatsapp', 'Template WhatsApp de boas-vindas', 'welcome', 'whatsapp', NULL, 'Bem-vindo(a) {{client_name}}! 🏠 Sou {{agent_name}} e vou te ajudar a encontrar o imóvel dos seus sonhos!', '["client_name", "agent_name"]')
ON CONFLICT (name) DO NOTHING;

-- 10. RLS (Row Level Security) - Configurar depois de auth
-- ALTER TABLE crm_reminders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_notification_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crm_user_settings ENABLE ROW LEVEL SECURITY;
