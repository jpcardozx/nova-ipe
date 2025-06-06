import { NextRequest, NextResponse } from 'next/server';

function middlewareHandler(request: NextRequest) {
  // Minimal middleware without complex logic to avoid edge runtime conflicts
  const { pathname } = request.nextUrl;
  
  // Handle specific VS Code Simple Browser requests
  if (pathname === '/.well-known/appspecific/com.chrome.devtools.json' ||
      pathname === '/service-worker.js' ||
      pathname === '/manifest.webmanifest') {
    return new NextResponse(null, { status: 204 });
  }
  
  // Continue with normal request processing
  return NextResponse.next();
}

// Export as both middleware and default to ensure Next.js can find it
export const middleware = middlewareHandler;
export default middlewareHandler;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
