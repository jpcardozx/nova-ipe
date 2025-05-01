// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Roda no Node.js Runtime para ter acesso a process.env em tempo de execução
export const runtime = "nodejs"

const AUTH_COOKIE_NAME = "admin-auth"
// Variável obrigatória: lança erro em build se não estiver definida
const AUTH_SECRET = process.env.ADMIN_PASS
if (!AUTH_SECRET) {
  throw new Error(
    "❌ ENV ADMIN_PASS não definida. Defina ADMIN_PASS em suas variáveis de ambiente."
  )
}

const STUDIO_PREFIX = "/studio"

/**
 * Middleware para proteger o painel do Sanity Studio.
 * - Só roda para /studio e subcaminhos
 * - Ignora assets estáticos do próprio Next (/_next, /static)
 * - Reescreve para /acesso-negado em caso de cookie inválido
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Só intervém se for rota do Studio
  if (!pathname.startsWith(STUDIO_PREFIX)) {
    return NextResponse.next()
  }

  // Deixa passar arquivos estáticos do Next.js
  if (
    pathname.startsWith(`${STUDIO_PREFIX}/_next`) ||
    pathname.startsWith(`${STUDIO_PREFIX}/static`)
  ) {
    return NextResponse.next()
  }

  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (cookieValue === AUTH_SECRET) {
    return NextResponse.next()
  }

  // Se não autorizado, reescreve p/ página de acesso negado
  const deniedUrl = new URL("/acesso-negado", request.url)
  return NextResponse.rewrite(deniedUrl)
}

export const config = {
  // Protege /studio e tudo que vier depois
  matcher: ["/studio/:path*"],
}
