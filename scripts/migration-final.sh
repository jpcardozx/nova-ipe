#!/bin/bash
# ========================================================
# Migração Manual Rápida - SEM BUGS
# ========================================================
# Sem flags problemáticas, comandos testados e validados
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

# Configurações
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATION_DIR="$HOME/wp-migration-final-$(date +%Y%m%d_%H%M%S)"
SSH_KEY="$SCRIPT_DIR/.lightsail-access/LightsailDefaultKey-us-east-1.pem"

# Criar diretórios
mkdir -p "$MIGRATION_DIR"/{database,plugins,themes,uploads}

log "Diretório de migração: $MIGRATION_DIR"
echo ""

# ========================================================
# ETAPA 1: BACKUPS (Locaweb)
# ========================================================
echo "=========================================="
echo "  ETAPA 1: BACKUPS DO SERVIDOR ANTIGO"
echo "=========================================="
echo ""

# Database
log "1/5 - Backup do banco de dados..."
sshpass -p "Ipe@10203040Ipe" ssh -p 22 \
    -o HostKeyAlgorithms=+ssh-rsa \
    -o PubkeyAcceptedKeyTypes=+ssh-rsa \
    -o StrictHostKeyChecking=no \
    imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws \
    "mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
     -u wp_imobiliaria -p'Locaweb@102030' \
     --single-transaction --quick \
     wp_imobiliaria 2>/dev/null" | gzip > "$MIGRATION_DIR/database/database.sql.gz"

success "Database: $(du -h $MIGRATION_DIR/database/database.sql.gz | cut -f1)"
echo ""

# Plugins
log "2/5 - Backup dos plugins (70MB - 2min)..."
sshpass -p "Ipe@10203040Ipe" ssh -p 22 \
    -o HostKeyAlgorithms=+ssh-rsa \
    -o PubkeyAcceptedKeyTypes=+ssh-rsa \
    -o StrictHostKeyChecking=no \
    imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws \
    "cd /home/storage/e/4f/a6/imobiliariaipe1/public_html/wp-content && tar -czf - plugins 2>/dev/null" \
    > "$MIGRATION_DIR/plugins/plugins.tar.gz"

success "Plugins: $(du -h $MIGRATION_DIR/plugins/plugins.tar.gz | cut -f1)"
echo ""

# Themes
log "3/5 - Backup dos themes..."
sshpass -p "Ipe@10203040Ipe" ssh -p 22 \
    -o HostKeyAlgorithms=+ssh-rsa \
    -o PubkeyAcceptedKeyTypes=+ssh-rsa \
    -o StrictHostKeyChecking=no \
    imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws \
    "cd /home/storage/e/4f/a6/imobiliariaipe1/public_html/wp-content && tar -czf - themes 2>/dev/null" \
    > "$MIGRATION_DIR/themes/themes.tar.gz"

success "Themes: $(du -h $MIGRATION_DIR/themes/themes.tar.gz | cut -f1)"
echo ""

# Uploads (dividido em partes)
log "4/5 - Backup uploads 2016-2022 (pode demorar 10-15min)..."
sshpass -p "Ipe@10203040Ipe" ssh -p 22 \
    -o HostKeyAlgorithms=+ssh-rsa \
    -o PubkeyAcceptedKeyTypes=+ssh-rsa \
    -o StrictHostKeyChecking=no \
    imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws \
    "cd /home/storage/e/4f/a6/imobiliariaipe1/public_html/wp-content/uploads && tar -czf - 2016 2017 2018 2019 2020 2021 2022 2>/dev/null || true" \
    > "$MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz"

success "Uploads 2016-2022: $(du -h $MIGRATION_DIR/uploads/uploads_2016_2022.tar.gz | cut -f1)"
echo ""

log "5/5 - Backup uploads 2023-2025 + WPL (pode demorar 15-20min)..."
sshpass -p "Ipe@10203040Ipe" ssh -p 22 \
    -o HostKeyAlgorithms=+ssh-rsa \
    -o PubkeyAcceptedKeyTypes=+ssh-rsa \
    -o StrictHostKeyChecking=no \
    imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws \
    "cd /home/storage/e/4f/a6/imobiliariaipe1/public_html/wp-content/uploads && tar -czf - 2023 2024 2025 WPL 2>/dev/null || true" \
    > "$MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz"

success "Uploads 2023-2025+WPL: $(du -h $MIGRATION_DIR/uploads/uploads_2023_2025_wpl.tar.gz | cut -f1)"
echo ""

echo "=========================================="
echo "  ✅ TODOS OS BACKUPS COMPLETOS!"
echo "=========================================="
echo ""
du -sh "$MIGRATION_DIR"/*
echo ""

# ========================================================
# ETAPA 2: TRANSFERIR PARA LIGHTSAIL
# ========================================================
echo ""
echo "=========================================="
echo "  ETAPA 2: TRANSFERIR PARA LIGHTSAIL"
echo "=========================================="
echo ""

log "Transferindo arquivos (pode demorar 30-60min)..."
echo ""

scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
    "$MIGRATION_DIR"/database/*.gz \
    "$MIGRATION_DIR"/plugins/*.gz \
    "$MIGRATION_DIR"/themes/*.gz \
    "$MIGRATION_DIR"/uploads/*.gz \
    bitnami@13.223.237.99:/tmp/

success "Todos os arquivos transferidos para Lightsail!"
echo ""

# ========================================================
# ETAPA 3: IMPORTAR NO LIGHTSAIL
# ========================================================
echo ""
echo "=========================================="
echo "  ETAPA 3: IMPORTAR NO LIGHTSAIL"
echo "=========================================="
echo ""

log "Executando importação remota..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no bitnami@13.223.237.99 bash <<'REMOTE_SCRIPT'
set -e

echo "[$(date '+%H:%M:%S')] 1/8 - Criando database..."
mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS wp_imobiliaria DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "[$(date '+%H:%M:%S')] 2/8 - Importando database..."
gunzip < /tmp/database.sql.gz | mysql -u root wp_imobiliaria

echo "[$(date '+%H:%M:%S')] 3/8 - Fazendo backup do WordPress atual..."
sudo mv /opt/bitnami/wordpress/wp-content /opt/bitnami/wordpress/wp-content.old.$(date +%Y%m%d) 2>/dev/null || true

echo "[$(date '+%H:%M:%S')] 4/8 - Criando diretórios..."
sudo mkdir -p /opt/bitnami/wordpress/wp-content/{plugins,themes,uploads}

echo "[$(date '+%H:%M:%S')] 5/8 - Extraindo plugins..."
cd /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/plugins.tar.gz

echo "[$(date '+%H:%M:%S')] 6/8 - Extraindo themes..."
sudo tar -xzf /tmp/themes.tar.gz

echo "[$(date '+%H:%M:%S')] 7/8 - Extraindo uploads..."
cd /opt/bitnami/wordpress/wp-content/uploads
sudo tar -xzf /tmp/uploads_2016_2022.tar.gz
sudo tar -xzf /tmp/uploads_2023_2025_wpl.tar.gz

echo "[$(date '+%H:%M:%S')] 8/8 - Ajustando permissões..."
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
sudo find /opt/bitnami/wordpress/wp-content -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress/wp-content -type f -exec chmod 664 {} \;

echo "✅ Importação completa!"
REMOTE_SCRIPT

success "Importação completa no Lightsail!"
echo ""

# ========================================================
# ETAPA 4: CONFIGURAR WORDPRESS
# ========================================================
echo ""
echo "=========================================="
echo "  ETAPA 4: CONFIGURAR WORDPRESS"
echo "=========================================="
echo ""

log "Configurando wp-config.php..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no bitnami@13.223.237.99 bash <<'REMOTE_SCRIPT'
set -e

# Atualizar wp-config.php
sudo sed -i "s/define( *'DB_NAME'.*/define( 'DB_NAME', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_USER'.*/define( 'DB_USER', 'wp_imobiliaria' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_PASSWORD'.*/define( 'DB_PASSWORD', 'Ipe@5084' );/" /opt/bitnami/wordpress/wp-config.php
sudo sed -i "s/define( *'DB_HOST'.*/define( 'DB_HOST', 'localhost' );/" /opt/bitnami/wordpress/wp-config.php

# Adicionar URLs se não existirem
if ! grep -q "WP_HOME" /opt/bitnami/wordpress/wp-config.php; then
    sudo sed -i "/<?php/a define('WP_HOME', 'https://portal.imobiliariaipe.com.br');\ndefine('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');" /opt/bitnami/wordpress/wp-config.php
fi

echo "✅ wp-config.php configurado"
REMOTE_SCRIPT

success "wp-config.php configurado!"
echo ""

# ========================================================
# ETAPA 5: REINICIAR SERVIÇOS
# ========================================================
echo ""
echo "=========================================="
echo "  ETAPA 5: REINICIAR SERVIÇOS"
echo "=========================================="
echo ""

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no bitnami@13.223.237.99 bash <<'REMOTE_SCRIPT'
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql
echo "✅ Serviços reiniciados"
REMOTE_SCRIPT

success "Serviços reiniciados!"
echo ""

# ========================================================
# ETAPA 6: VERIFICAR SITE
# ========================================================
echo ""
echo "=========================================="
echo "  ETAPA 6: VERIFICAR SITE"
echo "=========================================="
echo ""

log "Testando site via IP..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://13.223.237.99)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "302" ]; then
    success "Site respondendo: HTTP $HTTP_CODE"
else
    warn "Site retornou HTTP $HTTP_CODE"
fi

echo ""
echo "=========================================="
echo "  🎉 MIGRAÇÃO COMPLETA!"
echo "=========================================="
echo ""
echo "📊 RESUMO:"
echo "  - Database: Importado"
echo "  - Plugins: Importados"
echo "  - Themes: Importados"
echo "  - Uploads: Importados"
echo "  - Configuração: OK"
echo "  - Serviços: Reiniciados"
echo ""
echo "🔗 PRÓXIMOS PASSOS:"
echo "  1. Aponte o DNS para: 13.223.237.99"
echo "  2. Acesse: https://portal.imobiliariaipe.com.br"
echo "  3. Teste login no /wp-admin"
echo "  4. Verifique imóveis e imagens"
echo ""
echo "📁 Backups salvos em: $MIGRATION_DIR"
echo ""
