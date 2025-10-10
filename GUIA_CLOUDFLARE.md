# 🌐 GUIA COMPLETO: CONFIGURAR CLOUDFLARE

**Data:** 8 de outubro de 2025  
**Objetivo:** Apontar portal.imobiliariaipe.com.br para Lightsail  
**Tempo estimado:** 20-30 minutos + propagação (2-24h)

---

## 🎯 O QUE VAMOS FAZER

```
ANTES:
portal.imobiliariaipe.com.br → Servidor Locaweb

DEPOIS:
portal.imobiliariaipe.com.br → CloudFlare CDN → AWS Lightsail
                                    ↓
                            (DDoS protection, cache, SSL grátis)
```

---

## 📋 PRÉ-REQUISITOS

### Informações necessárias:
- ✅ **Domínio:** imobiliariaipe.com.br
- ✅ **IP Lightsail:** 13.223.237.99
- ✅ **Email:** contato@imobiliariaipe.com.br (ou outro email de acesso)
- ⏳ **Login Registro.br:** CPF/CNPJ + senha (você tem?)

### Acesso necessário:
- [ ] Registro.br (onde domínio foi registrado)
- [ ] Email para confirmação CloudFlare

---

## 📝 ETAPA 1: CRIAR CONTA CLOUDFLARE

### 1.1. Acessar CloudFlare
```
URL: https://dash.cloudflare.com/sign-up
```

### 1.2. Criar conta
```
Email: contato@imobiliariaipe.com.br (ou seu email)
Password: [escolha uma senha forte]
```

**Dicas de senha:**
- Mínimo 8 caracteres
- Use letras maiúsculas, minúsculas, números e símbolos
- Exemplo: IpeCloud@2025!

### 1.3. Confirmar email
```
1. Verificar caixa de entrada
2. Clicar no link de confirmação
3. Retornar ao dashboard
```

---

## 📝 ETAPA 2: ADICIONAR DOMÍNIO NO CLOUDFLARE

### 2.1. No Dashboard do CloudFlare
```
1. Clicar em "Add a Site"
2. Digite: imobiliariaipe.com.br
3. Clicar em "Add site"
```

### 2.2. Escolher Plano
```
Selecionar: Free Plan (Grátis)
- ✅ CDN ilimitado
- ✅ SSL grátis
- ✅ DDoS protection básico
- ✅ Cache inteligente

Clicar em: "Continue"
```

### 2.3. Escanear DNS Existente
```
CloudFlare vai escanear automaticamente os DNS atuais
Aguardar: 1-2 minutos
Clicar em: "Continue"
```

---

## 📝 ETAPA 3: CONFIGURAR DNS RECORDS

### 3.1. Revisar DNS Escaneados

CloudFlare vai mostrar os DNS atuais do domínio. Você vai ver algo como:

```
Tipo    Nome    Conteúdo              Proxy
A       @       [IP Locaweb]          ?
A       www     [IP Locaweb]          ?
MX      @       mail.locaweb.com.br   ?
...
```

### 3.2. IMPORTANTE: Anotar Configurações de Email

**ANTES DE MUDAR QUALQUER COISA:**

Se você tem email configurado (@imobiliariaipe.com.br), anote:
```
Registros MX (para emails):
- Exemplo: mail.locaweb.com.br
- Prioridade: 10

Registros CNAME (para webmail):
- mail
- webmail
- smtp
- pop
- imap
```

**⚠️ NÃO DELETAR REGISTROS MX! Senão email para de funcionar!**

### 3.3. Configurar DNS para Lightsail

**DELETAR (se existir):**
- A record para "@" apontando para IP antigo
- A record para "portal" apontando para IP antigo
- A record para "www" apontando para IP antigo

**ADICIONAR/EDITAR:**

#### DNS Record 1: Root domain
```
Tipo:     A
Nome:     @ (ou deixe vazio, ou imobiliariaipe.com.br)
Valor:    13.223.237.99
TTL:      Auto
Proxy:    🟠 Proxied (laranja, ATIVADO)
```
**Clicar em:** "Add Record" ou "Save"

#### DNS Record 2: Portal subdomain (PRINCIPAL)
```
Tipo:     A
Nome:     portal
Valor:    13.223.237.99
TTL:      Auto
Proxy:    🟠 Proxied (laranja, ATIVADO)
```
**Clicar em:** "Add Record" ou "Save"

#### DNS Record 3: WWW subdomain (opcional)
```
Tipo:     A
Nome:     www
Valor:    13.223.237.99
TTL:      Auto
Proxy:    🟠 Proxied (laranja, ATIVADO)
```
**Clicar em:** "Add Record" ou "Save"

### 3.4. MANTER Registros de Email (SE TIVER)

**NÃO DELETAR:**
```
Tipo    Nome         Valor                  Proxy
MX      @            mail.locaweb.com.br    DNS only (cinza)
CNAME   mail         mail.locaweb.com.br    DNS only (cinza)
CNAME   webmail      mail.locaweb.com.br    DNS only (cinza)
```

### 3.5. Resultado Final DNS

Sua configuração deve ficar assim:

```
Tipo    Nome       Valor                    Proxy          Status
───────────────────────────────────────────────────────────────────
A       @          13.223.237.99           🟠 Proxied      ✅
A       portal     13.223.237.99           🟠 Proxied      ✅
A       www        13.223.237.99           🟠 Proxied      ✅
MX      @          mail.locaweb.com.br     ⚪ DNS only     ✅
CNAME   mail       mail.locaweb.com.br     ⚪ DNS only     ✅
```

**Clicar em:** "Continue"

---

## 📝 ETAPA 4: COPIAR NAMESERVERS DO CLOUDFLARE

### 4.1. CloudFlare vai mostrar os Nameservers

Algo parecido com:
```
CHANGE YOUR NAMESERVERS

Replace your nameservers at your registrar with these:

  marina.ns.cloudflare.com
  neil.ns.cloudflare.com

(Os nomes reais serão diferentes, mas sempre .cloudflare.com)
```

### 4.2. COPIAR os dois nameservers
```
Nameserver 1: [copiar]
Nameserver 2: [copiar]
```

**⚠️ NÃO FECHAR ESSA PÁGINA AINDA!**

Deixe aberta ou anote os nameservers.

---

## 📝 ETAPA 5: ATUALIZAR NAMESERVERS NO REGISTRO.BR

### 5.1. Acessar Registro.br
```
URL: https://registro.br
```

### 5.2. Fazer Login
```
1. CPF/CNPJ: [seu CPF/CNPJ]
2. Senha: [sua senha do registro.br]
3. Clicar em "Entrar"
```

**⚠️ NÃO TEM ACESSO?**
- Recuperar senha em: https://registro.br/recuperar-senha
- Ou contactar quem registrou o domínio

### 5.3. Localizar o Domínio
```
1. No menu: "Meus Domínios"
2. Procurar: imobiliariaipe.com.br
3. Clicar no domínio
```

### 5.4. Alterar Servidores DNS
```
1. Procurar seção: "Servidores DNS" ou "DNS Management"
2. Clicar em: "Alterar servidores DNS" ou "Editar"
```

### 5.5. Configurar Nameservers do CloudFlare

**DELETAR nameservers atuais:**
```
Remover todos nameservers existentes
(geralmente são da Locaweb ou outros)
```

**ADICIONAR nameservers do CloudFlare:**
```
DNS Master 1: [nameserver 1 do CloudFlare]
DNS Master 2: [nameserver 2 do CloudFlare]

Exemplo (seus serão diferentes):
DNS Master 1: marina.ns.cloudflare.com
DNS Master 2: neil.ns.cloudflare.com
```

### 5.6. Salvar Alterações
```
1. Conferir se está correto
2. Clicar em: "Salvar" ou "Confirmar"
3. Aguardar confirmação
```

### 5.7. Aguardar Processamento Registro.br
```
Registro.br geralmente processa em: 15-30 minutos
Você pode receber email de confirmação
```

---

## 📝 ETAPA 6: CONFIRMAR NO CLOUDFLARE

### 6.1. Voltar para CloudFlare Dashboard
```
URL: https://dash.cloudflare.com
```

### 6.2. Finalizar Configuração
```
1. Clicar em: "Done, check nameservers"
2. CloudFlare vai verificar os nameservers
3. Pode levar 2-24 horas para propagar
```

### 6.3. Status Inicial
```
Status: ⏳ Pending nameserver update
Mensagem: "We're waiting for your registrar to add Cloudflare's
           nameservers. This process can take up to 24 hours."
```

**Isso é normal!** Aguardar propagação.

---

## 📝 ETAPA 7: CONFIGURAÇÕES ADICIONAIS CLOUDFLARE

Enquanto aguarda propagação, configurar CloudFlare:

### 7.1. SSL/TLS Settings
```
1. No menu lateral: SSL/TLS
2. Escolher: "Full" (não "Full (strict)" ainda)
3. Salvar
```

**Por quê "Full"?**
- Lightsail ainda não tem SSL instalado
- Depois que instalar SSL no Lightsail, mudar para "Full (strict)"

### 7.2. Always Use HTTPS (Aguardar DNS)
```
⚠️ NÃO ATIVAR AINDA
Ativar apenas DEPOIS de:
- DNS propagar
- SSL instalado no Lightsail
```

### 7.3. Auto Minify (Otimização)
```
1. Speed → Optimization
2. Auto Minify:
   [x] JavaScript
   [x] CSS
   [x] HTML
3. Salvar
```

### 7.4. Browser Cache (Performance)
```
1. Caching → Configuration
2. Browser Cache TTL: 4 hours (ou mais)
3. Salvar
```

### 7.5. Security Level
```
1. Security → Settings
2. Security Level: Medium
3. Salvar
```

---

## 📝 ETAPA 8: VERIFICAR PROPAGAÇÃO DNS

### 8.1. Aguardar Tempo Mínimo
```
Tempo mínimo: 2-4 horas
Tempo máximo: 24-48 horas
Tempo típico: 4-8 horas
```

### 8.2. Verificar Propagação Online

**Opção A: DNS Checker**
```
URL: https://dnschecker.org

1. Digite: portal.imobiliariaipe.com.br
2. Tipo: A
3. Clicar em: "Search"

Verificar se retorna: 13.223.237.99
em múltiplos locais do mundo
```

**Opção B: WhatsMyDNS**
```
URL: https://www.whatsmydns.net

1. Digite: portal.imobiliariaipe.com.br
2. Tipo: A
3. Verificar: se mostra 13.223.237.99
```

### 8.3. Verificar Via Comando (Seu PC)
```bash
# Linux/Mac
dig portal.imobiliariaipe.com.br

# Ou usando Google DNS
dig @8.8.8.8 portal.imobiliariaipe.com.br

# Windows PowerShell
nslookup portal.imobiliariaipe.com.br 8.8.8.8
```

**Resultado esperado:**
```
portal.imobiliariaipe.com.br. 300 IN A 13.223.237.99
```

### 8.4. Testar no Navegador (DEPOIS de propagar)
```
1. Abrir navegador em modo anônimo (Ctrl+Shift+N)
2. Acessar: http://portal.imobiliariaipe.com.br
3. Deve carregar o site da Imobiliária Ipê
```

---

## 📝 ETAPA 9: ATUALIZAR URLs NO WORDPRESS (APÓS DNS)

**⚠️ FAZER APENAS DEPOIS QUE DNS PROPAGAR!**

### 9.1. Verificar DNS Propagado
```bash
ping portal.imobiliariaipe.com.br
# Deve retornar: 13.223.237.99
```

### 9.2. SSH no Lightsail
```bash
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99
```

### 9.3. Backup Antes de Mudar
```bash
# Backup do database
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > ~/backup-antes-dns-$(date +%Y%m%d).sql
```

### 9.4. Atualizar URLs (SEM HTTPS ainda)
```bash
cd /opt/bitnami/wordpress

# Atualizar URLs
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root

# Verificar mudanças
sudo wp search-replace 'http://13.223.237.99' 'http://portal.imobiliariaipe.com.br' --allow-root --dry-run
```

### 9.5. Limpar Cache
```bash
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### 9.6. Testar
```bash
curl -I http://portal.imobiliariaipe.com.br
# Deve retornar: HTTP 200 OK
```

---

## 📝 ETAPA 10: INSTALAR SSL NO LIGHTSAIL (APÓS DNS)

**⚠️ FAZER APENAS DEPOIS QUE DNS PROPAGAR E ETAPA 9 COMPLETA!**

### 10.1. Verificar DNS Funcionando
```bash
# Do seu PC
ping portal.imobiliariaipe.com.br
# Deve retornar 13.223.237.99
```

### 10.2. SSH no Lightsail
```bash
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99
```

### 10.3. Executar Bitnami SSL Tool
```bash
sudo /opt/bitnami/bncert-tool
```

### 10.4. Seguir Wizard Interativo

**Pergunta 1: Domain list**
```
Please provide a list of space-separated domains for which you wish to configure your web server:

Digite: portal.imobiliariaipe.com.br www.imobiliariaipe.com.br
```

**Pergunta 2: WWW redirect**
```
Enable HTTP to HTTPS redirection [Y/n]:

Digite: Y (sim)
```

**Pergunta 3: Non-WWW to WWW**
```
Enable non-www to www redirection [Y/n]:

Digite: n (não, queremos portal.imobiliariaipe.com.br)
```

**Pergunta 4: WWW to non-WWW**
```
Enable www to non-www redirection [y/N]:

Digite: N
```

**Pergunta 5: Email**
```
Please provide a valid e-mail address for which to associate your certificate:

Digite: contato@imobiliariaipe.com.br
```

**Pergunta 6: Agree to Terms**
```
Do you agree to the Let's Encrypt Subscriber Agreement? [Y/n]:

Digite: Y
```

**Pergunta 7: Confirm**
```
Press [Enter] to continue:

Pressione: Enter
```

### 10.5. Aguardar Instalação
```
Processo leva: 2-5 minutos
Vai:
- Gerar certificado SSL
- Configurar Apache
- Configurar auto-renovação
- Reiniciar Apache
```

### 10.6. Resultado Esperado
```
Success!

Certificate has been created at:
/opt/bitnami/apache/conf/bitnami/certs/server.crt

Certificate will be automatically renewed.

Apache has been configured to use this certificate.
```

---

## 📝 ETAPA 11: ATUALIZAR URLs PARA HTTPS (APÓS SSL)

### 11.1. Backup
```bash
sudo mysqldump -u wp_imobiliaria -pIpe@5084 wp_imobiliaria > ~/backup-antes-https-$(date +%Y%m%d).sql
```

### 11.2. Atualizar para HTTPS
```bash
cd /opt/bitnami/wordpress

# Atualizar URLs
sudo wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' --allow-root

# Limpar cache
sudo wp cache flush --allow-root
sudo wp transient delete --all --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### 11.3. Forçar HTTPS no wp-config.php
```bash
sudo nano /opt/bitnami/wordpress/wp-config.php
```

**Adicionar ANTES de "That's all, stop editing!":**
```php
/* SSL */
define('FORCE_SSL_ADMIN', true);
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

**Salvar:** Ctrl+O, Enter, Ctrl+X

### 11.4. Testar HTTPS
```bash
curl -I https://portal.imobiliariaipe.com.br
# Deve retornar: HTTP 200 OK
```

---

## 📝 ETAPA 12: CONFIGURAR CLOUDFLARE SSL STRICT

### 12.1. Voltar ao CloudFlare Dashboard
```
URL: https://dash.cloudflare.com
```

### 12.2. Mudar SSL para Full (Strict)
```
1. SSL/TLS → Overview
2. Mudar de "Full" para: "Full (strict)"
3. Salvar
```

### 12.3. Ativar Always Use HTTPS
```
1. SSL/TLS → Edge Certificates
2. Always Use HTTPS: ON
3. Salvar
```

### 12.4. HSTS (Opcional mas Recomendado)
```
1. SSL/TLS → Edge Certificates
2. HTTP Strict Transport Security (HSTS)
3. Enable HSTS
4. Max Age: 6 months
5. Apply HSTS to subdomains: OFF (ou ON se quiser)
6. Preload: OFF (por enquanto)
7. Confirm
```

---

## ✅ VERIFICAÇÃO FINAL

### Checklist Completo:

**CloudFlare:**
- [ ] Conta criada
- [ ] Domínio adicionado
- [ ] DNS records configurados
- [ ] Nameservers copiados
- [ ] SSL/TLS configurado

**Registro.br:**
- [ ] Nameservers atualizados
- [ ] Confirmação recebida

**DNS:**
- [ ] Propagação completa
- [ ] portal.imobiliariaipe.com.br → 13.223.237.99
- [ ] Testado em múltiplos locais

**WordPress:**
- [ ] URLs atualizadas (HTTP)
- [ ] SSL instalado no Lightsail
- [ ] URLs atualizadas (HTTPS)
- [ ] wp-config.php com FORCE_SSL

**CloudFlare SSL:**
- [ ] Modo "Full (strict)"
- [ ] Always Use HTTPS: ON
- [ ] HSTS configurado (opcional)

**Testes Finais:**
- [ ] https://portal.imobiliariaipe.com.br carrega
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] SSL válido (cadeado verde)
- [ ] Site carrega corretamente
- [ ] Imagens aparecem
- [ ] wp-admin acessível

---

## 🚨 TROUBLESHOOTING

### Problema: DNS não propaga
**Solução:**
- Aguardar mais tempo (até 48h)
- Verificar nameservers no registro.br
- Limpar cache DNS: `ipconfig /flushdns` (Windows) ou `sudo systemd-resolve --flush-caches` (Linux)

### Problema: SSL não instala
**Solução:**
- Verificar se DNS aponta corretamente
- Porta 80 deve estar aberta no firewall
- Tentar novamente: `sudo /opt/bitnami/bncert-tool`

### Problema: Site não carrega com domínio
**Solução:**
- Verificar URLs no WordPress: `wp option get siteurl`
- Limpar cache CloudFlare: Dashboard → Caching → Purge Everything
- Limpar cache WordPress: `wp cache flush --allow-root`

### Problema: Mixed content (HTTP/HTTPS)
**Solução:**
- Atualizar URLs: `wp search-replace 'http://' 'https://' --allow-root`
- Verificar wp-config.php tem FORCE_SSL_ADMIN

### Problema: Email para de funcionar
**Solução:**
- Verificar registros MX no CloudFlare
- MX deve estar "DNS only" (cinza), não "Proxied"
- Restaurar configurações de email antigas

---

## 📞 SUPORTE

### CloudFlare:
- Dashboard: https://dash.cloudflare.com
- Documentação: https://developers.cloudflare.com
- Community: https://community.cloudflare.com

### Registro.br:
- Site: https://registro.br
- Suporte: https://registro.br/suporte
- Telefone: 11 5509-3555

### Let's Encrypt:
- Site: https://letsencrypt.org
- Documentação: https://letsencrypt.org/docs

---

## 📅 TIMELINE ESPERADO

```
DIA 1 (HOJE):
⏰ 00:00 - Criar conta CloudFlare (5 min)
⏰ 00:05 - Adicionar domínio (5 min)
⏰ 00:10 - Configurar DNS (10 min)
⏰ 00:20 - Atualizar registro.br (10 min)
⏰ 00:30 - Aguardar propagação ⏳

DIA 1-2 (2-24h depois):
⏰ Verificar propagação DNS
⏰ Se propagado: atualizar URLs WordPress (5 min)
⏰ Instalar SSL (10 min)
⏰ Atualizar para HTTPS (5 min)
⏰ Configurar CloudFlare SSL strict (5 min)

TOTAL: 30 min trabalho + 2-24h propagação
```

---

## 🎯 PRÓXIMO PASSO

**Você está pronto para começar!**

**Comece por:** ETAPA 1 - Criar conta CloudFlare

**Link:** https://dash.cloudflare.com/sign-up

**Quando terminar cada etapa, me avise que te ajudo com a próxima!**

---

**Alguma dúvida antes de começar?**
