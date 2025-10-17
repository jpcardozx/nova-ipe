#!/bin/bash

# 🚑 Setup Rápido para Recuperação de Imóveis
# Execute este script para configurar tudo automaticamente

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🚑 Setup de Recuperação de Imóveis - Ipê Imóveis           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verifica se .env.local existe
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    touch .env.local
fi

# Verifica se já tem o token
if grep -q "SANITY_API_TOKEN" .env.local 2>/dev/null; then
    echo "✅ SANITY_API_TOKEN já está configurado!"
    echo ""
    echo "🚀 Pronto para recuperar! Execute:"
    echo "   node scripts/recover-imovel-interactive.js"
    echo ""
    exit 0
fi

echo "⚠️  Token do Sanity não encontrado!"
echo ""
echo "📋 Para configurar:"
echo ""
echo "1️⃣  Abra este link no navegador:"
echo "   https://www.sanity.io/manage/personal/project/0nks58lj/api/tokens"
echo ""
echo "2️⃣  Clique em 'Add API token'"
echo "   - Name: Recovery Script"
echo "   - Permissions: Editor"
echo ""
echo "3️⃣  Copie o token gerado"
echo ""
echo "4️⃣  Digite ou cole o token abaixo:"
echo ""
read -p "Token: " token

if [ -z "$token" ]; then
    echo ""
    echo "❌ Token vazio. Operação cancelada."
    exit 1
fi

# Adiciona ao .env.local
echo "" >> .env.local
echo "# Token para recuperação de imóveis deletados" >> .env.local
echo "SANITY_API_TOKEN=$token" >> .env.local

echo ""
echo "✅ Token configurado com sucesso!"
echo ""
echo "🚀 Agora execute:"
echo "   node scripts/recover-imovel-interactive.js"
echo ""
