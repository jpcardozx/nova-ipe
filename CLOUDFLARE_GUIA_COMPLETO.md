# 🔐 CLOUDFLARE + DNS: PRÓXIMOS PASSOS

**Status:** ⏳ **AGUARDANDO CREDENCIAIS REGISTRO.BR**  
**Domain:** imobiliariaipe.com.br  
**Objetivo:** Migrar DNS para CloudFlare + habilitar HTTPS + gerenciar Zoho Mail

---

## 📋 O QUE PRECISA FAZER

### 1️⃣ OBTER ACESSO AO REGISTRO.BR

**Você precisa de:**
- CNPJ: **06.201.863/0001-03** (LUCIANA CUSTÓDIO DOMINGUEZ MAIA - ME)
- Senha do Registro.br

**Quem pode fornecer:**
- **Eduardo Maia** (contato administrativo)
  - Email: edumaias@me.com
  - Ele é o contato administrativo do domínio
  
- **José Luiz Fernandes de Paula** (contato técnico)
  - Email: jlpaula@terra.com.br
  - Ele é o contato técnico do domínio

**Como solicitar:**
```
Assunto: Acesso Registro.br - imobiliariaipe.com.br

Olá Eduardo/José Luiz,

Preciso das credenciais de acesso ao Registro.br para gerenciar 
o domínio imobiliariaipe.com.br (CNPJ 06.201.863/0001-03).

Vamos migrar o DNS para CloudFlare para melhorar performance,
segurança e gerenciar os registros do site + Zoho Mail.

Necessito:
- CNPJ: 06.201.863/0001-03
- Senha do Registro.br (ou recuperar senha)

Obrigado!
```

**Recuperar senha (se necessário):**
- Acesse: https://registro.br/
- Clique em "Recuperar senha"
- Informe CNPJ: 06.201.863/0001-03
- Código será enviado para email do contato administrativo

---

## 2️⃣ CRIAR CONTA NO CLOUDFLARE (GRATUITO)

### Passo a Passo:

**A) Criar conta:**
```
1. Acesse: https://dash.cloudflare.com/sign-up
2. Email: contato@imobiliariaipe.com.br (ou seu email preferido)
3. Senha forte: [criar uma senha segura]
4. Confirmar email
```

**B) Adicionar domínio:**
```
1. Clique "+ Add a Site"
2. Digite: imobiliariaipe.com.br
3. Escolha plano: FREE (gratuito)
4. CloudFlare vai escanear seus DNS atuais da Locaweb
```

**C) Revisar registros DNS:**
```
CloudFlare vai importar automaticamente seus DNS da Locaweb.
Você verá algo como:

Tipo  | Nome    | Conteúdo                     | Proxy
------+---------+------------------------------+-------
A     | @       | [IP atual Locaweb]           | ⚠️ Mudar
A     | portal  | [IP atual Locaweb]           | ⚠️ Mudar
A     | www     | [IP atual Locaweb]           | ⚠️ Mudar
MX    | @       | mx.zoho.com                  | ✅ Manter
MX    | @       | mx2.zoho.com                 | ✅ Manter
TXT   | @       | v=spf1 include:zoho.com ~all | ✅ Manter
...outros registros Zoho...
```

**D) Ajustar DNS para Lightsail:**
```
Agora você precisa EDITAR os registros A:

ANTES (Locaweb):
A  @      [IP Locaweb]
A  portal [IP Locaweb]  
A  www    [IP Locaweb]

DEPOIS (Lightsail):
A  @      13.223.237.99  ☁️ Proxied (laranja ativado)
A  portal 13.223.237.99  ☁️ Proxied (laranja ativado)
A  www    13.223.237.99  ☁️ Proxied (laranja ativado)

⚠️ Zoho Mail records: MANTER COMO ESTÃO (não mexer!)
```

**E) Nameservers CloudFlare:**
```
CloudFlare vai fornecer 2 nameservers:

Exemplo:
ns1.cloudflare.com
ns2.cloudflare.com

(os nomes exatos serão mostrados no painel)
```

---

## 3️⃣ ALTERAR NAMESERVERS NO REGISTRO.BR

### Após ter os nameservers CloudFlare:

**A) Acessar Registro.br:**
```
1. Acesse: https://registro.br/
2. Login com CNPJ: 06.201.863/0001-03
3. Senha: [a que você obteve com Eduardo/José Luiz]
```

**B) Localizar domínio:**
```
1. No painel, procure: imobiliariaipe.com.br
2. Clique em "Alterar Servidores DNS"
```

**C) Trocar nameservers:**
```
ANTES (Locaweb):
ns1.locaweb.com.br
ns2.locaweb.com.br  
ns3.locaweb.com.br

DEPOIS (CloudFlare):
ns1.cloudflare.com  ← Cole o que CloudFlare forneceu
ns2.cloudflare.com  ← Cole o que CloudFlare forneceu
```

**D) Confirmar alteração:**
```
1. Salvar alterações
2. Confirmar (pode pedir autenticação 2FA)
3. Aguardar email de confirmação
```

---

## 4️⃣ AGUARDAR PROPAGAÇÃO

### Timeline:
```
🕐 0-2 horas:   Propagação inicial (alguns provedores já veem)
🕐 2-12 horas:  Maioria dos usuários já no CloudFlare
🕐 12-48 horas: Propagação completa global (raro levar tanto)
```

### Como verificar:
```bash
# No terminal, verificar nameservers atuais:
dig NS imobiliariaipe.com.br +short

# Se aparecer cloudflare.com = propagou ✅
# Se aparecer locaweb.com.br = ainda propagando ⏳
```

---

## 5️⃣ ATIVAR SSL NO LIGHTSAIL (APÓS DNS PROPAGAR)

### Quando DNS apontar para CloudFlare → Lightsail:

```bash
# SSH no servidor
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99

# Executar ferramenta Bitnami de certificado SSL
sudo /opt/bitnami/bncert-tool

# O bncert-tool vai perguntar:

1. Domain list: portal.imobiliariaipe.com.br imobiliariaipe.com.br www.imobiliariaipe.com.br
2. Enable redirect HTTP → HTTPS: Yes
3. Enable www → non-www redirect: Yes (ou No, você escolhe)
4. Email: contato@imobiliariaipe.com.br

# Ele vai:
- Obter certificado Let's Encrypt gratuito
- Configurar Apache para HTTPS
- Configurar renovação automática
- Reiniciar serviços
```

---

## 6️⃣ ATUALIZAR URLs NO WORDPRESS

### Após SSL ativo:

```bash
# SSH no servidor
ssh -i /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99

# Trocar HTTP → HTTPS no database
cd /opt/bitnami/wordpress

# Opção 1: wp-cli (se disponível)
sudo wp search-replace 'http://portal.imobiliariaipe.com.br' 'https://portal.imobiliariaipe.com.br' --allow-root --skip-columns=guid
sudo wp search-replace 'http://13.223.237.99' 'https://portal.imobiliariaipe.com.br' --allow-root --skip-columns=guid

# Opção 2: phpMyAdmin ou SQL direto
mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria -e "
  UPDATE wp_options SET option_value = 'https://portal.imobiliariaipe.com.br' 
  WHERE option_name IN ('siteurl', 'home');
"

# Limpar cache
sudo wp cache flush --allow-root
sudo systemctl restart bitnami
```

---

## 🎯 CHECKLIST COMPLETO

### Fase 1: Preparação (VOCÊ FAZ AGORA)
- [ ] Contatar Eduardo Maia ou José Luiz
- [ ] Obter credenciais Registro.br (CNPJ + senha)
- [ ] Criar conta CloudFlare (grátis)
- [ ] Adicionar domínio imobiliariaipe.com.br
- [ ] Anotar nameservers CloudFlare fornecidos

### Fase 2: Configuração CloudFlare (VOCÊ FAZ)
- [ ] Revisar registros DNS importados
- [ ] Editar registros A para: 13.223.237.99
- [ ] Ativar proxy (☁️ laranja) nos registros A
- [ ] Verificar Zoho Mail records (MX, TXT, CNAME)
- [ ] Configurar SSL/TLS mode: Full (strict)
- [ ] Ativar "Always Use HTTPS"
- [ ] Ativar Auto Minify (CSS, JS, HTML)

### Fase 3: Registro.br (VOCÊ FAZ)
- [ ] Login no Registro.br
- [ ] Localizar imobiliariaipe.com.br
- [ ] Alterar nameservers para CloudFlare
- [ ] Confirmar alteração
- [ ] Aguardar email de confirmação

### Fase 4: Aguardar (AUTOMÁTICO)
- [ ] Propagação DNS (4-48h, geralmente 2-12h)
- [ ] Verificar com: `dig NS imobiliariaipe.com.br`
- [ ] Testar acesso: https://portal.imobiliariaipe.com.br
- [ ] CloudFlare status: "Active" (no painel)

### Fase 5: SSL Lightsail (EU AJUDO)
- [ ] DNS propagado confirmado ✅
- [ ] Executar bncert-tool no servidor
- [ ] Obter certificado Let's Encrypt
- [ ] Configurar HTTPS redirect
- [ ] Atualizar URLs WordPress HTTP → HTTPS
- [ ] Testar site em HTTPS
- [ ] Verificar renovação automática SSL

### Fase 6: Validação Final (JUNTOS)
- [ ] Site carrega em HTTPS ✅
- [ ] Redirect HTTP → HTTPS funciona
- [ ] Zoho Mail continua funcionando
- [ ] CloudFlare cache ativo
- [ ] SSL Labs test: A+ rating
- [ ] Imóveis carregam corretamente
- [ ] Formulários enviam emails
- [ ] Performance melhorada (cache CloudFlare)

---

## 🚀 BENEFÍCIOS DO CLOUDFLARE

### Performance:
- ⚡ **CDN Global:** Cache em 200+ cidades
- ⚡ **Auto Minify:** Reduz CSS/JS/HTML
- ⚡ **Brotli Compression:** Compressão avançada
- ⚡ **HTTP/2 & HTTP/3:** Protocolos modernos

### Segurança:
- 🛡️ **DDoS Protection:** Proteção contra ataques
- 🛡️ **WAF:** Web Application Firewall (planos pagos)
- 🛡️ **SSL/TLS:** Certificado gratuito CloudFlare
- 🛡️ **Bot Protection:** Bloqueia bots maliciosos

### Confiabilidade:
- 🔄 **Always Online:** Cache quando servidor cai
- 🔄 **Load Balancing:** Distribuição de carga (pagos)
- 🔄 **99.99% Uptime:** Garantia de disponibilidade

### Analytics:
- 📊 **Traffic Analytics:** Visitantes, requisições
- 📊 **Security Events:** Tentativas de ataque
- 📊 **Performance Metrics:** Tempos de carregamento
- 📊 **Cache Analytics:** Taxa de hit/miss

---

## 💡 DICAS IMPORTANTES

### DNS:
```
⚠️ NÃO DELETAR registros Zoho Mail!
   - MX records (mx.zoho.com, mx2.zoho.com)
   - TXT SPF (v=spf1 include:zoho.com ~all)
   - DKIM records (se houver)
   - CNAME mail/webmail (se houver)

✅ APENAS ALTERAR registros A:
   - @ (raiz) → 13.223.237.99
   - portal → 13.223.237.99
   - www → 13.223.237.99
```

### CloudFlare Proxy (☁️):
```
✅ Ativar (laranja) para:
   - A records do site (@, www, portal)
   - Benefícios: CDN, cache, DDoS protection

❌ NÃO ativar (cinza) para:
   - MX records (email)
   - Registros de validação (SPF, DKIM)
   - FTP/SSH (se houver registros específicos)
```

### SSL/TLS Mode:
```
CloudFlare → SSL/TLS → Overview → Encryption mode:

⚠️ NÃO usar "Flexible" (inseguro)
✅ Usar "Full (strict)" após instalar SSL no Lightsail

Timeline:
1. Antes SSL Lightsail: "Full" (temporário)
2. Depois bncert-tool:  "Full (strict)" ✅
```

### Timing:
```
⏰ Melhor horário para mudança:
   - Madrugada (2-6h)
   - Fim de semana
   - Baixo tráfego

⏰ Evitar:
   - Horário comercial
   - Dias úteis
   - Período de alta procura
```

---

## 🆘 POSSÍVEIS PROBLEMAS

### "Site não carrega após mudança DNS"
```
Causa: DNS ainda propagando
Solução: Aguardar 2-12h, verificar com dig NS
```

### "Erro SSL / Not Secure"
```
Causa: SSL não instalado no Lightsail ainda
Solução: 
1. Aguardar DNS propagar PRIMEIRO
2. Depois executar bncert-tool
3. Nunca instalar SSL antes do DNS propagar!
```

### "Emails Zoho pararam de funcionar"
```
Causa: Deletou/alterou registros MX incorretamente
Solução:
1. No CloudFlare, verificar registros MX
2. Devem apontar para mx.zoho.com / mx2.zoho.com
3. Priority: 10 e 20
4. Proxy: OFF (cinza, DNS only)
```

### "Site lento após CloudFlare"
```
Causa: Cache ainda populando
Solução: 
1. Aguardar 24h (cache vai populando)
2. Ativar Auto Minify
3. Configurar Page Rules (plano grátis tem 3)
4. Purge cache se necessário
```

---

## 📞 CONTATOS NECESSÁRIOS

### Registro.br:
- **URL:** https://registro.br/
- **CNPJ:** 06.201.863/0001-03
- **Admin:** Eduardo Maia (edumaias@me.com)
- **Técnico:** José Luiz (jlpaula@terra.com.br)

### CloudFlare:
- **URL:** https://dash.cloudflare.com/
- **Suporte:** https://support.cloudflare.com/
- **Documentação:** https://developers.cloudflare.com/

### Lightsail:
- **IP:** 13.223.237.99
- **SSH:** bitnami@13.223.237.99
- **Key:** /home/jpcardozx/projetos/nova-ipe/scripts/.lightsail-access/LightsailDefaultKey-us-east-1.pem

---

## ✅ RESUMO

**O que você precisa fazer AGORA:**

1. ☎️ **Contatar Eduardo Maia ou José Luiz**
   - Pedir credenciais Registro.br (CNPJ + senha)

2. 🌐 **Criar conta CloudFlare**
   - Adicionar domínio imobiliariaipe.com.br
   - Anotar nameservers fornecidos

3. 📝 **Alterar DNS no Registro.br**
   - Trocar nameservers para CloudFlare
   - Aguardar propagação (4-48h)

4. ⏳ **Aguardar propagação**
   - Verificar com: `dig NS imobiliariaipe.com.br`

5. 🔒 **ME AVISAR quando DNS propagar**
   - Eu instalo SSL via bncert-tool
   - Atualizo URLs para HTTPS
   - Configuro CloudFlare otimizado

---

**Precisa de ajuda em qualquer etapa?** 
**Estou aqui para guiar todo o processo!** 🚀
