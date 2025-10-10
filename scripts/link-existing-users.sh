#!/bin/bash
# Script para vincular usuários existentes do auth.users com user_profiles
# Cria os registros de user_profiles para usuários que já existem

PROJECT_REF="ifhfpaehnjpdwdocdzwd"

# URL encode da senha
PASSWORD_ENCODED=$(echo -n "$SUPABASE_DB_PASSWORD" | jq -sRr @uri)
CONN_URL="postgresql://postgres:${PASSWORD_ENCODED}@db.${PROJECT_REF}.supabase.co:5432/postgres"

echo "🔗 Vinculando usuários existentes do auth.users com user_profiles..."
echo ""

# Verificar senha
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "❌ SUPABASE_DB_PASSWORD não configurada!"
  exit 1
fi

echo "✅ Conectando ao Supabase..."
echo ""

# Executar vinculação
psql "$CONN_URL" << 'EOF'
-- Criar user_profiles para todos os usuários de auth.users que não têm perfil
INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  role,
  auth_user_id,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 
           SPLIT_PART(au.email, '@', 1)) as full_name,
  'user' as role,
  au.id as auth_user_id,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (email) DO UPDATE SET
  auth_user_id = EXCLUDED.auth_user_id,
  updated_at = NOW();

-- Verificar resultado
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ USUÁRIOS VINCULADOS'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
  up.id,
  up.email,
  up.full_name,
  up.role,
  up.auth_user_id IS NOT NULL as linked
FROM public.user_profiles up
ORDER BY up.created_at DESC;

\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
EOF

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Vinculação concluída com sucesso!"
  echo ""
  echo "📋 Próximo passo:"
  echo "  Testar login em: http://localhost:3000/login"
  echo ""
  echo "📧 Usuários disponíveis:"
  echo "  - jlpaula@imobiliariaipe.com.br"
  echo "  - julia@imobiliariaipe.com.br"
  echo "  - leonardo@imobiliariaipe.com.br"
  echo "  - jpcardozo@imobiliariaipe.com.br"
  echo ""
else
  echo ""
  echo "❌ Erro ao vincular usuários!"
  exit 1
fi
