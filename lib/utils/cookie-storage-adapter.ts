/**
 * Cookie Storage Adapter para Supabase
 * 
 * Resolve o erro: "Failed to parse cookie string: JSON.parse: unexpected character"
 * 
 * O problema ocorre porque:
 * 1. Supabase Auth espera cookies em formato JSON
 * 2. Alguns cookies vêm em formato base64
 * 3. O parser padrão não lida com ambos os formatos
 * 
 * Esta implementação:
 * - Detecta automaticamente o formato do cookie (JSON vs base64)
 * - Faz conversão transparente
 * - Trata erros graciosamente sem quebrar o fluxo
 */

'use client'

export interface CookieStorageAdapter {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
}

/**
 * Parse seguro de cookie que pode estar em diferentes formatos
 * Suporta: JSON puro, base64, base64-prefixed, chunked cookies
 */
function parseCookieValue(value: string): string | null {
  if (!value) return null

  try {
    // 1. Tentar decodificar URL
    let decoded: string
    try {
      decoded = decodeURIComponent(value)
    } catch {
      decoded = value
    }
    
    // 2. Verificar se já é JSON válido
    if (decoded.startsWith('{') || decoded.startsWith('[')) {
      try {
        JSON.parse(decoded)
        return decoded
      } catch {
        // Não é JSON válido, continuar
      }
    }
    
    // 3. Verificar se é base64 com prefixo
    if (decoded.startsWith('base64-')) {
      try {
        const base64Content = decoded.substring(7) // Remove "base64-"
        const jsonString = atob(base64Content)
        
        // Validar se o resultado é JSON válido
        JSON.parse(jsonString)
        return jsonString
      } catch {
        // Não é base64 válido com prefixo
      }
    }
    
    // 4. Tentar decodificar como base64 direto (sem prefixo)
    // Verificar se parece ser base64 (sem espaços, caracteres válidos)
    if (/^[A-Za-z0-9+/=]+$/.test(decoded)) {
      try {
        const jsonString = atob(decoded)
        // Verificar se o resultado parece ser JSON
        if (jsonString.startsWith('{') || jsonString.startsWith('[')) {
          JSON.parse(jsonString)
          return jsonString
        }
      } catch {
        // Não é base64 válido
      }
    }
    
    // 5. Verificar se é um chunked cookie (formato: 0|part1, 1|part2, etc)
    if (decoded.includes('|')) {
      try {
        // Tentar juntar os chunks
        const chunks = decoded.split(',').map(chunk => {
          const [, content] = chunk.trim().split('|')
          return content
        })
        const joined = chunks.join('')
        
        // Tentar parsear o resultado
        const parsed = parseCookieValue(joined)
        if (parsed) return parsed
      } catch {
        // Não é formato chunked válido
      }
    }
    
    // 6. Se nada funcionou, retornar null para que Supabase trate
    // IMPORTANTE: Não retornar valor inválido, melhor retornar null
    return null
    
  } catch (error) {
    // Silenciar erro de parsing - não é crítico
    // O Supabase vai lidar com null apropriadamente
    return null
  }
}

/**
 * Serializa valor para cookie
 */
function serializeCookieValue(value: string): string {
  try {
    // Verificar se já é JSON
    JSON.parse(value)
    
    // Codificar para URL-safe
    return encodeURIComponent(value)
  } catch {
    // Se não for JSON, retornar como está
    return value
  }
}

/**
 * Adapter que intercepta leitura/escrita de cookies
 */
class SafeCookieStorageAdapter implements CookieStorageAdapter {
  private storage: Storage
  
  constructor(storage: Storage) {
    this.storage = storage
  }

  getItem(key: string): string | null {
    try {
      const rawValue = this.storage.getItem(key)
      
      if (!rawValue) {
        return null
      }

      // Parse seguro do valor
      const parsed = parseCookieValue(rawValue)
      
      return parsed
    } catch (error) {
      // Não logar erro para evitar poluir console
      // O erro original já é logado pelo Supabase
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      const serialized = serializeCookieValue(value)
      this.storage.setItem(key, serialized)
    } catch (error) {
      console.error('[CookieAdapter] Erro ao salvar:', error)
      
      // Tentar fallback para sessionStorage
      if (this.storage === localStorage) {
        try {
          sessionStorage.setItem(key, serializeCookieValue(value))
        } catch {
          // Ignorar - não há mais fallbacks
        }
      }
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key)
      
      // Remover também de fallback se existir
      if (this.storage === localStorage) {
        sessionStorage.removeItem(key)
      }
    } catch (error) {
      console.error('[CookieAdapter] Erro ao remover:', error)
    }
  }
}

// Singleton instance
let adapterInstance: SafeCookieStorageAdapter | null = null

/**
 * Retorna adapter singleton
 */
export function getCookieStorageAdapter(): CookieStorageAdapter {
  if (typeof window === 'undefined') {
    // No servidor, retornar adapter dummy
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }

  if (!adapterInstance) {
    adapterInstance = new SafeCookieStorageAdapter(localStorage)
  }

  return adapterInstance
}

/**
 * Reset adapter (útil para testes)
 */
export function resetCookieAdapter(): void {
  adapterInstance = null
}
