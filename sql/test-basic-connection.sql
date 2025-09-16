-- ===================================================
-- TESTE BÁSICO DE CONEXÃO COM PROFILES
-- ===================================================
-- Execute estes comandos um por um para identificar o problema

-- 1. VERIFICAR SE A TABELA EXISTE
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
) as tabela_profiles_existe;

-- 2. VER ESTRUTURA DA TABELA
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. CONTAR REGISTROS TOTAIS (sem RLS)
-- Este comando vai falhar se RLS estiver bloqueando
SELECT COUNT(*) as total_registros FROM public.profiles;

-- 4. VER ALGUNS REGISTROS
SELECT id, email, full_name, is_active, is_approved
FROM public.profiles
LIMIT 3;

-- 5. VERIFICAR SEU PRÓPRIO PERFIL
SELECT id, email, full_name, is_active, is_approved, created_at
FROM public.profiles
WHERE email = 'jpcardozoo0106@gmail.com'; -- Substitua pelo seu email

-- 6. VERIFICAR STATUS DO RLS
SELECT
    schemaname,
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'RLS ATIVO' ELSE 'RLS INATIVO' END as status_rls
FROM pg_tables
WHERE tablename = 'profiles';

-- 7. LISTAR POLÍTICAS RLS
SELECT policyname, cmd, permissive, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 8. TESTE DE CONECTIVIDADE BÁSICA
-- Se este comando funcionar, a tabela existe e você tem acesso básico
SELECT
    'CONEXÃO OK' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN is_active = true THEN 1 END) as profiles_ativos,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as profiles_aprovados,
    NOW() as timestamp_teste
FROM public.profiles;

-- ===================================================
-- SE OS COMANDOS ACIMA FALHARAM, TENTE ESTES:
-- ===================================================

-- Desabilitar RLS temporariamente (CUIDADO!)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Testar novamente
-- SELECT COUNT(*) FROM public.profiles;

-- Reabilitar RLS
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- CRIAR POLÍTICA MUITO PERMISSIVA (se necessário)
-- ===================================================

-- Remover todas as políticas
-- DROP POLICY IF EXISTS "allow_all_authenticated" ON public.profiles;

-- Criar política que permite tudo para usuários autenticados
-- CREATE POLICY "allow_all_authenticated" ON public.profiles
--     FOR ALL USING (auth.uid() IS NOT NULL);

-- ===================================================
-- VERIFICAÇÃO FINAL
-- ===================================================

-- Se chegou até aqui, teste esta query que simula o que o app faz:
SELECT
    id,
    email,
    full_name,
    department,
    role,
    is_active,
    is_approved,
    created_at
FROM public.profiles
WHERE is_active = true AND is_approved = true
ORDER BY created_at DESC
LIMIT 10;