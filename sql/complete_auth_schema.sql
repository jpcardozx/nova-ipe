-- Schema completo para sistema de autenticação e controle de acesso
-- Para imobiliárias de pequeno e médio porte

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de roles/funções
CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  creci TEXT, -- Registro CRECI para corretores
  department TEXT,
  role_id TEXT NOT NULL REFERENCES user_roles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  bio TEXT,
  hire_date DATE,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de solicitações de acesso
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  creci TEXT,
  department TEXT NOT NULL,
  requested_role TEXT NOT NULL REFERENCES user_roles(id),
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  
  -- Índices únicos para evitar duplicatas
  UNIQUE(email, status) WHERE status IN ('pending', 'under_review')
);

-- Tabela de documentos das solicitações
CREATE TABLE IF NOT EXISTS access_request_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES access_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tentativas de login
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões ativas (para controle de sessões múltiplas)
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_created_at ON access_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires_at ON active_sessions(expires_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar sessões expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM active_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Função para limpar tentativas de login antigas (mais de 30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_request_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can manage profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin')
    )
  );

-- Políticas RLS para access_requests
CREATE POLICY "Anyone can submit access requests" ON access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests" ON access_requests
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all requests" ON access_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin', 'manager')
    )
  );

CREATE POLICY "Admins can update requests" ON access_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin', 'manager')
    )
  );

-- Políticas RLS para documentos
CREATE POLICY "Users can view own request documents" ON access_request_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM access_requests ar
      WHERE ar.id = request_id 
      AND ar.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all documents" ON access_request_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin', 'manager')
    )
  );

-- Políticas RLS para audit_logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin')
    )
  );

-- Políticas RLS para active_sessions
CREATE POLICY "Users can view own sessions" ON active_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON active_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin')
    )
  );

-- Políticas RLS para system_settings
CREATE POLICY "Admins can manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role_id IN ('super_admin', 'admin')
    )
  );

-- Inserir roles padrão
INSERT INTO user_roles (id, name, description, hierarchy_level, permissions) VALUES
('super_admin', 'Super Administrador', 'Acesso total ao sistema', 100, '[{"id": "all", "resource": "*", "action": "*"}]'::jsonb),
('admin', 'Administrador', 'Gerenciamento completo exceto configurações críticas', 90, '[
  {"id": "users_manage", "resource": "users", "action": "*"},
  {"id": "properties_manage", "resource": "properties", "action": "*"},
  {"id": "leads_manage", "resource": "leads", "action": "*"},
  {"id": "reports_view", "resource": "reports", "action": "read"},
  {"id": "system_config", "resource": "system", "action": "configure"}
]'::jsonb),
('manager', 'Gerente', 'Supervisão de equipes e operações', 80, '[
  {"id": "properties_manage", "resource": "properties", "action": "*"},
  {"id": "leads_manage", "resource": "leads", "action": "*"},
  {"id": "agents_manage", "resource": "users", "action": "read,update", "conditions": {"role": "agent"}},
  {"id": "reports_view", "resource": "reports", "action": "read"}
]'::jsonb),
('agent', 'Corretor', 'Gestão de imóveis e clientes próprios', 50, '[
  {"id": "properties_own", "resource": "properties", "action": "read,update", "conditions": {"owner": "self"}},
  {"id": "leads_own", "resource": "leads", "action": "*", "conditions": {"assigned_to": "self"}},
  {"id": "clients_manage", "resource": "clients", "action": "*", "conditions": {"assigned_to": "self"}}
]'::jsonb),
('assistant', 'Assistente', 'Suporte operacional limitado', 30, '[
  {"id": "properties_read", "resource": "properties", "action": "read"},
  {"id": "leads_support", "resource": "leads", "action": "read,update", "conditions": {"support_access": true}},
  {"id": "clients_support", "resource": "clients", "action": "read,update", "conditions": {"support_access": true}}
]'::jsonb),
('viewer', 'Visualizador', 'Acesso apenas para consulta', 10, '[
  {"id": "properties_read", "resource": "properties", "action": "read"},
  {"id": "reports_basic", "resource": "reports", "action": "read", "conditions": {"type": "basic"}}
]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hierarchy_level = EXCLUDED.hierarchy_level,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Configurações padrão do sistema
INSERT INTO system_settings (key, value, description) VALUES
('max_login_attempts', '5', 'Máximo de tentativas de login antes do bloqueio'),
('lockout_duration_minutes', '15', 'Duração do bloqueio em minutos'),
('session_timeout_hours', '8', 'Timeout da sessão em horas'),
('require_password_change_days', '90', 'Dias para exigir troca de senha'),
('allow_multiple_sessions', 'false', 'Permitir múltiplas sessões simultâneas'),
('notification_email', 'admin@ipe-imoveis.com', 'Email para notificações do sistema')
ON CONFLICT (key) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE user_roles IS 'Definição de papéis e permissões no sistema';
COMMENT ON TABLE user_profiles IS 'Perfis completos dos usuários do sistema';
COMMENT ON TABLE access_requests IS 'Solicitações de acesso ao sistema';
COMMENT ON TABLE access_request_documents IS 'Documentos anexados às solicitações';
COMMENT ON TABLE login_attempts IS 'Registro de tentativas de login para segurança';
COMMENT ON TABLE audit_logs IS 'Logs de auditoria de todas as ações do sistema';
COMMENT ON TABLE active_sessions IS 'Controle de sessões ativas dos usuários';
COMMENT ON TABLE system_settings IS 'Configurações globais do sistema';