/**
 * 🎯 Error Handler - Core Types & Interfaces
 * Arquitetura madura com separação de concerns
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum ErrorCategory {
  // Authentication
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_RATE_LIMIT = 'AUTH_RATE_LIMIT',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_EMAIL_NOT_CONFIRMED = 'AUTH_EMAIL_NOT_CONFIRMED',
  
  // Network
  NETWORK_ERROR = 'NETWORK_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  
  // Server
  SERVER_ERROR = 'SERVER_ERROR',
  SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE',
  
  // Client
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SESSION_ERROR = 'SESSION_ERROR',
  
  // Fallback
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'LOW',        // Pode continuar, aviso apenas
  MEDIUM = 'MEDIUM',  // Deve tentar novamente
  HIGH = 'HIGH',      // Problema sério, requer ação
  CRITICAL = 'CRITICAL', // Sistema crítico falhando
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface ErrorContext {
  loginMode?: string
  email?: string
  attemptNumber?: number
  timestamp?: string
  userAgent?: string
  url?: string
  [key: string]: unknown
}

export interface ErrorDetails {
  readonly category: ErrorCategory
  readonly severity: ErrorSeverity
  readonly title: string
  readonly message: string
  readonly technicalMessage: string
  readonly userAction: string
  readonly canRetry: boolean
  readonly retryDelay?: number
  readonly httpStatus?: number
  readonly timestamp: string
  readonly stackTrace?: string
  readonly context?: ErrorContext
  readonly originalError?: unknown
}

export interface ErrorMetrics {
  readonly errorId: string
  readonly category: ErrorCategory
  readonly severity: ErrorSeverity
  readonly timestamp: string
  readonly duration: number
  readonly attemptNumber: number
  readonly userEmail?: string
  readonly loginMode?: string
  readonly userAgent: string
  readonly screenResolution: string
  readonly networkType?: string
  readonly environment?: EnvironmentSnapshot
  readonly environmentIssues?: readonly string[]
}

export interface EnvironmentSnapshot {
  // Browser
  readonly userAgent: string
  readonly language: string
  readonly platform: string
  readonly vendor: string
  readonly cookiesEnabled: boolean
  readonly doNotTrack: string | null
  
  // Screen
  readonly screenWidth: number
  readonly screenHeight: number
  readonly screenColorDepth: number
  readonly screenPixelRatio: number
  
  // Viewport
  readonly viewportWidth: number
  readonly viewportHeight: number
  
  // Network
  readonly online: boolean
  readonly connectionType?: string
  readonly effectiveType?: string
  readonly downlink?: number
  readonly rtt?: number
  readonly saveData?: boolean
  
  // Memory
  readonly jsHeapSizeLimit?: number
  readonly totalJSHeapSize?: number
  readonly usedJSHeapSize?: number
  
  // Storage
  readonly localStorageAvailable: boolean
  readonly sessionStorageAvailable: boolean
  
  // Timing
  readonly timestamp: string
  readonly timezoneOffset: number
  
  // Page
  readonly url: string
  readonly referrer: string
  
  // Performance
  readonly performanceTimingAvailable: boolean
  readonly navigationTiming?: {
    readonly domContentLoaded?: number
    readonly loadComplete?: number
  }
}

export interface ErrorStats {
  readonly total: number
  readonly byCategory: Readonly<Record<string, number>>
  readonly bySeverity: Readonly<Record<string, number>>
  readonly lastError?: ErrorMetrics
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  )
}

export function hasStatusCode(value: unknown): value is { status: number } | { statusCode: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('status' in value || 'statusCode' in value)
  )
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ErrorHandler = (error: unknown, context?: ErrorContext) => ErrorDetails
export type ErrorReporter = (details: ErrorDetails, metrics: ErrorMetrics) => void
export type ErrorTransformer = (error: unknown) => ErrorDetails

// ============================================================================
// CONSTANTS
// ============================================================================

export const ERROR_SEVERITY_MAP: Readonly<Record<ErrorCategory, ErrorSeverity>> = {
  [ErrorCategory.AUTH_INVALID_CREDENTIALS]: ErrorSeverity.MEDIUM,
  [ErrorCategory.AUTH_RATE_LIMIT]: ErrorSeverity.HIGH,
  [ErrorCategory.AUTH_ACCOUNT_LOCKED]: ErrorSeverity.HIGH,
  [ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED]: ErrorSeverity.MEDIUM,
  [ErrorCategory.NETWORK_ERROR]: ErrorSeverity.MEDIUM,
  [ErrorCategory.NETWORK_TIMEOUT]: ErrorSeverity.MEDIUM,
  [ErrorCategory.NETWORK_OFFLINE]: ErrorSeverity.HIGH,
  [ErrorCategory.SERVER_ERROR]: ErrorSeverity.HIGH,
  [ErrorCategory.SERVER_UNAVAILABLE]: ErrorSeverity.CRITICAL,
  [ErrorCategory.VALIDATION_ERROR]: ErrorSeverity.LOW,
  [ErrorCategory.SESSION_ERROR]: ErrorSeverity.HIGH,
  [ErrorCategory.UNKNOWN_ERROR]: ErrorSeverity.MEDIUM,
} as const

export const DEFAULT_RETRY_DELAYS: Readonly<Record<ErrorCategory, number>> = {
  [ErrorCategory.AUTH_INVALID_CREDENTIALS]: 0,
  [ErrorCategory.AUTH_RATE_LIMIT]: 300, // 5 minutos
  [ErrorCategory.AUTH_ACCOUNT_LOCKED]: 0,
  [ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED]: 0,
  [ErrorCategory.NETWORK_ERROR]: 5,
  [ErrorCategory.NETWORK_TIMEOUT]: 10,
  [ErrorCategory.NETWORK_OFFLINE]: 5,
  [ErrorCategory.SERVER_ERROR]: 30,
  [ErrorCategory.SERVER_UNAVAILABLE]: 60,
  [ErrorCategory.VALIDATION_ERROR]: 0,
  [ErrorCategory.SESSION_ERROR]: 10,
  [ErrorCategory.UNKNOWN_ERROR]: 10,
} as const
