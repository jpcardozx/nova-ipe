-- ===================================================
-- CONFIGURAÇÃO RLS PARA TABELA PROFILES
-- ===================================================
-- Execute estes comandos no SQL Editor do Supabase
-- para permitir que funcionários vejam perfis uns dos outros

-- 1. Garantir que a tabela profiles existe com estrutura básica
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    department TEXT,
    status TEXT DEFAULT 'active',
    is_employee BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes (caso existam)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Employees can view all employee profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 4. POLÍTICA PRINCIPAL: Funcionários podem ver perfis de outros funcionários
CREATE POLICY "Employees can view all employee profiles" ON public.profiles
    FOR SELECT USING (
        -- Permitir se o usuário está autenticado E
        auth.uid() IS NOT NULL AND
        -- O perfil que está sendo visualizado é de um funcionário
        (is_employee = true OR is_employee IS NULL)
    );

-- 5. POLÍTICA: Usuários podem ver e editar seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 6. POLÍTICA: Usuários podem inserir seu próprio perfil (para novos registros)
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. FUNÇÃO: Auto-criar perfil quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, full_name, is_employee, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        true, -- Por padrão, novos usuários são funcionários
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER: Executar função quando usuário se cadastra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. FUNÇÃO: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. TRIGGER: Atualizar timestamp quando perfil é modificado
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ===================================================
-- INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- ===================================================
-- Descomente e execute se quiser criar perfis de exemplo

/*
-- Inserir alguns perfis de exemplo para teste
INSERT INTO public.profiles (id, email, name, full_name, role, department, is_employee)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'gerente@empresa.com', 'João Silva', 'João Silva Santos', 'gerente', 'Administração', true),
    ('22222222-2222-2222-2222-222222222222', 'vendedor1@empresa.com', 'Maria Santos', 'Maria Santos Silva', 'vendedor', 'Vendas', true),
    ('33333333-3333-3333-3333-333333333333', 'vendedor2@empresa.com', 'Pedro Costa', 'Pedro Costa Lima', 'vendedor', 'Vendas', true),
    ('44444444-4444-4444-4444-444444444444', 'assistente@empresa.com', 'Ana Oliveira', 'Ana Oliveira Rocha', 'assistente', 'Administrativo', true)
ON CONFLICT (id) DO NOTHING;
*/

-- ===================================================
-- VERIFICAÇÕES E TESTES
-- ===================================================

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Listar políticas criadas
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Testar contagem de perfis (deve mostrar todos os funcionários)
SELECT COUNT(*) as total_profiles FROM public.profiles WHERE is_employee = true;

-- ===================================================
-- COMANDOS ÚTEIS PARA TROUBLESHOOTING
-- ===================================================

-- Se quiser desabilitar RLS temporariamente (CUIDADO!)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Se quiser ver todos os perfis sem restrição (como admin)
-- SELECT * FROM public.profiles;

-- Se quiser resetar completamente as políticas
-- DROP POLICY IF EXISTS "Employees can view all employee profiles" ON public.profiles;
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;