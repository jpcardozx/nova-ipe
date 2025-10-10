# ✅ VALIDAÇÃO COMPLETA - Migração WordPress

**Data:** 7 de outubro de 2025, 21:00
**Status:** ✅ TODAS AS CREDENCIAIS VALIDADAS E TESTADAS

---

## 🎯 RESUMO EXECUTIVO

**Tudo está funcionando e pronto para migrar!**

Validei **100% das credenciais** conectando diretamente nos servidores:
- ✅ SSH no servidor Locaweb: **CONECTADO**
- ✅ MySQL no DBaaS: **CONECTADO**
- ✅ WordPress: **ACESSÍVEL**
- ✅ Estrutura de diretórios: **MAPEADA**

---

## 📋 CREDENCIAIS VALIDADAS

### 1️⃣ SSH - Servidor Locaweb

```bash
Host: ftp.imobiliariaipe1.hospedagemdesites.ws  # ✅ URL alternativa (melhor)
IP: 187.45.193.173
User: imobiliariaipe1
Pass: Ipe@10203040Ipe  # ✅ VALIDADO EM 07/10/2025 21:00
Port: 22
```

**Path real do WordPress:**
```
/home/storage/e/4f/a6/imobiliariaipe1/public_html
```

**Teste realizado:**
```bash
sshpass -p 'Ipe@10203040Ipe' ssh -p 22 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws 'pwd'
```

**Resultado:** ✅ Conectado com sucesso
```
/home/storage/e/4f/a6/imobiliariaipe1
```

---

### 2️⃣ MySQL - Database as a Service (DBaaS)

```bash
Host: wp_imobiliaria.mysql.dbaas.com.br
User: wp_imobiliaria
Pass: Locaweb@102030  # ✅ VALIDADO (do wp-config.php)
Database: wp_imobiliaria
Version: MySQL 5.7.32-35-log
```

**Teste realizado:**
```bash
# Via SSH no servidor (MySQL bloqueia conexões externas)
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
  -u wp_imobiliaria \
  -p'Locaweb@102030' \
  -e "SELECT VERSION(); SHOW DATABASES;"
```

**Resultado:** ✅ Conectado com sucesso
```
VERSION()
5.7.32-35-log

Database
information_schema
wp_imobiliaria
```

---

### 3️⃣ WordPress - Configuração Atual

**URLs no banco de dados:**
```sql
siteurl: https://portal.imobiliariaipe.com.br
home:    https://portal.imobiliariaipe.com.br
```

✅ **JÁ ESTÁ USANDO HTTPS!** Não precisa fazer search-replace de http→https.

**wp-config.php validado:**
```php
define('DB_NAME', 'wp_imobiliaria');
define('DB_USER', 'wp_imobiliaria');
define('DB_PASSWORD', 'Locaweb@102030');  // ✅ CORRETO
define('DB_HOST', 'wp_imobiliaria.mysql.dbaas.com.br');
define('DB_CHARSET', 'utf8');
```

---

### 4️⃣ Estrutura de Diretórios

**wp-content/uploads:**
```
2016/ (8 pastas)
2017/ (14 pastas)
2018/ (14 pastas)
2019/ (14 pastas)
2020/ (14 pastas)
2021/ (14 pastas)
2022/ (14 pastas)
2023/ (14 pastas)
2024/ (14 pastas)
2025/ (12 pastas) - até outubro
WPL/ (765 pastas) - plugin de imóveis
```

**Observação:** O diretório de uploads tem **MUITOS arquivos**. Por isso usamos tar.gz (compacta tudo em um arquivo).

---

## 🔧 O QUE FOI CORRIGIDO NOS SCRIPTS

### Antes (credenciais erradas):
```bash
OLD_SSH_HOST="187.45.193.173"  # ❌ IP direto (menos confiável)
OLD_SSH_PASS="IpeImoveis@46932380"  # ❌ SENHA ERRADA
OLD_SITE_PATH="/home/imobiliariaipe1/public_html"  # ❌ PATH ERRADO
OLD_DB_PASS="Ipe@5084"  # ❌ SENHA ERRADA
OLD_URL="http://portal.imobiliariaipe.com.br"  # ❌ Já está HTTPS
```

### Depois (credenciais validadas):
```bash
OLD_SSH_HOST="ftp.imobiliariaipe1.hospedagemdesites.ws"  # ✅ URL alternativa
OLD_SSH_PASS="Ipe@10203040Ipe"  # ✅ VALIDADO
OLD_SITE_PATH="/home/storage/e/4f/a6/imobiliariaipe1/public_html"  # ✅ VALIDADO
OLD_DB_PASS="Locaweb@102030"  # ✅ VALIDADO
OLD_URL="https://portal.imobiliariaipe.com.br"  # ✅ CORRETO
```

---

## 🚀 PRÓXIMOS PASSOS

**Agora você tem 2 opções:**

### Opção 1: Script Automatizado (Recomendado)

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-locaweb-to-lightsail.sh
```

O script vai:
1. Testar SSH ✅
2. Fazer backup no servidor antigo (tar.gz + SQL dump)
3. Transferir para sua máquina
4. Te guiar para enviar ao Lightsail
5. Fornecer comandos prontos para restaurar

---

### Opção 2: Comandos Manuais

Consulte: `docs/MIGRATION_READY_TO_RUN.md`

Todos os comandos estão prontos com as credenciais **corretas e validadas**.

---

## ⚠️ ATENÇÃO: DIFERENÇA DE URLS

**DESCOBERTA IMPORTANTE:**

O banco de dados **JÁ ESTÁ** usando `https://portal.imobiliariaipe.com.br`.

Portanto, **NÃO PRECISA** fazer `wp search-replace` de http→https.

**Apenas certifique-se** que no Lightsail:
1. SSL está configurado (Let's Encrypt / ACM)
2. wp-config.php tem as mesmas URLs
3. `.htaccess` força HTTPS (se necessário)

---

## 📊 INFORMAÇÕES TÉCNICAS

### Servidor Antigo (Locaweb)
- **OS:** Linux (hostname: hm2662)
- **PHP:** 5.3.x (legado)
- **MySQL:** 5.7.32-35-log (DBaaS remoto)
- **WordPress:** (versão a verificar)
- **Tema/Plugin:** WPL (plugin de imóveis com 765 pastas)

### Servidor Novo (Lightsail)
- **OS:** Ubuntu/Debian (Bitnami)
- **PHP:** 8.2.x
- **MySQL:** 8.0 ou MariaDB 10.x (local)
- **WordPress:** (mesma versão após migração)

---

## 🧪 TESTES REALIZADOS

### Teste 1: SSH
```bash
✅ Conectado em ftp.imobiliariaipe1.hospedagemdesites.ws
✅ Listou diretórios com sucesso
✅ Executou comandos remotos
```

### Teste 2: MySQL
```bash
✅ Conectado no DBaaS remoto
✅ Listou databases: wp_imobiliaria
✅ Verificou versão: 5.7.32-35-log
```

### Teste 3: WordPress
```bash
✅ Localizou wp-config.php
✅ Validou credenciais do banco
✅ Confirmou URLs no banco (já HTTPS)
✅ Mapeou estrutura de uploads (2016-2025 + WPL)
```

---

## 📝 CHECKLIST PRÉ-MIGRAÇÃO

- [x] SSH testado e funcionando
- [x] MySQL testado e funcionando
- [x] Credenciais documentadas corretamente
- [x] Path do WordPress validado
- [x] URLs do banco verificadas
- [x] Estrutura de uploads mapeada
- [x] Scripts atualizados com credenciais corretas
- [x] Documentação completa criada
- [ ] **Provisionar Lightsail** (próximo passo)
- [ ] **Executar migração** (após provisionar)

---

## 🎯 PARA COMEÇAR A MIGRAÇÃO

1. **Provisione o Lightsail:**
   - Escolha a imagem "WordPress Certified by Bitnami"
   - Tamanho: mínimo 2 GB RAM (recomendado 4 GB)
   - Habilite IP estático
   - Configure firewall: portas 80, 443, 22

2. **Anote as credenciais do Lightsail:**
   - IP público
   - Senha root do MySQL
   - Chave SSH (se aplicável)

3. **Execute o script:**
   ```bash
   ./scripts/migration-locaweb-to-lightsail.sh
   ```

4. **Siga os passos do script** (ele te guia passo a passo)

---

## 📞 SUPORTE

Se algo não funcionar:

1. **Verifique** se as credenciais não mudaram
2. **Teste** SSH manualmente primeiro
3. **Confira** os logs de erro
4. **Me envie** a mensagem de erro exata

---

**Última atualização:** 7 de outubro de 2025, 21:00
**Validado por:** Claude Code
**Status:** ✅ PRONTO PARA MIGRAÇÃO

🎉 **Tudo validado e pronto para ir!**
