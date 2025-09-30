// app/api/studio/session/route.ts
import { NextRequest, NextResponse } from 'next/server'

const STUDIO_COOKIE_NAME = 'studio-session'

/**
 * Create a simple studio session after Zoho authentication
 */
export async function POST(request: NextRequest) {
    try {
        console.log('🎬 === CRIAÇÃO DE SESSÃO STUDIO ===')
        const { user } = await request.json()
        console.log('🎬 Dados recebidos:', JSON.stringify(user, null, 2))
        
        if (!user || !user.email) {
            console.error('❌ Dados do usuário inválidos:', user)
            return NextResponse.json({
                success: false,
                error: 'Dados do usuário inválidos'
            }, { status: 400 })
        }

        console.log('🎬 Criando sessão do Studio para:', user.email)

        // Create simple session data
        const sessionData = {
            email: user.email,
            name: user.name,
            provider: 'zoho_mail360',
            timestamp: new Date().toISOString()
        }

        const response = NextResponse.json({
            success: true,
            message: 'Sessão do Studio criada com sucesso'
        })

        // Set a simple session cookie
        response.cookies.set(STUDIO_COOKIE_NAME, JSON.stringify(sessionData), {
            path: '/',  // Alterar para root path para acessibilidade
            maxAge: 60 * 60 * 8, // 8 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        return response

    } catch (error) {
        console.error('Erro ao criar sessão do Studio:', error)
        return NextResponse.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 })
    }
}

/**
 * Check studio session status
 */
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 === VERIFICAÇÃO DE SESSÃO STUDIO ===')
        const sessionCookie = request.cookies.get(STUDIO_COOKIE_NAME)
        console.log('🔍 Cookie encontrado:', !!sessionCookie?.value)

        if (!sessionCookie?.value) {
            console.log('❌ Nenhuma sessão encontrada')
            return NextResponse.json({
                authenticated: false,
                error: 'Nenhuma sessão encontrada'
            })
        }

        const sessionData = JSON.parse(sessionCookie.value)
        
        // Check if session is still valid (8 hours)
        const sessionTime = new Date(sessionData.timestamp).getTime()
        const now = new Date().getTime()
        const eightHours = 8 * 60 * 60 * 1000

        if (now - sessionTime > eightHours) {
            return NextResponse.json({
                authenticated: false,
                error: 'Sessão expirada'
            })
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                email: sessionData.email,
                name: sessionData.name,
                provider: sessionData.provider
            }
        })

    } catch (error) {
        console.error('Erro ao verificar sessão do Studio:', error)
        return NextResponse.json({
            authenticated: false,
            error: 'Erro ao verificar sessão'
        })
    }
}

/**
 * Clear studio session (logout)
 */
export async function DELETE(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Sessão do Studio removida'
        })

        // Clear the session cookie
        response.cookies.set(STUDIO_COOKIE_NAME, '', {
            path: '/studio',
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        return response

    } catch (error) {
        console.error('Erro ao remover sessão do Studio:', error)
        return NextResponse.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 })
    }
}