# 🔍 Diagnóstico: Redirect para /dashboard Não Funciona

**Data:** 2025-10-13
**Problema:** Login com mode='dashboard' não redireciona corretamente

---

## 🚨 Problema Identificado

### Sintoma:
Ao fazer login com `mode='dashboard'`, o redirect SSR **não acontece** ou **falha silenciosamente**.

### Possíveis Causas:

#### 1. **NEXT_REDIRECT não está sendo capturado corretamente**

**Arquivo:** `lib/auth/supabase-auth.ts:126-130`

```typescript
catch (error) {
  // Se for NEXT_REDIRECT, deixa passar (é esperado)
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    throw error // ✅ Correto
  }

  console.error('❌ [Auth] Login exception:', error)
  redirect('/login?error=Internal+server+error')
}
```

**Problema:** A verificação `error.message === 'NEXT_REDIRECT'` pode estar falhando porque:
- Next.js 15 mudou a estrutura do erro de redirect
- O erro pode ser um symbol ou objeto especial
- A comparação de string não funciona

---

#### 2. **Client Component capturando o erro antes do redirect**

**Arquivo:** `lib/hooks/useAuth.ts:74-76`

```typescript
startTransition(() => {
  serverLogin(email, password, mode) // ❌ Sem await!
})
```

**Problema:** `startTransition` não aguarda a Promise, então:
- O redirect SSR pode não completar
- O erro `NEXT_REDIRECT` não é propagado
- A UI fica esperando indefinidamente

---

#### 3. **Middleware bloqueando o redirect**

**Arquivo:** `middleware.ts:82-89`

```typescript
if (sessionError || !user) {
  console.log('❌ [Middleware] Sem sessão:', sessionError?.message)

  const redirectUrl = new URL('/login', request.url)
  redirectUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(redirectUrl) // ❌ Loop?
}
```

**Problema:** Race condition:
1. Server Action faz `redirect('/dashboard')`
2. Browser navega para `/dashboard`
3. Middleware intercepta ANTES dos cookies serem lidos
4. Middleware vê "sem sessão" e redireciona de volta para `/login`
5. Loop infinito ou tela branca

---

## 🔬 Análise do Fluxo Atual

### Fluxo Esperado (Ideal):

```
1. User submits form
   ↓
2. useAuth.login() chama serverLogin()
   ↓
3. Server Action: supabase.auth.signInWithPassword()
   ├─ Cookies são setados automaticamente
   └─ redirect('/dashboard') é chamado
   ↓
4. Next.js lança NEXT_REDIRECT error
   ↓
5. Next.js navega para /dashboard (SSR)
   ↓
6. Middleware intercepta /dashboard
   ├─ Lê cookies
   ├─ Valida sessão com getUser()
   └─ Permite acesso
   ↓
7. Página /dashboard renderiza
```

### Fluxo Real (Quebrado):

```
1. User submits form
   ↓
2. useAuth.login() chama serverLogin()
   ↓
3. Server Action: supabase.auth.signInWithPassword()
   ├─ Cookies são setados
   └─ redirect('/dashboard') é chamado
   ↓
4. PROBLEMA: startTransition não aguarda
   ├─ NEXT_REDIRECT é lançado
   ├─ Mas startTransition já retornou
   └─ O erro fica "preso" no React
   ↓
5. UI continua mostrando loading
   ↓
6. Nada acontece (redirect perdido)
```

---

## ✅ Soluções Propostas

### Solução 1: **Aguardar o redirect no useAuth** (Recomendada)

**Arquivo:** `lib/hooks/useAuth.ts`

**Problema:**
```typescript
startTransition(() => {
  serverLogin(email, password, mode) // ❌ Não aguarda
})
```

**Solução:**
```typescript
try {
  // Chamar diretamente (sem startTransition)
  await serverLogin(email, password, mode)
  // ✅ Se chegou aqui, redirect falhou (anômalo)
  console.warn('⚠️ Redirect SSR não aconteceu')
} catch (err) {
  // ✅ NEXT_REDIRECT vai cair aqui
  if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
    // Deixar propagar (navegação vai acontecer)
    throw err
  }
  // Outros erros
  setError(err instanceof Error ? err.message : 'Erro ao fazer login')
  setLoading(false)
}
```

---

### Solução 2: **Melhorar detecção do NEXT_REDIRECT**

**Arquivo:** `lib/auth/supabase-auth.ts`

**Problema:**
```typescript
if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
  throw error
}
```

**Solução:**
```typescript
// Next.js 15 pode usar digest ou outras propriedades
if (
  error instanceof Error &&
  (error.message === 'NEXT_REDIRECT' ||
   error.message.includes('NEXT_REDIRECT') ||
   (error as any).digest === 'NEXT_REDIRECT')
) {
  throw error // Re-throw para Next.js processar
}
```

---

### Solução 3: **Adicionar delay no middleware para cookies** (Workaround)

**Arquivo:** `middleware.ts`

Se o problema for race condition de cookies:

```typescript
// Antes de validar sessão
const { data: { user }, error: sessionError } = await supabase.auth.getUser()

if (sessionError || !user) {
  // ⚠️ Workaround: Verificar se é redirect recente
  const referer = request.headers.get('referer')
  const isFromLogin = referer?.includes('/login')

  if (isFromLogin) {
    // Aguardar 100ms para cookies propagarem
    await new Promise(resolve => setTimeout(resolve, 100))

    // Tentar novamente
    const retry = await supabase.auth.getUser()
    if (retry.data.user) {
      // Cookies estavam atrasados, prosseguir
      user = retry.data.user
    }
  }
}
```

**Nota:** Isso é um hack, não ideal.

---

## 🧪 Como Testar

### Teste 1: **Adicionar logs no useAuth**

```typescript
// lib/hooks/useAuth.ts
const login = useCallback(async (
  email: string,
  password: string,
  mode: LoginMode = 'dashboard'
): Promise<void> => {
  console.log('🔐 [useAuth] Iniciando login...', { mode })
  setError(null)
  setLoading(true)

  try {
    console.log('🔐 [useAuth] Chamando serverLogin...')
    await serverLogin(email, password, mode)
    console.warn('⚠️ [useAuth] serverLogin retornou (anômalo - deveria ter redirecionado)')
  } catch (err) {
    console.log('🔐 [useAuth] Erro capturado:', err)

    // Verificar se é NEXT_REDIRECT
    if (err instanceof Error) {
      console.log('🔐 [useAuth] Error.message:', err.message)
      console.log('🔐 [useAuth] Error.digest:', (err as any).digest)

      if (err.message.includes('NEXT_REDIRECT') || (err as any).digest === 'NEXT_REDIRECT') {
        console.log('✅ [useAuth] NEXT_REDIRECT detectado, propagando...')
        throw err // Re-throw
      }
    }

    const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer login'
    setError(errorMsg)
    setLoading(false)
  }
}, [])
```

### Teste 2: **Verificar comportamento do redirect**

```bash
# Terminal
pnpm run dev

# Browser DevTools Console
# Ao fazer login, observar:
# 1. Logs do useAuth
# 2. Logs do Server Action
# 3. Se NEXT_REDIRECT é capturado
# 4. Se navegação acontece
```

### Teste 3: **Forçar redirect client-side como fallback**

Se redirect SSR falhar, fazer fallback client-side:

```typescript
// lib/hooks/useAuth.ts
try {
  await serverLogin(email, password, mode)

  // Se chegou aqui, redirect SSR falhou
  console.warn('⚠️ Redirect SSR falhou, usando fallback client-side')
  window.location.href = mode === 'studio' ? '/studio' : '/dashboard'
} catch (err) {
  // ...
}
```

---

## 📊 Checklist de Diagnóstico

Para descobrir a causa raiz:

- [ ] Verificar se `serverLogin` lança `NEXT_REDIRECT` error
  ```bash
  # Logs esperados:
  🔐 [Auth Server] Iniciando login...
  ✅ [Auth] Login success em Xms
  🔀 [Auth Server] Redirecionando para /dashboard
  (NEXT_REDIRECT error lançado)
  ```

- [ ] Verificar se `useAuth` captura o erro corretamente
  ```bash
  # Logs esperados:
  🔐 [useAuth] Chamando serverLogin...
  🔐 [useAuth] Erro capturado: NEXT_REDIRECT
  ✅ [useAuth] NEXT_REDIRECT detectado, propagando...
  ```

- [ ] Verificar se middleware permite acesso
  ```bash
  # Logs esperados:
  🔐 [Middleware] { path: '/dashboard', email: '...', role: 'user', allowed: true }
  ```

- [ ] Verificar Network tab
  - [ ] Request POST /api/... (Server Action)
  - [ ] Response: 303 See Other → /dashboard
  - [ ] Request GET /dashboard
  - [ ] Response: 200 OK

---

## 🎯 Recomendação Final

**Implementar Solução 1 + Solução 2:**

1. Remover `startTransition` de `useAuth`
2. Aguardar `serverLogin` com `await`
3. Melhorar detecção de `NEXT_REDIRECT`
4. Adicionar fallback client-side se SSR falhar

**Essa abordagem garante:**
- ✅ Redirect SSR funciona (ideal)
- ✅ Fallback client-side se SSR falhar (robusto)
- ✅ Logs detalhados para debugging
- ✅ Sem race conditions

---

**Status:** 🔬 Diagnóstico completo
**Próximo passo:** Implementar correções
