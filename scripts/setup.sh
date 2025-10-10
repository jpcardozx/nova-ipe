#!/bin/bash
# Script de setup inicial - instala dependências necessárias

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  WordPress Lightsail Toolkit - Setup          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

# Verificar se é root (para instalação de pacotes)
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Não execute este script como root${NC}"
    echo "Execute como usuário normal. O script pedirá sudo quando necessário."
    exit 1
fi

echo -e "${YELLOW}Este script vai instalar e configurar:${NC}"
echo "  • AWS CLI"
echo "  • jq (JSON processor)"
echo "  • Configuração do AWS CLI"
echo ""
echo -n "Continuar? (s/n): "
read -r CONFIRM

if [ "$CONFIRM" != "s" ]; then
    echo "Setup cancelado."
    exit 0
fi

echo ""

# 1. Verificar/instalar AWS CLI
echo -e "${BLUE}[1/3] Verificando AWS CLI...${NC}"
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version 2>&1 | cut -d' ' -f1 | cut -d'/' -f2)
    echo -e "${GREEN}✓ AWS CLI já instalado (versão $AWS_VERSION)${NC}"
else
    echo -e "${YELLOW}⚠ AWS CLI não encontrado. Instalando AWS CLI v2...${NC}"
    
    # Verificar unzip
    if ! command -v unzip &> /dev/null; then
        echo "Instalando unzip..."
        sudo apt-get update
        sudo apt-get install -y unzip
    fi
    
    # Baixar e instalar AWS CLI v2 (método oficial)
    echo "Baixando AWS CLI v2..."
    cd /tmp
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    
    echo "Instalando..."
    unzip -q awscliv2.zip
    sudo /tmp/aws/install
    
    # Limpar arquivos temporários
    rm -rf /tmp/aws /tmp/awscliv2.zip
    
    if command -v aws &> /dev/null; then
        echo -e "${GREEN}✓ AWS CLI instalado com sucesso${NC}"
        aws --version
    else
        echo -e "${RED}❌ Falha ao instalar AWS CLI${NC}"
        exit 1
    fi
fi

echo ""

# 2. Verificar/instalar jq
echo -e "${BLUE}[2/3] Verificando jq...${NC}"
if command -v jq &> /dev/null; then
    JQ_VERSION=$(jq --version)
    echo -e "${GREEN}✓ jq já instalado ($JQ_VERSION)${NC}"
else
    echo -e "${YELLOW}⚠ jq não encontrado. Instalando...${NC}"
    
    if command -v apt-get &> /dev/null; then
        sudo apt-get install -y jq
    elif command -v yum &> /dev/null; then
        sudo yum install -y jq
    else
        echo -e "${RED}❌ Gerenciador de pacotes não suportado${NC}"
        exit 1
    fi
    
    if command -v jq &> /dev/null; then
        echo -e "${GREEN}✓ jq instalado com sucesso${NC}"
    else
        echo -e "${RED}❌ Falha ao instalar jq${NC}"
        exit 1
    fi
fi

echo ""

# 3. Configurar AWS CLI
echo -e "${BLUE}[3/3] Configurando AWS CLI...${NC}"

if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    CURRENT_USER=$(aws sts get-caller-identity --query Arn --output text)
    echo -e "${GREEN}✓ AWS CLI já configurado${NC}"
    echo "  Account ID: $ACCOUNT_ID"
    echo "  User: $CURRENT_USER"
    echo ""
    echo -n "Deseja reconfigurar? (s/n): "
    read -r RECONFIG
    
    if [ "$RECONFIG" != "s" ]; then
        echo "Mantendo configuração atual."
    else
        aws configure
    fi
else
    echo -e "${YELLOW}⚠ AWS CLI não configurado${NC}"
    echo ""
    echo "Você precisará das seguintes informações:"
    echo "  1. AWS Access Key ID"
    echo "  2. AWS Secret Access Key"
    echo "  3. Default region (ex: us-east-1)"
    echo ""
    echo -e "${BLUE}Como obter credenciais AWS:${NC}"
    echo "  1. Acesse: https://console.aws.amazon.com"
    echo "  2. Vá em: IAM → Users → [Seu usuário] → Security credentials"
    echo "  3. Clique em 'Create access key'"
    echo "  4. Salve as credenciais (você não poderá vê-las novamente!)"
    echo ""
    echo -n "Pressione ENTER quando estiver pronto para configurar..."
    read
    
    aws configure
    
    echo ""
    echo "Verificando configuração..."
    if aws sts get-caller-identity &> /dev/null; then
        echo -e "${GREEN}✓ AWS CLI configurado com sucesso!${NC}"
    else
        echo -e "${RED}❌ Falha na configuração AWS CLI${NC}"
        echo "Verifique suas credenciais e tente novamente: aws configure"
        exit 1
    fi
fi

echo ""

# 4. Testar conexão com Lightsail
echo -e "${BLUE}Testando conexão com AWS Lightsail...${NC}"
REGION=$(aws configure get region)
echo "Região configurada: $REGION"
echo ""

if aws lightsail get-instances --region "$REGION" &> /dev/null; then
    echo -e "${GREEN}✓ Conexão com Lightsail OK${NC}"
    echo ""
    echo "Instâncias disponíveis:"
    aws lightsail get-instances --region "$REGION" --query 'instances[*].[name,state.name,publicIpAddress]' --output table
else
    echo -e "${YELLOW}⚠ Não foi possível listar instâncias Lightsail${NC}"
    echo "Verifique se:"
    echo "  1. Você tem permissões IAM corretas"
    echo "  2. A região está correta"
    echo "  3. Existe alguma instância Lightsail criada"
fi

echo ""

# 5. Sumário
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Completo! ✓                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo "  1. Execute: ${YELLOW}./scripts/lightsail-access.sh${NC}"
echo "     Para obter acesso SSH e senha do WordPress"
echo ""
echo "  2. Execute: ${YELLOW}./scripts/wp-migration-helper.sh${NC}"
echo "     Para ferramentas de migração"
echo ""
echo -e "${BLUE}Documentação:${NC}"
echo "  • docs/README_WORDPRESS_TOOLKIT.md - Guia principal"
echo "  • docs/MIGRACAO_WORDPRESS_LIGHTSAIL.md - Migração completa"
echo "  • docs/QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md - Comandos úteis"
echo ""

# Criar diretórios de trabalho
mkdir -p .lightsail-access
mkdir -p .wordpress-backup

echo -e "${GREEN}Pronto para começar! 🚀${NC}\n"
