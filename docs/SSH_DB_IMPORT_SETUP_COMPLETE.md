# 🎯 Setup Completo: Importação de DB via SSH

**Status:** ✅ Scripts criados e prontos para uso  
**Data:** 6 de outubro de 2025

## 📦 Arquivos Criados

1. **`docs/DATABASE_IMPORT_SSH_GUIDE.md`** - Guia completo detalhado
2. **`docs/SSH_IMPORT_QUICKSTART.md`** - Quick start reference
3. **`scripts/db-import-helper.sh`** - Script automatizado para importação

## 🚀 Como Usar

### Opção 1: Usar o Script Helper (Recomendado)

```bash
# 1. Testar conexão
./scripts/db-import-helper.sh test

# 2. Verificar configuração do banco
./scripts/db-import-helper.sh check-db

# 3. Fazer backup
./scripts/db-import-helper.sh backup

# 4. Upload do arquivo
./scripts/db-import-helper.sh upload

# 5. Importar
./scripts/db-import-helper.sh import

# 6. Validar
./scripts/db-import-helper.sh validate

# 7. Limpar
./scripts/db-import-helper.sh cleanup
```

### Opção 2: Conectar Manualmente

```bash
# Conectar ao servidor
ssh -p 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa imobiliariaipe1@187.45.193.173

# Senha: [fornecida anteriormente]
```

## 🔧 Configuração do Servidor

```
Host: 187.45.193.173
Porta: 22
Usuário: imobiliariaipe1
Domínio: ftp.imobiliariaipe.com.br

Observação: O servidor usa ssh-rsa (algoritmo antigo)
Por isso precisamos usar as opções:
  -o HostKeyAlgorithms=+ssh-rsa
  -o PubkeyAcceptedKeyTypes=+ssh-rsa
```

## 📋 Workflow Completo de Importação

### Passo 1: Preparação Local
```bash
# Verificar arquivo SQL
ls -lh /caminho/para/database.sql

# (Opcional) Comprimir para transfer rápida
gzip database.sql
# Resultado: database.sql.gz
```

### Passo 2: Conectar e Verificar
```bash
# Conectar ao servidor
./scripts/db-import-helper.sh connect

# Uma vez conectado:
# Verificar espaço em disco
df -h ~/

# Verificar MySQL
mysql --version

# Localizar config do WordPress (se aplicável)
cat ~/public_html/wp-config.php | grep DB_
```

### Passo 3: Backup do Banco Atual
```bash
# Criar diretório de backup
mkdir -p ~/backups/$(date +%Y%m%d)

# Fazer backup (substitua [USUARIO], [SENHA], [BANCO])
mysqldump -u [USUARIO] -p[SENHA] [BANCO] | gzip > ~/backups/$(date +%Y%m%d)/backup_before_import.sql.gz

# Verificar backup criado
ls -lh ~/backups/$(date +%Y%m%d)/
```

### Passo 4: Upload do Arquivo
```bash
# Em terminal LOCAL (não no SSH)
scp -P 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  /caminho/local/database.sql.gz \
  imobiliariaipe1@187.45.193.173:~/import/

# Verificar upload (voltar ao SSH)
ls -lh ~/import/
```

### Passo 5: Importar Banco
```bash
# Se arquivo for .gz
gunzip -c ~/import/database.sql.gz | mysql -u [USUARIO] -p[SENHA] [BANCO]

# Se arquivo for .sql normal
mysql -u [USUARIO] -p[SENHA] [BANCO] < ~/import/database.sql

# Com log de importação
mysql -u [USUARIO] -p[SENHA] [BANCO] < ~/import/database.sql 2>&1 | tee ~/import/import.log
```

### Passo 6: Validar Importação
```bash
# Verificar tabelas
mysql -u [USUARIO] -p[SENHA] [BANCO] -e "SHOW TABLES;"

# Contar registros (exemplo: WordPress)
mysql -u [USUARIO] -p[SENHA] [BANCO] -e "SELECT COUNT(*) FROM wp_posts;"

# Verificar tamanho das tabelas
mysql -u [USUARIO] -p[SENHA] [BANCO] -e "
SELECT 
  table_name AS 'Table', 
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)' 
FROM information_schema.tables 
WHERE table_schema = '[BANCO]' 
ORDER BY (data_length + index_length) DESC 
LIMIT 10;
"
```

### Passo 7: Limpeza
```bash
# Remover arquivo de importação (após validação)
rm ~/import/database.sql
rm ~/import/database.sql.gz

# Verificar backup está preservado
ls -lh ~/backups/
```

## 🔍 Encontrar Credenciais do Banco

### WordPress:
```bash
# Conectar ao servidor
ssh -p 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa imobiliariaipe1@187.45.193.173

# Ver credenciais
cat ~/public_html/wp-config.php | grep "DB_"

# Output esperado:
# define('DB_NAME', 'nome_do_banco');
# define('DB_USER', 'usuario');
# define('DB_PASSWORD', 'senha');
# define('DB_HOST', 'localhost');
```

### Outros Sistemas:
```bash
# Procurar arquivos de configuração
find ~/public_html -name ".env" -o -name "config.php" -o -name "database.php" | head -10

# Verificar conteúdo
cat ~/public_html/.env
```

## ⚠️ Troubleshooting

### Erro: "Access denied for user"
**Solução:** Verificar credenciais corretas no arquivo de configuração

### Erro: "Disk quota exceeded"
**Solução:** Limpar cache e arquivos temporários
```bash
df -h ~/
rm -rf ~/public_html/wp-content/cache/*
rm -rf ~/tmp/*
```

### Erro: "MySQL server has gone away"
**Solução:** Arquivo muito grande, aumentar limite
```bash
mysql --max_allowed_packet=512M -u [USUARIO] -p[SENHA] [BANCO] < arquivo.sql
```

### Erro: "Can't create/write to file"
**Solução:** Problema de permissões ou espaço
```bash
# Verificar permissões
ls -la ~/import/

# Corrigir se necessário
chmod 755 ~/import/
```

## 🔒 Segurança e Boas Práticas

✅ **Sempre fazer backup antes de importar**
✅ **Nunca commitar arquivos .sql no Git**
✅ **Testar em ambiente de staging primeiro**
✅ **Validar dados após importação**
✅ **Remover arquivos temporários após uso**
✅ **Manter backups em local seguro**
✅ **Documentar alterações realizadas**

## 📊 Comandos Úteis de Diagnóstico

```bash
# Ver tamanho total de cada banco
mysql -u [USUARIO] -p[SENHA] -e "
SELECT 
  table_schema AS 'Database', 
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' 
FROM information_schema.tables 
GROUP BY table_schema;
"

# Ver processos MySQL ativos
mysql -u [USUARIO] -p[SENHA] -e "SHOW PROCESSLIST;"

# Ver status do MySQL
mysql -u [USUARIO] -p[SENHA] -e "SHOW STATUS LIKE '%thread%';"

# Ver variáveis importantes
mysql -u [USUARIO] -p[SENHA] -e "SHOW VARIABLES LIKE 'max_allowed_packet';"
```

## 📚 Documentação Adicional

- **Guia Completo:** `docs/DATABASE_IMPORT_SSH_GUIDE.md`
- **Quick Reference:** `docs/SSH_IMPORT_QUICKSTART.md`
- **Script Helper:** `scripts/db-import-helper.sh --help`

## 🎯 Próximos Passos

1. Conectar ao servidor: `./scripts/db-import-helper.sh test`
2. Identificar credenciais do banco
3. Fazer backup do banco atual
4. Preparar arquivo SQL para importação
5. Seguir workflow acima

## ✅ Checklist Final

- [ ] SSH conectado com sucesso
- [ ] Credenciais do banco identificadas
- [ ] Backup do banco atual criado
- [ ] Arquivo SQL preparado
- [ ] Espaço em disco verificado
- [ ] Importação executada
- [ ] Dados validados
- [ ] Site testado e funcionando
- [ ] Arquivos temporários removidos
- [ ] Documentação atualizada

---

**Nota:** Os scripts criados já incluem as opções necessárias para compatibilidade com ssh-rsa.

**Última atualização:** 6 de outubro de 2025
