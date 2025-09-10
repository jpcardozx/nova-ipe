-- =====================================================
-- SCRIPT DE CORREÇÃO PARA TRIGGER DE NOTIFICAÇÕES
-- =====================================================
-- Este script corrige o erro de NULL constraint na tabela notifications
-- ATENÇÃO: Execute APENAS se as tabelas já existirem!

-- 1. Verificar se as tabelas existem antes de remover triggers
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
        DROP TRIGGER IF EXISTS trigger_task_notifications ON tasks;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visits') THEN
        DROP TRIGGER IF EXISTS trigger_visit_notifications ON visits;
    END IF;
END $$;

-- 2. Recriar a função com verificação de NULL
CREATE OR REPLACE FUNCTION create_automatic_notifications() RETURNS TRIGGER AS $$
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

-- 3. Recriar os triggers (apenas se as tabelas existirem)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
        CREATE TRIGGER trigger_task_notifications 
            AFTER INSERT ON tasks 
            FOR EACH ROW 
            EXECUTE FUNCTION create_automatic_notifications();
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visits') THEN
        CREATE TRIGGER trigger_visit_notifications 
            AFTER INSERT ON visits 
            FOR EACH ROW 
            EXECUTE FUNCTION create_automatic_notifications();
    END IF;
END $$;

-- 4. Limpar possíveis notificações com user_id NULL (se a tabela existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        DELETE FROM notifications WHERE user_id IS NULL;
    END IF;
END $$;

-- =====================================================
-- CORREÇÃO CONCLUÍDA
-- =====================================================
