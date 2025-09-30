-- SQL para criar tabelas de perfis de usuário estendidos
-- Execute no Supabase SQL Editor

-- 1. Tabela de perfis de usuário estendidos
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  provider VARCHAR(50) DEFAULT 'zoho_mail360',
  
  -- Dados adicionais
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Avatar e personalização
  avatar_url TEXT,
  theme_preference VARCHAR(10) DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  language VARCHAR(10) DEFAULT 'pt-BR',
  
  -- Role (JSON)
  role JSONB DEFAULT '{
    "id": "user",
    "name": "Usuário",
    "hierarchy_level": 1,
    "permissions": ["dashboard.read", "profile.edit"]
  }'::jsonb,
  
  -- Preferências (JSON)
  preferences JSONB DEFAULT '{
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "dashboard": {
      "default_view": "overview"
    },
    "calendar": {
      "working_hours": {
        "start": "09:00",
        "end": "18:00",
        "days": [1, 2, 3, 4, 5]
      }
    }
  }'::jsonb,
  
  -- Estatísticas (JSON)
  stats JSONB DEFAULT '{
    "last_login": null,
    "login_count": 0,
    "total_sessions": 0,
    "avg_session_duration": null
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de eventos/lembretes dos usuários
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('reminder', 'task', 'meeting', 'deadline', 'follow_up')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Timing
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'overdue')),
  
  -- Recorrência (JSON)
  recurrence JSONB,
  
  -- Relacionamentos (JSON)
  related_to JSONB,
  
  -- Notificações (JSON)
  notifications JSONB DEFAULT '{
    "before_minutes": [15, 60],
    "sent": [false, false]
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de notas dos usuários
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'personal' CHECK (type IN ('personal', 'client', 'property', 'task')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Relacionamentos (JSON)
  related_to JSONB,
  
  -- Compartilhamento
  shared_with UUID[] DEFAULT ARRAY[]::UUID[],
  is_private BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de log de atividades dos usuários
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_scheduled_at ON user_events(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_user_events_status ON user_events(status);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_type ON user_notes(type);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);

-- 6. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_events_updated_at BEFORE UPDATE ON user_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (usuários só veem seus próprios dados)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can view their own events" ON user_events
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can view their own notes" ON user_notes
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can view their own activity log" ON user_activity_log
    FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE email = auth.jwt() ->> 'email'));