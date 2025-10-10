# 🔐 INFORMAÇÕES DE ACESSO E DNS - WordPress Migrado

**Data:** 8 de outubro de 2025  
**Servidor:** AWS Lightsail (13.223.237.99)

---

## 1️⃣ SEUS LOGINS NO WP-ADMIN

### 👤 Usuários Disponíveis (5 contas)

| ID | Login | Email | Nome | Provável Função |
|----|-------|-------|------|-----------------|
| **1** | **admin** | rfpaula2005@gmail.com | admin | **👑 Administrador** |
| **2** | **jlpaula** | jlpaula@terra.com.br | José Luiz | **👑 Administrador** |
| 3 | corretor01 | ipeimoveis@imobiliariaipe.com.br | Corretor | 👔 Corretor |
| 4 | rfpaula | rfpaula.2005@gmail.com | Rodrigo | 👔 Usuário |
| **5** | **jpcardozo** | jpcardozo@imobiliariaipe.com.br | JP Cardozo | **👑 Você!** |

### 🎯 Suas Credenciais Prováveis

**Opção 1 (Sua conta):**
- **Login:** `jpcardozo`
- **Email:** jpcardozo@imobiliariaipe.com.br
- **Senha:** ❓ (a mesma que você usa no site atual da Locaweb)

**Opção 2 (Conta admin):**
- **Login:** `admin`
- **Email:** rfpaula2005@gmail.com
- **Senha:** ❓ (a mesma que você usa no site atual da Locaweb)

### 🔓 Como Acessar

**URL temporária (via IP):**
```
http://13.223.237.99/wp-admin
```

**URL final (após DNS):**
```
https://portal.imobiliariaipe.com.br/wp-admin
```

### ⚠️ Senha Esquecida?

Se não lembrar da senha, posso resetar via SSH:

**Opção A - Resetar via WP-CLI:**
```bash
ssh bitnami@13.223.237.99
cd /opt/bitnami/wordpress
wp user update jpcardozo --user_pass="SuaNovaSenha123" --allow-root
```

**Opção B - Resetar via MySQL:**
```bash
ssh bitnami@13.223.237.99
mysql -u wp_imobiliaria -pIpe@5084 wp_imobiliaria
UPDATE wp_users SET user_pass = MD5('SuaNovaSenha123') WHERE user_login = 'jpcardozo';
```

---

## 2️⃣ DNS - PODE GERENCIAR PELA AWS SIM! ✅

### 🌐 Amazon Lightsail DNS (Recomendado e GRÁTIS!)

**Sim, você pode gerenciar DNS direto pelo Lightsail!**

#### Vantagens:
- ✅ **100% integrado** com seu servidor Lightsail
- ✅ **GRÁTIS** (incluído no plano)
- ✅ **Simples** de configurar
- ✅ **Rápido** de propagar (geralmente 5-15 minutos)
- ✅ **Nameservers da AWS** (confiáveis)

#### Como Configurar:

**1. No Console AWS Lightsail:**
```
1. Acessar: https://lightsail.aws.amazon.com/
2. Menu lateral: "Networking" → "DNS zones"
3. Clicar: "Create DNS zone"
4. Informar domínio: imobiliariaipe.com.br
5. Criar registros:
   - portal.imobiliariaipe.com.br → A → 13.223.237.99
   - www.portal.imobiliariaipe.com.br → CNAME → portal.imobiliariaipe.com.br
```

**2. AWS vai fornecer nameservers tipo:**
```
ns-123.awsdns-12.com
ns-456.awsdns-45.net
ns-789.awsdns-78.org
ns-012.awsdns-01.co.uk
```

**3. Apontar no Registro.br:**
```
- Ir em: https://registro.br
- Login com seu CPF/CNPJ
- Selecionar: imobiliariaipe.com.br
- Alterar DNS → DNS Customizado
- Adicionar os 4 nameservers da AWS
```

**4. Aguardar propagação (24-48h no máximo)**

---

### 🔵 Alternativas de DNS

#### A) CloudFlare (Recomendado para Proteção Extra)

**Vantagens:**
- ✅ **Proteção DDoS** gratuita
- ✅ **CDN global** (site mais rápido)
- ✅ **SSL automático** (certificado gratuito)
- ✅ **Analytics** detalhados
- ✅ **Firewall** (bloqueia ataques)
- ✅ **Cache** inteligente

**Como usar:**
```
1. Criar conta: https://www.cloudflare.com/
2. Adicionar domínio: imobiliariaipe.com.br
3. CloudFlare vai escanear DNS existente
4. Adicionar registro: portal → A → 13.223.237.99
5. Apontar nameservers no Registro.br (CloudFlare fornece)
6. Ativar proxy (nuvem laranja) ☁️
```

**⭐ Recomendação:** CloudFlare é MELHOR que AWS DNS porque adiciona camada de proteção e performance sem custo!

#### B) Registro.br (Seu Atual)

**Se quiser manter simples:**
```
1. Login: https://registro.br
2. DNS do Domínio: imobiliariaipe.com.br
3. Adicionar registro A:
   - Nome: portal
   - Tipo: A
   - Valor: 13.223.237.99
   - TTL: 3600
```

**Desvantagens:**
- ❌ Sem proteção DDoS
- ❌ Sem CDN
- ❌ Sem SSL automático
- ❌ Interface menos amigável

---

## 3️⃣ PLUGIN REAL ESTATE - SIM, JÁ CORRIGI! ✅

### ✅ O que foi feito:

**Nome ANTES da correção:**
```
real-estate-listing-realtyna-wpl_temporariamentedesativado
```

**Nome DEPOIS da correção:**
```
real-estate-listing-realtyna-wpl
```

### 🔧 Comando executado:

```bash
cd /opt/bitnami/wordpress/wp-content/plugins/
sudo mv real-estate-listing-realtyna-wpl_temporariamentedesativado \
       real-estate-listing-realtyna-wpl
sudo chown -R bitnami:daemon real-estate-listing-realtyna-wpl
```

### ✅ Status Atual:

```
✅ Plugin renomeado
✅ Permissões corretas (bitnami:daemon)
✅ Estrutura validada:
   - assets/
   - config.php
   - controller.php
   - extensions.php
   - global.php
   - languages/
```

### ⚠️ Falta apenas ATIVAR no WordPress!

**O plugin está disponível mas não ativo ainda.**

**Para ativar:**
1. Acessar: http://13.223.237.99/wp-admin
2. Menu: Plugins → Plugins Instalados
3. Procurar: "Real Estate Listing - Realtyna WPL"
4. Clicar: **Ativar**

Ou via SSH:
```bash
ssh bitnami@13.223.237.99
cd /opt/bitnami/wordpress
wp plugin activate real-estate-listing-realtyna-wpl --allow-root
```

---

## 📊 RESUMO DAS RESPOSTAS

| Pergunta | Resposta Curta |
|----------|----------------|
| **Login WP-Admin?** | `jpcardozo` ou `admin` - mesmas senhas do site antigo |
| **DNS pela AWS?** | ✅ **SIM!** Lightsail tem DNS grátis e integrado |
| **Melhor opção DNS?** | 🏆 **CloudFlare** (proteção + CDN + SSL grátis) |
| **Plugin corrigido?** | ✅ **SIM!** Renomeado, só falta ativar no admin |

---

## 🎯 PRÓXIMAS AÇÕES RECOMENDADAS

### 1️⃣ AGORA (5 minutos)
```
✅ Fazer login: http://13.223.237.99/wp-admin
✅ Ativar plugin WPL (imóveis)
✅ Verificar se imóveis aparecem
```

### 2️⃣ HOJE (30 minutos)
```
☁️ Criar conta CloudFlare (grátis)
☁️ Adicionar domínio imobiliariaipe.com.br
☁️ Configurar registro: portal → A → 13.223.237.99
☁️ Apontar nameservers no Registro.br
```

### 3️⃣ DEPOIS (aguardar DNS propagar - 24-48h)
```
🔒 Instalar SSL Let's Encrypt
🧪 Testar site completo
📱 Testar mobile
🎨 Verificar imóveis e imagens
```

---

## 🆘 PRECISA DE AJUDA?

### Resetar Senha
```bash
# Me avise e executo:
ssh bitnami@13.223.237.99
cd /opt/bitnami/wordpress
wp user update jpcardozo --user_pass="NovaSenha123!" --allow-root
```

### Ativar Plugin WPL via SSH
```bash
ssh bitnami@13.223.237.99
cd /opt/bitnami/wordpress
wp plugin activate real-estate-listing-realtyna-wpl --allow-root
wp plugin list --allow-root
```

### Configurar CloudFlare
```
1. CloudFlare vai pedir pra apontar nameservers
2. Você aponta no Registro.br
3. CloudFlare detecta automaticamente em ~5 min
4. Ativa SSL automático
5. Site fica protegido e mais rápido!
```

---

**🎉 Tudo pronto no servidor novo!**  
**Agora é só acessar o admin e configurar o DNS!**
