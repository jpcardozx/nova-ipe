# Quick Reference: Comandos Úteis WordPress + AWS Lightsail

## 🚀 Início Rápido

```bash
# 1. Acessar e obter senha do wp-admin
./scripts/lightsail-access.sh

# 2. Migrar conteúdo
./scripts/wp-migration-helper.sh
```

---

## 📦 AWS Lightsail CLI

### Listar instâncias
```bash
aws lightsail get-instances --region us-east-1
```

### Ver detalhes de uma instância
```bash
aws lightsail get-instance --region us-east-1 --instance-name Ipe-1
```

### Obter IP estático
```bash
# Alocar novo IP estático
aws lightsail allocate-static-ip --region us-east-1 --static-ip-name ipe-static-ip

# Anexar a uma instância
aws lightsail attach-static-ip --region us-east-1 \
  --static-ip-name ipe-static-ip \
  --instance-name Ipe-1

# Listar IPs estáticos
aws lightsail get-static-ips --region us-east-1
```

### Gerenciar firewall
```bash
# Ver regras atuais
aws lightsail get-instance-port-states --region us-east-1 --instance-name Ipe-1

# Abrir porta
aws lightsail open-instance-public-ports \
  --region us-east-1 \
  --instance-name Ipe-1 \
  --port-info fromPort=443,toPort=443,protocol=TCP
```

### Snapshots
```bash
# Criar snapshot
aws lightsail create-instance-snapshot \
  --region us-east-1 \
  --instance-name Ipe-1 \
  --instance-snapshot-name ipe-backup-$(date +%Y%m%d)

# Listar snapshots
aws lightsail get-instance-snapshots --region us-east-1
```

---

## 🔌 Conexão SSH

### Método 1: Via AWS CLI (chave temporária)
```bash
# Gerar e conectar automaticamente
aws lightsail get-instance-access-details \
  --region us-east-1 \
  --instance-name Ipe-1 \
  --protocol ssh > access.json

jq -r '.accessDetails.privateKey' access.json > key.pem
chmod 600 key.pem
HOST=$(jq -r '.accessDetails.ipAddress' access.json)
USER=$(jq -r '.accessDetails.username' access.json)

ssh -i key.pem $USER@$HOST
```

### Método 2: Usando sua própria chave
```bash
# Gerar par de chaves (se não tiver)
ssh-keygen -t ed25519 -C "lightsail-ipe" -f ~/.ssh/lightsail-ipe

# Upload da chave pública (via SSH temporária primeiro)
cat ~/.ssh/lightsail-ipe.pub | ssh -i key.pem bitnami@$HOST \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Conectar com sua chave
ssh -i ~/.ssh/lightsail-ipe bitnami@SEU_IP_ESTATICO
```

### Configurar SSH config para acesso fácil
```bash
# Adicionar em ~/.ssh/config
cat >> ~/.ssh/config << 'EOF'
Host ipe-lightsail
    HostName SEU_IP_ESTATICO
    User bitnami
    IdentityFile ~/.ssh/lightsail-ipe
    StrictHostKeyChecking no
EOF

# Agora conecte apenas com:
ssh ipe-lightsail
```

---

## 🔧 WP-CLI Commands

### Gerenciamento de usuários
```bash
# Listar usuários
sudo wp user list --allow-root

# Criar admin
sudo wp user create admin admin@domain.com \
  --role=administrator \
  --user_pass='SenhaForte123!' \
  --allow-root

# Atualizar senha
sudo wp user update user --user_pass='NovaSenha123!' --allow-root

# Deletar usuário
sudo wp user delete usuario_id --reassign=1 --allow-root
```

### Banco de dados
```bash
# Exportar
sudo wp db export backup.sql --allow-root

# Importar
sudo wp db import backup.sql --allow-root

# Reset (CUIDADO!)
sudo wp db reset --yes --allow-root

# Verificar/Reparar
sudo wp db check --allow-root
sudo wp db repair --allow-root

# Otimizar
sudo wp db optimize --allow-root

# Query direta
sudo wp db query "SELECT * FROM wp_users" --allow-root
```

### Search-Replace (URLs)
```bash
# DRY RUN (sempre faça primeiro!)
sudo wp search-replace \
  'http://old-site.com' \
  'https://new-site.com' \
  --all-tables --dry-run --allow-root

# EXECUTAR
sudo wp search-replace \
  'http://old-site.com' \
  'https://new-site.com' \
  --all-tables --allow-root

# Apenas tabelas específicas
sudo wp search-replace 'old' 'new' wp_posts wp_postmeta --allow-root
```

### Plugins
```bash
# Listar
sudo wp plugin list --allow-root

# Instalar
sudo wp plugin install contact-form-7 --activate --allow-root

# Ativar/Desativar
sudo wp plugin activate plugin-name --allow-root
sudo wp plugin deactivate plugin-name --allow-root

# Atualizar todos
sudo wp plugin update --all --allow-root

# Deletar
sudo wp plugin delete plugin-name --allow-root
```

### Temas
```bash
# Listar
sudo wp theme list --allow-root

# Ativar
sudo wp theme activate theme-name --allow-root

# Instalar
sudo wp theme install twentytwentyfour --activate --allow-root

# Atualizar
sudo wp theme update --all --allow-root
```

### Core WordPress
```bash
# Ver versão
sudo wp core version --allow-root

# Atualizar
sudo wp core update --allow-root

# Verificar integridade
sudo wp core verify-checksums --allow-root

# Baixar/instalar WordPress limpo
sudo wp core download --allow-root
```

### Cache
```bash
# Limpar
sudo wp cache flush --allow-root

# Transients
sudo wp transient delete --all --allow-root
```

### Media
```bash
# Regenerar miniaturas
sudo wp media regenerate --yes --allow-root

# Importar
sudo wp media import arquivo.jpg --title="Título" --allow-root
```

### Rewrite Rules
```bash
# Flush (se permalinks não funcionarem)
sudo wp rewrite flush --allow-root

# Ver estrutura
sudo wp rewrite structure --allow-root
```

---

## 🌐 Apache/Bitnami

### Controle de serviços
```bash
# Status
sudo /opt/bitnami/ctlscript.sh status

# Restart Apache
sudo /opt/bitnami/ctlscript.sh restart apache

# Restart MySQL
sudo /opt/bitnami/ctlscript.sh restart mysql

# Restart todos
sudo /opt/bitnami/ctlscript.sh restart

# Stop/Start
sudo /opt/bitnami/ctlscript.sh stop
sudo /opt/bitnami/ctlscript.sh start
```

### Logs
```bash
# Apache error log
sudo tail -f /opt/bitnami/apache/logs/error_log

# Apache access log
sudo tail -f /opt/bitnami/apache/logs/access_log

# MySQL log
sudo tail -f /opt/bitnami/mysql/data/mysqld.log

# PHP errors
sudo tail -f /opt/bitnami/apache/logs/php_error_log
```

### Configurações
```bash
# Apache config
sudo nano /opt/bitnami/apache/conf/httpd.conf
sudo nano /opt/bitnami/apache/conf/bitnami/bitnami.conf

# PHP config
sudo nano /opt/bitnami/php/etc/php.ini

# MySQL config
sudo nano /opt/bitnami/mysql/my.cnf
```

---

## 🔒 HTTPS & SSL

### Bitnami HTTPS Tool (RECOMENDADO)
```bash
sudo /opt/bitnami/bncert-tool
```

Este wizard configura:
- Let's Encrypt SSL
- Renovação automática
- HTTP → HTTPS redirect
- www → non-www (ou vice-versa)

### Manual: Certificado Let's Encrypt
```bash
# Instalar certbot
sudo apt-get update
sudo apt-get install certbot

# Obter certificado
sudo certbot certonly --webroot \
  -w /opt/bitnami/apache/htdocs \
  -d seudominio.com \
  -d www.seudominio.com

# Configurar Apache
sudo nano /opt/bitnami/apache/conf/bitnami/bitnami.conf
# Adicionar:
# SSLCertificateFile "/etc/letsencrypt/live/seudominio.com/cert.pem"
# SSLCertificateKeyFile "/etc/letsencrypt/live/seudominio.com/privkey.pem"
# SSLCertificateChainFile "/etc/letsencrypt/live/seudominio.com/chain.pem"

# Restart Apache
sudo /opt/bitnami/ctlscript.sh restart apache

# Auto-renovação (cron)
sudo crontab -e
# Adicionar:
# 0 3 * * * /usr/bin/certbot renew --quiet --post-hook "/opt/bitnami/ctlscript.sh restart apache"
```

### Verificar SSL
```bash
# Testar localmente
openssl s_client -connect seudominio.com:443 -servername seudominio.com

# Ver certificado
echo | openssl s_client -servername seudominio.com -connect seudominio.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 📁 Arquivos & Permissões

### Estrutura Bitnami
```
/opt/bitnami/
├── wordpress/          # Arquivos do WordPress
├── apache/            # Apache web server
├── mysql/             # MySQL database
├── php/               # PHP
└── ctlscript.sh       # Control script
```

### Permissões corretas
```bash
# Aplicar permissões padrão
sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 755 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 644 {} \;

# wp-config.php mais restrito
sudo chmod 640 /opt/bitnami/wordpress/wp-config.php

# Uploads editáveis
sudo chmod -R 755 /opt/bitnami/wordpress/wp-content/uploads
```

### Backup manual
```bash
# WordPress files
sudo tar -czf wordpress-backup-$(date +%Y%m%d).tar.gz /opt/bitnami/wordpress

# Database
sudo wp db export /tmp/db-backup-$(date +%Y%m%d).sql --allow-root

# Download backup
scp -i key.pem bitnami@HOST:/tmp/db-backup*.sql ./
scp -i key.pem bitnami@HOST:/tmp/wordpress-backup*.tar.gz ./
```

---

## 🧹 Troubleshooting

### Site não carrega (500 error)
```bash
# Ver logs
sudo tail -50 /opt/bitnami/apache/logs/error_log

# Verificar permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress

# Restart Apache
sudo /opt/bitnami/ctlscript.sh restart apache
```

### Database connection error
```bash
# Verificar MySQL rodando
sudo /opt/bitnami/ctlscript.sh status

# Verificar credenciais
sudo grep DB_ /opt/bitnami/wordpress/wp-config.php

# Testar conexão MySQL
mysql -u bn_wordpress -p
```

### Permalinks não funcionam
```bash
# Flush rewrite rules
sudo wp rewrite flush --allow-root

# Verificar .htaccess
cat /opt/bitnami/wordpress/.htaccess

# Se necessário, recriar
sudo wp rewrite flush --hard --allow-root
```

### Upload de arquivos falha
```bash
# Verificar limites PHP
sudo grep -E "upload_max_filesize|post_max_size|max_execution_time" /opt/bitnami/php/etc/php.ini

# Aumentar limites
sudo nano /opt/bitnami/php/etc/php.ini
# upload_max_filesize = 64M
# post_max_size = 64M
# max_execution_time = 300

# Restart
sudo /opt/bitnami/ctlscript.sh restart apache
```

### Memory limit
```bash
# Aumentar memory limit PHP
sudo nano /opt/bitnami/php/etc/php.ini
# memory_limit = 256M

# Ou via wp-config.php
sudo nano /opt/bitnami/wordpress/wp-config.php
# define('WP_MEMORY_LIMIT', '256M');
```

---

## 📊 Monitoramento

### Uso de disco
```bash
df -h
du -sh /opt/bitnami/wordpress/*
```

### Uso de memória
```bash
free -h
top
htop  # se instalado
```

### Processos Apache/MySQL
```bash
ps aux | grep apache
ps aux | grep mysql
```

### Conexões ativas
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

---

## 🔄 Migração: Checklist Rápido

```bash
# 1. Backup site antigo
mysqldump > backup.sql
tar -czf wp-content.tar.gz wp-content/

# 2. Upload para Lightsail
scp backup.sql wp-content.tar.gz bitnami@HOST:/tmp/

# 3. Importar
sudo wp db import /tmp/backup.sql --allow-root
sudo rm -rf /opt/bitnami/wordpress/wp-content
sudo tar -xzf /tmp/wp-content.tar.gz -C /opt/bitnami/wordpress/

# 4. Permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress

# 5. Search-Replace
sudo wp search-replace 'http://old.com' 'https://new.com' --all-tables --allow-root

# 6. Flush cache
sudo wp cache flush --allow-root
sudo wp rewrite flush --allow-root

# 7. Restart
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## 📚 Links Úteis

- [AWS CLI Lightsail Reference](https://docs.aws.amazon.com/cli/latest/reference/lightsail/)
- [WP-CLI Commands](https://developer.wordpress.org/cli/commands/)
- [Bitnami WordPress Docs](https://docs.bitnami.com/aws/apps/wordpress/)
- [WordPress Codex](https://codex.wordpress.org/)

---

**Dica**: Adicione aliases no `~/.bashrc` para comandos frequentes:

```bash
echo "alias wproot='cd /opt/bitnami/wordpress'" >> ~/.bashrc
echo "alias wpcli='sudo wp --allow-root'" >> ~/.bashrc
echo "alias apachelog='sudo tail -f /opt/bitnami/apache/logs/error_log'" >> ~/.bashrc
echo "alias apacherestart='sudo /opt/bitnami/ctlscript.sh restart apache'" >> ~/.bashrc
source ~/.bashrc
```
