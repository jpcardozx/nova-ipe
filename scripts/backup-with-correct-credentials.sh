#!/bin/bash
# Backup com credenciais corretas - executar quando conexão estabilizar

FTP_HOST="187.45.193.173"
FTP_USER="imobiliariaipe1"
FTP_PASS="IpeImoveis@46932380"
ROOT_PATH="/home/imobiliariaipe1/"

BACKUP_DIR="$HOME/wp-backup-locaweb"
mkdir -p "$BACKUP_DIR"

echo "🔄 Tentativa de backup com credenciais corretas"
echo "Host: $FTP_HOST"
echo "User: $FTP_USER"
echo "Pass: IpeImoveis@46932***"
echo ""

# Teste de conectividade
echo "Testando conectividade..."
if timeout 5 nc -zv "$FTP_HOST" 21 2>&1 | grep -q succeeded; then
    echo "✅ Porta 21 acessível"
    
    echo "Tentando conexão FTP..."
    lftp -c "
    set ftp:ssl-allow no
    set net:timeout 30
    open -u $FTP_USER,$FTP_PASS $FTP_HOST
    cd public_html
    pwd
    ls -la
    
    # Backup essencial
    mirror --verbose --parallel=2 wp-content/themes $BACKUP_DIR/themes
    mirror --verbose --parallel=3 wp-content/uploads $BACKUP_DIR/uploads  
    mirror --verbose --parallel=2 wp-content/plugins $BACKUP_DIR/plugins
    get wp-config.php $BACKUP_DIR/
    get .htaccess $BACKUP_DIR/
    
    bye
    "
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup concluído!"
        du -sh "$BACKUP_DIR"/*
    else
        echo "❌ Falha no backup FTP"
    fi
    
else
    echo "❌ Porta 21 ainda bloqueada - aguardar liberação"
    echo ""
    echo "Alternativas:"
    echo "1. Aguardar algumas horas (firewall pode ser temporário)"
    echo "2. Contatar suporte LocaWeb"
    echo "3. Acessar painel web File Manager"
    echo "4. Usar VPN/rede diferente"
fi