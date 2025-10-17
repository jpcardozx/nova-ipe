/**
 * 🔍 Error Handler & Debug System para Login
 * Sistema completo de captura, categorização e reporting de erros
 * 
 * Features:
 * - Tipagem forte de erros
 * - Stack traces estruturados
 * - Contexto detalhado para debugging
 * - Métricas e analytics
 * - Modo debug com informações técnicas
 * - Environment snapshot
 */

import { 
  captureEnvironment, 
  logEnvironmentSnapshot, 
  detectEnvironmentIssues,
  type EnvironmentSnapshot 
} from './environment-capture'

// ============================================================================
// TIPOS DE ERRO
// ============================================================================

export enum ErrorCategory {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_RATE_LIMIT = 'AUTH_RATE_LIMIT',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_EMAIL_NOT_CONFIRMED = 'AUTH_EMAIL_NOT_CONFIRMED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SESSION_ERROR = 'SESSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorDetails {
  category: ErrorCategory
  title: string
  message: string
  technicalMessage: string
  userAction: string
  canRetry: boolean
  retryDelay?: number // em segundos
  httpStatus?: number
  originalError?: any
  timestamp: string
  stackTrace?: string
  context?: Record<string, any>
}

export interface ErrorMetrics {
  errorId: string
  category: ErrorCategory
  timestamp: string
  duration: number // ms desde início do login
  attemptNumber: number
  userEmail?: string
  loginMode?: string
  userAgent: string
  screenResolution: string
  networkType?: string
  environment?: EnvironmentSnapshot
  environmentIssues?: string[]
}

// ============================================================================
// PATTERNS DE ERRO
// ============================================================================

const ERROR_PATTERNS = {
  // Auth errors
  INVALID_CREDENTIALS: [
    'Invalid login credentials',
    'invalid credentials',
    'wrong password',
    'incorrect password',
    'authentication failed',
  ],
  RATE_LIMIT: [
    'rate limit',
    'too many requests',
    'quota exceeded',
    'limit exceeded',
    'Email rate limit exceeded',
  ],
  ACCOUNT_LOCKED: [
    'account locked',
    'account suspended',
    'account disabled',
    'user blocked',
  ],
  EMAIL_NOT_CONFIRMED: [
    'email not confirmed',
    'verify your email',
    'confirmation required',
  ],
  
  // Network errors
  NETWORK_GENERIC: [
    'network error',
    'Failed to fetch',
    'fetch failed',
    'NetworkError',
  ],
  NETWORK_TIMEOUT: [
    'timeout',
    'timed out',
    'request timeout',
    'ETIMEDOUT',
  ],
  NETWORK_OFFLINE: [
    'offline',
    'no internet',
    'connection failed',
    'ERR_INTERNET_DISCONNECTED',
  ],
  
  // Server errors
  SERVER_ERROR: [
    'internal server error',
    'server error',
    '500',
    'database error',
  ],
  SERVER_UNAVAILABLE: [
    'service unavailable',
    '503',
    'server unavailable',
    'maintenance',
  ],
}

// ============================================================================
// ERROR CATEGORIZATION
// ============================================================================

function categorizeError(error: any): ErrorCategory {
  const errorMessage = (error?.message || error?.toString() || '').toLowerCase()
  const errorCode = error?.code?.toLowerCase() || ''
  const httpStatus = error?.status || error?.statusCode

  // Check HTTP status first
  if (httpStatus === 401 || httpStatus === 403) {
    return ErrorCategory.AUTH_INVALID_CREDENTIALS
  }
  if (httpStatus === 429) {
    return ErrorCategory.AUTH_RATE_LIMIT
  }
  if (httpStatus >= 500) {
    return ErrorCategory.SERVER_ERROR
  }

  // Check error patterns
  for (const pattern of ERROR_PATTERNS.INVALID_CREDENTIALS) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.AUTH_INVALID_CREDENTIALS
    }
  }

  for (const pattern of ERROR_PATTERNS.RATE_LIMIT) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.AUTH_RATE_LIMIT
    }
  }

  for (const pattern of ERROR_PATTERNS.ACCOUNT_LOCKED) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.AUTH_ACCOUNT_LOCKED
    }
  }

  for (const pattern of ERROR_PATTERNS.EMAIL_NOT_CONFIRMED) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED
    }
  }

  for (const pattern of ERROR_PATTERNS.NETWORK_TIMEOUT) {
    if (errorMessage.includes(pattern.toLowerCase()) || errorCode.includes('timeout')) {
      return ErrorCategory.NETWORK_TIMEOUT
    }
  }

  for (const pattern of ERROR_PATTERNS.NETWORK_OFFLINE) {
    if (errorMessage.includes(pattern.toLowerCase()) || !navigator.onLine) {
      return ErrorCategory.NETWORK_OFFLINE
    }
  }

  for (const pattern of ERROR_PATTERNS.NETWORK_GENERIC) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.NETWORK_ERROR
    }
  }

  for (const pattern of ERROR_PATTERNS.SERVER_UNAVAILABLE) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.SERVER_UNAVAILABLE
    }
  }

  for (const pattern of ERROR_PATTERNS.SERVER_ERROR) {
    if (errorMessage.includes(pattern.toLowerCase())) {
      return ErrorCategory.SERVER_ERROR
    }
  }

  return ErrorCategory.UNKNOWN_ERROR
}

// ============================================================================
// ERROR DETAILS BUILDER
// ============================================================================

export function buildErrorDetails(error: any, context?: Record<string, any>): ErrorDetails {
  const category = categorizeError(error)
  const timestamp = new Date().toISOString()
  
  // Capturar stack trace se disponível
  let stackTrace: string | undefined
  if (error instanceof Error && error.stack) {
    stackTrace = error.stack
  }

  // Base details por categoria
  const detailsMap: Record<ErrorCategory, Omit<ErrorDetails, 'timestamp' | 'originalError' | 'stackTrace' | 'context' | 'category'>> = {
    [ErrorCategory.AUTH_INVALID_CREDENTIALS]: {
      title: 'Credenciais Inválidas',
      message: 'O email ou senha fornecidos estão incorretos. Por favor, verifique seus dados e tente novamente.',
      technicalMessage: 'Authentication failed: Invalid credentials provided',
      userAction: 'Verifique seu email e senha. Se esqueceu sua senha, use a opção "Esqueci minha senha".',
      canRetry: true,
    },
    [ErrorCategory.AUTH_RATE_LIMIT]: {
      title: 'Muitas Tentativas',
      message: 'Por segurança, bloqueamos temporariamente tentativas de login desta conta. Aguarde alguns minutos e tente novamente.',
      technicalMessage: 'Rate limit exceeded: Too many authentication attempts',
      userAction: 'Aguarde 5 minutos antes de tentar novamente. Isso protege sua conta contra tentativas não autorizadas.',
      canRetry: true,
      retryDelay: 300, // 5 minutos
    },
    [ErrorCategory.AUTH_ACCOUNT_LOCKED]: {
      title: 'Conta Bloqueada',
      message: 'Sua conta foi temporariamente bloqueada por questões de segurança. Entre em contato com o suporte.',
      technicalMessage: 'Account locked due to security policy',
      userAction: 'Contate o administrador do sistema ou suporte técnico para desbloquear sua conta.',
      canRetry: false,
    },
    [ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED]: {
      title: 'Email Não Confirmado',
      message: 'Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada.',
      technicalMessage: 'Email verification required',
      userAction: 'Abra o email de confirmação que enviamos e clique no link de verificação.',
      canRetry: false,
    },
    [ErrorCategory.NETWORK_ERROR]: {
      title: 'Erro de Conexão',
      message: 'Não foi possível conectar aos nossos servidores. Verifique sua conexão com a internet.',
      technicalMessage: 'Network request failed',
      userAction: 'Verifique sua conexão com a internet e tente novamente.',
      canRetry: true,
    },
    [ErrorCategory.NETWORK_TIMEOUT]: {
      title: 'Tempo Esgotado',
      message: 'A conexão demorou muito para responder. Isso pode ser um problema temporário de rede.',
      technicalMessage: 'Request timeout exceeded',
      userAction: 'Verifique sua conexão e tente novamente. Se o problema persistir, aguarde alguns minutos.',
      canRetry: true,
      retryDelay: 10,
    },
    [ErrorCategory.NETWORK_OFFLINE]: {
      title: 'Sem Conexão',
      message: 'Você está offline. Conecte-se à internet para fazer login.',
      technicalMessage: 'No internet connection detected',
      userAction: 'Conecte-se a uma rede Wi-Fi ou dados móveis e tente novamente.',
      canRetry: true,
    },
    [ErrorCategory.SERVER_ERROR]: {
      title: 'Erro no Servidor',
      message: 'Ocorreu um erro nos nossos servidores. Nossa equipe foi notificada automaticamente.',
      technicalMessage: 'Internal server error (500)',
      userAction: 'Aguarde alguns instantes e tente novamente. Se o problema persistir, entre em contato com o suporte.',
      canRetry: true,
      retryDelay: 30,
    },
    [ErrorCategory.SERVER_UNAVAILABLE]: {
      title: 'Serviço Temporariamente Indisponível',
      message: 'Nossos servidores estão temporariamente indisponíveis. Estamos trabalhando para resolver.',
      technicalMessage: 'Service unavailable (503)',
      userAction: 'Aguarde alguns minutos e tente novamente. Estamos trabalhando para restaurar o serviço.',
      canRetry: true,
      retryDelay: 60,
    },
    [ErrorCategory.SESSION_ERROR]: {
      title: 'Erro de Sessão',
      message: 'Houve um problema ao estabelecer sua sessão. Tente fazer login novamente.',
      technicalMessage: 'Session management error',
      userAction: 'Limpe o cache do navegador e tente fazer login novamente.',
      canRetry: true,
    },
    [ErrorCategory.VALIDATION_ERROR]: {
      title: 'Dados Inválidos',
      message: 'Os dados fornecidos são inválidos. Verifique o formato do email e senha.',
      technicalMessage: 'Validation error',
      userAction: 'Certifique-se de usar um email válido e uma senha com pelo menos 6 caracteres.',
      canRetry: true,
    },
    [ErrorCategory.UNKNOWN_ERROR]: {
      title: 'Erro Inesperado',
      message: 'Ocorreu um erro inesperado. Nossa equipe técnica foi notificada.',
      technicalMessage: error?.message || 'Unknown error occurred',
      userAction: 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
      canRetry: true,
      retryDelay: 10,
    },
  }

  const baseDetails = detailsMap[category]

  return {
    category,
    ...baseDetails,
    timestamp,
    originalError: error,
    stackTrace,
    context,
    httpStatus: error?.status || error?.statusCode,
  }
}

// ============================================================================
// ERROR METRICS & LOGGING
// ============================================================================

export function generateErrorMetrics(
  errorDetails: ErrorDetails,
  attemptNumber: number,
  duration: number,
  userEmail?: string,
  loginMode?: string
): ErrorMetrics {
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Capturar snapshot do ambiente
  const environment = captureEnvironment()
  const environmentIssues = detectEnvironmentIssues(environment)
  
  return {
    errorId,
    category: errorDetails.category,
    timestamp: errorDetails.timestamp,
    duration,
    attemptNumber,
    userEmail: userEmail ? userEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined, // Parcialmente ofuscado
    loginMode,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    networkType: (navigator as any).connection?.effectiveType,
    environment,
    environmentIssues: environmentIssues.length > 0 ? environmentIssues : undefined,
  }
}

// ============================================================================
// ERROR LOGGER
// ============================================================================

export class LoginErrorLogger {
  private static instance: LoginErrorLogger
  private errorHistory: ErrorMetrics[] = []
  private debugMode: boolean = false

  private constructor() {
    // Detectar debug mode (pode ser via ENV ou localStorage)
    this.debugMode = 
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && localStorage.getItem('LOGIN_DEBUG_MODE') === 'true')
  }

  static getInstance(): LoginErrorLogger {
    if (!LoginErrorLogger.instance) {
      LoginErrorLogger.instance = new LoginErrorLogger()
    }
    return LoginErrorLogger.instance
  }

  setDebugMode(enabled: boolean) {
    this.debugMode = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('LOGIN_DEBUG_MODE', enabled ? 'true' : 'false')
    }
  }

  logError(errorDetails: ErrorDetails, metrics: ErrorMetrics) {
    // Adicionar ao histórico
    this.errorHistory.push(metrics)
    
    // Limitar histórico a últimos 50 erros
    if (this.errorHistory.length > 50) {
      this.errorHistory.shift()
    }

    // Log estruturado no console
    const logStyle = 'background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    
    console.group(`%c🚨 LOGIN ERROR [${metrics.errorId}]`, logStyle)
    
    console.log('📊 Metrics:', {
      category: metrics.category,
      timestamp: new Date(metrics.timestamp).toLocaleString('pt-BR'),
      duration: `${metrics.duration}ms`,
      attempt: metrics.attemptNumber,
      mode: metrics.loginMode,
    })
    
    console.log('📝 Details:', {
      title: errorDetails.title,
      message: errorDetails.message,
      canRetry: errorDetails.canRetry,
      retryDelay: errorDetails.retryDelay ? `${errorDetails.retryDelay}s` : 'N/A',
    })
    
    // Mostrar issues do ambiente (sempre)
    if (metrics.environmentIssues && metrics.environmentIssues.length > 0) {
      console.warn('⚠️ Environment Issues:', metrics.environmentIssues)
    }
    
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
      
      // Log environment snapshot em debug mode
      if (metrics.environment) {
        logEnvironmentSnapshot(metrics.environment)
      }
    }
    
    console.groupEnd()

    // Se em produção, enviar para serviço de monitoring (Sentry, LogRocket, etc)
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(errorDetails, metrics)
    }
  }

  private sendToMonitoring(errorDetails: ErrorDetails, metrics: ErrorMetrics) {
    // Placeholder para integração com serviço de monitoring
    // Exemplo: Sentry, LogRocket, DataDog, etc
    
    try {
      // if (typeof window !== 'undefined' && (window as any).Sentry) {
      //   (window as any).Sentry.captureException(errorDetails.originalError, {
      //     tags: {
      //       errorCategory: errorDetails.category,
      //       loginMode: metrics.loginMode,
      //     },
      //     extra: {
      //       errorId: metrics.errorId,
      //       userAction: errorDetails.userAction,
      //       canRetry: errorDetails.canRetry,
      //     }
      //   })
      // }
      
      console.log('[ErrorLogger] Would send to monitoring:', metrics.errorId)
    } catch (err) {
      console.error('[ErrorLogger] Failed to send to monitoring:', err)
    }
  }

  getErrorHistory(): ErrorMetrics[] {
    return [...this.errorHistory]
  }

  clearHistory() {
    this.errorHistory = []
  }

  getStats() {
    const total = this.errorHistory.length
    const byCategory = this.errorHistory.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byCategory,
      lastError: this.errorHistory[this.errorHistory.length - 1],
    }
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const errorLogger = LoginErrorLogger.getInstance()

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isRetryableError(category: ErrorCategory): boolean {
  const nonRetryable = [
    ErrorCategory.AUTH_ACCOUNT_LOCKED,
    ErrorCategory.AUTH_EMAIL_NOT_CONFIRMED,
  ]
  return !nonRetryable.includes(category)
}

export function getRetryDelay(errorDetails: ErrorDetails): number {
  return errorDetails.retryDelay || 5 // default 5s
}

export function formatErrorForUser(errorDetails: ErrorDetails): string {
  return `${errorDetails.title}\n\n${errorDetails.message}\n\n${errorDetails.userAction}`
}
