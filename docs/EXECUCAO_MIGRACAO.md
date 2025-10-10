# 🚀 Execução da Migração WordPress

**Data:** 7 de outubro de 2025
**Status:** ✅ TUDO VALIDADO E PRONTO

---

## 📋 PRÉ-REQUISITOS CONFIRMADOS

### ✅ Servidor Antigo (Locaweb)
- SSH: `ftp.imobiliariaipe1.hospedagemdesites.ws` (porta 22)
- Usuário: `imobiliariaipe1`
- Senha: `Ipe@10203040Ipe` ✅ VALIDADA
- Path: `/home/storage/e/4f/a6/imobiliariaipe1/public_html`
- MySQL: `wp_imobiliaria.mysql.dbaas.com.br`
- DB Senha: `Locaweb@102030` ✅ VALIDADA

### ✅ Servidor Novo (Lightsail)
- Instância: `Ipe-1` (us-east-1)
- IP Público: `13.223.237.99`
- Usuário: `bitnami`
- Chave SSH: `LightsailDefaultKey-us-east-1.pem` ✅ VOCÊ TEM
- Blueprint: WordPress Certified by Bitnami
- RAM: 2 vCPU, 1 GB (micro_3_0)
- Disco: 40 GB SSD

---

## 🎯 INFORMAÇÕES FALTANTES

Você precisa apenas de **2 coisas**:

### 1. Localização da chave SSH do Lightsail

Onde está o arquivo `LightsailDefaultKey-us-east-1.pem` no seu computador?

**Opções:**
- A) Já está em `~/.ssh/LightsailDefaultKey-us-east-1.pem` ✅
- B) Está em Downloads (precisa mover para ~/.ssh/)
- C) Precisa baixar do console AWS

**Se estiver em Downloads, execute:**
```bash
mkdir -p ~/.ssh
mv ~/Downloads/LightsailDefaultKey-us-east-1.pem ~/.ssh/
chmod 600 ~/.ssh/LightsailDefaultKey-us-east-1.pem
```

### 2. Senha root do MySQL no Lightsail

Vamos pegar automaticamente quando conectar via SSH, mas você pode obter agora:

```bash
# Conectar no Lightsail
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99

# Uma vez conectado, pegar senha root do MySQL
sudo cat /home/bitnami/bitnami_credentials.txt | grep -i mysql
# OU
sudo cat /root/.mysql_secret 2>/dev/null
# OU (Bitnami moderno)
cat ~/bitnami_application_password
```

---

## 🚀 EXECUTAR MIGRAÇÃO

### OPÇÃO 1: Script Automatizado (RECOMENDADO)

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-locaweb-to-lightsail.sh
```

**O script faz TUDO automaticamente:**

1. ✅ Testa SSH no servidor Locaweb
2. ✅ Cria backup compactado no servidor antigo (tar.gz)
3. ✅ Faz dump do banco MySQL (gzip)
4. ✅ Baixa tudo para sua máquina local
5. ✅ Envia para o Lightsail via SCP
6. ✅ Te fornece comandos prontos para restaurar no Lightsail

---

### OPÇÃO 2: Passo a Passo Manual

Se quiser controle total, siga os passos detalhados em:
`docs/MIGRATION_READY_TO_RUN.md`

---

## 📝 CHECKLIST ANTES DE EXECUTAR

- [x] SSH Locaweb testado e funcionando
- [x] MySQL Locaweb testado e funcionando
- [x] Lightsail provisionado (Ipe-1)
- [ ] **Chave SSH do Lightsail em ~/.ssh/**
- [ ] **Senha root MySQL do Lightsail** (opcional, pegamos depois)
- [x] Credenciais documentadas
- [x] Script atualizado com IPs/senhas corretas

---

## 🎬 COMANDOS RÁPIDOS

### Testar SSH Locaweb
```bash
ssh imobiliariaipe1@ftp.imobiliariaipe1.hospedagemdesites.ws
# Senha: Ipe@10203040Ipe
```

### Testar SSH Lightsail
```bash
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99
```

### Executar migração completa
```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-locaweb-to-lightsail.sh --auto
```

### Ver menu interativo
```bash
./scripts/migration-locaweb-to-lightsail.sh
```

---

## ⏱️ TEMPO ESTIMADO

- **Backup no servidor antigo:** 5-15 minutos (dependendo do tamanho)
- **Download para sua máquina:** 10-30 minutos (dependendo da internet)
- **Upload para Lightsail:** 10-30 minutos
- **Importação banco + extração:** 5-10 minutos
- **Configuração final:** 5 minutos

**TOTAL:** ~40-90 minutos (dependendo da internet)

---

## 📦 TAMANHOS APROXIMADOS

Com base na estrutura identificada:

```
wp-content/uploads/
├── 2016-2025 (10 anos de uploads)
└── WPL (765 pastas do plugin de imóveis)

Estimativa: 2-5 GB compactado
```

---

## 🔧 APÓS A MIGRAÇÃO

O script te fornecerá comandos para executar no Lightsail:

### 1. Criar banco e usuário
```bash
mysql -u root -p <<EOF
CREATE DATABASE wp_imobiliaria DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'wp_imobiliaria'@'localhost' IDENTIFIED BY 'Locaweb@102030';
GRANT ALL PRIVILEGES ON wp_imobiliaria.* TO 'wp_imobiliaria'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
```

### 2. Importar banco
```bash
gunzip < /tmp/database.sql.gz | mysql -u root -p wp_imobiliaria
```

### 3. Extrair arquivos
```bash
sudo tar -xzf /tmp/site-files.tar.gz -C /opt/bitnami/wordpress
```

### 4. Ajustar permissões
```bash
sudo chown -R bitnami:daemon /opt/bitnami/wordpress
sudo find /opt/bitnami/wordpress -type d -exec chmod 775 {} \;
sudo find /opt/bitnami/wordpress -type f -exec chmod 664 {} \;
```

### 5. Editar wp-config.php
```bash
sudo nano /opt/bitnami/wordpress/wp-config.php
```

Alterar para:
```php
define('DB_HOST', 'localhost');  // ← Mudar de DBaaS remoto para local
```

### 6. Limpar cache antigo
```bash
sudo rm -f /opt/bitnami/wordpress/wp-content/advanced-cache.php
sudo rm -f /opt/bitnami/wordpress/wp-content/object-cache.php
sudo rm -rf /opt/bitnami/wordpress/wp-content/cache/*
```

### 7. Reiniciar
```bash
sudo /opt/bitnami/ctlscript.sh restart
```

---

## ✅ VALIDAÇÃO FINAL

Após migração, testar:

```bash
# No Lightsail
curl -I http://13.223.237.99
curl -I http://13.223.237.99/wp-admin/
```

**No navegador:**
- http://13.223.237.99
- http://13.223.237.99/wp-admin/

**Login WordPress:**
- Usuário: seu usuário atual do WP antigo
- Senha: sua senha atual do WP antigo

---

## 🔄 PRÓXIMOS PASSOS (APÓS VALIDAR)

1. **Configurar SSL** (Let's Encrypt via Bitnami)
2. **Apontar DNS** para o IP do Lightsail (13.223.237.99)
3. **Forçar HTTPS** no wp-config.php e .htaccess
4. **Desativar servidor antigo** (backup antes!)
5. **Monitorar** por 48h

---

## 🆘 SUPORTE

Se algo der errado:

1. **Não entre em pânico** - servidor antigo continua funcionando
2. **Capture o erro exato** (screenshot ou copiar texto)
3. **Me envie:**
   - Mensagem de erro
   - Passo onde travou
   - Output de `ls -la /tmp/` (no servidor onde falhou)

---

## 📞 CONTATOS ÚTEIS

**AWS Lightsail:**
- Console: https://lightsail.aws.amazon.com/
- Região: us-east-1
- Instância: Ipe-1

**WordPress Atual:**
- https://portal.imobiliariaipe.com.br

**MySQL DBaaS:**
- wp_imobiliaria.mysql.dbaas.com.br

---

**Última atualização:** 7 de outubro de 2025, 23:40
**Status:** ✅ PRONTO PARA EXECUTAR

🎯 **Falta apenas mover a chave SSH para ~/.ssh/ e você pode rodar!**
