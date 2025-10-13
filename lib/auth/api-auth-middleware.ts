/**
 * 🔐 API Auth Middleware
 * Middleware para proteger rotas de API com autenticação Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware de autenticação para API Routes
 * Verifica se o usuário está autenticado via Supabase
 * 
 * @param request - NextRequest object
 * @returns NextResponse com erro 401 se não autenticado, null se OK
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAuth(request)
 *   if (authError) return authError
 *   
 *   // Usuário autenticado, continuar...
 * }
 * ```
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Extrair cookies do request
    const cookies = request.cookies
    
    // Criar cliente Supabase com cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies.getAll()
          },
          setAll() {
            // No-op para leitura
          },
        },
      }
    )

    // Verificar sessão
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Authentication required',
          details: error?.message 
        },
        { status: 401 }
      )
    }

    // Sessão válida
    return null
    
  } catch (error) {
    console.error('[requireAuth] Error:', error)
    return NextResponse.json(
      { 
        error: 'Authentication error',
        message: 'Failed to verify authentication'
      },
      { status: 500 }
    )
  }
}

/**
 * Verifica se o usuário tem role de admin
 * 
 * @param request - NextRequest object
 * @returns NextResponse com erro 403 se não for admin, null se OK
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  // Primeiro verifica autenticação
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const cookies = request.cookies
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Verificar role no app_metadata
    const role = user.app_metadata?.role || user.user_metadata?.role || 'user'
    
    if (role !== 'admin' && role !== 'studio') {
      return NextResponse.json(
        { 
          error: 'Forbidden',
          message: 'Admin access required'
        },
        { status: 403 }
      )
    }

    return null

  } catch (error) {
    console.error('[requireAdmin] Error:', error)
    return NextResponse.json(
      { error: 'Authorization check failed' },
      { status: 500 }
    )
  }
}
