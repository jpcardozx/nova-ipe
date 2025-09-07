/**
 * Studio Authentication Middleware
 * 
 * Handles authentication and authorization for Sanity Studio access.
 * Ensures proper session validation and error handling.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getAdminSecret } from '@/lib/auth'

export interface StudioAuthResult {
    authenticated: boolean
    error?: string
    errorCode?: string
}

/**
 * Studio Authentication Middleware
 */
export class StudioAuthMiddleware {
    private static readonly COOKIE_NAME = 'admin-auth'
    private static readonly STUDIO_PATH = '/studio'

    /**
     * Verify studio authentication
     */
    static async verifyStudioAuth(request: NextRequest): Promise<StudioAuthResult> {
        try {
            // Get the authentication cookie
            const authCookie = request.cookies.get(this.COOKIE_NAME)

            if (!authCookie?.value) {
                return {
                    authenticated: false,
                    error: 'No authentication token found',
                    errorCode: 'NO_AUTH_TOKEN'
                }
            }

            // Get admin secret
            let adminSecret: string
            try {
                adminSecret = getAdminSecret()
            } catch (error) {
                console.error('Admin secret not configured:', error)
                return {
                    authenticated: false,
                    error: 'Studio authentication not configured',
                    errorCode: 'CONFIG_ERROR'
                }
            }

            // Verify the token
            const isValid = await verifyToken(authCookie.value, adminSecret)

            if (!isValid) {
                return {
                    authenticated: false,
                    error: 'Invalid authentication token',
                    errorCode: 'INVALID_TOKEN'
                }
            }

            return { authenticated: true }

        } catch (error) {
            console.error('Studio auth verification error:', error)
            return {
                authenticated: false,
                error: 'Authentication verification failed',
                errorCode: 'VERIFICATION_ERROR'
            }
        }
    }

    /**
     * Handle studio authentication middleware
     */
    static async handleStudioRequest(request: NextRequest): Promise<NextResponse> {
        // Only apply to studio routes
        if (!request.nextUrl.pathname.startsWith(this.STUDIO_PATH)) {
            return NextResponse.next()
        }

        // Verify authentication
        const authResult = await this.verifyStudioAuth(request)

        if (!authResult.authenticated) {
            // Redirect to login with studio mode
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('mode', 'studio')
            loginUrl.searchParams.set('error', authResult.errorCode || 'AUTH_REQUIRED')

            return NextResponse.redirect(loginUrl)
        }

        // Authentication successful, continue to studio
        return NextResponse.next()
    }

    /**
     * Create studio authentication cookie
     */
    static createStudioAuthCookie(token: string): string {
        const maxAge = 60 * 60 * 12 // 12 hours
        const secure = process.env.NODE_ENV === 'production'

        return [
            `${this.COOKIE_NAME}=${token}`,
            `Path=/`,
            `Max-Age=${maxAge}`,
            `HttpOnly`,
            secure ? 'Secure' : '',
            'SameSite=Lax'
        ].filter(Boolean).join('; ')
    }

    /**
     * Clear studio authentication cookie
     */
    static clearStudioAuthCookie(): string {
        const secure = process.env.NODE_ENV === 'production'

        return [
            `${this.COOKIE_NAME}=`,
            `Path=/`,
            `Max-Age=0`,
            `HttpOnly`,
            secure ? 'Secure' : '',
            'SameSite=Lax'
        ].filter(Boolean).join('; ')
    }

    /**
     * Check if request is for studio
     */
    static isStudioRequest(request: NextRequest): boolean {
        return request.nextUrl.pathname.startsWith(this.STUDIO_PATH)
    }

    /**
     * Get authentication status from request
     */
    static async getAuthStatus(request: NextRequest): Promise<StudioAuthResult> {
        return this.verifyStudioAuth(request)
    }
}