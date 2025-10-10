# 🎯 PLANO: MIGRAR portal.imobiliariaipe.com.br → LIGHTSAIL

**Data:** 8 de outubro de 2025  
**Status Atual:** portal.imobiliariaipe.com.br → Servidor Locaweb (funcionando)  
**Objetivo:** portal.imobiliariaipe.com.br → AWS Lightsail (13.223.237.99)

---

## 📊 SITUAÇÃO ATUAL

### Domínio Portal (Locaweb):
```
URL: https://portal.imobiliariaipe.com.br
Status: ✅ ATIVO e FUNCIONANDO
Servidor: Locaweb
SSL: ✅ Ativo (HTTPS funciona)
Redirecionamento: HTTP → HTTPS automático
```

### Lightsail (Novo servidor):
```
URL: http://13.223.237.99
Status: ✅ FUNCIONANDO
Site migrado: ✅ Completo (4.6GB)
Tema: ✅ ipeimoveis ativo
Plugins: ⚠️ Alguns desativados
SSL: ❌ Não instalado ainda
```

---

## ⚠️ PLUGINS DESATIVADOS NO LIGHTSAIL

### Plugins Ativos (2):
- ✅ all-in-one-wp-migration (para migração)
- ✅ real-estate-listing-realtyna-wpl (imóveis) ⭐

### Plugins Inativos (6):
- ❌ akismet (anti-spam)
- ❌ duplicator (backup)
- ❌ google-universal-analytics (analytics)
- ❌ hello (plugin demo do WordPress)
- ❌ w3-total-cache.off (cache - pasta com .off)
- ❌ wordpress-seo (Yoast SEO)

### ⚠️ Pasta com problema:
```
w3-total-cache.off → Pasta marcada como desativada
```

---

## 🎯 AÇÕES NECESSÁRIAS

### ETAPA 1: ATIVAR PLUGINS ESSENCIAIS (AGORA)

#### Plugins a ativar:
```bash
# 1. Yoast SEO (importante para SEO)
sudo wp plugin activate wordpress-seo --allow-root

# 2. Google Analytics (se usado)
sudo wp plugin activate google-universal-analytics --allow-root

# 3. Akismet (anti-spam - se usado)
sudo wp plugin activate akismet --allow-root
```

#### Plugins que NÃO devemos ativar:
```
❌ duplicator → Só para backup, não precisa no dia-a-dia
❌ hello → Plugin demo, inútil
❌ w3-total-cache.off → Está desativado propositalmente
```

---

## 📋 PASSO A PASSO: MIGRAÇÃO DNS

### OPÇÃO A: Via Painel Locaweb (RECOMENDADO) ⚡

**Vantagens:**
- ✅ Rápido (1-2h propagação)
- ✅ Não precisa acesso Registro.br
- ✅ Mantém nameservers Locaweb
- ✅ Fácil de reverter se der problema

**Desvantagens:**
- ❌ Sem CloudFlare CDN/cache/DDoS

#### Passo 1: Ativar Plugins no Lightsail
```bash
ssh bitnami@13.223.237.99

cd /opt/bitnami/wordpress

# Ativar Yoast SEO
sudo wp plugin activate wordpress-seo --allow-root

# Ativar Google Analytics (se usado)
sudo wp plugin activate google-universal-analytics --allow-root

# Verificar plugins ativos
sudo wp plugin list --status=active --allow-root
```

#### Passo 2: Acessar Painel Locaweb
```
URL: https://painel.locaweb.com.br
Login: [seu email/CPF/CNPJ]
Senha: [sua senha]
```

#### Passo 3: Gerenciar DNS
```
1. Menu → "Hospedagem de Sites" ou "Domínios"
2. Localizar: imobiliariaipe.com.br
3. Clicar: "Gerenciar DNS" ou "Zona DNS"
```

#### Passo 4: Editar Registro A do "portal"
```
Localizar registro existente:
Tipo: A
Host: portal
Aponta para: [IP Locaweb atual]

Clicar em: "Editar"

Alterar:
Aponta para: 13.223.237.99
TTL: 1800 (30 minutos para propagação rápida)

Salvar
```

#### Passo 5: ⚠️ MANTER REGISTROS DE EMAIL
```
NÃO DELETAR registros:
- MX (para emails)
- CNAME mail, webmail, etc
```

#### Passo 6: Aguardar Propagação (1-2 horas)
```bash
# Verificar propagação
dig portal.imobiliariaipe.com.br

# Ou usar site
https://dnschecker.org/#A/portal.imobiliariaipe.com.br
```

#### Passo 7: Quando DNS Propagar → Instalar SSL
```bash
ssh bitnami@13.223.237.99

# Instalar SSL
sudo /opt/bitnami/bncert-tool

# Configurar:
# Domain: portal.imobiliariaipe.com.br
# HTTPS redirect: Yes
# Email: contato@imobiliariaipe.com.br
```

#### Passo 8: Verificar Site
```bash
# Testar
curl -I https://portal.imobiliariaipe.com.br

# Deve retornar:
# HTTP 200 OK
# SSL válido
```

---

### OPÇÃO B: Via CloudFlare (MELHOR, MAS MAIS COMPLEXO)

**Requer:** Acesso ao Registro.br ou solicitar a Eduardo Maia

**Vantagens:**
- ✅ CDN global (site mais rápido)
- ✅ DDoS protection
- ✅ Cache inteligente
- ✅ SSL automático
- ✅ Analytics detalhado

**Processo:**
1. Criar conta CloudFlare
2. Adicionar domínio
3. Configurar DNS
4. Copiar nameservers CloudFlare
5. Alterar nameservers no Registro.br
6. Aguardar propagação (4-24h)

**Detalhes:** Ver GUIA_CLOUDFLARE.md

---

## 🔧 COMANDOS PARA ATIVAR PLUGINS

Execute no Lightsail:

```bash
# SSH
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99

# Ir para WordPress
cd /opt/bitnami/wordpress

# Ver plugins inativos
sudo wp plugin list --status=inactive --allow-root

# Ativar Yoast SEO
sudo wp plugin activate wordpress-seo --allow-root

# Ativar Google Analytics (se usado no site atual)
sudo wp plugin activate google-universal-analytics --allow-root

# Ativar Akismet (se usado no site atual)
sudo wp plugin activate akismet --allow-root

# Ver plugins ativos agora
sudo wp plugin list --status=active --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## 🧪 VERIFICAR SE PLUGINS SÃO USADOS NO SITE ATUAL

Vamos verificar no site da Locaweb:

```bash
# 1. Verificar se Yoast SEO está ativo
curl -s https://portal.imobiliariaipe.com.br | grep -i "yoast"

# 2. Verificar se Google Analytics está ativo
curl -s https://portal.imobiliariaipe.com.br | grep -i "google-analytics\|gtag\|UA-"

# 3. Verificar meta tags (Yoast)
curl -s https://portal.imobiliariaipe.com.br | grep -i "og:\|twitter:"
```

---

## 📊 CHECKLIST DE PLUGINS

### Plugins que DEVEM estar ativos:
- [x] real-estate-listing-realtyna-wpl (CRÍTICO - imóveis)
- [ ] wordpress-seo (Yoast - SEO) ← VERIFICAR se usado
- [ ] google-universal-analytics (Analytics) ← VERIFICAR se usado
- [ ] akismet (Anti-spam) ← VERIFICAR se usado

### Plugins que podem ficar inativos:
- [ ] all-in-one-wp-migration (só para migração)
- [ ] duplicator (só para backup)
- [ ] hello (inútil - pode deletar)
- [ ] w3-total-cache.off (desativado propositalmente)

---

## 🎯 PLANO DE AÇÃO IMEDIATO

### HOJE (8 out) - Fazer AGORA:

**1. Verificar plugins usados no site atual (5 min)**
```bash
# Executar comandos de verificação acima
# Anotar quais plugins estão sendo usados
```

**2. Ativar plugins necessários no Lightsail (5 min)**
```bash
# Ativar apenas os plugins que estão sendo usados
# no site atual da Locaweb
```

**3. Decidir método de migração (2 min)**
```
Opção A: Locaweb DNS (rápido, sem CloudFlare)
Opção B: CloudFlare (melhor, mais demorado)
```

**4. Executar migração DNS (15-30 min)**
```
Seguir passos da opção escolhida
```

**5. Aguardar propagação (1-24h)**
```
Monitorar propagação DNS
```

**6. Instalar SSL quando DNS propagar (10 min)**
```
Executar bncert-tool
```

**7. Testar site funcionando (10 min)**
```
Verificar tudo OK
```

---

## ⚠️ IMPORTANTE: BACKUP

**Antes de migrar DNS, fazer backup do site atual:**

```bash
# Backup via browser (se tiver acesso wp-admin Locaweb)
https://portal.imobiliariaipe.com.br/wp-admin
Plugins → All-in-One WP Migration → Export

# Ou backup via FTP
Baixar pasta completa do site
```

---

## 🚨 PLANO DE ROLLBACK

**Se der problema após migração:**

### Opção 1: Reverter DNS (Rápido - 1h)
```
1. Voltar ao painel Locaweb
2. Mudar registro A de volta para IP Locaweb antigo
3. Aguardar propagação (1-2h)
4. Site volta a funcionar no servidor antigo
```

### Opção 2: Restaurar Lightsail (Médio - 15 min)
```
1. Console Lightsail → Snapshots
2. Restore snapshot anterior
3. Criar nova instância
4. Atualizar DNS para novo IP
```

---

## 📋 RESUMO EXECUTIVO

**Status atual:**
- ✅ Site funcionando na Locaweb (portal.imobiliariaipe.com.br)
- ✅ Site migrado para Lightsail (13.223.237.99)
- ⚠️ Alguns plugins desativados no Lightsail
- ❌ DNS ainda apontando para Locaweb

**Próximos passos:**
1. ⏰ AGORA: Verificar quais plugins são usados
2. ⏰ AGORA: Ativar plugins necessários no Lightsail
3. ⏰ HOJE: Migrar DNS (via Locaweb ou CloudFlare)
4. ⏰ HOJE/AMANHÃ: Aguardar propagação
5. ⏰ APÓS PROPAGAÇÃO: Instalar SSL
6. ⏰ FINAL: Testar tudo funcionando

**Tempo total estimado:**
- Setup: 30 minutos
- Propagação: 1-24 horas (depende do método)
- SSL: 10 minutos
- Total: 1-24 horas até site funcionando no Lightsail

---

**Quer que eu verifique quais plugins estão sendo usados no site atual da Locaweb?**
