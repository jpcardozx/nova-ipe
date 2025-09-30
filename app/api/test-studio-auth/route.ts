// app/api/test-studio-auth/route.ts
import { NextResponse } from 'next/server'
import { getAdminSecret } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        
        console.log('🧪 Teste de autenticação do Studio')
        console.log('Email:', email)
        console.log('Password provided:', !!password)
        
        // Get admin secret
        const adminSecret = getAdminSecret()
        console.log('Admin secret obtained:', !!adminSecret)
        console.log('Passwords match:', password === adminSecret)
        
        if (password === adminSecret) {
            return NextResponse.json({
                success: true,
                message: 'Autenticação bem-sucedida!'
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Credenciais inválidas',
                debug: {
                    providedLength: password?.length || 0,
                    expectedLength: adminSecret?.length || 0
                }
            }, { status: 401 })
        }
        
    } catch (error) {
        console.error('Erro no teste de autenticação:', error)
        return NextResponse.json({
            success: false,
            error: 'Erro interno',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function GET() {
    try {
        const adminSecret = getAdminSecret()
        
        return NextResponse.json({
            success: true,
            hasAdminSecret: !!adminSecret,
            adminSecretLength: adminSecret?.length || 0,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}