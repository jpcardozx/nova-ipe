#!/bin/bash
# Backup via FTP (porta 21 aberta)

FTP_HOST="187.45.193.173"
FTP_USER="imobiliariaipe1"
FTP_PASS='Imobiliaria@46933003'
BACKUP_DIR="$HOME/wp-backup-locaweb"
LOG="$BACKUP_DIR/ftp-backup.log"

mkdir -p "$BACKUP_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG"; }
success() { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG"; }

echo "======================================"
echo "🚀 Backup WordPress via FTP"
echo "======================================"

# Criar script FTP para listar estrutura
log "📋 Analisando estrutura no servidor..."

ftp -inv $FTP_HOST << 'EOF' > "$BACKUP_DIR/ftp-list.txt"
user $FTP_USER 'Imobiliaria@46933003'
binary
cd public_html
pwd
ls -lR wp-content/uploads/
ls -lR wp-content/themes/
ls -lR wp-content/plugins/
bye
EOF

success "Estrutura listada"
cat "$BACKUP_DIR/ftp-list.txt"

echo ""
log "📥 Iniciando download recursivo via lftp..."

# Usar lftp (mais poderoso que ftp padrão)
if command -v lftp &> /dev/null; then
    
    lftp -c "
    set ftp:ssl-allow no
    open -u $FTP_USER,'Imobiliaria@46933003' $FTP_HOST
    lcd $BACKUP_DIR
    cd public_html
    mirror --verbose --use-pget-n=5 --parallel=3 \
           --exclude-glob cache/* \
           --exclude-glob w3tc-config/* \
           wp-content/uploads/ uploads/
    mirror --verbose wp-content/themes/ themes/
    mirror --verbose wp-content/plugins/ plugins/
    get wp-config.php
    get .htaccess
    bye
    "
    
    success "Download completo via lftp"
    
else
    log "lftp não instalado, usando wget..."
    
    # Fallback: wget com FTP
    wget -r -nH --cut-dirs=1 \
         --ftp-user="$FTP_USER" \
         --ftp-password='Imobiliaria@46933003' \
         --no-passive-ftp \
         -P "$BACKUP_DIR" \
         "ftp://$FTP_HOST/public_html/wp-content/uploads/" \
         "ftp://$FTP_HOST/public_html/wp-content/themes/" \
         "ftp://$FTP_HOST/public_html/wp-content/plugins/" \
         "ftp://$FTP_HOST/public_html/wp-config.php" \
         "ftp://$FTP_HOST/public_html/.htaccess"
    
    success "Download completo via wget"
fi

echo ""
log "📊 Resumo do backup:"
du -sh "$BACKUP_DIR"/*
echo ""
tree -L 2 "$BACKUP_DIR" 2>/dev/null || ls -lh "$BACKUP_DIR"

success "🎉 Backup FTP concluído!"
echo "Arquivos em: $BACKUP_DIR"
