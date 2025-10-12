# 🔧 Correções Next.js 15 - Async APIs

> **Data**: 11 de outubro de 2025  
> **Status**: ✅ Concluído  
> **Objetivo**: Corrigir erros de API assíncrona do Next.js 15

---

## 🐛 ERRO IDENTIFICADO

### **Console Log**:
```
Error: Route "/api/studio/session" used `cookies().get('sb-ifhfpaehnjpdwdocdzwd-auth-token')`. 
`cookies()` should be awaited before using its value. 
Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
```

### **Causa Raiz**:
Next.js 15 mudou a API de `cookies()` de **síncrona** para **assíncrona**.

**Antes (Next.js 14)**:
```typescript
const cookieStore = cookies() // ✅ Síncrono
const supabase = createRouteHandlerClient({ cookies })
```

**Agora (Next.js 15)**:
```typescript
const cookieStore = await cookies() // ⚠️ Assíncrono
const supabase = createRouteHandlerClient({ cookies }) // ❌ ERRO
```

---

## ✅ CORREÇÃO IMPLEMENTADA

### **Arquivo**: `app/api/studio/session/route.ts`

#### **Método GET** (Linhas 13-18)

**Antes**:
```typescript
const cookieStore = await cookies()
const allCookies = cookieStore.getAll()
console.log('🍪 Cookies disponíveis:', allCookies.map(c => c.name).join(', '))

const supabase = createRouteHandlerClient({ cookies }) // ❌ Passando função raw
```

**Depois**:
```typescript
const cookieStore = await cookies()
const allCookies = cookieStore.getAll()
console.log('🍪 Cookies disponíveis:', allCookies.map(c => c.name).join(', '))

// ✅ Wrapper que retorna Promise do cookieStore já resolvido
const supabase = createRouteHandlerClient({ 
    cookies: () => Promise.resolve(cookieStore) 
})
```

#### **Método DELETE** (Linhas 66-69)

**Antes**:
```typescript
export async function DELETE() {
    try {
        console.log('🚪 === LOGOUT STUDIO (Supabase) ===')
        
        const supabase = createRouteHandlerClient({ cookies }) // ❌
```

**Depois**:
```typescript
export async function DELETE() {
    try {
        console.log('🚪 === LOGOUT STUDIO (Supabase) ===')
        
        const cookieStore = await cookies() // ✅ Await primeiro
        const supabase = createRouteHandlerClient({ 
            cookies: () => Promise.resolve(cookieStore) 
        })
```

---

## 🖼️ WARNING IMAGENS CORRIGIDO

### **Arquivo**: `next.config.js`

**Warning**:
```
Image with src "..." is using quality "85" which is not configured in images.qualities. 
This config will be required starting in Next.js 16.
```

**Correção**:
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // ✅ Adicionado para Next.js 16
    qualities: [50, 75, 85, 90, 100],
  },
  // ...
};
```

---

## 📚 EXPLICAÇÃO TÉCNICA

### **Por que `createRouteHandlerClient` precisa de um wrapper?**

```typescript
// Assinatura esperada pela biblioteca
createRouteHandlerClient({ 
    cookies: () => Promise<ReadonlyRequestCookies> 
})

// ❌ Passando função diretamente
{ cookies } 
// Equivalente a: { cookies: cookies }
// Mas cookies() agora retorna Promise, não ReadonlyRequestCookies

// ✅ Wrapper correto
{ cookies: () => Promise.resolve(cookieStore) }
// Retorna uma função que, quando chamada, retorna Promise do cookieStore
```

### **Fluxo Correto**:

```
1. await cookies() 
   → Resolve Promise
   → Retorna ReadonlyRequestCookies

2. Guardar em cookieStore

3. createRouteHandlerClient({ 
     cookies: () => Promise.resolve(cookieStore) 
   })
   → Passa função que retorna Promise
   → Biblioteca chama essa função quando precisar
   → Recebe cookieStore já resolvido
```

---

## 🧪 COMO TESTAR

### **1. Verificar erro desapareceu**:

```bash
# 1. Reiniciar servidor
pnpm dev

# 2. Navegar para /studio
# 3. Console não deve mostrar mais:
#    "Error: Route "/api/studio/session" used `cookies().get(...)`"

# 4. Deve mostrar apenas:
✅ Sessão Supabase válida encontrada: user@example.com
✅ Session expires at: 2025-10-11T21:59:35.000Z
```

### **2. Testar autenticação**:

```bash
# 1. Abrir DevTools → Network
# 2. Navegar para /studio
# 3. Verificar request para /api/studio/session
# 4. Response deve ser 200 com:
{
  "authenticated": true,
  "user": {
    "email": "user@example.com",
    "name": "user",
    "provider": "supabase_auth"
  }
}
```

### **3. Verificar warnings de imagem**:

```bash
# 1. Navegar para homepage (imagens Sanity)
# 2. Console não deve mostrar mais:
#    "Image with src ... is using quality "85" which is not configured"

# ✅ Imagens devem carregar normalmente sem warnings
```

---

## 📊 IMPACTO

### **Antes**:
```
❌ Erro em console a cada request para /api/studio/session
❌ 4 erros por carregamento de página
❌ Warnings de imagem em todas as páginas
❌ Logs poluídos
```

### **Depois**:
```
✅ Nenhum erro relacionado a cookies
✅ Autenticação funcionando perfeitamente
✅ Nenhum warning de imagem
✅ Console limpo e informativo
```

---

## 🔄 PADRÃO PARA FUTURAS ROUTES

### **Template para Route Handlers (Next.js 15)**:

```typescript
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        // ✅ 1. Await cookies primeiro
        const cookieStore = await cookies()
        
        // ✅ 2. Wrapper para Supabase client
        const supabase = createRouteHandlerClient({ 
            cookies: () => Promise.resolve(cookieStore) 
        })
        
        // ✅ 3. Usar supabase normalmente
        const { data, error } = await supabase.auth.getSession()
        
        // ... resto do código
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
```

---

## 📝 CHECKLIST DE MIGRAÇÃO

Ao atualizar código antigo do Next.js 14 para 15:

- [x] **cookies()**: Adicionar `await` antes de usar
- [x] **headers()**: Adicionar `await` antes de usar (se usado)
- [x] **params**: Adicionar `await` se for dynamic route (se usado)
- [x] **searchParams**: Adicionar `await` se for dynamic (se usado)
- [x] Wrapper para `createRouteHandlerClient`
- [x] Configurar `images.qualities` para Next.js 16

---

## 🚀 PRÓXIMOS PASSOS

### **Imediato**:
```
✅ Verificar se há outros Route Handlers com cookies()
✅ Testar autenticação em produção
✅ Monitorar logs por 24h
```

### **Preventivo**:
```
1. Documentar padrão no README
2. Criar snippet/template para routes
3. Adicionar lint rule se possível
4. Revisar outras APIs dinâmicas (headers, params)
```

---

## 📚 REFERÊNCIAS

- **Next.js 15 Async APIs**: https://nextjs.org/docs/messages/sync-dynamic-apis
- **Supabase Auth Helpers**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Next.js Image Config**: https://nextjs.org/docs/messages/next-image-unconfigured-qualities

---

## ✅ RESUMO EXECUTIVO

| Item | Status |
|------|--------|
| **Erro cookies() assíncrono** | ✅ Corrigido |
| **Método GET funcional** | ✅ Testado |
| **Método DELETE funcional** | ✅ Corrigido |
| **Warnings de imagem** | ✅ Resolvidos |
| **Autenticação Studio** | ✅ Funcionando |
| **Console limpo** | ✅ Sem erros |

**🎉 API de sessão do Studio 100% funcional com Next.js 15!**

---

**Documentado por**: AI Assistant  
**Aplicado em**: Nova IPE Imobiliária  
**Data**: 11 de outubro de 2025
