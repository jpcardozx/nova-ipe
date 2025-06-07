#!/bin/bash

echo "🏗️  CONSOLIDAÇÃO ARQUITETURAL DEFINITIVA - NOVA IPÊ"
echo "=================================================="

# PASSO 1: Backup do estado atual
echo "📦 Criando backup arquitetural..."
cp -r app/components/ui app/components/ui.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# PASSO 2: Identificar e corrigir imports conflitantes
echo "🔍 Corrigindo imports conflitantes..."

# Encontrar todos os arquivos que importam de app/components/ui
echo "   → Buscando imports problemáticos..."
grep -r "from '@/app/components/ui/" . --include="*.tsx" --include="*.ts" | head -5

# PASSO 3: Validar componentes essenciais
echo "✅ Validando componentes essenciais..."

ESSENTIAL_COMPONENTS=(
    "components/ui/button.tsx"
    "components/ui/card.tsx" 
    "components/ui/badge.tsx"
    "components/ui/carousel.tsx"
    "components/ui/toaster.tsx"
)

for component in "${ESSENTIAL_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "   ✅ $component"
    else
        echo "   ❌ $component MISSING"
    fi
done

# PASSO 4: Verificar exports problemáticos
echo "🎯 Verificando exports problemáticos..."

CRITICAL_FILES=(
    "app/components/PremiumHero-improved.tsx"
    "app/sections/ValorAprimoradoV4.tsx"
    "app/components/BlocoExploracaoSimbolica.tsx"
    "app/components/FormularioContatoModerno.tsx"
    "app/sections/FooterAprimorado.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "export default" "$file"; then
            echo "   ✅ $file"
        else
            echo "   ❌ $file - MISSING export default"
        fi
    else
        echo "   ❓ $file - FILE NOT FOUND"
    fi
done

echo ""
echo "💡 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Remover /app/components/ui/ completamente"
echo "2. Corrigir todos os imports para @/components/ui/"
echo "3. Adicionar exports ausentes"
echo "4. Validar build"
echo ""
