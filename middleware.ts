/**
 * 🔐 MIDDLEWARE - Supabase SSR Auth Guard
 * Sistema de proteção de rotas maduro e definitivo
 * Next.js 15 + Supabase SSR
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ============================================================================
// CONFIGURAÇÃO DE ROTAS
// ============================================================================

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/sobre',
  '/contato',
  '/catalogo',
  '/imoveis',
]

const PROTECTED_ROUTES = [
  { path: '/dashboard', roles: ['user', 'admin', 'studio'] },
  { path: '/studio', roles: ['user', 'admin', 'studio'] },
]

// ============================================================================
// MIDDLEWARE HANDLER
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next()

  // Skip arquivos estáticos e assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return response
  }

  // Skip rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return response
  }

  // Criar Supabase client para middleware (Edge Runtime)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Verificar se é rota protegida
  const protectedRoute = PROTECTED_ROUTES.find(route =>
    pathname.startsWith(route.path)
  )

  if (!protectedRoute) {
    return response // Não é rota protegida
  }

  // SECURITY: getUser() valida JWT com Supabase Auth server (seguro)
  // NÃO usar getSession() - apenas lê cookies sem validação (inseguro)
  const { data: { user }, error: sessionError } = await supabase.auth.getUser()

  // Exigir autenticação
  if (sessionError || !user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ [Middleware] Sem sessão:', sessionError?.message)
    }

    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // SECURITY: app_metadata só pode ser modificado por admins (service_role)
  // user_metadata pode ser modificado pelo usuário (inseguro)
  const userRole = (user.app_metadata?.role as string) || 'user'
  const hasPermission = protectedRoute.roles.includes(userRole)

  // Debug em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 [Middleware]', {
      path: pathname,
      email: user.email,
      role: userRole,
      required: protectedRoute.roles,
      allowed: hasPermission,
    })
  }

  // Verificar permissão
  if (!hasPermission) {
    console.error('❌ [Middleware] Permissão insuficiente:', {
      userRole,
      required: protectedRoute.roles,
    })

    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('error', 'INSUFFICIENT_PERMISSIONS')
    return NextResponse.redirect(redirectUrl)
  }

  // Adicionar info do usuário nos headers (disponível em Server Components)
  response.headers.set('x-user-id', user.id)
  response.headers.set('x-user-email', user.email || '')
  response.headers.set('x-user-role', userRole)

  return response
}

// ============================================================================
// MATCHER CONFIG
// ============================================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
