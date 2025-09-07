/**
 * Enhanced Authentication Manager
 * 
 * Handles authentication for both dashboard and Sanity Studio access modes.
 * Provides comprehensive error handling and proper redirection logic.
 */

import { supabase } from '@/lib/supabase'
import { sanityClient } from '@/lib/sanity/index'
import { logger } from '@/lib/logger'

export type LoginMode = 'dashboard' | 'studio'
export type AuthenticationResult = {
    success: boolean
    error?: string
    errorCode?: string
    redirectUrl?: string
    requiresRedirect?: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthenticationStatus {
    isAuthenticated: boolean
    mode?: LoginMode
    user?: any
    error?: string
}

/**
 * Enhanced Authentication Manager for handling both dashboard and studio access
 */
export class EnhancedAuthManager {
    private static instance: EnhancedAuthManager

    private constructor() { }

    static getInstance(): EnhancedAuthManager {
        if (!EnhancedAuthManager.instance) {
            EnhancedAuthManager.instance = new EnhancedAuthManager()
        }
        return EnhancedAuthManager.instance
    }

    /**
     * Authenticate user based on selected mode
     */
    async authenticate(credentials: LoginCredentials, mode: LoginMode): Promise<AuthenticationResult> {
        const context = {
            component: 'EnhancedAuthManager',
            action: 'authenticate',
            mode,
            email: credentials.email
        };

        logger.auth('Starting authentication process', context);

        try {
            // Validate input
            const validationResult = this.validateCredentials(credentials)
            if (!validationResult.valid) {
                logger.authError('Credential validation failed', context, { error: validationResult.error });
                return {
                    success: false,
                    error: validationResult.error,
                    errorCode: 'VALIDATION_ERROR'
                }
            }

            logger.debug('Credentials validated successfully', context);

            // Check environment configuration
            const configStatus = this.checkConfiguration(mode)
            if (!configStatus.valid) {
                logger.configError('Environment configuration check failed', context, { error: configStatus.error });
                return {
                    success: false,
                    error: configStatus.error,
                    errorCode: 'CONFIGURATION_ERROR'
                }
            }

            logger.debug('Environment configuration validated', context);

            // Handle authentication based on mode
            if (mode === 'studio') {
                logger.auth('Proceeding with studio authentication', context);
                return await this.authenticateForStudio(credentials)
            } else {
                logger.auth('Proceeding with dashboard authentication', context);
                return await this.authenticateForDashboard(credentials)
            }

        } catch (error) {
            logger.authError('Authentication process failed with unexpected error', context, error);
            return {
                success: false,
                error: 'Erro interno de autenticação. Tente novamente.',
                errorCode: 'INTERNAL_ERROR'
            }
        }
    }

    /**
     * Authenticate for Sanity Studio access
     */
    private async authenticateForStudio(credentials: LoginCredentials): Promise<AuthenticationResult> {
        const context = {
            component: 'EnhancedAuthManager',
            action: 'authenticateForStudio',
            email: credentials.email
        };

        logger.auth('Starting studio authentication', context);

        try {
            // For studio access, we need to validate against admin credentials
            const adminPass = process.env.ADMIN_PASS

            if (!adminPass) {
                logger.configError('ADMIN_PASS not configured for studio access', context);
                return {
                    success: false,
                    error: 'Configuração de acesso ao estúdio não encontrada.',
                    errorCode: 'STUDIO_CONFIG_ERROR'
                }
            }

            // For studio access, validate against admin credentials
            // The password should match the admin pass
            if (credentials.password !== adminPass) {
                logger.authError('Invalid studio credentials provided', context);
                return {
                    success: false,
                    error: 'Credenciais inválidas para acesso ao estúdio.',
                    errorCode: 'INVALID_STUDIO_CREDENTIALS'
                }
            }

            logger.debug('Studio credentials validated', context);

            // Validate email format (basic check)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(credentials.email)) {
                logger.authError('Invalid email format for studio access', context);
                return {
                    success: false,
                    error: 'Formato de email inválido.',
                    errorCode: 'INVALID_EMAIL_FORMAT'
                }
            }

            logger.debug('Email format validated for studio access', context);

            // Test Sanity authentication
            logger.debug('Testing Sanity authentication for studio access', context);
            const sanityAuthResult = await this.testSanityAuthentication()
            if (!sanityAuthResult.success) {
                logger.sanityError('Sanity authentication test failed for studio access', context, { error: sanityAuthResult.error });
                return {
                    success: false,
                    error: 'Erro de autenticação com o Sanity Studio. Verifique a configuração.',
                    errorCode: 'SANITY_AUTH_ERROR'
                }
            }

            logger.debug('Sanity authentication test passed', context);

            // Set authentication cookie for studio access
            logger.debug('Setting studio authentication cookie', context);
            await this.setStudioAuthCookie(credentials)

            logger.auth('Studio authentication successful', context);
            return {
                success: true,
                redirectUrl: '/studio',
                requiresRedirect: true
            }

        } catch (error) {
            logger.authError('Studio authentication failed with unexpected error', context, error);
            return {
                success: false,
                error: 'Erro ao autenticar para o estúdio. Tente novamente.',
                errorCode: 'STUDIO_AUTH_ERROR'
            }
        }
    }

    /**
     * Authenticate for dashboard access
     */
    private async authenticateForDashboard(credentials: LoginCredentials): Promise<AuthenticationResult> {
        const context = {
            component: 'EnhancedAuthManager',
            action: 'authenticateForDashboard',
            email: credentials.email
        };

        logger.auth('Starting dashboard authentication', context);

        try {
            // Use Supabase authentication for dashboard access
            logger.debug('Attempting Supabase authentication', context);
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            })

            if (error) {
                logger.authError('Supabase authentication failed', context, error);

                // Handle specific Supabase errors
                if (error.message.includes('Invalid login credentials')) {
                    return {
                        success: false,
                        error: 'Email ou senha incorretos.',
                        errorCode: 'INVALID_CREDENTIALS'
                    }
                }

                if (error.message.includes('Email not confirmed')) {
                    return {
                        success: false,
                        error: 'Email não confirmado. Verifique sua caixa de entrada.',
                        errorCode: 'EMAIL_NOT_CONFIRMED'
                    }
                }

                if (error.message.includes('Too many requests')) {
                    return {
                        success: false,
                        error: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
                        errorCode: 'RATE_LIMITED'
                    }
                }

                return {
                    success: false,
                    error: 'Erro de autenticação. Verifique suas credenciais.',
                    errorCode: 'AUTH_ERROR'
                }
            }

            if (!authData.user) {
                logger.authError('No user data returned from Supabase authentication', context);
                return {
                    success: false,
                    error: 'Falha na autenticação. Tente novamente.',
                    errorCode: 'NO_USER_DATA'
                }
            }

            logger.debug('Supabase authentication successful, checking dashboard access', context, { userId: authData.user.id });

            // Check if user has dashboard access permissions
            const hasAccess = await this.checkDashboardAccess(authData.user.email!)
            if (!hasAccess) {
                logger.authError('User does not have dashboard access permissions', context, { email: authData.user.email });

                // Sign out the user since they don't have access
                await supabase.auth.signOut()

                return {
                    success: false,
                    error: 'Você não tem permissão para acessar o dashboard. Solicite acesso primeiro.',
                    errorCode: 'ACCESS_DENIED'
                }
            }

            logger.auth('Dashboard authentication successful', context, { userId: authData.user.id });
            return {
                success: true,
                redirectUrl: '/dashboard',
                requiresRedirect: true
            }

        } catch (error) {
            logger.authError('Dashboard authentication failed with unexpected error', context, error);
            return {
                success: false,
                error: 'Erro interno de autenticação. Tente novamente.',
                errorCode: 'DASHBOARD_AUTH_ERROR'
            }
        }
    }

    /**
     * Check if user has dashboard access
     */
    private async checkDashboardAccess(email: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('access_requests')
                .select('status')
                .eq('email', email.toLowerCase())
                .eq('status', 'approved')
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking dashboard access:', error)
                return false
            }

            return !!data
        } catch (error) {
            console.error('Error checking dashboard access:', error)
            return false
        }
    }

    /**
     * Test Sanity authentication
     */
    private async testSanityAuthentication(): Promise<{ success: boolean; error?: string }> {
        try {
            // Simple test query to verify Sanity connection
            await sanityClient.fetch('*[_type == "imovel"][0]{ _id }')
            return {
                success: true
            }
        } catch (error) {
            console.error('Sanity authentication test failed:', error)
            return {
                success: false,
                error: 'Falha no teste de autenticação do Sanity'
            }
        }
    }

    /**
     * Set authentication cookie for studio access
     */
    private async setStudioAuthCookie(credentials: LoginCredentials): Promise<void> {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    senha: credentials.password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to set studio auth cookie')
            }
        } catch (error) {
            console.error('Error setting studio auth cookie:', error)
            throw error
        }
    }

    /**
     * Validate login credentials
     */
    private validateCredentials(credentials: LoginCredentials): { valid: boolean; error?: string } {
        if (!credentials.email?.trim()) {
            return { valid: false, error: 'Email é obrigatório' }
        }

        if (!credentials.password?.trim()) {
            return { valid: false, error: 'Senha é obrigatória' }
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(credentials.email)) {
            return { valid: false, error: 'Formato de email inválido' }
        }

        if (credentials.password.length < 6) {
            return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
        }

        return { valid: true }
    }

    /**
     * Check configuration for the selected mode
     */
    private checkConfiguration(mode: LoginMode): { valid: boolean; error?: string } {
        if (mode === 'studio') {
            // Check if Sanity configuration is available
            if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
                return {
                    valid: false,
                    error: 'Configuração do Sanity Studio não encontrada. Verifique as variáveis de ambiente.'
                }
            }

            if (!process.env.ADMIN_PASS) {
                return {
                    valid: false,
                    error: 'Senha de administrador não configurada para acesso ao estúdio.'
                }
            }
        } else {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                return {
                    valid: false,
                    error: 'Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.'
                }
            }
        }

        return { valid: true }
    }

    /**
     * Get current authentication status
     */
    async getAuthenticationStatus(requestedMode?: LoginMode): Promise<AuthenticationStatus> {
        try {
            console.log('🔍 Auth Manager: Verificando status de autenticação, modo solicitado:', requestedMode)
            
            // Check Supabase session for dashboard access
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('❌ Auth Manager: Erro ao obter sessão:', error)
                return { isAuthenticated: false, error: 'Erro ao verificar sessão' }
            }

            if (session?.user) {
                console.log('✅ Auth Manager: Sessão válida encontrada para:', session.user.email)
                
                // If user is authenticated and a specific mode is requested, return that mode
                const mode = requestedMode || 'dashboard'
                console.log('✅ Auth Manager: Retornando modo:', mode)
                
                return {
                    isAuthenticated: true,
                    mode: mode,
                    user: session.user
                }
            }

            console.log('❌ Auth Manager: Nenhuma sessão válida encontrada')

            // Check for studio authentication cookie
            const hasStudioAuth = await this.checkStudioAuthCookie()
            if (hasStudioAuth) {
                console.log('✅ Auth Manager: Cookie de autenticação do studio encontrado')
                return {
                    isAuthenticated: true,
                    mode: 'studio'
                }
            }

            console.log('❌ Auth Manager: Usuário não autenticado')
            return { isAuthenticated: false }

        } catch (error) {
            console.error('❌ Auth Manager: Erro interno na verificação de autenticação:', error)
            return { isAuthenticated: false, error: 'Erro interno' }
        }
    }

    /**
     * Check if studio auth cookie exists
     */
    private async checkStudioAuthCookie(): Promise<boolean> {
        try {
            // This would need to be implemented based on your cookie checking logic
            // For now, we'll return false as a placeholder
            return false
        } catch (error) {
            console.error('Error checking studio auth cookie:', error)
            return false
        }
    }

    /**
     * Sign out user
     */
    async signOut(): Promise<{ success: boolean; error?: string }> {
        try {
            // Sign out from Supabase
            const { error: supabaseError } = await supabase.auth.signOut()
            if (supabaseError) {
                console.error('Supabase sign out error:', supabaseError)
            }

            // Clear studio auth cookie
            try {
                await fetch('/api/logout', { method: 'POST' })
            } catch (error) {
                console.error('Error clearing studio auth cookie:', error)
            }

            return { success: true }

        } catch (error) {
            console.error('Sign out error:', error)
            return {
                success: false,
                error: 'Erro ao fazer logout. Tente novamente.'
            }
        }
    }

    /**
     * Handle authentication redirect
     */
    handleAuthenticationRedirect(result: AuthenticationResult, router: any): void {
        if (result.success && result.requiresRedirect && result.redirectUrl) {
            router.push(result.redirectUrl)
        }
    }
}

// Export singleton instance
export const authManager = EnhancedAuthManager.getInstance()