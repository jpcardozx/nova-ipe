/**
 * 🎯 Login Error Handling System - Main Export
 * Arquitetura madura com separação de responsabilidades
 * 
 * @version 2.0
 * @architecture Clean Architecture + Singleton Pattern
 */

// ============================================================================
// MAIN API - Recomendado para uso
// ============================================================================

export {
  // Facade Principal
  loginErrorHandler,
  handleLoginError,
  
  // Classes (para casos avançados)
  LoginErrorHandler,
  ErrorLogger,
  ErrorMetricsGenerator,
  
  // Builder
  buildErrorDetails,
  
  // Types
  type ErrorDetails,
  type ErrorMetrics,
  type ErrorStats,
  type ErrorContext,
  type EnvironmentSnapshot,
  
  // Enums
  ErrorCategory,
  ErrorSeverity,
} from './error-handler-v2'

// ============================================================================
// UTILITIES
// ============================================================================

export {
  captureEnvironment,
  logEnvironmentSnapshot,
  detectEnvironmentIssues,
} from './environment-capture'

export {
  errorCategorizer,
  ErrorCategorizer,
} from './error-categorizer'

export {
  errorDetailsBuilder,
  ErrorDetailsBuilder,
} from './error-builder'

// ============================================================================
// TYPE GUARDS
// ============================================================================

export {
  isError,
  hasMessage,
  hasStatusCode,
} from './error-types'

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  ERROR_SEVERITY_MAP,
  DEFAULT_RETRY_DELAYS,
} from './error-types'

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Exemplo de uso básico:
 * 
 * ```typescript
 * import { handleLoginError } from '@/app/login/lib/error-handling'
 * 
 * try {
 *   await login(email, password)
 * } catch (error) {
 *   const { details, metrics } = handleLoginError(
 *     error,
 *     attemptNumber,
 *     duration,
 *     { email, loginMode: 'dashboard' }
 *   )
 *   
 *   // Usar details para UI
 *   setError({
 *     title: details.title,
 *     message: details.message,
 *     technical: `[${metrics.errorId}] ${details.category}`
 *   })
 * }
 * ```
 * 
 * Exemplo avançado com debug:
 * 
 * ```typescript
 * import { loginErrorHandler } from '@/app/login/lib/error-handling'
 * 
 * // Ativar debug mode
 * loginErrorHandler.setDebugMode(true)
 * 
 * // Obter estatísticas
 * const stats = loginErrorHandler.getStats()
 * console.log('Total errors:', stats.total)
 * console.log('By category:', stats.byCategory)
 * 
 * // Limpar histórico
 * loginErrorHandler.clearHistory()
 * ```
 */
