// middleware.ts - VERSÃO SIMPLIFICADA PARA DESENVOLVIMENTO
// O arquivo original está em middleware.ts.bak
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Versão simplificada sem imports complexos que podem causar problemas
// em development mode
export const runtime = "nodejs" // Alterado para nodejs para evitar problemas com o runtime experimental

// Definições simplificadas
const STUDIO_PREFIX = "/studio"

// Cache control básico (simplificado para debug)
const CACHE_SETTINGS = {
  "/": "public, s-maxage=60",
  "/_next/": "public, max-age=31536000"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next();

  // Configuração básica de cache
  for (const [path, cache] of Object.entries(CACHE_SETTINGS)) {
    if (pathname.startsWith(path)) {
      response.headers.set("Cache-Control", cache);
      break;
    }
  }

  // Apenas proteção básica do /studio
  if (pathname.startsWith(STUDIO_PREFIX) &&
    !pathname.startsWith(`${STUDIO_PREFIX}/_next`) &&
    !pathname.startsWith(`${STUDIO_PREFIX}/static`)) {
    // Em modo de desenvolvimento, simplificamos o fluxo de autenticação
    // para facilitar o debug e evitar problemas de build
    return NextResponse.rewrite(new URL("/acesso-negado", request.url))
  }

  return response
}

// Matcher simplificado
export const config = {
  matcher: ["/studio/:path*"],
}
