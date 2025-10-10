# 🔑 Como Obter R2 Access Keys - Guia Passo a Passo

## 📍 Localização das Credenciais

As **R2 Access Keys** não ficam no bucket! Elas ficam em um lugar separado.

---

## 🎯 Passo a Passo (5 minutos)

### **1. Acesse o Cloudflare Dashboard**
```
https://dash.cloudflare.com
```

### **2. Menu Lateral → R2**
```
Clique em "R2 Object Storage" no menu esquerdo
```

### **3. Clique em "Manage R2 API Tokens"**
```
É um botão no topo da página R2, ao lado de "Create bucket"
```

![Localização](https://i.imgur.com/example.png)

### **4. Clique "Create API Token"**

Preencha:
```
┌─────────────────────────────────────────┐
│ Token Name:                             │
│ ┌─────────────────────────────────────┐ │
│ │ nova-ipe-wordpress-catalog          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Permissions:                            │
│ ┌─────────────────────────────────────┐ │
│ │ ☑ Admin Read & Write                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Bucket Scope:                           │
│ ┌─────────────────────────────────────┐ │
│ │ ○ All buckets                       │ │
│ │ ● Specific bucket: wpl-realty       │ │  ← Recomendado
│ └─────────────────────────────────────┘ │
│                                         │
│ TTL (Time to Live):                     │
│ ┌─────────────────────────────────────┐ │
│ │ Forever (or 1 year)                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

           [Create API Token]
```

### **5. COPIE AS CREDENCIAIS IMEDIATAMENTE!**

⚠️ **ATENÇÃO**: As credenciais só aparecem UMA VEZ!

Você verá algo assim:
```bash
┌────────────────────────────────────────────────────────────┐
│ ✅ API Token Created Successfully                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Access Key ID:                                             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ a1b2c3d4e5f6g7h8i9j0                                   │ │ ← COPIE!
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ Secret Access Key:                                         │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ XyZ789AbC123DeF456GhI789JkL012MnO345PqR678             │ │ ← COPIE!
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ Endpoint for S3 Clients:                                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ https://c5aff409f2452f34ccab6276da473130.r2.cloudflare │ │ ← Já temos!
│ │ storage.com                                            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ Jurisdiction: EU / US / Global                             │
└────────────────────────────────────────────────────────────┘

    [Copy Access Key ID]  [Copy Secret Access Key]
```

### **6. Cole as Credenciais no .env.local**

```bash
cd /home/jpcardozx/projetos/nova-ipe

# Edite .env.local
nano .env.local

# Adicione (substitua com os valores reais):
R2_ENDPOINT=https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
R2_SECRET_ACCESS_KEY=XyZ789AbC123DeF456GhI789JkL012MnO345PqR678
R2_BUCKET_NAME=wpl-realty
R2_PUBLIC_URL=https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com/wpl-realty
```

---

## 🔍 Se Você Não Encontrou "Manage R2 API Tokens"

### Verifique se está no lugar certo:
```
1. Dashboard → https://dash.cloudflare.com
2. Selecione sua conta (dropdown no topo)
3. Menu lateral → R2 Object Storage
4. No topo da página, deve ter:
   [Overview] [Manage R2 API Tokens] [Create bucket]
```

### Se R2 não aparecer no menu:
```
R2 pode não estar habilitado na sua conta.

Solução:
1. Dashboard → R2
2. Se pedir para habilitar, clique "Enable R2"
3. Aceite os termos
4. Aguarde alguns minutos
5. Recarregue a página
```

---

## 🆘 Se Já Criou o Token e Perdeu

**Não é possível ver o Secret Access Key novamente!**

Solução:
1. Dashboard → R2 → Manage R2 API Tokens
2. Delete o token antigo (clique nos 3 pontos → Delete)
3. Crie um novo token (repita o processo acima)

---

## ✅ Testar se Funcionou

```bash
cd /home/jpcardozx/projetos/nova-ipe

# Teste a conexão:
npx tsx scripts/test-r2-connection.ts
```

**Se funcionar**, você verá:
```
🧪 Testando conexão com Cloudflare R2...
══════════════════════════════════════════════════

📤 Test 1: Upload de arquivo teste...
✅ Upload bem-sucedido!

📊 Test 2: Storage stats...
✅ Stats obtidas com sucesso!

🎉 Todos os testes passaram!
```

**Se der erro**, você verá qual o problema:
- `InvalidAccessKeyId` → Credenciais erradas
- `NoSuchBucket` → Bucket não existe
- `AccessDenied` → Token sem permissão

---

## 🎯 Resumo

1. ✅ Dashboard → R2
2. ✅ "Manage R2 API Tokens"
3. ✅ "Create API Token"
4. ✅ Copiar Access Key ID + Secret Access Key
5. ✅ Colar no .env.local
6. ✅ Testar: `npx tsx scripts/test-r2-connection.ts`

---

## 📸 Screenshots de Referência

### Tela R2 Overview
```
┌─────────────────────────────────────────────────────┐
│ 🌩️ R2 Object Storage                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Overview] [Manage R2 API Tokens] [Create bucket] │ ← AQUI!
│                                                     │
│  📦 Buckets (1)                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ wpl-realty                                  │   │
│  │ 0 objects | 0 B                             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Tela API Tokens
```
┌─────────────────────────────────────────────────────┐
│ 🔑 R2 API Tokens                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Create API Token]                    [← Back]    │
│                                                     │
│  📋 Active Tokens (0)                               │
│  No tokens yet. Create your first token.           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Dicas Importantes

1. **Guarde as credenciais em local seguro** (Password Manager)
2. **Nunca commite o .env.local no Git** (já está no .gitignore)
3. **Use permissões específicas** (bucket wpl-realty apenas)
4. **Crie um token por projeto/ambiente** (dev, staging, prod)

---

## 🚀 Depois do Setup

Após obter as credenciais e testar:
```bash
# 1. Executar SQL schema no Supabase (manual)
# 2. Importar fichas
npx tsx scripts/import-to-supabase-correct.ts

# 3. Migrar fotos
npx tsx scripts/migrate-all-photos-to-r2.ts

# 4. Abrir dashboard
npm run dev
```

---

## 📞 Precisa de Ajuda?

- **Docs Cloudflare**: https://developers.cloudflare.com/r2/api/s3/tokens/
- **Suporte**: https://community.cloudflare.com/c/developers/r2/
