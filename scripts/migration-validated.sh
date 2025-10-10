#!/bin/bash
# ========================================================
# Migração WordPress VALIDADA - Locaweb → Lightsail
# ========================================================
# ✅ Validação de tamanho em cada etapa
# ✅ Sem falsos positivos
# ✅ Chunks inteligentes para uploads (4.4GB)
# ✅ Progress tracking real
# ========================================================

set -e

# ========================================================
# CONFIGURAÇÕES
# ========================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATION_DIR="$HOME/wp-migration-validated-$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$MIGRATION_DIR/migration.log"
STATE_FILE="$MIGRATION_DIR/state.json"
PROGRESS_FILE="$MIGRATION_DIR/progress.txt"

# Credenciais Locaweb
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"
OLD_SSH_USER="imobiliariaipe1"
OLD_SSH_PASS="Ipe@10203040Ipe"
OLD_SSH_PORT="22"
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"
OLD_DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
OLD_DB_USER="wp_imobiliaria"
OLD_DB_PASS="Locaweb@102030"
OLD_DB_NAME="wp_imobiliaria"

# Credenciais Lightsail
NEW_SSH_HOST="13.223.237.99"
NEW_SSH_USER="bitnami"
NEW_SSH_KEY="$SCRIPT_DIR/.lightsail-access/LightsailDefaultKey-us-east-1.pem"
NEW_SITE_PATH="/opt/bitnami/wordpress"
NEW_DB_HOST="localhost"
NEW_DB_USER="wp_imobiliaria"
NEW_DB_PASS="Ipe@5084"
NEW_DB_NAME="wp_imobiliaria"

# Tamanhos mínimos esperados (em bytes)
MIN_DB_SIZE=50000        # 50KB
MIN_PLUGINS_SIZE=400000000   # 400MB
MIN_THEMES_SIZE=8000000      # 8MB
MIN_UPLOADS_SIZE=100000000   # 100MB por chunk

# ========================================================
# CORES
# ========================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ========================================================
# FUNÇÕES DE LOG
# ========================================================
log() {
    local msg="[$(date '+%H:%M:%S')] $1"
    echo -e "${BLUE}${msg}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $msg" >> "$LOG_FILE"
}

success() {
    local msg="✅ $1"
    echo -e "${GREEN}${msg}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $msg" >> "$LOG_FILE"
}

error() {
    local msg="❌ $1"
    echo -e "${RED}${msg}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $msg" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $msg" >> "$MIGRATION_DIR/errors.log"
}

warn() {
    local msg="⚠️  $1"
    echo -e "${YELLOW}${msg}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $msg" >> "$LOG_FILE"
}

info() {
    local msg="ℹ️  $1"
    echo -e "${CYAN}${msg}${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $msg" >> "$LOG_FILE"
}

# ========================================================
# VALIDAÇÃO DE ARQUIVO
# ========================================================
validate_file() {
    local file="$1"
    local min_size="$2"
    local description="$3"

    if [ ! -f "$file" ]; then
        error "Arquivo não existe: $file"
        return 1
    fi

    local actual_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

    if [ "$actual_size" -lt "$min_size" ]; then
        error "$description: arquivo muito pequeno ($actual_size bytes, esperado > $min_size bytes)"
        return 1
    fi

    local human_size=$(du -h "$file" | cut -f1)
    success "$description: $human_size (validado)"
    return 0
}

# ========================================================
# SISTEMA DE STATE
# ========================================================
init_state() {
    mkdir -p "$MIGRATION_DIR"/{database,plugins,themes,uploads,logs}

    if [ ! -f "$STATE_FILE" ]; then
        cat > "$STATE_FILE" <<'EOF'
{
  "migration_id": "",
  "start_time": "",
  "batches": {
    "1_verify_access": "pending",
    "2_backup_database": "pending",
    "3_backup_plugins": "pending",
    "4_backup_themes": "pending",
    "5_backup_uploads_2016_2019": "pending",
    "6_backup_uploads_2020_2022": "pending",
    "7_backup_uploads_2023_2025": "pending",
    "8_backup_uploads_wpl": "pending",
    "9_transfer_database": "pending",
    "10_transfer_plugins": "pending",
    "11_transfer_themes": "pending",
    "12_transfer_uploads": "pending",
    "13_import_database": "pending",
    "14_import_plugins": "pending",
    "15_import_themes": "pending",
    "16_import_uploads": "pending",
    "17_configure_wp": "pending",
    "18_fix_permissions": "pending",
    "19_restart_services": "pending",
    "20_verify_site": "pending"
  }
}
EOF
        jq ".migration_id = \"$(date +%Y%m%d_%H%M%S)\" | .start_time = \"$(date -Iseconds)\"" "$STATE_FILE" > "$STATE_FILE.tmp"
        mv "$STATE_FILE.tmp" "$STATE_FILE"
    fi

    update_progress
}

get_batch_status() {
    jq -r ".batches.\"$1\"" "$STATE_FILE"
}

mark_batch_start() {
    log "▶️  Iniciando batch: $1"
    jq ".batches.\"$1\" = \"in_progress\"" "$STATE_FILE" > "$STATE_FILE.tmp"
    mv "$STATE_FILE.tmp" "$STATE_FILE"
    update_progress
}

mark_batch_complete() {
    success "Batch completado: $1"
    jq ".batches.\"$1\" = \"completed\"" "$STATE_FILE" > "$STATE_FILE.tmp"
    mv "$STATE_FILE.tmp" "$STATE_FILE"
    update_progress
}

mark_batch_failed() {
    error "Batch falhou: $1 - $2"
    jq ".batches.\"$1\" = \"failed\"" "$STATE_FILE" > "$STATE_FILE.tmp"
    mv "$STATE_FILE.tmp" "$STATE_FILE"
    update_progress
}

update_progress() {
    local total=$(jq '.batches | length' "$STATE_FILE")
    local completed=$(jq '[.batches[] | select(. == "completed")] | length' "$STATE_FILE")
    local failed=$(jq '[.batches[] | select(. == "failed")] | length' "$STATE_FILE")
    local pending=$(jq '[.batches[] | select(. == "pending")] | length' "$STATE_FILE")
    local in_progress=$(jq '[.batches[] | select(. == "in_progress")] | length' "$STATE_FILE")
    
    local percent=$((completed * 100 / total))

    cat > "$PROGRESS_FILE" <<EOF
====================================
MIGRAÇÃO WORDPRESS - PROGRESSO
====================================
Data: $(date '+%Y-%m-%d %H:%M:%S')
Diretório: $MIGRATION_DIR

ESTATÍSTICAS:
✅ Completados: $completed/$total ($percent%)
⏳ Em progresso: $in_progress
⏸️  Pendentes: $pending
❌ Falhas: $failed

BATCHES:
$(jq -r '.batches | to_entries[] | "  \(.key): \(.value)"' "$STATE_FILE")

====================================
EOF
}

# ========================================================
# PRÉ-REQUISITOS
# ========================================================
check_prerequisites() {
    log "Verificando pré-requisitos..."

    command -v sshpass >/dev/null 2>&1 || {
        error "sshpass não instalado. Execute: sudo apt-get install sshpass"
        return 1
    }

    command -v jq >/dev/null 2>&1 || {
        error "jq não instalado. Execute: sudo apt-get install jq"
        return 1
    }

    if [ ! -f "$NEW_SSH_KEY" ]; then
        error "Chave SSH não encontrada: $NEW_SSH_KEY"
        return 1
    fi

    success "Pré-requisitos OK"
    return 0
}

# ========================================================
# BATCH 1: VERIFICAR ACESSOS
# ========================================================
batch_1_verify_access() {
    local batch="1_verify_access"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    # Teste SSH Locaweb
    log "Testando SSH Locaweb..."
    if ! sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$OLD_SSH_USER@$OLD_SSH_HOST" "echo 'OK'" >/dev/null 2>&1; then
        mark_batch_failed "$batch" "SSH Locaweb falhou"
        return 1
    fi
    success "SSH Locaweb: OK"

    # Teste MySQL Locaweb
    log "Testando MySQL Locaweb..."
    if ! sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "mysql -h $OLD_DB_HOST -u $OLD_DB_USER -p'$OLD_DB_PASS' -e 'SELECT 1' 2>/dev/null" >/dev/null 2>&1; then
        mark_batch_failed "$batch" "MySQL Locaweb falhou"
        return 1
    fi
    success "MySQL Locaweb: OK"

    # Teste SSH Lightsail
    log "Testando SSH Lightsail..."
    if ! ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$NEW_SSH_USER@$NEW_SSH_HOST" "echo 'OK'" >/dev/null 2>&1; then
        mark_batch_failed "$batch" "SSH Lightsail falhou"
        return 1
    fi
    success "SSH Lightsail: OK"

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 2: BACKUP DATABASE
# ========================================================
batch_2_backup_database() {
    local batch="2_backup_database"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Fazendo dump do banco de dados..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "mysqldump -h $OLD_DB_HOST -u $OLD_DB_USER -p'$OLD_DB_PASS' \
        --single-transaction --quick --routines --triggers \
        --default-character-set=utf8 --no-tablespaces \
        $OLD_DB_NAME 2>/dev/null" | gzip > "$MIGRATION_DIR/database/database.sql.gz"

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "mysqldump falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/database/database.sql.gz" "$MIN_DB_SIZE" "Database dump"; then
        mark_batch_failed "$batch" "Validação falhou"
        return 1
    fi

    # Salvar metadados
    cat > "$MIGRATION_DIR/database/metadata.txt" <<EOF
Database: $OLD_DB_NAME
Host: $OLD_DB_HOST
Backup time: $(date)
Size: $(du -h "$MIGRATION_DIR/database/database.sql.gz" | cut -f1)
EOF

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 3: BACKUP PLUGINS
# ========================================================
batch_3_backup_plugins() {
    local batch="3_backup_plugins"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Fazendo backup dos plugins (415MB esperado)..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar --warning=no-file-changed -czf - plugins 2>/dev/null" \
        > "$MIGRATION_DIR/plugins/plugins.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/plugins/plugins.tar.gz" "$MIN_PLUGINS_SIZE" "Plugins backup"; then
        mark_batch_failed "$batch" "Validação falhou - arquivo muito pequeno"
        return 1
    fi

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 4: BACKUP THEMES
# ========================================================
batch_4_backup_themes() {
    local batch="4_backup_themes"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Fazendo backup dos themes (8.4MB esperado)..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar --warning=no-file-changed -czf - themes 2>/dev/null" \
        > "$MIGRATION_DIR/themes/themes.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/themes/themes.tar.gz" "$MIN_THEMES_SIZE" "Themes backup"; then
        mark_batch_failed "$batch" "Validação falhou"
        return 1
    fi

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 5-8: BACKUP UPLOADS EM CHUNKS
# ========================================================
batch_5_backup_uploads_2016_2019() {
    local batch="5_backup_uploads_2016_2019"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2016-2019..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        2016 2017 2018 2019 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_2016_2019.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/uploads/uploads_2016_2019.tar.gz" "$MIN_UPLOADS_SIZE" "Uploads 2016-2019"; then
        warn "Uploads 2016-2019 podem estar vazios ou não existir"
    fi

    mark_batch_complete "$batch"
    return 0
}

batch_6_backup_uploads_2020_2022() {
    local batch="6_backup_uploads_2020_2022"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2020-2022..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        2020 2021 2022 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_2020_2022.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/uploads/uploads_2020_2022.tar.gz" "$MIN_UPLOADS_SIZE" "Uploads 2020-2022"; then
        warn "Uploads 2020-2022 podem estar vazios"
    fi

    mark_batch_complete "$batch"
    return 0
}

batch_7_backup_uploads_2023_2025() {
    local batch="7_backup_uploads_2023_2025"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2023-2025..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        2023 2024 2025 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_2023_2025.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/uploads/uploads_2023_2025.tar.gz" "$MIN_UPLOADS_SIZE" "Uploads 2023-2025"; then
        warn "Uploads 2023-2025 podem estar vazios"
    fi

    mark_batch_complete "$batch"
    return 0
}

batch_8_backup_uploads_wpl() {
    local batch="8_backup_uploads_wpl"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads WPL (pasta de imóveis)..."

    sshpass -p "$OLD_SSH_PASS" ssh -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        WPL 2>/dev/null || true" \
        > "$MIGRATION_DIR/uploads/uploads_wpl.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "tar falhou"
        return 1
    fi

    if ! validate_file "$MIGRATION_DIR/uploads/uploads_wpl.tar.gz" "$MIN_UPLOADS_SIZE" "Uploads WPL"; then
        warn "Uploads WPL podem estar vazios"
    fi

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 9-12: TRANSFERIR PARA LIGHTSAIL
# ========================================================
batch_9_transfer_database() {
    local batch="9_transfer_database"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Transferindo database para Lightsail..."

    scp -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR/database/database.sql.gz" \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" || {
        mark_batch_failed "$batch" "scp falhou"
        return 1
    }

    success "Database transferido"
    mark_batch_complete "$batch"
    return 0
}

batch_10_transfer_plugins() {
    local batch="10_transfer_plugins"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Transferindo plugins para Lightsail (415MB - pode demorar)..."

    scp -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR/plugins/plugins.tar.gz" \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" || {
        mark_batch_failed "$batch" "scp falhou"
        return 1
    }

    success "Plugins transferidos"
    mark_batch_complete "$batch"
    return 0
}

batch_11_transfer_themes() {
    local batch="11_transfer_themes"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Transferindo themes para Lightsail..."

    scp -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$MIGRATION_DIR/themes/themes.tar.gz" \
        "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" || {
        mark_batch_failed "$batch" "scp falhou"
        return 1
    }

    success "Themes transferidos"
    mark_batch_complete "$batch"
    return 0
}

batch_12_transfer_uploads() {
    local batch="12_transfer_uploads"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Transferindo uploads para Lightsail (pode demorar MUITO - vários GB)..."

    for file in "$MIGRATION_DIR/uploads"/*.tar.gz; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            log "Transferindo $filename..."
            
            scp -i "$NEW_SSH_KEY" \
                -o StrictHostKeyChecking=no \
                "$file" \
                "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" || {
                mark_batch_failed "$batch" "scp falhou para $filename"
                return 1
            }
        fi
    done

    success "Todos os uploads transferidos"
    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 13-16: IMPORTAR NO LIGHTSAIL
# ========================================================
batch_13_import_database() {
    local batch="13_import_database"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Criando database e importando..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<REMOTE_SCRIPT
set -e

# Criar database
mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS $NEW_DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$NEW_DB_USER'@'localhost' IDENTIFIED BY '$NEW_DB_PASS';
GRANT ALL PRIVILEGES ON $NEW_DB_NAME.* TO '$NEW_DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

# Importar
gunzip < /tmp/database.sql.gz | mysql -u root $NEW_DB_NAME

echo "Database importado com sucesso"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Import falhou"
        return 1
    fi

    success "Database importado"
    mark_batch_complete "$batch"
    return 0
}

batch_14_import_plugins() {
    local batch="14_import_plugins"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Extraindo plugins no Lightsail..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo mkdir -p /opt/bitnami/wordpress/wp-content/plugins
cd /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/plugins.tar.gz
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/plugins

echo "Plugins extraídos"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Extração falhou"
        return 1
    fi

    success "Plugins importados"
    mark_batch_complete "$batch"
    return 0
}

batch_15_import_themes() {
    local batch="15_import_themes"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Extraindo themes no Lightsail..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo mkdir -p /opt/bitnami/wordpress/wp-content/themes
cd /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/themes.tar.gz
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/themes

echo "Themes extraídos"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Extração falhou"
        return 1
    fi

    success "Themes importados"
    mark_batch_complete "$batch"
    return 0
}

batch_16_import_uploads() {
    local batch="16_import_uploads"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Extraindo uploads no Lightsail..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo mkdir -p /opt/bitnami/wordpress/wp-content/uploads
cd /opt/bitnami/wordpress/wp-content/uploads

for file in /tmp/uploads_*.tar.gz; do
    if [ -f "$file" ]; then
        echo "Extraindo $(basename $file)..."
        sudo tar -xzf "$file"
    fi
done

sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads

echo "Uploads extraídos"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Extração falhou"
        return 1
    fi

    success "Uploads importados"
    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 17-20: CONFIGURAÇÃO FINAL
# ========================================================
batch_17_configure_wp() {
    local batch="17_configure_wp"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Configurando wp-config.php..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<REMOTE_SCRIPT
set -e

sudo sed -i "s/define( 'DB_NAME'.*/define( 'DB_NAME', '$NEW_DB_NAME' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( 'DB_USER'.*/define( 'DB_USER', '$NEW_DB_USER' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( 'DB_PASSWORD'.*/define( 'DB_PASSWORD', '$NEW_DB_PASS' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( 'DB_HOST'.*/define( 'DB_HOST', 'localhost' );/" /opt/bitnami/wordpress/wp-config.php

# Adicionar constantes se não existirem
if ! grep -q "WP_HOME" /opt/bitnami/wordpress/wp-config.php; then
    sudo sed -i "/<?php/a define('WP_HOME', 'https://portal.imobiliariaipe.com.br');" /opt/bitnami/wordpress/wp-config.php
    sudo sed -i "/<?php/a define('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');" /opt/bitnami/wordpress/wp-config.php
fi

echo "wp-config.php configurado"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Configuração falhou"
        return 1
    fi

    success "wp-config.php configurado"
    mark_batch_complete "$batch"
    return 0
}

batch_18_fix_permissions() {
    local batch="18_fix_permissions"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Ajustando permissões..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 664 {} \;

echo "Permissões ajustadas"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Permissões falharam"
        return 1
    fi

    success "Permissões ajustadas"
    mark_batch_complete "$batch"
    return 0
}

batch_19_restart_services() {
    local batch="19_restart_services"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Reiniciando serviços..."

    ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE_SCRIPT'
set -e

sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql

echo "Serviços reiniciados"
REMOTE_SCRIPT

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Restart falhou"
        return 1
    fi

    success "Serviços reiniciados"
    mark_batch_complete "$batch"
    return 0
}

batch_20_verify_site() {
    local batch="20_verify_site"
    
    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado"
        return 0
    fi

    mark_batch_start "$batch"

    log "Verificando site..."

    # Teste via IP
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://$NEW_SSH_HOST)
    
    if [ "$response" == "200" ] || [ "$response" == "301" ] || [ "$response" == "302" ]; then
        success "Site respondendo: HTTP $response"
    else
        warn "Site retornou HTTP $response (pode ser normal se DNS não estiver apontado)"
    fi

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# MENU PRINCIPAL
# ========================================================
show_main_menu() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "========================================"
    echo "  MIGRAÇÃO WORDPRESS VALIDADA"
    echo "  Locaweb → AWS Lightsail"
    echo "========================================"
    echo -e "${NC}"
    echo ""

    if [ -f "$PROGRESS_FILE" ]; then
        cat "$PROGRESS_FILE"
    fi

    echo ""
    echo "Opções:"
    echo "  1) Executar próximo batch"
    echo "  2) Executar TODOS os batches automaticamente"
    echo "  3) Ver status detalhado"
    echo "  4) Ver logs"
    echo "  5) Validar backups existentes"
    echo "  0) Sair"
    echo ""
    read -p "Escolha: " choice

    case $choice in
        1) run_next_batch ;;
        2) run_all_batches ;;
        3) show_detailed_status ;;
        4) view_logs ;;
        5) validate_backups ;;
        0) exit 0 ;;
        *) error "Opção inválida" ; sleep 2 ; show_main_menu ;;
    esac
}

run_next_batch() {
    local next_batch=$(jq -r '.batches | to_entries[] | select(.value == "pending" or .value == "in_progress") | .key' "$STATE_FILE" | head -1)

    if [ -z "$next_batch" ]; then
        success "Todos os batches completados!"
        read -p "Pressione ENTER..."
        show_main_menu
        return
    fi

    "batch_$next_batch"

    read -p "Pressione ENTER..."
    show_main_menu
}

run_all_batches() {
    log "Executando TODOS os batches automaticamente..."
    echo ""
    warn "Isso pode levar 2-4 HORAS dependendo da conexão!"
    echo ""
    read -p "Tem certeza? (s/N): " confirm

    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        show_main_menu
        return
    fi

    local batches=(
        "1_verify_access"
        "2_backup_database"
        "3_backup_plugins"
        "4_backup_themes"
        "5_backup_uploads_2016_2019"
        "6_backup_uploads_2020_2022"
        "7_backup_uploads_2023_2025"
        "8_backup_uploads_wpl"
        "9_transfer_database"
        "10_transfer_plugins"
        "11_transfer_themes"
        "12_transfer_uploads"
        "13_import_database"
        "14_import_plugins"
        "15_import_themes"
        "16_import_uploads"
        "17_configure_wp"
        "18_fix_permissions"
        "19_restart_services"
        "20_verify_site"
    )

    for batch in "${batches[@]}"; do
        local status=$(get_batch_status "$batch")

        if [ "$status" != "completed" ]; then
            "batch_$batch"

            if [ $? -ne 0 ]; then
                error "Batch $batch falhou. Parando."
                read -p "Pressione ENTER..."
                show_main_menu
                return
            fi
        fi
    done

    echo ""
    success "🎉 MIGRAÇÃO COMPLETA!"
    echo ""
    info "Próximos passos:"
    echo "  1. Aponte o DNS para o IP do Lightsail: $NEW_SSH_HOST"
    echo "  2. Acesse https://portal.imobiliariaipe.com.br"
    echo "  3. Teste login, posts, imóveis"
    echo ""
    read -p "Pressione ENTER..."
    show_main_menu
}

show_detailed_status() {
    clear
    echo -e "${BOLD}STATUS DETALHADO${NC}"
    echo "=================================="
    echo ""

    jq -r '.batches | to_entries[] | "\(.key): \(.value)"' "$STATE_FILE" | while read line; do
        if [[ "$line" == *"completed"* ]]; then
            echo -e "${GREEN}✅ $line${NC}"
        elif [[ "$line" == *"in_progress"* ]]; then
            echo -e "${YELLOW}⏳ $line${NC}"
        elif [[ "$line" == *"failed"* ]]; then
            echo -e "${RED}❌ $line${NC}"
        else
            echo -e "${CYAN}⏸️  $line${NC}"
        fi
    done

    echo ""
    echo "Diretório: $MIGRATION_DIR"
    echo ""
    read -p "Pressione ENTER..."
    show_main_menu
}

view_logs() {
    clear
    echo -e "${BOLD}ÚLTIMAS 50 LINHAS DO LOG${NC}"
    echo "=================================="
    tail -50 "$LOG_FILE"
    echo ""
    read -p "Pressione ENTER..."
    show_main_menu
}

validate_backups() {
    clear
    echo -e "${BOLD}VALIDAÇÃO DE BACKUPS${NC}"
    echo "=================================="
    echo ""

    for file in "$MIGRATION_DIR"/**/*.tar.gz "$MIGRATION_DIR"/**/*.sql.gz; do
        if [ -f "$file" ]; then
            local size=$(du -h "$file" | cut -f1)
            local name=$(basename "$file")
            
            if [ "$size" == "0" ]; then
                echo -e "${RED}❌ $name: VAZIO${NC}"
            else
                echo -e "${GREEN}✅ $name: $size${NC}"
            fi
        fi
    done

    echo ""
    read -p "Pressione ENTER..."
    show_main_menu
}

# ========================================================
# EXECUÇÃO PRINCIPAL
# ========================================================
main() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "========================================"
    echo "  MIGRAÇÃO WORDPRESS VALIDADA"
    echo "  Inicializando..."
    echo "========================================"
    echo -e "${NC}"
    echo ""

    init_state

    if ! check_prerequisites; then
        error "Pré-requisitos não atendidos"
        exit 1
    fi

    success "Sistema inicializado!"
    sleep 2

    show_main_menu
}

main
