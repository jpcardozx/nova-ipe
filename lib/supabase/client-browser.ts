/**
 * 🔐 Supabase Browser Client
 * 
 * Cliente para uso em Client Components (navegador)
 * Usa @supabase/ssr (recomendação oficial atual)
 * 
 * Substitui: @supabase/auth-helpers-nextjs (deprecado)
 * 
 * @version 1.0
 * @date 2025-10-13
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance
let browserClientInstance: SupabaseClient | null = null

/**
 * Cria/retorna instância única do Supabase Browser Client
 * 
 * ✅ Usa @supabase/ssr (API atual e mantida)
 * ✅ Cookie handling automático e correto
 * ✅ Compatível com Next.js 15
 * ✅ Sem erros de parsing de cookies
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  // Se já existe instância, reutilizar
  if (browserClientInstance) {
    return browserClientInstance
  }

  // Validar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
  }

  console.log('[Supabase Browser] Creating singleton client instance')

  // Criar nova instância usando @supabase/ssr
  browserClientInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )

  return browserClientInstance
}

/**
 * Reseta instância (útil para testes ou logout completo)
 */
export function resetBrowserClient(): void {
  console.log('[Supabase Browser] Resetting singleton client instance')
  browserClientInstance = null
}

/**
 * Alias para compatibilidade com código existente
 * @deprecated Use getSupabaseBrowserClient() diretamente
 */
export const getSupabaseClient = getSupabaseBrowserClient
