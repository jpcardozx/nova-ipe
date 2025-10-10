import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Middleware de autenticação para API routes do dashboard
 * Verifica se o usuário está autenticado via Supabase Auth
 */

interface AuthResult {
  authorized: boolean
  user?: {
    id: string
    email: string
    role?: string
  }
  error?: string
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    // 🚀 DESENVOLVIMENTO: Bypass de autenticação em localhost
    const devMode = request.headers.get('x-dev-mode')
    if (process.env.NODE_ENV === 'development' && devMode === 'true') {
      console.log('🔓 [API Auth] Modo desenvolvimento: acesso liberado')
      return {
        authorized: true,
        user: {
          id: 'dev-user',
          email: 'dev@localhost.com',
          role: 'admin'
        }
      }
    }

    // Extrai o token de autenticação do header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'Missing or invalid authorization header'
      }
    }

    const token = authHeader.replace('Bearer ', '')

    // Valida o token com Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return {
        authorized: false,
        error: 'Invalid or expired token'
      }
    }

    // Busca perfil do usuário (incluindo role)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email!,
        role: profile?.role || 'client'
      }
    }

  } catch (error) {
    console.error('[Auth Middleware] Error:', error)
    return {
      authorized: false,
      error: 'Authentication failed'
    }
  }
}

/**
 * Verifica se o usuário tem permissão para acessar o dashboard
 * Apenas admin e realtor podem acessar
 */
export function hasAdminAccess(role?: string): boolean {
  return role === 'admin' || role === 'realtor'
}

/**
 * Middleware wrapper para facilitar uso nas API routes
 */
export async function requireAuth(
  request: NextRequest,
  requiredRole?: 'admin' | 'realtor'
): Promise<NextResponse | null> {
  const authResult = await authenticateRequest(request)

  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error || 'Unauthorized' },
      { status: 401 }
    )
  }

  // Verifica role se necessário
  if (requiredRole && authResult.user?.role !== requiredRole && authResult.user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    )
  }

  // Se passou na autenticação, retorna null (continua)
  return null
}
