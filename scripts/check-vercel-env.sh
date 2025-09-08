#!/bin/bash

# Script para verificar configuração do Supabase na Vercel
# Uso: ./check-vercel-env.sh

echo "🔍 Verificando configuração do Supabase para Vercel..."
echo "=================================================="

# Verificar se vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instale com: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI encontrado"

# Verificar variáveis de ambiente
echo ""
echo "📋 Variáveis de ambiente configuradas:"
echo "----------------------------------------"

vercel env ls

echo ""
echo "🔧 Variáveis necessárias para Supabase:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY" 
echo "- NEXT_PUBLIC_SITE_URL"

echo ""
echo "💡 Para adicionar variáveis faltantes:"
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "vercel env add NEXT_PUBLIC_SITE_URL"

echo ""
echo "🚀 Para fazer redeploy após adicionar variáveis:"
echo "vercel --prod"

echo ""
echo "📖 Documentação completa em: docs/SUPABASE_VERCEL_FIX.md"
