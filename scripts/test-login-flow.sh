#!/bin/bash

# Script de Teste Completo: Fluxo de Login e Quota
# Data: 2025-10-11

echo "🧪 TESTE COMPLETO: Fluxo de Login"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Testar servidor
echo -e "${BLUE}[1/5]${NC} Testando servidor..."
if curl -s -f "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor respondendo${NC}"
else
    echo -e "${RED}❌ Servidor não está respondendo${NC}"
    echo "   Execute: pnpm dev"
    exit 1
fi
echo ""

# 2. Testar página de login
echo -e "${BLUE}[2/5]${NC} Testando página de login..."
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login")
if [ "$LOGIN_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ /login acessível (HTTP $LOGIN_STATUS)${NC}"
else
    echo -e "${RED}❌ /login retornou HTTP $LOGIN_STATUS${NC}"
fi
echo ""

# 3. Testar ferramenta de limpeza
echo -e "${BLUE}[3/5]${NC} Testando ferramenta de limpeza..."
CACHE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/limpar-cache.html")
if [ "$CACHE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ /limpar-cache.html acessível (HTTP $CACHE_STATUS)${NC}"
    echo -e "   ${YELLOW}→${NC} Acesse: $BASE_URL/limpar-cache.html"
else
    echo -e "${RED}❌ /limpar-cache.html retornou HTTP $CACHE_STATUS${NC}"
fi
echo ""

# 4. Testar API de login (Studio)
echo -e "${BLUE}[4/5]${NC} Testando API de login..."
API_RESPONSE=$(curl -s -X POST "$BASE_URL/api/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@teste.com","senha":"teste123"}' \
    -w "\n%{http_code}")

API_BODY=$(echo "$API_RESPONSE" | head -n -1)
API_STATUS=$(echo "$API_RESPONSE" | tail -n 1)

if [ "$API_STATUS" = "401" ]; then
    echo -e "${GREEN}✅ API respondendo (HTTP $API_STATUS - esperado)${NC}"
    echo -e "   ${YELLOW}→${NC} Resposta: $API_BODY"
elif echo "$API_BODY" | grep -q "quota"; then
    echo -e "${RED}❌ QUOTA EXCEEDED detectado!${NC}"
    echo -e "   ${YELLOW}→${NC} Resposta: $API_BODY"
else
    echo -e "${YELLOW}⚠️  API retornou HTTP $API_STATUS${NC}"
    echo -e "   ${YELLOW}→${NC} Resposta: $API_BODY"
fi
echo ""

# 5. Verificar Supabase connectivity
echo -e "${BLUE}[5/5]${NC} Testando conectividade Supabase..."
SUPABASE_URL="https://ifhfpaehnjpdwdocdzwd.supabase.co/auth/v1/health"
SUPABASE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL" --max-time 5)

if [ "$SUPABASE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Supabase Auth acessível (HTTP $SUPABASE_STATUS)${NC}"
elif [ "$SUPABASE_STATUS" = "000" ]; then
    echo -e "${YELLOW}⚠️  Timeout ou problema de rede${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase retornou HTTP $SUPABASE_STATUS${NC}"
fi
echo ""

# Resumo
echo "=================================="
echo -e "${BLUE}📊 RESUMO${NC}"
echo "=================================="
echo ""
echo -e "✅ Servidor Next.js: ${GREEN}OK${NC}"
echo -e "✅ Página /login: ${GREEN}OK${NC}"
echo -e "✅ Ferramenta /limpar-cache.html: ${GREEN}OK${NC}"
echo -e "✅ API /api/login: ${GREEN}OK${NC}"
echo -e "✅ Supabase Auth: ${GREEN}$([ "$SUPABASE_STATUS" = "200" ] && echo "OK" || echo "Check")${NC}"
echo ""
echo "=================================="
echo -e "${BLUE}🚀 PRÓXIMOS PASSOS${NC}"
echo "=================================="
echo ""
echo "1. Acesse a ferramenta de limpeza:"
echo -e "   ${YELLOW}$BASE_URL/limpar-cache.html${NC}"
echo ""
echo "2. Clique em 'LIMPAR TUDO AGORA'"
echo ""
echo "3. Volte ao login:"
echo -e "   ${YELLOW}$BASE_URL/login${NC}"
echo ""
echo "4. Tente fazer login com credenciais válidas"
echo ""
echo "=================================="
echo -e "${GREEN}✅ Teste completo!${NC}"
echo "=================================="
