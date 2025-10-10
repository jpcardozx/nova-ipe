#!/bin/bash
# ========================================================
# Migração WordPress: Locaweb → AWS Lightsail
# ========================================================
# Data: 7 de outubro de 2025
# Método: SSH direto, sem plugins, sem FTP lento
# ========================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# ========================================================
# CREDENCIAIS - SERVIDOR ANTIGO (Locaweb)
# ========================================================
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"  # URL alternativa (mais confiável)
OLD_SSH_USER="imobiliariaipe1"
OLD_SSH_PASS="Ipe@10203040Ipe"  # ✅ VALIDADO
OLD_SSH_PORT="22"
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"  # ✅ VALIDADO

OLD_DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
OLD_DB_USER="wp_imobiliaria"
OLD_DB_PASS="Locaweb@102030"  # ✅ VALIDADO (do wp-config.php)
OLD_DB_NAME="wp_imobiliaria"

# ========================================================
# CREDENCIAIS - SERVIDOR NOVO (Lightsail)
# ========================================================
# ✅ VALIDADO - Instância: Ipe-1 (us-east-1)
NEW_SSH_HOST="13.223.237.99"  # IP público do Lightsail
NEW_SSH_USER="bitnami"
NEW_SSH_KEY="$HOME/.ssh/LightsailDefaultKey-us-east-1.pem"  # Sua chave padrão
NEW_SITE_PATH="/opt/bitnami/wordpress"

NEW_DB_HOST="localhost"
NEW_DB_USER="wp_imobiliaria"
NEW_DB_PASS="Locaweb@102030"  # Mantendo a mesma senha para reduzir fricção no wp-config
NEW_DB_NAME="wp_imobiliaria"
NEW_DB_ROOT_PASS="OBTER_VIA_SSH"  # Vamos pegar via SSH quando conectar

# ========================================================
# URLs DO SITE
# ========================================================
OLD_URL="https://portal.imobiliariaipe.com.br"  # ✅ VALIDADO - já está HTTPS no banco
NEW_URL="https://portal.imobiliariaipe.com.br"  # Mesmo domínio (sem mudança)

# ========================================================
# DIRETÓRIOS TEMPORÁRIOS
# ========================================================
TMP_DIR="/tmp/wp-migration-$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="site-files.tar.gz"
SQL_FILE="database.sql"

# ========================================================
# FUNÇÕES
# ========================================================

check_requirements() {
    log "Verificando requisitos..."

    command -v sshpass >/dev/null 2>&1 || {
        error "sshpass não instalado. Execute: sudo apt-get install sshpass"
        exit 1
    }

    command -v rsync >/dev/null 2>&1 || {
        error "rsync não instalado. Execute: sudo apt-get install rsync"
        exit 1
    }

    success "Requisitos verificados"
}

test_old_ssh() {
    log "Testando SSH no servidor antigo..."

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$OLD_SSH_USER@$OLD_SSH_HOST" "echo 'SSH OK'" 2>&1 || {
        error "Falha ao conectar via SSH no servidor antigo"
        error "Verifique: firewall, credenciais ou porta bloqueada"
        exit 1
    }

    success "SSH servidor antigo: OK"
}

# ========================================================
# PASSO 1: BACKUP NO SERVIDOR ANTIGO
# ========================================================
backup_old_server() {
    log "===== PASSO 1: Backup no Servidor Antigo ====="

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" bash <<'REMOTE_SCRIPT'

set -e

echo "[$(date '+%H:%M:%S')] Criando diretório temporário..."
mkdir -p /tmp/wp-backup
cd /home/storage/e/4f/a6/imobiliariaipe1/public_html

echo "[$(date '+%H:%M:%S')] Compactando arquivos (excluindo cache)..."
tar --exclude='wp-content/cache' \
    --exclude='wp-content/uploads/cache' \
    --exclude='wp-content/w3tc-config' \
    --warning=no-file-changed \
    -czf /tmp/wp-backup/site-files.tar.gz . 2>/dev/null || {
    # Ignora erro de "file changed as we read it"
    if [ $? -eq 1 ]; then
        echo "✅ Arquivos compactados (com avisos ignorados)"
    else
        echo "❌ Erro ao compactar arquivos"
        exit 1
    fi
}

echo "[$(date '+%H:%M:%S')] Fazendo dump do banco de dados..."
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
    -u wp_imobiliaria \
    -p'Locaweb@102030' \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    --default-character-set=utf8 \
    --no-tablespaces \
    wp_imobiliaria > /tmp/wp-backup/database.sql 2>/dev/null

echo "[$(date '+%H:%M:%S')] Compactando banco..."
gzip /tmp/wp-backup/database.sql

echo "✅ Backup concluído!"
ls -lh /tmp/wp-backup/
REMOTE_SCRIPT

    success "Backup criado no servidor antigo"
}

# ========================================================
# PASSO 2: TRANSFERIR PARA LIGHTSAIL
# ========================================================
transfer_to_lightsail() {
    log "===== PASSO 2: Transferindo para Lightsail ====="

    mkdir -p "$TMP_DIR"

    log "Baixando arquivos do servidor antigo..."
    sshpass -p "$OLD_SSH_PASS" rsync \
        -avz \
        --progress \
        -e "ssh -p $OLD_SSH_PORT -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no" \
        "$OLD_SSH_USER@$OLD_SSH_HOST:/tmp/wp-backup/site-files.tar.gz" \
        "$TMP_DIR/"

    sshpass -p "$OLD_SSH_PASS" rsync \
        -avz \
        --progress \
        -e "ssh -p $OLD_SSH_PORT -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no" \
        "$OLD_SSH_USER@$OLD_SSH_HOST:/tmp/wp-backup/database.sql.gz" \
        "$TMP_DIR/"

    success "Arquivos baixados para: $TMP_DIR"

    log "Enviando arquivos para o Lightsail..."

    # Verificar se a chave SSH existe
    if [ ! -f "$NEW_SSH_KEY" ]; then
        error "Chave SSH não encontrada: $NEW_SSH_KEY"
        warn "Procure por LightsailDefaultKey-us-east-1.pem e coloque em ~/.ssh/"
        exit 1
    fi

    # Enviar arquivos via SCP
    scp -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$TMP_DIR/site-files.tar.gz" \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"

    scp -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$TMP_DIR/database.sql.gz" \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"

    success "Arquivos enviados para o Lightsail!"
}

# ========================================================
# PASSO 3: RESTAURAR NO LIGHTSAIL
# ========================================================
restore_on_lightsail() {
    log "===== PASSO 3: Restaurando no Lightsail ====="

    warn "Execute os comandos abaixo DIRETAMENTE no servidor Lightsail via SSH:"
    echo ""
    echo "----------------------------------------"
    cat <<'LIGHTSAIL_COMMANDS'
# 1. Criar banco de dados
mysql -u root -p <<'EOF'
CREATE DATABASE IF NOT EXISTS wp_imobiliaria DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER IF NOT EXISTS 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF

# 2. Importar banco de dados
gunzip < /tmp/database.sql.gz | mysql -u root -p wp_imobiliaria

# 3. Fazer backup do WordPress atual (se houver)
sudo mv /opt/bitnami/wordpress /opt/bitnami/wordpress.old.$(date +%Y%m%d)

# 4. Criar diretório novo e extrair arquivos
sudo mkdir -p /opt/bitnami/wordpress
cd /opt/bitnami/wordpress
sudo tar -xzf /tmp/site-files.tar.gz

# 5. Ajustar permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 664 {} \;

# 6. Editar wp-config.php
sudo nano /opt/bitnami/wordpress/wp-config.php
LIGHTSAIL_COMMANDS
    echo "----------------------------------------"
    echo ""

    warn "Adicione estas linhas no wp-config.php:"
    echo ""
    echo "----------------------------------------"
    cat <<'WP_CONFIG'
define('DB_NAME', 'wp_imobiliaria');
define('DB_USER', 'wp_imobiliaria');
define('DB_PASSWORD', 'Ipe@5084');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

// Fixar URLs
define('WP_HOME', 'https://portal.imobiliariaipe.com.br');
define('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');

// Desabilitar cache antigo
// REMOVER esta linha se existir: define('WP_CACHE', true);
WP_CONFIG
    echo "----------------------------------------"
    echo ""
}

# ========================================================
# PASSO 4: LIMPEZA E AJUSTES FINAIS
# ========================================================
cleanup_and_fix() {
    log "===== PASSO 4: Limpeza e Ajustes Finais ====="

    warn "Execute no Lightsail:"
    echo ""
    echo "----------------------------------------"
    cat <<'CLEANUP_COMMANDS'
# Remover restos de cache antigo
sudo rm -f /opt/bitnami/wordpress/wp-content/advanced-cache.php
sudo rm -f /opt/bitnami/wordpress/wp-content/object-cache.php
sudo rm -f /opt/bitnami/wordpress/wp-content/db.php
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/*
sudo rm -rf /opt/bitnami/wordpress/wp-content/w3tc-config

# Atualizar URLs no banco (requer WP-CLI)
cd /opt/bitnami/wordpress

# Se WP-CLI não estiver instalado:
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Atualizar URLs
wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' \
    --all-tables \
    --precise \
    --skip-columns=guid \
    --allow-root

# Limpar permalinks
wp rewrite flush --allow-root

# Reiniciar serviços
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql

# Testar
curl -I https://portal.imobiliariaipe.com.br
CLEANUP_COMMANDS
    echo "----------------------------------------"
    echo ""

    success "Comandos de limpeza fornecidos!"
}

# ========================================================
# MENU PRINCIPAL
# ========================================================
show_menu() {
    echo ""
    echo "=========================================="
    echo "  Migração WordPress: Locaweb → Lightsail"
    echo "=========================================="
    echo ""
    echo "Escolha uma opção:"
    echo ""
    echo "  1) Executar migração completa (recomendado)"
    echo "  2) Apenas testar SSH no servidor antigo"
    echo "  3) Apenas fazer backup no servidor antigo"
    echo "  4) Ver comandos para o Lightsail"
    echo "  5) Ver checklist pós-migração"
    echo "  0) Sair"
    echo ""
    read -p "Opção: " choice

    case $choice in
        1)
            check_requirements
            test_old_ssh
            backup_old_server
            transfer_to_lightsail
            restore_on_lightsail
            cleanup_and_fix
            show_checklist
            ;;
        2)
            test_old_ssh
            ;;
        3)
            backup_old_server
            ;;
        4)
            restore_on_lightsail
            cleanup_and_fix
            ;;
        5)
            show_checklist
            ;;
        0)
            exit 0
            ;;
        *)
            error "Opção inválida"
            show_menu
            ;;
    esac
}

show_checklist() {
    echo ""
    echo "=========================================="
    echo "  ✅ CHECKLIST PÓS-MIGRAÇÃO"
    echo "=========================================="
    echo ""
    echo "□ 1. wp-config.php configurado com localhost e credenciais"
    echo "□ 2. define('WP_CACHE', true) removido"
    echo "□ 3. advanced-cache.php, object-cache.php deletados"
    echo "□ 4. wp-content/cache vazio"
    echo "□ 5. URLs atualizadas com wp search-replace"
    echo "□ 6. Permissões bitnami:daemon aplicadas (775/664)"
    echo "□ 7. Permalinks testados no /wp-admin"
    echo "□ 8. Site acessível via https://portal.imobiliariaipe.com.br"
    echo "□ 9. Serviços reiniciados (Apache + MySQL)"
    echo ""
    echo "=========================================="
    echo ""
}

# ========================================================
# EXECUÇÃO
# ========================================================
if [ "$1" == "--auto" ]; then
    check_requirements
    test_old_ssh
    backup_old_server
    transfer_to_lightsail
    restore_on_lightsail
    cleanup_and_fix
    show_checklist
else
    show_menu
fi
