/**
 * 🔐 useAuth Hook - ÚNICO hook de autenticação da aplicação
 * Consolidação de useAuth + useCurrentUser + useSession
 *
 * Features:
 * - Login/Logout com redirect client-side
 * - Sessão em tempo real (onAuthStateChange)
 * - Perfil completo do usuário com role/permissions
 * - Compatível com Server Actions
 *
 * @version 3.0 - Unified & Definitive
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client-browser'
import { login as serverLogin, logout as serverLogout, type AuthUser, type LoginMode } from '@/lib/auth/supabase-auth'

// ============================================================================
// TYPES
// ============================================================================

export type { LoginMode, AuthUser } from '@/lib/auth/supabase-auth'

export interface UserProfile extends AuthUser {
  full_name?: string
  phone?: string
  department?: string
  avatar_url?: string
  last_login?: string
  created_at: string
  updated_at?: string
  permissions?: any[]
}

export interface UseAuthReturn {
  user: UserProfile | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, mode?: LoginMode) => Promise<void>
  logout: () => Promise<void>
  signOut: () => Promise<void> // Alias para logout
  isAuthenticated: boolean
  refetch: () => Promise<void>
}

// ============================================================================
// HOOK UNIFICADO
// ============================================================================

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Usa singleton ao invés de criar nova instância
  const supabase = getSupabaseBrowserClient()

  // ✅ Converter AuthUser do Supabase para UserProfile
  const mapAuthUserToProfile = useCallback((authUser: any): UserProfile => {
    return {
      id: authUser.id,
      email: authUser.email || '',
      role: (authUser.app_metadata?.role || authUser.user_metadata?.role || 'user') as AuthUser['role'],
      full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
      phone: authUser.user_metadata?.phone,
      department: authUser.user_metadata?.department || 'Vendas',
      avatar_url: authUser.user_metadata?.avatar_url,
      created_at: authUser.created_at,
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      permissions: authUser.app_metadata?.permissions || []
    }
  }, [])

  // ✅ Fetch user profile (substitui checkAuth)
  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        setUser(null)
        setError(null)
        setLoading(false)
        return
      }

      const profile = mapAuthUserToProfile(authUser)
      setUser(profile)
      setError(null)
    } catch (err) {
      console.error('[useAuth] Error fetching user:', err)
      setError('Erro ao carregar usuário')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase, mapAuthUserToProfile])

  // ✅ Inicializar sessão no mount + listener em tempo real
  useEffect(() => {
    let mounted = true

    // Initial fetch
    refetch()

    // ✅ Real-time auth state listener (onAuthStateChange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      console.log(`[useAuth] Auth event: ${event}`)

      if (session?.user) {
        const profile = mapAuthUserToProfile(session.user)
        setUser(profile)
        setError(null)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, refetch, mapAuthUserToProfile])

  // Login (autentica via Server Action e redireciona no client)
  const login = useCallback(async (
    email: string,
    password: string,
    mode: LoginMode = 'dashboard'
  ): Promise<void> => {
    console.log('🔐 [useAuth] Iniciando login...', { email, mode })
    setError(null)
    setLoading(true)

    try {
      console.log('🔐 [useAuth] Chamando serverLogin...')

      // ✅ SOLUÇÃO DEFINITIVA: Server Action SEM redirect (apenas autentica)
      // Redirect será feito no client após sucesso
      await serverLogin(email, password, mode)

      // ✅ Se chegou aqui, autenticação foi bem-sucedida
      console.log('✅ [useAuth] Login bem-sucedido! Redirecionando...')

      // ✅ Redirect client-side (mais confiável em Client Components)
      const redirectPath = mode === 'studio' ? '/studio' : '/dashboard'

      // Pequeno delay para UI feedback
      await new Promise(resolve => setTimeout(resolve, 300))

      // Hard navigation (força reload para garantir que middleware valida sessão)
      window.location.href = redirectPath

    } catch (err) {
      console.log('🔐 [useAuth] Erro capturado:', err)

      // Erros reais (credenciais inválidas, rate limit, network, etc)
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer login'
      console.error('❌ [useAuth] Login failed:', errorMsg)
      setError(errorMsg)
      setLoading(false)
      throw err // Re-throw para o componente tratar
    }
  }, [])

  // ✅ Logout (client + server)
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)

      // Client logout
      await supabase.auth.signOut()

      // Server logout (limpa cookies SSR)
      await serverLogout()

      setUser(null)
      setError(null)
    } catch (err) {
      console.error('[useAuth] Logout error:', err)
      setError('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // ✅ Alias para logout (compatibilidade com useCurrentUser)
  const signOut = logout

  return {
    user,
    loading,
    error,
    login,
    logout,
    signOut,
    isAuthenticated: !!user,
    refetch
  }
}
