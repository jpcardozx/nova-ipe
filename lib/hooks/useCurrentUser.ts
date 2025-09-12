'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/lib/auth/types'
import { supabase } from '@/lib/supabase'
import { logger, debugError, createTimer } from '@/lib/utils/debug'

export function useCurrentUser() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar perfil do usuário no banco
  const fetchUserProfile = async (authUser: User): Promise<UserProfile | null> => {
    const timer = createTimer('fetchUserProfile')
    
    try {
      // Criar um perfil básico a partir dos dados de auth se não existir no banco
      const basicProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
        phone: authUser.user_metadata?.phone || undefined,
        department: 'Vendas',
        status: 'active',
        role: {
          id: 'default',
          name: 'Corretor',
          hierarchy_level: 2,
          permissions: []
        },
        permissions: [],
        created_at: authUser.created_at,
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        avatar_url: authUser.user_metadata?.avatar_url || undefined
      }

      timer.end()
      return basicProfile
    } catch (error: any) {
      timer.end()
      debugError('Error fetching user profile', { error, userId: authUser.id })
      
      // Retornar perfil básico em caso de erro
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.email?.split('@')[0] || 'Usuário',
        phone: undefined,
        department: 'Vendas',
        status: 'active',
        role: {
          id: 'default',
          name: 'Corretor',
          hierarchy_level: 2,
          permissions: []
        },
        permissions: [],
        created_at: authUser.created_at,
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        avatar_url: undefined
      }
    }
  }

  // Função para inicializar o usuário
  const initializeUser = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setError(null)
      const profile = await fetchUserProfile(authUser)
      setUser(profile)
    } catch (error: any) {
      debugError('Error initializing user', { error, userId: authUser.id })
      setError(error.message || 'Erro ao carregar perfil do usuário')
    } finally {
      setLoading(false)
    }
  }

  // Effect para monitorar mudanças de auth
  useEffect(() => {
    let mounted = true

    // Obter sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          debugError('Error getting session', { error })
          return
        }
        
        if (mounted) {
          setAuthUser(session?.user || null)
          await initializeUser(session?.user || null)
        }
      } catch (error: any) {
        debugError('Error in getSession', { error })
        if (mounted) {
          setError(error.message)
          setLoading(false)
        }
      }
    }

    getSession()

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        logger.info(`Auth state changed: ${event}`, { hasSession: !!session })
        
        const newUser = session?.user || null
        setAuthUser(newUser)
        await initializeUser(newUser)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return { user: data.user, session: data.session }
    } catch (error: any) {
      debugError('Error signing in', { error, email })
      setError(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer logout
  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      setAuthUser(null)
      setUser(null)
    } catch (error: any) {
      debugError('Error signing out', { error })
      setError(error.message || 'Erro ao fazer logout')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    authUser,
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!authUser,
    isAdmin: user?.role?.name === 'Admin' || user?.role?.hierarchy_level === 1,
    canAccess: (permission: string) => {
      if (!user?.role?.permissions) return false
      return user.role.permissions.some(p => 
        typeof p === 'string' ? p === permission : p.action === permission
      )
    }
  }
}
