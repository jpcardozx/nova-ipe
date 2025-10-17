/**
 * 🔐 Supabase Server Client
 * 
 * Cliente para uso em:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 * 
 * Usa @supabase/ssr (recomendação oficial atual)
 * 
 * @version 1.0
 * @date 2025-10-13
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Get cookie options based on environment
 * In production, use proper domain and secure settings
 */
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'
  
  // Production domain configuration
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

/**
 * Cria Supabase Server Client
 * 
 * IMPORTANTE: Este client NÃO é singleton porque cada request
 * precisa de sua própria instância com seus próprios cookies.
 * 
 * ✅ Usa @supabase/ssr (API atual e mantida)
 * ✅ Cookie handling via Next.js cookies()
 * ✅ Compatível com Next.js 15 (cookies async)
 * ✅ Seguro para Server Components
 * 
 * @example
 * ```tsx
 * // Em um Server Component
 * export default async function MyPage() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *   return <div>Hello {user?.email}</div>
 * }
 * ```
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  const cookieOpts = getCookieOptions()

  // Validar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Merge with our custom cookie options
              cookieStore.set(name, value, {
                ...options,
                ...cookieOpts,
              })
            })
          } catch (error) {
            // Em alguns contextos (como middleware), não é possível setar cookies
            // Isso é esperado e não deve quebrar a aplicação
          }
        },
      },
    }
  )
}

/**
 * Alias para compatibilidade
 */
export const getSupabaseServerClient = createClient
