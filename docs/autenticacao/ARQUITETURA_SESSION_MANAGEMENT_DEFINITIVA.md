# 🏗️ Arquitetura de Session Management - Análise e Solução Definitiva

**Data:** 13 de outubro de 2025  
**Problema:** Redirecionamentos sem debugging, falta de controle persistente de container no fluxo login

---

## 📊 Análise da Arquitetura Atual

### ❌ Problemas Identificados

#### 1. **Múltiplos Pontos de Verdade (Source of Truth)**
```
┌─────────────────────────────────────────────────────────┐
│  ATUAL: 3+ sistemas de sessão conflitantes             │
├─────────────────────────────────────────────────────────┤
│  1. Supabase Auth (cookies: sb-*-auth-token)           │
│  2. localStorage (currentUser - Zoho)                   │
│  3. nova-ipe-unified-session (JWT custom)               │
│  4. Client state (useAuth, useCurrentUser)              │
└─────────────────────────────────────────────────────────┘
```

#### 2. **Fluxo de Login Fragmentado**
```
Login Form → useAuth Hook → serverLogin() → Supabase Auth → ???
                ↓                                              ↓
         Client State                              Redirect + Cookie
                ↓                                              ↓
          Inconsistente!                          Middleware valida
```

**Problema:** Não há um **container único** que acompanha o usuário do início ao fim.

#### 3. **Debugging Impossível**
- Logs espalhados em múltiplos arquivos
- Sem trace_id para seguir request
- Sem visibilidade do estado da sessão em tempo real

---

## ✅ Solução: Session Management Container Pattern

### Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│                    SessionManager (Singleton)                    │
│  - Único ponto de verdade para estado de sessão                 │
│  - Trace ID para debugging                                      │
│  - Event emitter para hooks reativos                            │
│  - Persistência automática                                      │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ Supabase│          │  Hooks  │          │  Logs   │
   │  Auth   │          │ (React) │          │ (Debug) │
   └─────────┘          └─────────┘          └─────────┘
```

---

## 🎯 Implementação: Session Manager

### 1. **Core: SessionManager Class**

```typescript
// lib/auth/session-manager.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BehaviorSubject } from 'rxjs'

export type SessionState = 'idle' | 'authenticating' | 'authenticated' | 'error'

export interface SessionData {
  user: {
    id: string
    email: string
    role: string
  } | null
  state: SessionState
  traceId: string
  timestamp: number
  error?: string
}

export class SessionManager {
  private static instance: SessionManager
  private supabase = createClientComponentClient()
  
  // Observable state (para hooks React)
  private sessionSubject = new BehaviorSubject<SessionData>({
    user: null,
    state: 'idle',
    traceId: this.generateTraceId(),
    timestamp: Date.now()
  })
  
  // Histórico de eventos (debugging)
  private eventLog: Array<{
    traceId: string
    event: string
    data: any
    timestamp: number
  }> = []

  private constructor() {
    this.initializeSupabaseListener()
    this.restoreSessionFromStorage()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Iniciar login (único ponto de entrada)
   */
  async login(email: string, password: string, mode: 'dashboard' | 'studio') {
    const traceId = this.generateTraceId()
    
    try {
      this.updateState({
        state: 'authenticating',
        traceId,
        timestamp: Date.now()
      })

      this.logEvent(traceId, 'LOGIN_START', { email, mode })

      // Autenticar com Supabase (única fonte de verdade)
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error || !data.session) {
        throw new Error(error?.message || 'Login failed')
      }

      this.logEvent(traceId, 'AUTH_SUCCESS', {
        userId: data.user.id,
        email: data.user.email
      })

      // Atualizar estado local
      this.updateState({
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.app_metadata?.role || 'user'
        },
        state: 'authenticated',
        traceId,
        timestamp: Date.now()
      })

      this.logEvent(traceId, 'LOGIN_COMPLETE', { mode })

      return {
        success: true,
        redirectTo: mode === 'studio' ? '/studio' : '/dashboard',
        traceId
      }

    } catch (error) {
      this.logEvent(traceId, 'LOGIN_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      this.updateState({
        state: 'error',
        error: error instanceof Error ? error.message : 'Login failed',
        traceId,
        timestamp: Date.now()
      })

      throw error
    }
  }

  /**
   * Obter estado atual (síncrono)
   */
  getSession(): SessionData {
    return this.sessionSubject.value
  }

  /**
   * Observable para React hooks
   */
  getSessionObservable() {
    return this.sessionSubject.asObservable()
  }

  /**
   * Logout
   */
  async logout() {
    const traceId = this.generateTraceId()
    
    this.logEvent(traceId, 'LOGOUT_START', {})

    await this.supabase.auth.signOut()

    this.updateState({
      user: null,
      state: 'idle',
      traceId,
      timestamp: Date.now()
    })

    this.clearStorage()
    this.logEvent(traceId, 'LOGOUT_COMPLETE', {})
  }

  /**
   * Debug: obter logs
   */
  getEventLog() {
    return [...this.eventLog]
  }

  /**
   * Debug: exportar para análise
   */
  exportDebugInfo() {
    return {
      currentState: this.getSession(),
      eventLog: this.getEventLog(),
      timestamp: new Date().toISOString()
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private updateState(updates: Partial<SessionData>) {
    const current = this.sessionSubject.value
    const newState = { ...current, ...updates }
    
    this.sessionSubject.next(newState)
    this.persistToStorage(newState)
    
    console.log(`[SessionManager] State updated [${updates.traceId}]:`, {
      state: newState.state,
      hasUser: !!newState.user,
      timestamp: new Date(newState.timestamp).toISOString()
    })
  }

  private logEvent(traceId: string, event: string, data: any) {
    const entry = {
      traceId,
      event,
      data,
      timestamp: Date.now()
    }
    
    this.eventLog.push(entry)
    
    // Manter apenas últimos 100 eventos
    if (this.eventLog.length > 100) {
      this.eventLog.shift()
    }

    console.log(`[SessionManager] [${traceId}] ${event}:`, data)
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSupabaseListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      const traceId = this.generateTraceId()
      
      this.logEvent(traceId, 'SUPABASE_AUTH_CHANGE', {
        event,
        hasSession: !!session
      })

      if (session) {
        this.updateState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: session.user.app_metadata?.role || 'user'
          },
          state: 'authenticated',
          traceId,
          timestamp: Date.now()
        })
      } else if (event === 'SIGNED_OUT') {
        this.updateState({
          user: null,
          state: 'idle',
          traceId,
          timestamp: Date.now()
        })
      }
    })
  }

  private persistToStorage(state: SessionData) {
    if (typeof window === 'undefined') return

    try {
      // Apenas metadados no localStorage (não JWT completo - segurança)
      const metadata = {
        hasUser: !!state.user,
        email: state.user?.email,
        state: state.state,
        timestamp: state.timestamp
      }
      
      localStorage.setItem('nova-ipe-session-meta', JSON.stringify(metadata))
    } catch (error) {
      console.warn('[SessionManager] Failed to persist to storage:', error)
    }
  }

  private restoreSessionFromStorage() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('nova-ipe-session-meta')
      if (!stored) return

      const metadata = JSON.parse(stored)
      
      // Verificar se sessão ainda é válida (< 24h)
      if (Date.now() - metadata.timestamp > 24 * 60 * 60 * 1000) {
        this.clearStorage()
        return
      }

      // Validar com Supabase
      this.supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const traceId = this.generateTraceId()
          this.logEvent(traceId, 'SESSION_RESTORED', {
            email: session.user.email
          })
        }
      })

    } catch (error) {
      console.warn('[SessionManager] Failed to restore session:', error)
    }
  }

  private clearStorage() {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('nova-ipe-session-meta')
    } catch (error) {
      console.warn('[SessionManager] Failed to clear storage:', error)
    }
  }
}

// Singleton export
export const sessionManager = SessionManager.getInstance()
```

---

## 2. **React Hook Integrado**

```typescript
// lib/hooks/useSession.ts
'use client'

import { useEffect, useState } from 'react'
import { sessionManager, SessionData } from '@/lib/auth/session-manager'

export function useSession() {
  const [session, setSession] = useState<SessionData>(
    sessionManager.getSession()
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Subscribe to session changes
    const subscription = sessionManager
      .getSessionObservable()
      .subscribe((newSession) => {
        setSession(newSession)
        setIsLoading(newSession.state === 'authenticating')
      })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (
    email: string,
    password: string,
    mode: 'dashboard' | 'studio'
  ) => {
    try {
      const result = await sessionManager.login(email, password, mode)
      
      // Client-side redirect (após Server Action)
      if (result.success) {
        window.location.href = result.redirectTo
      }
      
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await sessionManager.logout()
    window.location.href = '/login'
  }

  return {
    session,
    isLoading,
    isAuthenticated: session.state === 'authenticated' && !!session.user,
    user: session.user,
    login,
    logout,
    traceId: session.traceId,
    // Debug helpers
    getDebugInfo: () => sessionManager.exportDebugInfo(),
    getEventLog: () => sessionManager.getEventLog()
  }
}
```

---

## 3. **Integração no Login Page**

```typescript
// app/login/page.tsx
'use client'

import { useSession } from '@/lib/hooks/useSession'

export default function LoginPage() {
  const { login, isLoading, session } = useSession()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: LoginFormValues) => {
    try {
      setError(null)
      
      console.log(`🔐 [Login] Starting with traceId: ${session.traceId}`)
      
      await login(data.email, data.password, loginMode)
      
      // Redirect automático via hook
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      
      // Debug info disponível
      console.error('[Login] Error:', {
        error: err,
        debugInfo: session
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* UI */}
      
      {/* Debug panel (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <div>TraceID: {session.traceId}</div>
          <div>State: {session.state}</div>
          <div>User: {session.user?.email || 'none'}</div>
        </div>
      )}
    </form>
  )
}
```

---

## 📊 Comparação: Antes vs Depois

### Antes (❌)

```
Login → useAuth → serverLogin → Supabase → ???
  ↓         ↓          ↓           ↓         ↓
Estado   Estado    Estado      Cookie    Middleware
local    hook      server      browser   validation
  ↓         ↓          ↓           ↓         ↓
FRAGMENTADO E INCONSISTENTE - Debugging impossível
```

### Depois (✅)

```
Login → SessionManager → Supabase Auth
  ↓            ↓              ↓
  └─── Único Container ──────┘
         │
    ┌────┴────┐
    │ State   │ → Observable → Hooks React
    │ TraceID │ → Log → Debug
    │ Events  │ → Storage → Persistência
    └─────────┘
```

---

## 🎯 Benefícios

### 1. **Debugging Completo**
```typescript
// Em qualquer lugar da aplicação:
const debugInfo = sessionManager.exportDebugInfo()
console.log(debugInfo)

// Output:
{
  currentState: {
    user: { id: '...', email: '...', role: 'user' },
    state: 'authenticated',
    traceId: 'trace_1697123456_abc123',
    timestamp: 1697123456789
  },
  eventLog: [
    { traceId: 'trace_...', event: 'LOGIN_START', ... },
    { traceId: 'trace_...', event: 'AUTH_SUCCESS', ... },
    { traceId: 'trace_...', event: 'LOGIN_COMPLETE', ... }
  ]
}
```

### 2. **Single Source of Truth**
- ✅ Uma única classe gerencia estado
- ✅ Supabase Auth como backend
- ✅ Observable para reatividade React
- ✅ localStorage apenas para cache

### 3. **Trace ID para Request Tracking**
```
🔐 [Login] Starting with traceId: trace_1697123456_abc123
[SessionManager] [trace_1697123456_abc123] LOGIN_START: { email: '...', mode: 'dashboard' }
[SessionManager] [trace_1697123456_abc123] AUTH_SUCCESS: { userId: '...', email: '...' }
[SessionManager] [trace_1697123456_abc123] LOGIN_COMPLETE: { mode: 'dashboard' }
```

### 4. **Sem Retrabalho**
- ✅ Mantém Supabase Auth como backend
- ✅ Refatora apenas camada de gerenciamento
- ✅ Hooks React mantêm API similar
- ✅ Middleware continua funcionando

---

## 🚀 Próximos Passos

1. **Criar SessionManager** (`lib/auth/session-manager.ts`)
2. **Criar useSession hook** (`lib/hooks/useSession.ts`)
3. **Migrar Login Page** para usar novo hook
4. **Deprecar** `useAuth` e `useCurrentUser-simple` gradualmente
5. **Adicionar Debug Panel** (dev only) em todas as páginas protegidas

---

## ❓ FAQ: Supabase é adequado?

### ✅ **SIM**, Supabase é excelente para session management

**Por quê:**
1. **JWT seguro** com refresh token automático
2. **Row Level Security** nativo
3. **Cookie HTTP-only** por padrão
4. **Expires automático** e renovação
5. **Real-time** auth state changes

**O problema não era o Supabase**, era a **falta de container unificado** que gerenciasse o ciclo completo.

### SessionManager = Container que você pediu

```
┌─────────────────────────────────────────────────────────┐
│              SessionManager Container                    │
│  - Acompanha usuário do login até logout               │
│  - Trace ID para debugging completo                     │
│  - Event log para análise                               │
│  - Supabase Auth como backend (confiável)               │
└─────────────────────────────────────────────────────────┘
```

---

**Status:** Proposta aprovada para implementação  
**Próximo:** Implementar SessionManager sem recriar infraestrutura Supabase
