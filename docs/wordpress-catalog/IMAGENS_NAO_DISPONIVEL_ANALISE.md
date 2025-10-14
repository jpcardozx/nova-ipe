# 📸 Análise: Imagens Não Disponíveis - WordPress Catalog

**Data:** 13 de outubro de 2025  
**Status:** ⚠️ CRÍTICO - Imagens não carregando  
**Impacto:** Alto - 100% das propriedades sem preview visual

---

## 🔍 Diagnóstico do Problema

### Sintomas Observados
```
⚠️ Imagem indisponível: http://13.223.237.99/wp-content/uploads/WPL/859/thimg_foto01_640x480.jpg
⚠️ Imagem indisponível: http://13.223.237.99/wp-content/uploads/WPL/846/thimg_foto01_640x480.jpg
⚠️ Imagem indisponível: http://13.223.237.99/wp-content/uploads/WPL/845/thimg_foto01_640x480.jpg
```

### Teste de Conectividade

```bash
# Servidor WordPress está online
curl -I http://13.223.237.99/
# ✅ HTTP/1.1 200 OK

# Mas as imagens retornam 404
curl -I http://13.223.237.99/wp-content/uploads/WPL/859/thimg_foto01_640x480.jpg
# ❌ HTTP/1.1 404 Not Found

# Teste com caminho alternativo (do banco)
curl -I http://13.223.237.99/wp-content/uploads/wplpro/properties/859/1.jpg
# ❌ HTTP/1.1 404 Not Found
```

### Dados do Banco (Supabase)

```javascript
{
  wp_id: 859,
  photo_count: 32,
  thumbnail_url: 'https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/859/1.jpg',
  photo_urls: Array(32), // 32 fotos cadastradas
}
```

**Problema identificado:**
- `wpl-imoveis.com` não resolve DNS (domínio inexistente ou offline)
- Servidor Lightsail não possui as imagens nos caminhos esperados
- URLs do banco apontam para servidor externo indisponível

---

## 📊 Análise de Causa Raiz

### 1. **Arquitetura Antiga (WordPress)**
   - **Servidor:** AWS Lightsail (13.223.237.99)
   - **Caminho esperado:** `/wp-content/uploads/WPL/{wp_id}/`
   - **Status:** ❌ Imagens não encontradas (404)

### 2. **URLs no Banco de Dados**
   - **Domínio:** `wpl-imoveis.com` 
   - **Status:** ❌ DNS não resolve
   - **Problema:** URLs apontam para servidor WordPress externo que não existe

### 3. **Migração Incompleta**
   - ✅ Fichas importadas para Supabase (761 propriedades)
   - ✅ Metadados completos (descrições, specs, preços)
   - ❌ **Fotos NÃO migradas para Cloudflare R2**
   - ❌ `photo_urls` no banco contém URLs inválidas

---

## 🎯 Solução Implementada (Temporária)

### Alterações em `PropertyCard.tsx`

**Antes:**
```tsx
// ❌ Gerava URLs do Lightsail que não existem
const imageUrl = getBestPhotoUrl(
  property.thumbnail_url || property.photo_urls?.[0],
  property.wp_id,
  1
)
```

**Depois:**
```tsx
// ✅ Valida URLs do R2, mostra placeholder se indisponível
const imageUrl = property.photo_urls?.[0] || property.thumbnail_url
const hasValidImage = imageUrl && (
  imageUrl.includes('r2.cloudflarestorage.com') || 
  imageUrl.includes('pub-') ||
  !imageUrl.includes('wpl-imoveis.com') // Exclui URLs inválidas
)

// Mostra placeholder elegante
{hasValidImage && !imageError ? (
  <NextImage src={imageUrl!} ... />
) : (
  <div>
    <Home icon />
    <span>{property.photo_count} fotos</span>
    <span>Aguardando migração</span>
  </div>
)}
```

---

## 🚀 Solução Definitiva (Roadmap)

### Opção 1: Migração para Cloudflare R2 ⭐ RECOMENDADO

**Por quê?**
- 30% mais barato que S3
- Zero egress costs
- Performance superior (CDN global)
- Compatível com S3 API

**Passos:**

1. **Criar Bucket R2**
   ```bash
   # Via Cloudflare Dashboard
   Bucket name: ipe-imoveis-fotos
   Region: Auto (worldwide CDN)
   Public access: Enabled (read-only)
   ```

2. **Script de Migração**
   ```typescript
   // scripts/migrate-photos-to-r2.ts
   import { CloudflareR2Service } from '@/lib/services/cloudflare-r2-service'
   import { WordPressCatalogService } from '@/lib/services/wordpress-catalog-service'
   
   async function migratePhotos() {
     const properties = await WordPressCatalogService.getAll()
     
     for (const property of properties) {
       if (property.photo_count === 0) continue
       
       const photoUrls = []
       
       // Download de cada foto do WordPress (se disponível)
       for (let i = 1; i <= property.photo_count; i++) {
         const oldUrl = `http://13.223.237.99/wp-content/uploads/WPL/${property.wp_id}/img_foto${i.toString().padStart(2, '0')}.jpg`
         
         try {
           const response = await fetch(oldUrl)
           if (!response.ok) continue
           
           const buffer = await response.arrayBuffer()
           const r2Url = await CloudflareR2Service.uploadPhoto(
             buffer,
             `wordpress/${property.wp_id}/${i}.jpg`,
             'image/jpeg'
           )
           
           photoUrls.push(r2Url)
         } catch (error) {
           console.error(`Failed to migrate ${oldUrl}:`, error)
         }
       }
       
       // Atualiza banco com novas URLs
       await WordPressCatalogService.update(property.id, {
         photo_urls: photoUrls,
         thumbnail_url: photoUrls[0]
       })
       
       console.log(`✅ Migrated ${photoUrls.length} photos for property ${property.wp_id}`)
     }
   }
   ```

3. **Atualizar next.config.js**
   ```javascript
   // Já configurado:
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com',
       },
       {
         protocol: 'https',
         hostname: '*.r2.cloudflarestorage.com',
       }
     ]
   }
   ```

4. **Executar Migração**
   ```bash
   pnpm tsx scripts/migrate-photos-to-r2.ts
   ```

**Estimativa:**
- 761 propriedades × 15 fotos média = ~11.400 fotos
- Tamanho médio: 200KB por foto = ~2.3GB total
- Custo R2: $0.015/GB/mês = **~$0.03/mês**
- Egress: **$0** (vantagem do R2)
- Tempo estimado: 2-3 horas de processamento

---

### Opção 2: Usar Sanity.io Assets ⚡ FUTURO

**Quando usar:**
- Após migração seletiva para Sanity CMS
- Apenas para imóveis "approved" e "migrated"
- Assets gerenciados pelo Sanity com otimização automática

**Vantagens:**
- CDN global embutido
- Transformações de imagem on-the-fly
- Hotspot/crop inteligente
- Integração nativa com CMS

**Desvantagens:**
- Custo mais alto ($99/mês no Growth plan)
- Vendor lock-in

---

## 📈 Métricas de Sucesso

### Antes (Atual)
- ❌ 0% de imagens carregando
- ❌ UX ruim (placeholders em todos os cards)
- ❌ Impossível avaliar propriedades visualmente

### Depois (Meta)
- ✅ 95%+ de imagens disponíveis
- ✅ Load time < 2s (lazy loading + CDN)
- ✅ Experiência visual profissional
- ✅ Bandwidth otimizado (Next.js Image + R2)

---

## ⚙️ Configurações de Otimização

### Next.js Image Optimization

```tsx
<NextImage
  src={r2Url}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  quality={75} // Balanço qualidade/tamanho
  priority={index === 0} // First card LCP
  unoptimized={false} // Usa otimização do Next.js
/>
```

### Cloudflare R2 Settings

```json
{
  "public_access": "read-only",
  "cors": {
    "allowed_origins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://imobiliariaipe.com.br",
      "https://www.imobiliariaipe.com.br"
    ],
    "allowed_methods": ["GET", "HEAD"],
    "allowed_headers": ["*"],
    "max_age": 3600
  },
  "cache_control": "public, max-age=31536000, immutable"
}
```

---

## 🔒 Segurança

### Proteção de URLs
- ✅ Public read-only (sem listagem)
- ✅ HTTPS only
- ✅ CORS configurado
- ✅ Rate limiting via Cloudflare

### Backup
- ✅ Fotos originais mantidas no WordPress (backup)
- ✅ R2 com versionamento (opcional)
- ✅ Sync incremental para evitar re-upload

---

## 📝 Checklist de Implementação

### Fase 1: Preparação ⏳
- [ ] Criar conta Cloudflare R2 (se não existir)
- [ ] Configurar bucket `ipe-imoveis-fotos`
- [ ] Gerar API keys (R2 Access Key + Secret)
- [ ] Adicionar variáveis de ambiente no `.env.local`
- [ ] Testar upload manual de 1 foto

### Fase 2: Script de Migração ⏳
- [ ] Implementar `migrate-photos-to-r2.ts`
- [ ] Adicionar progress bar (cli-progress)
- [ ] Implementar retry logic (3 tentativas)
- [ ] Logging detalhado (sucessos + falhas)
- [ ] Dry-run mode para testes

### Fase 3: Execução ⏳
- [ ] Backup do banco Supabase (snapshot)
- [ ] Executar migração em lote (100 props/vez)
- [ ] Monitorar erros e corrigir
- [ ] Validar URLs no banco após migração

### Fase 4: Validação ✅
- [ ] Testar carregamento no dashboard
- [ ] Verificar performance (Lighthouse)
- [ ] Confirmar lazy loading funcionando
- [ ] Testar em mobile/desktop

### Fase 5: Cleanup ⏳
- [ ] Remover código legacy (Lightsail URLs)
- [ ] Atualizar documentação
- [ ] Commit + deploy

---

## 💰 Análise de Custos

### Cloudflare R2
- **Storage:** $0.015/GB/mês
- **Class A Ops** (writes): $4.50/million
- **Class B Ops** (reads): $0.36/million
- **Egress:** **FREE** 🎉

### Estimativa Mensal (11.400 fotos, 2.3GB)
```
Storage: 2.3 GB × $0.015 = $0.03/mês
Writes (migração única): 11,400 × $4.50/1M = $0.05 (one-time)
Reads (30k views/mês): 30,000 × $0.36/1M = $0.01/mês
---
Total: ~$0.04/mês 💰
```

**Comparação com S3:**
- S3 storage: 2.3 GB × $0.023 = $0.05/mês
- S3 egress: 10 GB × $0.09 = **$0.90/mês**
- **Economia R2:** ~$0.90/mês ✅

---

## 📞 Suporte e Referências

### Links Úteis
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

### Contatos
- **DevOps:** jpcardozx
- **Cloudflare Support:** dashboard > support
- **Urgências:** WhatsApp da imobiliária

---

## ✅ Status Atual

**Data:** 13/10/2025  
**Implementado:**
- ✅ Placeholder elegante para imagens indisponíveis
- ✅ Validação de URLs (exclui domínios offline)
- ✅ Error handling com fallback visual
- ✅ Dark mode no placeholder

**Próximos Passos:**
1. Implementar migração para R2 (ALTA PRIORIDADE)
2. Testar com 10 propriedades primeiro
3. Rollout completo após validação
4. Monitorar performance e custos

---

**🎯 Objetivo:** Restaurar 100% das imagens até 20/10/2025
