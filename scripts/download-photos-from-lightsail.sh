#!/bin/bash
# Download de fotos WPL do AWS Lightsail via SSH

set -e

# Configurações
REGION="us-east-1"
INSTANCE="Ipe-1"
WORK_DIR="$(pwd)/.lightsail-access"
PHOTOS_DIR="/home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/fotos-completas"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📸 Download de Fotos do Lightsail"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Criar diretórios
mkdir -p "$WORK_DIR"
mkdir -p "$PHOTOS_DIR"

# Verificar dependências
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não encontrado${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependências OK${NC}"

# Verificar AWS configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não configurado. Execute: aws configure${NC}"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI configurado${NC}"
echo ""

# Obter credenciais SSH
echo "🔑 Obtendo credenciais SSH da instância ${INSTANCE}..."
aws lightsail get-instance-access-details \
    --region "$REGION" \
    --instance-name "$INSTANCE" \
    --protocol ssh \
    > "$WORK_DIR/access.json"

# Extrair chave privada
jq -r '.accessDetails.privateKey' "$WORK_DIR/access.json" > "$WORK_DIR/key.pem"
chmod 600 "$WORK_DIR/key.pem"

# Extrair IP e usuário
HOST_IP=$(jq -r '.accessDetails.ipAddress' "$WORK_DIR/access.json")
SSH_USER=$(jq -r '.accessDetails.username' "$WORK_DIR/access.json")

echo -e "${GREEN}✓ Host: $HOST_IP${NC}"
echo -e "${GREEN}✓ User: $SSH_USER${NC}"
echo ""

# Testar conexão
echo "🔌 Testando conexão SSH..."
if ! ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=10 \
    "$SSH_USER@$HOST_IP" "echo 'SSH OK'"; then
    echo -e "${RED}❌ Conexão SSH falhou${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Conexão SSH OK${NC}"
echo ""

# Verificar se pasta WPL existe
echo "📁 Verificando pasta WPL no servidor..."
WPL_PATH="/opt/bitnami/wordpress/wp-content/uploads/wplpro"

if ! ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$HOST_IP" "[ -d $WPL_PATH ]"; then
    echo -e "${RED}❌ Pasta WPL não encontrada: $WPL_PATH${NC}"

    # Tentar encontrar
    echo "🔍 Procurando pasta WPL..."
    ssh -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        "$SSH_USER@$HOST_IP" \
        "find /opt/bitnami/wordpress/wp-content/uploads -type d -name 'wpl*' -o -name 'WPL*' 2>/dev/null | head -5"
    exit 1
fi

echo -e "${GREEN}✓ Pasta WPL encontrada${NC}"

# Ver estatísticas
echo ""
echo "📊 Estatísticas da pasta WPL:"
ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$HOST_IP" \
    "du -sh $WPL_PATH && echo '' && find $WPL_PATH -type d | wc -l | awk '{print \$1 \" pastas de imóveis\"}' && find $WPL_PATH -type f -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' | wc -l | awk '{print \$1 \" fotos totais\"}'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  IMPORTANTE: Download pode levar 30-60 minutos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -n "Deseja continuar com o download? (s/N): "
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[Ss]$ ]]; then
    echo "Cancelado pelo usuário"
    exit 0
fi

echo ""
echo "🚀 Iniciando download..."
echo ""

# Download usando rsync (mais eficiente que scp)
if command -v rsync &> /dev/null; then
    echo "📥 Usando rsync para download..."
    rsync -avz --progress \
        -e "ssh -i $WORK_DIR/key.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
        "$SSH_USER@$HOST_IP:$WPL_PATH/" \
        "$PHOTOS_DIR/"
else
    echo "📥 Usando scp para download..."
    scp -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -r \
        "$SSH_USER@$HOST_IP:$WPL_PATH/*" \
        "$PHOTOS_DIR/"
fi

echo ""
echo -e "${GREEN}✅ Download concluído!${NC}"
echo ""

# Estatísticas locais
echo "📊 Estatísticas locais:"
du -sh "$PHOTOS_DIR"
find "$PHOTOS_DIR" -type d | wc -l | awk '{print $1 " pastas"}'
find "$PHOTOS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | wc -l | awk '{print $1 " fotos"}'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Fotos baixadas com sucesso!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Localização: $PHOTOS_DIR"
echo ""
echo "Próximo passo:"
echo "  npx tsx scripts/upload-local-photos-to-r2.ts"
echo ""
