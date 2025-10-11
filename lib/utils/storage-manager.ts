/**
 * Gerenciador de Storage com Proteção Contra Quota Exceeded
 * 
 * Resolve o problema de "The quota has been exceeded" do Supabase Auth
 * 
 * Funcionalidades:
 * - Limpeza automática de dados antigos
 * - Fallback para sessionStorage
 * - Tratamento seguro de erros
 * - Monitoramento de uso
 */

'use client'

const STORAGE_PREFIX = 'sb-' // Supabase prefix
const MAX_STORAGE_SIZE = 4 * 1024 * 1024 // 4MB (seguro para a maioria dos browsers)
const CLEANUP_THRESHOLD = 0.8 // Limpar quando usar 80% da capacidade

export interface StorageStats {
  used: number
  available: number
  percentage: number
  itemCount: number
}

export class StorageManager {
  private static instance: StorageManager
  
  private constructor() {}
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  /**
   * Verifica se storage está disponível
   */
  isStorageAvailable(type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean {
    try {
      const storage = window[type]
      const test = '__storage_test__'
      storage.setItem(test, test)
      storage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Calcula o tamanho usado no storage (aproximado)
   */
  getStorageSize(type: 'localStorage' | 'sessionStorage' = 'localStorage'): number {
    try {
      const storage = window[type]
      let total = 0
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          const value = storage.getItem(key)
          // Calcular tamanho em bytes (aproximado)
          total += (key.length + (value?.length || 0)) * 2 // UTF-16 = 2 bytes por char
        }
      }
      
      return total
    } catch {
      return 0
    }
  }

  /**
   * Obtém estatísticas do storage
   */
  getStats(type: 'localStorage' | 'sessionStorage' = 'localStorage'): StorageStats {
    const used = this.getStorageSize(type)
    const available = MAX_STORAGE_SIZE - used
    const percentage = (used / MAX_STORAGE_SIZE) * 100
    const itemCount = window[type].length

    return { used, available, percentage, itemCount }
  }

  /**
   * Limpa dados antigos do Supabase (exceto sessão atual)
   */
  cleanupSupabaseData(): {
    cleaned: number
    beforeSize: number
    afterSize: number
  } {
    console.log('🧹 Iniciando limpeza de dados do Supabase...')
    
    const beforeSize = this.getStorageSize()
    let cleaned = 0

    try {
      const keysToRemove: string[] = []
      const currentAuthKey = this.findCurrentAuthKey()

      // Identificar keys antigas do Supabase
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          // Não remover a key da sessão atual
          if (key !== currentAuthKey) {
            keysToRemove.push(key)
          }
        }
      }

      // Remover keys antigas
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
          cleaned++
        } catch (error) {
          console.warn(`⚠️ Erro ao remover ${key}:`, error)
        }
      })

      const afterSize = this.getStorageSize()
      const freedSpace = beforeSize - afterSize

      console.log('✅ Limpeza concluída:', {
        itemsRemoved: cleaned,
        freedSpace: `${(freedSpace / 1024).toFixed(2)} KB`,
        before: `${(beforeSize / 1024).toFixed(2)} KB`,
        after: `${(afterSize / 1024).toFixed(2)} KB`
      })

      return { cleaned, beforeSize, afterSize }
    } catch (error) {
      console.error('❌ Erro na limpeza:', error)
      return { cleaned: 0, beforeSize, afterSize: beforeSize }
    }
  }

  /**
   * Limpa dados do rate limiter de login
   */
  cleanupRateLimitData(): number {
    console.log('🧹 Limpando dados de rate limit...')
    
    let cleaned = 0
    const keysToRemove: string[] = []

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('login_attempts_')) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        cleaned++
      })

      console.log(`✅ ${cleaned} itens de rate limit removidos`)
      return cleaned
    } catch (error) {
      console.error('❌ Erro ao limpar rate limit:', error)
      return 0
    }
  }

  /**
   * Encontra a key da sessão atual do Supabase
   */
  private findCurrentAuthKey(): string | null {
    try {
      // Supabase geralmente usa: sb-<project-ref>-auth-token
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('-auth-token')) {
          return key
        }
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Verifica se precisa fazer limpeza automática
   */
  shouldCleanup(): boolean {
    const stats = this.getStats()
    return stats.percentage >= (CLEANUP_THRESHOLD * 100)
  }

  /**
   * Prepara storage para login (limpeza pré-autenticação)
   */
  prepareForAuth(): void {
    console.log('🔧 Preparando storage para autenticação...')
    
    // Sempre limpar rate limit antes de tentar login
    this.cleanupRateLimitData()
    
    // Limpar dados antigos do Supabase se necessário
    if (this.shouldCleanup()) {
      this.cleanupSupabaseData()
    }

    // Log de estatísticas
    const stats = this.getStats()
    console.log('📊 Storage pronto:', {
      usage: `${stats.percentage.toFixed(1)}%`,
      items: stats.itemCount,
      available: `${(stats.available / 1024).toFixed(2)} KB`
    })
  }

  /**
   * Tenta salvar item com fallback para sessionStorage
   */
  safeSetItem(
    key: string, 
    value: string, 
    preferredStorage: 'localStorage' | 'sessionStorage' = 'localStorage'
  ): boolean {
    try {
      // Tentar storage preferido
      window[preferredStorage].setItem(key, value)
      return true
    } catch (error) {
      console.warn(`⚠️ Falha ao salvar em ${preferredStorage}, tentando fallback...`)
      
      // Tentar limpeza automática
      if (preferredStorage === 'localStorage') {
        this.cleanupSupabaseData()
        
        try {
          // Tentar novamente após limpeza
          window[preferredStorage].setItem(key, value)
          console.log('✅ Salvo após limpeza')
          return true
        } catch {
          // Se ainda falhar, tentar sessionStorage
          const fallbackStorage = 'sessionStorage'
          try {
            window[fallbackStorage].setItem(key, value)
            console.log(`✅ Salvo em ${fallbackStorage} (fallback)`)
            return true
          } catch {
            console.error('❌ Falha em ambos os storages')
            return false
          }
        }
      }
      
      return false
    }
  }

  /**
   * Remove item de todos os storages
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {}
    
    try {
      sessionStorage.removeItem(key)
    } catch {}
  }

  /**
   * Limpeza completa (emergência)
   */
  emergencyCleanup(): void {
    console.warn('🚨 LIMPEZA DE EMERGÊNCIA ATIVADA')
    
    try {
      // Salvar apenas a sessão atual
      const currentAuthKey = this.findCurrentAuthKey()
      let currentSession: string | null = null
      
      if (currentAuthKey) {
        currentSession = localStorage.getItem(currentAuthKey)
      }

      // Limpar tudo
      localStorage.clear()

      // Restaurar sessão se existia
      if (currentAuthKey && currentSession) {
        try {
          localStorage.setItem(currentAuthKey, currentSession)
          console.log('✅ Sessão atual preservada')
        } catch (error) {
          console.error('❌ Não foi possível restaurar sessão:', error)
        }
      }

      console.log('✅ Limpeza de emergência concluída')
    } catch (error) {
      console.error('❌ Erro na limpeza de emergência:', error)
    }
  }

  /**
   * Diagnóstico completo
   */
  diagnose(): void {
    console.log('🔍 DIAGNÓSTICO DO STORAGE')
    console.log('========================')
    
    // LocalStorage
    const localStats = this.getStats('localStorage')
    console.log('\n📦 localStorage:', {
      available: this.isStorageAvailable('localStorage'),
      usage: `${localStats.percentage.toFixed(1)}%`,
      used: `${(localStats.used / 1024).toFixed(2)} KB`,
      items: localStats.itemCount
    })

    // SessionStorage
    const sessionStats = this.getStats('sessionStorage')
    console.log('\n📦 sessionStorage:', {
      available: this.isStorageAvailable('sessionStorage'),
      usage: `${sessionStats.percentage.toFixed(1)}%`,
      used: `${(sessionStats.used / 1024).toFixed(2)} KB`,
      items: sessionStats.itemCount
    })

    // Listar keys do Supabase
    console.log('\n🔑 Keys do Supabase:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key)
        const size = value ? (value.length * 2 / 1024).toFixed(2) : '0'
        console.log(`  - ${key}: ${size} KB`)
      }
    }

    // Recomendações
    console.log('\n💡 Recomendações:')
    if (localStats.percentage > 80) {
      console.log('  ⚠️ Storage quase cheio - limpeza recomendada')
    } else if (localStats.percentage > 50) {
      console.log('  ⚡ Storage em uso moderado')
    } else {
      console.log('  ✅ Storage com boa disponibilidade')
    }
    
    console.log('========================\n')
  }
}

// Export singleton
export const storageManager = StorageManager.getInstance()
