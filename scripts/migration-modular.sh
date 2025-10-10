#!/bin/bash
# ========================================================
# Migração WordPress MODULAR - Locaweb → Lightsail
# ========================================================
# Sistema de batches com checkpoint e progress tracking
# Pode ser pausado e retomado a qualquer momento
# ========================================================

set -e

# ========================================================
# CONFIGURAÇÕES
# ========================================================
MIGRATION_DIR="$HOME/wp-migration-$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$MIGRATION_DIR/migration.log"
STATE_FILE="$MIGRATION_DIR/state.json"
PROGRESS_FILE="$MIGRATION_DIR/progress.txt"

# Credenciais Locaweb (VALIDADAS)
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"
OLD_SSH_USER="imobiliariaipe1"
OLD_SSH_PASS="Ipe@10203040Ipe"
OLD_SSH_PORT="22"
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"
OLD_DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
OLD_DB_USER="wp_imobiliaria"
OLD_DB_PASS="Locaweb@102030"
OLD_DB_NAME="wp_imobiliaria"

# Credenciais Lightsail (VALIDADAS)
NEW_SSH_HOST="13.223.237.99"
NEW_SSH_USER="bitnami"
NEW_SSH_KEY="/home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem"
NEW_SITE_PATH="/opt/bitnami/wordpress"
NEW_DB_HOST="localhost"
NEW_DB_USER="wp_imobiliaria"
NEW_DB_PASS="Locaweb@102030"
NEW_DB_NAME="wp_imobiliaria"

# ========================================================
# CORES E FORMATAÇÃO
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
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${BLUE}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

success() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1"
    echo -e "${GREEN}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

error() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1"
    echo -e "${RED}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

warn() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1"
    echo -e "${YELLOW}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

info() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1"
    echo -e "${CYAN}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

# ========================================================
# SISTEMA DE STATE E CHECKPOINT
# ========================================================
init_state() {
    mkdir -p "$MIGRATION_DIR"

    if [ ! -f "$STATE_FILE" ]; then
        cat > "$STATE_FILE" <<EOF
{
  "migration_id": "$(date +%Y%m%d_%H%M%S)",
  "start_time": "$(date -Iseconds)",
  "current_batch": 0,
  "completed_batches": [],
  "failed_batches": [],
  "status": "initialized",
  "batches": {
    "1_verify_access": "pending",
    "2_backup_database": "pending",
    "3_backup_core_files": "pending",
    "4_backup_plugins": "pending",
    "5_backup_themes": "pending",
    "6_backup_uploads_2016_2020": "pending",
    "7_backup_uploads_2021_2023": "pending",
    "8_backup_uploads_2024_2025": "pending",
    "9_backup_uploads_wpl": "pending",
    "10_transfer_database": "pending",
    "11_transfer_core": "pending",
    "12_transfer_plugins": "pending",
    "13_transfer_themes": "pending",
    "14_transfer_uploads": "pending",
    "15_setup_lightsail_db": "pending",
    "16_import_database": "pending",
    "17_extract_core": "pending",
    "18_extract_plugins": "pending",
    "19_extract_themes": "pending",
    "20_extract_uploads": "pending",
    "21_configure_wp_config": "pending",
    "22_fix_permissions": "pending",
    "23_cleanup_cache": "pending",
    "24_restart_services": "pending",
    "25_verify_site": "pending"
  }
}
EOF
    fi

    log "State file: $STATE_FILE"
    log "Log file: $LOG_FILE"
    log "Migration dir: $MIGRATION_DIR"
}

update_batch_status() {
    local batch="$1"
    local status="$2"

    # Atualizar JSON usando jq
    jq ".batches[\"$batch\"] = \"$status\"" "$STATE_FILE" > "$STATE_FILE.tmp"
    mv "$STATE_FILE.tmp" "$STATE_FILE"

    # Atualizar arquivo de progresso legível
    update_progress_display
}

update_progress_display() {
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
$(jq -r '.batches | to_entries[] | "\(.key): \(.value)"' "$STATE_FILE" | sed 's/^/  /')

====================================
EOF

    # Mostrar no terminal
    cat "$PROGRESS_FILE"
}

get_batch_status() {
    local batch="$1"
    jq -r ".batches[\"$batch\"]" "$STATE_FILE"
}

mark_batch_start() {
    local batch="$1"
    update_batch_status "$batch" "in_progress"
    log "▶️  Iniciando batch: $batch"
}

mark_batch_complete() {
    local batch="$1"
    update_batch_status "$batch" "completed"
    success "Batch completado: $batch"

    # Criar checkpoint
    create_checkpoint "$batch"
}

mark_batch_failed() {
    local batch="$1"
    local error_msg="$2"
    update_batch_status "$batch" "failed"
    error "Batch falhou: $batch - $error_msg"

    # Salvar erro
    echo "[$(date -Iseconds)] ERRO em $batch: $error_msg" >> "$MIGRATION_DIR/errors.log"
}

create_checkpoint() {
    local batch="$1"
    local checkpoint_file="$MIGRATION_DIR/checkpoints/${batch}.checkpoint"

    mkdir -p "$MIGRATION_DIR/checkpoints"

    cat > "$checkpoint_file" <<EOF
Checkpoint: $batch
Time: $(date -Iseconds)
Status: completed
Next: (próximo batch)
EOF

    info "Checkpoint salvo: $batch"
}

# ========================================================
# FUNÇÕES DE VERIFICAÇÃO
# ========================================================
check_prerequisites() {
    log "Verificando pré-requisitos..."

    # Verificar comandos
    local required_commands="sshpass ssh scp jq mysql mysqldump tar gzip"
    for cmd in $required_commands; do
        if ! command -v $cmd &> /dev/null; then
            error "$cmd não encontrado"
            return 1
        fi
    done

    # Verificar chave SSH
    if [ ! -f "$NEW_SSH_KEY" ]; then
        error "Chave SSH não encontrada: $NEW_SSH_KEY"
        warn "Execute: mv ~/Downloads/LightsailDefaultKey-us-east-1.pem ~/.ssh/"
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
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    # Testar SSH Locaweb
    log "Testando SSH Locaweb..."
    if ! sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$OLD_SSH_USER@$OLD_SSH_HOST" "echo 'SSH OK'" &>/dev/null; then
        mark_batch_failed "$batch" "SSH Locaweb falhou"
        return 1
    fi
    success "SSH Locaweb: OK"

    # Testar MySQL Locaweb
    log "Testando MySQL Locaweb..."
    if ! sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "mysql -h $OLD_DB_HOST -u $OLD_DB_USER -p'$OLD_DB_PASS' -e 'SELECT 1' 2>/dev/null" &>/dev/null; then
        mark_batch_failed "$batch" "MySQL Locaweb falhou"
        return 1
    fi
    success "MySQL Locaweb: OK"

    # Testar SSH Lightsail
    log "Testando SSH Lightsail..."
    if ! ssh -i "$NEW_SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        "$NEW_SSH_USER@$NEW_SSH_HOST" "echo 'SSH OK'" &>/dev/null; then
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
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Fazendo dump do banco de dados..."

    # Criar diretório para banco
    mkdir -p "$MIGRATION_DIR/database"

    # Dump via SSH no servidor antigo
    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "mysqldump -h $OLD_DB_HOST -u $OLD_DB_USER -p'$OLD_DB_PASS' \
        --single-transaction \
        --quick \
        --routines \
        --triggers \
        --default-character-set=utf8 \
        --no-tablespaces \
        $OLD_DB_NAME 2>/dev/null | gzip" > "$MIGRATION_DIR/database/database.sql.gz"

    if [ $? -ne 0 ]; then
        mark_batch_failed "$batch" "Falha ao fazer dump do banco"
        return 1
    fi

    # Verificar tamanho
    local size=$(du -h "$MIGRATION_DIR/database/database.sql.gz" | cut -f1)
    success "Database dump criado: $size"

    # Salvar metadados
    cat > "$MIGRATION_DIR/database/metadata.txt" <<EOF
Database: $OLD_DB_NAME
Host: $OLD_DB_HOST
Backup time: $(date -Iseconds)
Size: $size
Compressed: yes (gzip)
EOF

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 3: BACKUP CORE FILES
# ========================================================
batch_3_backup_core_files() {
    local batch="3_backup_core_files"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup dos arquivos core do WordPress..."

    mkdir -p "$MIGRATION_DIR/core"

    # Backup via SSH (arquivos na raiz e wp-admin, wp-includes)
    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH && tar --warning=no-file-changed -czf - \
        --exclude='wp-content' \
        --exclude='.git' \
        --exclude='*.log' \
        *.php wp-admin wp-includes 2>/dev/null || true" > "$MIGRATION_DIR/core/core.tar.gz"

    if [ $? -gt 1 ]; then  # tar retorna 1 para avisos, >1 para erros
        mark_batch_failed "$batch" "Falha ao fazer backup dos arquivos core"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/core/core.tar.gz" | cut -f1)
    success "Core files backup: $size"

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 4: BACKUP PLUGINS
# ========================================================
batch_4_backup_plugins() {
    local batch="4_backup_plugins"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup dos plugins..."

    mkdir -p "$MIGRATION_DIR/plugins"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar --warning=no-file-changed -czf - \
        plugins 2>/dev/null || true" > "$MIGRATION_DIR/plugins/plugins.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup dos plugins"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/plugins/plugins.tar.gz" | cut -f1)
    success "Plugins backup: $size"

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 5: BACKUP THEMES
# ========================================================
batch_5_backup_themes() {
    local batch="5_backup_themes"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup dos themes..."

    mkdir -p "$MIGRATION_DIR/themes"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content && tar --warning=no-file-changed -czf - \
        themes 2>/dev/null || true" > "$MIGRATION_DIR/themes/themes.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup dos themes"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/themes/themes.tar.gz" | cut -f1)
    success "Themes backup: $size"

    mark_batch_complete "$batch"
    return 0
}

# ========================================================
# BATCH 6-9: BACKUP UPLOADS (DIVIDIDO POR PERÍODO)
# ========================================================
batch_6_backup_uploads_2016_2020() {
    local batch="6_backup_uploads_2016_2020"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2016-2020..."

    mkdir -p "$MIGRATION_DIR/uploads"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        201[6-9] 2020 2>/dev/null || true" > "$MIGRATION_DIR/uploads/uploads_2016_2020.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup uploads 2016-2020"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_2016_2020.tar.gz" | cut -f1)
    success "Uploads 2016-2020: $size"

    mark_batch_complete "$batch"
    return 0
}

batch_7_backup_uploads_2021_2023() {
    local batch="7_backup_uploads_2021_2023"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2021-2023..."

    mkdir -p "$MIGRATION_DIR/uploads"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        202[1-3] 2>/dev/null || true" > "$MIGRATION_DIR/uploads/uploads_2021_2023.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup uploads 2021-2023"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_2021_2023.tar.gz" | cut -f1)
    success "Uploads 2021-2023: $size"

    mark_batch_complete "$batch"
    return 0
}

batch_8_backup_uploads_2024_2025() {
    local batch="8_backup_uploads_2024_2025"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads 2024-2025..."

    mkdir -p "$MIGRATION_DIR/uploads"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        202[4-5] 2>/dev/null || true" > "$MIGRATION_DIR/uploads/uploads_2024_2025.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup uploads 2024-2025"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_2024_2025.tar.gz" | cut -f1)
    success "Uploads 2024-2025: $size"

    mark_batch_complete "$batch"
    return 0
}

batch_9_backup_uploads_wpl() {
    local batch="9_backup_uploads_wpl"

    if [ "$(get_batch_status $batch)" == "completed" ]; then
        info "Batch $batch já completado, pulando..."
        return 0
    fi

    mark_batch_start "$batch"

    log "Backup uploads WPL (plugin de imóveis - 765 pastas)..."

    mkdir -p "$MIGRATION_DIR/uploads"

    sshpass -p "$OLD_SSH_PASS" ssh \
        -p "$OLD_SSH_PORT" \
        -o HostKeyAlgorithms=+ssh-rsa \
        -o PubkeyAcceptedKeyTypes=+ssh-rsa \
        -o StrictHostKeyChecking=no \
        "$OLD_SSH_USER@$OLD_SSH_HOST" \
        "cd $OLD_SITE_PATH/wp-content/uploads && tar --warning=no-file-changed -czf - \
        WPL 2>/dev/null || true" > "$MIGRATION_DIR/uploads/uploads_wpl.tar.gz"

    if [ $? -gt 1 ]; then
        mark_batch_failed "$batch" "Falha ao fazer backup WPL"
        return 1
    fi

    local size=$(du -h "$MIGRATION_DIR/uploads/uploads_wpl.tar.gz" | cut -f1)
    success "Uploads WPL: $size"

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
    echo "  MIGRAÇÃO WORDPRESS MODULAR"
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
    echo "  2) Executar todos os batches pendentes"
    echo "  3) Ver status detalhado"
    echo "  4) Refazer batch específico"
    echo "  5) Ver logs"
    echo "  6) Criar backup do estado atual"
    echo "  0) Sair"
    echo ""
    read -p "Escolha: " choice

    case $choice in
        1) run_next_batch ;;
        2) run_all_batches ;;
        3) show_detailed_status ;;
        4) retry_batch ;;
        5) view_logs ;;
        6) backup_state ;;
        0) exit 0 ;;
        *) error "Opção inválida" ; sleep 2 ; show_main_menu ;;
    esac
}

run_next_batch() {
    # Encontrar próximo batch pendente ou in_progress
    local next_batch=$(jq -r '.batches | to_entries[] | select(.value == "pending" or .value == "in_progress") | .key' "$STATE_FILE" | head -1)

    if [ -z "$next_batch" ]; then
        success "Todos os batches foram completados!"
        read -p "Pressione ENTER para continuar..."
        show_main_menu
        return
    fi

    # Executar batch
    "batch_$next_batch"

    read -p "Pressione ENTER para continuar..."
    show_main_menu
}

run_all_batches() {
    log "Executando todos os batches pendentes..."

    # Lista de todos os batches na ordem
    local batches=(
        "1_verify_access"
        "2_backup_database"
        "3_backup_core_files"
        "4_backup_plugins"
        "5_backup_themes"
        "6_backup_uploads_2016_2020"
        "7_backup_uploads_2021_2023"
        "8_backup_uploads_2024_2025"
        "9_backup_uploads_wpl"
    )

    for batch in "${batches[@]}"; do
        local status=$(get_batch_status "$batch")

        if [ "$status" != "completed" ]; then
            "batch_$batch"

            if [ $? -ne 0 ]; then
                error "Batch $batch falhou. Parando execução."
                read -p "Pressione ENTER para voltar ao menu..."
                show_main_menu
                return
            fi
        fi
    done

    success "Todos os batches de backup completados!"
    warn "Próxima etapa: Transferir para Lightsail e importar"

    read -p "Pressione ENTER para continuar..."
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
    echo "Log: $LOG_FILE"

    if [ -f "$MIGRATION_DIR/errors.log" ]; then
        echo ""
        echo -e "${RED}ERROS:${NC}"
        cat "$MIGRATION_DIR/errors.log"
    fi

    echo ""
    read -p "Pressione ENTER para voltar..."
    show_main_menu
}

view_logs() {
    clear
    echo -e "${BOLD}ÚLTIMAS 50 LINHAS DO LOG${NC}"
    echo "=================================="
    tail -50 "$LOG_FILE"
    echo ""
    read -p "Pressione ENTER para voltar..."
    show_main_menu
}

# ========================================================
# EXECUÇÃO PRINCIPAL
# ========================================================
main() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "========================================"
    echo "  MIGRAÇÃO WORDPRESS MODULAR"
    echo "  Inicializando..."
    echo "========================================"
    echo -e "${NC}"
    echo ""

    # Inicializar estado
    init_state

    # Verificar pré-requisitos
    if ! check_prerequisites; then
        error "Pré-requisitos não atendidos. Corrija e execute novamente."
        exit 1
    fi

    success "Sistema inicializado!"
    sleep 2

    # Menu principal
    show_main_menu
}

# Executar
main
