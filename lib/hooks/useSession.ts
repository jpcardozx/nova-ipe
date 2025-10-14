/**
 * 🔐 useSession Hook - React hook para SessionManager
 * 
 * Hook reativo que consome o SessionManager via Observable pattern
 * Substitui useAuth e useCurrentUser-simple
 * 
 * Data: 13 de outubro de 2025
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSessionManager, type SessionData, type SessionEvent } from '@/lib/auth/session-manager'

// ============================================================================
// HOOK
// ============================================================================

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
  const [isLoading, setIsLoading] = useState(false)

  // Subscribe to session changes
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

  // Login handler
  const login = useCallback(async (
    email: string,
    password: string,
    mode: 'dashboard' | 'studio' = 'dashboard'
  ) => {
    try {
      const manager = getSessionManager()
      const result = await manager.login(email, password, mode)
      
      // Client-side redirect
      if (result.success) {
        console.log(`[useSession] Login successful, redirecting to: ${result.redirectTo}`)
        window.location.href = result.redirectTo
      }
      
      return result
    } catch (error) {
      console.error('[useSession] Login error:', error)
      throw error
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      const manager = getSessionManager()
      await manager.logout()
      window.location.href = '/login'
    } catch (error) {
      console.error('[useSession] Logout error:', error)
      throw error
    }
  }, [])

  // Debug helpers
  const getDebugInfo = useCallback(() => {
    return getSessionManager().exportDebugInfo()
  }, [])

  const getEventLog = useCallback((): SessionEvent[] => {
    return getSessionManager().getEventLog()
  }, [])

  const clearEventLog = useCallback(() => {
    getSessionManager().clearEventLog()
  }, [])

  return {
    // State
    session,
    isLoading,
    isAuthenticated: session.state === 'authenticated' && !!session.user,
    user: session.user,
    error: session.error,
    traceId: session.traceId,
    
    // Actions
    login,
    logout,
    
    // Debug
    getDebugInfo,
    getEventLog,
    clearEventLog,
  }
}

// ============================================================================
// COMPAT LAYER - Para facilitar migração gradual
// ============================================================================

/**
 * Alias para useSession (compatibilidade com código existente)
 */
export function useCurrentUser() {
  const session = useSession()
  
  return {
    user: session.user ? {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.full_name,
      role: {
        id: session.user.role,
        name: session.user.role === 'admin' ? 'Administrador' : 'Usuário',
        hierarchy_level: session.user.role === 'admin' ? 10 : 1,
        permissions: []
      },
      status: 'active' as const,
      created_at: new Date().toISOString(),
      permissions: []
    } : null,
    loading: session.isLoading,
    error: session.error || null
  }
}
