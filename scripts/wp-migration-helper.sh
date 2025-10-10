#!/bin/bash
# Script auxiliar para migração de conteúdo WordPress
# Executa após ter acesso ao Lightsail

set -e

# Configurações
WORK_DIR="$(pwd)/.lightsail-access"
BACKUP_DIR="$(pwd)/.wordpress-backup"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}=== WordPress Migration Helper ===${NC}\n"

# Verificar se já tem credenciais
if [ ! -f "$WORK_DIR/access.json" ]; then
    echo -e "${RED}❌ Credenciais não encontradas${NC}"
    echo "Execute primeiro: ./scripts/lightsail-access.sh"
    exit 1
fi

# Carregar credenciais
HOST=$(jq -r '.accessDetails.ipAddress' "$WORK_DIR/access.json")
USER=$(jq -r '.accessDetails.username' "$WORK_DIR/access.json")
SSH_CMD="ssh -i $WORK_DIR/key.pem -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$WORK_DIR/known_hosts $USER@$HOST"
SCP_CMD="scp -i $WORK_DIR/key.pem -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$WORK_DIR/known_hosts"

echo -e "${BLUE}Conectando a: $HOST${NC}\n"

# Menu
show_menu() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Ferramentas de Migração WordPress"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Upload de arquivo SQL (importar banco)"
    echo "2. Upload de wp-content (arquivos do site)"
    echo "3. Search-Replace de URLs (DRY RUN)"
    echo "4. Search-Replace de URLs (EXECUTAR)"
    echo "5. Regenerar permissões de arquivos"
    echo "6. Limpar cache do WordPress"
    echo "7. Ver status dos serviços"
    echo "8. Reiniciar Apache"
    echo "9. Backup do banco atual"
    echo "10. Verificar/reparar banco de dados"
    echo "0. Sair"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -n "Escolha uma opção: "
}

# 1. Upload SQL
upload_sql() {
    echo -e "\n${BLUE}Upload e importação de banco de dados${NC}\n"
    echo -n "Caminho para o arquivo .sql: "
    read SQL_FILE
    
    if [ ! -f "$SQL_FILE" ]; then
        echo -e "${RED}❌ Arquivo não encontrado${NC}"
        return
    fi
    
    echo "Enviando arquivo..."
    $SCP_CMD "$SQL_FILE" "$USER@$HOST:/tmp/backup.sql"
    
    echo "Importando banco de dados..."
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp db import /tmp/backup.sql --allow-root"
    
    echo -e "${GREEN}✓ Banco importado com sucesso!${NC}"
    echo -e "${YELLOW}⚠ Lembre-se de executar search-replace para atualizar URLs${NC}"
}

# 2. Upload wp-content
upload_wp_content() {
    echo -e "\n${BLUE}Upload de wp-content${NC}\n"
    echo -n "Caminho para a pasta wp-content (ou .tar.gz/.zip): "
    read WP_CONTENT
    
    if [ ! -e "$WP_CONTENT" ]; then
        echo -e "${RED}❌ Caminho não encontrado${NC}"
        return
    fi
    
    if [ -d "$WP_CONTENT" ]; then
        echo "Compactando pasta..."
        tar -czf /tmp/wp-content-temp.tar.gz -C "$(dirname "$WP_CONTENT")" "$(basename "$WP_CONTENT")"
        WP_CONTENT="/tmp/wp-content-temp.tar.gz"
    fi
    
    echo "Enviando arquivo (pode demorar)..."
    $SCP_CMD "$WP_CONTENT" "$USER@$HOST:/tmp/wp-content.tar.gz"
    
    echo "Extraindo e aplicando..."
    $SSH_CMD << 'ENDSSH'
cd /tmp
tar -xzf wp-content.tar.gz
sudo rm -rf /opt/bitnami/wordpress/wp-content.backup
sudo mv /opt/bitnami/wordpress/wp-content /opt/bitnami/wordpress/wp-content.backup
sudo mv wp-content /opt/bitnami/wordpress/
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
sudo chmod -R 755 /opt/bitnami/wordpress/wp-content
ENDSSH
    
    echo -e "${GREEN}✓ wp-content atualizado!${NC}"
}

# 3. Search-Replace DRY RUN
search_replace_dry() {
    echo -e "\n${BLUE}Search-Replace (DRY RUN - apenas visualização)${NC}\n"
    echo -n "URL antiga (ex: http://siteantigo.com.br): "
    read OLD_URL
    echo -n "URL nova (ex: http://$HOST ou https://seudominio.com): "
    read NEW_URL
    
    echo -e "\n${YELLOW}Verificando alterações que seriam feitas...${NC}\n"
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp search-replace '$OLD_URL' '$NEW_URL' --all-tables --dry-run --allow-root"
    
    echo -e "\n${YELLOW}⚠ Esta foi apenas uma simulação. Use a opção 4 para executar.${NC}"
}

# 4. Search-Replace EXECUTAR
search_replace_exec() {
    echo -e "\n${RED}⚠ ATENÇÃO: Isso vai alterar URLs no banco de dados!${NC}\n"
    echo -n "URL antiga (ex: http://siteantigo.com.br): "
    read OLD_URL
    echo -n "URL nova (ex: http://$HOST ou https://seudominio.com): "
    read NEW_URL
    
    echo -e "\n${YELLOW}Você tem certeza? Digite 'SIM' para confirmar: ${NC}"
    read CONFIRM
    
    if [ "$CONFIRM" != "SIM" ]; then
        echo "Operação cancelada."
        return
    fi
    
    echo -e "\n${BLUE}Executando search-replace...${NC}\n"
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp search-replace '$OLD_URL' '$NEW_URL' --all-tables --allow-root"
    
    echo -e "${GREEN}✓ URLs atualizadas!${NC}"
}

# 5. Regenerar permissões
fix_permissions() {
    echo -e "\n${BLUE}Corrigindo permissões de arquivos...${NC}\n"
    $SSH_CMD << 'ENDSSH'
sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 755 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 644 {} \;
sudo chmod 640 /opt/bitnami/wordpress/wp-config.php
ENDSSH
    echo -e "${GREEN}✓ Permissões corrigidas!${NC}"
}

# 6. Limpar cache
clear_cache() {
    echo -e "\n${BLUE}Limpando cache...${NC}\n"
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp cache flush --allow-root"
    echo -e "${GREEN}✓ Cache limpo!${NC}"
}

# 7. Status dos serviços
check_status() {
    echo -e "\n${BLUE}Status dos serviços:${NC}\n"
    $SSH_CMD "sudo /opt/bitnami/ctlscript.sh status"
}

# 8. Reiniciar Apache
restart_apache() {
    echo -e "\n${BLUE}Reiniciando Apache...${NC}\n"
    $SSH_CMD "sudo /opt/bitnami/ctlscript.sh restart apache"
    echo -e "${GREEN}✓ Apache reiniciado!${NC}"
}

# 9. Backup do banco
backup_database() {
    echo -e "\n${BLUE}Fazendo backup do banco de dados...${NC}\n"
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"
    
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp db export - --allow-root" > "$BACKUP_FILE"
    
    echo -e "${GREEN}✓ Backup salvo em: $BACKUP_FILE${NC}"
    echo "Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
}

# 10. Verificar/reparar banco
check_repair_db() {
    echo -e "\n${BLUE}Verificando banco de dados...${NC}\n"
    $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp db check --allow-root"
    
    echo -e "\n${YELLOW}Deseja reparar o banco? (s/n): ${NC}"
    read REPAIR
    
    if [ "$REPAIR" = "s" ]; then
        echo "Reparando..."
        $SSH_CMD "cd /opt/bitnami/wordpress && sudo wp db repair --allow-root"
        echo -e "${GREEN}✓ Banco reparado!${NC}"
    fi
}

# Loop principal
main() {
    while true; do
        show_menu
        read choice
        
        case $choice in
            1) upload_sql ;;
            2) upload_wp_content ;;
            3) search_replace_dry ;;
            4) search_replace_exec ;;
            5) fix_permissions ;;
            6) clear_cache ;;
            7) check_status ;;
            8) restart_apache ;;
            9) backup_database ;;
            10) check_repair_db ;;
            0) echo -e "\n${GREEN}Até mais!${NC}\n"; exit 0 ;;
            *) echo -e "${RED}Opção inválida${NC}" ;;
        esac
        
        echo ""
        echo -n "Pressione ENTER para continuar..."
        read
    done
}

main
