import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const STUDIO_PATH = "@/../studio"
const AUTH_COOKIE_NAME = "admin-auth"
const AUTH_COOKIE_VALUE = process.env.ADMIN_PASS || "suasenha123"

/**
 * Middleware para proteger rotas administrativas (como /studio).
 * Bloqueia acesso não autenticado e redireciona para /acesso-negado.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStudioRoute =
    pathname === STUDIO_PATH || pathname.startsWith(`${STUDIO_PATH}/`)

  if (!isStudioRoute) return NextResponse.next()

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)
  const cookieValue = cookie?.value

  const isAuthorized = cookieValue === AUTH_COOKIE_VALUE

  if (isAuthorized) {
    return NextResponse.next()
  }

  // ❗Se a variável de ambiente estiver incorreta ou ausente
  if (!process.env.ADMIN_PASS) {
    console.warn(
      "[middleware] ADMIN_PASS não definido no ambiente. Usando valor padrão."
    )
  }

  const accessDeniedUrl = new URL("/acesso-negado", request.url)
  return NextResponse.redirect(accessDeniedUrl)
}

/**
 * Define quais rotas o middleware intercepta.
 * Aqui: protege /studio e todos os subcaminhos.
 */
export const config = {
  matcher: ["/studio", "/studio/:path*"],
}
