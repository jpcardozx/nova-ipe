/**
 * 🔐 Simple Auth Manager
 * Gerenciador simplificado de autenticação para formulários públicos
 */

export interface SignupData {
  full_name: string
  email: string
  phone: string
  department: string
  justification: string
}

export interface SignupResult {
  success: boolean
  message: string
  error?: string
  requestId?: string
}

export class SimpleAuthManager {
  /**
   * Registra uma solicitação de acesso (alias para submitAccessRequest)
   */
  static async submitAccessRequest(data: SignupData): Promise<SignupResult> {
    return this.requestAccess(data)
  }

  /**
   * Registra uma solicitação de acesso
   * Não cria usuário diretamente, apenas registra a solicitação para aprovação
   */
  static async requestAccess(data: SignupData): Promise<SignupResult> {
    try {
      // Validar dados básicos
      if (!data.email || !data.full_name) {
        return {
          success: false,
          message: 'Dados obrigatórios faltando',
          error: 'email_and_name_required'
        }
      }

      // Fazer requisição para API de criação de solicitação
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Erro ao processar solicitação',
          error: result.details
        }
      }

      return {
        success: true,
        message: 'Solicitação enviada com sucesso',
        requestId: result.requestId
      }

    } catch (error) {
      console.error('[SimpleAuthManager] Request error:', error)
      return {
        success: false,
        message: 'Erro ao enviar solicitação',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Valida formato de email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida formato de telefone brasileiro
   */
  static validatePhone(phone: string): boolean {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    // Verifica se tem 10 ou 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  /**
   * Formata telefone para padrão brasileiro
   */
  static formatPhone(phone: string): string {
    const clean = phone.replace(/\D/g, '')
    
    if (clean.length === 11) {
      return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (clean.length === 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    
    return phone
  }

  /**
   * Verifica status de uma solicitação de acesso
   */
  static async checkRequestStatus(requestId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'under_review'
    message?: string
  }> {
    try {
      const response = await fetch(`/api/auth/request-status/${requestId}`)
      
      if (!response.ok) {
        throw new Error('Failed to check status')
      }

      return await response.json()
    } catch (error) {
      console.error('[SimpleAuthManager] Status check error:', error)
      return {
        status: 'pending',
        message: 'Não foi possível verificar o status'
      }
    }
  }
}
