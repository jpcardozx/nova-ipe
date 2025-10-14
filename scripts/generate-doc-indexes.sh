#!/bin/bash

# Gera índices para cada pasta de documentação

echo "📚 Gerando índices de documentação..."
echo ""

# Função para criar índice
create_index() {
    local dir=$1
    local title=$2
    local emoji=$3
    local description=$4
    
    local index_file="$dir/README.md"
    
    echo "# $emoji $title" > "$index_file"
    echo "" >> "$index_file"
    echo "$description" >> "$index_file"
    echo "" >> "$index_file"
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    echo "## 📋 Arquivos Disponíveis" >> "$index_file"
    echo "" >> "$index_file"
    
    # Lista arquivos .md (exceto README)
    local count=0
    for file in "$dir"*.md; do
        if [ -f "$file" ] && [ "$(basename "$file")" != "README.md" ]; then
            count=$((count + 1))
            local filename=$(basename "$file")
            echo "$count. [\`$filename\`](./$filename)" >> "$index_file"
        fi
    done
    
    echo "" >> "$index_file"
    echo "---" >> "$index_file"
    echo "" >> "$index_file"
    echo "**Total:** $count arquivo(s)" >> "$index_file"
    echo "" >> "$index_file"
    echo "[↩️ Voltar para documentação principal](../README.md)" >> "$index_file"
    
    echo "✅ Índice criado: $index_file ($count arquivos)"
}

# Cria índices para cada categoria
create_index "docs/autenticacao/" "Autenticação" "🔐" \
"Documentação sobre sistema de autenticação, login, sessões e segurança."

create_index "docs/migracao/" "Migração & Infraestrutura" "🔄" \
"Migrações de banco de dados, configurações de infraestrutura e deploys."

create_index "docs/sistema-chaves/" "Sistema de Gestão de Chaves" "🔑" \
"Sistema completo de gerenciamento de entregas de chaves para imóveis."

create_index "docs/wordpress-catalog/" "WordPress Catalog" "📸" \
"Catálogo de imóveis WordPress e migração de fotos para Cloudflare R2."

create_index "docs/jetimob/" "Integração Jetimob" "🏢" \
"Integração com API Jetimob para sincronização de imóveis."

create_index "docs/ui-ux/" "UI/UX & Design" "🎨" \
"Sistema de design, componentes visuais e melhorias de interface."

create_index "docs/performance/" "Performance & Otimização" "⚡" \
"Otimizações de performance, análises e melhorias de carregamento."

create_index "docs/troubleshooting/" "Troubleshooting & Fixes" "🔧" \
"Correções de bugs, debug, soluções de problemas e diagnósticos."

create_index "docs/arquivos-antigos/" "Arquivos Históricos" "📦" \
"Relatórios antigos, resumos históricos e documentação de arquivo."

echo ""
echo "✅ Todos os índices foram criados!"
echo ""
