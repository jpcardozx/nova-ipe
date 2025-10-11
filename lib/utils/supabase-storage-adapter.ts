/**
 * Storage Adapter Customizado para Supabase
 * 
 * Implementa fallback automático e limpeza de quota exceeded
 * Compatível com a interface do Supabase Auth
 */

'use client'

import { storageManager } from './storage-manager'

export interface SupabaseStorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

class SafeStorageAdapter implements SupabaseStorageAdapter {
  private preferredStorage: Storage
  private fallbackStorage: Storage

  constructor() {
    // Verificar disponibilidade no cliente
    if (typeof window === 'undefined') {
      throw new Error('SafeStorageAdapter só pode ser usado no cliente')
    }

    this.preferredStorage = window.localStorage
    this.fallbackStorage = window.sessionStorage
  }

  async getItem(key: string): Promise<string | null> {
    try {
      // Tentar localStorage primeiro
      const value = this.preferredStorage.getItem(key)
      if (value !== null) {
        return value
      }

      // Fallback para sessionStorage
      return this.fallbackStorage.getItem(key)
    } catch (error) {
      console.error('❌ Erro ao ler storage:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      // Tentar salvar no localStorage
      this.preferredStorage.setItem(key, value)
    } catch (error) {
      console.warn('⚠️ localStorage cheio, tentando limpeza...', error)

      try {
        // Tentar limpeza automática
        storageManager.cleanupSupabaseData()

        // Tentar novamente após limpeza
        this.preferredStorage.setItem(key, value)
        console.log('✅ Salvo após limpeza automática')
      } catch (cleanupError) {
        console.warn('⚠️ Limpeza falhou, usando sessionStorage como fallback')

        try {
          // Fallback para sessionStorage
          this.fallbackStorage.setItem(key, value)
          console.log('✅ Salvo em sessionStorage (fallback)')
        } catch (fallbackError) {
          console.error('❌ Falha em ambos os storages:', fallbackError)

          // Última tentativa: limpeza de emergência
          try {
            console.warn('🚨 Ativando limpeza de emergência...')
            storageManager.emergencyCleanup()

            // Tentar uma última vez
            this.preferredStorage.setItem(key, value)
            console.log('✅ Salvo após limpeza de emergência')
          } catch (emergencyError) {
            throw new DOMException(
              'Não foi possível salvar a sessão. Por favor, limpe o cache do navegador.',
              'QuotaExceededError'
            )
          }
        }
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.preferredStorage.removeItem(key)
      this.fallbackStorage.removeItem(key)
    } catch (error) {
      console.error('❌ Erro ao remover item:', error)
      // Não lançar erro - remoção falha não é crítica
    }
  }
}

// Export singleton
let adapterInstance: SafeStorageAdapter | null = null

export function getStorageAdapter(): SupabaseStorageAdapter {
  if (typeof window === 'undefined') {
    // No servidor, retornar adapter dummy
    return {
      async getItem() { return null },
      async setItem() { },
      async removeItem() { }
    }
  }

  if (!adapterInstance) {
    adapterInstance = new SafeStorageAdapter()
  }

  return adapterInstance
}
