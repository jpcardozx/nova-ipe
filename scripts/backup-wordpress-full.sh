#!/bin/bash
# Backup WordPress com retry e resume

set -e

SSH_PASS="Imobiliaria@46933003"
SSH_HOST="187.45.193.173"
SSH_USER="imobiliariaipe1"
SSH_OPTS="-p 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -o ServerAliveCountMax=3"

BACKUP_DIR="$HOME/wp-backup-locaweb"
mkdir -p "$BACKUP_DIR"

echo "🔄 Backup WordPress LocaWeb → Local"
echo "Destino: $BACKUP_DIR"
echo ""

# 1. Criar backup no servidor remoto
echo "📦 Criando tar.gz no servidor..."
sshpass -p "$SSH_PASS" ssh $SSH_OPTS $SSH_USER@$SSH_HOST << 'REMOTE'
cd ~
mkdir -p backups

# Backup essencial (sem cache)
echo "Comprimindo arquivos essenciais..."
tar -czf backups/wp_essential_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='public_html/wp-content/cache/*' \
  --exclude='public_html/wp-content/w3tc-config/*' \
  public_html/wp-content/uploads/ \
  public_html/wp-content/themes/ \
  public_html/wp-content/plugins/ \
  public_html/wp-config.php \
  public_html/.htaccess \
  2>/dev/null

# Listar
echo ""
echo "Backup criado:"
ls -lh backups/*.tar.gz | tail -1

# Tamanho total
echo ""
echo "Tamanho dos diretórios:"
du -sh public_html/wp-content/uploads/ 2>/dev/null || echo "uploads: N/A"
du -sh public_html/wp-content/themes/ 2>/dev/null || echo "themes: N/A"
du -sh public_html/wp-content/plugins/ 2>/dev/null || echo "plugins: N/A"
REMOTE

echo ""
echo "✅ Tar criado no servidor"
echo ""

# 2. Listar backups disponíveis
echo "📋 Backups disponíveis no servidor:"
BACKUP_FILE=$(sshpass -p "$SSH_PASS" ssh $SSH_OPTS $SSH_USER@$SSH_HOST "ls -t backups/wp_essential_*.tar.gz 2>/dev/null | head -1")

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Nenhum backup encontrado"
    exit 1
fi

echo "Arquivo: $BACKUP_FILE"

# 3. Download com rsync (resume automático)
echo ""
echo "⬇️  Baixando com rsync (resume automático)..."
rsync -avz --progress --partial \
  -e "sshpass -p $SSH_PASS ssh $SSH_OPTS" \
  $SSH_USER@$SSH_HOST:$BACKUP_FILE \
  "$BACKUP_DIR/"

echo ""
echo "✅ Download completo!"
echo ""
echo "Arquivo local:"
ls -lh "$BACKUP_DIR"/wp_essential_*.tar.gz | tail -1

# 4. Verificar integridade
BACKUP_LOCAL=$(ls -t "$BACKUP_DIR"/wp_essential_*.tar.gz | head -1)
echo ""
echo "🔍 Verificando integridade..."
if tar -tzf "$BACKUP_LOCAL" >/dev/null 2>&1; then
    echo "✅ Arquivo íntegro"
    echo ""
    echo "📂 Conteúdo:"
    tar -tzf "$BACKUP_LOCAL" | head -20
    echo "..."
    echo ""
    echo "Total de arquivos: $(tar -tzf "$BACKUP_LOCAL" | wc -l)"
else
    echo "❌ Arquivo corrompido"
    exit 1
fi

echo ""
echo "🎉 Backup concluído com sucesso!"
echo "Arquivo: $BACKUP_LOCAL"
echo ""
echo "Para extrair:"
echo "  tar -xzf $BACKUP_LOCAL -C /destino/"
