/**
 * 🔍 Error Categorizer - Pattern Matching & Classification
 * Responsável por categorizar erros com base em patterns
 */

import { ErrorCategory } from './error-types'

// ============================================================================
// ERROR PATTERNS
// ============================================================================

interface ErrorPattern {
  readonly category: ErrorCategory
  readonly patterns: readonly string[]
  readonly statusCodes?: readonly number[]
}

const ERROR_PATTERNS: readonly ErrorPattern[] = [
  // Authentication
  {
    category: ErrorCategory.AUTH_INVALID_CREDENTIALS,
    patterns: [
      'invalid login credentials',
      'invalid credentials',
      'wrong password',
      'incorrect password',
      'authentication failed',
      'invalid email or password',
    ],
    statusCodes: [401, 403],
  },
  {
    category: ErrorCategory.AUTH_RATE_LIMIT,
    patterns: [
      'rate limit',
      'too many requests',
      'quota exceeded',
      'limit exceeded',
      'email rate limit exceeded',
    ],
    statusCodes: [429],
  },
  {
    category: ErrorCategory.AUTH_ACCOUNT_LOCKED,
    patterns: [
      'account locked',
      'account suspended',
      'account disabled',
      'user blocked',
    ],
  },
  {
    category: ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED,
    patterns: [
      'email not confirmed',
      'verify your email',
      'confirmation required',
      'email verification',
    ],
  },
  
  // Network
  {
    category: ErrorCategory.NETWORK_TIMEOUT,
    patterns: [
      'timeout',
      'timed out',
      'request timeout',
      'etimedout',
    ],
  },
  {
    category: ErrorCategory.NETWORK_OFFLINE,
    patterns: [
      'offline',
      'no internet',
      'connection failed',
      'err_internet_disconnected',
    ],
  },
  {
    category: ErrorCategory.NETWORK_ERROR,
    patterns: [
      'network error',
      'failed to fetch',
      'fetch failed',
      'networkerror',
    ],
  },
  
  // Server
  {
    category: ErrorCategory.SERVER_UNAVAILABLE,
    patterns: [
      'service unavailable',
      'server unavailable',
      'maintenance',
    ],
    statusCodes: [503],
  },
  {
    category: ErrorCategory.SERVER_ERROR,
    patterns: [
      'internal server error',
      'server error',
      'database error',
    ],
    statusCodes: [500, 502, 504],
  },
] as const

// ============================================================================
// CATEGORIZER
// ============================================================================

export class ErrorCategorizer {
  private static instance: ErrorCategorizer
  
  private constructor() {}
  
  static getInstance(): ErrorCategorizer {
    if (!ErrorCategorizer.instance) {
      ErrorCategorizer.instance = new ErrorCategorizer()
    }
    return ErrorCategorizer.instance
  }
  
  /**
   * Categoriza um erro baseado em seu conteúdo e status
   */
  categorize(error: unknown): ErrorCategory {
    // Extrair informações do erro
    const errorMessage = this.extractMessage(error).toLowerCase()
    const errorCode = this.extractCode(error).toLowerCase()
    const httpStatus = this.extractStatusCode(error)
    
    // 1. Verificar offline primeiro (mais rápido)
    if (!navigator.onLine) {
      return ErrorCategory.NETWORK_OFFLINE
    }
    
    // 2. Verificar HTTP status codes
    if (httpStatus !== undefined) {
      for (const pattern of ERROR_PATTERNS) {
        if (pattern.statusCodes?.includes(httpStatus)) {
          return pattern.category
        }
      }
    }
    
    // 3. Verificar patterns na mensagem e code
    for (const pattern of ERROR_PATTERNS) {
      for (const patternStr of pattern.patterns) {
        const lowerPattern = patternStr.toLowerCase()
        if (errorMessage.includes(lowerPattern) || errorCode.includes(lowerPattern)) {
          return pattern.category
        }
      }
    }
    
    // 4. Fallback
    return ErrorCategory.UNKNOWN_ERROR
  }
  
  /**
   * Extrai mensagem do erro
   */
  private extractMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const message = (error as { message: unknown }).message
      if (typeof message === 'string') {
        return message
      }
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    return String(error)
  }
  
  /**
   * Extrai código do erro
   */
  private extractCode(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: unknown }).code
      if (typeof code === 'string') {
        return code
      }
    }
    return ''
  }
  
  /**
   * Extrai status HTTP do erro
   */
  private extractStatusCode(error: unknown): number | undefined {
    if (typeof error === 'object' && error !== null) {
      const obj = error as Record<string, unknown>
      
      if ('status' in obj && typeof obj.status === 'number') {
        return obj.status
      }
      
      if ('statusCode' in obj && typeof obj.statusCode === 'number') {
        return obj.statusCode
      }
    }
    
    return undefined
  }
}

// Export singleton instance
export const errorCategorizer = ErrorCategorizer.getInstance()
