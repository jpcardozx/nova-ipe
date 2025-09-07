-- Schema super simplificado - apenas o essencial
-- Execute este SQL no Supabase SQL Editor

-- Tabela de solicitações de acesso
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  requested_role TEXT NOT NULL DEFAULT 'agent',
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  reviewer_notes TEXT
);

-- Tabela de tentativas de login
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices básicos
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);

-- RLS básico
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas simples
CREATE POLICY "Anyone can submit requests" ON access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests" ON access_requests
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins podem ver tudo
CREATE POLICY "Admins can manage requests" ON access_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.email = 'admin@ipe-imoveis.com')
    )
  );

-- Comentários
COMMENT ON TABLE access_requests IS 'Solicitações de acesso ao sistema';
COMMENT ON TABLE login_attempts IS 'Tentativas de login para proteção contra força bruta';