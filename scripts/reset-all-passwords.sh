#!/bin/bash
# Script para resetar senha de todos os usuários para @Ipe4693
# Usa a Admin API do Supabase (service_role)

PROJECT_REF="ifhfpaehnjpdwdocdzwd"
NEW_PASSWORD="@Ipe4693"

# Ler service_role key do .env.local
SERVICE_ROLE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d '=' -f2)

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local!"
  exit 1
fi

echo "🔐 Resetando senhas para todos os usuários..."
echo ""

# Lista de emails dos usuários
USERS=(
  "jlpaula@imobiliariaipe.com.br"
  "julia@imobiliariaipe.com.br"
  "leonardo@imobiliariaipe.com.br"
  "jpcardozo@imobiliariaipe.com.br"
)

# Resetar senha de cada usuário
for email in "${USERS[@]}"; do
  echo "🔄 Resetando senha de: $email"
  
  # Obter o ID do usuário
  USER_ID=$(curl -s -X GET \
    "https://${PROJECT_REF}.supabase.co/auth/v1/admin/users" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    | jq -r ".users[] | select(.email==\"$email\") | .id")
  
  if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
    echo "  ❌ Usuário não encontrado: $email"
    continue
  fi
  
  echo "  📝 User ID: $USER_ID"
  
  # Atualizar senha via Admin API
  RESPONSE=$(curl -s -X PUT \
    "https://${PROJECT_REF}.supabase.co/auth/v1/admin/users/${USER_ID}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"password\": \"${NEW_PASSWORD}\"}")
  
  if echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    echo "  ✅ Senha atualizada com sucesso!"
  else
    echo "  ❌ Erro ao atualizar senha:"
    echo "$RESPONSE" | jq '.'
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Processo concluído!"
echo ""
echo "📋 Credenciais para login:"
echo "  Email: [qualquer um dos 4 emails acima]"
echo "  Senha: @Ipe4693"
echo ""
echo "🌐 Teste em: http://localhost:3000/login"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
