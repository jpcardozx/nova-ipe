'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  department?: string
  status: 'active' | 'inactive' | 'suspended'
  role?: {
    id: string
    name: string
    hierarchy_level: number
    permissions: any[]
  }
  created_at: string
  updated_at?: string
  last_login?: string
  avatar_url?: string
  permissions?: any[]
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        // 🚀 DESENVOLVIMENTO: Liberar acesso em localhost:3000
        const isDevelopment = process.env.NODE_ENV === 'development' &&
                             (typeof window !== 'undefined' && window.location.hostname === 'localhost')

        if (isDevelopment) {
          console.log('🔓 Modo desenvolvimento: Acesso liberado ao dashboard')
          const devProfile: UserProfile = {
            id: 'dev-user-' + Date.now(),
            email: 'dev@localhost.com',
            full_name: 'Desenvolvedor Local',
            phone: '(11) 99999-9999',
            department: 'Desenvolvimento',
            status: 'active',
            role: {
              id: 'admin',
              name: 'Administrador',
              hierarchy_level: 10,
              permissions: ['*']
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            avatar_url: '/images/dev-avatar.png',
            permissions: ['*']
          }

          if (mounted) {
            setUser(devProfile)
            setLoading(false)
            setError(null)
          }
          return
        }

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        // Create basic user profile
        const profile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
          phone: authUser.user_metadata?.phone,
          department: 'Vendas',
          status: 'active',
          role: {
            id: 'user',
            name: 'Usuário',
            hierarchy_level: 1,
            permissions: []
          },
          created_at: authUser.created_at,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          avatar_url: authUser.user_metadata?.avatar_url,
          permissions: []
        }

        if (mounted) {
          setUser(profile)
          setError(null)
        }
      } catch (err) {
        console.error('Error getting user:', err)
        if (mounted) {
          setError('Erro ao carregar usuário')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
          phone: session.user.user_metadata?.phone,
          department: 'Vendas',
          status: 'active',
          role: {
            id: 'user',
            name: 'Usuário',
            hierarchy_level: 1,
            permissions: []
          },
          created_at: session.user.created_at,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          avatar_url: session.user.user_metadata?.avatar_url,
          permissions: []
        }
        setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    loading,
    error,
    signOut,
    isAuthenticated: !!user
  }
}