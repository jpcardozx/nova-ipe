/**
 * 🏗️ Error Details Builder - Constrói detalhes estruturados do erro
 * Responsável por criar objetos ErrorDetails completos
 */

import type { ErrorDetails, ErrorContext } from './error-types'
import { ErrorCategory, ErrorSeverity, ERROR_SEVERITY_MAP, DEFAULT_RETRY_DELAYS } from './error-types'
import { errorCategorizer } from './error-categorizer'

// ============================================================================
// ERROR MESSAGES MAP
// ============================================================================

interface ErrorMessageTemplate {
  readonly title: string
  readonly message: string
  readonly technicalMessage: string
  readonly userAction: string
  readonly canRetry: boolean
}

const ERROR_MESSAGES: Readonly<Record<ErrorCategory, ErrorMessageTemplate>> = {
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
  },
  [ErrorCategory.SERVER_UNAVAILABLE]: {
    title: 'Serviço Temporariamente Indisponível',
    message: 'Nossos servidores estão temporariamente indisponíveis. Estamos trabalhando para resolver.',
    technicalMessage: 'Service unavailable (503)',
    userAction: 'Aguarde alguns minutos e tente novamente. Estamos trabalhando para restaurar o serviço.',
    canRetry: true,
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
    technicalMessage: 'Unknown error occurred',
    userAction: 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
    canRetry: true,
  },
} as const

// ============================================================================
// ERROR DETAILS BUILDER
// ============================================================================

export class ErrorDetailsBuilder {
  private static instance: ErrorDetailsBuilder
  
  private constructor() {}
  
  static getInstance(): ErrorDetailsBuilder {
    if (!ErrorDetailsBuilder.instance) {
      ErrorDetailsBuilder.instance = new ErrorDetailsBuilder()
    }
    return ErrorDetailsBuilder.instance
  }
  
  /**
   * Constrói ErrorDetails a partir de um erro
   */
  build(error: unknown, context?: ErrorContext): ErrorDetails {
    const category = errorCategorizer.categorize(error)
    const severity = ERROR_SEVERITY_MAP[category]
    const template = ERROR_MESSAGES[category]
    const timestamp = new Date().toISOString()
    
    // Extrair informações adicionais
    const stackTrace = this.extractStackTrace(error)
    const httpStatus = this.extractStatusCode(error)
    const retryDelay = DEFAULT_RETRY_DELAYS[category]
    
    return {
      category,
      severity,
      title: template.title,
      message: template.message,
      technicalMessage: this.buildTechnicalMessage(error, template.technicalMessage),
      userAction: template.userAction,
      canRetry: template.canRetry,
      retryDelay: retryDelay > 0 ? retryDelay : undefined,
      httpStatus,
      timestamp,
      stackTrace,
      context,
      originalError: error,
    }
  }
  
  /**
   * Extrai stack trace do erro
   */
  private extractStackTrace(error: unknown): string | undefined {
    if (error instanceof Error && error.stack) {
      return error.stack
    }
    return undefined
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
  
  /**
   * Constrói mensagem técnica detalhada
   */
  private buildTechnicalMessage(error: unknown, baseMessage: string): string {
    const originalMessage = this.extractMessage(error)
    
    if (originalMessage && originalMessage !== baseMessage) {
      return `${baseMessage} - ${originalMessage}`
    }
    
    return baseMessage
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
    
    return ''
  }
}

// Export singleton instance
export const errorDetailsBuilder = ErrorDetailsBuilder.getInstance()

// Export convenience function
export function buildErrorDetails(error: unknown, context?: ErrorContext): ErrorDetails {
  return errorDetailsBuilder.build(error, context)
}
