# 🛠️ Comandos Úteis - Documentação

Guia rápido de comandos para trabalhar com a documentação organizada.

---

## 📂 Navegação

### Ver Estrutura
```bash
# Listar todas as categorias
ls -d docs/*/

# Contar arquivos por categoria
for dir in docs/*/; do 
  echo "$(basename "$dir"): $(ls -1 "$dir"*.md 2>/dev/null | wc -l) arquivos"
done

# Ver tamanho de cada categoria
du -sh docs/*/ | sort -h
```

### Acessar Documentação
```bash
# Índice principal
cat docs/README.md

# Categoria específica
cat docs/sistema-chaves/README.md

# Documento específico
cat docs/sistema-chaves/BACKEND_SISTEMA_CHAVES.md
```

---

## 🔍 Busca

### Buscar por Nome de Arquivo
```bash
# Encontrar arquivo específico
find docs/ -name "*CHAVES*.md"

# Encontrar por padrão
find docs/ -name "*AUTH*.md"

# Listar todos os arquivos de uma categoria
ls -1 docs/sistema-chaves/*.md
```

### Buscar por Conteúdo
```bash
# Busca simples
grep -r "palavra-chave" docs/

# Busca case-insensitive
grep -ri "supabase" docs/

# Busca em arquivos .md apenas
grep -r "api" docs/ --include="*.md"

# Busca com contexto (5 linhas antes e depois)
grep -r -C 5 "erro" docs/

# Busca múltiplas palavras
grep -r -E "keys|chaves" docs/
```

### Busca Avançada
```bash
# Encontrar arquivos modificados recentemente
find docs/ -name "*.md" -mtime -7

# Encontrar arquivos grandes
find docs/ -name "*.md" -size +50k

# Buscar e contar ocorrências
grep -r "Supabase" docs/ --include="*.md" | wc -l

# Buscar títulos (linhas que começam com #)
grep -r "^# " docs/ --include="*.md"
```

---

## 📝 Edição

### Abrir Documentos
```bash
# Abrir com editor padrão
$EDITOR docs/sistema-chaves/BACKEND_SISTEMA_CHAVES.md

# Abrir com VS Code
code docs/sistema-chaves/

# Abrir múltiplos arquivos
code docs/sistema-chaves/*.md
```

### Criar Novo Documento
```bash
# Criar na categoria correta
touch docs/categoria/NOVO_DOC.md

# Criar com template básico
cat > docs/categoria/NOVO_DOC.md << 'EOF'
# Título do Documento

## 📋 Contexto
Descrição...

## 🎯 Objetivo
O que queremos...

## ✅ Solução
Como resolver...
EOF

# Regenerar índices após adicionar
bash scripts/generate-doc-indexes.sh
```

---

## 🔄 Manutenção

### Re-organizar Documentação
```bash
# Mover novos arquivos da raiz
bash scripts/organize-docs.sh

# Regenerar todos os índices
bash scripts/generate-doc-indexes.sh

# Verificar arquivos na raiz
ls -1 *.md 2>/dev/null
```

### Limpeza
```bash
# Encontrar arquivos duplicados
find docs/ -name "*.md" -exec md5sum {} \; | sort | uniq -d -w 32

# Encontrar arquivos vazios
find docs/ -name "*.md" -empty

# Remover arquivos de backup
find docs/ -name "*~" -delete
find docs/ -name "*.bak" -delete
```

---

## 📊 Estatísticas

### Contar Documentos
```bash
# Total de arquivos .md
find docs/ -name "*.md" | wc -l

# Por categoria
for dir in docs/*/; do 
  count=$(ls -1 "$dir"*.md 2>/dev/null | wc -l)
  echo "$(basename "$dir"): $count"
done | sort -t: -k2 -rn

# Total de linhas de documentação
find docs/ -name "*.md" -exec wc -l {} \; | awk '{sum+=$1} END {print sum " linhas"}'
```

### Análise de Conteúdo
```bash
# Palavras mais comuns (top 20)
cat docs/**/*.md | tr ' ' '\n' | sort | uniq -c | sort -rn | head -20

# Tamanho médio dos arquivos
find docs/ -name "*.md" -exec wc -l {} \; | awk '{sum+=$1; count++} END {print sum/count " linhas em média"}'

# Categoria mais documentada
du -sh docs/*/ | sort -rh | head -1
```

---

## 🔗 Links e Referências

### Verificar Links
```bash
# Encontrar links internos quebrados
grep -r "\[.*\](\.\/.*\.md)" docs/ --include="*.md" | while read link; do
  file=$(echo "$link" | cut -d: -f1)
  target=$(echo "$link" | grep -o "(\.\/.*\.md)" | tr -d '()')
  target_full=$(dirname "$file")/"$target"
  [ ! -f "$target_full" ] && echo "QUEBRADO: $file -> $target"
done

# Listar todos os links
grep -roh "\[.*\](.*)" docs/ --include="*.md" | sort | uniq
```

---

## 📤 Exportação

### Gerar Documentação Combinada
```bash
# Juntar todos os docs de uma categoria
cat docs/sistema-chaves/*.md > sistema-chaves-completo.md

# Criar índice de todos os títulos
grep -r "^# " docs/ --include="*.md" | sed 's/^docs\///' > indice-titulos.txt

# Exportar lista de arquivos com descrição
for file in docs/**/*.md; do
  echo "- $(basename "$file"): $(head -1 "$file" | sed 's/# //')"
done > lista-completa.txt
```

### Backup
```bash
# Backup de toda documentação
tar -czf docs-backup-$(date +%Y%m%d).tar.gz docs/

# Backup de categoria específica
tar -czf sistema-chaves-backup.tar.gz docs/sistema-chaves/

# Sincronizar com outro local
rsync -av docs/ /backup/docs/
```

---

## 🔧 Validação

### Verificar Integridade
```bash
# Verificar arquivos README em todas as pastas
for dir in docs/*/; do 
  [ ! -f "$dir/README.md" ] && echo "README faltando: $dir"
done

# Verificar sintaxe markdown (se tiver markdownlint)
markdownlint docs/**/*.md

# Verificar encoding dos arquivos
file -i docs/**/*.md | grep -v "utf-8"
```

---

## 🎨 Formatação

### Formatar Documentos
```bash
# Remover trailing whitespace
find docs/ -name "*.md" -exec sed -i 's/[[:space:]]*$//' {} \;

# Converter tabs para espaços
find docs/ -name "*.md" -exec sed -i 's/\t/    /g' {} \;

# Adicionar linha em branco no final
find docs/ -name "*.md" -exec sh -c 'echo "" >> "$1"' _ {} \;
```

---

## 📋 Templates

### Template de Documento Técnico
```bash
cat > docs/categoria/TEMPLATE.md << 'EOF'
# Título do Documento

**Data:** $(date +%d/%m/%Y)  
**Status:** 🚧 Em Construção | ✅ Completo | 📦 Arquivado  
**Autor:** Nome

---

## 📋 Contexto

Descreva o problema ou situação inicial.

## 🎯 Objetivo

O que queremos alcançar com esta implementação/correção.

## ✅ Solução Implementada

Como o problema foi resolvido.

### Código
```typescript
// Exemplo de código
```

## 🔧 Como Usar

Instruções práticas de uso.

## 📊 Resultados

Métricas, testes, validações.

## 📚 Referências

- Link 1
- Link 2

---

**Criado em:** $(date +%d/%m/%Y)  
**Última atualização:** $(date +%d/%m/%Y)
EOF
```

---

## 🚀 Automação

### Script de Atualização Diária
```bash
#!/bin/bash
# update-docs.sh

echo "🔄 Atualizando documentação..."

# Re-organizar novos arquivos
bash scripts/organize-docs.sh

# Regenerar índices
bash scripts/generate-doc-indexes.sh

# Commit se houver mudanças
if [ -n "$(git status --porcelain docs/)" ]; then
  git add docs/
  git commit -m "docs: atualização automática $(date +%Y-%m-%d)"
  echo "✅ Documentação atualizada e commitada"
else
  echo "ℹ️  Sem mudanças na documentação"
fi
```

---

## 🎯 Atalhos Úteis

### Aliases para .bashrc / .zshrc
```bash
# Adicione ao seu .bashrc ou .zshrc

# Ver documentação
alias doc='cat docs/README.md'
alias docs='cd ~/projeto/docs && ls -la'

# Buscar em docs
alias docsearch='grep -r "$1" docs/ --include="*.md"'

# Abrir categoria
alias dockeys='code docs/sistema-chaves/'
alias docauth='code docs/autenticacao/'

# Regenerar índices
alias docindex='bash scripts/generate-doc-indexes.sh'

# Estatísticas
alias docstats='for dir in docs/*/; do echo "$(basename "$dir"): $(ls -1 "$dir"*.md 2>/dev/null | wc -l) arquivos"; done | sort -t: -k2 -rn'
```

---

## 📞 Ajuda Rápida

### Comandos Mais Usados

```bash
# Ver índice principal
cat docs/README.md

# Buscar por palavra
grep -ri "palavra" docs/

# Ver arquivo específico
cat docs/categoria/ARQUIVO.md

# Regenerar índices
bash scripts/generate-doc-indexes.sh

# Estatísticas
for dir in docs/*/; do 
  echo "$(basename "$dir"): $(ls -1 "$dir"*.md 2>/dev/null | wc -l)"
done
```

---

**Última atualização:** 13 de outubro de 2025
