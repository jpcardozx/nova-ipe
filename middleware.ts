// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSecret, verifyToken } from "@lib/auth"

export const runtime = "experimental-edge"
const AUTH_COOKIE_NAME = "admin-auth"
const STUDIO_PREFIX = "/studio"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Passa arquivos estáticos, API e _next
  if (!pathname.startsWith(STUDIO_PREFIX)) {
    return NextResponse.next()
  }
  if (
    pathname.startsWith(`${STUDIO_PREFIX}/_next`) ||
    pathname.startsWith(`${STUDIO_PREFIX}/static`)
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  // Verifica HMAC via Web Crypto API
  if (token && await verifyToken(token, getAdminSecret())) {
    return NextResponse.next()
  }

  // Redireciona para acesso negado
  return NextResponse.rewrite(new URL("/acesso-negado", request.url))
}

export const config = {
  matcher: ["/studio/:path*"],
}
