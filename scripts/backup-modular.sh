#!/bin/bash
# Backup modular WordPress com progress tracking e checkpoints

set -e

SSH_PASS="Imobiliaria@46933003"
SSH_HOST="187.45.193.173"
SSH_USER="imobiliariaipe1"
SSH_OPTS="-p 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no -o ConnectTimeout=10"

BACKUP_DIR="$HOME/wp-backup-locaweb"
CHECKPOINT_FILE="$BACKUP_DIR/.checkpoint"
LOG_FILE="$BACKUP_DIR/backup.log"

mkdir -p "$BACKUP_DIR"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Checkpoint functions
save_checkpoint() {
    echo "$1" > "$CHECKPOINT_FILE"
    log "Checkpoint salvo: $1"
}

get_checkpoint() {
    [ -f "$CHECKPOINT_FILE" ] && cat "$CHECKPOINT_FILE" || echo "start"
}

# SSH helper com retry
ssh_cmd() {
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        if sshpass -p "$SSH_PASS" ssh $SSH_OPTS $SSH_USER@$SSH_HOST "$1" 2>/dev/null; then
            return 0
        fi
        retry=$((retry + 1))
        [ $retry -lt $max_retries ] && warning "Tentativa $retry/$max_retries falhou, retrying..."
        sleep 2
    done
    return 1
}

# SCP com retry
scp_file() {
    local src=$1
    local dest=$2
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        if sshpass -p "$SSH_PASS" scp -P 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no "$src" "$dest" 2>/dev/null; then
            return 0
        fi
        retry=$((retry + 1))
        [ $retry -lt $max_retries ] && warning "Download falhou, tentativa $retry/$max_retries..."
        sleep 3
    done
    return 1
}

echo "======================================"
echo "🚀 Backup Modular WordPress"
echo "======================================"
echo ""

CHECKPOINT=$(get_checkpoint)
log "Iniciando do checkpoint: $CHECKPOINT"
echo ""

# ============================================
# MÓDULO 1: Análise inicial
# ============================================
if [ "$CHECKPOINT" == "start" ]; then
    log "📊 MÓDULO 1: Análise do servidor"
    
    if ssh_cmd "echo 'Conexão OK'"; then
        success "Conexão estabelecida"
        
        log "Verificando tamanhos..."
        ssh_cmd "
            echo '=== TAMANHOS ==='
            du -sh public_html/ 2>/dev/null || echo 'public_html: N/A'
            du -sh public_html/wp-content/uploads/ 2>/dev/null || echo 'uploads: N/A'
            du -sh public_html/wp-content/themes/ 2>/dev/null || echo 'themes: N/A'
            du -sh public_html/wp-content/plugins/ 2>/dev/null || echo 'plugins: N/A'
            echo ''
            echo '=== ESPAÇO LIVRE ==='
            df -h ~ | tail -1
            echo ''
            echo '=== ESTRUTURA ==='
            ls -lh public_html/ | head -15
        " || warning "Falha ao obter informações"
        
        save_checkpoint "module2"
        echo ""
    else
        error "Falha na conexão SSH"
        exit 1
    fi
fi

# ============================================
# MÓDULO 2: Backup de configurações (pequeno)
# ============================================
if [ "$CHECKPOINT" == "module2" ] || [ "$CHECKPOINT" == "start" ]; then
    log "📝 MÓDULO 2: Backup de configurações"
    
    ssh_cmd "cd ~ && mkdir -p backups/config_$(date +%Y%m%d)"
    
    # Configs individuais
    CONFIGS=(
        "public_html/wp-config.php"
        "public_html/.htaccess"
        "public_html/wp-content/w3tc-config/master.php"
    )
    
    for config in "${CONFIGS[@]}"; do
        FILENAME=$(basename "$config")
        log "Copiando $FILENAME..."
        
        if ssh_cmd "[ -f $config ] && cat $config > backups/config_$(date +%Y%m%d)/$FILENAME"; then
            success "$FILENAME copiado"
        else
            warning "$FILENAME não encontrado"
        fi
    done
    
    # Download configs
    log "Baixando configurações..."
    if scp_file "$SSH_USER@$SSH_HOST:backups/config_$(date +%Y%m%d)/*" "$BACKUP_DIR/"; then
        success "Configurações baixadas"
        save_checkpoint "module3"
    else
        warning "Falha no download de configs, mas continuando..."
        save_checkpoint "module3"
    fi
    echo ""
fi

# ============================================
# MÓDULO 3: Backup de themes (médio)
# ============================================
if [ "$CHECKPOINT" == "module3" ]; then
    log "🎨 MÓDULO 3: Backup de themes"
    
    log "Comprimindo themes..."
    if ssh_cmd "cd ~/public_html/wp-content && tar -czf ~/backups/themes_$(date +%Y%m%d).tar.gz themes/ 2>/dev/null"; then
        success "Themes comprimidos"
        
        log "Baixando themes..."
        if scp_file "$SSH_USER@$SSH_HOST:backups/themes_*.tar.gz" "$BACKUP_DIR/"; then
            success "Themes baixados"
            
            # Verificar integridade
            THEME_FILE=$(ls -t "$BACKUP_DIR"/themes_*.tar.gz 2>/dev/null | head -1)
            if [ -f "$THEME_FILE" ] && tar -tzf "$THEME_FILE" >/dev/null 2>&1; then
                success "Themes verificados ($(du -h "$THEME_FILE" | cut -f1))"
                save_checkpoint "module4"
            else
                error "Arquivo de themes corrompido"
                exit 1
            fi
        else
            error "Falha no download de themes"
            exit 1
        fi
    else
        error "Falha ao comprimir themes"
        exit 1
    fi
    echo ""
fi

# ============================================
# MÓDULO 4: Backup de plugins (médio)
# ============================================
if [ "$CHECKPOINT" == "module4" ]; then
    log "🔌 MÓDULO 4: Backup de plugins"
    
    log "Comprimindo plugins..."
    if ssh_cmd "cd ~/public_html/wp-content && tar -czf ~/backups/plugins_$(date +%Y%m%d).tar.gz plugins/ 2>/dev/null"; then
        success "Plugins comprimidos"
        
        log "Baixando plugins..."
        if scp_file "$SSH_USER@$SSH_HOST:backups/plugins_*.tar.gz" "$BACKUP_DIR/"; then
            success "Plugins baixados"
            
            PLUGIN_FILE=$(ls -t "$BACKUP_DIR"/plugins_*.tar.gz 2>/dev/null | head -1)
            if [ -f "$PLUGIN_FILE" ] && tar -tzf "$PLUGIN_FILE" >/dev/null 2>&1; then
                success "Plugins verificados ($(du -h "$PLUGIN_FILE" | cut -f1))"
                save_checkpoint "module5"
            else
                error "Arquivo de plugins corrompido"
                exit 1
            fi
        else
            error "Falha no download de plugins"
            exit 1
        fi
    else
        error "Falha ao comprimir plugins"
        exit 1
    fi
    echo ""
fi

# ============================================
# MÓDULO 5: Backup de uploads por ano (grande)
# ============================================
if [ "$CHECKPOINT" == "module5" ]; then
    log "📸 MÓDULO 5: Backup de uploads (modular por ano)"
    
    # Listar anos disponíveis
    YEARS=$(ssh_cmd "ls -1 public_html/wp-content/uploads/ 2>/dev/null | grep -E '^[0-9]{4}$' | sort")
    
    if [ -z "$YEARS" ]; then
        warning "Nenhuma pasta de uploads por ano encontrada"
        save_checkpoint "module6"
    else
        log "Anos encontrados: $(echo $YEARS | tr '\n' ' ')"
        
        for YEAR in $YEARS; do
            log "Processando uploads de $YEAR..."
            
            # Comprimir ano específico
            if ssh_cmd "cd ~/public_html/wp-content/uploads && tar -czf ~/backups/uploads_${YEAR}_$(date +%Y%m%d).tar.gz $YEAR/ 2>/dev/null"; then
                success "Uploads $YEAR comprimidos"
                
                # Download
                log "Baixando uploads $YEAR..."
                if scp_file "$SSH_USER@$SSH_HOST:backups/uploads_${YEAR}_*.tar.gz" "$BACKUP_DIR/"; then
                    UPLOAD_FILE=$(ls -t "$BACKUP_DIR"/uploads_${YEAR}_*.tar.gz 2>/dev/null | head -1)
                    
                    if [ -f "$UPLOAD_FILE" ] && tar -tzf "$UPLOAD_FILE" >/dev/null 2>&1; then
                        success "Uploads $YEAR verificados ($(du -h "$UPLOAD_FILE" | cut -f1))"
                    else
                        error "Arquivo uploads $YEAR corrompido"
                        exit 1
                    fi
                else
                    error "Falha no download de uploads $YEAR"
                    exit 1
                fi
            else
                warning "Falha ao comprimir uploads $YEAR, pulando..."
            fi
            
            sleep 2
        done
        
        save_checkpoint "module6"
    fi
    echo ""
fi

# ============================================
# MÓDULO 6: Relatório final
# ============================================
if [ "$CHECKPOINT" == "module6" ]; then
    log "📊 MÓDULO 6: Relatório final"
    echo ""
    
    success "=== BACKUP COMPLETO ==="
    echo ""
    echo "Arquivos baixados:"
    ls -lh "$BACKUP_DIR"/*.tar.gz "$BACKUP_DIR"/*.php "$BACKUP_DIR"/.htaccess 2>/dev/null || echo "Nenhum arquivo"
    echo ""
    
    echo "Tamanho total:"
    du -sh "$BACKUP_DIR"
    echo ""
    
    echo "Estrutura:"
    tree -L 1 "$BACKUP_DIR" 2>/dev/null || ls -la "$BACKUP_DIR"
    echo ""
    
    success "🎉 Backup modular concluído!"
    echo ""
    echo "Próximos passos:"
    echo "1. Verificar arquivos em: $BACKUP_DIR"
    echo "2. Backup do DB já feito: ~/db-backups/"
    echo "3. Pronto para migração AWS"
    echo ""
    
    # Limpar checkpoint
    rm -f "$CHECKPOINT_FILE"
    save_checkpoint "complete"
fi

echo "======================================"
echo "Log completo: $LOG_FILE"
echo "======================================"
