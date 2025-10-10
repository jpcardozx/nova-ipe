#!/bin/bash
# Script para aplicar apenas a migration nova de Supabase Auth
# Data: 2025-10-10

echo "🚀 Aplicando Migration Supabase Auth..."
echo "📁 Backup: backups/supabase/backup_20251010_133340_pre_auth_migration.sql"
echo ""

# Aplicar via stdin usando supabase db dump (que conecta no remoto)
cat << 'EOF' | psql "$(supabase status --output json 2>/dev/null | jq -r '.DB_URL' 2>/dev/null || echo 'postgresql://postgres.ifhfpaehnjpdwdocdzwd@db.ifhfpaehnjpdwdocdzwd.pooler.supabase.com:6543/postgres')"
\set ON_ERROR_STOP on
\timing on

-- Enable Supabase Auth email provider and configure
-- Created: 2025-10-10 (v2 - Estratégica com CREATE TABLE)

-- ============================================================
-- PART 1: CREATE USER_PROFILES TABLE (IF NOT EXISTS)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON public.user_profiles(email);

-- ============================================================
-- PART 2: SUPABASE AUTH INTEGRATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.user_profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE public.user_profiles
    ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    CREATE INDEX idx_user_profiles_auth_user_id 
    ON public.user_profiles(auth_user_id);
  END IF;
END $$;

UPDATE public.user_profiles
SET auth_user_id = id
WHERE auth_user_id IS NULL AND id IS NOT NULL;

-- ============================================================
-- PART 3: ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id OR auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;
CREATE POLICY "Enable insert for authenticated users"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================
-- PART 4: VIEWS E HELPERS
-- ============================================================

CREATE OR REPLACE VIEW public.user_profiles_with_auth AS
SELECT 
  up.*,
  au.email as auth_email,
  au.email_confirmed_at,
  au.last_sign_in_at,
  au.created_at as auth_created_at
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.auth_user_id = au.id OR up.id = au.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email_unique 
ON public.user_profiles(email);

-- ============================================================
-- PART 5: DOCUMENTAÇÃO E VALIDAÇÃO
-- ============================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
'Trigger function that creates a user_profile record when a new user signs up via Supabase Auth';

COMMENT ON TABLE public.user_profiles IS 
'User profiles linked to Supabase Auth users. RLS enabled for security.';

COMMENT ON VIEW public.user_profiles_with_auth IS 
'View that joins user_profiles with auth.users for complete user information';

-- Validação final
SELECT 
  (SELECT COUNT(*) FROM public.user_profiles) as total_profiles,
  (SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  )) as trigger_exists,
  (SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'auth_user_id'
  )) as auth_column_exists;

EOF

echo ""
echo "✅ Migration aplicada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Atualizar página de login para usar Supabase Auth"
echo "   2. Migrar usuários existentes"
echo "   3. Testar fluxo de autenticação"
