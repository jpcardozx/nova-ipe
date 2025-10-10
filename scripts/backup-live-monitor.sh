#!/bin/bash
# Backup WordPress com monitoramento em tempo real

set -e

# Credenciais
DB_HOST="wp_imobiliaria.mysql.dbaas.com.br"
DB_USER="wp_imobiliaria"
DB_PASS="rfp183654"
DB_NAME="wp_imobiliaria"

FTP_HOST="187.45.193.173"
FTP_USER="imobiliariaipe1"
FTP_PASS="Imobiliaria@46933003"

BACKUP_DIR="$HOME/wp-backup-locaweb"
mkdir -p "$BACKUP_DIR"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${CYAN}ℹ️  $1${NC}"; }

spinner() {
    local pid=$1
    local message=$2
    local delay=0.1
    local spinstr='|/-\'
    echo -n "$message "
    while kill -0 $pid 2>/dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
    wait $pid
    return $?
}

echo "======================================"
echo "🚀 Backup WordPress - Live Monitor"
echo "======================================"
echo ""
info "Destino: $BACKUP_DIR"
echo ""

# ============================================
# 1. TESTE DE CONEXÕES
# ============================================
log "🔍 FASE 1: Testando Conexões"
echo ""

info "Testando MySQL..."
if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" 2>/dev/null >/dev/null; then
    success "MySQL conectado → $DB_HOST"
else
    error "Falha MySQL com credenciais:"
    echo "  Host: $DB_HOST"
    echo "  User: $DB_USER"
    echo "  Pass: rfp***654"
    exit 1
fi

info "Testando FTP..."
if nc -zv -w 3 "$FTP_HOST" 21 2>&1 | grep -q succeeded; then
    success "FTP acessível → $FTP_HOST:21"
else
    error "FTP não acessível"
    exit 1
fi

echo ""

# ============================================
# 2. ANÁLISE DO BANCO
# ============================================
log "📊 FASE 2: Analisando Banco de Dados"
echo ""

info "Consultando tamanho..."
DB_SIZE=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -sN -e "
SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) 
FROM information_schema.tables 
WHERE table_schema = '$DB_NAME';" 2>/dev/null)

success "Tamanho do banco: ${DB_SIZE} MB"

info "Contando tabelas..."
TABLE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -sN -e "
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = '$DB_NAME';" 2>/dev/null)

success "Total de tabelas: $TABLE_COUNT"
echo ""

# ============================================
# 3. BACKUP DO BANCO
# ============================================
log "💾 FASE 3: Backup do Banco (${DB_SIZE} MB)"
echo ""

BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
START_TIME=$(date +%s)

info "Exportando SQL..."
(
    mysqldump -h "$DB_HOST" \
      -u "$DB_USER" \
      -p"$DB_PASS" \
      --single-transaction \
      --quick \
      --no-tablespaces \
      --skip-lock-tables \
      --default-character-set=utf8 \
      "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null
) &

DUMP_PID=$!

# Monitor progress
while kill -0 $DUMP_PID 2>/dev/null; do
    if [ -f "$BACKUP_FILE" ]; then
        CURRENT_SIZE=$(du -h "$BACKUP_FILE" 2>/dev/null | cut -f1)
        ELAPSED=$(($(date +%s) - START_TIME))
        printf "\r${CYAN}ℹ️  Exportando: ${CURRENT_SIZE} | Tempo: ${ELAPSED}s${NC}"
    fi
    sleep 1
done

wait $DUMP_PID
DUMP_EXIT=$?

echo ""

if [ $DUMP_EXIT -eq 0 ] && [ -f "$BACKUP_FILE" ]; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    info "Comprimindo..."
    gzip "$BACKUP_FILE" &
    GZIP_PID=$!
    
    while kill -0 $GZIP_PID 2>/dev/null; do
        sleep 0.5
        printf "\r${CYAN}ℹ️  Comprimindo...${NC}"
    done
    wait $GZIP_PID
    
    echo ""
    
    FINAL_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    success "DB exportado: ${FINAL_SIZE} em ${DURATION}s"
    echo "  Arquivo: ${BACKUP_FILE}.gz"
else
    error "Falha no dump do MySQL"
    echo ""
    echo "Tentando diagnóstico..."
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" 2>&1 | head -20
    exit 1
fi

echo ""

# ============================================
# 4. BACKUP ARQUIVOS VIA FTP
# ============================================
log "📁 FASE 4: Backup de Arquivos via FTP"
echo ""

# .netrc para auth
cat > ~/.netrc << NETRC
machine $FTP_HOST
login $FTP_USER
password $FTP_PASS
NETRC
chmod 600 ~/.netrc

info "Listando estrutura remota..."
REMOTE_STRUCTURE=$(lftp -c "set ftp:ssl-allow no; \
  open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  du -sh public_html/wp-content/uploads; \
  du -sh public_html/wp-content/themes; \
  du -sh public_html/wp-content/plugins" 2>/dev/null || echo "N/A")

if [ "$REMOTE_STRUCTURE" != "N/A" ]; then
    echo "$REMOTE_STRUCTURE" | while read line; do
        info "  $line"
    done
fi

echo ""

# Configs
info "Baixando wp-config.php..."
wget -q --timeout=10 -O "$BACKUP_DIR/wp-config.php" \
  "ftp://$FTP_HOST/public_html/wp-config.php" 2>/dev/null && \
  success "wp-config.php ($(du -h "$BACKUP_DIR/wp-config.php" | cut -f1))" || \
  warn "wp-config.php não encontrado"

info "Baixando .htaccess..."
wget -q --timeout=10 -O "$BACKUP_DIR/.htaccess" \
  "ftp://$FTP_HOST/public_html/.htaccess" 2>/dev/null && \
  success ".htaccess ($(du -h "$BACKUP_DIR/.htaccess" | cut -f1))" || \
  warn ".htaccess não encontrado"

echo ""

# Themes
log "🎨 Baixando Themes..."
(
lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 2
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror --verbose --parallel=2 \
  public_html/wp-content/themes $BACKUP_DIR/themes
" 2>&1 | while read line; do
    if [[ $line == *"Transferring file"* ]] || [[ $line == *".php"* ]]; then
        FILE=$(echo "$line" | grep -oP '[\w\-]+\.(php|css|js|png|jpg)' | head -1)
        [ -n "$FILE" ] && printf "\r${CYAN}ℹ️  $FILE${NC}"
    fi
done
) &
THEME_PID=$!
wait $THEME_PID

echo ""
if [ -d "$BACKUP_DIR/themes" ]; then
    THEME_SIZE=$(du -sh "$BACKUP_DIR/themes" 2>/dev/null | cut -f1)
    success "Themes baixados: $THEME_SIZE"
else
    warn "Nenhum theme baixado"
fi

echo ""

# Plugins
log "🔌 Baixando Plugins..."
(
lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 2
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror --verbose --parallel=2 \
  public_html/wp-content/plugins $BACKUP_DIR/plugins
" 2>&1 | while read line; do
    if [[ $line == *"Transferring file"* ]] || [[ $line == *".php"* ]]; then
        FILE=$(echo "$line" | grep -oP '[\w\-]+\.(php|css|js)' | head -1)
        [ -n "$FILE" ] && printf "\r${CYAN}ℹ️  $FILE${NC}"
    fi
done
) &
PLUGIN_PID=$!
wait $PLUGIN_PID

echo ""
if [ -d "$BACKUP_DIR/plugins" ]; then
    PLUGIN_SIZE=$(du -sh "$BACKUP_DIR/plugins" 2>/dev/null | cut -f1)
    success "Plugins baixados: $PLUGIN_SIZE"
else
    warn "Nenhum plugin baixado"
fi

echo ""

# Uploads
log "📸 Baixando Uploads (isso pode demorar)..."
info "Listando anos disponíveis..."

YEARS=$(lftp -c "set ftp:ssl-allow no; \
  open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  cls -1 public_html/wp-content/uploads/" 2>/dev/null | grep -E '^[0-9]{4}$' || echo "")

if [ -n "$YEARS" ]; then
    info "Anos encontrados: $(echo $YEARS | tr '\n' ' ')"
    echo ""
    
    for YEAR in $YEARS; do
        info "Baixando uploads/$YEAR..."
        
        (
        lftp -c "
        set ftp:ssl-allow no
        set net:timeout 30
        set net:max-retries 2
        open -u $FTP_USER,$FTP_PASS $FTP_HOST
        mirror --verbose --parallel=3 \
          public_html/wp-content/uploads/$YEAR $BACKUP_DIR/uploads/$YEAR
        " 2>&1 | while read line; do
            if [[ $line == *"Transferring"* ]]; then
                FILE=$(basename "$line" | head -c 40)
                printf "\r${CYAN}ℹ️  $YEAR: $FILE...${NC}"
            fi
        done
        ) &
        UPLOAD_PID=$!
        wait $UPLOAD_PID
        
        echo ""
        if [ -d "$BACKUP_DIR/uploads/$YEAR" ]; then
            YEAR_SIZE=$(du -sh "$BACKUP_DIR/uploads/$YEAR" 2>/dev/null | cut -f1)
            success "$YEAR: $YEAR_SIZE"
        fi
    done
else
    warn "Estrutura de uploads diferente, baixando tudo..."
    lftp -c "
    set ftp:ssl-allow no
    open -u $FTP_USER,$FTP_PASS $FTP_HOST
    mirror --verbose --parallel=3 \
      public_html/wp-content/uploads $BACKUP_DIR/uploads
    "
fi

rm -f ~/.netrc

echo ""
echo "======================================"
log "📊 RELATÓRIO FINAL"
echo "======================================"
echo ""

success "Backup concluído!"
echo ""

if [ -f "${BACKUP_FILE}.gz" ]; then
    echo "Banco de dados:"
    ls -lh "${BACKUP_FILE}.gz"
fi

echo ""
echo "Estrutura completa:"
du -sh "$BACKUP_DIR"/* 2>/dev/null | while read size path; do
    echo "  $size  →  $(basename "$path")"
done

echo ""
echo "Total:"
du -sh "$BACKUP_DIR"

echo ""
echo "======================================"
info "Arquivos prontos para migração AWS!"
echo "======================================"
