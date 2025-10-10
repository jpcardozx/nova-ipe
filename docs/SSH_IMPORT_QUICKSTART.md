# 🚀 Quick Start: Importação de DB via SSH

## 🎯 Método Rápido com Script Helper

```bash
# 1. Testar conexão
./scripts/db-import-helper.sh test

# 2. Verificar banco de dados instalado
./scripts/db-import-helper.sh check-db

# 3. Fazer backup do banco atual
./scripts/db-import-helper.sh backup

# 4. Upload do arquivo SQL
./scripts/db-import-helper.sh upload

# 5. Importar banco de dados
./scripts/db-import-helper.sh import

# 6. Validar importação
./scripts/db-import-helper.sh validate

# 7. Limpar arquivos temporários
./scripts/db-import-helper.sh cleanup
```

## 🔧 Método Manual Direto

### Passo 1: Conectar ao Servidor
```bash
ssh -p 22 imobiliariaipe1@187.45.193.173
# Senha será solicitada
```

### Passo 2: Verificar Configuração do Banco
```bash
# Encontrar arquivo de configuração (WordPress)
cat ~/public_html/wp-config.php | grep DB_

# Ou para outros sistemas
find ~/public_html -name ".env" -o -name "config.php" | head -5
```

### Passo 3: Fazer Backup (SEMPRE!)
```bash
# Criar diretório de backup
mkdir -p ~/backups/$(date +%Y%m%d)

# Backup MySQL (substitua os valores)
mysqldump -u [USUARIO] -p[SENHA] [BANCO] | gzip > ~/backups/$(date +%Y%m%d)/backup_$(date +%H%M%S).sql.gz
```

### Passo 4: Upload do Arquivo SQL
```bash
# Em outro terminal (no seu computador local)
scp -P 22 /caminho/arquivo.sql imobiliariaipe1@187.45.193.173:~/import/
```

### Passo 5: Importar
```bash
# No servidor SSH
mysql -u [USUARIO] -p[SENHA] [BANCO] < ~/import/arquivo.sql

# Ou se for .gz
gunzip -c ~/import/arquivo.sql.gz | mysql -u [USUARIO] -p[SENHA] [BANCO]
```

### Passo 6: Validar
```bash
# Verificar tabelas
mysql -u [USUARIO] -p[SENHA] [BANCO] -e "SHOW TABLES;"

# Contar registros
mysql -u [USUARIO] -p[SENHA] [BANCO] -e "SELECT COUNT(*) FROM wp_posts;"
```

## 🔐 Informações do Servidor

```
Host: 187.45.193.173
Porta: 22
Usuário: imobiliariaipe1
Domínio: ftp.imobiliariaipe.com.br
```

## ⚠️ Checklist Antes de Importar

- [ ] ✅ Backup do banco atual feito
- [ ] ✅ Espaço em disco verificado (`df -h`)
- [ ] ✅ Credenciais do banco confirmadas
- [ ] ✅ Arquivo SQL validado localmente
- [ ] ✅ Site em manutenção (opcional, mas recomendado)

## 🆘 Troubleshooting Rápido

### Erro: "Access denied"
```bash
# Verificar credenciais corretas
cat ~/public_html/wp-config.php | grep DB_
```

### Erro: "Disk quota exceeded"
```bash
# Verificar espaço
df -h ~/
quota -s

# Limpar cache
rm -rf ~/public_html/wp-content/cache/*
```

### Erro: "MySQL server has gone away"
```bash
# Arquivo muito grande, use:
mysql --max_allowed_packet=512M -u [USUARIO] -p [BANCO] < arquivo.sql
```

## 📚 Documentação Completa

Para guia detalhado com todos os cenários: `docs/DATABASE_IMPORT_SSH_GUIDE.md`

## 🔒 Segurança

- **NUNCA** commite arquivos .sql no Git
- **SEMPRE** faça backup antes de importar
- **SEMPRE** teste em staging primeiro
- Remova arquivos temporários após importação

---

**Última atualização:** 6 de outubro de 2025
