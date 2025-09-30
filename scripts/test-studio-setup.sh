#!/bin/bash

echo "🔍 Testando configuração do login para Studio..."
echo ""

# Verificar se as variáveis estão definidas
echo "1. Verificando variáveis de ambiente:"
echo "   - ADMIN_PASS: $([ -n "$ADMIN_PASS" ] && echo "✅ Definida" || echo "❌ Não definida")"
echo "   - NEXT_PUBLIC_SANITY_PROJECT_ID: $([ -n "$NEXT_PUBLIC_SANITY_PROJECT_ID" ] && echo "✅ Definida" || echo "❌ Não definida")"
echo "   - NEXT_PUBLIC_SANITY_DATASET: $([ -n "$NEXT_PUBLIC_SANITY_DATASET" ] && echo "✅ Definida" || echo "❌ Não definida")"
echo ""

# Verificar se os arquivos de API existem
echo "2. Verificando arquivos de API:"
echo "   - /api/login: $([ -f "app/api/login/route.ts" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo "   - /api/auth/check-studio: $([ -f "app/api/auth/check-studio/route.ts" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo "   - /api/logout: $([ -f "app/api/logout/route.ts" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo ""

# Verificar se os componentes principais existem
echo "3. Verificando componentes principais:"
echo "   - Studio page: $([ -f "app/studio/page.tsx" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo "   - Structure redirect: $([ -f "app/structure/page.tsx" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo "   - Enhanced Auth Manager: $([ -f "lib/auth/enhanced-auth-manager.ts" ] && echo "✅ Existe" || echo "❌ Não existe")"
echo ""

echo "✅ Verificação concluída!"
echo ""
echo "🚀 Para testar o login do Studio:"
echo "   1. Acesse http://localhost:3000/login?mode=studio"
echo "   2. Use qualquer email válido"
echo "   3. Use a senha: ipeplataformadigital"
echo "   4. O sistema deve redirecionar para /studio"