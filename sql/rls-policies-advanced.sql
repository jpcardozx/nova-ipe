-- ===================================================
-- POLÍTICAS RLS AVANÇADAS PARA PERFIS
-- ===================================================
-- Execute se as políticas básicas não funcionarem

-- OPÇÃO 1: RLS mais permissivo (recomendado para desenvolvimento)
-- ===================================================

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;

-- Política simples: usuários autenticados podem ver todos os perfis
CREATE POLICY "Allow authenticated users to view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Usuários podem editar apenas seu próprio perfil
CREATE POLICY "Allow users to update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Allow users to insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ===================================================
-- OPÇÃO 2: RLS baseado em roles (mais seguro)
-- ===================================================

/*
-- Se você quiser usar roles específicos, descomente:

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'gerente', 'supervisor')
        )
    );

-- Funcionários podem ver outros funcionários
CREATE POLICY "Employees can view employee profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        is_employee = true AND
        status = 'active'
    );

-- Próprio perfil sempre visível
CREATE POLICY "Users can always view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
*/

-- ===================================================
-- OPÇÃO 3: Sem RLS (apenas para desenvolvimento/debug)
-- ===================================================

/*
-- ATENÇÃO: Use apenas para desenvolvimento!
-- Remove todas as restrições de acesso

DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Para reabilitar depois:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
*/

-- ===================================================
-- FUNÇÕES AUXILIARES PARA DEBUG
-- ===================================================

-- Função para verificar acesso do usuário atual
CREATE OR REPLACE FUNCTION public.debug_user_access()
RETURNS TABLE (
    current_user_id UUID,
    current_user_email TEXT,
    can_see_profiles BIGINT,
    total_profiles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        auth.uid() as current_user_id,
        (SELECT email FROM auth.users WHERE id = auth.uid()) as current_user_email,
        (SELECT COUNT(*) FROM public.profiles) as can_see_profiles,
        (SELECT COUNT(*) FROM public.profiles) as total_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para listar políticas ativas
CREATE OR REPLACE FUNCTION public.list_rls_policies()
RETURNS TABLE (
    policy_name TEXT,
    command TEXT,
    permissive TEXT,
    roles TEXT[],
    using_expression TEXT,
    check_expression TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pg_policies.policyname::TEXT,
        pg_policies.cmd::TEXT,
        pg_policies.permissive::TEXT,
        pg_policies.roles,
        pg_policies.qual::TEXT,
        pg_policies.with_check::TEXT
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles';
END;
$$ LANGUAGE plpgsql;

-- ===================================================
-- COMANDOS DE TESTE
-- ===================================================

-- Testar acesso do usuário atual
SELECT * FROM public.debug_user_access();

-- Listar políticas ativas
SELECT * FROM public.list_rls_policies();

-- Testar query básica (deve funcionar após configurar RLS)
SELECT id, email, name, role, department
FROM public.profiles
WHERE is_employee = true
ORDER BY name;

-- ===================================================
-- RESET COMPLETO (se algo der errado)
-- ===================================================

/*
-- Execute apenas se precisar resetar tudo:

-- 1. Remover todas as políticas
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Desabilitar RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Criar política simples
CREATE POLICY "Allow all access" ON public.profiles USING (true);
*/