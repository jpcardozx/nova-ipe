# 🎯 MIGRAÇÃO DNS: Locaweb → CloudFlare (SEM Registro.br)

**Data:** 8 de outubro de 2025  
**Situação:** Domínio registrado no Registro.br, DNS gerenciado pela Locaweb  
**Objetivo:** Migrar DNS para CloudFlare SEM alterar propriedade ou nameservers

---

## ✅ SIM! VOCÊ PODE FAZER VIA PAINEL LOCAWEB

**Resposta rápida:** ✅ **SIM**, você pode apontar o DNS para o CloudFlare diretamente pelo painel da Locaweb, **SEM** precisar:
- ❌ Transferir propriedade do domínio
- ❌ Alterar registrante no Registro.br
- ❌ Alterar contato administrativo
- ❌ Solicitar nada para Eduardo Maia ou José Luiz

**MAS:** Isso é diferente de usar CloudFlare completo (com CDN/cache/DDoS protection).

---

## 🔄 DUAS FORMAS DE FAZER

### FORMA 1: DNS SIMPLES (Via Locaweb - SEM CloudFlare completo)
**O que é:** Apenas apontar portal.imobiliariaipe.com.br para o Lightsail  
**CloudFlare:** ❌ NÃO usa CDN, cache, DDoS protection  
**Acesso necessário:** ✅ Apenas painel Locaweb  
**Tempo:** ⚡ 5 minutos + 2-4h propagação  
**Complexidade:** 🟢 Muito fácil

### FORMA 2: CLOUDFLARE COMPLETO (Via Registro.br)
**O que é:** Usar CloudFlare como DNS primário (nameservers)  
**CloudFlare:** ✅ USA CDN, cache, DDoS protection, SSL grátis  
**Acesso necessário:** ⚠️ Alterar nameservers no Registro.br  
**Tempo:** ⏱️ 30 min + 4-24h propagação  
**Complexidade:** 🟡 Médio

---

## 📋 FORMA 1: SIMPLES (VIA PAINEL LOCAWEB) ⭐

### Vantagens:
- ✅ **Muito rápido** (5 minutos)
- ✅ **Não precisa acesso Registro.br**
- ✅ **Não precisa pedir nada a ninguém**
- ✅ **Nameservers continuam Locaweb**
- ✅ **Site funciona imediatamente**

### Desvantagens:
- ❌ **SEM CloudFlare CDN** (site pode ser mais lento)
- ❌ **SEM DDoS protection** do CloudFlare
- ❌ **SEM cache** inteligente
- ❌ **SEM SSL automático** do CloudFlare
- ❌ **SEM analytics** do CloudFlare

### Como fazer:

#### Passo 1: Acessar Painel Locaweb
```
URL: https://painel.locaweb.com.br
Login: [seu email de cadastro]
Senha: [sua senha]
```

#### Passo 2: Gerenciar DNS
```
1. Menu: "Hospedagem de Sites" ou "Domínios"
2. Localizar: imobiliariaipe.com.br
3. Clicar em: "Gerenciar DNS" ou "Zona DNS"
```

#### Passo 3: Adicionar/Editar Registro A
```
Tipo: A
Host: portal (ou portal.imobiliariaipe.com.br)
Aponta para: 13.223.237.99
TTL: 3600 (1 hora) ou menor

Clicar em: "Adicionar" ou "Salvar"
```

#### Passo 4: Editar Root Domain (Opcional)
```
Tipo: A
Host: @ (ou deixar vazio, ou imobiliariaipe.com.br)
Aponta para: 13.223.237.99
TTL: 3600

Clicar em: "Adicionar" ou "Salvar"
```

#### Passo 5: Editar WWW (Opcional)
```
Tipo: A
Host: www
Aponta para: 13.223.237.99
TTL: 3600

Clicar em: "Adicionar" ou "Salvar"
```

#### Passo 6: Aguardar Propagação
```
Tempo: 1-4 horas (geralmente 1-2h)
Verificar: https://dnschecker.org
```

#### Passo 7: Atualizar URLs no WordPress
```bash
ssh bitnami@13.223.237.99

# Backup
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > ~/backup-antes-dns.sql

# Atualizar URLs
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

#### Passo 8: Instalar SSL (Bitnami SSL Tool)
```bash
sudo /opt/bitnami/bncert-tool
# Seguir wizard para portal.imobiliariaipe.com.br
```

### Resultado:
```
✅ portal.imobiliariaipe.com.br → AWS Lightsail
✅ Site funcionando
✅ SSL instalado (Let's Encrypt via Bitnami)
❌ SEM CloudFlare CDN/proteção
```

**Nameservers continuam:**
```
ns1.locaweb.com.br
ns2.locaweb.com.br
ns3.locaweb.com.br
```

---

## 📋 FORMA 2: CLOUDFLARE COMPLETO (VIA REGISTRO.BR) ⭐⭐⭐

### Vantagens:
- ✅ **CloudFlare CDN** (site mais rápido globalmente)
- ✅ **DDoS protection** grátis
- ✅ **Cache inteligente** (economiza banda)
- ✅ **SSL automático** do CloudFlare
- ✅ **Analytics detalhado** grátis
- ✅ **Firewall** configurável
- ✅ **Otimização automática** (minify CSS/JS/HTML)

### Desvantagens:
- ⚠️ **Precisa mudar nameservers** no Registro.br
- ⚠️ **Precisa acesso Registro.br** (ou solicitar a Eduardo/José Luiz)
- ⏱️ **Mais demorado** (30 min setup)
- 🔧 **Mais técnico**

### Como fazer:

#### Etapa A: CloudFlare (Você faz sozinho)
```
1. Criar conta: https://dash.cloudflare.com/sign-up
2. Adicionar domínio: imobiliariaipe.com.br
3. Escolher plano: Free
4. Configurar DNS:
   - A    @        13.223.237.99    Proxied
   - A    portal   13.223.237.99    Proxied
   - A    www      13.223.237.99    Proxied
5. CloudFlare vai fornecer 2 nameservers
   Exemplo:
   - marina.ns.cloudflare.com
   - neil.ns.cloudflare.com
6. COPIAR esses nameservers
```

#### Etapa B: Registro.br (Precisa acesso OU solicitar)

**Opção B1: Você tem acesso ao Registro.br**
```
1. Acessar: https://registro.br
2. Login: CNPJ 06.201.863/0001-03
3. Ir em: Domínios → imobiliariaipe.com.br
4. Alterar DNS → Usar DNS Externo
5. Remover: ns1, ns2, ns3.locaweb.com.br
6. Adicionar: [nameservers do CloudFlare copiados]
7. Salvar
```

**Opção B2: Solicitar a Eduardo Maia ou José Luiz**
```
Email para: edumaias@me.com

Assunto: Solicitação de Alteração de Nameservers DNS

Olá Eduardo,

Estamos migrando o site da Imobiliária Ipê para um servidor mais 
moderno na AWS, com CloudFlare para melhor performance e segurança.

Para concluir, precisamos alterar os nameservers no Registro.br.

REMOVER (Locaweb):
- ns1.locaweb.com.br
- ns2.locaweb.com.br
- ns3.locaweb.com.br

ADICIONAR (CloudFlare):
- [nameserver 1 fornecido pelo CloudFlare]
- [nameserver 2 fornecido pelo CloudFlare]

Pode fazer essa alteração em https://registro.br?

Qualquer dúvida, estou à disposição.

Att,
[Seu nome]
```

#### Etapa C: Aguardar Propagação
```
Tempo: 2-24 horas (geralmente 4-8h)
Verificar: CloudFlare Dashboard mostrará "Active"
```

#### Etapa D: Configurar SSL no CloudFlare
```
1. CloudFlare Dashboard → SSL/TLS
2. Escolher: "Full" (temporário)
3. Após instalar SSL no Lightsail: mudar para "Full (strict)"
```

#### Etapa E: Atualizar WordPress + Instalar SSL
```bash
# Atualizar URLs
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root

# Instalar SSL
sudo /opt/bitnami/bncert-tool

# Atualizar para HTTPS
sudo wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' --allow-root

# Configurar CloudFlare SSL para "Full (strict)"
```

### Resultado:
```
✅ portal.imobiliariaipe.com.br → CloudFlare CDN → AWS Lightsail
✅ Site muito mais rápido
✅ DDoS protection ativo
✅ SSL automático
✅ Cache inteligente
✅ Analytics detalhado
```

**Nameservers mudam para:**
```
[algo].ns.cloudflare.com
[algo].ns.cloudflare.com
```

---

## 📊 COMPARAÇÃO: LOCAWEB vs CLOUDFLARE

| Característica | Forma 1: Locaweb DNS | Forma 2: CloudFlare |
|----------------|----------------------|---------------------|
| **Tempo setup** | ⚡ 5 min | ⏱️ 30 min |
| **Propagação** | ⚡ 1-4h | 🐢 4-24h |
| **Acesso necessário** | ✅ Só Locaweb | ⚠️ Registro.br |
| **CDN grátis** | ❌ Não | ✅ Sim |
| **DDoS protection** | ❌ Não | ✅ Sim |
| **Cache inteligente** | ❌ Não | ✅ Sim |
| **SSL automático** | ⚠️ Manual (Bitnami) | ✅ Automático |
| **Analytics** | ❌ Não | ✅ Sim |
| **Firewall** | ❌ Não | ✅ Sim |
| **Performance** | 🟡 OK | 🟢 Excelente |
| **Custo** | ✅ $0 | ✅ $0 (Free plan) |
| **Complexidade** | 🟢 Fácil | 🟡 Médio |

---

## 🎯 RECOMENDAÇÃO

### Para Você AGORA:

**Opção A: Rápido e Simples (Locaweb DNS) ⚡**
```
✅ Se você quer: Site no ar RÁPIDO (hoje mesmo)
✅ Se você tem: Acesso ao painel Locaweb
✅ Se você aceita: Performance OK (sem CDN)
⏱️ Tempo: 5 min + 1-2h propagação
```

**Opção B: Melhor Performance (CloudFlare) ⭐**
```
✅ Se você quer: Melhor performance + segurança
✅ Se você tem: Acesso Registro.br OU pode pedir a Eduardo
✅ Se você aceita: Esperar mais tempo (setup + propagação)
⏱️ Tempo: 30 min + 4-24h propagação
```

### Minha Sugestão:

**FASE 1 (HOJE): Locaweb DNS**
```
1. Apontar portal.imobiliariaipe.com.br → 13.223.237.99
2. Site funcionando em 1-2 horas
3. Instalar SSL (Bitnami)
4. Testar tudo funcionando
```

**FASE 2 (DEPOIS): CloudFlare (Quando tiver acesso Registro.br)**
```
1. Criar conta CloudFlare
2. Configurar DNS
3. Solicitar mudança de nameservers
4. Aproveitar CDN + proteção
```

**Vantagens dessa abordagem:**
- ✅ Site no ar HOJE
- ✅ Pode testar tudo funcionando
- ✅ Migração para CloudFlare depois, sem pressa
- ✅ Não fica parado aguardando acesso Registro.br

---

## 🔧 TUTORIAL: LOCAWEB DNS (PASSO A PASSO)

### 1. Acessar Painel Locaweb

**URL:** https://painel.locaweb.com.br

**Login com:**
- Email/CPF/CNPJ cadastrado na Locaweb
- Senha da conta Locaweb

**⚠️ NÃO TEM ACESSO?**
- Recuperar senha: https://painel.locaweb.com.br/recuperar-senha
- Suporte: 11 4000-1500
- Chat online no painel

### 2. Navegar para DNS

**Caminho no painel:**
```
1. Menu lateral → "Hospedagem de Sites"
2. Ou → "Domínios"
3. Localizar domínio: imobiliariaipe.com.br
4. Clicar em: "Gerenciar" ou ícone de engrenagem
5. Procurar: "Gerenciar DNS" ou "Zona DNS" ou "Editar DNS"
```

### 3. Visualizar DNS Atual

Você deve ver algo como:
```
Tipo    Host    Aponta para              TTL
A       @       [IP Locaweb atual]       3600
A       www     [IP Locaweb atual]       3600
MX      @       mail.locaweb.com.br      3600
...
```

### 4. Adicionar Novo Registro A (Portal)

**Clicar em:** "Adicionar registro" ou "Novo registro"

**Preencher:**
```
Tipo de registro: A
Host/Nome: portal
Aponta para/Valor: 13.223.237.99
TTL: 3600 (ou 1800 para propagação mais rápida)
```

**Salvar**

### 5. Editar Registro A Existente (Root - Opcional)

**Se quiser que imobiliariaipe.com.br também aponte:**

**Localizar registro:**
```
Tipo: A
Host: @ ou [vazio] ou imobiliariaipe.com.br
```

**Clicar em:** "Editar" ou ícone de lápis

**Alterar:**
```
Aponta para: 13.223.237.99
```

**Salvar**

### 6. Editar WWW (Opcional)

**Se quiser que www.imobiliariaipe.com.br aponte:**

**Localizar ou criar:**
```
Tipo: A
Host: www
Aponta para: 13.223.237.99
TTL: 3600
```

**Salvar**

### 7. ⚠️ IMPORTANTE: EMAIL

**SE VOCÊ TEM EMAIL @imobiliariaipe.com.br:**

**NÃO DELETAR registros:**
```
MX   @     mail.locaweb.com.br  (ou outro servidor de email)
A    mail  [IP email]
...
```

**Manter tudo relacionado a email intacto!**

### 8. Confirmar Alterações

**Revisar:**
```
✅ portal.imobiliariaipe.com.br → 13.223.237.99
✅ Registros de email mantidos (se tiver)
✅ TTL configurado (3600 ou menor)
```

**Salvar/Aplicar** alterações

### 9. Aguardar Propagação

**Verificar propagação:**
```bash
# Do seu PC
dig portal.imobiliariaipe.com.br

# Ou usar site
https://dnschecker.org
```

**Tempo esperado:**
- Mínimo: 30 minutos
- Típico: 1-2 horas
- Máximo: 4 horas

### 10. Atualizar WordPress (Após DNS Propagar)

```bash
# SSH no Lightsail
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99

# Backup
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > ~/backup-antes-dns-$(date +%Y%m%d).sql

# Atualizar URLs
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root --dry-run
# Se OK, rodar sem --dry-run
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache

# Testar
curl -I http://portal.imobiliariaipe.com.br
```

### 11. Instalar SSL

```bash
sudo /opt/bitnami/bncert-tool

# Seguir wizard:
# Domain: portal.imobiliariaipe.com.br
# Redirect HTTP to HTTPS: Yes
# Email: contato@imobiliariaipe.com.br
```

### 12. Atualizar para HTTPS

```bash
cd /opt/bitnami/wordpress
sudo wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' --allow-root

sudo wp cache flush --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## ✅ CHECKLIST

### Antes de começar:
- [ ] Acesso ao painel Locaweb
- [ ] Saber se tem email @imobiliariaipe.com.br
- [ ] IP Lightsail: 13.223.237.99
- [ ] Backup do WordPress feito

### Executar:
- [ ] Acessar painel Locaweb
- [ ] Gerenciar DNS do domínio
- [ ] Adicionar registro A para "portal"
- [ ] Manter registros de email (se tiver)
- [ ] Salvar alterações
- [ ] Aguardar propagação (1-2h)
- [ ] Testar DNS: dig portal.imobiliariaipe.com.br
- [ ] Atualizar URLs WordPress
- [ ] Instalar SSL (bncert-tool)
- [ ] Atualizar URLs para HTTPS
- [ ] Testar site: https://portal.imobiliariaipe.com.br

### Pós-migração:
- [ ] Site carrega corretamente
- [ ] SSL válido (cadeado verde)
- [ ] Imagens aparecem
- [ ] Login wp-admin funciona
- [ ] Email funcionando (se tiver)

---

## 🚀 QUAL VOCÊ PREFERE?

**Opção A: LOCAWEB DNS (Rápido) ⚡**
- ✅ Começa agora
- ✅ Site no ar em 1-2h
- ❌ Sem CloudFlare CDN

**Opção B: CLOUDFLARE COMPLETO (Melhor) ⭐**
- ⏱️ Setup mais longo
- ⏳ Site no ar em 4-24h
- ✅ Com CloudFlare CDN completo

**Opção C: LOCAWEB AGORA + CLOUDFLARE DEPOIS (Smart) 🧠**
- ✅ Site no ar HOJE (Locaweb)
- ✅ Migra CloudFlare quando tiver tempo
- ✅ Melhor dos dois mundos

---

**Qual opção você quer seguir? A, B ou C?** 😊
