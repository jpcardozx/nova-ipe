-- Criar primeiro usuário administrador
-- ===================================

-- Insert initial system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('system_name', '"Ipê Imóveis - Sistema de Gestão"', 'Nome do sistema'),
('version', '"1.0.0"', 'Versão atual do sistema'),
('maintenance_mode', 'false', 'Modo de manutenção ativo/inativo'),
('max_users', '50', 'Número máximo de usuários permitidos'),
('require_approval', 'true', 'Requer aprovação para novos usuários'),
('default_user_role', '"user"', 'Papel padrão para novos usuários')
ON CONFLICT (key) DO NOTHING;

-- Note: O usuário administrador deve ser criado através do Supabase Auth
-- Este é um script para criar o perfil após a autenticação
-- 
-- Passos para criar o admin:
-- 1. No Supabase Dashboard, vá para Authentication > Users
-- 2. Clique em "Add user" 
-- 3. Use os dados:
--    - Email: admin@ipeimoveis.com
--    - Password: IpeAdmin123!
--    - Confirm email: Yes
-- 
-- 4. Após criar no Auth, execute este insert para criar o perfil:

-- IMPORTANTE: Execute este INSERT apenas APÓS criar o usuário no Supabase Auth
-- Substitua 'USER_ID_FROM_SUPABASE_AUTH' pelo ID real gerado pelo Supabase

/*
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    department,
    role,
    phone,
    is_active,
    is_approved,
    approved_at
) VALUES (
    'USER_ID_FROM_SUPABASE_AUTH'::uuid,  -- Substituir pelo ID real
    'admin@ipeimoveis.com',
    'Administrador do Sistema',
    'Administrativo',
    'super_admin',
    '+55 11 99999-9999',
    true,
    true,
    NOW()
);
*/

-- Função para criar perfil automaticamente quando um usuário é criado no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Função para registrar atividade
CREATE OR REPLACE FUNCTION public.log_activity(
    p_action VARCHAR(100),
    p_entity_type VARCHAR(100) DEFAULT NULL,
    p_entity_id VARCHAR(255) DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aprovar solicitação de acesso
CREATE OR REPLACE FUNCTION public.approve_access_request(
    request_id UUID,
    approval_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    request_record RECORD;
    new_user_id UUID;
BEGIN
    -- Verificar se o usuário atual é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Permissão negada: apenas administradores podem aprovar solicitações';
    END IF;

    -- Buscar a solicitação
    SELECT * INTO request_record 
    FROM public.access_requests 
    WHERE id = request_id AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
    END IF;

    -- Criar usuário no auth (simulado - na prática seria feito via API)
    -- Por enquanto, apenas atualizamos o status
    UPDATE public.access_requests
    SET 
        status = 'approved',
        processed_by = auth.uid(),
        processed_at = NOW(),
        notes = approval_notes
    WHERE id = request_id;

    -- Log da atividade
    PERFORM public.log_activity(
        'access_request_approved',
        'access_request',
        request_id::text,
        jsonb_build_object('email', request_record.email, 'notes', approval_notes)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;