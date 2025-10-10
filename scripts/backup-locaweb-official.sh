#!/bin/bash
# Backup WordPress usando método LocaWeb oficial

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

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }

echo "======================================"
echo "🚀 Backup WordPress - Método LocaWeb"
echo "======================================"
echo ""

# ============================================
# 1. BACKUP DO BANCO DE DADOS (já funciona)
# ============================================
log "📊 PASSO 1: Backup do Banco de Dados"

mysqldump -h "$DB_HOST" \
  -u "$DB_USER" \
  -p"$DB_PASS" \
  --single-transaction \
  --quick \
  --lock-tables=false \
  --no-tablespaces \
  --skip-column-statistics \
  --default-character-set=utf8 \
  "$DB_NAME" 2>/dev/null | gzip > "$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql.gz"

success "Banco exportado: $(ls -lh "$BACKUP_DIR"/db_backup_*.sql.gz | tail -1 | awk '{print $9, $5}')"
echo ""

# ============================================
# 2. BACKUP ARQUIVOS VIA FTP
# ============================================
log "📁 PASSO 2: Backup de Arquivos via FTP"

# Criar arquivo .netrc para autenticação automática
cat > ~/.netrc << NETRC
machine $FTP_HOST
login $FTP_USER
password $FTP_PASS
NETRC
chmod 600 ~/.netrc

log "Baixando wp-config.php..."
wget --no-verbose -O "$BACKUP_DIR/wp-config.php" \
  "ftp://$FTP_HOST/public_html/wp-config.php" 2>/dev/null || log "Erro ao baixar wp-config.php"

log "Baixando .htaccess..."
wget --no-verbose -O "$BACKUP_DIR/.htaccess" \
  "ftp://$FTP_HOST/public_html/.htaccess" 2>/dev/null || log "Erro ao baixar .htaccess"

success "Arquivos de configuração baixados"
echo ""

# ============================================
# 3. BACKUP MODULAR VIA LFTP
# ============================================
log "📦 PASSO 3: Backup modular de wp-content"

# Themes
log "Baixando themes..."
lftp -c "set ftp:ssl-allow no; \
  open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  mirror --verbose --parallel=2 public_html/wp-content/themes $BACKUP_DIR/themes" 2>/dev/null && \
  success "Themes baixados" || log "Falha ao baixar themes"

# Plugins
log "Baixando plugins..."
lftp -c "set ftp:ssl-allow no; \
  open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  mirror --verbose --parallel=2 public_html/wp-content/plugins $BACKUP_DIR/plugins" 2>/dev/null && \
  success "Plugins baixados" || log "Falha ao baixar plugins"

# Uploads (modular por ano)
log "Baixando uploads (por ano)..."
YEARS=$(lftp -c "set ftp:ssl-allow no; \
  open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
  cls -1 public_html/wp-content/uploads/" 2>/dev/null | grep -E '^[0-9]{4}$')

if [ -n "$YEARS" ]; then
  for YEAR in $YEARS; do
    log "  → Ano $YEAR..."
    lftp -c "set ftp:ssl-allow no; \
      open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
      mirror --verbose --parallel=3 public_html/wp-content/uploads/$YEAR $BACKUP_DIR/uploads/$YEAR" 2>/dev/null && \
      success "  → $YEAR baixado ($(du -sh "$BACKUP_DIR/uploads/$YEAR" | cut -f1))" || \
      log "  → Falha em $YEAR"
  done
else
  log "Baixando uploads completo..."
  lftp -c "set ftp:ssl-allow no; \
    open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
    mirror --verbose --parallel=3 public_html/wp-content/uploads $BACKUP_DIR/uploads" 2>/dev/null
fi

success "Uploads baixados"

# Limpar .netrc
rm -f ~/.netrc

echo ""
log "📊 RESUMO DO BACKUP"
echo ""
echo "Banco de dados:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null
echo ""
echo "Tamanho total:"
du -sh "$BACKUP_DIR"
echo ""
echo "Estrutura:"
du -sh "$BACKUP_DIR"/*/ 2>/dev/null || echo "Sem pastas ainda"

echo ""
success "🎉 Backup completo!"
echo ""
echo "Localização: $BACKUP_DIR"
echo ""
echo "Próximos passos:"
echo "1. Verificar integridade dos arquivos"
echo "2. Provisionar AWS EC2 + RDS"
echo "3. Importar dados"
echo "4. Configurar CloudFlare"
