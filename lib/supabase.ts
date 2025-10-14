/**
 * 🔐 Supabase Client - MANTIDO para compatibilidade
 *
 * ⚠️ NOTA: Este client NÃO usa singleton por limitações de SSR
 *
 * Para hooks de autenticação, use:
 * - import { getSupabaseClient } from '@/lib/supabase/client-singleton'
 *
 * Para outros serviços (que funcionam tanto SSR quanto CSR), use:
 * - import { supabase } from '@/lib/supabase' (este arquivo)
 */

import { createClient } from '@supabase/supabase-js'
import { getStorageAdapter } from './utils/supabase-storage-adapter'

// Configuração direta do Supabase - evitando EnvironmentManager problemático
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

// ✅ Storage adapter customizado com proteção contra quota exceeded
const customStorage = typeof window !== 'undefined' ? getStorageAdapter() : undefined

// Configurações para produção - tratamento de timeout e retry
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // ✅ Usar storage customizado com fallback automático
    storage: customStorage,
  },
  global: {
    fetch: (url: RequestInfo | URL, init?: RequestInit) => {
      // Adiciona timeout e tratamento de erro customizado
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      return fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          ...init?.headers,
          'User-Agent': 'nova-ipe-client'
        }
      }).finally(() => clearTimeout(timeoutId))
    }
  }
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)

// Cliente administrativo (bypassa RLS) - Para WordPress Catalog Dashboard
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      ...supabaseOptions,
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : supabase // Fallback para cliente normal se não houver service key

console.log('[Supabase] Clients initialized:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey,
  usingAdminClient: !!supabaseServiceKey
})

// Função para testar conectividade
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (esperado)
      throw error
    }
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}