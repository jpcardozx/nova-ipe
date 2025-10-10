#!/bin/bash
# Script simplificado para acessar WordPress Bitnami no AWS Lightsail

set -x  # DEBUG MODE - mostra cada comando executado

# Configurações
REGION="us-east-1"
INSTANCE="Ipe-1"
WORK_DIR="$(pwd)/.lightsail-access"

echo "=== Lightsail WordPress Access Tool ==="
echo ""

# Verificar dependências básicas
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "❌ jq não encontrado"
    exit 1
fi

echo "✓ Dependências OK"
echo ""

# Verificar configuração AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI não configurado. Execute: aws configure"
    exit 1
fi

echo "✓ AWS CLI configurado"
echo ""

# Criar diretório de trabalho
mkdir -p "$WORK_DIR"

# Pegar credenciais da AWS
echo "Obtendo credenciais SSH da instância ${INSTANCE}..."
aws lightsail get-instance-access-details \
    --region "$REGION" \
    --instance-name "$INSTANCE" \
    --protocol ssh \
    > "$WORK_DIR/access.json"

echo "DEBUG: Conteúdo do JSON:"
cat "$WORK_DIR/access.json"
echo ""

# Extrair chave privada
jq -r '.accessDetails.privateKey' "$WORK_DIR/access.json" > "$WORK_DIR/key.pem"

echo "DEBUG: Primeiras linhas da chave:"
head -n 3 "$WORK_DIR/key.pem"
echo ""

# Permissões corretas na chave
chmod 600 "$WORK_DIR/key.pem"
ls -la "$WORK_DIR/key.pem"

# Extrair IP e usuário
HOST_IP=$(jq -r '.accessDetails.ipAddress' "$WORK_DIR/access.json")
SSH_USER=$(jq -r '.accessDetails.username' "$WORK_DIR/access.json")

echo "✓ Host: $HOST_IP"
echo "✓ User: $SSH_USER"
echo ""

# Testar conexão SSH primeiro
echo "Testando conexão SSH..."
ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=10 \
    "$SSH_USER@$HOST_IP" "echo 'SSH OK'; whoami; hostname"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Conexão SSH falhou"
    echo "DEBUG: Tentando conexão verbose..."
    ssh -vvv -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        "$SSH_USER@$HOST_IP" "echo test"
    exit 1
fi

echo ""
echo "✓ Conexão SSH funcionando!"
echo ""

# Obter credenciais do banco de dados
echo "Obtendo credenciais do banco de dados..."
ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$HOST_IP" \
    "cat /opt/bitnami/wordpress/wp-config.php | grep 'DB_NAME\|DB_USER\|DB_PASSWORD'"

echo ""
echo "✓ Credenciais do banco acima ^"
echo ""

# Obter senha do WordPress
echo "Obtendo senha do WordPress..."
WP_PASS=$(ssh -i "$WORK_DIR/key.pem" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$HOST_IP" \
    "cat /home/bitnami/bitnami_application_password 2>/dev/null || echo 'NOT_FOUND'")

if [ "$WP_PASS" = "NOT_FOUND" ]; then
    echo "⚠ Senha não encontrada no local padrão"
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Credenciais WordPress:"
    echo "  URL: http://$HOST_IP/wp-login.php"
    echo "  Usuário: user"
    echo "  Senha: $WP_PASS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Salvar em arquivo
    cat > "$WORK_DIR/wp-credentials.txt" << EOF
WordPress Admin Credentials
============================
URL: http://$HOST_IP/wp-login.php
Usuário: user
Senha: $WP_PASS

SSH Access:
Host: $HOST_IP
User: $SSH_USER
Key: $WORK_DIR/key.pem

Comando SSH:
ssh -i $WORK_DIR/key.pem -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$WORK_DIR/known_hosts $SSH_USER@$HOST_IP
EOF
    
    echo "✓ Credenciais salvas em: $WORK_DIR/wp-credentials.txt"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Script concluído!"
echo "Para conectar via SSH manualmente:"
echo "  ssh -i $WORK_DIR/key.pem -o StrictHostKeyChecking=no $SSH_USER@$HOST_IP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"# Menu de ações
show_menu() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Próximos passos disponíveis:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Conectar via SSH"
    echo "2. Criar novo usuário admin"
    echo "3. Trocar senha do usuário 'user'"
    echo "4. Ver informações da instância"
    echo "5. Abrir wp-admin no navegador"
    echo "6. Sair"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -n "Escolha uma opção (1-6): "
}

# Conectar SSH
connect_ssh() {
    echo -e "\n${GREEN}Conectando via SSH...${NC}\n"
    ssh -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=yes \
        -o UserKnownHostsFile="$WORK_DIR/known_hosts" \
        "$SSH_USER@$HOST_IP"
}

# Criar novo admin
create_admin() {
    echo -n "Nome do novo usuário admin: "
    read NEW_USER
    echo -n "Email do novo admin: "
    read NEW_EMAIL
    echo -n "Nova senha: "
    read -s NEW_PASS
    echo ""
    
    ssh -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=yes \
        -o UserKnownHostsFile="$WORK_DIR/known_hosts" \
        "$SSH_USER@$HOST_IP" \
        "cd /opt/bitnami/wordpress && sudo wp user create $NEW_USER $NEW_EMAIL --role=administrator --user_pass='$NEW_PASS' --allow-root"
    
    echo -e "${GREEN}✓ Usuário criado!${NC}"
}

# Trocar senha
change_password() {
    echo -n "Nova senha para o usuário 'user': "
    read -s NEW_PASS
    echo ""
    
    ssh -i "$WORK_DIR/key.pem" \
        -o StrictHostKeyChecking=yes \
        -o UserKnownHostsFile="$WORK_DIR/known_hosts" \
        "$SSH_USER@$HOST_IP" \
        "cd /opt/bitnami/wordpress && sudo wp user update user --user_pass='$NEW_PASS' --allow-root"
    
    echo -e "${GREEN}✓ Senha atualizada!${NC}"
}

# Ver informações
show_info() {
    echo -e "\n${GREEN}Informações da instância:${NC}\n"
    aws lightsail get-instance \
        --region "$REGION" \
        --instance-name "$INSTANCE" \
        | jq '{
            name: .instance.name,
            state: .instance.state.name,
            publicIp: .instance.publicIpAddress,
            privateIp: .instance.privateIpAddress,
            blueprintName: .instance.blueprintName,
            bundleId: .instance.bundleId
        }'
}

# Abrir navegador
open_browser() {
    WP_URL="http://$HOST_IP/wp-login.php"
    echo -e "\n${GREEN}Abrindo $WP_URL no navegador...${NC}\n"
    xdg-open "$WP_URL" 2>/dev/null || echo "Abra manualmente: $WP_URL"
}

# Execução principal
main() {
    check_dependencies
    check_aws_config
    get_ssh_access
    get_wp_password
    
    # Menu interativo
    while true; do
        show_menu
        read choice
        
        case $choice in
            1) connect_ssh ;;
            2) create_admin ;;
            3) change_password ;;
            4) show_info ;;
            5) open_browser ;;
            6) echo -e "\n${GREEN}Até mais!${NC}\n"; exit 0 ;;
            *) echo -e "${RED}Opção inválida${NC}" ;;
        esac
        echo ""
    done
}

# Executar
main
