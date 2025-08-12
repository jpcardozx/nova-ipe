#!/bin/bash

echo "🚨 EMERGENCY RECOVERY - Nova Ipê"
echo "======================================"

# 1. Parar servidores
echo "1. Parando servidores..."
taskkill /F /IM node.exe 2>/dev/null || true

# 2. Limpeza
echo "2. Limpando cache e build..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# 3. Reinstalar dependências críticas
echo "3. Instalando dependências críticas..."
pnpm add critters @next/bundle-analyzer

# 4. Teste básico
echo "4. Testando servidor..."
pnpm dev --port 3002 &

echo ""
echo "✅ RECOVERY INICIADO"
echo "📊 Teste: http://localhost:3002"
echo "🔧 Config: next.config.js simplificado"
echo "⚡ Web Vitals: Componentes otimizados prontos"
echo ""
echo "PRÓXIMOS PASSOS:"
echo "1. Verificar se servidor carrega sem erros"
echo "2. Testar PropertyCardOptimized nos cards"  
echo "3. Medir Web Vitals com Lighthouse"
echo "4. Ativar otimizações gradualmente"
