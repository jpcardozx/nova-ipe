/**
 * Hook para autenticação com Supabase
 * Substitui a autenticação Zoho Mail360
 * 
 * @example
 * const { user, signIn, signOut, loading } = useSupabaseAuth()
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { type User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // ✅ Usar singleton compartilhado
import { storageManager } from '@/lib/utils/storage-manager' // ✅ Gerenciador de storage

interface UseSupabaseAuthReturn {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  isAuthenticated: boolean
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Get initial session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Only refresh on SIGN_OUT to avoid interfering with redirects during SIGN_IN
      if (event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('🔐 useSupabaseAuth.signIn - Tentando login...')
      
      // ✅ PREVENIR QUOTA EXCEEDED - Preparar storage antes do login
      try {
        storageManager.prepareForAuth()
      } catch (prepError) {
        console.warn('⚠️ Aviso na preparação do storage:', prepError)
        // Continuar mesmo se a preparação falhar
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ useSupabaseAuth.signIn - Erro:', error)
        
        // ✅ TRATAMENTO ESPECÍFICO DE QUOTA EXCEEDED
        if (error.message && error.message.includes('quota')) {
          console.error('🚨 Erro de quota detectado - tentando limpeza de emergência...')
          
          try {
            storageManager.emergencyCleanup()
            
            // Tentar login novamente após limpeza
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            
            if (retryError) {
              return { error: new Error('Erro de armazenamento. Por favor, limpe o cache do navegador e tente novamente.') }
            }
            
            console.log('✅ Login bem-sucedido após limpeza de emergência!')
            return { error: null }
          } catch (cleanupError) {
            console.error('❌ Limpeza de emergência falhou:', cleanupError)
            return { error: new Error('Erro crítico de armazenamento. Por favor, limpe o cache do navegador manualmente.') }
          }
        }
        
        return { error }
      }

      console.log('✅ useSupabaseAuth.signIn - Sucesso!')
      console.log('📝 Session:', data.session ? 'Criada' : 'NULL')
      console.log('👤 User:', data.user?.email)

      return { error: null }
    } catch (error) {
      console.error('❌ useSupabaseAuth.signIn - Exceção:', error)
      
      // ✅ TRATAMENTO DE DOMEXCEPTION (QUOTA EXCEEDED)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('🚨 DOMException: QuotaExceededError detectado')
        
        try {
          storageManager.emergencyCleanup()
          return { error: new Error('Armazenamento cheio. Cache foi limpo. Por favor, tente fazer login novamente.') }
        } catch {
          return { error: new Error('Erro crítico de armazenamento. Por favor, limpe o cache do navegador e recarregue a página.') }
        }
      }
      
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign up new user
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: Record<string, any>
  ) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  // Reset password (send email)
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [supabase])

  // Update password (when logged in)
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [supabase])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
  }
}
