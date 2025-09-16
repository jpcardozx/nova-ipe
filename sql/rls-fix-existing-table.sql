-- ===================================================
-- FIX RLS PARA TABELA PROFILES EXISTENTE
-- ===================================================
-- Para tabelas profiles que já existem sem coluna is_employee

-- 1. Primeiro, verificar estrutura da tabela
-- Execute este comando para ver as colunas que existem:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

-- 2. REMOVER políticas que referenciam colunas inexistentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Employees can view all employee profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 3. POLÍTICA SIMPLES: Usuários autenticados podem ver todos os perfis
CREATE POLICY "authenticated_users_can_view_all_profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

-- 4. POLÍTICA: Usuários podem editar apenas seu próprio perfil
CREATE POLICY "users_can_update_own_profile" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id
    );

-- 5. POLÍTICA: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "users_can_insert_own_profile" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id
    );

-- 6. GARANTIR que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- TESTES BÁSICOS
-- ===================================================

-- Verificar se RLS está ativo
SELECT
    schemaname,
    tablename,
    rowsecurity,
    CASE
        WHEN rowsecurity THEN 'RLS ATIVO ✅'
        ELSE 'RLS INATIVO ❌'
    END as status
FROM pg_tables
WHERE tablename = 'profiles';

-- Listar políticas criadas
SELECT
    policyname as "Política",
    cmd as "Comando",
    permissive as "Tipo",
    qual as "Condição"
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Testar contagem de perfis visíveis
SELECT
    COUNT(*) as total_perfis_visiveis,
    auth.uid() as meu_usuario_id
FROM public.profiles;

-- Listar alguns perfis (máximo 5)
SELECT
    id,
    email,
    name,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- ===================================================
-- SE AINDA NÃO FUNCIONAR: POLÍTICA MAIS PERMISSIVA
-- ===================================================

/*
-- Execute apenas se os comandos acima não funcionarem:

-- Remover todas as políticas
DROP POLICY IF EXISTS "authenticated_users_can_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;

-- Criar política que permite tudo para usuários autenticados
CREATE POLICY "allow_all_for_authenticated" ON public.profiles
    FOR ALL USING (auth.uid() IS NOT NULL);
*/

-- ===================================================
-- VERIFICAÇÃO FINAL DE ESTRUTURA
-- ===================================================

-- Ver todas as colunas da tabela profiles
SELECT
    column_name as "Coluna",
    data_type as "Tipo",
    is_nullable as "Pode ser NULL",
    column_default as "Valor Padrão"
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ===================================================
-- COMANDOS ÚTEIS PARA DEBUG
-- ===================================================

-- Ver usuário atual
SELECT
    auth.uid() as "Meu ID",
    auth.email() as "Meu Email",
    NOW() as "Agora";

-- Contar perfis por diferentes critérios
SELECT
    COUNT(*) as total,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as com_email,
    COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as com_nome
FROM public.profiles;

-- ===================================================
-- EMERGÊNCIA: DESABILITAR RLS TEMPORARIAMENTE
-- ===================================================

/*
-- Use apenas para debug - REMOVA em produção!
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Para reabilitar:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
*/