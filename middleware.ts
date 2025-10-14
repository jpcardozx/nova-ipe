/**
 * 🔐 MIDDLEWARE - Supabase SSR Auth Guard
 * Sistema de proteção de rotas maduro e definitivo
 * Next.js 15 + Supabase SSR
 */

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

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

  // Skip arquivos estáticos e assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Skip rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  // Verificar se é rota protegida
  const protectedRoute = PROTECTED_ROUTES.find(route =>
    pathname.startsWith(route.path)
  )

  if (!protectedRoute) {
    return NextResponse.next() // Não é rota protegida
  }

  // ✅ Usar helper do @supabase/ssr para atualizar sessão
  const { response, user, error: sessionError } = await updateSession(request)

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
  const updatedResponse = NextResponse.next({
    request: {
      headers: new Headers(response.headers),
    },
  })

  // Copiar cookies da response anterior
  response.cookies.getAll().forEach((cookie) => {
    updatedResponse.cookies.set(cookie.name, cookie.value)
  })

  // Adicionar headers personalizados
  updatedResponse.headers.set('x-user-id', user.id)
  updatedResponse.headers.set('x-user-email', user.email || '')
  updatedResponse.headers.set('x-user-role', userRole)

  return updatedResponse
}

// ============================================================================
// MATCHER CONFIG
// ============================================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
