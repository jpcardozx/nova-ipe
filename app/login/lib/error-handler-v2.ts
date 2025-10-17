/**
 * 🎯 Error Handler - Refactored with Mature Architecture
 * Sistema principal de error handling com separação de responsabilidades
 * 
 * @version 2.0
 * @architecture Clean Architecture + Singleton Pattern
 */

import type { ErrorDetails, ErrorMetrics, ErrorStats, ErrorContext, EnvironmentSnapshot } from './error-types'
import { ErrorCategory, ErrorSeverity } from './error-types'
import { buildErrorDetails } from './error-builder'
import { 
  captureEnvironment, 
  logEnvironmentSnapshot, 
  detectEnvironmentIssues 
} from './environment-capture'

// ============================================================================
// ERROR METRICS GENERATOR
// ============================================================================

export class ErrorMetricsGenerator {
  private static instance: ErrorMetricsGenerator
  
  private constructor() {}
  
  static getInstance(): ErrorMetricsGenerator {
    if (!ErrorMetricsGenerator.instance) {
      ErrorMetricsGenerator.instance = new ErrorMetricsGenerator()
    }
    return ErrorMetricsGenerator.instance
  }
  
  /**
   * Gera métricas completas do erro
   */
  generate(
    errorDetails: ErrorDetails,
    attemptNumber: number,
    duration: number,
    userEmail?: string,
    loginMode?: string
  ): ErrorMetrics {
    const errorId = this.generateErrorId()
    const environment = captureEnvironment()
    const environmentIssues = detectEnvironmentIssues(environment)
    
    return {
      errorId,
      category: errorDetails.category,
      severity: errorDetails.severity,
      timestamp: errorDetails.timestamp,
      duration,
      attemptNumber,
      userEmail: userEmail ? this.obfuscateEmail(userEmail) : undefined,
      loginMode,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      networkType: this.getNetworkType(),
      environment,
      environmentIssues: environmentIssues.length > 0 ? environmentIssues : undefined,
    }
  }
  
  /**
   * Gera ID único para o erro
   */
  private generateErrorId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 11)
    return `ERR_${timestamp}_${random}`
  }
  
  /**
   * Ofusca parcialmente o email
   */
  private obfuscateEmail(email: string): string {
    const [local, domain] = email.split('@')
    if (!domain) return email
    
    const obfuscatedLocal = local.length > 2 
      ? `${local.substring(0, 2)}***`
      : `${local[0]}***`
    
    return `${obfuscatedLocal}@${domain}`
  }
  
  /**
   * Obtém tipo de rede
   */
  private getNetworkType(): string | undefined {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection
    
    return connection?.effectiveType
  }
}

// ============================================================================
// ERROR LOGGER
// ============================================================================

export class ErrorLogger {
  private static instance: ErrorLogger
  private errorHistory: ErrorMetrics[] = []
  private debugMode: boolean = false
  private readonly MAX_HISTORY_SIZE = 50
  
  private constructor() {
    this.debugMode = this.detectDebugMode()
  }
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }
  
  /**
   * Detecta se está em debug mode
   */
  private detectDebugMode(): boolean {
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem('LOGIN_DEBUG_MODE') === 'true'
    }
    
    return false
  }
  
  /**
   * Ativa/desativa debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('LOGIN_DEBUG_MODE', enabled ? 'true' : 'false')
    }
  }
  
  /**
   * Registra um erro com todos os detalhes
   */
  log(errorDetails: ErrorDetails, metrics: ErrorMetrics): void {
    // Adicionar ao histórico
    this.addToHistory(metrics)
    
    // Log estruturado no console
    this.logToConsole(errorDetails, metrics)
    
    // Enviar para monitoring (produção)
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(errorDetails, metrics)
    }
  }
  
  /**
   * Adiciona ao histórico
   */
  private addToHistory(metrics: ErrorMetrics): void {
    this.errorHistory.push(metrics)
    
    // Limitar tamanho do histórico
    if (this.errorHistory.length > this.MAX_HISTORY_SIZE) {
      this.errorHistory.shift()
    }
  }
  
  /**
   * Log estruturado no console
   */
  private logToConsole(errorDetails: ErrorDetails, metrics: ErrorMetrics): void {
    const severityColor = this.getSeverityColor(metrics.severity)
    const logStyle = `background: ${severityColor}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;`
    
    console.group(`%c🚨 LOGIN ERROR [${metrics.errorId}]`, logStyle)
    
    // Metrics
    console.log('📊 Metrics:', {
      category: metrics.category,
      severity: metrics.severity,
      timestamp: new Date(metrics.timestamp).toLocaleString('pt-BR'),
      duration: `${metrics.duration}ms`,
      attempt: metrics.attemptNumber,
      mode: metrics.loginMode,
    })
    
    // Details
    console.log('📝 Details:', {
      title: errorDetails.title,
      message: errorDetails.message,
      canRetry: errorDetails.canRetry,
      retryDelay: errorDetails.retryDelay ? `${errorDetails.retryDelay}s` : 'N/A',
    })
    
    // Environment Issues (sempre mostrar se houver)
    if (metrics.environmentIssues && metrics.environmentIssues.length > 0) {
      console.warn('⚠️ Environment Issues:', metrics.environmentIssues)
    }
    
    // Debug mode details
    if (this.debugMode) {
      console.log('🔧 Technical:', {
        technicalMessage: errorDetails.technicalMessage,
        httpStatus: errorDetails.httpStatus,
        context: errorDetails.context,
      })
      
      if (errorDetails.stackTrace) {
        console.log('📚 Stack Trace:')
        console.log(errorDetails.stackTrace)
      }
      
      if (errorDetails.originalError) {
        console.log('🔍 Original Error:', errorDetails.originalError)
      }
      
      if (metrics.environment) {
        logEnvironmentSnapshot(metrics.environment)
      }
    }
    
    console.groupEnd()
  }
  
  /**
   * Obtém cor baseada na severidade
   */
  private getSeverityColor(severity: ErrorSeverity): string {
    const colors: Record<ErrorSeverity, string> = {
      [ErrorSeverity.LOW]: '#6b7280',
      [ErrorSeverity.MEDIUM]: '#f59e0b',
      [ErrorSeverity.HIGH]: '#ef4444',
      [ErrorSeverity.CRITICAL]: '#991b1b',
    }
    return colors[severity]
  }
  
  /**
   * Envia para serviço de monitoring (Sentry, etc)
   */
  private sendToMonitoring(errorDetails: ErrorDetails, metrics: ErrorMetrics): void {
    try {
      // Placeholder para integração com Sentry/LogRocket/DataDog
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(errorDetails.originalError, {
          tags: {
            errorCategory: errorDetails.category,
            errorSeverity: errorDetails.severity,
            loginMode: metrics.loginMode,
            errorId: metrics.errorId,
          },
          extra: {
            errorDetails,
            metrics,
          },
          level: this.mapSeverityToSentryLevel(errorDetails.severity),
        })
      }
      
      // Log que tentou enviar
      console.log('[ErrorLogger] Would send to monitoring:', metrics.errorId)
    } catch (err) {
      console.error('[ErrorLogger] Failed to send to monitoring:', err)
    }
  }
  
  /**
   * Mapeia severity para level do Sentry
   */
  private mapSeverityToSentryLevel(severity: ErrorSeverity): string {
    const map: Record<ErrorSeverity, string> = {
      [ErrorSeverity.LOW]: 'info',
      [ErrorSeverity.MEDIUM]: 'warning',
      [ErrorSeverity.HIGH]: 'error',
      [ErrorSeverity.CRITICAL]: 'fatal',
    }
    return map[severity]
  }
  
  /**
   * Obtém histórico de erros
   */
  getHistory(): readonly ErrorMetrics[] {
    return Object.freeze([...this.errorHistory])
  }
  
  /**
   * Obtém estatísticas
   */
  getStats(): ErrorStats {
    const byCategory: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    
    for (const error of this.errorHistory) {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1
    }
    
    return {
      total: this.errorHistory.length,
      byCategory: Object.freeze(byCategory),
      bySeverity: Object.freeze(bySeverity),
      lastError: this.errorHistory[this.errorHistory.length - 1],
    }
  }
  
  /**
   * Limpa histórico
   */
  clearHistory(): void {
    this.errorHistory = []
  }
}

// ============================================================================
// FACADE - API Principal
// ============================================================================

export class LoginErrorHandler {
  private static instance: LoginErrorHandler
  private readonly logger: ErrorLogger
  private readonly metricsGenerator: ErrorMetricsGenerator
  
  private constructor() {
    this.logger = ErrorLogger.getInstance()
    this.metricsGenerator = ErrorMetricsGenerator.getInstance()
  }
  
  static getInstance(): LoginErrorHandler {
    if (!LoginErrorHandler.instance) {
      LoginErrorHandler.instance = new LoginErrorHandler()
    }
    return LoginErrorHandler.instance
  }
  
  /**
   * Processa um erro completo (build + metrics + log)
   */
  handle(
    error: unknown,
    attemptNumber: number,
    duration: number,
    context?: ErrorContext
  ): { details: ErrorDetails; metrics: ErrorMetrics } {
    // Build error details
    const details = buildErrorDetails(error, context)
    
    // Generate metrics
    const metrics = this.metricsGenerator.generate(
      details,
      attemptNumber,
      duration,
      context?.email,
      context?.loginMode
    )
    
    // Log
    this.logger.log(details, metrics)
    
    return { details, metrics }
  }
  
  /**
   * Atalho para logging manual
   */
  logError(details: ErrorDetails, metrics: ErrorMetrics): void {
    this.logger.log(details, metrics)
  }
  
  /**
   * Obtém histórico
   */
  getHistory(): readonly ErrorMetrics[] {
    return this.logger.getHistory()
  }
  
  /**
   * Obtém estatísticas
   */
  getStats(): ErrorStats {
    return this.logger.getStats()
  }
  
  /**
   * Limpa histórico
   */
  clearHistory(): void {
    this.logger.clearHistory()
  }
  
  /**
   * Debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.logger.setDebugMode(enabled)
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export singleton instance
export const loginErrorHandler = LoginErrorHandler.getInstance()

// Export for backward compatibility
export const errorLogger = ErrorLogger.getInstance()
export const metricsGenerator = ErrorMetricsGenerator.getInstance()

// Export convenience function
export function handleLoginError(
  error: unknown,
  attemptNumber: number,
  duration: number,
  context?: ErrorContext
): { details: ErrorDetails; metrics: ErrorMetrics } {
  return loginErrorHandler.handle(error, attemptNumber, duration, context)
}

// Re-export types
export type { 
  ErrorDetails, 
  ErrorMetrics, 
  ErrorStats, 
  ErrorContext,
  EnvironmentSnapshot,
} from './error-types'
export { ErrorCategory, ErrorSeverity } from './error-types'

// Re-export builder (para casos específicos)
export { buildErrorDetails } from './error-builder'
