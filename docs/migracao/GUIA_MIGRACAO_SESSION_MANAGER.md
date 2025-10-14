# 🚀 Guia de Migração: Session Manager

**Data:** 13 de outubro de 2025  
**Status:** ✅ Implementado - Pronto para uso gradual

---

## 📦 O que foi criado

### 1. **SessionManager** (`lib/auth/session-manager.ts`)
- ✅ Container único para gerenciamento de sessão
- ✅ Observable pattern (rxjs) para reatividade
- ✅ Trace ID para debugging
- ✅ Event log automático
- ✅ Persistência inteligente em localStorage

### 2. **useSession Hook** (`lib/hooks/useSession.ts`)
- ✅ Hook React reativo
- ✅ Subscribe automático ao SessionManager
- ✅ API simples e limpa
- ✅ Compatibilidade com `useCurrentUser` (alias)

### 3. **SessionDebugPanel** (`components/SessionDebugPanel.tsx`)
- ✅ Painel visual de debugging
- ✅ Exibe estado, trace ID, event log
- ✅ Apenas em desenvolvimento
- ✅ Export de debug info

---

## 🎯 Como Usar

### Novo código (recomendado)

```typescript
import { useSession } from '@/lib/hooks/useSession'

function MyComponent() {
  const { session, isAuthenticated, isLoading, login, logout } = useSession()
  
  // Estado completo disponível
  console.log('Trace ID:', session.traceId)
  console.log('User:', session.user)
  console.log('State:', session.state)
  
  // Login
  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password', 'dashboard')
      // Redirect automático
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Olá, {session.user?.email}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Código existente (compatível)

```typescript
import { useCurrentUser } from '@/lib/hooks/useSession' // ✅ Funciona!

function ExistingComponent() {
  const { user, loading } = useCurrentUser()
  
  // Funciona exatamente como antes
  return user ? <p>Olá, {user.email}</p> : <p>Loading...</p>
}
```

---

## 📊 Migração Gradual

### Fase 1: ✅ **CONCLUÍDO**
- [x] Criar SessionManager
- [x] Criar useSession hook
- [x] Criar SessionDebugPanel
- [x] Adicionar no dashboard/layout.tsx

### Fase 2: 🔄 **EM PROGRESSO** (próximos passos)
- [ ] Migrar Login Page para useSession
- [ ] Testar fluxo completo com debugging
- [ ] Validar trace IDs e event log

### Fase 3: 📅 **FUTURO**
- [ ] Deprecar `useAuth` (lib/hooks/useAuth.ts)
- [ ] Deprecar `useCurrentUser-simple` (lib/hooks/useCurrentUser-simple.ts)
- [ ] Remover código legado após validação

---

## 🐛 Debugging

### Ver estado da sessão

```typescript
// Em qualquer componente:
const { getDebugInfo, getEventLog } = useSession()

console.log('Debug Info:', getDebugInfo())
console.log('Event Log:', getEventLog())
```

### Trace ID

Cada operação tem um trace ID único que aparece em TODOS os logs:

```
[SessionManager] [trace_1697123456_abc123] LOGIN_START: { email: '...', mode: 'dashboard' }
[SessionManager] [trace_1697123456_abc123] AUTH_SUCCESS: { userId: '...', email: '...' }
[SessionManager] [trace_1697123456_abc123] LOGIN_COMPLETE: { mode: 'dashboard' }
```

### Visual Debug Panel

No dashboard, clique no botão roxo (canto inferior direito) para abrir o painel de debug:

- 🟢 Estado da sessão em tempo real
- 🔍 Trace ID atual
- 📜 Event log completo
- 📋 Export para clipboard

---

## 🔄 Fluxo Completo (Com Debugging)

### Antes (❌ Fragmentado)

```
Login Form
  ↓
useAuth hook (client state)
  ↓
serverLogin() (Server Action)
  ↓
Supabase Auth
  ↓
??? (estado inconsistente)
  ↓
Redirect (sem trace)
```

### Depois (✅ Rastreável)

```
Login Form
  ↓
useSession hook
  ↓
SessionManager.login() [trace_xxx_yyy]
  ├─ LOGIN_START
  ├─ AUTH_SUCCESS (Supabase)
  ├─ State: authenticated
  └─ LOGIN_COMPLETE
  ↓
Redirect [trace_xxx_yyy]
  ↓
Dashboard
  ├─ useSession (reactivo)
  ├─ Trace ID visível
  └─ Debug panel ativo
```

---

## 📋 Checklist para Migração de Componente

Ao migrar um componente de `useAuth`/`useCurrentUser-simple` para `useSession`:

### 1. **Atualizar import**
```diff
- import { useAuth } from '@/lib/hooks/useAuth'
+ import { useSession } from '@/lib/hooks/useSession'
```

### 2. **Atualizar variáveis**
```diff
- const { user, loading, login, logout } = useAuth()
+ const { session, isLoading, login, logout, user } = useSession()
```

### 3. **Atualizar condicionais**
```diff
- if (loading) return <Loading />
+ if (isLoading) return <Loading />

- if (!user) return <Login />
+ if (!session.user) return <Login />
```

### 4. **Adicionar debugging (opcional)**
```typescript
const { getDebugInfo, traceId } = useSession()

useEffect(() => {
  console.log(`[MyComponent] Trace ID: ${traceId}`)
}, [traceId])
```

---

## 🎯 Próximos Passos Recomendados

1. **Testar no Dashboard** ✅
   - Debug panel está ativo
   - Trace IDs aparecendo nos logs
   - Estado reativo funcionando

2. **Migrar Login Page** (próximo)
   - Substituir `useAuth` por `useSession`
   - Adicionar visualização de trace ID
   - Testar fluxo completo

3. **Validar Middleware** (futuro)
   - Adicionar trace ID no middleware
   - Correlacionar logs client + server
   - Dashboard de monitoramento

---

## ❓ FAQ

### Q: SessionManager funciona com SSR?

**R:** SessionManager é client-side. Para SSR, o **middleware** e **Server Actions** continuam usando Supabase diretamente. O SessionManager **orquestra** o client-side.

### Q: Posso usar os dois sistemas ao mesmo tempo?

**R:** Sim! `useCurrentUser` de `useSession.ts` é compatível com código existente. Migração é gradual.

### Q: Event log consome muita memória?

**R:** Não. Limita automaticamente a 100 eventos mais recentes.

### Q: Como depurar em produção?

**R:** SessionDebugPanel só aparece em dev. Em prod, use `getDebugInfo()` programaticamente e envie para seu sistema de logs.

---

## 🔗 Arquivos Relacionados

- `lib/auth/session-manager.ts` - Core do sistema
- `lib/hooks/useSession.ts` - Hook React
- `components/SessionDebugPanel.tsx` - Debug visual
- `ARQUITETURA_SESSION_MANAGEMENT_DEFINITIVA.md` - Documentação completa

---

**Status:** ✅ Pronto para uso  
**Próximo:** Migrar Login Page para validar fluxo end-to-end
