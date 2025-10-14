# ✅ FIX APLICADO: SSR/CSR Separation no Session Manager

**Data:** 13 de outubro de 2025  
**Status:** ✅ Corrigido e Testado

---

## 🐛 Problema Identificado

### Erro Original
```
Runtime TypeError: can't access property "call", originalFactory is undefined
at options.factory (.next/static/chunks/runtime.js:712:15)
```

### Causa Raiz

O **SessionManager** estava tentando inicializar o `createClientComponentClient()` **durante a construção da classe**, o que acontecia tanto no **servidor (SSR)** quanto no **cliente (CSR)**.

```typescript
// ❌ PROBLEMA
export class SessionManager {
  private supabase = createClientComponentClient() // ← Executa no servidor!
  
  private constructor() {
    this.initializeSupabaseListener() // ← Tenta usar no servidor!
  }
}

export const sessionManager = SessionManager.getInstance() // ← Cria instância ao importar!
```

**Por que falha:**
1. Next.js importa módulos no servidor durante SSR
2. `createClientComponentClient()` só funciona no browser
3. SessionManager tentava criar cliente Supabase no servidor
4. Webpack não conseguia resolver a dependência
5. `originalFactory is undefined`

---

## ✅ Solução Aplicada

### 1. **Lazy Initialization do Supabase Client**

```typescript
// ✅ CORREÇÃO
export class SessionManager {
  private supabase: ReturnType<typeof createClientComponentClient> | null = null
  
  private constructor() {
    // Apenas inicializar Supabase no cliente
    if (typeof window !== 'undefined') {
      this.initializeSupabase()
      this.initializeSupabaseListener()
      this.restoreSessionFromStorage()
    }
  }

  private initializeSupabase() {
    if (typeof window !== 'undefined' && !this.supabase) {
      this.supabase = createClientComponentClient()
    }
  }

  private getSupabase() {
    if (!this.supabase) {
      this.initializeSupabase()
    }
    return this.supabase!
  }
}
```

**Mudanças:**
- ✅ `supabase` agora é `nullable` inicialmente
- ✅ Só é criado quando `typeof window !== 'undefined'`
- ✅ Método `getSupabase()` garante inicialização lazy
- ✅ Todos os `this.supabase` viram `this.getSupabase()`

### 2. **Safe Singleton Export**

```typescript
// ✅ CORREÇÃO: Export seguro para SSR
let _sessionManager: SessionManager | null = null

export function getSessionManager(): SessionManager {
  if (typeof window === 'undefined') {
    throw new Error('SessionManager só pode ser usado no client-side')
  }
  
  if (!_sessionManager) {
    _sessionManager = SessionManager.getInstance()
  }
  
  return _sessionManager
}

// Compat export
export const sessionManager = typeof window !== 'undefined' 
  ? SessionManager.getInstance() 
  : null as any
```

**Mudanças:**
- ✅ `getSessionManager()` valida ambiente antes de criar
- ✅ Throw error no servidor (fail-fast)
- ✅ Lazy initialization (só cria quando usado)

### 3. **useSession Hook com SSR Guard**

```typescript
// ✅ CORREÇÃO: State inicial seguro
export function useSession() {
  const [session, setSession] = useState<SessionData>(() => {
    // Safe initialization
    if (typeof window === 'undefined') {
      return {
        user: null,
        state: 'idle' as const,
        traceId: 'ssr',
        timestamp: Date.now()
      }
    }
    return getSessionManager().getSession()
  })

  // Subscribe apenas no cliente
  useEffect(() => {
    const manager = getSessionManager()
    const subscription = manager
      .getSessionObservable()
      .subscribe((newSession) => {
        setSession(newSession)
        setIsLoading(newSession.state === 'authenticating')
      })

    return () => subscription.unsubscribe()
  }, [])
  
  // ... resto do hook usa getSessionManager()
}
```

**Mudanças:**
- ✅ State inicial com lazy function
- ✅ SSR retorna estado vazio
- ✅ Subscription apenas em `useEffect` (client-only)
- ✅ Todas as funções usam `getSessionManager()`

---

## 🔄 Separação SSR/CSR

### Server-Side (SSR)

```typescript
// O que acontece no servidor:
1. Next.js renderiza componente
2. useSession() é chamado
3. useState() retorna estado inicial { user: null, state: 'idle', traceId: 'ssr' }
4. useEffect() NÃO executa (server-side)
5. getSessionManager() NÃO é chamado
6. HTML renderizado com estado vazio
```

**Resultado:** HTML hidratável sem erros

### Client-Side (CSR)

```typescript
// O que acontece no browser:
1. Next.js hidrata componente
2. useSession() é chamado
3. useState() com lazy function → getSessionManager().getSession()
4. SessionManager inicializa (createClientComponentClient)
5. useEffect() executa → subscription ao Observable
6. Estado reativo funcionando
```

**Resultado:** Estado real da sessão + reatividade

---

## 🎯 Arquitetura Final

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (SSR)                            │
│                                                              │
│  Next.js Render                                             │
│    ↓                                                         │
│  useSession()                                                │
│    ↓                                                         │
│  useState(() => SSR_FALLBACK)  ← Retorna estado vazio       │
│    ↓                                                         │
│  HTML: <div>Loading...</div>                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    Transferência HTTP
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (CSR)                             │
│                                                              │
│  Browser Hydration                                          │
│    ↓                                                         │
│  useSession()                                                │
│    ↓                                                         │
│  useState(() => getSessionManager().getSession())           │
│    ↓                                                         │
│  SessionManager inicializa                                   │
│    ├─ createClientComponentClient()                         │
│    ├─ Supabase Auth                                         │
│    └─ Observable subscription                               │
│    ↓                                                         │
│  Estado real + Reatividade                                  │
│    ↓                                                         │
│  <div>Olá, {user.email}</div>                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparação: Antes vs Depois

### Antes (❌)

```typescript
// Executa no servidor E cliente
export const sessionManager = SessionManager.getInstance()
  ↓
private supabase = createClientComponentClient() // ERRO no servidor!
  ↓
Webpack: "originalFactory is undefined"
```

### Depois (✅)

```typescript
// Apenas no cliente
export function getSessionManager() {
  if (typeof window === 'undefined') {
    throw new Error('Client-side only')
  }
  return SessionManager.getInstance()
}
  ↓
private getSupabase() {
  if (!this.supabase) {
    this.supabase = createClientComponentClient() // ✅ Só no cliente
  }
  return this.supabase
}
  ↓
Webpack: ✅ Sucesso
```

---

## ✅ Validação

### Checklist de Testes

- [x] TypeScript compila sem erros
- [x] Webpack bundla sem erros
- [x] Servidor inicia corretamente
- [x] SSR renderiza sem crashes
- [x] Cliente hidrata corretamente
- [x] SessionManager funciona no browser
- [x] Debug panel aparece no dashboard

### Logs Esperados

```bash
✓ Starting...
✓ Ready in 1909ms
○ Compiling /dashboard ...
✓ Compiled /dashboard in 8.4s (4277 modules)
GET /dashboard 200 in 8838ms

# No browser console:
[SessionManager] State updated [trace_xxx]: { state: 'idle', hasUser: false }
[SessionManager] [trace_xxx] SESSION_RESTORED: { email: '...' }
```

---

## 🎓 Lições Aprendidas

### 1. **SSR vs CSR Timing**
- Server: Renderiza HTML estático
- Client: Hidrata + Estado dinâmico
- **Regra:** Inicializações side-effect no `useEffect` apenas

### 2. **Lazy Initialization Pattern**
```typescript
// ✅ BOM
const [state] = useState(() => {
  if (typeof window === 'undefined') return DEFAULT
  return getActualState()
})

// ❌ RUIM
const [state] = useState(getActualState()) // Executa no servidor!
```

### 3. **Singleton + SSR = Problema**
```typescript
// ❌ RUIM
export const instance = new MyClass() // Cria ao importar (servidor!)

// ✅ BOM
export function getInstance() {
  if (typeof window === 'undefined') throw Error('Client-only')
  if (!_instance) _instance = new MyClass()
  return _instance
}
```

---

## 📚 Arquivos Modificados

1. **lib/auth/session-manager.ts**
   - Lazy Supabase initialization
   - Safe singleton export
   - SSR guards

2. **lib/hooks/useSession.ts**
   - Safe state initialization
   - useEffect-based subscription
   - getSessionManager() usage

3. **app/dashboard/layout.tsx**
   - Import do novo hook
   - SessionDebugPanel habilitado

---

## 🚀 Próximos Passos

1. ✅ **Testado:** Dashboard carrega sem erros
2. 🔄 **Próximo:** Testar login completo com trace IDs
3. 📅 **Futuro:** Migrar Login Page para useSession

---

**Status:** ✅ Corrigido e funcionando  
**Servidor:** http://localhost:3000  
**Debug Panel:** Disponível no dashboard (botão roxo 🐛)
