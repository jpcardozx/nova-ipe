// app/api/auth/check-studio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getAdminSecret } from '@/lib/auth'

const COOKIE_NAME = 'admin-auth'

/**
 * Check if user has valid studio authentication
 */
export async function GET(request: NextRequest) {
    try {
        // Get the authentication cookie
        const authCookie = request.cookies.get(COOKIE_NAME)

        if (!authCookie?.value) {
            return NextResponse.json({ 
                authenticated: false, 
                error: 'No authentication token found' 
            })
        }

        // Get admin secret
        let adminSecret: string
        try {
            adminSecret = getAdminSecret()
        } catch (error) {
            console.error('Admin secret not configured:', error)
            return NextResponse.json({ 
                authenticated: false, 
                error: 'Studio authentication not configured' 
            })
        }

        // Verify the token
        const isValid = await verifyToken(authCookie.value, adminSecret)

        if (!isValid) {
            return NextResponse.json({ 
                authenticated: false, 
                error: 'Invalid authentication token' 
            })
        }

        return NextResponse.json({ 
            authenticated: true,
            message: 'Studio authentication valid'
        })

    } catch (error) {
        console.error('Studio auth check error:', error)
        return NextResponse.json({ 
            authenticated: false, 
            error: 'Authentication verification failed' 
        }, { status: 500 })
    }
}