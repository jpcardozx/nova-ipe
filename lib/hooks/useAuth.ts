/**
 * 🔐 useAuth Hook - Client-side wrapper para Server Actions
 * Hook minimalista que delega autenticação para SSR
 */

'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { login as serverLogin, logout as serverLogout, checkAuth } from '@/lib/auth/supabase-auth'
import type { AuthUser, LoginMode } from '@/lib/auth/supabase-auth'

// ============================================================================
// TYPES
// ============================================================================

export type { LoginMode } from '@/lib/auth/supabase-auth'

export interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, mode?: LoginMode) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Verificar sessão no mount
  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const result = await checkAuth()
        if (mounted) {
          setUser(result.user || null)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [])

  // Login (chama Server Action que faz redirect SSR)
  const login = useCallback(async (
    email: string,
    password: string,
    mode: LoginMode = 'dashboard'
  ): Promise<void> => {
    setError(null)
    setLoading(true)

    try {
      // Server Action faz redirect automático
      // Este código nunca retorna em caso de sucesso
      startTransition(() => {
        serverLogin(email, password, mode)
      })
    } catch (err) {
      // Captura apenas erros antes do redirect
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMsg)
      setLoading(false)
    }
  }, [])

  // Logout (chama Server Action que faz redirect SSR)
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)

    try {
      // Server Action faz redirect automático
      startTransition(() => {
        serverLogout()
      })
    } catch (err) {
      console.error('Logout error:', err)
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading: loading || isPending,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
