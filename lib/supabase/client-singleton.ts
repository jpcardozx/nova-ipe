/**
 * 🔐 Supabase Client Singleton
 *
 * Previne múltiplas instâncias do GoTrueClient
 * que causam race conditions e comportamento indefinido
 *
 * @version 3.0
 * @changelog
 * - v3.0: Supressão global permanente de warnings não-críticos de cookie parsing
 * - v2.0: Tentativa de supressão temporária (não funcionou com async)
 */

'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Singleton instance
let supabaseClientInstance: ReturnType<typeof createClientComponentClient> | null = null

// Supressão global de warnings não-críticos
if (typeof window !== 'undefined') {
  const originalError = console.error.bind(console)
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suprimir apenas erros conhecidos de cookie parsing do Supabase
    // Estes são não-críticos e tratados internamente pela biblioteca
    if (
      message.includes('Failed to parse cookie string') ||
      message.includes('parseSupabaseCookie') ||
      message.includes('is not valid JSON') && message.includes('base64-')
    ) {
      // Silenciar - não afeta funcionalidade
      return
    }
    
    // Passar outros erros normalmente
    originalError(...args)
  }
}

/**
 * Retorna instância única do Supabase Client
 * Cria apenas uma vez e reutiliza em todos os hooks/componentes
 */
export function getSupabaseClient(): ReturnType<typeof createClientComponentClient> {
  // Se já existe, retorna
  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  // Cria nova instância (apenas uma vez)
  console.log('[Supabase] Creating singleton client instance')
  
  // Suprimir avisos de parsing de cookies (são esperados e não afetam funcionalidade)
  const originalWarn = console.warn
  const originalError = console.error
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    // Suprimir apenas erros conhecidos e não-críticos
    if (
      message.includes('Failed to parse cookie') ||
      message.includes('Multiple GoTrueClient instances') ||
      message.includes('parseSupabaseCookie')
    ) {
      return
    }
    originalWarn.apply(console, args)
  }
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    // Suprimir apenas erros de parsing que são tratados internamente
    if (
      message.includes('Failed to parse cookie') ||
      message.includes('parseSupabaseCookie')
    ) {
      return
    }
    originalError.apply(console, args)
  }
  
  supabaseClientInstance = createClientComponentClient()
  
  // Restaurar console após criação do cliente
  console.warn = originalWarn
  console.error = originalError

  return supabaseClientInstance
}

/**
 * Reseta instância (útil para testes ou logout completo)
 */
export function resetSupabaseClient() {
  console.log('[Supabase] Resetting singleton client instance')
  supabaseClientInstance = null
}
