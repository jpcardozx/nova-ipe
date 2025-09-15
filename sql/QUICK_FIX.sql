-- VERIFICAÇÃO RÁPIDA: Que tabelas existem?
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name LIKE '%client%' OR table_name LIKE '%task%' OR table_name LIKE '%crm%'
ORDER BY table_name;

-- Verificar se as tabelas existem com nomes diferentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (table_name ILIKE '%client%' OR table_name ILIKE '%task%')
ORDER BY table_name;

-- CORREÇÃO IMEDIATA SE AS TABELAS EXISTEM:
-- Desabilitar RLS em TODAS as tabelas que existem

-- Se as tabelas se chamam 'clients' ao invés de 'crm_clients':
ALTER TABLE IF EXISTS clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;

-- Se são crm_clients e crm_tasks:
ALTER TABLE IF EXISTS crm_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS crm_tasks DISABLE ROW LEVEL SECURITY;

-- Dar permissões totais
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Testar uma consulta simples
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';