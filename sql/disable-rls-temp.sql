-- Desabilitar RLS temporariamente para criar usuários de teste
-- Execute no SQL Editor do Supabase Dashboard

-- Desabilitar RLS na tabela access_requests temporariamente
ALTER TABLE access_requests DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS na tabela profiles temporariamente  
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS na tabela login_attempts temporariamente
ALTER TABLE login_attempts DISABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Após criar usuários de teste, reabilite com:
-- ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;