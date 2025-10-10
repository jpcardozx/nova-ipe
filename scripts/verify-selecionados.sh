#!/bin/bash

# Script de Verificação: "selecionados" vs "seleçionados"
# Verifica se há uso incorreto da palavra "selecionados" com cedilha

set -e

echo "🔍 Verificação de Ortografia: selecionados vs seleçionados"
echo "============================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

echo "📂 Buscando arquivos TypeScript/JavaScript..."
FILES_TO_CHECK=$(find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./.git/*" \
  ! -path "./dist/*" \
  ! -path "./build/*")

echo "✅ ${#FILES_TO_CHECK[@]} arquivos encontrados para verificação"
echo ""

echo "🔎 Procurando por 'seleçionado' (com cedilha - INCORRETO)..."
echo ""

# Busca por padrão incorreto
RESULTS=$(grep -rn "seleçionado" \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.jsx" \
  --include="*.js" \
  . 2>/dev/null | \
  grep -v "node_modules" | \
  grep -v ".git" | \
  grep -v ".next" || true)

if [ -z "$RESULTS" ]; then
    echo -e "${GREEN}✅ SUCESSO: Nenhuma instância incorreta encontrada!${NC}"
    echo ""
    echo "📊 Resumo:"
    echo "   - Ortografia incorreta 'seleçionados': 0 ocorrências"
    echo "   - Status: ✅ APROVADO"
else
    echo -e "${RED}❌ ERRO: Encontradas instâncias incorretas de 'seleçionado(s)'${NC}"
    echo ""
    echo "Arquivos com erro:"
    echo "$RESULTS"
    echo ""
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔍 Verificando uso correto de 'selecionado' (com 'c')..."
CORRECT_COUNT=$(grep -rn "selecionado" \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.jsx" \
  --include="*.js" \
  . 2>/dev/null | \
  grep -v "node_modules" | \
  grep -v ".git" | \
  grep -v ".next" | \
  grep -v "seleçionado" | \
  wc -l || echo "0")

if [ "$CORRECT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Encontradas $CORRECT_COUNT instâncias corretas de 'selecionado(s)'${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhuma instância de 'selecionado' encontrada${NC}"
fi

echo ""
echo "============================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 VERIFICAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
    echo ""
    echo "Todas as instâncias de 'selecionado' estão escritas corretamente (com 'c')."
    echo ""
    exit 0
else
    echo -e "${RED}❌ VERIFICAÇÃO FALHOU!${NC}"
    echo ""
    echo "Foram encontradas $ERRORS instância(s) do erro ortográfico."
    echo "Por favor, corrija 'seleçionado' para 'selecionado' nos arquivos listados acima."
    echo ""
    echo "Explicação:"
    echo "  ✅ Correto: 'selecionados' (particípio do verbo 'selecionar')"
    echo "  ❌ Errado: 'seleçionados'"
    echo ""
    exit 1
fi
