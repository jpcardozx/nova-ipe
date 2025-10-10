# ⚡ Quick Start - WordPress Catalog com R2

## 🎯 O Que Você Tem Agora

✅ **Service Layer** completo (Supabase + R2 + Sanity)  
✅ **UI/UX profissional** (Framer Motion + TanStack Query)  
✅ **Economia de 99.85%** vs Sanity direto ($0.06 vs $40/mês)  
✅ **Zero erros de tipo** (TypeScript 100%)  
✅ **Scripts de migração** prontos  
✅ **Documentação completa**  

---

## 🚀 Setup em 3 Passos (15 minutos)

### **Passo 1: Configurar Cloudflare R2** (5 min)

```bash
# 1. Acesse https://dash.cloudflare.com
# 2. Menu: R2 Object Storage
# 3. Create bucket: "wpl-realty"
# 4. Manage R2 API Tokens → Create API Token
#    - Name: nova-ipe-catalog
#    - Permissions: Object Read & Write
#    - Bucket: wpl-realty (ou All buckets)
# 5. Copie as credenciais (só aparecem uma vez!)
```

### **Passo 2: Adicionar Credenciais** (2 min)

```bash
# Edite .env.local
nano .env.local

# Adicione (substitua com suas credenciais reais):
R2_ENDPOINT=https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=sua_access_key_aqui
R2_SECRET_ACCESS_KEY=sua_secret_key_aqui
R2_BUCKET_NAME=wpl-realty
R2_PUBLIC_URL=https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com/wpl-realty
```

### **Passo 3: Testar Conexão** (1 min)

```bash
cd /home/jpcardozx/projetos/nova-ipe
npx tsx scripts/test-r2-connection.ts
```

**Output esperado:**
```
🧪 Testando conexão com Cloudflare R2...
══════════════════════════════════════════════════

📤 Test 1: Upload de arquivo teste...
✅ Upload bem-sucedido!
   URL: https://...r2.cloudflarestorage.com/wpl-realty/test/connection-test.txt

📊 Test 2: Storage stats...
✅ Stats obtidas com sucesso!
   Total de arquivos: 1
   Tamanho total: 0.00 GB
   Custo mensal estimado: $0.0000

🧹 Test 3: Limpando arquivo teste...
✅ Arquivo removido!

══════════════════════════════════════════════════
🎉 Todos os testes passaram!
```

---

## 📦 Importar Dados (30 minutos)

### **1. Executar SQL Schema no Supabase** (2 min)

```bash
# 1. Copie o schema:
cat sql/wordpress_catalog_schema.sql

# 2. Abra Supabase Dashboard:
#    https://app.supabase.com → Seu Projeto → SQL Editor

# 3. Cole o SQL completo e execute (Run)

# 4. Verifique:
SELECT COUNT(*) FROM wordpress_properties;
-- Deve retornar 0 (vazio ainda)
```

### **2. Importar 761 Fichas** (5 min)

```bash
npx tsx scripts/import-to-supabase-correct.ts
```

**Output esperado:**
```
🚀 WordPress → Supabase Import
══════════════════════════════════════════════════

📖 Lendo arquivo SQL...
✓ Arquivo carregado (11.42 MB)

🔍 Extraindo properties do SQL...
✓ 761 properties encontradas

📤 Importando para Supabase...
──────────────────────────────────────────────────
⏳ Progresso: 761/761 (100.0%)

✅ Import concluído!
```

### **3. Migrar Fotos para R2** (20-30 min)

```bash
npx tsx scripts/migrate-all-photos-to-r2.ts
```

**O que acontece:**
- ✅ Baixa fotos do Lightsail (13.223.237.99)
- ✅ Upload para R2
- ✅ Atualiza URLs no Supabase
- ✅ Progresso em tempo real

---

## 🎨 Usar o Dashboard

```bash
# Iniciar servidor dev
npm run dev

# Acessar dashboard
open http://localhost:3000/dashboard/wordpress-catalog
```

### **Features Disponíveis:**

1. **📊 Stats em Tempo Real**
   - Total de fichas
   - Por status (pending, reviewing, approved, etc)
   - Prontas para migrar

2. **🔍 Search & Filter**
   - Busca full-text em títulos, descrições, localizações
   - Filtro por status (pills animados)
   - Pagination (30 por página)

3. **🖼️ Property Cards**
   - Thumbnail com gradient overlay
   - Status badge
   - Photo count
   - Localização, specs, preço
   - Hover animations (Framer Motion)

4. **📝 Property Detail Modal**
   - Tab 1: Detalhes (descrição, specs, localização)
   - Tab 2: Fotos (galeria completa)
   - Tab 3: Ações (workflow buttons)

5. **🔄 Workflow de Aprovação**
   ```
   Pending → Iniciar Revisão → Reviewing
            ↓                    ↓
       Aprovar Direto        Aprovar / Rejeitar
            ↓                    ↓
         Approved            Approved / Rejected
            ↓
     Migrar para Sanity
            ↓
         Migrated
   ```

6. **📌 Notas de Revisão**
   - Adicione notas ao aprovar/rejeitar
   - Histórico de notas visível

---

## 💰 Comparação de Custos

| Cenário | Custo/mês | Custo/ano | Economia |
|---------|-----------|-----------|----------|
| **Sanity direto** | $40 | $480 | 0% |
| **Supabase Storage** | $0.084 | $1.01 | 99.79% |
| **Cloudflare R2** | **$0.06** | **$0.72** | **99.85%** ✅ |

**Economia anual**: $479.28 (quase R$ 2.500!)

---

## 📁 Estrutura de Arquivos

```
├── lib/services/
│   ├── cloudflare-r2-service.ts        ← Novo! R2 upload/download
│   └── wordpress-catalog-service.ts    ← Atualizado! Usa R2
│
├── sql/
│   └── wordpress_catalog_schema.sql    ← Schema Supabase
│
├── app/dashboard/wordpress-catalog/
│   └── page.tsx                        ← UI/UX completa
│
├── components/ui/
│   └── tabs.tsx                        ← Custom tabs component
│
├── scripts/
│   ├── test-r2-connection.ts          ← Teste R2
│   ├── import-to-supabase-correct.ts  ← Import SQL → Supabase
│   └── migrate-all-photos-to-r2.ts    ← Lightsail → R2
│
└── docs/
    ├── CLOUDFLARE_R2_SETUP.md                    ← Setup R2 detalhado
    ├── WORDPRESS_CATALOG_IMPLEMENTATION_GUIDE.md ← Guia completo
    ├── WORDPRESS_CATALOG_OPTIMIZED_SOLUTION.md   ← Arquitetura
    └── R2_INTEGRATION_SUMMARY.md                 ← Resumo executivo
```

---

## 🔧 Troubleshooting

### ❌ "InvalidAccessKeyId"
```bash
# Credenciais erradas no .env.local
# Solução: Verifique R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY
```

### ❌ "NoSuchBucket"
```bash
# Bucket não existe
# Solução: Crie bucket "wpl-realty" no Cloudflare Dashboard
```

### ❌ "Failed to fetch"
```bash
# Supabase não configurado
# Solução: Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### ❌ Stats aparecem zerados
```bash
# Dados não foram importados
# Solução: Execute npx tsx scripts/import-to-supabase-correct.ts
```

---

## 📚 Documentação Completa

- **Setup R2**: `docs/CLOUDFLARE_R2_SETUP.md` (400 linhas)
- **Guia Implementação**: `docs/WORDPRESS_CATALOG_IMPLEMENTATION_GUIDE.md` (600 linhas)
- **Arquitetura**: `docs/WORDPRESS_CATALOG_OPTIMIZED_SOLUTION.md` (450 linhas)
- **Resumo R2**: `docs/R2_INTEGRATION_SUMMARY.md` (250 linhas)

---

## ✅ Checklist

### Setup (15 min)
- [ ] Criar bucket R2 no Cloudflare
- [ ] Gerar API Token
- [ ] Adicionar env vars no .env.local
- [ ] Testar conexão (`test-r2-connection.ts`)

### Import (30 min)
- [ ] Executar SQL schema no Supabase
- [ ] Importar 761 fichas (`import-to-supabase-correct.ts`)
- [ ] Migrar fotos para R2 (`migrate-all-photos-to-r2.ts`)

### Uso (ongoing)
- [ ] Abrir dashboard
- [ ] Revisar fichas
- [ ] Aprovar melhores
- [ ] Migrar para Sanity

---

## 🎯 Resultado Final

```
✅ 761 fichas no Supabase
✅ ~3GB de fotos no R2
✅ Custo: $0.06/mês (vs $40/mês)
✅ Economia: 99.85%
✅ UI/UX profissional
✅ Workflow de aprovação
✅ Zero type errors
```

---

## 🚀 Comando Único para Tudo

```bash
# 1. Setup R2 (manual no Cloudflare Dashboard)
# 2. Adicionar env vars (manual no .env.local)

# 3. Testar + Importar + Migrar (automático)
npx tsx scripts/test-r2-connection.ts && \
npx tsx scripts/import-to-supabase-correct.ts && \
npx tsx scripts/migrate-all-photos-to-r2.ts

# 4. Abrir dashboard
npm run dev
```

**Tempo total**: 45 minutos  
**Economia anual**: $479 🎉

---

**Pronto para começar?** 🚀  
Acesse: https://dash.cloudflare.com
