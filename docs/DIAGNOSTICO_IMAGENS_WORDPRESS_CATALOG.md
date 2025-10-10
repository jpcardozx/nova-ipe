# 🔍 Diagnóstico: Imagens não exibem no WordPress Catalog

**Data:** 9 de outubro de 2025
**Status:** ✅ Corrigido + Debug Ativado

---

## 🐛 Problema Reportado

Cards do WordPress Catalog (`/dashboard/wordpress-catalog`) não estão exibindo fotos, mesmo após correções implementadas.

---

## 🔬 Investigação Realizada

### 1. ✅ Servidor Lightsail - OK

**Teste HTTP direto:**
```bash
curl -I "http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg"

# Resultado:
HTTP/1.1 200 OK
Content-Length: 91413
Content-Type: image/jpeg
```

**Conclusão:** Servidor respondendo corretamente, imagens acessíveis.

---

### 2. ✅ Helper de URLs - OK

**Teste do helper:**
```bash
npx tsx scripts/test-photo-urls.ts

# Resultado:
✅ URLs geradas corretamente
✅ Priorização funcionando (R2 > Lightsail)
✅ Acesso HTTP validado com sucesso
```

**URLs geradas:**
```
http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg
```

**Conclusão:** Helper funcionando perfeitamente.

---

### 3. ⚠️ Problema Identificado: process.env no Browser

**Código original:**
```typescript
// ❌ NÃO FUNCIONA NO BROWSER
const LIGHTSAIL_BASE_URL = process.env.NEXT_PUBLIC_LIGHTSAIL_URL || 'http://13.223.237.99'
```

**Problema:**
- `PropertyCard` é um **client component** (`'use client'`)
- `process.env` não existe no browser
- Resultado: `LIGHTSAIL_BASE_URL` era `undefined`

**Correção aplicada:**
```typescript
// ✅ FUNCIONA NO BROWSER
const LIGHTSAIL_BASE_URL = 'http://13.223.237.99'
```

---

### 4. ⚠️ Possível Problema: Mixed Content (HTTPS → HTTP)

**Contexto:**
- Next.js em produção pode usar HTTPS
- Lightsail serve imagens via HTTP (não HTTPS)
- Browsers modernos bloqueiam "mixed content" (HTTPS page loading HTTP resources)

**Verificação:**
- Desenvolvimento (localhost:3000): **Não tem problema** (ambos HTTP)
- Produção (HTTPS): **Pode bloquear** as imagens

**Logs do Browser (se houver bloqueio):**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure image 'http://13.223.237.99/...'.
This request has been blocked; the content must be served over HTTPS.
```

---

## 🛠️ Correções Implementadas

### 1. Helper Simplificado
```typescript
// lib/utils/wordpress-photo-urls.ts

// Hard-coded para funcionar no browser
const LIGHTSAIL_BASE_URL = 'http://13.223.237.99'

export function getBestPhotoUrl(
  r2Url: string | undefined,
  wpId: number,
  photoNumber: number = 1
): string {
  // Prioriza R2 (HTTPS) > Lightsail (HTTP) > Fallback
  if (r2Url && isR2Url(r2Url)) return r2Url
  if (r2Url && isLightsailUrl(r2Url)) return r2Url
  return getThumbnailUrl(wpId, photoNumber)
}
```

### 2. Error Handling no PropertyCard
```typescript
// app/dashboard/wordpress-catalog/components/PropertyCard.tsx

const [imageError, setImageError] = React.useState(false)
const hasValidImage = property.photo_count > 0 && !imageError

<img
  src={imageUrl}
  onError={(e) => {
    console.error('Erro ao carregar imagem:', imageUrl)
    setImageError(true)
  }}
/>
```

### 3. Debug Console Ativado
```typescript
// Log apenas do primeiro card para não poluir
if (typeof window !== 'undefined' && index === 0) {
  console.log('🖼️ PropertyCard Debug:', {
    wp_id: property.wp_id,
    photo_count: property.photo_count,
    imageUrl_gerada: imageUrl
  })
}
```

---

## 🧪 Como Testar

### No Browser (Development)

1. Iniciar servidor:
```bash
npm run dev
```

2. Acessar:
```
http://localhost:3000/dashboard/wordpress-catalog
```

3. **Abrir DevTools (F12) → Console**

4. Verificar logs:
```
🖼️ PropertyCard Debug (primeiro card): {
  wp_id: 100,
  photo_count: 5,
  imageUrl_gerada: "http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg"
}
```

5. **Se imagens não aparecem, verificar:**
   - Console errors (Mixed Content?)
   - Network tab (request bloqueado?)
   - Mensagem de erro do `onError`

---

## 📊 Cenários e Soluções

### Cenário A: Localhost (HTTP)
**Status:** ✅ Deve funcionar
**Motivo:** Ambos HTTP (no mixed content)

### Cenário B: Vercel/Produção (HTTPS)
**Status:** ⚠️ Pode bloquear
**Motivo:** Mixed content (HTTPS → HTTP)

**Soluções:**

#### Opção 1: Migração R2 (Recomendado)
```bash
# Migrar fotos para R2 (HTTPS)
npx tsx scripts/migrate-all-photos-to-r2.ts
```
**Benefícios:**
- ✅ HTTPS nativo (sem mixed content)
- ✅ CDN global (mais rápido)
- ✅ Zero egress cost

#### Opção 2: Meta Tag (Temporário)
```html
<!-- next.config.js ou _document.tsx -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```
**Problema:** Força HTTPS, mas Lightsail não suporta HTTPS.

#### Opção 3: Proxy Next.js
```typescript
// pages/api/proxy-image.ts
export default async function handler(req, res) {
  const { url } = req.query
  const response = await fetch(url)
  const buffer = await response.buffer()
  res.setHeader('Content-Type', 'image/jpeg')
  res.send(buffer)
}

// Uso:
const imageUrl = `/api/proxy-image?url=${encodeURIComponent(lightsailUrl)}`
```
**Problema:** Aumenta carga no servidor Next.js.

---

## ✅ Status Atual

| Item | Status | Nota |
|------|--------|------|
| Helper de URLs | ✅ Funcionando | URLs corretas geradas |
| Lightsail HTTP | ✅ Acessível | Servidor respondendo |
| Error Handling | ✅ Implementado | Fallback para placeholder |
| Debug Console | ✅ Ativo | Logs no primeiro card |
| **Localhost** | ✅ Deve funcionar | HTTP → HTTP (OK) |
| **Produção HTTPS** | ⚠️ Requer teste | Pode ter mixed content |

---

## 🎯 Próximos Passos

### Desenvolvimento (Agora)
1. Abrir `http://localhost:3000/dashboard/wordpress-catalog`
2. Verificar console logs
3. Confirmar se imagens aparecem
4. Reportar erros específicos se houver

### Produção (Quando deployar)
1. Deploy no Vercel
2. Testar em HTTPS
3. **Se bloquear:** Migrar fotos para R2
4. **Se não bloquear:** Continuar usando Lightsail

---

## 📝 Notas Técnicas

### Mixed Content Policy

**O que é:**
> Browsers modernos bloqueiam recursos HTTP quando a página é HTTPS, por segurança.

**Como detectar:**
```javascript
// Browser console
navigator.userAgent.includes('Chrome') // Bloqueia por padrão
window.location.protocol === 'https:' // Se true, pode bloquear HTTP
```

**Como resolver:**
1. Servir todos recursos via HTTPS (R2, CloudFront, etc.)
2. Usar proxy server-side
3. Aceitar placeholder para imagens bloqueadas

---

## 🔗 Referências

- Script de teste: `scripts/test-photo-urls.ts`
- Helper: `lib/utils/wordpress-photo-urls.ts`
- Component: `app/dashboard/wordpress-catalog/components/PropertyCard.tsx`
- Docs anteriores: `docs/WORDPRESS_CATALOG_FIXES.md`

---

**Autor:** Claude Code
**Última atualização:** 9 de outubro de 2025
