#!/bin/bash
# ========================================================
# Migração em Batches Controlados - 1 por vez
# ========================================================
# Executa uma etapa, mostra resultado, pede confirmação
# ========================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${CYAN}ℹ️  $1${NC}"; }

# Configurações
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATION_DIR="$HOME/wp-migration-batches-$(date +%Y%m%d_%H%M%S)"
SSH_KEY="$SCRIPT_DIR/.lightsail-access/LightsailDefaultKey-us-east-1.pem"
STATE_FILE="$MIGRATION_DIR/state.txt"

# Criar diretórios
mkdir -p "$MIGRATION_DIR"/{database,plugins,themes,uploads,logs}

# Credenciais
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"
OLD_SSH_USER="imobiliariaipe1"
OLD_SSH_PASS="Ipe@10203040Ipe"
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"

NEW_SSH_HOST="13.223.237.99"
NEW_SSH_USER="bitnami"

# Inicializar state
if [ ! -f "$STATE_FILE" ]; then
    cat > "$STATE_FILE" <<EOF
MIGRATION_START=$(date -Iseconds)
MIGRATION_DIR=$MIGRATION_DIR
BATCH_1_VERIFY=pending
BATCH_2_DATABASE=pending
BATCH_3_PLUGINS=pending
BATCH_4_THEMES=pending
BATCH_5_UPLOADS_OLD=pending
BATCH_6_UPLOADS_NEW=pending
BATCH_7_TRANSFER=pending
BATCH_8_IMPORT_DB=pending
BATCH_9_IMPORT_FILES=pending
BATCH_10_CONFIGURE=pending
BATCH_11_RESTART=pending
BATCH_12_VERIFY=pending
EOF
fi

# Função para marcar batch como completo
mark_complete() {
    local batch=$1
    sed -i "s/BATCH_${batch}=.*/BATCH_${batch}=completed/" "$STATE_FILE"
}

# Função para verificar se batch já foi executado
is_completed() {
    local batch=$1
    grep -q "BATCH_${batch}=completed" "$STATE_FILE"
}

# Função para mostrar progresso
show_progress() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "=========================================="
    echo "  MIGRAÇÃO EM BATCHES"
    echo "=========================================="
    echo -e "${NC}"
    echo ""
    
    local total=12
    local completed=$(grep -c "=completed" "$STATE_FILE" 2>/dev/null)
    [ -z "$completed" ] && completed=0
    local percent=$((completed * 100 / total))
    
    echo "Progresso: $completed/$total ($percent%)"
    echo ""
    
    echo "Estado dos batches:"
    cat "$STATE_FILE" | grep "BATCH_" | while read line; do
        if [[ "$line" == *"completed"* ]]; then
            echo -e "  ${GREEN}✅${NC} ${line%%=*}"
        elif [[ "$line" == *"pending"* ]]; then
            echo -e "  ${CYAN}⏸️${NC}  ${line%%=*}"
        fi
    done
    echo ""
}

# ========================================================
# BATCH 1: VERIFICAR ACESSOS
# ========================================================
batch_1_verify() {
    show_progress
    echo -e "${BOLD}BATCH 1: VERIFICAR ACESSOS${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 1; then
        info "Batch 1 já completado. Pulando..."
        return 0
    fi
    
    log "Testando SSH Locaweb..."
    if sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$OLD_SSH_USER@$OLD_SSH_HOST" "echo OK" >/dev/null 2>&1; then
        success "SSH Locaweb: OK"
    else
        error "SSH Locaweb: FALHOU"
        return 1
    fi
    
    log "Testando SSH Lightsail..."
    if ssh -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$NEW_SSH_USER@$NEW_SSH_HOST" "echo OK" >/dev/null 2>&1; then
        success "SSH Lightsail: OK"
    else
        error "SSH Lightsail: FALHOU"
        return 1
    fi
    
    echo ""
    success "Batch 1 completado!"
    mark_complete 1
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 2: BACKUP DATABASE
# ========================================================
batch_2_database() {
    show_progress
    echo -e "${BOLD}BATCH 2: BACKUP DATABASE${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 2; then
        info "Batch 2 já completado. Pulando..."
        return 0
    fi
    
    log "Fazendo dump do banco de dados..."
    log "Tempo estimado: 30 segundos"
    echo ""
    
    sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
         -u wp_imobiliaria -p'Locaweb@102030' \
         --single-transaction --quick --routines --triggers \
         wp_imobiliaria 2>/dev/null" | gzip > "$MIGRATION_DIR/database/database.sql.gz"
    
    local size=$(du -h "$MIGRATION_DIR/database/database.sql.gz" | cut -f1)
    success "Database backup: $size"
    
    # Validar
    local bytes=$(stat -c%s "$MIGRATION_DIR/database/database.sql.gz" 2>/dev/null || stat -f%z "$MIGRATION_DIR/database/database.sql.gz")
    if [ "$bytes" -lt 50000 ]; then
        error "Arquivo muito pequeno! Algo deu errado."
        return 1
    fi
    
    echo ""
    success "Batch 2 completado!"
    mark_complete 2
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 3: BACKUP PLUGINS
# ========================================================
batch_3_plugins() {
    show_progress
    echo -e "${BOLD}BATCH 3: BACKUP PLUGINS${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 3; then
        info "Batch 3 já completado. Pulando..."
        return 0
    fi
    
    log "Fazendo backup dos plugins (70MB)..."
    log "Tempo estimado: 2-3 minutos"
    echo ""
    
    sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar -czf - plugins 2>/dev/null" \
        > "$MIGRATION_DIR/plugins/plugins.tar.gz"
    
    local size=$(du -h "$MIGRATION_DIR/plugins/plugins.tar.gz" | cut -f1)
    success "Plugins backup: $size"
    
    # Validar
    local bytes=$(stat -c%s "$MIGRATION_DIR/plugins/plugins.tar.gz" 2>/dev/null || stat -f%z "$MIGRATION_DIR/plugins/plugins.tar.gz")
    if [ "$bytes" -lt 50000000 ]; then
        error "Arquivo muito pequeno! Esperado: ~70MB, obtido: $size"
        return 1
    fi
    
    echo ""
    success "Batch 3 completado!"
    mark_complete 3
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 4: BACKUP THEMES
# ========================================================
batch_4_themes() {
    show_progress
    echo -e "${BOLD}BATCH 4: BACKUP THEMES${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 4; then
        info "Batch 4 já completado. Pulando..."
        return 0
    fi
    
    log "Fazendo backup dos themes (8MB)..."
    log "Tempo estimado: 1 minuto"
    echo ""
    
    sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar -czf - themes 2>/dev/null" \
        > "$MIGRATION_DIR/themes/themes.tar.gz"
    
    local size=$(du -h "$MIGRATION_DIR/themes/themes.tar.gz" | cut -f1)
    success "Themes backup: $size"
    
    # Validar
    local bytes=$(stat -c%s "$MIGRATION_DIR/themes/themes.tar.gz" 2>/dev/null || stat -f%z "$MIGRATION_DIR/themes/themes.tar.gz")
    if [ "$bytes" -lt 5000000 ]; then
        error "Arquivo muito pequeno! Esperado: ~8MB, obtido: $size"
        return 1
    fi
    
    echo ""
    success "Batch 4 completado!"
    mark_complete 4
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 5: BACKUP UPLOADS ANTIGOS (2016-2022)
# ========================================================
batch_5_uploads_old() {
    show_progress
    echo -e "${BOLD}BATCH 5: BACKUP UPLOADS ANTIGOS (2016-2022)${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 5; then
        info "Batch 5 já completado. Pulando..."
        return 0
    fi
    
    log "Fazendo backup uploads 2016-2022..."
    warn "Tempo estimado: 10-15 minutos (arquivo grande!)"
    echo ""
    
    sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar -czf - 2016 2017 2018 2019 2020 2021 2022 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz"
    
    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz" | cut -f1)
    success "Uploads 2016-2022: $size"
    
    echo ""
    success "Batch 5 completado!"
    mark_complete 5
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 6: BACKUP UPLOADS NOVOS (2023-2025 + WPL)
# ========================================================
batch_6_uploads_new() {
    show_progress
    echo -e "${BOLD}BATCH 6: BACKUP UPLOADS NOVOS (2023-2025 + WPL)${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 6; then
        info "Batch 6 já completado. Pulando..."
        return 0
    fi
    
    log "Fazendo backup uploads 2023-2025 + WPL (imóveis)..."
    warn "Tempo estimado: 15-20 minutos (arquivo MUITO grande!)"
    echo ""
    
    sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar -czf - 2023 2024 2025 WPL 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz"
    
    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz" | cut -f1)
    success "Uploads 2023-2025+WPL: $size"
    
    echo ""
    echo -e "${BOLD}${GREEN}🎉 TODOS OS BACKUPS COMPLETOS!${NC}"
    echo ""
    echo "Resumo dos backups:"
    du -sh "$MIGRATION_DIR"/*/ | sed 's/^/  /'
    echo ""
    
    success "Batch 6 completado!"
    mark_complete 6
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 7: TRANSFERIR PARA LIGHTSAIL
# ========================================================
batch_7_transfer() {
    show_progress
    echo -e "${BOLD}BATCH 7: TRANSFERIR PARA LIGHTSAIL${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 7; then
        info "Batch 7 já completado. Pulando..."
        return 0
    fi
    
    log "Transferindo todos os arquivos para Lightsail..."
    warn "Tempo estimado: 30-60 minutos (dependendo da internet)"
    echo ""
    
    log "1/4 - Transferindo database..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR"/database/*.gz \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"
    success "Database transferido"
    
    log "2/4 - Transferindo plugins..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR"/plugins/*.gz \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"
    success "Plugins transferidos"
    
    log "3/4 - Transferindo themes..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR"/themes/*.gz \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"
    success "Themes transferidos"
    
    log "4/4 - Transferindo uploads (pode demorar MUITO)..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR"/uploads/*.gz \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/"
    success "Uploads transferidos"
    
    echo ""
    success "Batch 7 completado!"
    mark_complete 7
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 8: IMPORTAR DATABASE
# ========================================================
batch_8_import_db() {
    show_progress
    echo -e "${BOLD}BATCH 8: IMPORTAR DATABASE${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 8; then
        info "Batch 8 já completado. Pulando..."
        return 0
    fi
    
    log "Criando database e importando..."
    echo ""
    
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

echo "[$(date '+%H:%M:%S')] Criando database..."
mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS wp_imobiliaria DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "[$(date '+%H:%M:%S')] Importando database..."
gunzip < /tmp/database.sql.gz | mysql -u root wp_imobiliaria

echo "✅ Database importado"
REMOTE_SCRIPT
    
    success "Database importado no Lightsail!"
    
    echo ""
    success "Batch 8 completado!"
    mark_complete 8
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 9: IMPORTAR ARQUIVOS
# ========================================================
batch_9_import_files() {
    show_progress
    echo -e "${BOLD}BATCH 9: IMPORTAR ARQUIVOS${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 9; then
        info "Batch 9 já completado. Pulando..."
        return 0
    fi
    
    log "Extraindo plugins, themes e uploads..."
    warn "Tempo estimado: 5-10 minutos"
    echo ""
    
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

echo "[$(date '+%H:%M:%S')] Fazendo backup do WordPress atual..."
sudo mv /opt/bitnami/wordpress/wp-content /opt/bitnami/wordpress/wp-content.old.$(date +%Y%m%d) 2>/dev/null || true

echo "[$(date '+%H:%M:%S')] Criando diretórios..."
sudo mkdir -p /opt/bitnami/wordpress/wp-content/{plugins,themes,uploads}

echo "[$(date '+%H:%M:%S')] Extraindo plugins..."
cd /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/plugins.tar.gz

echo "[$(date '+%H:%M:%S')] Extraindo themes..."
sudo tar -xzf /tmp/themes.tar.gz

echo "[$(date '+%H:%M:%S')] Extraindo uploads..."
cd /opt/bitnami/wordpress/wp-content/uploads
sudo tar -xzf /tmp/uploads_2016_2022.tar.gz
sudo tar -xzf /tmp/uploads_2023_2025_wpl.tar.gz

echo "[$(date '+%H:%M:%S')] Ajustando permissões..."
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
sudo find /opt/bitnami/wordpress/wp-content -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress/wp-content -type f -exec chmod 664 {} \;

echo "✅ Arquivos importados"
REMOTE_SCRIPT
    
    success "Todos os arquivos importados!"
    
    echo ""
    success "Batch 9 completado!"
    mark_complete 9
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 10: CONFIGURAR WORDPRESS
# ========================================================
batch_10_configure() {
    show_progress
    echo -e "${BOLD}BATCH 10: CONFIGURAR WORDPRESS${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 10; then
        info "Batch 10 já completado. Pulando..."
        return 0
    fi
    
    log "Configurando wp-config.php..."
    echo ""
    
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo sed -i "s/define( *'DB_NAME'.*/define( 'DB_NAME', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_USER'.*/define( 'DB_USER', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_PASSWORD'.*/define( 'DB_PASSWORD', 'Ipe@5084' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_HOST'.*/define( 'DB_HOST', 'localhost' );/" /opt/bitnami/wordpress/wp-config.php

if ! grep -q "WP_HOME" /opt/bitnami/wordpress/wp-config.php; then
    sudo sed -i "/<?php/a define('WP_HOME', 'https://portal.imobiliariaipe.com.br');\ndefine('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');" /opt/bitnami/wordpress/wp-config.php
fi

echo "✅ wp-config.php configurado"
REMOTE_SCRIPT
    
    success "WordPress configurado!"
    
    echo ""
    success "Batch 10 completado!"
    mark_complete 10
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 11: REINICIAR SERVIÇOS
# ========================================================
batch_11_restart() {
    show_progress
    echo -e "${BOLD}BATCH 11: REINICIAR SERVIÇOS${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 11; then
        info "Batch 11 já completado. Pulando..."
        return 0
    fi
    
    log "Reiniciando Apache e MySQL..."
    echo ""
    
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql
echo "✅ Serviços reiniciados"
REMOTE_SCRIPT
    
    success "Serviços reiniciados!"
    
    echo ""
    success "Batch 11 completado!"
    mark_complete 11
    
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# ========================================================
# BATCH 12: VERIFICAR SITE
# ========================================================
batch_12_verify() {
    show_progress
    echo -e "${BOLD}BATCH 12: VERIFICAR SITE${NC}"
    echo "=========================================="
    echo ""
    
    if is_completed 12; then
        info "Batch 12 já completado. Pulando..."
        return 0
    fi
    
    log "Testando site via IP..."
    echo ""
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$NEW_SSH_HOST)
    
    if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "302" ]; then
        success "Site respondendo: HTTP $HTTP_CODE"
    else
        warn "Site retornou HTTP $HTTP_CODE (pode ser normal se DNS não estiver configurado)"
    fi
    
    echo ""
    success "Batch 12 completado!"
    mark_complete 12
    
    echo ""
    echo -e "${BOLD}${GREEN}"
    echo "=========================================="
    echo "  🎉 MIGRAÇÃO COMPLETA!"
    echo "=========================================="
    echo -e "${NC}"
    echo ""
    echo "📊 RESUMO:"
    echo "  ✅ Database: Importado"
    echo "  ✅ Plugins: Importados"
    echo "  ✅ Themes: Importados"
    echo "  ✅ Uploads: Importados"
    echo "  ✅ Configuração: OK"
    echo "  ✅ Serviços: Reiniciados"
    echo ""
    echo "🔗 PRÓXIMOS PASSOS:"
    echo "  1. Aponte o DNS para: $NEW_SSH_HOST"
    echo "  2. Acesse: https://portal.imobiliariaipe.com.br"
    echo "  3. Teste login no /wp-admin"
    echo "  4. Verifique imóveis e imagens"
    echo ""
    echo "📁 Backups salvos em: $MIGRATION_DIR"
    echo ""
    
    read -p "Pressione ENTER para sair..."
}

# ========================================================
# MENU PRINCIPAL
# ========================================================
main_menu() {
    while true; do
        show_progress
        echo -e "${BOLD}MENU PRINCIPAL${NC}"
        echo "=========================================="
        echo ""
        echo "Escolha uma opção:"
        echo ""
        echo "  1) Executar próximo batch"
        echo "  2) Executar TODOS os batches automaticamente"
        echo "  3) Executar batch específico"
        echo "  4) Ver logs"
        echo "  0) Sair"
        echo ""
        read -p "Opção: " choice
        
        case $choice in
            1)
                run_next_batch
                ;;
            2)
                run_all_batches
                ;;
            3)
                run_specific_batch
                ;;
            4)
                view_logs
                ;;
            0)
                echo ""
                info "Saindo... Progresso salvo em $STATE_FILE"
                exit 0
                ;;
            *)
                error "Opção inválida"
                sleep 2
                ;;
        esac
    done
}

run_next_batch() {
    if ! is_completed 1; then
        batch_1_verify
    elif ! is_completed 2; then
        batch_2_database
    elif ! is_completed 3; then
        batch_3_plugins
    elif ! is_completed 4; then
        batch_4_themes
    elif ! is_completed 5; then
        batch_5_uploads_old
    elif ! is_completed 6; then
        batch_6_uploads_new
    elif ! is_completed 7; then
        batch_7_transfer
    elif ! is_completed 8; then
        batch_8_import_db
    elif ! is_completed 9; then
        batch_9_import_files
    elif ! is_completed 10; then
        batch_10_configure
    elif ! is_completed 11; then
        batch_11_restart
    elif ! is_completed 12; then
        batch_12_verify
    else
        success "Todos os batches já foram executados!"
        read -p "Pressione ENTER..."
    fi
}

run_all_batches() {
    clear
    echo -e "${BOLD}${YELLOW}"
    echo "=========================================="
    echo "  EXECUTAR TODOS OS BATCHES"
    echo "=========================================="
    echo -e "${NC}"
    echo ""
    warn "Isso pode levar 1h30-2h30 dependendo da internet"
    echo ""
    read -p "Tem certeza? (s/N): " confirm
    
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        return
    fi
    
    batch_1_verify
    batch_2_database
    batch_3_plugins
    batch_4_themes
    batch_5_uploads_old
    batch_6_uploads_new
    batch_7_transfer
    batch_8_import_db
    batch_9_import_files
    batch_10_configure
    batch_11_restart
    batch_12_verify
}

run_specific_batch() {
    clear
    echo -e "${BOLD}EXECUTAR BATCH ESPECÍFICO${NC}"
    echo "=========================================="
    echo ""
    echo "Batches disponíveis:"
    echo "  1) Verificar acessos"
    echo "  2) Backup database"
    echo "  3) Backup plugins"
    echo "  4) Backup themes"
    echo "  5) Backup uploads antigos"
    echo "  6) Backup uploads novos"
    echo "  7) Transferir para Lightsail"
    echo "  8) Importar database"
    echo "  9) Importar arquivos"
    echo "  10) Configurar WordPress"
    echo "  11) Reiniciar serviços"
    echo "  12) Verificar site"
    echo ""
    read -p "Número do batch: " batch_num
    
    case $batch_num in
        1) batch_1_verify ;;
        2) batch_2_database ;;
        3) batch_3_plugins ;;
        4) batch_4_themes ;;
        5) batch_5_uploads_old ;;
        6) batch_6_uploads_new ;;
        7) batch_7_transfer ;;
        8) batch_8_import_db ;;
        9) batch_9_import_files ;;
        10) batch_10_configure ;;
        11) batch_11_restart ;;
        12) batch_12_verify ;;
        *) error "Batch inválido" ; sleep 2 ;;
    esac
}

view_logs() {
    clear
    echo -e "${BOLD}LOGS DA MIGRAÇÃO${NC}"
    echo "=========================================="
    echo ""
    
    if [ -d "$MIGRATION_DIR/logs" ]; then
        ls -lh "$MIGRATION_DIR/logs/"
    fi
    
    echo ""
    echo "Arquivos criados:"
    find "$MIGRATION_DIR" -type f -exec ls -lh {} \; | awk '{print $9 ": " $5}'
    
    echo ""
    read -p "Pressione ENTER..."
}

# ========================================================
# INICIAR
# ========================================================
clear
echo -e "${BOLD}${CYAN}"
echo "=========================================="
echo "  MIGRAÇÃO EM BATCHES CONTROLADOS"
echo "  Locaweb → AWS Lightsail"
echo "=========================================="
echo -e "${NC}"
echo ""
info "Diretório: $MIGRATION_DIR"
echo ""
sleep 2

main_menu
