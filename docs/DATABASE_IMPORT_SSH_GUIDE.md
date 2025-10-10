# 🗄️ Guia de Importação de Banco de Dados via SSH

**Data:** 6 de outubro de 2025  
**Servidor:** imobiliariaipe.com.br  
**Tipo:** SSH/FTP Access  
**Status:** ✅ Script Automatizado Disponível

## 🚀 Quick Start (Usando Script Automatizado)

### Comandos Rápidos:
```bash
# Testar conexão
./scripts/db-import-ssh.sh test

# Ver informações do servidor
./scripts/db-import-ssh.sh info

# Listar bancos de dados
./scripts/db-import-ssh.sh databases

# Fazer backup
./scripts/db-import-ssh.sh backup nome_do_banco

# Importar SQL
./scripts/db-import-ssh.sh import arquivo.sql nome_do_banco

# Exportar banco
./scripts/db-import-ssh.sh export nome_do_banco

# Abrir shell interativo
./scripts/db-import-ssh.sh shell

# Abrir MySQL CLI
./scripts/db-import-ssh.sh mysql
```

## 🔐 Credenciais de Acesso

**Armazenadas em:** `.env.ssh` (arquivo não versionado)

```bash
Host: 187.45.193.173
Porta: 22
Usuário: imobiliariaipe1
Senha: Imobiliaria@46933003
FTP: ftp.imobiliariaipe.com.br
```

**Sistema:** Linux 4.4.165-grsec (x86_64)  
**MySQL:** 5.6.36-82.0  
**Diretório:** /home/storage/e/4f/a6/imobiliariaipe1

## 📋 Passo 1: Conectar ao Servidor

```bash
# Conectar via SSH
ssh -p 22 imobiliariaipe1@187.45.193.173

# Ou usando o domínio
ssh -p 22 imobiliariaipe1@ftp.imobiliariaipe.com.br
```

## 🔍 Passo 2: Identificar o Banco de Dados

Após conectar, verificar qual banco está instalado:

```bash
# Verificar MySQL/MariaDB
mysql --version

# Verificar PostgreSQL
psql --version

# Localizar configurações
ls -la ~/public_html/
find . -name "wp-config.php" -o -name ".env" -o -name "config.php" 2>/dev/null
```

## 📊 Passo 3: Backup do Banco Atual (IMPORTANTE!)

### Para MySQL/MariaDB:

```bash
# Criar diretório de backup
mkdir -p ~/backups/$(date +%Y%m%d)

# Fazer backup completo
mysqldump -u [usuario_db] -p[senha_db] [nome_database] > ~/backups/$(date +%Y%m%d)/backup_$(date +%H%M%S).sql

# Ou backup com compressão
mysqldump -u [usuario_db] -p[senha_db] [nome_database] | gzip > ~/backups/$(date +%Y%m%d)/backup_$(date +%H%M%S).sql.gz

# Verificar tamanho do backup
ls -lh ~/backups/$(date +%Y%m%d)/
```

### Para PostgreSQL:

```bash
# Backup PostgreSQL
pg_dump -U [usuario_db] [nome_database] > ~/backups/$(date +%Y%m%d)/backup_$(date +%H%M%S).sql

# Com compressão
pg_dump -U [usuario_db] [nome_database] | gzip > ~/backups/$(date +%Y%m%d)/backup_$(date +%H%M%S).sql.gz
```

## 📤 Passo 4: Transferir Arquivo de Importação

### Opção A: Upload via SCP (do seu computador local)

```bash
# Em uma nova janela de terminal (LOCAL)
scp -P 22 /caminho/local/database.sql imobiliariaipe1@187.45.193.173:~/import/

# Com compressão durante transferência
gzip -c /caminho/local/database.sql | ssh -p 22 imobiliariaipe1@187.45.193.173 "cat > ~/import/database.sql.gz"
```

### Opção B: Upload via SFTP

```bash
# Conectar via SFTP
sftp -P 22 imobiliariaipe1@187.45.193.173

# Comandos SFTP:
sftp> mkdir import
sftp> cd import
sftp> put /caminho/local/database.sql
sftp> ls -lh
sftp> quit
```

### Opção C: Download de URL Externa (no servidor)

```bash
# Criar diretório de importação
mkdir -p ~/import
cd ~/import

# Download via wget
wget https://exemplo.com/database.sql.gz

# Ou via curl
curl -O https://exemplo.com/database.sql.gz

# Descompactar se necessário
gunzip database.sql.gz
```

## 🔄 Passo 5: Importar Banco de Dados

### Para MySQL/MariaDB:

```bash
# Verificar espaço em disco
df -h

# Verificar tamanho do arquivo
ls -lh ~/import/database.sql

# Importar banco de dados
mysql -u [usuario_db] -p[senha_db] [nome_database] < ~/import/database.sql

# Ou com visualização de progresso (usando pv se disponível)
pv ~/import/database.sql | mysql -u [usuario_db] -p[senha_db] [nome_database]

# Para arquivos grandes, importar com log
mysql -u [usuario_db] -p[senha_db] [nome_database] < ~/import/database.sql 2>&1 | tee ~/import/import.log
```

### Para PostgreSQL:

```bash
# Importar PostgreSQL
psql -U [usuario_db] -d [nome_database] -f ~/import/database.sql

# Ou para arquivos .dump
pg_restore -U [usuario_db] -d [nome_database] ~/import/database.dump

# Com log
psql -U [usuario_db] -d [nome_database] -f ~/import/database.sql 2>&1 | tee ~/import/import.log
```

## ✅ Passo 6: Validação Pós-Importação

```bash
# MySQL - Verificar tabelas
mysql -u [usuario_db] -p[senha_db] [nome_database] -e "SHOW TABLES;"

# MySQL - Contar registros
mysql -u [usuario_db] -p[senha_db] [nome_database] -e "SELECT COUNT(*) FROM [tabela_principal];"

# PostgreSQL - Verificar tabelas
psql -U [usuario_db] -d [nome_database] -c "\dt"

# PostgreSQL - Contar registros
psql -U [usuario_db] -d [nome_database] -c "SELECT COUNT(*) FROM [tabela_principal];"
```

## 🧹 Passo 7: Limpeza (Opcional)

```bash
# Remover arquivo de importação (após validação)
rm ~/import/database.sql

# Manter backup por segurança
ls -lh ~/backups/
```

## ⚠️ Troubleshooting

### Erro: "Access denied for user"
```bash
# Verificar credenciais no arquivo de configuração
cat ~/public_html/wp-config.php | grep DB_
# ou
cat ~/public_html/.env | grep DB_
```

### Erro: "Disk quota exceeded"
```bash
# Verificar uso de disco
du -sh ~/
quota -s

# Limpar arquivos temporários
rm -rf ~/tmp/*
find ~/public_html/wp-content/cache -type f -delete
```

### Erro: "MySQL server has gone away"
```bash
# Para arquivos grandes, importar em partes ou ajustar timeout
mysql --max_allowed_packet=512M -u [usuario_db] -p[senha_db] [nome_database] < ~/import/database.sql
```

## 📊 Comandos Úteis de Diagnóstico

```bash
# Verificar processos MySQL
ps aux | grep mysql

# Verificar logs MySQL
tail -f /var/log/mysql/error.log

# Verificar conexões ativas
mysql -u [usuario_db] -p[senha_db] -e "SHOW PROCESSLIST;"

# Verificar tamanho de cada banco
mysql -u [usuario_db] -p[senha_db] -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables GROUP BY table_schema;"
```

## 🔒 Segurança

- ✅ Sempre fazer backup antes de importar
- ✅ Testar em ambiente de staging primeiro
- ✅ Verificar compatibilidade de versões
- ✅ Remover arquivos sensíveis após importação
- ✅ Revisar logs de importação
- ✅ Validar integridade dos dados

## 📝 Checklist de Importação

- [ ] Backup do banco atual realizado
- [ ] Espaço em disco verificado
- [ ] Arquivo de importação transferido
- [ ] Credenciais do banco validadas
- [ ] Importação executada sem erros
- [ ] Tabelas e registros validados
- [ ] Aplicação testada e funcionando
- [ ] Arquivos temporários removidos
- [ ] Backup mantido em local seguro

---

**⚠️ AVISO DE SEGURANÇA:**
Este documento contém referências a credenciais. Não commitar com senhas reais!
