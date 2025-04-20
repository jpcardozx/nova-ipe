import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const STUDIO_PATH = "/studio"
const AUTH_COOKIE_NAME = "admin-auth"
const AUTH_COOKIE_VALUE = process.env.ADMIN_PASS || "suasenha123"

// Protege rotas específicas
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Aplica apenas para o /studio e seus subcaminhos
  if (pathname.startsWith(STUDIO_PATH)) {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME)

    // Se o cookie for válido, libera acesso
    if (cookie?.value === AUTH_COOKIE_VALUE) {
      return NextResponse.next()
    }

    // Senão, redireciona para tela institucional de bloqueio
    const accessDeniedUrl = new URL("/acesso-negado", request.url)
    return NextResponse.redirect(accessDeniedUrl)
  }

  // Para todas as outras rotas, segue o fluxo normal
  return NextResponse.next()
}

// Aplica o middleware apenas no /studio
export const config = {
  matcher: ["/studio/:path*"],
}
