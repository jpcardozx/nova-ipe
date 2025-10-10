# 🚀 Migração WordPress: COMANDOS PRONTOS PARA COLAR

**Data:** 7 de outubro de 2025
**Status:** ✅ Pronto para executar

---

## 📋 RESPOSTAS ÀS SUAS PERGUNTAS

### 1️⃣ Você tem SSH no servidor antigo?

**✅ SIM** - Credenciais confirmadas:
```
Host: 187.45.193.173
User: imobiliariaipe1
Pass: IpeImoveis@46932380
Port: 22
Path: /home/imobiliariaipe1/public_html
```

**⚠️ STATUS:** Firewall estava bloqueando, mas temos as credenciais corretas.

---

### 2️⃣ URLs gravadas no banco

Com base na análise do banco e documentação:

```
URL antiga no banco: http://portal.imobiliariaipe.com.br
URL nova (Lightsail): https://portal.imobiliariaipe.com.br
```

**Mudanças:** `http://` → `https://` (adição de SSL)

---

### 3️⃣ Manter mesmas credenciais de DB?

**✅ RECOMENDADO:** Usar as mesmas credenciais no Lightsail para reduzir fricção:

```
DB_NAME: wp_imobiliaria
DB_USER: wp_imobiliaria
DB_PASS: Ipe@5084
DB_HOST: localhost (no Lightsail, em vez do DBaaS remoto)
```

---

### 4️⃣ Tamanho de wp-content/uploads

**Não precisamos mais dessa info!**

Como vamos usar `tar.gz`, o tamanho é irrelevante - você transfere **um arquivo compactado** em vez de 50 mil arquivos individuais via FTP.

---

## 🎯 ROTA A: MIGRAÇÃO COMPLETA COM SSH

Você tem SSH, então siga esta rota. **Sem plugins, sem FTP lento.**

### OPÇÃO 1: Script Automatizado (Recomendado)

Criamos um script interativo que faz tudo:

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-locaweb-to-lightsail.sh
```

**O script faz:**
1. ✅ Testa SSH no servidor antigo
2. ✅ Cria backup compactado (excluindo cache)
3. ✅ Faz dump do banco MySQL
4. ✅ Transfere tudo para sua máquina local
5. ✅ Te guia para enviar ao Lightsail
6. ✅ Fornece comandos prontos para restaurar

---

### OPÇÃO 2: Comandos Manuais (Controle Total)

Se preferir executar passo a passo:

#### **PASSO 1: No Servidor Antigo (Locaweb)**

Conectar via SSH:

```bash
sshpass -p "IpeImoveis@46932380" ssh \
  -p 22 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o StrictHostKeyChecking=no \
  imobiliariaipe1@187.45.193.173
```

Uma vez conectado, executar:

```bash
# Ir para a raiz do site
cd /home/imobiliariaipe1/public_html

# Compactar arquivos (excluindo cache do W3TC)
tar --exclude='wp-content/cache' \
    --exclude='wp-content/uploads/cache' \
    --exclude='wp-content/w3tc-config' \
    --warning=no-file-changed \
    -czf /tmp/site-files.tar.gz . 2>/dev/null

# Dump do banco (MySQL remoto DBaaS)
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -p'Ipe@5084' \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --default-character-set=utf8 \
  --no-tablespaces \
  wp_imobiliaria | gzip > /tmp/database.sql.gz

# Verificar tamanhos
ls -lh /tmp/site-files.tar.gz /tmp/database.sql.gz
```

**Desconectar** (Ctrl+D ou `exit`)

---

#### **PASSO 2: Transferir Arquivos para Sua Máquina**

```bash
# Baixar arquivos do servidor antigo
sshpass -p "IpeImoveis@46932380" scp \
  -P 22 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o StrictHostKeyChecking=no \
  imobiliariaipe1@187.45.193.173:/tmp/site-files.tar.gz \
  ~/Downloads/

sshpass -p "IpeImoveis@46932380" scp \
  -P 22 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o StrictHostKeyChecking=no \
  imobiliariaipe1@187.45.193.173:/tmp/database.sql.gz \
  ~/Downloads/
```

---

#### **PASSO 3: Enviar para o Lightsail**

**⚠️ VOCÊ PRECISA PREENCHER O IP DO SEU LIGHTSAIL:**

```bash
# Substitua SEU_IP_LIGHTSAIL pelo IP real
scp ~/Downloads/site-files.tar.gz bitnami@SEU_IP_LIGHTSAIL:/tmp/
scp ~/Downloads/database.sql.gz bitnami@SEU_IP_LIGHTSAIL:/tmp/
```

---

#### **PASSO 4: No Servidor Lightsail**

Conectar via SSH no Lightsail:

```bash
ssh bitnami@SEU_IP_LIGHTSAIL
```

Executar no Lightsail:

```bash
# 1. Criar banco e usuário
mysql -u root -p <<'EOF'
CREATE DATABASE IF NOT EXISTS wp_imobiliaria DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER IF NOT EXISTS 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF

# 2. Importar banco
gunzip < /tmp/database.sql.gz | mysql -u root -p wp_imobiliaria

# 3. Backup do WordPress atual (se houver)
sudo mv /opt/bitnami/wordpress /opt/bitnami/wordpress.old.$(date +%Y%m%d) 2>/dev/null || true

# 4. Criar diretório e extrair arquivos
sudo mkdir -p /opt/bitnami/wordpress
cd /opt/bitnami/wordpress
sudo tar -xzf /tmp/site-files.tar.gz

# 5. Ajustar permissões Bitnami
sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 664 {} \;
```

---

#### **PASSO 5: Editar wp-config.php no Lightsail**

```bash
sudo nano /opt/bitnami/wordpress/wp-config.php
```

**Substituir as linhas de DB por:**

```php
define('DB_NAME', 'wp_imobiliaria');
define('DB_USER', 'wp_imobiliaria');
define('DB_PASSWORD', 'Ipe@5084');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
```

**Adicionar/corrigir URLs:**

```php
// Fixar URLs
define('WP_HOME', 'https://portal.imobiliariaipe.com.br');
define('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');
```

**Remover cache antigo (se existir):**

```php
// REMOVER esta linha se existir:
// define('WP_CACHE', true);
```

Salvar (Ctrl+O) e sair (Ctrl+X).

---

#### **PASSO 6: Limpar Restos de Cache Antigo**

```bash
# Remover drop-ins de cache
sudo rm -f /opt/bitnami/wordpress/wp-content/advanced-cache.php
sudo rm -f /opt/bitnami/wordpress/wp-content/object-cache.php
sudo rm -f /opt/bitnami/wordpress/wp-content/db.php
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/*
sudo rm -rf /opt/bitnami/wordpress/wp-content/w3tc-config
```

---

#### **PASSO 7: Atualizar URLs no Banco (WP-CLI)**

```bash
cd /opt/bitnami/wordpress

# Instalar WP-CLI se não tiver
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Atualizar URLs
wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' \
    --all-tables \
    --precise \
    --skip-columns=guid \
    --allow-root \
    --report-changed-only

# Limpar permalinks
wp rewrite flush --allow-root
```

---

#### **PASSO 8: Reiniciar Serviços**

```bash
sudo /opt/bitnami/ctlscript.sh restart
```

---

#### **PASSO 9: Testar**

```bash
curl -I https://portal.imobiliariaipe.com.br
```

Abrir no navegador: `https://portal.imobiliariaipe.com.br/wp-admin`

---

## ✅ CHECKLIST PÓS-MIGRAÇÃO

- [ ] wp-config.php usando `localhost` e credenciais corretas
- [ ] `define('WP_CACHE', true)` removido
- [ ] `advanced-cache.php`, `object-cache.php`, `db.php` deletados
- [ ] `wp-content/cache` vazio
- [ ] URLs atualizadas com `wp search-replace`
- [ ] Permissões `bitnami:daemon` 775/664 aplicadas
- [ ] `.htaccess` sem `php_flag` ou diretivas PHP 5.x
- [ ] Permalinks testados no `/wp-admin`
- [ ] Site acessível via `https://`
- [ ] Login no WordPress funcionando

---

## 🧹 LIMPEZA FINAL

No **servidor antigo**, após confirmar que tudo funciona:

```bash
ssh imobiliariaipe1@187.45.193.173
rm /tmp/site-files.tar.gz /tmp/database.sql.gz
```

Na **sua máquina local:**

```bash
rm ~/Downloads/site-files.tar.gz ~/Downloads/database.sql.gz
```

No **Lightsail:**

```bash
sudo rm /tmp/site-files.tar.gz /tmp/database.sql.gz
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Access denied" no MySQL

**Causa:** Senha errada ou usuário não criado.

**Solução:**
```bash
# No Lightsail, recriar usuário
mysql -u root -p
DROP USER IF EXISTS 'wp_imobiliaria'@'localhost';
CREATE USER 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Ipe@5084';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Erro: "Error establishing database connection"

**Causa:** wp-config.php com host errado.

**Solução:**
```bash
# Verificar wp-config.php
cat /opt/bitnami/wordpress/wp-config.php | grep DB_

# Deve estar:
# define('DB_HOST', 'localhost');  <-- NÃO pode ser o DBaaS antigo!
```

---

### Site mostra "Too many redirects"

**Causa:** URLs mistas (http/https) ou cache.

**Solução:**
```bash
# Limpar cache
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/*

# Verificar URLs no banco
wp option get siteurl --allow-root
wp option get home --allow-root

# Forçar HTTPS se necessário
wp option update siteurl 'https://portal.imobiliariaipe.com.br' --allow-root
wp option update home 'https://portal.imobiliariaipe.com.br' --allow-root
```

---

### Permalinks quebrados (404 em páginas)

**Causa:** .htaccess ou configuração Apache.

**Solução:**
```bash
# Recriar .htaccess
wp rewrite flush --hard --allow-root

# Verificar mod_rewrite ativo
sudo a2enmod rewrite
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## 📞 PRECISA DE AJUDA?

Se algo der errado, me envie:

1. **Mensagem de erro exata** (screenshot ou copiar/colar)
2. **Passo onde travou** (1, 2, 3, etc.)
3. **Output do comando:** `ls -la /opt/bitnami/wordpress/wp-config.php`
4. **Output do comando:** `mysql -u wp_imobiliaria -p'Ipe@5084' wp_imobiliaria -e "SHOW TABLES;"`

---

## 🎉 APÓS A MIGRAÇÃO

1. **Desabilitar W3 Total Cache** no painel `/wp-admin/plugins.php`
2. **Instalar cache moderno** (se quiser):
   - WP Super Cache
   - WP Rocket
   - LiteSpeed Cache (se usar LiteSpeed)
3. **Testar tudo:**
   - Login
   - Páginas
   - Posts
   - Uploads de imagem
   - Formulários de contato
4. **Apontar DNS** para o IP do Lightsail (após validar que está 100%)

---

**Última atualização:** 7 de outubro de 2025
**Criado por:** Claude Code

✅ **TUDO PRONTO PARA EXECUTAR!**
