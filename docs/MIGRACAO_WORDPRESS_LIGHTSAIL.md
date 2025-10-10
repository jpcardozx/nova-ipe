# Guia Completo: WordPress Locaweb → AWS Lightsail

## 🎯 Objetivo
Migrar site WordPress da Locaweb para AWS Lightsail Bitnami, **tudo local no Linux**, sem CloudShell.

---

## 📋 Pré-requisitos

### 1. Instalar dependências no Ubuntu:
```bash
sudo apt-get update
sudo apt-get install -y awscli jq
```

### 2. Configurar AWS CLI:
```bash
aws configure
```

Você precisará:
- **AWS Access Key ID** (da sua conta AWS)
- **AWS Secret Access Key** (da sua conta AWS)
- **Default region**: `us-east-1` (ou onde está sua instância)
- **Default output format**: `json`

### 3. Verificar instância Lightsail:
```bash
# Listar todas as instâncias
aws lightsail get-instances --region us-east-1

# Ver sua instância específica
aws lightsail get-instance --region us-east-1 --instance-name Ipe-1
```

---

## 🚀 Passo 1: Acessar WordPress no Lightsail

### Opção A: Usar o script automatizado (RECOMENDADO)

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/lightsail-access.sh
```

O script vai:
- ✅ Verificar dependências
- ✅ Pegar credenciais SSH temporárias
- ✅ Extrair senha do wp-admin
- ✅ Mostrar menu interativo para conectar, criar admin, etc.

### Opção B: Manual (se quiser entender o processo)

```bash
# 1. Pegar acesso SSH
REGION=us-east-1
INSTANCE=Ipe-1

aws lightsail get-instance-access-details \
  --region $REGION \
  --instance-name "$INSTANCE" \
  --protocol ssh \
  > access.json

# 2. Extrair chave SSH
jq -r '.accessDetails.privateKey' access.json > key.pem
chmod 600 key.pem

# 3. Extrair host e usuário
HOST=$(jq -r '.accessDetails.ipAddress' access.json)
USER=$(jq -r '.accessDetails.username' access.json)

# 4. Criar known_hosts
jq -r --arg h "$HOST" \
  '.accessDetails.hostKeys[] | "\($h) \(.algorithm) \(.publicKey)"' \
  access.json > known_hosts

# 5. Conectar
ssh -i key.pem -o StrictHostKeyChecking=yes -o UserKnownHostsFile=known_hosts "$USER@$HOST"

# 6. Dentro da instância, pegar senha do WordPress
cat /home/bitnami/bitnami_application_password
```

---

## 🔐 Passo 2: Logar no WordPress

Com a senha obtida, acesse:

```
http://SEU_IP_PUBLICO/wp-login.php
Usuário: user
Senha: [a que você pegou do arquivo]
```

### Criar um novo admin (opcional, mas recomendado):

```bash
# Conectar via SSH e executar
cd /opt/bitnami/wordpress
sudo wp user create admin2 admin2@seudominio.com \
  --role=administrator \
  --user_pass='SuaSenhaForte123!' \
  --allow-root
```

---

## 📦 Passo 3: Migrar Conteúdo

### Método 1: Plugin Duplicator (MAIS FÁCIL)

#### No site ANTIGO (Locaweb):
1. Instale plugin **Duplicator**
2. **Desative plugins problemáticos** (cache, segurança):
   - W3 Total Cache
   - WP Super Cache
   - Wordfence (pode deixar, mas desative modo de bloqueio)
   - iThemes Security
3. Crie novo pacote em `Duplicator > Create New`
4. Baixe o `.zip` e o `installer.php`

#### No site NOVO (Lightsail):
1. Via SSH, limpe a instalação WordPress existente:
   ```bash
   cd /opt/bitnami/wordpress
   sudo wp db reset --yes --allow-root
   sudo rm -rf wp-content/*
   ```

2. Suba os arquivos do Duplicator:
   ```bash
   # No seu computador local
   scp -i .lightsail-access/key.pem \
     -o UserKnownHostsFile=.lightsail-access/known_hosts \
     arquivo.zip installer.php \
     bitnami@SEU_IP:/tmp/

   # Na instância
   sudo mv /tmp/arquivo.zip /opt/bitnami/wordpress/
   sudo mv /tmp/installer.php /opt/bitnami/wordpress/
   sudo chown bitnami:daemon /opt/bitnami/wordpress/*
   ```

3. Acesse `http://SEU_IP/installer.php` e siga o wizard

### Método 2: Manual + WP-CLI (MAIS CONTROLE)

#### No site ANTIGO:
1. **Exportar banco de dados**:
   ```bash
   # Via phpMyAdmin ou SSH
   mysqldump -u USER -p DATABASE > backup.sql
   ```

2. **Baixar wp-content**:
   ```bash
   # Se conseguir SFTP/SSH na Locaweb
   scp -r usuario@locaweb:/caminho/wp-content ./wp-content-backup/
   
   # Ou via FTP, compacte antes:
   # cd /caminho/wordpress
   # tar -czf wp-content.tar.gz wp-content/
   # Depois baixe o .tar.gz
   ```

#### No site NOVO:
1. **Importar banco**:
   ```bash
   # Copiar .sql para o servidor
   scp -i .lightsail-access/key.pem backup.sql bitnami@SEU_IP:/tmp/
   
   # Na instância
   cd /opt/bitnami/wordpress
   sudo wp db import /tmp/backup.sql --allow-root
   ```

2. **Copiar wp-content**:
   ```bash
   # Do seu computador
   scp -i .lightsail-access/key.pem -r \
     wp-content-backup/* \
     bitnami@SEU_IP:/tmp/wp-content/
   
   # Na instância
   sudo rm -rf /opt/bitnami/wordpress/wp-content
   sudo mv /tmp/wp-content /opt/bitnami/wordpress/
   sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content
   ```

3. **Atualizar URLs no banco** (CRÍTICO):
   ```bash
   cd /opt/bitnami/wordpress
   
   # DRY RUN (ver o que será alterado)
   sudo wp search-replace \
     'http://seusite.com.br' \
     'http://SEU_IP_LIGHTSAIL' \
     --all-tables --dry-run --allow-root
   
   # EXECUTAR de verdade
   sudo wp search-replace \
     'http://seusite.com.br' \
     'http://SEU_IP_LIGHTSAIL' \
     --all-tables --allow-root
   ```

4. **Recriar usuário admin** (caso tenha problemas de login):
   ```bash
   sudo wp user create novouser email@dominio.com \
     --role=administrator \
     --user_pass='SenhaForte123!' \
     --allow-root
   ```

---

## 🌐 Passo 4: Apontar Domínio e Configurar HTTPS

### 1. No seu provedor de DNS (Registro.br, Cloudflare, etc):
```
Tipo A → @ → SEU_IP_LIGHTSAIL
Tipo A → www → SEU_IP_LIGHTSAIL
```

### 2. Aguardar propagação DNS (pode levar até 48h, geralmente 15min):
```bash
# Verificar propagação
dig seudominio.com.br +short
dig www.seudominio.com.br +short
```

### 3. Rodar o Bitnami HTTPS Configuration Tool:
```bash
# Conectar via SSH
ssh -i .lightsail-access/key.pem bitnami@SEU_IP

# Executar bncert-tool
sudo /opt/bitnami/bncert-tool
```

O wizard vai:
- ✅ Validar domínio
- ✅ Emitir certificado Let's Encrypt
- ✅ Configurar renovação automática
- ✅ Forçar redirect HTTP → HTTPS
- ✅ Configurar www → não-www (ou vice-versa)

### 4. Atualizar URLs no WordPress para HTTPS:
```bash
cd /opt/bitnami/wordpress
sudo wp search-replace \
  'http://seudominio.com.br' \
  'https://seudominio.com.br' \
  --all-tables --allow-root
```

---

## 🔧 Troubleshooting

### Problema: "Permission denied" ao usar WP-CLI
**Solução**: Use `sudo` e `--allow-root`:
```bash
sudo wp comando --allow-root
```

### Problema: Site mostra "Error establishing database connection"
**Solução**: Verifique credenciais em `wp-config.php`:
```bash
sudo nano /opt/bitnami/wordpress/wp-config.php
# Verificar DB_NAME, DB_USER, DB_PASSWORD, DB_HOST
```

### Problema: Imagens não aparecem após migração
**Solução**: 
1. Verificar permissões:
   ```bash
   sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads
   sudo chmod -R 755 /opt/bitnami/wordpress/wp-content/uploads
   ```
2. Regenerar miniaturas:
   ```bash
   sudo wp media regenerate --yes --allow-root
   ```

### Problema: FTP travando na Locaweb
**Solução**: Use SSH/SFTP temporário (3h) que eles liberam:
```bash
# Conectar com credenciais que a Locaweb fornece
sftp usuario@servidor.locaweb.com.br
sftp> get -r wp-content
```

### Problema: "ChunkLoadError" no site
**Solução**: Limpar cache:
```bash
# No WordPress
sudo wp cache flush --allow-root

# No servidor
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## 📊 Checklist de Validação

Antes de considerar a migração completa:

- [ ] Login no wp-admin funciona
- [ ] Homepage carrega corretamente
- [ ] Páginas internas funcionam (permalinks OK)
- [ ] Imagens aparecem
- [ ] Formulários de contato funcionam
- [ ] Plugins críticos ativos e funcionando
- [ ] HTTPS configurado e funcionando
- [ ] Redirect HTTP → HTTPS ativo
- [ ] Certificado SSL válido e renovação automática configurada
- [ ] Backup do site antigo salvo em local seguro

---

## 🎓 Comandos WP-CLI Úteis

```bash
# Ver informações do site
sudo wp core version --allow-root
sudo wp plugin list --allow-root
sudo wp theme list --allow-root

# Atualizar WordPress
sudo wp core update --allow-root

# Atualizar plugins
sudo wp plugin update --all --allow-root

# Limpar cache
sudo wp cache flush --allow-root

# Verificar/reparar banco
sudo wp db check --allow-root
sudo wp db repair --allow-root

# Exportar/importar conteúdo
sudo wp export --allow-root
sudo wp import arquivo.xml --authors=create --allow-root

# Ver usuários
sudo wp user list --allow-root

# Resetar senha de usuário
sudo wp user update USERNAME --user_pass='NOVA_SENHA' --allow-root
```

---

## 📚 Referências Oficiais

- [AWS Lightsail get-instance-access-details](https://docs.aws.amazon.com/cli/latest/reference/lightsail/get-instance-access-details.html)
- [Bitnami WordPress Credentials](https://docs.aws.amazon.com/lightsail/latest/userguide/log-in-to-your-bitnami-application-running-on-amazon-lightsail.html)
- [WP-CLI User Commands](https://developer.wordpress.org/cli/commands/user/)
- [WP-CLI Search-Replace](https://developer.wordpress.org/cli/commands/search-replace/)
- [Bitnami HTTPS Tool](https://docs.bitnami.com/aws/how-to/understand-bncert/)
- [Lightsail Static IP](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-static-ip-addresses-in-amazon-lightsail.html)

---

## 🚨 Notas Importantes

1. **Nunca** rode `search-replace` sem `--dry-run` primeiro
2. **Sempre** faça backup antes de importar/alterar banco
3. **WP-CLI trata serialização** corretamente - não use SQL direto para URLs
4. **Static IP** no Lightsail evita perder IP em reboot (alocar antes de apontar DNS)
5. **bncert-tool** renova SSL automaticamente - não precisa configurar cron
6. Plugins de cache **podem** causar problemas na migração - desative antes de empacotar

---

**Próximos passos**: Execute `./scripts/lightsail-access.sh` e comece!
