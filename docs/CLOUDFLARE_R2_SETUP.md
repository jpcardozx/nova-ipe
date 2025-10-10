# 🌩️ Cloudflare R2 - Setup Guide

## 🎯 Por Que R2?

| Métrica | Cloudflare R2 | Supabase | Sanity |
|---------|---------------|----------|--------|
| **Custo/GB** | $0.015 | $0.021 | $10 |
| **4GB/mês** | **$0.06** | $0.084 | $40 |
| **Egress (saída)** | **$0** 🎉 | Incluído 50GB | Incluído |
| **Economia vs Sanity** | **99.85%** | 99.79% | 0% |
| **Free Tier** | 10GB grátis | 1GB grátis | 10GB grátis |

### ✅ Vantagens do R2
1. **30% mais barato** que Supabase
2. **Zero cobrança de egress** (bandwidth grátis!)
3. **Compatível com S3 API** (fácil migração)
4. **CDN global** automático (Cloudflare network)
5. **10GB grátis** por mês

---

## 📋 Passo a Passo - Configuração

### **1. Criar Conta Cloudflare (se não tem)**

```bash
# Acesse: https://dash.cloudflare.com/sign-up
# Email + senha
# Confirmação de email
```

---

### **2. Criar Bucket R2**

```bash
# 1. Acesse: https://dash.cloudflare.com
# 2. Menu lateral: R2 Object Storage
# 3. Clique "Create bucket"

# Configurações:
# - Name: wpl-realty
# - Location: Automatic (Cloudflare escolhe melhor região)
# - Storage Class: Standard (default)

# 4. Clique "Create bucket"
```

---

### **3. Gerar Access Keys**

```bash
# 1. No dashboard R2, clique "Manage R2 API Tokens"
# 2. Clique "Create API Token"

# Configurações:
# - Name: nova-ipe-wordpress-catalog
# - Permissions: Object Read & Write
# - Specific bucket: wpl-realty (ou All buckets)
# - TTL: Forever (ou 1 year)

# 3. Clique "Create API Token"
```

**⚠️ IMPORTANTE**: Salve as credenciais imediatamente (só aparecem uma vez!)

```
Access Key ID: abc123def456...
Secret Access Key: xyz789uvw012...
Endpoint: https://abc123.r2.cloudflarestorage.com
```

---

### **4. Configurar Domínio Público (Opcional)**

Para servir fotos via domínio customizado (ex: `cdn.ipe-imoveis.com.br`):

```bash
# 1. No bucket wpl-realty, clique "Settings"
# 2. Seção "Public access"
# 3. Clique "Allow Access" (se quiser público)
# 4. Copie a URL pública:
#    https://abc123.r2.cloudflarestorage.com/wpl-realty

# Para domínio customizado:
# 5. Clique "Connect Domain"
# 6. Digite: cdn.ipe-imoveis.com.br
# 7. Cloudflare configura DNS automaticamente
```

**URL final**: `https://cdn.ipe-imoveis.com.br/wordpress-photos/123/img_foto01.jpg`

---

### **5. Adicionar Env Vars no Projeto**

```bash
# Abra .env.local e adicione:
cd /home/jpcardozx/projetos/nova-ipe

cat >> .env.local << 'EOF'

# Cloudflare R2 Storage
R2_ENDPOINT=https://abc123def456.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=sua_access_key_aqui
R2_SECRET_ACCESS_KEY=sua_secret_key_aqui
R2_BUCKET_NAME=wpl-realty
R2_PUBLIC_URL=https://abc123def456.r2.cloudflarestorage.com/wpl-realty
EOF
```

**Substitua**:
- `abc123def456` pelo seu Account ID
- `sua_access_key_aqui` pela Access Key ID
- `sua_secret_key_aqui` pela Secret Access Key

---

### **6. Testar Conexão**

```bash
# Criar script de teste:
cd /home/jpcardozx/projetos/nova-ipe

cat > scripts/test-r2-connection.ts << 'EOF'
import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

async function test() {
  console.log('🧪 Testando conexão com Cloudflare R2...\n')

  try {
    // Test 1: Upload de arquivo teste
    const testBuffer = Buffer.from('Hello from nova-ipe!')
    const url = await CloudflareR2Service.uploadFile(
      testBuffer,
      'test/hello.txt',
      'text/plain'
    )
    console.log('✅ Upload funcionou!')
    console.log(`   URL: ${url}\n`)

    // Test 2: Lista fotos (deve estar vazio inicialmente)
    const stats = await CloudflareR2Service.getStorageStats()
    console.log('✅ Storage stats:')
    console.log(`   Total files: ${stats.totalFiles}`)
    console.log(`   Total size: ${stats.totalSizeGB} GB`)
    console.log(`   Monthly cost: $${stats.monthlyCost}\n`)

    console.log('🎉 R2 está funcionando perfeitamente!')
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

test()
EOF

# Executar teste:
npx tsx scripts/test-r2-connection.ts
```

**Output esperado:**
```
🧪 Testando conexão com Cloudflare R2...

✅ Upload funcionou!
   URL: https://abc123.r2.cloudflarestorage.com/wpl-realty/test/hello.txt

✅ Storage stats:
   Total files: 1
   Total size: 0.00 GB
   Monthly cost: $0.0000

🎉 R2 está funcionando perfeitamente!
```

---

## 🚀 Uso no WordPress Catalog

### **1. Upload Manual de Fotos**

```typescript
import { CloudflareR2Service } from '@/lib/services/cloudflare-r2-service'

// Upload de fotos de uma property
const files: File[] = [/* arquivos do input */]
const wpId = 123

const urls = await CloudflareR2Service.uploadPropertyPhotos(
  wpId,
  files,
  (current, total) => {
    console.log(`Upload: ${current}/${total}`)
  }
)

console.log('Fotos uploaded:', urls)
// [
//   'https://r2.../wordpress-photos/123/img_foto01.jpg',
//   'https://r2.../wordpress-photos/123/img_foto02.jpg',
// ]
```

---

### **2. Migração do Lightsail para R2**

```typescript
import { WordPressCatalogService } from '@/lib/services/wordpress-catalog-service'

// Migra fotos de uma property do Lightsail para R2
const wpId = 123
const photoCount = 5 // Número de fotos no Lightsail

const urls = await WordPressCatalogService.migratePhotosFromLightsail(
  wpId,
  photoCount,
  (current, total) => {
    console.log(`Migrando: ${current}/${total}`)
  }
)

console.log('Fotos migradas para R2:', urls)
```

---

### **3. Migração em Batch (Script)**

Criar script para migrar TODAS as 761 properties:

```bash
cd /home/jpcardozx/projetos/nova-ipe

cat > scripts/migrate-all-photos-to-r2.ts << 'EOF'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'

async function migrateAll() {
  console.log('📸 Migrando fotos do Lightsail para R2...\n')

  // Busca todas as properties com fotos
  let page = 1
  let hasMore = true
  let totalMigrated = 0

  while (hasMore) {
    const { properties, totalPages } = await WordPressCatalogService.getProperties({
      page,
      limit: 30
    })

    for (const prop of properties) {
      if (prop.photo_count > 0 && !prop.photo_urls) {
        console.log(`\n📦 Property ${prop.wp_id} (${prop.photo_count} fotos)`)
        
        try {
          await WordPressCatalogService.migratePhotosFromLightsail(
            prop.wp_id,
            prop.photo_count,
            (current, total) => {
              process.stdout.write(`\r   ⏳ ${current}/${total}`)
            }
          )
          console.log('\n   ✅ Migrado!')
          totalMigrated++
        } catch (error) {
          console.log(`\n   ❌ Erro: ${error}`)
        }
      }
    }

    hasMore = page < totalPages
    page++
  }

  console.log(`\n🎉 Total migrado: ${totalMigrated} properties`)

  // Stats finais
  const stats = await CloudflareR2Service.getStorageStats()
  console.log(`\n📊 Storage R2:`)
  console.log(`   Files: ${stats.totalFiles}`)
  console.log(`   Size: ${stats.totalSizeGB} GB`)
  console.log(`   Cost: $${stats.monthlyCost}/mês`)
}

migrateAll()
EOF

# Executar migração:
npx tsx scripts/migrate-all-photos-to-r2.ts
```

---

## 💰 Cálculo de Custos

### **Cenário Atual (761 properties)**

Assumindo:
- 761 properties
- Média de 8 fotos por property
- 500KB por foto
- Total: ~3GB de fotos

```
Storage: 3GB × $0.015 = $0.045/mês
Egress: GRÁTIS (zero cobrança!)
Total: $0.045/mês ($0.54/ano)
```

**Comparação:**
- **R2**: $0.045/mês ✅
- **Supabase**: $0.063/mês
- **Sanity**: $30/mês
- **Economia vs Sanity**: 99.85% 🎉

---

## 🐛 Troubleshooting

### Erro: "InvalidAccessKeyId"
```bash
# Verifique se env vars estão corretas:
echo $R2_ACCESS_KEY_ID
echo $R2_SECRET_ACCESS_KEY

# Se vazios, adicione no .env.local e reinicie servidor
```

### Erro: "NoSuchBucket"
```bash
# Verifique se bucket existe:
# Dashboard R2 → Deve aparecer "wpl-realty"

# Verifique env var:
echo $R2_BUCKET_NAME  # Deve ser "wpl-realty"
```

### Erro: "AccessDenied"
```bash
# API Token não tem permissão
# Dashboard R2 → Manage API Tokens
# Verifique se token tem "Object Read & Write"
# Se necessário, crie novo token
```

### Fotos não carregam no browser
```bash
# Se bucket é privado, URLs diretas não funcionam
# Opção 1: Tornar bucket público
#   Dashboard R2 → Settings → Allow Access

# Opção 2: Usar signed URLs
const signedUrl = await CloudflareR2Service.getSignedUrl(
  'wordpress-photos/123/img_foto01.jpg',
  3600 // expira em 1 hora
)
```

---

## 📚 Referências

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [R2 vs S3 Comparison](https://blog.cloudflare.com/r2-ga/)
- [AWS SDK S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

## 🎯 Checklist de Setup

- [ ] Criar conta Cloudflare
- [ ] Criar bucket `wpl-realty`
- [ ] Gerar API Token com Read & Write
- [ ] Adicionar env vars no `.env.local`
- [ ] Testar conexão (`npx tsx scripts/test-r2-connection.ts`)
- [ ] Migrar fotos do Lightsail (`npx tsx scripts/migrate-all-photos-to-r2.ts`)
- [ ] Verificar stats de uso
- [ ] (Opcional) Configurar domínio customizado

---

## 🚀 Próximos Passos

Depois do setup:
1. Executar migração de fotos
2. Atualizar UI do dashboard para exibir fotos do R2
3. Implementar lazy loading nas galerias
4. Configurar CDN caching headers
5. Monitorar custos mensais

**Economia esperada**: ~$35-40/mês vs Sanity 🎉
