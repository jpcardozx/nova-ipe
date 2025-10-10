# 🗄️ Credenciais de Banco de Dados - WordPress

**⚠️ ARQUIVO SENSÍVEL - NÃO COMMITAR**

## 📊 Informações do Banco de Dados

### Servidor MySQL Remoto
```
Host: wp_imobiliaria.mysql.dbaas.com.br
Database: wp_imobiliaria
User: wp_imobiliaria
Password: Ipe@5084  # ⚠️ ATUALIZADO - antiga: rfp183654
Charset: utf8
```

### Servidor SSH/FTP
```
Host: ftp.imobiliariaipe.com.br (187.45.193.173)
User: imobiliariaipe1
Password: IpeImoveis@46932380
Pasta raiz: /home/imobiliariaipe1/
Port FTP: 21
Port SSH: 22

⚠️ STATUS ATUAL: Firewall ainda bloqueando
- FTP porta 21: TIMEOUT
- SSH porta 22: TIMEOUT
- DNS ftp.imobiliariaipe.com.br: Não resolve

🔄 TESTADO:
✅ Credenciais MySQL: wp_imobiliaria / Ipe@4693
❌ Credenciais FTP: imobiliariaipe1 / IpeImoveis@46932380 (timeout)
```

### WordPress
```
Site: https://portal.imobiliariaipe.com.br
Path: ~/public_html/
Prefix: wp_
```

## 🔄 Opções de Importação/Exportação

### Opção 1: Dump Direto do MySQL Remoto (Recomendado)

Como o MySQL está em servidor remoto (dbaas.com.br), você pode fazer dump direto do seu computador local:

```bash
# Export do banco remoto
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria > backup_portal_$(date +%Y%m%d_%H%M%S).sql

# Comprimir
gzip backup_portal_*.sql
```

### Opção 2: Export via phpMyAdmin (Mais Fácil)

1. Acessar: https://portal.imobiliariaipe.com.br/phpmyadmin
2. Login: `wp_imobiliaria` / `rfp183654`
3. Selecionar database: `wp_imobiliaria`
4. Exportar → Método Rápido → SQL → Download

### Opção 3: Via SSH no Servidor de Hospedagem

```bash
# Conectar via SSH
sshpass -p "Imobiliaria@46933003" ssh \
  -p 22 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o StrictHostKeyChecking=no \
  imobiliariaipe1@187.45.193.173

# Uma vez conectado, fazer dump do MySQL remoto
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria | gzip > ~/backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

## 📥 Importar Banco de Dados

### Import Direto (Recomendado)

```bash
# Descompactar se necessário
gunzip backup_portal_20251006.sql.gz

# Importar no MySQL remoto
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria < backup_portal_20251006.sql

# Com progress bar (se tiver pv instalado)
pv backup_portal_20251006.sql | mysql \
  -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria
```

### Import via phpMyAdmin

1. Acessar phpMyAdmin
2. Selecionar database: `wp_imobiliaria`
3. Importar → Escolher arquivo → Executar

**⚠️ Limite:** phpMyAdmin pode ter limite de tamanho (geralmente 50MB)

## 🔍 Validação de Conexão

### Teste de Conexão MySQL

```bash
# Testar conexão com MySQL remoto
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  -e "SELECT VERSION(); SHOW DATABASES;"
```

### Verificar Tabelas

```bash
# Listar todas as tabelas
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria \
  -e "SHOW TABLES;"

# Contar posts
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria \
  -e "SELECT COUNT(*) as total_posts FROM wp_posts WHERE post_type='post' AND post_status='publish';"
```

### Verificar Tamanho do Banco

```bash
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria \
  -e "SELECT 
    table_name AS 'Tabela',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM information_schema.tables 
WHERE table_schema = 'wp_imobiliaria' 
ORDER BY (data_length + index_length) DESC 
LIMIT 15;"
```

## 📋 Checklist de Importação

### Antes de Importar:
- [ ] ✅ Fazer backup do banco atual
- [ ] ✅ Verificar espaço disponível no servidor MySQL
- [ ] ✅ Confirmar credenciais de acesso
- [ ] ✅ Validar arquivo SQL localmente
- [ ] ⚠️ Colocar site em modo manutenção (opcional)

### Durante Importação:
- [ ] ✅ Monitorar progresso do import
- [ ] ✅ Verificar logs de erro
- [ ] ✅ Aguardar conclusão total

### Após Importação:
- [ ] ✅ Verificar número de tabelas
- [ ] ✅ Contar registros principais (posts, users, etc)
- [ ] ✅ Testar login no WordPress
- [ ] ✅ Verificar exibição do site
- [ ] ✅ Limpar cache (W3 Total Cache está ativo)
- [ ] ✅ Remover arquivos temporários

## 🧹 Limpar Cache WordPress

O site usa W3 Total Cache, então após importação:

```bash
# Via SSH
ssh imobiliariaipe1@187.45.193.173
cd ~/public_html/wp-content/cache/
rm -rf page_enhanced/* db/* minify/* object/* tmp/*

# Ou via WP-CLI (se disponível)
wp cache flush --path=~/public_html/
```

## 🔐 Informações de Segurança

### URLs do Site
```
Frontend: https://portal.imobiliariaipe.com.br
Admin: https://portal.imobiliariaipe.com.br/wp-admin
```

### Notas Importantes
- MySQL está em servidor remoto DBaaS (Database as a Service)
- Não é possível acessar MySQL via SSH do servidor de hospedagem
- Precisa conectar diretamente ao host: `wp_imobiliaria.mysql.dbaas.com.br`
- W3 Total Cache está ativo - sempre limpar cache após mudanças

## ⚠️ Troubleshooting

### Erro: "Access denied"
**Solução:** Verificar se as credenciais estão corretas

### Erro: "Can't connect to MySQL server"
**Solução:** 
- Verificar se o host `wp_imobiliaria.mysql.dbaas.com.br` está acessível
- Testar ping: `ping wp_imobiliaria.mysql.dbaas.com.br`
- Verificar firewall local

### Erro: "MySQL server has gone away"
**Solução:** Arquivo muito grande, importar em partes ou aumentar timeout
```bash
mysql --max_allowed_packet=512M \
  -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria < arquivo.sql
```

### phpMyAdmin não abre
**Solução:** Pode não estar instalado. Use MySQL command line.

## 🚀 Comandos Rápidos

### Backup Completo
```bash
# Criar diretório
mkdir -p ~/db-backups

# Export
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  --single-transaction \
  --quick \
  --lock-tables=false \
  wp_imobiliaria | gzip > ~/db-backups/portal_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Verificar
ls -lh ~/db-backups/
```

### Import Rápido
```bash
# Descompactar e importar em um comando
gunzip < backup.sql.gz | mysql \
  -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -prfp183654 \
  wp_imobiliaria
```

---

**📝 Nota de Segurança:**
Este arquivo contém credenciais sensíveis e está protegido pelo .gitignore.
Nunca commitar este arquivo ou compartilhar publicamente.

**Última atualização:** 6 de outubro de 2025
