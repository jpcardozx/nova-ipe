/**
 * 🔐 OAuth Callback Route Handler
 * 
 * Handles OAuth authentication callback from providers (Google, GitHub, etc.)
 * CRITICAL: Must call exchangeCodeForSession to persist server-side cookies
 * 
 * Without this, client "thinks" it's logged in but server disagrees
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Get cookie options based on environment
 */
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'
  
  const domain = isProd && !isVercel 
    ? '.imobiliariaipe.com.br' 
    : undefined
  
  return {
    domain,
    secure: isProd,
    path: '/',
    sameSite: 'lax' as const,
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const cookieOpts = getCookieOptions()

    // Create Supabase client with proper cookie configuration
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, {
                  ...options,
                  ...cookieOpts,
                })
              })
            } catch (error) {
              // Error setting cookies
              console.error('[OAuth Callback] Error setting cookies:', error)
            }
          },
        },
      }
    )

    // ✅ CRITICAL: Exchange code for session
    // This persists the session on the server-side
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[OAuth Callback] Error exchanging code:', error)
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
    }

    if (data?.session) {
      console.log('[OAuth Callback] Session established:', {
        user: data.session.user.email,
        expiresAt: data.session.expires_at,
      })
    }
  }

  // Redirect to the requested page or dashboard
  return NextResponse.redirect(new URL(next, request.url))
}
