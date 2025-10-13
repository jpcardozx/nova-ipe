/**
 * 🎨 STUDIO SESSION API
 * Verifica e gerencia sessão Studio via Supabase SSR
 * Compatível com Next.js 15 + Supabase SSR
 */

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth/supabase-auth'

/**
 * GET /api/studio/session
 * Verifica se há sessão ativa com permissões Studio
 */
export async function GET() {
  try {
    console.log('🔍 === VERIFICAÇÃO DE SESSÃO STUDIO (Supabase SSR) ===')
    console.log('🔍 Timestamp:', new Date().toISOString())

    // Obter sessão via Supabase SSR
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('❌ Nenhuma sessão ativa:', error?.message)
      return NextResponse.json({
        authenticated: false,
        error: 'Sessão não encontrada',
      })
    }

    // Verificar role (app_metadata tem prioridade sobre user_metadata)
    const userRole = (user.app_metadata?.role || user.user_metadata?.role || 'user') as string
    
    // Verificar permissão Studio
    const hasStudioAccess = ['user', 'admin', 'studio'].includes(userRole)

    if (!hasStudioAccess) {
      console.log('❌ Sem permissões Studio:', userRole)
      return NextResponse.json({
        authenticated: false,
        error: 'Permissões insuficientes',
        hint: 'Esta área requer acesso Studio',
      })
    }

    console.log('✅ Sessão Studio ativa:', user.email)
    console.log('✅ Role:', userRole)
    console.log('✅ User ID:', user.id)

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: user.id,
        email: user.email,
        role: userRole,
        name: user.email?.split('@')[0] || 'User',
      },
    })
  } catch (error) {
    console.error('❌ [Studio Session] Error:', error)
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Erro ao verificar sessão',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/studio/session
 * Logout (remove sessão Supabase)
 */
export async function DELETE() {
  try {
    console.log('🚪 === LOGOUT STUDIO (Supabase SSR) ===')

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('❌ Erro ao fazer logout:', error.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao remover sessão',
        },
        { status: 500 }
      )
    }

    console.log('✅ Logout realizado com sucesso')

    return NextResponse.json({
      success: true,
      message: 'Sessão do Studio removida',
    })
  } catch (error) {
    console.error('❌ [Studio Logout] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}