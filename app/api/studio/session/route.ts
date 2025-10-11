// app/api/studio/session/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Check studio session status using Supabase Auth
 */
export async function GET() {
    try {
        console.log('🔍 === VERIFICAÇÃO DE SESSÃO STUDIO (Supabase) ===')

        const supabase = createRouteHandlerClient({ cookies })

        // Verificar sessão do Supabase
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
            console.error('❌ Erro ao verificar sessão:', error.message)
            return NextResponse.json({
                authenticated: false,
                error: 'Erro ao verificar sessão'
            })
        }

        if (!session || !session.user) {
            console.log('❌ Nenhuma sessão Supabase encontrada')
            return NextResponse.json({
                authenticated: false,
                error: 'Nenhuma sessão encontrada'
            })
        }

        console.log('✅ Sessão Supabase válida encontrada:', session.user.email)

        return NextResponse.json({
            authenticated: true,
            user: {
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
                provider: 'supabase_auth'
            }
        })

    } catch (error) {
        console.error('❌ Erro ao verificar sessão do Studio:', error)
        return NextResponse.json({
            authenticated: false,
            error: 'Erro ao verificar sessão'
        })
    }
}

/**
 * Clear studio session (logout) - usa Supabase Auth
 */
export async function DELETE() {
    try {
        console.log('🚪 === LOGOUT STUDIO (Supabase) ===')

        const supabase = createRouteHandlerClient({ cookies })

        // Fazer logout no Supabase
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('❌ Erro ao fazer logout:', error.message)
            return NextResponse.json({
                success: false,
                error: 'Erro ao fazer logout'
            }, { status: 500 })
        }

        console.log('✅ Logout realizado com sucesso')

        return NextResponse.json({
            success: true,
            message: 'Sessão do Studio removida'
        })

    } catch (error) {
        console.error('❌ Erro ao remover sessão do Studio:', error)
        return NextResponse.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 })
    }
}