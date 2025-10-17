#!/bin/bash

# 🔍 Diagnóstico Completo via Sanity CLI
# Estratégia para identificar logs e informações precisas

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🔍 DIAGNÓSTICO SANITY CLI - Análise Profunda           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

IMOVEL_ID="d5476428-a47b-4075-9383-f0cf58f58d66"
PROJECT_ID="0nks58lj"
DATASET="production"

echo "📋 Configuração:"
echo "   Project: $PROJECT_ID"
echo "   Dataset: $DATASET"
echo "   ID: $IMOVEL_ID"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. VERIFICAR AUTENTICAÇÃO
echo "1️⃣ VERIFICANDO AUTENTICAÇÃO..."
echo ""
npx sanity login --sso || echo "⚠️  Faça login com: npx sanity login"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 2. LISTAR DATASETS E VERIFICAR
echo "2️⃣ LISTANDO DATASETS..."
echo ""
npx sanity dataset list
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 3. DOCUMENTOS - Buscar por ID
echo "3️⃣ BUSCANDO DOCUMENTO POR ID..."
echo ""
echo "Publicado:"
npx sanity documents get "$IMOVEL_ID" --dataset "$DATASET" 2>&1 || echo "❌ Documento publicado não encontrado"
echo ""
echo "Draft:"
npx sanity documents get "drafts.$IMOVEL_ID" --dataset "$DATASET" 2>&1 || echo "❌ Draft não encontrado"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 4. QUERY GROQ DIRETA
echo "4️⃣ QUERY GROQ - Buscando o documento..."
echo ""
npx sanity documents query "*[_id == '$IMOVEL_ID' || _id == 'drafts.$IMOVEL_ID']" --dataset "$DATASET"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 5. LISTAR DOCUMENTOS RECENTES
echo "5️⃣ DOCUMENTOS RECENTES (últimos 10 imóveis)..."
echo ""
npx sanity documents query "*[_type == 'imovel'] | order(_updatedAt desc) [0...10] {_id, titulo, _updatedAt}" --dataset "$DATASET"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 6. HISTÓRICO DO DOCUMENTO (se disponível)
echo "6️⃣ TENTANDO ACESSAR HISTÓRICO..."
echo ""
echo "💡 Via API History (requer permissões especiais):"
echo "   curl -H 'Authorization: Bearer \$SANITY_API_TOKEN' \\"
echo "   https://$PROJECT_ID.api.sanity.io/v2021-06-07/data/history/$DATASET/documents/$IMOVEL_ID"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 7. EXPORT PARA ANÁLISE LOCAL
echo "7️⃣ CRIANDO EXPORT DO DATASET (para análise local)..."
echo ""
BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "Exportando para: $BACKUP_FILE"
npx sanity dataset export "$DATASET" "$BACKUP_FILE" --no-compress 2>&1
echo ""
echo "✅ Export criado!"
echo ""
echo "Para buscar o documento no export:"
echo "   tar -xzf $BACKUP_FILE"
echo "   grep '$IMOVEL_ID' data.ndjson"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 8. INFORMAÇÕES DO PROJETO
echo "8️⃣ INFORMAÇÕES DO PROJETO..."
echo ""
npx sanity debug --secrets
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# 9. WEBHOOKS (para ver logs de atividade)
echo "9️⃣ VERIFICANDO WEBHOOKS (logs de atividade)..."
echo ""
npx sanity hook list
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              📊 ANÁLISE COMPLEMENTAR                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🔍 PRÓXIMOS PASSOS RECOMENDADOS:"
echo ""
echo "A. Se o documento foi encontrado no export:"
echo "   1. Extraia o documento do NDJSON"
echo "   2. Use: npx sanity documents create < documento.json"
echo ""
echo "B. Se não encontrou nada:"
echo "   1. Verifique o ID no Studio (pode estar diferente)"
echo "   2. Entre no Sanity Manage → Activity Log"
echo "   3. Filtre por usuário: julia@imobiliariaipe.com.br"
echo "   4. Procure a ação de delete"
echo ""
echo "C. Acessar Activity Log via Manage:"
echo "   https://www.sanity.io/manage/personal/project/$PROJECT_ID/activity"
echo ""
echo "D. Se tem plano com backup de 30 dias:"
echo "   1. Acesse: https://www.sanity.io/manage/personal/project/$PROJECT_ID/datasets"
echo "   2. Clique no dataset 'production'"
echo "   3. Procure por 'Time-travel' ou 'Point-in-time recovery'"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
