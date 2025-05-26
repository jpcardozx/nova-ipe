// middleware.ts - VERSÃO SIMPLIFICADA PARA DESENVOLVIMENTO
// O arquivo original está em middleware.ts.bak
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Versão simplificada sem imports complexos que podem causar problemas
// em development mode
export const runtime = "nodejs" // Alterado para nodejs para evitar problemas com o runtime experimental

// Definições simplificadas
const STUDIO_PREFIX = "/studio"

// Cache control e MIME types básicos
const CACHE_SETTINGS = {
  "/": "public, s-maxage=60",
  "/_next/": "public, max-age=31536000, stale-while-revalidate=31536000"
}

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Bloquear requisições problemáticas que causam 404s desnecessários
  const blockedPaths = [
    '/.well-known/appspecific/',
    '/favicon.ico.map',
    '/_next/static/chunks/app/types.js.map'
  ];
  
  if (blockedPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse(null, { status: 204 }); // No Content
  }
  
  const response = NextResponse.next();

  // Garantir MIME types corretos
  const ext = pathname.split('.').pop()?.toLowerCase();
  const mimeKey = ext ? `.${ext}` as keyof typeof MIME_TYPES : null;
  if (mimeKey && MIME_TYPES[mimeKey]) {
    response.headers.set('Content-Type', MIME_TYPES[mimeKey]);
  }

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
