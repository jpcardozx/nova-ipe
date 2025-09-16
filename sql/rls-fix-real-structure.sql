-- ===================================================
-- RLS PARA ESTRUTURA REAL DA TABELA PROFILES
-- ===================================================
-- Baseado na estrutura real: id, email, full_name, avatar_url, department, role, phone, is_active, is_approved, approved_by, approved_at, created_at, updated_at

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. REMOVER todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Employees can view all employee profiles" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_users_can_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;

-- 3. GARANTIR que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICA PRINCIPAL: Funcionários ativos e aprovados podem ver outros funcionários
CREATE POLICY "active_approved_users_can_view_profiles" ON public.profiles
    FOR SELECT USING (
        -- Usuário deve estar autenticado
        auth.uid() IS NOT NULL AND
        -- E o perfil sendo visualizado deve estar ativo e aprovado
        is_active = true AND
        is_approved = true
    );

-- 5. POLÍTICA: Usuários podem sempre ver seu próprio perfil (mesmo se inativo/não aprovado)
CREATE POLICY "users_can_view_own_profile" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id
    );

-- 6. POLÍTICA: Usuários podem editar apenas seu próprio perfil
CREATE POLICY "users_can_update_own_profile" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id
    );

-- 7. POLÍTICA: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "users_can_insert_own_profile" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id
    );

-- ===================================================
-- TESTES E VERIFICAÇÕES
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
    policyname as "Nome da Política",
    cmd as "Comando",
    permissive as "Tipo",
    roles as "Roles",
    qual as "Condição USING",
    with_check as "Condição CHECK"
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Contar perfis totais na tabela
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Contar perfis ativos e aprovados
SELECT COUNT(*) as active_approved_profiles
FROM public.profiles
WHERE is_active = true AND is_approved = true;

-- Contar perfis visíveis para o usuário atual (teste da política)
SELECT COUNT(*) as visible_profiles
FROM public.profiles;

-- Listar perfis visíveis (máximo 10)
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
ORDER BY created_at DESC
LIMIT 10;

-- Verificar dados do usuário atual
SELECT
    auth.uid() as "Meu ID",
    auth.email() as "Meu Email",
    (SELECT full_name FROM public.profiles WHERE id = auth.uid()) as "Meu Nome",
    (SELECT is_active FROM public.profiles WHERE id = auth.uid()) as "Estou Ativo",
    (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) as "Estou Aprovado";

-- ===================================================
-- COMANDOS DE DEBUG
-- ===================================================

-- Se quiser ver TODOS os perfis (independente da política)
-- Execute como superuser ou desabilite RLS temporariamente:
/*
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
SELECT COUNT(*) FROM public.profiles;
SELECT id, email, full_name, is_active, is_approved FROM public.profiles LIMIT 5;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
*/

-- Verificar se outros usuários existem na tabela
SELECT
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN is_active = true AND is_approved = true THEN 1 END) as ativos_e_aprovados,
    COUNT(CASE WHEN id != auth.uid() THEN 1 END) as outros_usuarios
FROM public.profiles;

-- ===================================================
-- POLÍTICA ALTERNATIVA (SE A PRINCIPAL NÃO FUNCIONAR)
-- ===================================================

/*
-- Se a política principal for muito restritiva, use esta mais simples:

DROP POLICY IF EXISTS "active_approved_users_can_view_profiles" ON public.profiles;

-- Política mais permissiva: usuários autenticados veem todos os perfis
CREATE POLICY "authenticated_users_view_all" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);
*/

-- ===================================================
-- INSERIR PERFIL DE TESTE (se necessário)
-- ===================================================

/*
-- Se você quiser criar um perfil de teste para outro usuário:
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    department,
    role,
    is_active,
    is_approved,
    created_at
) VALUES (
    gen_random_uuid(),
    'teste@empresa.com',
    'Usuário Teste',
    'Vendas',
    'vendedor',
    true,
    true,
    NOW()
) ON CONFLICT (id) DO NOTHING;
*/