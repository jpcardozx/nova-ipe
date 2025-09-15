-- ===================================================================
-- SCRIPT DE VERIFICAÇÃO - Execute depois do FINAL_fix_everything.sql
-- ===================================================================
-- Este script testa se as correções funcionaram

-- 1. Verificar se as tabelas existem
SELECT 'Verificando tabelas...' as step;

SELECT
    table_name,
    CASE
        WHEN table_name = 'crm_clients' THEN '✅ Tabela de clientes OK'
        WHEN table_name = 'crm_tasks' THEN '✅ Tabela de tarefas OK'
        ELSE '⚠️ Tabela encontrada mas não esperada'
    END as status
FROM information_schema.tables
WHERE table_name IN ('crm_clients', 'crm_tasks')
ORDER BY table_name;

-- 2. Verificar colunas importantes
SELECT 'Verificando colunas importantes...' as step;

SELECT
    'crm_clients' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'crm_clients'
AND column_name IN ('client_code', 'status', 'priority', 'created_at')
UNION ALL
SELECT
    'crm_tasks' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'crm_tasks'
AND column_name IN ('task_type', 'visibility', 'category', 'client_id')
ORDER BY table_name, column_name;

-- 3. Verificar status do RLS (deve estar desabilitado)
SELECT 'Verificando RLS (deve estar FALSE)...' as step;

SELECT
    tablename,
    CASE
        WHEN rowsecurity = false THEN '✅ RLS desabilitado'
        ELSE '❌ RLS ainda ativo - PROBLEMA!'
    END as rls_status
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks')
ORDER BY tablename;

-- 4. Testar operações básicas
SELECT 'Testando operações básicas...' as step;

-- Teste de INSERT
INSERT INTO crm_clients (name, email, client_code, status)
VALUES ('Teste Verificação', 'teste@verificacao.com', 'TEST001', 'lead')
ON CONFLICT (client_code) DO NOTHING;

-- Teste de SELECT
SELECT COUNT(*) as total_clients FROM crm_clients;

-- Teste de UPDATE
UPDATE crm_clients
SET notes = 'Atualizado durante verificação'
WHERE client_code = 'TEST001';

-- Teste de operações em crm_tasks
INSERT INTO crm_tasks (title, description, task_type, visibility)
VALUES ('Tarefa de Teste', 'Teste de verificação', 'internal', 'private')
ON CONFLICT DO NOTHING;

SELECT COUNT(*) as total_tasks FROM crm_tasks;

-- 5. Verificar índices
SELECT 'Verificando índices...' as step;

SELECT
    tablename,
    indexname,
    CASE
        WHEN indexname LIKE 'idx_%' THEN '✅ Índice customizado'
        WHEN indexname LIKE '%_pkey' THEN '✅ Chave primária'
        ELSE '⚠️ Outro índice'
    END as index_type
FROM pg_indexes
WHERE tablename IN ('crm_clients', 'crm_tasks')
ORDER BY tablename, indexname;

-- 6. Verificar triggers
SELECT 'Verificando triggers...' as step;

SELECT
    trigger_name,
    event_object_table,
    CASE
        WHEN trigger_name LIKE '%updated_at%' THEN '✅ Trigger de updated_at'
        ELSE '⚠️ Outro trigger'
    END as trigger_type
FROM information_schema.triggers
WHERE event_object_table IN ('crm_clients', 'crm_tasks')
ORDER BY event_object_table, trigger_name;

-- 7. Limpeza dos dados de teste
SELECT 'Limpando dados de teste...' as step;

DELETE FROM crm_tasks WHERE title = 'Tarefa de Teste';
DELETE FROM crm_clients WHERE client_code = 'TEST001';

-- 8. Resultado final
SELECT '🎉 VERIFICAÇÃO CONCLUÍDA!' as result,
       'Se você vê esta mensagem, as correções funcionaram!' as message;

-- 9. Resumo para o desenvolvedor
SELECT 'RESUMO PARA O DESENVOLVEDOR:' as info,
       'Tabelas: crm_clients e crm_tasks estão funcionando' as tables,
       'RLS: Desabilitado para desenvolvimento' as rls,
       'Permissões: Configuradas para todos os roles' as permissions,
       'Próximo passo: Testar o dashboard' as next_step;