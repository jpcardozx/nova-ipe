#!/bin/bash

# Script para corrigir problemas de JSX no arquivo WhatsApp

echo "🔧 Corrigindo problemas de JSX no arquivo WhatsApp..."

FILE="/home/jpcardozx/projetos/nova-ipe/app/dashboard/whatsapp/page.tsx"

# Backup do arquivo original
cp "$FILE" "$FILE.backup"

# Usar sed para corrigir problemas específicos identificados
echo "Corrigindo estrutura JSX..."

# Problema na linha 869 - removendo token extra
sed -i '869s/.*}/      )}/' "$FILE"

# Verificar se os problemas foram corrigidos
echo "Verificando correções..."
npx tsc --noEmit --project /home/jpcardozx/projetos/nova-ipe/tsconfig.json 2>&1 | grep "whatsapp/page.tsx" || echo "✅ Problemas corrigidos!"

echo "Script de correção concluído."