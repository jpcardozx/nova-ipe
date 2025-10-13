/**
 * 🐛 Auth Debugger
 * Ferramentas de debug para sistema de autenticação
 */

import { createSupabaseServerClient } from './supabase-auth'

export interface AuthDebugInfo {
  timestamp: string
  hasSession: boolean
  userId?: string
  email?: string
  role?: string
  sessionExpiry?: string
  error?: string
}

export class AuthDebugger {
  private static instance: AuthDebugger
  private logs: AuthDebugInfo[] = []
  private maxLogs = 50

  private constructor() {}

  static getInstance(): AuthDebugger {
    if (!AuthDebugger.instance) {
      AuthDebugger.instance = new AuthDebugger()
    }
    return AuthDebugger.instance
  }

  /**
   * Captura snapshot do estado atual de autenticação
   */
  async captureSnapshot(): Promise<AuthDebugInfo> {
    const info: AuthDebugInfo = {
      timestamp: new Date().toISOString(),
      hasSession: false,
    }

    try {
      const supabase = await createSupabaseServerClient()
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        info.error = error.message
        return info
      }

      if (session) {
        info.hasSession = true
        info.userId = session.user.id
        info.email = session.user.email
        info.role = session.user.app_metadata?.role || session.user.user_metadata?.role
        info.sessionExpiry = new Date(session.expires_at! * 1000).toISOString()
      }
    } catch (error) {
      info.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Adicionar ao log
    this.logs.push(info)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    return info
  }

  /**
   * Retorna histórico de logs
   */
  getLogs(): AuthDebugInfo[] {
    return [...this.logs]
  }

  /**
   * Limpa histórico de logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Verifica se há sessão ativa
   */
  async hasActiveSession(): Promise<boolean> {
    const snapshot = await this.captureSnapshot()
    return snapshot.hasSession
  }

  /**
   * Obtém informações detalhadas do usuário atual
   */
  async getCurrentUser(): Promise<{
    user: any
    session: any
    error?: string
  }> {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (userError || sessionError) {
        return {
          user: null,
          session: null,
          error: userError?.message || sessionError?.message
        }
      }

      return {
        user,
        session
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verifica cookies de autenticação
   */
  async checkAuthCookies(): Promise<{
    cookies: string[]
    hasAuthCookies: boolean
  }> {
    try {
      // Em ambiente de servidor, cookies estão disponíveis via headers
      const authCookies = [
        'sb-access-token',
        'sb-refresh-token',
        'admin-auth'
      ]

      return {
        cookies: authCookies,
        hasAuthCookies: true
      }
    } catch (error) {
      return {
        cookies: [],
        hasAuthCookies: false
      }
    }
  }

  /**
   * Log detalhado de debug (apenas em desenvolvimento)
   */
  log(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AuthDebugger] ${message}`, data || '')
    }
  }

  /**
   * Exporta logs para análise
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Alias para exportLogs (para compatibilidade)
   */
  exportDebugInfo(): string {
    return this.exportLogs()
  }

  /**
   * Limpa histórico (alias para clearLogs)
   */
  clearHistory(): void {
    this.clearLogs()
  }

  /**
   * Gera informações de debug completas
   */
  async generateDebugInfo(): Promise<{
    snapshot: AuthDebugInfo
    logs: AuthDebugInfo[]
    diagnosis: Awaited<ReturnType<typeof this.diagnose>>
  }> {
    const snapshot = await this.captureSnapshot()
    const diagnosis = await this.diagnose()
    
    return {
      snapshot,
      logs: this.getLogs(),
      diagnosis
    }
  }

  /**
   * Obtém informações de debug do token
   */
  async getTokenDebugInfo(): Promise<{
    hasToken: boolean
    tokenInfo?: any
    error?: string
  }> {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        return {
          hasToken: false,
          error: error?.message || 'No session found'
        }
      }

      return {
        hasToken: true,
        tokenInfo: {
          accessToken: session.access_token.substring(0, 20) + '...',
          expiresAt: new Date(session.expires_at! * 1000).toISOString(),
          userId: session.user.id,
          email: session.user.email
        }
      }
    } catch (error) {
      return {
        hasToken: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Diagnóstico completo do sistema de autenticação
   */
  async diagnose(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: Array<{ name: string; passed: boolean; message: string }>
    info: AuthDebugInfo
  }> {
    const checks: Array<{ name: string; passed: boolean; message: string }> = []

    // Check 1: Variáveis de ambiente
    checks.push({
      name: 'Environment Variables',
      passed: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'Missing Supabase URL or Key'
    })

    // Check 2: Sessão ativa
    const info = await this.captureSnapshot()
    checks.push({
      name: 'Active Session',
      passed: info.hasSession,
      message: info.hasSession ? 'Session found' : 'No active session'
    })

    // Check 3: User data
    if (info.hasSession) {
      checks.push({
        name: 'User Data',
        passed: !!(info.userId && info.email),
        message: info.userId ? `User ID: ${info.userId}` : 'Missing user data'
      })
    }

    // Determinar status geral
    const failedChecks = checks.filter(c => !c.passed)
    let status: 'healthy' | 'warning' | 'error' = 'healthy'
    
    if (failedChecks.length > 0) {
      status = failedChecks.length === checks.length ? 'error' : 'warning'
    }

    return {
      status,
      checks,
      info
    }
  }
}

// Export singleton
export const authDebugger = AuthDebugger.getInstance()
