/**
 * Auth Logger - Sistema de debug inteligente
 * Logs estruturados e rastreáveis para debugging de autenticação
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  action: string
  details?: Record<string, any>
  userId?: string
  sessionId?: string
}

class AuthLogger {
  private static instance: AuthLogger
  private logs: LogEntry[] = []
  private maxLogs = 100
  private DEBUG = process.env.NODE_ENV === 'development'

  private constructor() {}

  static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger()
    }
    return AuthLogger.instance
  }

  private log(
    level: LogLevel,
    module: string,
    action: string,
    details?: Record<string, any>,
    userId?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      action,
      details,
      userId,
    }

    // Adicionar ao histórico
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Exibir no console apenas em desenvolvimento
    if (this.DEBUG) {
      const emoji = this.getEmoji(level)
      const color = this.getColor(level)
      
      console.log(
        `${emoji} [${module}] ${action}`,
        details ? details : ''
      )
    }

    // Em produção, enviar para serviço de monitoramento
    if (!this.DEBUG && level === 'error') {
      this.sendToMonitoring(entry)
    }
  }

  private getEmoji(level: LogLevel): string {
    const emojis = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅',
    }
    return emojis[level]
  }

  private getColor(level: LogLevel): string {
    const colors = {
      debug: '#666',
      info: '#0066cc',
      warn: '#ff9900',
      error: '#cc0000',
      success: '#00cc00',
    }
    return colors[level]
  }

  private sendToMonitoring(entry: LogEntry): void {
    // Implementar integração com serviço de monitoramento
    // Ex: Sentry, LogRocket, DataDog, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'auth_error', {
        module: entry.module,
        action: entry.action,
        details: JSON.stringify(entry.details),
      })
    }
  }

  // Métodos públicos
  debug(module: string, action: string, details?: Record<string, any>): void {
    this.log('debug', module, action, details)
  }

  info(module: string, action: string, details?: Record<string, any>): void {
    this.log('info', module, action, details)
  }

  warn(module: string, action: string, details?: Record<string, any>): void {
    this.log('warn', module, action, details)
  }

  error(module: string, action: string, details?: Record<string, any>): void {
    this.log('error', module, action, details)
  }

  success(module: string, action: string, details?: Record<string, any>): void {
    this.log('success', module, action, details)
  }

  // Métodos de utilidade
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Atalhos específicos para auth
  loginAttempt(email: string, mode: 'dashboard' | 'studio'): void {
    this.info('Auth', 'Login Attempt', { email, mode })
  }

  loginSuccess(email: string, mode: 'dashboard' | 'studio'): void {
    this.success('Auth', 'Login Success', { email, mode })
  }

  loginFailure(email: string, error: string): void {
    this.error('Auth', 'Login Failure', { email, error })
  }

  logoutAttempt(email?: string): void {
    this.info('Auth', 'Logout Attempt', { email })
  }

  sessionCheck(authenticated: boolean): void {
    this.debug('Auth', 'Session Check', { authenticated })
  }

  tokenRefresh(success: boolean): void {
    if (success) {
      this.success('Auth', 'Token Refresh', { success })
    } else {
      this.warn('Auth', 'Token Refresh Failed')
    }
  }

  middlewareCheck(path: string, authenticated: boolean): void {
    this.debug('Middleware', 'Route Check', { path, authenticated })
  }

  middlewareRedirect(from: string, to: string, reason: string): void {
    this.info('Middleware', 'Redirect', { from, to, reason })
  }
}

// Exportar instância singleton
export const authLogger = AuthLogger.getInstance()
