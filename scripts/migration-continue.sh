#!/bin/bash
# ========================================================
# Migração Contínua - Usa diretório existente
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

# Usar diretório existente ou criar novo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXISTING_DIR=$(ls -dt ~/wp-migration-validated-* 2>/dev/null | head -1)

if [ -n "$EXISTING_DIR" ]; then
    MIGRATION_DIR="$EXISTING_DIR"
    warn "Usando diretório existente: $MIGRATION_DIR"
else
    MIGRATION_DIR="$HOME/wp-migration-continue-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$MIGRATION_DIR"/{database,plugins,themes,uploads}
    log "Criado novo diretório: $MIGRATION_DIR"
fi

SSH_KEY="$SCRIPT_DIR/.lightsail-access/LightsailDefaultKey-us-east-1.pem"

# Credenciais
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"
OLD_SSH_USER="imobiliariaipe1"
OLD_SSH_PASS="Ipe@10203040Ipe"
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"

NEW_SSH_HOST="13.223.237.99"
NEW_SSH_USER="bitnami"

echo ""
echo "=========================================="
echo "  RESUMO DO PROGRESSO"
echo "=========================================="
echo ""

# Verificar o que já existe
if [ -f "$MIGRATION_DIR/database/database.sql.gz" ]; then
    SIZE=$(du -h "$MIGRATION_DIR/database/database.sql.gz" | cut -f1)
    success "Database: $SIZE"
else
    warn "Database: FALTA FAZER"
fi

if [ -f "$MIGRATION_DIR/plugins/plugins.tar.gz" ]; then
    SIZE=$(du -h "$MIGRATION_DIR/plugins/plugins.tar.gz" | cut -f1)
    success "Plugins: $SIZE"
else
    warn "Plugins: FALTA FAZER"
fi

if [ -f "$MIGRATION_DIR/themes/themes.tar.gz" ]; then
    SIZE=$(du -h "$MIGRATION_DIR/themes/themes.tar.gz" | cut -f1)
    success "Themes: $SIZE"
else
    warn "Themes: FALTA FAZER"
fi

if [ -f "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz" ]; then
    SIZE=$(du -h "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz" | cut -f1)
    success "Uploads 2016-2022: $SIZE"
else
    warn "Uploads 2016-2022: FALTA FAZER"
fi

if [ -f "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz" ]; then
    SIZE=$(du -h "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz" | cut -f1)
    success "Uploads 2023-2025+WPL: $SIZE"
else
    warn "Uploads 2023-2025+WPL: FALTA FAZER"
fi

echo ""
echo "=========================================="
echo "  O QUE FAZER AGORA?"
echo "=========================================="
echo ""
echo "Escolha uma opção:"
echo ""
echo "  1) Fazer backup do que falta"
echo "  2) Transferir tudo para Lightsail"
echo "  3) Importar no Lightsail"
echo "  4) Fazer TUDO (backup + transfer + import)"
echo "  5) Ver detalhes dos arquivos"
echo "  0) Sair"
echo ""
read -p "Opção: " OPTION

case $OPTION in
    1)
        echo ""
        log "Fazendo backups que faltam..."
        echo ""
        
        # Themes (se não existe)
        if [ ! -f "$MIGRATION_DIR/themes/themes.tar.gz" ]; then
            log "Backup themes..."
            sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
                -o HostKeyAlgorithms=+ssh-rsa \
                -o PubkeyAcceptedKeyTypes=+ssh-rsa \
                -o StrictHostKeyChecking=no \
                "$OLD_SSH_USER@$OLD_SSH_HOST" \
                "cd $OLD_SITE_PATH/wp-content && tar -czf - themes 2>/dev/null" \
                > "$MIGRATION_DIR/themes/themes.tar.gz"
            
            SIZE=$(du -h "$MIGRATION_DIR/themes/themes.tar.gz" | cut -f1)
            success "Themes: $SIZE"
        fi
        
        # Uploads 2016-2022
        if [ ! -f "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz" ]; then
            log "Backup uploads 2016-2022 (pode demorar 10-15min)..."
            sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
                -o HostKeyAlgorithms=+ssh-rsa \
                -o PubkeyAcceptedKeyTypes=+ssh-rsa \
                -o StrictHostKeyChecking=no \
                "$OLD_SSH_USER@$OLD_SSH_HOST" \
                "cd $OLD_SITE_PATH/wp-content/uploads && tar -czf - 2016 2017 2018 2019 2020 2021 2022 2>/dev/null || true" \
                > "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz"
            
            SIZE=$(du -h "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz" | cut -f1)
            success "Uploads 2016-2022: $SIZE"
        fi
        
        # Uploads 2023-2025 + WPL
        if [ ! -f "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz" ]; then
            log "Backup uploads 2023-2025 + WPL (pode demorar 15-20min)..."
            sshpass -p "$OLD_SSH_PASS" ssh -p 22 \
                -o HostKeyAlgorithms=+ssh-rsa \
                -o PubkeyAcceptedKeyTypes=+ssh-rsa \
                -o StrictHostKeyChecking=no \
                "$OLD_SSH_USER@$OLD_SSH_HOST" \
                "cd $OLD_SITE_PATH/wp-content/uploads && tar -czf - 2023 2024 2025 WPL 2>/dev/null || true" \
                > "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz"
            
            SIZE=$(du -h "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz" | cut -f1)
            success "Uploads 2023-2025+WPL: $SIZE"
        fi
        
        echo ""
        success "Todos os backups concluídos!"
        echo ""
        ;;
        
    2)
        echo ""
        log "Transferindo para Lightsail..."
        warn "Tempo estimado: 30-60 minutos"
        echo ""
        
        log "1/5 - Transferindo database..."
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
            "$MIGRATION_DIR"/database/*.gz \
            "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" 2>&1 | grep -v "Warning:"
        success "Database transferido"
        
        log "2/5 - Transferindo plugins..."
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
            "$MIGRATION_DIR"/plugins/*.gz \
            "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" 2>&1 | grep -v "Warning:"
        success "Plugins transferidos"
        
        log "3/5 - Transferindo themes..."
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
            "$MIGRATION_DIR"/themes/*.gz \
            "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" 2>&1 | grep -v "Warning:"
        success "Themes transferidos"
        
        log "4/5 - Transferindo uploads (pode demorar MUITO)..."
        scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
            "$MIGRATION_DIR"/uploads/*.gz \
            "$NEW_SSH_USER@$NEW_SSH_HOST:/tmp/" 2>&1 | grep -v "Warning:"
        success "Uploads transferidos"
        
        echo ""
        success "Transferência completa!"
        echo ""
        ;;
        
    3)
        echo ""
        log "Importando no Lightsail..."
        echo ""
        
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$NEW_SSH_USER@$NEW_SSH_HOST" bash <<'REMOTE'
set -e

echo "[$(date '+%H:%M:%S')] 1/9 - Criando database..."
mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS wp_imobiliaria DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "[$(date '+%H:%M:%S')] 2/9 - Importando database..."
gunzip < /tmp/database.sql.gz | mysql -u root wp_imobiliaria

echo "[$(date '+%H:%M:%S')] 3/9 - Backup do WordPress atual..."
sudo mv /opt/bitnami/wordpress/wp-content /opt/bitnami/wordpress/wp-content.old.$(date +%Y%m%d) 2>/dev/null || true

echo "[$(date '+%H:%M:%S')] 4/9 - Criando diretórios..."
sudo mkdir -p /opt/bitnami/wordpress/wp-content/{plugins,themes,uploads}

echo "[$(date '+%H:%M:%S')] 5/9 - Extraindo plugins..."
cd /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/plugins.tar.gz

echo "[$(date '+%H:%M:%S')] 6/9 - Extraindo themes..."
sudo tar -xzf /tmp/themes.tar.gz

echo "[$(date '+%H:%M:%S')] 7/9 - Extraindo uploads..."
cd /opt/bitnami/wordpress/wp-content/uploads
sudo tar -xzf /tmp/uploads_2016_2022.tar.gz 2>/dev/null || true
sudo tar -xzf /tmp/uploads_2023_2025_wpl.tar.gz 2>/dev/null || true

echo "[$(date '+%H:%M:%S')] 8/9 - Configurando wp-config.php..."
sudo sed -i "s/define( *'DB_NAME'.*/define( 'DB_NAME', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_USER'.*/define( 'DB_USER', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_PASSWORD'.*/define( 'DB_PASSWORD', 'Ipe@5084' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_HOST'.*/define( 'DB_HOST', 'localhost' );/" /opt/bitnami/wordpress/wp-config.php

if ! grep -q "WP_HOME" /opt/bitnami/wordpress/wp-config.php; then
    sudo sed -i "/<?php/a define('WP_HOME', 'https://portal.imobiliariaipe.com.br');\ndefine('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');" /opt/bitnami/wordpress/wp-config.php
fi

echo "[$(date '+%H:%M:%S')] 9/9 - Ajustando permissões e reiniciando..."
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
sudo find /opt/bitnami/wordpress/wp-content -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress/wp-content -type f -exec chmod 664 {} \;

sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql

echo "✅ Importação completa!"
REMOTE
        
        echo ""
        success "Importação completa!"
        echo ""
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$NEW_SSH_HOST)
        info "Site respondendo: HTTP $HTTP_CODE"
        echo ""
        ;;
        
    4)
        echo ""
        warn "Executar TUDO pode levar 2-3 horas!"
        read -p "Tem certeza? (s/N): " CONFIRM
        
        if [ "$CONFIRM" == "s" ] || [ "$CONFIRM" == "S" ]; then
            # Backups
            $0 <<EOF
1
EOF
            
            # Transfer
            $0 <<EOF
2
EOF
            
            # Import
            $0 <<EOF
3
EOF
        fi
        ;;
        
    5)
        echo ""
        echo "Detalhes dos arquivos:"
        echo ""
        find "$MIGRATION_DIR" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print $9 ": " $5}'
        echo ""
        echo "Diretório: $MIGRATION_DIR"
        echo ""
        ;;
        
    0)
        echo ""
        log "Saindo..."
        exit 0
        ;;
        
    *)
        error "Opção inválida"
        exit 1
        ;;
esac

echo ""
log "Executar novamente? ./scripts/migration-batches.sh"
echo ""
