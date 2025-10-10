#!/bin/bash
# Script para aplicar migration Supabase Auth via psql
# Conecta diretamente ao Supabase e aplica a migration

PROJECT_REF="ifhfpaehnjpdwdocdzwd"

# URL encode da senha para evitar problemas com caracteres especiais
PASSWORD_ENCODED=$(echo -n "$SUPABASE_DB_PASSWORD" | jq -sRr @uri)

# Connection strings alternativas
POOLER_URL="postgresql://postgres.${PROJECT_REF}:${PASSWORD_ENCODED}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:${PASSWORD_ENCODED}@db.${PROJECT_REF}.supabase.co:5432/postgres"

# Tentar direct connection
CONN_URL="$DIRECT_URL"

echo "🚀 Aplicando Supabase Auth Migration..."
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

echo "📦 Backup: backups/supabase/backup_20251010_133340_pre_auth_migration.sql"
echo "📄 Migration: supabase/migrations/20251010_supabase_auth_migration.sql"
echo ""
read -p "Continuar? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Cancelado pelo usuário"
  exit 1
fi

echo ""
echo "✅ Conectando ao Supabase e aplicando migration..."
echo ""

# Aplicar migration
psql "$CONN_URL" < supabase/migrations/20251010_supabase_auth_migration.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Migration aplicada com sucesso!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📋 Verificando resultado..."
  echo ""
  
  # Verificar resultado
  psql "$CONN_URL" << 'EOF'
SELECT 
  (SELECT COUNT(*) FROM public.user_profiles) as total_profiles,
  (SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  )) as trigger_exists,
  (SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'auth_user_id'
  )) as auth_column_exists;
EOF

  echo ""
  echo "✅ Próximos passos:"
  echo "  1. Verificar usuários: ./scripts/check-supabase-auth-status.sh"
  echo "  2. Testar login: http://localhost:3000/login"
  echo ""
else
  echo ""
  echo "❌ Erro ao aplicar migration!"
  echo "Verifique os logs acima para detalhes."
  exit 1
fi
