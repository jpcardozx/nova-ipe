import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    
    // Lista de paths problemáticos do VS Code Simple Browser
    const problematicPaths = [
      '/.well-known/appspecific/com.chrome.devtools.json',
      '/service-worker.js',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png',
      '/favicon-32x32.png',
      '/favicon-16x16.png',
      '/manifest.webmanifest'
    ];
    
    // Interceptar requisições problemáticas do VS Code Simple Browser
    if (
      problematicPaths.includes(url.pathname) ||
      url.searchParams.has('vscodeBrowserReqId') ||
      (url.searchParams.has('id') && url.searchParams.has('vscodeBrowserReqId'))
    ) {
      // Retornar resposta vazia para evitar erro
      return new NextResponse(null, { status: 204 });
    }
    
    // Para outras requisições, continuar normalmente
    return NextResponse.next();
  } catch (error) {
    // If middleware fails, continue normally
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Interceptar todas as requisições exceto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
