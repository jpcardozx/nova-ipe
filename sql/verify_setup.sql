-- Script para verificar se o setup do Supabase foi executado corretamente
-- Execute este script no SQL Editor do Supabase para verificar

-- 1. Verificar se as tabelas foram criadas
SELECT 'TABELAS CRIADAS:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'access_requests', 'activity_logs', 'system_settings')
ORDER BY table_name;

-- 2. Verificar configurações do sistema
SELECT 'CONFIGURAÇÕES DO SISTEMA:' as status;
SELECT key, description 
FROM public.system_settings 
ORDER BY key;

-- 3. Verificar solicitações de acesso de exemplo
SELECT 'SOLICITAÇÕES DE EXEMPLO:' as status;
SELECT email, full_name, department, status, created_at
FROM public.access_requests 
ORDER BY created_at DESC;

-- 4. Verificar se as funções foram criadas
SELECT 'FUNÇÕES CRIADAS:' as status;
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'log_activity', 'approve_access_request')
ORDER BY routine_name;

-- 5. Verificar políticas RLS
SELECT 'POLÍTICAS RLS:' as status;
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Verificar se há usuários no auth
SELECT 'USUÁRIOS NO AUTH:' as status;
SELECT email, email_confirmed_at, created_at, updated_at
FROM auth.users
ORDER BY created_at DESC;

-- 7. Verificar perfis criados
SELECT 'PERFIS CRIADOS:' as status;
SELECT email, full_name, role, department, is_active, is_approved, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 8. Status geral do setup
SELECT 
    'RESUMO DO SETUP' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'access_requests', 'activity_logs', 'system_settings')) as tabelas_criadas,
    (SELECT COUNT(*) FROM public.system_settings) as configuracoes_inseridas,
    (SELECT COUNT(*) FROM public.access_requests) as solicitacoes_exemplo,
    (SELECT COUNT(*) FROM auth.users) as usuarios_auth,
    (SELECT COUNT(*) FROM public.profiles) as perfis_criados;