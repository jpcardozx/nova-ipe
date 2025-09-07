// lib/auth-simple.ts - Versão simplificada e funcional
import { supabase } from '@/lib/supabase'
import { SignupFormManager, type AccessRequestData, type FormSubmissionResult } from './signup-form-manager'

export interface AccessRequest {
  id?: string
  full_name: string
  email: string
  phone: string
  department: string
  requested_role: string
  justification: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
  reviewed_at?: string
  reviewed_by?: string
  reviewer_notes?: string
}

export interface LoginAttempt {
  email: string
  success: boolean
  ip_address: string
  attempted_at: string
}

// Funções essenciais para o sistema funcionar
export class SimpleAuthManager {
  private formManager: SignupFormManager

  constructor() {
    this.formManager = new SignupFormManager()
  }

  // Submeter solicitação de acesso com error handling robusto
  async submitAccessRequest(data: Omit<AccessRequest, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; error?: string; errorCode?: string; retryable?: boolean }> {
    try {
      // Pre-validation before processing
      const preValidationResult = this.preValidateAccessRequest(data)
      if (!preValidationResult.valid) {
        return {
          success: false,
          error: preValidationResult.error,
          errorCode: 'PRE_VALIDATION_ERROR',
          retryable: false
        }
      }

      // Sanitize and normalize data
      const sanitizedData = this.sanitizeAccessRequestData(data)

      // Convert to the format expected by SignupFormManager
      const formData: AccessRequestData = {
        full_name: sanitizedData.full_name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        department: sanitizedData.department,
        justification: sanitizedData.justification
      }

      // Check for duplicate email before submission
      try {
        const isDuplicate = await this.checkDuplicateEmailWithRetry(formData.email)
        if (isDuplicate) {
          return {
            success: false,
            error: 'Já existe uma solicitação pendente para este email. Verifique seu email ou entre em contato conosco.',
            errorCode: 'DUPLICATE_EMAIL_FOUND',
            retryable: false
          }
        }
      } catch (duplicateError) {
        console.warn('Duplicate check failed, proceeding with submission:', duplicateError)
        // Continue with submission if duplicate check fails
      }

      // Use the enhanced form manager for submission
      const result: FormSubmissionResult = await this.formManager.submitRequest(formData)

      // Enhanced error reporting
      if (!result.success && result.errorCode) {
        this.logSubmissionError(formData.email, result.errorCode, result.error)
      }

      return {
        success: result.success,
        error: result.error,
        errorCode: result.errorCode,
        retryable: result.retryable
      }

    } catch (error) {
      console.error('Unexpected error in submitAccessRequest:', error)

      // Log the error for debugging
      this.logUnexpectedError('submitAccessRequest', error, data.email)

      return {
        success: false,
        error: 'Erro inesperado no sistema. Nossa equipe foi notificada. Tente novamente em alguns minutos.',
        errorCode: 'UNEXPECTED_ERROR',
        retryable: true
      }
    }
  }

  // Pre-validation before database operations
  private preValidateAccessRequest(data: Omit<AccessRequest, 'id' | 'status' | 'created_at'>): { valid: boolean; error?: string } {
    // Check required fields
    if (!data.full_name?.trim()) {
      return { valid: false, error: 'Nome completo é obrigatório' }
    }

    if (!data.email?.trim()) {
      return { valid: false, error: 'Email é obrigatório' }
    }

    if (!data.phone?.trim()) {
      return { valid: false, error: 'Telefone é obrigatório' }
    }

    if (!data.department?.trim()) {
      return { valid: false, error: 'Setor é obrigatório' }
    }

    if (!data.justification?.trim()) {
      return { valid: false, error: 'Justificativa é obrigatória' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      return { valid: false, error: 'Formato de email inválido' }
    }

    // Validate name length
    if (data.full_name.trim().length < 2) {
      return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' }
    }

    // Validate phone format (Brazilian)
    const phoneDigits = data.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return { valid: false, error: 'Telefone deve ter 10 ou 11 dígitos' }
    }

    // Validate department
    const validDepartments = ['vendas', 'locacao', 'marketing', 'admin']
    if (!validDepartments.includes(data.department.toLowerCase())) {
      return { valid: false, error: 'Setor selecionado é inválido' }
    }

    // Validate justification length
    if (data.justification.trim().length < 10) {
      return { valid: false, error: 'Justificativa deve ter pelo menos 10 caracteres' }
    }

    if (data.justification.trim().length > 500) {
      return { valid: false, error: 'Justificativa não pode exceder 500 caracteres' }
    }

    return { valid: true }
  }

  // Sanitize and normalize data
  private sanitizeAccessRequestData(data: Omit<AccessRequest, 'id' | 'status' | 'created_at'>): Omit<AccessRequest, 'id' | 'status' | 'created_at'> {
    return {
      full_name: data.full_name.trim().replace(/\s+/g, ' '),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim().replace(/\D/g, ''),
      department: data.department.trim().toLowerCase(),
      requested_role: data.requested_role?.trim() || 'agent',
      justification: data.justification.trim().replace(/\s+/g, ' ')
    }
  }

  // Enhanced duplicate email checking with retry mechanism
  private async checkDuplicateEmailWithRetry(email: string, maxRetries: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await (supabase as any)
          .from('access_requests')
          .select('id, status, created_at')
          .eq('email', email.toLowerCase().trim())
          .in('status', ['pending', 'approved'])

        if (error) {
          console.error(`Duplicate check attempt ${attempt} failed:`, error)

          // If it's the last attempt, throw the error
          if (attempt === maxRetries) {
            throw error
          }

          // Wait before retry
          await this.sleep(1000 * attempt)
          continue
        }

        // Check if there are any pending or approved requests
        if (data && data.length > 0) {
          const pendingRequest = data.find((req: any) => req.status === 'pending')
          const approvedRequest = data.find((req: any) => req.status === 'approved')

          if (pendingRequest) {
            console.log(`Duplicate pending request found for ${email}`)
            return true
          }

          if (approvedRequest) {
            console.log(`Approved request already exists for ${email}`)
            return true
          }
        }

        return false

      } catch (error) {
        console.error(`Duplicate check attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          throw error
        }

        // Wait before retry with exponential backoff
        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return false
  }

  // Enhanced error logging
  private logSubmissionError(email: string, errorCode: string, errorMessage?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      email: email,
      errorCode: errorCode,
      errorMessage: errorMessage,
      context: 'access_request_submission'
    }

    console.error('Access request submission error:', logData)

    // In production, you might want to send this to a logging service
    // Example: LoggingService.logError('ACCESS_REQUEST_ERROR', logData)
  }

  // Log unexpected errors with context
  private logUnexpectedError(operation: string, error: any, email?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      operation: operation,
      email: email,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      context: 'simple_auth_manager'
    }

    console.error('Unexpected error in SimpleAuthManager:', logData)

    // In production, you might want to send this to a logging service
    // Example: LoggingService.logError('UNEXPECTED_ERROR', logData)
  }

  // Get detailed access request information with error handling
  async getAccessRequestById(requestId: string): Promise<{ success: boolean; data?: AccessRequest; error?: string; errorCode?: string }> {
    // Validate input
    if (!requestId?.trim()) {
      return {
        success: false,
        error: 'ID da solicitação é obrigatório',
        errorCode: 'INVALID_REQUEST_ID'
      }
    }

    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await (supabase as any)
          .from('access_requests')
          .select('*')
          .eq('id', requestId.trim())
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            return {
              success: false,
              error: 'Solicitação não encontrada',
              errorCode: 'REQUEST_NOT_FOUND'
            }
          }

          console.error(`Get access request attempt ${attempt} failed:`, error)

          if (attempt === maxRetries) {
            this.logUnexpectedError('getAccessRequestById', error, requestId)
            return {
              success: false,
              error: 'Erro ao buscar solicitação. Tente novamente.',
              errorCode: 'FETCH_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        return { success: true, data }

      } catch (error) {
        console.error(`Get access request attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('getAccessRequestById', error, requestId)
          return {
            success: false,
            error: 'Erro interno do sistema. Tente novamente.',
            errorCode: 'INTERNAL_ERROR'
          }
        }

        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return {
      success: false,
      error: 'Erro interno do sistema após múltiplas tentativas.',
      errorCode: 'MAX_RETRIES_EXCEEDED'
    }
  }

  // Get access requests by email with error handling
  async getAccessRequestsByEmail(email: string): Promise<{ success: boolean; data?: AccessRequest[]; error?: string; errorCode?: string }> {
    // Validate input
    if (!email?.trim()) {
      return {
        success: false,
        error: 'Email é obrigatório',
        errorCode: 'INVALID_EMAIL'
      }
    }

    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await (supabase as any)
          .from('access_requests')
          .select('*')
          .eq('email', email.toLowerCase().trim())
          .order('created_at', { ascending: false })

        if (error) {
          console.error(`Get access requests by email attempt ${attempt} failed:`, error)

          if (attempt === maxRetries) {
            this.logUnexpectedError('getAccessRequestsByEmail', error, email)
            return {
              success: false,
              error: 'Erro ao buscar solicitações. Tente novamente.',
              errorCode: 'FETCH_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        return { success: true, data: data || [] }

      } catch (error) {
        console.error(`Get access requests by email attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('getAccessRequestsByEmail', error, email)
          return {
            success: false,
            error: 'Erro interno do sistema. Tente novamente.',
            errorCode: 'INTERNAL_ERROR'
          }
        }

        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return {
      success: false,
      error: 'Erro interno do sistema após múltiplas tentativas.',
      errorCode: 'MAX_RETRIES_EXCEEDED'
    }
  }

  // Sleep utility for retry delays
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Buscar solicitações pendentes com error handling robusto
  async getPendingRequests(): Promise<AccessRequest[]> {
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await (supabase as any)
          .from('access_requests')
          .select('*')
          .in('status', ['pending'])
          .order('created_at', { ascending: false })

        if (error) {
          console.error(`Get pending requests attempt ${attempt} failed:`, error)

          // If it's the last attempt, return empty array
          if (attempt === maxRetries) {
            this.logUnexpectedError('getPendingRequests', error)
            return []
          }

          // Wait before retry
          await this.sleep(1000 * attempt)
          continue
        }

        return data || []

      } catch (error) {
        console.error(`Get pending requests attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('getPendingRequests', error)
          return []
        }

        // Wait before retry with exponential backoff
        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return []
  }

  // Aprovar solicitação com validação e error handling robusto
  async approveRequest(requestId: string, reviewerId: string, notes?: string): Promise<{ success: boolean; error?: string; errorCode?: string }> {
    // Validate input parameters
    if (!requestId?.trim()) {
      return {
        success: false,
        error: 'ID da solicitação é obrigatório',
        errorCode: 'INVALID_REQUEST_ID'
      }
    }

    if (!reviewerId?.trim()) {
      return {
        success: false,
        error: 'ID do revisor é obrigatório',
        errorCode: 'INVALID_REVIEWER_ID'
      }
    }

    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // First, check if the request exists and is in pending status
        const { data: existingRequest, error: fetchError } = await (supabase as any)
          .from('access_requests')
          .select('id, status, email')
          .eq('id', requestId)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            return {
              success: false,
              error: 'Solicitação não encontrada',
              errorCode: 'REQUEST_NOT_FOUND'
            }
          }

          console.error(`Approve request fetch attempt ${attempt} failed:`, fetchError)

          if (attempt === maxRetries) {
            this.logUnexpectedError('approveRequest_fetch', fetchError, requestId)
            return {
              success: false,
              error: 'Erro ao verificar solicitação. Tente novamente.',
              errorCode: 'FETCH_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        if (existingRequest.status !== 'pending') {
          return {
            success: false,
            error: `Solicitação já foi ${existingRequest.status === 'approved' ? 'aprovada' : 'rejeitada'}`,
            errorCode: 'REQUEST_ALREADY_PROCESSED'
          }
        }

        // Update the request status
        const { error: updateError } = await (supabase as any)
          .from('access_requests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewerId.trim(),
            reviewer_notes: notes?.trim() || null
          })
          .eq('id', requestId)

        if (updateError) {
          console.error(`Approve request update attempt ${attempt} failed:`, updateError)

          if (attempt === maxRetries) {
            this.logUnexpectedError('approveRequest_update', updateError, existingRequest.email)
            return {
              success: false,
              error: 'Erro ao aprovar solicitação. Tente novamente.',
              errorCode: 'UPDATE_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        console.log(`Request ${requestId} approved by ${reviewerId}`)
        return { success: true }

      } catch (error) {
        console.error(`Approve request attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('approveRequest', error, requestId)
          return {
            success: false,
            error: 'Erro interno do sistema. Tente novamente.',
            errorCode: 'INTERNAL_ERROR'
          }
        }

        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return {
      success: false,
      error: 'Erro interno do sistema após múltiplas tentativas.',
      errorCode: 'MAX_RETRIES_EXCEEDED'
    }
  }

  // Rejeitar solicitação com validação e error handling robusto
  async rejectRequest(requestId: string, reviewerId: string, notes?: string): Promise<{ success: boolean; error?: string; errorCode?: string }> {
    // Validate input parameters
    if (!requestId?.trim()) {
      return {
        success: false,
        error: 'ID da solicitação é obrigatório',
        errorCode: 'INVALID_REQUEST_ID'
      }
    }

    if (!reviewerId?.trim()) {
      return {
        success: false,
        error: 'ID do revisor é obrigatório',
        errorCode: 'INVALID_REVIEWER_ID'
      }
    }

    if (!notes?.trim()) {
      return {
        success: false,
        error: 'Motivo da rejeição é obrigatório',
        errorCode: 'REJECTION_REASON_REQUIRED'
      }
    }

    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // First, check if the request exists and is in pending status
        const { data: existingRequest, error: fetchError } = await (supabase as any)
          .from('access_requests')
          .select('id, status, email')
          .eq('id', requestId)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            return {
              success: false,
              error: 'Solicitação não encontrada',
              errorCode: 'REQUEST_NOT_FOUND'
            }
          }

          console.error(`Reject request fetch attempt ${attempt} failed:`, fetchError)

          if (attempt === maxRetries) {
            this.logUnexpectedError('rejectRequest_fetch', fetchError, requestId)
            return {
              success: false,
              error: 'Erro ao verificar solicitação. Tente novamente.',
              errorCode: 'FETCH_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        if (existingRequest.status !== 'pending') {
          return {
            success: false,
            error: `Solicitação já foi ${existingRequest.status === 'approved' ? 'aprovada' : 'rejeitada'}`,
            errorCode: 'REQUEST_ALREADY_PROCESSED'
          }
        }

        // Update the request status
        const { error: updateError } = await (supabase as any)
          .from('access_requests')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewerId.trim(),
            reviewer_notes: notes.trim()
          })
          .eq('id', requestId)

        if (updateError) {
          console.error(`Reject request update attempt ${attempt} failed:`, updateError)

          if (attempt === maxRetries) {
            this.logUnexpectedError('rejectRequest_update', updateError, existingRequest.email)
            return {
              success: false,
              error: 'Erro ao rejeitar solicitação. Tente novamente.',
              errorCode: 'UPDATE_ERROR'
            }
          }

          await this.sleep(1000 * attempt)
          continue
        }

        console.log(`Request ${requestId} rejected by ${reviewerId}`)
        return { success: true }

      } catch (error) {
        console.error(`Reject request attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('rejectRequest', error, requestId)
          return {
            success: false,
            error: 'Erro interno do sistema. Tente novamente.',
            errorCode: 'INTERNAL_ERROR'
          }
        }

        await this.sleep(1000 * Math.pow(2, attempt - 1))
      }
    }

    return {
      success: false,
      error: 'Erro interno do sistema após múltiplas tentativas.',
      errorCode: 'MAX_RETRIES_EXCEEDED'
    }
  }

  // Registrar tentativa de login com error handling robusto
  async recordLoginAttempt(email: string, success: boolean, ipAddress: string = '127.0.0.1'): Promise<{ success: boolean; error?: string }> {
    // Validate input parameters
    if (!email?.trim()) {
      console.error('Email is required for login attempt recording')
      return { success: false, error: 'Email é obrigatório' }
    }

    const maxRetries = 2 // Fewer retries for logging operations

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { error } = await (supabase as any)
          .from('login_attempts')
          .insert([{
            email: email.toLowerCase().trim(),
            success,
            ip_address: ipAddress || '127.0.0.1',
            attempted_at: new Date().toISOString()
          }])

        if (error) {
          console.error(`Record login attempt ${attempt} failed:`, error)

          if (attempt === maxRetries) {
            this.logUnexpectedError('recordLoginAttempt', error, email)
            return { success: false, error: 'Erro ao registrar tentativa de login' }
          }

          await this.sleep(500 * attempt)
          continue
        }

        return { success: true }

      } catch (error) {
        console.error(`Record login attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('recordLoginAttempt', error, email)
          return { success: false, error: 'Erro interno ao registrar tentativa' }
        }

        await this.sleep(500 * attempt)
      }
    }

    return { success: false, error: 'Falha após múltiplas tentativas' }
  }

  // Verificar se conta está bloqueada com error handling robusto
  async isAccountLocked(email: string): Promise<{ locked: boolean; error?: string; remainingAttempts?: number }> {
    // Validate input
    if (!email?.trim()) {
      return { locked: false, error: 'Email é obrigatório' }
    }

    const maxRetries = 3
    const lockoutThreshold = 5
    const lockoutWindowMinutes = 15

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const lockoutWindowStart = new Date(Date.now() - lockoutWindowMinutes * 60 * 1000).toISOString()

        const { data, error } = await (supabase as any)
          .from('login_attempts')
          .select('id, attempted_at, success')
          .eq('email', email.toLowerCase().trim())
          .eq('success', false)
          .gte('attempted_at', lockoutWindowStart)
          .order('attempted_at', { ascending: false })

        if (error) {
          console.error(`Account lock check attempt ${attempt} failed:`, error)

          if (attempt === maxRetries) {
            this.logUnexpectedError('isAccountLocked', error, email)
            // Return false (not locked) on error to avoid blocking legitimate users
            return { locked: false, error: 'Erro ao verificar status da conta' }
          }

          await this.sleep(500 * attempt)
          continue
        }

        const failedAttempts = data?.length || 0
        const isLocked = failedAttempts >= lockoutThreshold
        const remainingAttempts = Math.max(0, lockoutThreshold - failedAttempts)

        if (isLocked) {
          console.log(`Account ${email} is locked due to ${failedAttempts} failed attempts`)
        }

        return {
          locked: isLocked,
          remainingAttempts: isLocked ? 0 : remainingAttempts
        }

      } catch (error) {
        console.error(`Account lock check attempt ${attempt} error:`, error)

        if (attempt === maxRetries) {
          this.logUnexpectedError('isAccountLocked', error, email)
          // Return false (not locked) on error to avoid blocking legitimate users
          return { locked: false, error: 'Erro interno ao verificar conta' }
        }

        await this.sleep(500 * Math.pow(2, attempt - 1))
      }
    }

    return { locked: false, error: 'Falha após múltiplas tentativas' }
  }

  // Gerar senha temporária
  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }
}