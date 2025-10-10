#!/bin/bash
# Script para verificar e aplicar migration Supabase Auth
# Conecta diretamente ao Supabase via psql

PROJECT_REF="ifhfpaehnjpdwdocdzwd"

# URL encode da senha para evitar problemas com caracteres especiais
PASSWORD_ENCODED=$(echo -n "$SUPABASE_DB_PASSWORD" | jq -sRr @uri)

# Connection strings alternativas
POOLER_URL="postgresql://postgres.${PROJECT_REF}:${PASSWORD_ENCODED}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:${PASSWORD_ENCODED}@db.${PROJECT_REF}.supabase.co:5432/postgres"

# Tentar pooler primeiro, depois direct
CONN_URL="$DIRECT_URL"

echo "🔍 Verificando usuários existentes no Supabase Auth..."
echo ""

# Verificar se temos a senha
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "❌ SUPABASE_DB_PASSWORD não configurada!"
  echo ""
  echo "Configure com:"
  echo "  export SUPABASE_DB_PASSWORD='sua_senha_aqui'"
  echo ""
  echo "Ou obtenha em:"
  echo "  https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database"
  exit 1
fi

echo "✅ Conectando ao Supabase..."
echo ""

# Executar consulta para ver usuários existentes
psql "$CONN_URL" << 'EOF'
-- 1. Ver usuários existentes
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 USUÁRIOS EXISTENTES NO AUTH.USERS'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as confirmed,
  created_at::date as created,
  last_sign_in_at::date as last_login
FROM auth.users
ORDER BY created_at DESC;

-- 2. Ver user_profiles existentes
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '📊 USER_PROFILES EXISTENTES'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
  id,
  email,
  full_name,
  role,
  auth_user_id,
  created_at::date as created
FROM public.user_profiles
ORDER BY created_at DESC;

-- 3. Ver status da migration
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '🔍 STATUS DA MIGRATION'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
  'Trigger exists' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) as status;

SELECT 
  'auth_user_id column exists' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'auth_user_id'
  ) as status;

-- 4. Ver usuários que precisam ser vinculados
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '⚠️  USUÁRIOS SEM VINCULAÇÃO'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
  au.id as auth_id,
  au.email as auth_email,
  up.id as profile_id,
  up.email as profile_email,
  up.auth_user_id
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.email = up.email
WHERE up.auth_user_id IS NULL OR up.auth_user_id != au.id
ORDER BY au.created_at DESC;

EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verificação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "  1. Se trigger não existe: aplicar migration SQL"
echo "  2. Se há usuários sem vinculação: executar script de vinculação"
echo ""
