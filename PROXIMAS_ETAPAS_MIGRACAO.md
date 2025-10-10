# 🗺️ PRÓXIMAS ETAPAS DA MIGRAÇÃO - ROADMAP COMPLETO

**Data:** 8 de outubro de 2025  
**Status Atual:** ✅ Site migrado e funcionando no IP temporário  
**Objetivo:** Site em produção com domínio e SSL

---

## 📊 STATUS ATUAL

### ✅ COMPLETO (100%)
- ✅ Migração de arquivos (4.6GB)
- ✅ Database importado (50 tabelas, 761 imóveis)
- ✅ Plugins instalados e ativos
- ✅ Tema ipeimoveis funcionando
- ✅ Cache limpo
- ✅ Site acessível via IP: http://13.223.237.99

### ⏳ PENDENTE
- ⏳ Configuração de DNS
- ⏳ Instalação de SSL/HTTPS
- ⏳ Testes de funcionalidades
- ⏳ Otimizações de performance
- ⏳ Backup automatizado
- ⏳ Migração final de DNS (cutover)

---

## 🎯 ETAPAS DETALHADAS

---

## ETAPA 1: TESTES FUNCIONAIS (URGENTE - HOJE)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 30-60 minutos  
**Status:** ⏳ PENDENTE

### 1.1. Testar Área Administrativa
```bash
# Acesso
URL: http://13.223.237.99/wp-admin
User: jpcardozo
Pass: Ipe@10203040
```

**Checklist:**
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Páginas são editáveis
- [ ] Mídia (uploads) aparecem
- [ ] Plugins estão ativos
- [ ] Configurações acessíveis

### 1.2. Testar Funcionalidades WPL (Imóveis)
```bash
URL: http://13.223.237.99/
```

**Checklist:**
- [ ] Listagem de imóveis aparece
- [ ] Filtros de busca funcionam
- [ ] Detalhes do imóvel abrem
- [ ] Fotos dos imóveis carregam
- [ ] Mapas aparecem (se tiver)
- [ ] Formulários de contato funcionam

### 1.3. Testar Páginas Estáticas
**Checklist:**
- [ ] Home carrega corretamente
- [ ] Página "Sobre" funciona
- [ ] Página "Contato" funciona
- [ ] Menu de navegação OK
- [ ] Footer aparece correto

### 1.4. Testar Performance
```bash
# Tempo de resposta
curl -w "@-" -o /dev/null -s http://13.223.237.99/ <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

**Expectativa:** < 2 segundos para carregar

---

## ETAPA 2: CONFIGURAÇÃO DE DNS (CRÍTICO)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 2-24 horas (propagação DNS)  
**Status:** ⏳ PENDENTE

### Opção A: CloudFlare (RECOMENDADO ⭐)

#### Vantagens:
- ✅ CDN grátis (acelera site)
- ✅ DDoS protection
- ✅ SSL/TLS automático
- ✅ Cache inteligente
- ✅ Analytics grátis
- ✅ Gerenciamento fácil

#### Passos:

**2.1. Criar conta CloudFlare**
```
1. Acesse: https://dash.cloudflare.com/sign-up
2. Crie conta com email: contato@imobiliariaipe.com.br
3. Confirme email
```

**2.2. Adicionar domínio**
```
1. Dashboard → Add Site
2. Digite: imobiliariaipe.com.br
3. Escolha plano: Free (gratuito)
4. CloudFlare vai escanear DNS atual
```

**2.3. Configurar DNS no CloudFlare**
```
Tipo    Nome                            Valor               Proxy
A       @                               13.223.237.99       ✅ Proxied
A       portal                          13.223.237.99       ✅ Proxied
A       www                             13.223.237.99       ✅ Proxied
CNAME   mail                            mail.locaweb.com.br ❌ DNS only
MX      @                               [manter existente]  -
```

**2.4. Atualizar Nameservers no Registro.br**
```
1. Acesse: https://registro.br
2. Login com CPF/CNPJ
3. Domínio: imobiliariaipe.com.br
4. Alterar DNS → Usar DNS do CloudFlare
5. Nameservers (CloudFlare vai fornecer):
   - exemplo1.cloudflare.com
   - exemplo2.cloudflare.com
```

**2.5. Aguardar Propagação**
```bash
# Verificar propagação
dig @8.8.8.8 portal.imobiliariaipe.com.br
dig @1.1.1.1 portal.imobiliariaipe.com.br

# Ou usar site
https://dnschecker.org/#A/portal.imobiliariaipe.com.br
```

**Tempo:** 2-24 horas (geralmente 2-4 horas)

---

### Opção B: Registro.br (Mais Simples, Sem CDN)

#### Passos:

**2.1. Acessar Registro.br**
```
1. https://registro.br
2. Login com CPF/CNPJ
3. Meus Domínios → imobiliariaipe.com.br
```

**2.2. Configurar DNS**
```
1. Editar Zona DNS
2. Adicionar registros:

Tipo    Nome                            Valor
A       @                               13.223.237.99
A       portal                          13.223.237.99
A       www                             13.223.237.99
```

**2.3. Salvar e aguardar propagação**
```
Tempo: 2-24 horas
```

---

## ETAPA 3: ATUALIZAR URLs NO WORDPRESS
**Prioridade:** 🟡 ALTA  
**Tempo estimado:** 5 minutos  
**Status:** ⏳ PENDENTE (aguardando DNS)

### 3.1. Aguardar DNS Propagar
```bash
# Verificar se DNS aponta para Lightsail
ping portal.imobiliariaipe.com.br
# Deve retornar: 13.223.237.99
```

### 3.2. Atualizar URLs via SSH
```bash
ssh bitnami@13.223.237.99

# Fazer backup antes
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > backup-antes-urls.sql

# Atualizar URLs (SEM https ainda)
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### 3.3. Testar
```bash
curl -I http://portal.imobiliariaipe.com.br
# Deve retornar HTTP 200
```

---

## ETAPA 4: INSTALAR SSL/HTTPS (CRÍTICO)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 10 minutos  
**Status:** ⏳ PENDENTE (aguardando DNS)

### 4.1. Verificar Pré-requisitos
```bash
# DNS deve estar apontando para Lightsail
nslookup portal.imobiliariaipe.com.br
# Deve retornar 13.223.237.99
```

### 4.2. Executar Bitnami SSL Tool
```bash
ssh bitnami@13.223.237.99

sudo /opt/bitnami/bncert-tool
```

### 4.3. Seguir Wizard Interativo
```
1. Domain list: portal.imobiliariaipe.com.br,www.imobiliariaipe.com.br
2. Enable HTTP to HTTPS redirection: Yes
3. Enable non-www to www redirection: No (ou Yes, sua escolha)
4. Enable www to non-www redirection: No
5. Enter email: contato@imobiliariaipe.com.br
6. Agree to Let's Encrypt terms: Yes
7. Confirm changes: Yes
```

### 4.4. Aguardar Instalação
```
- Vai criar certificado SSL via Let's Encrypt
- Vai configurar Apache para HTTPS
- Vai configurar auto-renovação (cron job)
```

### 4.5. Testar HTTPS
```bash
curl -I https://portal.imobiliariaipe.com.br
# Deve retornar HTTP 200 com SSL
```

---

## ETAPA 5: ATUALIZAR URLs PARA HTTPS
**Prioridade:** 🟡 ALTA  
**Tempo estimado:** 5 minutos  
**Status:** ⏳ PENDENTE (após SSL)

### 5.1. Atualizar WordPress para HTTPS
```bash
ssh bitnami@13.223.237.99

# Backup antes
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > backup-antes-https.sql

# Atualizar para HTTPS
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### 5.2. Atualizar wp-config.php
```bash
sudo nano /opt/bitnami/wordpress/wp-config.php

# Adicionar antes de "That's all, stop editing!":
define('FORCE_SSL_ADMIN', true);
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

---

## ETAPA 6: OTIMIZAÇÕES (RECOMENDADO)
**Prioridade:** 🟢 MÉDIA  
**Tempo estimado:** 30 minutos  
**Status:** ⏳ PENDENTE

### 6.1. Ativar Plugin de Cache
```bash
# Se já tem W3 Total Cache instalado (mas desativado)
sudo wp plugin activate w3-total-cache --allow-root

# Ou instalar novo
sudo wp plugin install wp-super-cache --activate --allow-root
```

### 6.2. Configurar Cache (W3 Total Cache)
```
wp-admin → Performance → General Settings
- [x] Enable Page Cache
- [x] Enable Object Cache
- [x] Enable Browser Cache
- [x] Enable CDN (se usar CloudFlare)
```

### 6.3. Otimizar Database
```bash
sudo wp db optimize --allow-root
```

### 6.4. Otimizar Imagens (Opcional)
```bash
# Instalar plugin de otimização
sudo wp plugin install ewww-image-optimizer --activate --allow-root

# Rodar otimização em background
```

### 6.5. Configurar PHP OPcache
```bash
# Verificar se OPcache está ativo
php -i | grep opcache.enable
# Deve retornar: opcache.enable => On => On
```

---

## ETAPA 7: SEGURANÇA (CRÍTICO)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 20 minutos  
**Status:** ⏳ PENDENTE

### 7.1. Mudar Prefixo do Database (Já é wp_)
```bash
# Verificar prefixo atual
mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria -e "SHOW TABLES LIKE 'wp_%';"
# Prefixo wp_ é padrão, considerar mudar para algo único
```

### 7.2. Desabilitar XML-RPC (evita brute force)
```bash
# Adicionar ao .htaccess
sudo nano /opt/bitnami/wordpress/.htaccess

# Adicionar:
# Block XML-RPC
<Files xmlrpc.php>
    Order Deny,Allow
    Deny from all
</Files>
```

### 7.3. Limitar Tentativas de Login
```bash
sudo wp plugin install limit-login-attempts-reloaded --activate --allow-root
```

### 7.4. Firewall (CloudFlare já protege, mas adicionar extra)
```bash
# Instalar Wordfence
sudo wp plugin install wordfence --activate --allow-root
```

### 7.5. Ocultar Versão do WordPress
```bash
# Adicionar ao functions.php do tema
sudo nano /opt/bitnami/wordpress/wp-content/themes/ipeimoveis/functions.php

# Adicionar no final:
remove_action('wp_head', 'wp_generator');
```

### 7.6. Configurar Lightsail Firewall
```
Console Lightsail → Instância → Networking → Firewall
- HTTP (80) ✅
- HTTPS (443) ✅
- SSH (22) ✅ (apenas seu IP se possível)
```

---

## ETAPA 8: BACKUP AUTOMATIZADO (CRÍTICO)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 30 minutos  
**Status:** ⏳ PENDENTE

### 8.1. Snapshots Automáticos (Lightsail)
```
Console Lightsail → Instância → Snapshots
- Enable automatic snapshots
- Frequency: Daily
- Time: 3:00 AM (madrugada)
- Retention: 7 days
```

**Custo:** ~$0.05/GB/mês (~$0.25/mês para 5GB)

### 8.2. Backup Database Automático
```bash
# Criar script de backup
sudo nano /home/bitnami/backup-mysql.sh
```

**Conteúdo do script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/bitnami/backups"
DB_NAME="wp_imobiliaria"
DB_USER="wp_imobiliaria"
DB_PASS="Ipe@5084"

mkdir -p $BACKUP_DIR

# Backup do database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Configurar cron:**
```bash
sudo chmod +x /home/bitnami/backup-mysql.sh
crontab -e

# Adicionar:
0 3 * * * /home/bitnami/backup-mysql.sh >> /home/bitnami/backup.log 2>&1
```

### 8.3. Backup para S3 (Recomendado para segurança extra)
```bash
# Instalar AWS CLI
sudo apt-get update
sudo apt-get install awscli -y

# Configurar AWS
aws configure
# Inserir Access Key, Secret Key, Region (ap-southeast-1)

# Script de backup para S3
sudo nano /home/bitnami/backup-to-s3.sh
```

**Conteúdo:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
TEMP_DIR="/tmp/wp_backup_$DATE"
S3_BUCKET="s3://seu-bucket-backup"

mkdir -p $TEMP_DIR

# Backup database
mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria | gzip > $TEMP_DIR/database.sql.gz

# Backup uploads (apenas novos)
tar -czf $TEMP_DIR/uploads.tar.gz /opt/bitnami/wordpress/wp-content/uploads/

# Upload para S3
aws s3 sync $TEMP_DIR $S3_BUCKET/backups/$DATE/

# Limpar temp
rm -rf $TEMP_DIR

echo "S3 Backup completed: $DATE"
```

---

## ETAPA 9: MONITORAMENTO (RECOMENDADO)
**Prioridade:** 🟢 BAIXA  
**Tempo estimado:** 20 minutos  
**Status:** ⏳ PENDENTE

### 9.1. Uptime Monitoring
```
Opções gratuitas:
1. UptimeRobot (50 monitores grátis)
2. StatusCake (grátis)
3. Pingdom (grátis 1 monitor)
```

**Configurar:**
```
URL: https://portal.imobiliariaipe.com.br
Check interval: 5 minutos
Alert email: contato@imobiliariaipe.com.br
```

### 9.2. Google Analytics (se ainda não tiver)
```bash
# Plugin já instalado: google-universal-analytics
# Apenas configurar no wp-admin
```

### 9.3. Google Search Console
```
1. https://search.google.com/search-console
2. Add property: portal.imobiliariaipe.com.br
3. Verify via HTML file ou DNS
4. Submit sitemap: https://portal.imobiliariaipe.com.br/sitemap.xml
```

---

## ETAPA 10: CUTOVER FINAL (DIA D)
**Prioridade:** 🔴 CRÍTICA  
**Tempo estimado:** 1 hora + monitoramento  
**Status:** ⏳ PENDENTE

### 10.1. Checklist Pré-Cutover
```
- [ ] Todos testes funcionais OK
- [ ] DNS configurado e propagado
- [ ] SSL instalado e funcionando
- [ ] Backups automáticos ativos
- [ ] Monitoramento configurado
- [ ] Email de teste enviado
- [ ] Performance OK (< 2s)
```

### 10.2. Janela de Manutenção
```
Recomendação: Fazer em horário de baixo tráfego
- Madrugada (2-5 AM) ou
- Domingo tarde
```

### 10.3. Durante Cutover
```bash
# 1. Último backup do servidor antigo
# 2. Atualizar DNS final (se ainda não fez)
# 3. Monitorar logs
sudo tail -f /opt/bitnami/apache/logs/access_log
sudo tail -f /opt/bitnami/apache/logs/error_log

# 4. Monitorar erro 500/404
curl -I https://portal.imobiliariaipe.com.br
```

### 10.4. Pós-Cutover (Primeiras 24h)
```
- [ ] Verificar site a cada 1 hora
- [ ] Monitorar uptime
- [ ] Verificar emails funcionando
- [ ] Testar formulários
- [ ] Verificar analytics
- [ ] Manter servidor antigo por 7 dias (backup)
```

---

## ETAPA 11: DESCOMISSIONAMENTO SERVIDOR ANTIGO
**Prioridade:** 🟢 BAIXA  
**Tempo estimado:** 30 minutos  
**Status:** ⏳ PENDENTE (aguardar 7-30 dias)

### 11.1. Aguardar Período de Estabilização
```
Recomendação: Manter servidor antigo por:
- Mínimo: 7 dias
- Ideal: 30 dias
- Backup: 90 dias
```

### 11.2. Backup Final do Servidor Antigo
```bash
# Conectar no servidor antigo
ssh usuario@ftp.imobiliariaipe1.hospedagemdesites.ws

# Fazer backup completo
tar -czf backup_final_locaweb_$(date +%Y%m%d).tar.gz /home/usuario/public_html/

# Baixar para seu PC
scp usuario@servidor:/caminho/backup_final_locaweb_*.tar.gz ~/backups/
```

### 11.3. Cancelar Hospedagem Locaweb
```
1. Abrir ticket solicitando cancelamento
2. Confirmar data de corte
3. Confirmar reembolso proporcional (se aplicável)
```

---

## 📅 CRONOGRAMA SUGERIDO

### DIA 1 (HOJE - 8 out)
- ✅ Migração completa
- ✅ Site funcionando no IP
- ⏳ Testes funcionais (FAZER HOJE)

### DIA 2 (9 out)
- ⏳ Configurar DNS (CloudFlare ou Registro.br)
- ⏳ Aguardar propagação (2-24h)

### DIA 3 (10 out)
- ⏳ Verificar DNS propagado
- ⏳ Instalar SSL
- ⏳ Atualizar URLs para HTTPS
- ⏳ Testes finais

### DIA 4 (11 out)
- ⏳ Configurar backups automáticos
- ⏳ Configurar monitoramento
- ⏳ Otimizações
- ⏳ Segurança

### DIA 5 (12 out)
- ⏳ Cutover final (se tudo OK)
- ⏳ Monitoramento intensivo

### SEMANA 2 (14-18 out)
- ⏳ Monitoramento
- ⏳ Ajustes finos
- ⏳ Performance tuning

### DIA 30+ (nov)
- ⏳ Descomissionar servidor antigo

---

## 🎯 PRIORIDADES IMEDIATAS

### HOJE (8 out) - URGENTE:
1. **Testes Funcionais** 🔴
   - Login wp-admin
   - Listar imóveis
   - Formulários
   - Performance

### AMANHÃ (9 out) - CRÍTICO:
2. **Configurar DNS** 🔴
   - CloudFlare (recomendado)
   - ou Registro.br

### DEPOIS DO DNS (10-11 out) - CRÍTICO:
3. **SSL/HTTPS** 🔴
4. **Backups** 🔴
5. **Segurança** 🔴

---

## 📋 CHECKLIST DE GO-LIVE

### Pré-Requisitos:
- [ ] Site funciona em http://13.223.237.99
- [ ] Login wp-admin OK
- [ ] Imóveis listam corretamente
- [ ] Imagens carregam
- [ ] Formulários funcionam
- [ ] Performance OK (< 2s)

### DNS & SSL:
- [ ] DNS apontando para 13.223.237.99
- [ ] DNS propagado globalmente
- [ ] SSL instalado
- [ ] HTTPS forçado
- [ ] URLs atualizadas para HTTPS

### Segurança:
- [ ] Firewall configurado
- [ ] Plugins de segurança ativos
- [ ] XML-RPC bloqueado
- [ ] Versão WordPress oculta

### Backups:
- [ ] Snapshots automáticos Lightsail
- [ ] Backup database cron job
- [ ] Backup testado (restore)

### Monitoramento:
- [ ] Uptime monitor ativo
- [ ] Google Analytics
- [ ] Search Console
- [ ] Email alerts configurados

### Go/No-Go:
- [ ] Todos itens acima: ✅
- [ ] Equipe ciente da mudança
- [ ] Janela de manutenção agendada
- [ ] Rollback plan documentado

---

## 🚨 PLANO DE ROLLBACK

### Se algo der errado após cutover:

**Opção 1: Reverter DNS (RÁPIDO - 5 min)**
```
1. CloudFlare → DNS → Mudar A record de volta para IP antigo
2. Propagação: ~5 minutos (CloudFlare)
```

**Opção 2: Reverter no Registro.br (LENTO - 2-24h)**
```
1. Registro.br → DNS → Restaurar IPs antigos
2. Propagação: 2-24 horas
```

**Opção 3: Snapshot Restore (MÉDIO - 15 min)**
```
1. Lightsail → Snapshots → Restore snapshot anterior
2. Criar nova instância do snapshot
3. Atualizar IP no DNS
```

---

## 📞 CONTATOS DE EMERGÊNCIA

### Suporte Técnico:
- **AWS Lightsail:** https://console.aws.amazon.com/support
- **CloudFlare:** https://support.cloudflare.com
- **Registro.br:** https://registro.br/suporte

### Documentação:
- **Bitnami WordPress:** https://docs.bitnami.com/aws/apps/wordpress/
- **WP-CLI:** https://wp-cli.org/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

## 🎓 COMANDOS ÚTEIS DE EMERGÊNCIA

### Site Fora do Ar:
```bash
# Verificar serviços
sudo /opt/bitnami/ctlscript.sh status

# Reiniciar tudo
sudo /opt/bitnami/ctlscript.sh restart
```

### Erro 500:
```bash
# Ver logs
sudo tail -f /opt/bitnami/apache/logs/error_log

# Verificar PHP
php -v
```

### Database Não Conecta:
```bash
# Verificar MySQL
sudo /opt/bitnami/ctlscript.sh status mysql

# Testar conexão
mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria -e "SELECT 1;"
```

### Cache Issues:
```bash
# Limpar tudo
cd /opt/bitnami/wordpress
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo rm -rf wp-content/cache/*
sudo /opt/bitnami/ctlscript.sh restart
```

---

## ✅ CONCLUSÃO

**Você está em:** 60% completo ✅

**Próximos passos críticos:**
1. 🔴 Testes funcionais (HOJE)
2. 🔴 DNS (AMANHÃ)
3. 🔴 SSL (APÓS DNS)

**Tempo até produção:** 2-3 dias (se tudo correr bem)

**Site seguro se servidor antigo cair:** ✅ SIM (mas faça backups)

---

**Pronto para continuar? Qual etapa quer fazer agora?**
