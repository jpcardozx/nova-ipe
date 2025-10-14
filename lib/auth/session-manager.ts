/**
 * 🏗️ SESSION MANAGER - Container único para gerenciamento de sessão
 * 
 * Princípios:
 * - Single Source of Truth
 * - Observable pattern para reatividade
 * - Trace ID para debugging
 * - Supabase Auth como backend
 * 
 * Data: 13 de outubro de 2025
 */

'use client'

import { BehaviorSubject, type Observable } from 'rxjs'
import { getSupabaseBrowserClient } from '@/lib/supabase/client-browser'
import type { SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// TYPES
// ============================================================================

export type SessionState = 'idle' | 'authenticating' | 'authenticated' | 'error'

export interface SessionData {
  user: {
    id: string
    email: string
    role: string
    full_name?: string
  } | null
  state: SessionState
  traceId: string
  timestamp: number
  error?: string
}

export interface SessionEvent {
  traceId: string
  event: string
  data: any
  timestamp: number
}

export interface LoginResult {
  success: boolean
  redirectTo: string
  traceId: string
}

// ============================================================================
// SESSION MANAGER CLASS
// ============================================================================

export class SessionManager {
  private static instance: SessionManager
  private supabase: SupabaseClient | null = null
  
  // Observable state (para hooks React)
  private sessionSubject: BehaviorSubject<SessionData>
  
  // Histórico de eventos (debugging)
  private eventLog: SessionEvent[] = []
  private maxLogSize = 100

  private constructor() {
    // Inicializar com estado idle
    this.sessionSubject = new BehaviorSubject<SessionData>({
      user: null,
      state: 'idle',
      traceId: this.generateTraceId(),
      timestamp: Date.now()
    })

    // Apenas inicializar Supabase no cliente
    if (typeof window !== 'undefined') {
      this.initializeSupabase()
      this.initializeSupabaseListener()
      this.restoreSessionFromStorage()
    }
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  private initializeSupabase() {
    if (typeof window !== 'undefined' && !this.supabase) {
      this.supabase = getSupabaseBrowserClient()
    }
  }

  private getSupabase() {
    if (!this.supabase) {
      this.initializeSupabase()
    }
    return this.supabase!
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Iniciar login (único ponto de entrada)
   */
  async login(
    email: string,
    password: string,
    mode: 'dashboard' | 'studio' = 'dashboard'
  ): Promise<LoginResult> {
    const traceId = this.generateTraceId()
    
    try {
      this.updateState({
        state: 'authenticating',
        traceId,
        timestamp: Date.now()
      })

      this.logEvent(traceId, 'LOGIN_START', { email, mode })

      // Autenticar com Supabase (única fonte de verdade)
      const { data, error } = await this.getSupabase().auth.signInWithPassword({
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

      // Extrair dados do usuário
      const userData = {
        id: data.user.id,
        email: data.user.email!,
        role: (data.user.app_metadata?.role || 'user') as string,
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0]
      }

      // Atualizar estado local
      this.updateState({
        user: userData,
        state: 'authenticated',
        traceId,
        timestamp: Date.now()
      })

      this.logEvent(traceId, 'LOGIN_COMPLETE', { mode })

      const redirectTo = mode === 'studio' ? '/studio' : '/dashboard'

      return {
        success: true,
        redirectTo,
        traceId
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      this.logEvent(traceId, 'LOGIN_ERROR', { error: errorMessage })

      this.updateState({
        state: 'error',
        error: errorMessage,
        traceId,
        timestamp: Date.now()
      })

      throw error
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const traceId = this.generateTraceId()
    
    this.logEvent(traceId, 'LOGOUT_START', {})

    try {
      await this.getSupabase().auth.signOut()

      this.updateState({
        user: null,
        state: 'idle',
        traceId,
        timestamp: Date.now()
      })

      this.clearStorage()
      this.logEvent(traceId, 'LOGOUT_COMPLETE', {})
    } catch (error) {
      this.logEvent(traceId, 'LOGOUT_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error'
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
  getSessionObservable(): Observable<SessionData> {
    return this.sessionSubject.asObservable()
  }

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    const session = this.getSession()
    return session.state === 'authenticated' && !!session.user
  }

  /**
   * Debug: obter logs
   */
  getEventLog(): SessionEvent[] {
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

  /**
   * Debug: limpar logs
   */
  clearEventLog(): void {
    this.eventLog = []
    console.log('[SessionManager] Event log cleared')
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private updateState(updates: Partial<SessionData>): void {
    const current = this.sessionSubject.value
    const newState = { ...current, ...updates }
    
    this.sessionSubject.next(newState)
    this.persistToStorage(newState)
    
    console.log(`[SessionManager] State updated [${updates.traceId || current.traceId}]:`, {
      state: newState.state,
      hasUser: !!newState.user,
      email: newState.user?.email,
      timestamp: new Date(newState.timestamp).toISOString()
    })
  }

  private logEvent(traceId: string, event: string, data: any): void {
    const entry: SessionEvent = {
      traceId,
      event,
      data,
      timestamp: Date.now()
    }
    
    this.eventLog.push(entry)
    
    // Manter apenas últimos N eventos
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift()
    }

    console.log(`[SessionManager] [${traceId}] ${event}:`, data)
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSupabaseListener(): void {
    this.getSupabase().auth.onAuthStateChange((event, session) => {
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
            role: (session.user.app_metadata?.role || 'user') as string,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
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

  private persistToStorage(state: SessionData): void {
    if (typeof window === 'undefined') return

    try {
      // Apenas metadados no localStorage (não JWT completo - segurança)
      const metadata = {
        hasUser: !!state.user,
        email: state.user?.email,
        state: state.state,
        timestamp: state.timestamp,
        lastTraceId: state.traceId
      }
      
      localStorage.setItem('nova-ipe-session-meta', JSON.stringify(metadata))
    } catch (error) {
      console.warn('[SessionManager] Failed to persist to storage:', error)
    }
  }

  private restoreSessionFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('nova-ipe-session-meta')
      if (!stored) return

      const metadata = JSON.parse(stored)
      
      // Verificar se sessão ainda é válida (< 24h)
      if (Date.now() - metadata.timestamp > 24 * 60 * 60 * 1000) {
        this.clearStorage()
        this.logEvent(this.generateTraceId(), 'SESSION_EXPIRED', {
          reason: 'Older than 24h'
        })
        return
      }

      // Validar com Supabase
      this.getSupabase().auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const traceId = this.generateTraceId()
          this.logEvent(traceId, 'SESSION_RESTORED', {
            email: session.user.email,
            wasStoredAt: new Date(metadata.timestamp).toISOString()
          })
        }
      })

    } catch (error) {
      console.warn('[SessionManager] Failed to restore session:', error)
      this.clearStorage()
    }
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('nova-ipe-session-meta')
    } catch (error) {
      console.warn('[SessionManager] Failed to clear storage:', error)
    }
  }
}

// ============================================================================
// SINGLETON EXPORT - Safe for SSR
// ============================================================================

// Lazy initialization - só cria quando realmente usado no client
let _sessionManager: SessionManager | null = null

export function getSessionManager(): SessionManager {
  if (typeof window === 'undefined') {
    // No servidor, retorna um mock que não faz nada
    throw new Error('SessionManager só pode ser usado no client-side')
  }
  
  if (!_sessionManager) {
    _sessionManager = SessionManager.getInstance()
  }
  
  return _sessionManager
}

// Compat export
export const sessionManager = typeof window !== 'undefined' ? SessionManager.getInstance() : null as any
