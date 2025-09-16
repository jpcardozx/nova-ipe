-- ===================================================
-- CORREÇÃO DE PROBLEMAS DE AUTENTICAÇÃO
-- ===================================================
-- Para resolver "Invalid login credentials" e problemas de sessão

-- 1. VERIFICAR STATUS DA AUTENTICAÇÃO
-- ===================================================

-- Ver usuários autenticados atualmente
SELECT
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at,
    user_metadata
FROM auth.users
ORDER BY last_sign_in_at DESC
LIMIT 10;

-- Ver sessões ativas
SELECT
    user_id,
    created_at,
    updated_at,
    expires_at,
    CASE
        WHEN expires_at > now() THEN 'VÁLIDA'
        ELSE 'EXPIRADA'
    END as status
FROM auth.sessions
ORDER BY updated_at DESC
LIMIT 10;

-- 2. VERIFICAR USUÁRIO ESPECÍFICO
-- ===================================================

-- Substitua 'seu-email@exemplo.com' pelo seu email real
SELECT
    id,
    email,
    email_confirmed_at,
    phone_confirmed_at,
    last_sign_in_at,
    created_at,
    user_metadata,
    CASE
        WHEN email_confirmed_at IS NOT NULL THEN 'EMAIL CONFIRMADO ✅'
        ELSE 'EMAIL NÃO CONFIRMADO ❌'
    END as email_status
FROM auth.users
WHERE email = 'jpcardozoo0106@gmail.com'; -- Substitua pelo seu email

-- 3. VERIFICAR PERFIL CORRESPONDENTE
-- ===================================================

-- Ver se existe perfil para o usuário autenticado
SELECT
    p.id,
    p.email,
    p.full_name,
    p.is_active,
    p.is_approved,
    p.department,
    p.role,
    u.email as auth_email,
    u.last_sign_in_at
FROM public.profiles p
FULL OUTER JOIN auth.users u ON p.id = u.id
WHERE u.email = 'jpcardozoo0106@gmail.com' -- Substitua pelo seu email
   OR p.email = 'jpcardozoo0106@gmail.com';

-- 4. SINCRONIZAR PERFIL COM AUTH (se necessário)
-- ===================================================

-- Se seu perfil não existe, criar um baseado no auth.users
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    is_active,
    is_approved,
    department,
    role,
    created_at
)
SELECT
    u.id,
    u.email,
    COALESCE(u.user_metadata->>'full_name', u.user_metadata->>'name', split_part(u.email, '@', 1)) as full_name,
    true as is_active,
    true as is_approved,
    'Tech' as department,
    'user' as role,
    u.created_at
FROM auth.users u
WHERE u.email = 'jpcardozoo0106@gmail.com' -- Substitua pelo seu email
  AND NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- 5. CORRIGIR PERFIL EXISTENTE (se necessário)
-- ===================================================

-- Garantir que seu perfil está ativo e aprovado
UPDATE public.profiles
SET
    is_active = true,
    is_approved = true,
    updated_at = now()
WHERE email = 'jpcardozoo0106@gmail.com'; -- Substitua pelo seu email

-- 6. VERIFICAR RLS PARA SEU USUÁRIO
-- ===================================================

-- Testar se você consegue ver seu próprio perfil
SELECT
    id,
    email,
    full_name,
    is_active,
    is_approved,
    department,
    role
FROM public.profiles
WHERE id = (SELECT id FROM auth.users WHERE email = 'jpcardozoo0106@gmail.com'); -- Substitua pelo seu email

-- 7. LIMPAR SESSÕES EXPIRADAS (opcional)
-- ===================================================

-- Remover sessões antigas/expiradas
DELETE FROM auth.sessions
WHERE expires_at < now() - interval '1 day';

-- 8. RESETAR RLS TEMPORARIAMENTE (apenas para debug)
-- ===================================================

/*
-- CUIDADO: Use apenas para debug! Remove todas as restrições
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Testar se consegue ver todos os perfis
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT id, email, full_name, is_active, is_approved FROM public.profiles LIMIT 5;

-- Reabilitar RLS depois
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
*/

-- 9. POLÍTICA RLS ESPECÍFICA PARA USUÁRIOS ATIVOS
-- ===================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "allow_active_users_to_view_profiles" ON public.profiles;

-- Criar política mais permissiva para usuários ativos
CREATE POLICY "allow_active_users_to_view_profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.profiles own_profile
            WHERE own_profile.id = auth.uid()
            AND own_profile.is_active = true
        )
    );

-- 10. VERIFICAÇÃO FINAL
-- ===================================================

-- Contar perfis visíveis após as correções
SELECT
    COUNT(*) as perfis_visiveis,
    (SELECT COUNT(*) FROM public.profiles WHERE is_active = true AND is_approved = true) as perfis_ativos_aprovados,
    (SELECT COUNT(*) FROM public.profiles) as total_perfis,
    auth.uid() as meu_id,
    auth.email() as meu_email;

-- Listar perfis que você pode ver
SELECT
    id,
    email,
    full_name,
    department,
    role,
    is_active,
    is_approved,
    CASE
        WHEN id = auth.uid() THEN 'MEU PERFIL 👤'
        ELSE 'OUTRO USUÁRIO 👥'
    END as tipo
FROM public.profiles
ORDER BY (id = auth.uid()) DESC, full_name
LIMIT 10;

-- ===================================================
-- COMANDOS ÚTEIS PARA TROUBLESHOOTING
-- ===================================================

-- Ver estrutura da tabela profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver todas as políticas RLS ativas
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Ver configurações do RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';