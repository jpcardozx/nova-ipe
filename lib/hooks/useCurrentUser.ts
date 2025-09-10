'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/lib/auth/types'
import { supabase } from '@/lib/supabase'

// Mock user profile - em produção viria do banco
const mockUserProfile: UserProfile = {
  id: '1',
  email: 'admin@ipeimoveis.com',
  full_name: 'João Pedro Cardozo',
  role: {
    id: 'admin',
    name: 'Administrador',
    permissions: [
      { id: '1', resource: 'users', action: 'update_password' },
      { id: '2', resource: 'users', action: 'manage' },
      { id: '3', resource: '*', action: '*' }
    ],
    hierarchy_level: 90
  },
  department: 'TI',
  phone: '(11) 99999-9999',
  status: 'active',
  created_at: '2024-01-15',
  last_login: '2024-09-08',
  permissions: [
    { id: '1', resource: 'users', action: 'update_password' },
    { id: '2', resource: 'users', action: 'manage' },
    { id: '3', resource: '*', action: '*' }
  ]
}

export function useCurrentUser() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.warn('Error getting user:', error.message)
      }
      setAuthUser(user)
      
      // Se há usuário autenticado, carregar perfil completo
      if (user) {
        setUser(mockUserProfile) // Em produção: buscar do banco baseado no user.id
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      setAuthUser(session?.user ?? null)
      
      if (session?.user) {
        setUser(mockUserProfile) // Em produção: buscar do banco
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false
    
    return user.permissions.some(permission => 
      (permission.resource === '*' && permission.action === '*') ||
      (permission.resource === resource && permission.action === action) ||
      (permission.resource === resource && permission.action === '*') ||
      (permission.resource === '*' && permission.action === action)
    )
  }

  const canManageUser = (targetUser: UserProfile): boolean => {
    if (!user) return false
    
    // Pode gerenciar se for o próprio usuário
    if (user.id === targetUser.id) return true
    
    // Pode gerenciar se tiver permissão e hierarquia superior
    return hasPermission('users', 'manage') && 
           user.role.hierarchy_level > targetUser.role.hierarchy_level
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return { 
    authUser,
    user, 
    loading,
    signOut,
    isAuthenticated: !!authUser,
    hasPermission,
    canManageUser,
    isAdmin: (user?.role?.hierarchy_level || 0) >= 90,
    isSuperAdmin: (user?.role?.hierarchy_level || 0) >= 100
  }
}