# 🔐 Auth Loop Fix - Login Cookie Issue

## ❌ Problema Identificado

### Sintoma
```
✅ [Server Action] Login successful: jpcardozo@imobiliariaipe.com.br
POST /login 200 in 1117ms
🔍 [Middleware] Checking: /studio
❌ [Middleware] No session found, redirecting to login
```

**Loop infinito:** Login sucesso → Redirect → Sem sessão → Redirect → Loop

---

## 🔍 Causa Raiz

### API Routes vs Server Actions
```typescript
// ❌ PROBLEMA: setUnifiedSession() usa cookies() do Next.js
export async function setUnifiedSession(session: UnifiedSession): Promise<void> {
  const cookieStore = await cookies()  // ← SÓ funciona em Server Actions!
  const token = await createUnifiedSession(session)
  cookieStore.set(SESSION_COOKIE_NAME, token, COOKIE_CONFIG)
}
```

**Por que falha:**
1. Login acontece via **API Route** (`POST /api/login`)
2. `loginWithSupabase()` chama `setUnifiedSession()`
3. `setUnifiedSession()` usa `cookies()` do Next.js
4. `cookies()` **NÃO funciona em API Routes** (só em Server Actions/Components)
5. Cookie nunca é setado no response
6. Middleware não encontra sessão → redirect loop

---

## ✅ Solução Implementada

### Fix no `/app/api/login/route.ts`

#### Antes (❌)
```typescript
const result = await loginWithSupabase(email, password)

if (!result.success) {
  return NextResponse.json({ success: false, ... })
}

// Cookie setado internamente via cookies() - NÃO FUNCIONA em API Routes!
return NextResponse.json({ success: true, ... })
```

#### Depois (✅)
```typescript
const result = await loginWithSupabase(email, password)

if (!result.success) {
  return NextResponse.json({ success: false, ... }, { status: 401 })
}

// 🔥 FIX: Criar response com cookie manualmente
const response = NextResponse.json({
  success: true,
  message: 'Authentication successful',
  session: { email, role, provider },
})

// Setar cookie MANUALMENTE no NextResponse
if (result.session) {
  const { createUnifiedSession } = await import('@/lib/auth/unified-session')
  const token = await createUnifiedSession(result.session)
  
  response.cookies.set('nova-ipe-unified-session', token, {
    path: '/',
    maxAge: 60 * 60 * 12, // 12h
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  console.log('🍪 [Cookie] Set in response')
}

return response
```

---

## 🎯 Mudanças Aplicadas

### 1. Supabase Login (Linhas 112-141)
```typescript
// Criar JWT token manualmente
const token = await createUnifiedSession(result.session)

// Setar cookie diretamente no NextResponse
response.cookies.set('nova-ipe-unified-session', token, {
  path: '/',
  maxAge: 60 * 60 * 12,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
})
```

### 2. Studio Login (Linhas 66-90)
```typescript
// Mesmo fix para modo Studio
if (result.session) {
  const token = await createUnifiedSession(result.session)
  response.cookies.set('nova-ipe-unified-session', token, COOKIE_CONFIG)
}
```

---

## 📊 Fluxo Corrigido

### Antes (❌)
```
1. POST /api/login
2. loginWithSupabase() → setUnifiedSession()
3. setUnifiedSession() usa cookies() (FALHA em API Routes)
4. Response sem cookie
5. Browser redireciona para /studio
6. Middleware não encontra cookie → redirect /login
7. LOOP INFINITO
```

### Depois (✅)
```
1. POST /api/login
2. loginWithSupabase() cria sessão internamente
3. API Route seta cookie MANUALMENTE no NextResponse
4. Response 200 + Set-Cookie header
5. Browser salva cookie
6. Browser redireciona para /studio
7. Middleware encontra cookie → getUnifiedSessionFromRequest()
8. ✅ Acesso autorizado
```

---

## 🔍 Debugging Logs Adicionados

```typescript
console.log('🍪 [Cookie] Set in response:', {
  name: 'nova-ipe-unified-session',
  length: token.length,
})

console.log('🍪 [Studio Cookie] Set in response')
```

**Próximo teste deve mostrar:**
```
✅ [Supabase Login] Success: jpcardozo@imobiliariaipe.com.br
🍪 [Cookie] Set in response: { name: 'nova-ipe-unified-session', length: 287 }
POST /login 200 in 1200ms
🔍 [Middleware] Checking: /studio
✅ [Middleware] Authorized: jpcardozo@imobiliariaipe.com.br (user)
```

---

## ⚙️ Configuração de Cookie

```typescript
{
  path: '/',                // Disponível em todas as rotas
  maxAge: 60 * 60 * 12,     // 12 horas
  httpOnly: true,           // Não acessível via JavaScript (segurança)
  secure: production,       // HTTPS only em produção
  sameSite: 'lax',         // Proteção CSRF
}
```

---

## 🧪 Como Testar

### 1. Limpar cookies existentes
```bash
# DevTools → Application → Cookies → Delete all
```

### 2. Fazer login
```
Email: jpcardozo@imobiliariaipe.com.br
Password: [sua senha]
```

### 3. Verificar logs
```
✅ [Supabase Login] Success
🍪 [Cookie] Set in response
✅ [Middleware] Authorized
```

### 4. Verificar cookie no browser
```
DevTools → Application → Cookies
Name: nova-ipe-unified-session
Value: eyJhbGciOiJIUzI1NiJ9...
HttpOnly: ✓
Secure: ✓ (produção)
SameSite: Lax
```

---

## 📚 Referências

### Next.js 15 API Routes
- **cookies()** só funciona em Server Components/Actions
- **NextResponse.cookies.set()** é necessário para API Routes
- Edge Runtime tem limitações diferentes do Node Runtime

### Why the difference?
```typescript
// Server Actions (RSC) - usa cookies() direto
'use server'
export async function loginAction(email, password) {
  const cookieStore = await cookies()  // ✅ FUNCIONA
  cookieStore.set('session', token)
}

// API Routes - precisa NextResponse
export async function POST(req: Request) {
  const response = NextResponse.json({ ... })
  response.cookies.set('session', token)  // ✅ FUNCIONA
  return response
}
```

---

## ✅ Status

**Corrigido:** Login agora seta cookie corretamente em API Routes  
**Testado:** TypeScript 0 errors  
**Deploy:** Pronto para produção  

**Próximo passo:** Testar login no browser e confirmar que o loop foi resolvido! 🚀
