/**
 * 🔐 Supabase Middleware Helper
 * 
 * Funções helper para refresh de Auth tokens no middleware
 * 
 * Usa @supabase/ssr (recomendação oficial atual)
 * 
 * @version 1.0
 * @date 2025-10-13
 */

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'

/**
 * Get cookie options based on environment
 * In production, use proper domain and secure settings
 */
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'
  
  // Production domain configuration
  // Use .imobiliariaipe.com.br for production, undefined for localhost
  const domain = isProd && !isVercel 
    ? '.imobiliariaipe.com.br' 
    : undefined
  
  return {
    domain,
    secure: isProd, // Only secure in production
    path: '/',
    sameSite: 'lax' as const,
  }
}

export interface UpdateSessionResult {
  response: NextResponse
  supabase: SupabaseClient
  user: User | null
  error: Error | null
}

/**
 * Atualiza sessão do Supabase no middleware
 * 
 * Responsabilidades:
 * 1. Refresh Auth tokens expirados
 * 2. Passar token atualizado para Server Components (request.cookies.set)
 * 3. Passar token atualizado para browser (response.cookies.set)
 * 
 * IMPORTANTE: Sempre use getUser() para validar tokens.
 * Nunca confie em getSession() no servidor - não revalida o token.
 * 
 * @param request - NextRequest do middleware
 * @returns Response com cookies atualizados + user info
 * 
 * @example
 * ```ts
 * // middleware.ts
 * export async function middleware(request: NextRequest) {
 *   const { response, user, error } = await updateSession(request)
 *   
 *   if (error || !user) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 *   
 *   return response
 * }
 * ```
 */
export async function updateSession(
  request: NextRequest
): Promise<UpdateSessionResult> {
  // Criar response que será modificado com cookies
  let response = NextResponse.next({
    request,
  })

  // Validar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      response,
      supabase: null as any,
      user: null,
      error: new Error('Missing Supabase environment variables'),
    }
  }

  // Criar Supabase client para middleware
  const cookieOpts = getCookieOptions()
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualizar cookies na request (para Server Components)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          // Atualizar cookies na response (para browser)
          response = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) => {
            // Merge with our custom cookie options
            response.cookies.set(name, value, {
              ...options,
              ...cookieOpts,
            })
          })
        },
      },
    }
  )

  // CRITICAL: Sempre usar getUser() para validação segura de token
  // getSession() apenas lê cookies sem validação (inseguro no servidor)
  let user: User | null = null
  let error: Error | null = null

  try {
    const { data, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      error = authError
    } else {
      user = data.user
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error')
  }

  return {
    response,
    supabase,
    user,
    error,
  }
}
