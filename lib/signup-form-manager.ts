/**
 * Signup Form Manager
 * 
 * Handles form submissions with comprehensive error handling, validation,
 * and retry mechanisms for the access request signup form.
 */

import { supabase } from '@/lib/supabase'
import { SupabaseFallbackHandler } from './supabase-fallback'

export interface AccessRequestData {
    full_name: string
    email: string
    phone: string
    department: string
    justification: string
}

export interface FormSubmissionResult {
    success: boolean
    error?: string
    errorCode?: string
    retryable?: boolean
}

export interface FormValidationResult {
    valid: boolean
    errors: Record<string, string>
}

export interface RetryConfig {
    maxAttempts: number
    baseDelay: number
    maxDelay: number
}

/**
 * Signup Form Manager Class
 * Provides robust form submission with error handling and retry mechanisms
 */
export class SignupFormManager {
    private retryConfig: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 1000, // 1 second
        maxDelay: 5000   // 5 seconds
    }

    /**
     * Validates form data before submission
     * @param data Form data to validate
     * @returns Validation result with errors
     */
    validateData(data: AccessRequestData): FormValidationResult {
        const errors: Record<string, string> = {}

        // Name validation
        if (!data.full_name || data.full_name.trim().length < 2) {
            errors.full_name = 'Nome deve ter pelo menos 2 caracteres'
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!data.email || !emailRegex.test(data.email)) {
            errors.email = 'Email inválido'
        }

        // Phone validation (Brazilian format)
        const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/
        if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.phone = 'Telefone deve ter pelo menos 10 dígitos'
        }

        // Department validation
        const validDepartments = ['vendas', 'locacao', 'marketing', 'admin']
        if (!data.department || !validDepartments.includes(data.department)) {
            errors.department = 'Selecione um setor válido'
        }

        // Justification validation
        if (!data.justification || data.justification.trim().length < 10) {
            errors.justification = 'Justificativa deve ter pelo menos 10 caracteres'
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        }
    }

    /**
     * Checks if an email already has a pending request
     * @param email Email to check
     * @returns True if duplicate exists
     */
    async checkDuplicateEmail(email: string): Promise<boolean> {
        try {
            const { data, error } = await (supabase as any)
                .from('access_requests')
                .select('id')
                .eq('email', email.toLowerCase().trim())
                .eq('status', 'pending')
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error checking duplicate email:', error)
                return false // Assume no duplicate on error to allow submission
            }

            return !!data
        } catch (error) {
            console.error('Error in duplicate check:', error)
            return false // Assume no duplicate on error
        }
    }

    /**
     * Submits access request with retry mechanism
     * @param data Form data to submit
     * @returns Submission result
     */
    async submitRequest(data: AccessRequestData): Promise<FormSubmissionResult> {
        // Validate data first
        const validation = this.validateData(data)
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0]
            return {
                success: false,
                error: firstError,
                errorCode: 'VALIDATION_ERROR',
                retryable: false
            }
        }

        // Check for duplicate email
        try {
            const isDuplicate = await this.checkDuplicateEmail(data.email)
            if (isDuplicate) {
                return {
                    success: false,
                    error: 'Já existe uma solicitação pendente para este email.',
                    errorCode: 'DUPLICATE_EMAIL',
                    retryable: false
                }
            }
        } catch (error) {
            console.error('Error checking duplicate:', error)
            // Continue with submission if duplicate check fails
        }

        // Attempt submission with retry
        return this.submitWithRetry(data)
    }

    /**
     * Submits request with retry mechanism
     * @param data Form data to submit
     * @returns Submission result
     */
    private async submitWithRetry(data: AccessRequestData): Promise<FormSubmissionResult> {
        let lastError: any = null

        for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
            try {
                const result = await this.attemptSubmission(data)

                if (result.success) {
                    return result
                }

                lastError = result.error

                // Don't retry on non-retryable errors
                if (!result.retryable) {
                    return result
                }

                // Wait before retry (exponential backoff)
                if (attempt < this.retryConfig.maxAttempts) {
                    const delay = Math.min(
                        this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
                        this.retryConfig.maxDelay
                    )
                    await this.sleep(delay)
                }

            } catch (error) {
                lastError = error
                console.error(`Submission attempt ${attempt} failed:`, error)

                // Wait before retry
                if (attempt < this.retryConfig.maxAttempts) {
                    const delay = Math.min(
                        this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
                        this.retryConfig.maxDelay
                    )
                    await this.sleep(delay)
                }
            }
        }

        // All attempts failed
        return {
            success: false,
            error: this.getErrorMessage(lastError),
            errorCode: 'SUBMISSION_FAILED',
            retryable: true
        }
    }

    /**
     * Attempts a single submission to Supabase
     * @param data Form data to submit
     * @returns Submission result
     */
    private async attemptSubmission(data: AccessRequestData): Promise<FormSubmissionResult> {
        try {
            // Check if Supabase is available
            if (!SupabaseFallbackHandler.isSupabaseAvailable()) {
                console.warn('Supabase not available, using fallback storage')
                return await SupabaseFallbackHandler.storeRequestLocally(data)
            }

            // Prepare data for insertion
            const requestData = {
                full_name: data.full_name.trim(),
                email: data.email.toLowerCase().trim(),
                phone: data.phone.trim(),
                department: data.department,
                requested_role: 'agent', // Default role
                justification: data.justification.trim(),
                status: 'pending' as const
            }

            // Submit to Supabase
            const { error } = await (supabase as any)
                .from('access_requests')
                .insert([requestData])

            if (error) {
                console.error('Supabase error:', error)

                // Handle specific Supabase errors
                if (error.code === '23505') { // Unique constraint violation
                    return {
                        success: false,
                        error: 'Já existe uma solicitação para este email.',
                        errorCode: 'DUPLICATE_EMAIL',
                        retryable: false
                    }
                }

                if (error.code === '42P01') { // Table doesn't exist
                    // Try fallback storage
                    console.warn('Table not found, using fallback storage')
                    return await SupabaseFallbackHandler.storeRequestLocally(data)
                }

                if (error.message?.includes('JWT') || error.message?.includes('auth')) {
                    // Try fallback storage for auth errors
                    console.warn('Authentication error, using fallback storage')
                    return await SupabaseFallbackHandler.storeRequestLocally(data)
                }

                // For other database errors, try fallback
                console.warn('Database error, using fallback storage:', error)
                return await SupabaseFallbackHandler.storeRequestLocally(data)
            }

            return { success: true }

        } catch (error: any) {
            console.error('Submission error:', error)

            // Handle network errors with fallback
            if (error.name === 'TypeError' && error.message?.includes('fetch')) {
                console.warn('Network error, using fallback storage')
                return await SupabaseFallbackHandler.storeRequestLocally(data)
            }

            // Handle timeout errors with fallback
            if (error.name === 'AbortError' || error.message?.includes('timeout')) {
                console.warn('Timeout error, using fallback storage')
                return await SupabaseFallbackHandler.storeRequestLocally(data)
            }

            // For any other error, try fallback
            console.warn('Unknown error, using fallback storage:', error)
            return await SupabaseFallbackHandler.storeRequestLocally(data)
        }
    }

    /**
     * Gets user-friendly error message from error object
     * @param error Error object
     * @returns User-friendly error message
     */
    private getErrorMessage(error: any): string {
        if (typeof error === 'string') {
            return error
        }

        if (error?.message) {
            // Handle common error patterns
            if (error.message.includes('fetch')) {
                return 'Erro de conexão. Verifique sua internet e tente novamente.'
            }

            if (error.message.includes('timeout')) {
                return 'Tempo limite excedido. Tente novamente.'
            }

            if (error.message.includes('JWT') || error.message.includes('auth')) {
                return 'Erro de autenticação. Tente novamente.'
            }
        }

        return 'Erro inesperado. Tente novamente em alguns instantes.'
    }

    /**
     * Sleep utility for retry delays
     * @param ms Milliseconds to sleep
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Formats phone number to Brazilian standard
     * @param phone Raw phone input
     * @returns Formatted phone number
     */
    static formatPhone(phone: string): string {
        const digits = phone.replace(/\D/g, '')

        if (digits.length === 11) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
        }

        if (digits.length === 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
        }

        return phone
    }

    /**
     * Validates email format
     * @param email Email to validate
     * @returns True if valid email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Sanitizes text input
     * @param text Text to sanitize
     * @returns Sanitized text
     */
    static sanitizeText(text: string): string {
        return text.trim().replace(/\s+/g, ' ')
    }
}