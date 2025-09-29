/**
 * Scripts de Otimização do Sistema
 * Funcionalidades para melhorar performance e experiência do usuário
 */

/**
 * Sistema de Cache Inteligente
 */
export class IntelligentCache {
  private static cache = new Map<string, { data: any, timestamp: number, ttl: number }>()

  /**
   * Armazena dados no cache com TTL
   */
  static set(key: string, data: any, ttlMinutes: number = 30): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    })
  }

  /**
   * Recupera dados do cache se ainda válidos
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * Limpa cache expirado
   */
  static cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Cache para dados de imóveis
   */
  static cacheProperty(propertyId: string, data: any): void {
    this.set(`property_${propertyId}`, data, 60) // 1 hora
  }

  /**
   * Cache para contatos WhatsApp
   */
  static cacheContact(contactId: string, data: any): void {
    this.set(`contact_${contactId}`, data, 30) // 30 minutos
  }
}

/**
 * Sistema de Debounce para Otimizar Requests
 */
export class DebounceManager {
  private static timers = new Map<string, NodeJS.Timeout>()

  /**
   * Debounce genérico
   */
  static debounce<T extends (...args: any[]) => any>(
    key: string,
    func: T,
    delay: number = 300
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existingTimer = this.timers.get(key)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      const timer = setTimeout(() => {
        func(...args)
        this.timers.delete(key)
      }, delay)

      this.timers.set(key, timer)
    }
  }

  /**
   * Debounce para busca
   */
  static createSearchDebounce(searchFunction: (query: string) => void): (query: string) => void {
    return this.debounce('search', searchFunction, 500)
  }

  /**
   * Debounce para auto-save
   */
  static createAutoSaveDebounce(saveFunction: () => void): () => void {
    return this.debounce('autosave', saveFunction, 2000)
  }
}

/**
 * Sistema de Lazy Loading
 */
export class LazyLoader {
  /**
   * Carrega componente sob demanda
   */
  static async loadComponent<T>(importFunction: () => Promise<{ default: T }>): Promise<T> {
    const cacheKey = importFunction.toString()
    const cached = IntelligentCache.get<T>(cacheKey)

    if (cached) {
      return cached
    }

    const module = await importFunction()
    const component = module.default

    IntelligentCache.set(cacheKey, component, 60) // Cache por 1 hora
    return component
  }

  /**
   * Intersection Observer para lazy loading de imagens
   */
  static createImageObserver(callback: (entries: IntersectionObserverEntry[]) => void): IntersectionObserver {
    return new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px'
    })
  }
}

/**
 * Sistema de Virtual Scrolling
 */
export class VirtualScrollManager {
  /**
   * Calcula itens visíveis para virtual scrolling
   */
  static calculateVisibleItems(
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 5
  ): { startIndex: number, endIndex: number, visibleItems: number } {
    const visibleItems = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2)

    return { startIndex, endIndex, visibleItems }
  }

  /**
   * Configuração otimizada para lista de contatos
   */
  static getContactListConfig() {
    return {
      itemHeight: 80,
      overscan: 10,
      threshold: 50
    }
  }
}

/**
 * Sistema de Performance Monitoring
 */
export class PerformanceMonitor {
  private static metrics: { [key: string]: number[] } = {}

  /**
   * Inicia medição de performance
   */
  static startMeasure(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`)
    }
  }

  /**
   * Finaliza medição de performance
   */
  static endMeasure(name: string): number {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`)
      window.performance.measure(name, `${name}-start`, `${name}-end`)

      const measures = window.performance.getEntriesByName(name, 'measure')
      if (measures.length > 0) {
        const duration = measures[measures.length - 1].duration

        if (!this.metrics[name]) {
          this.metrics[name] = []
        }
        this.metrics[name].push(duration)

        return duration
      }
    }
    return 0
  }

  /**
   * Obtém estatísticas de performance
   */
  static getStats(name: string): { avg: number, min: number, max: number, count: number } {
    const measurements = this.metrics[name] || []

    if (measurements.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 }
    }

    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return { avg, min, max, count: measurements.length }
  }

  /**
   * Monitora Core Web Vitals
   */
  static monitorWebVitals(): void {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }
}

/**
 * Sistema de Error Tracking
 */
export class ErrorTracker {
  private static errors: { error: Error, timestamp: Date, context?: any }[] = []

  /**
   * Registra erro
   */
  static trackError(error: Error, context?: any): void {
    this.errors.push({
      error,
      timestamp: new Date(),
      context
    })

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error, context)
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(error, context)
    }
  }

  /**
   * Wrapper para async functions com error tracking
   */
  static async withErrorTracking<T>(
    operation: () => Promise<T>,
    context?: any
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      this.trackError(error as Error, context)
      return null
    }
  }

  /**
   * Envia erro para serviço de monitoramento
   */
  private static sendToMonitoringService(error: Error, context?: any): void {
    // Implementar integração com Sentry, LogRocket, etc.
    console.log('Sending error to monitoring service:', { error, context })
  }

  /**
   * Obtém relatório de erros
   */
  static getErrorReport(): {
    totalErrors: number
    recentErrors: number
    commonErrors: { message: string, count: number }[]
  } {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const recentErrors = this.errors.filter(e => e.timestamp > last24h).length

    const errorCounts = new Map<string, number>()
    this.errors.forEach(({ error }) => {
      const count = errorCounts.get(error.message) || 0
      errorCounts.set(error.message, count + 1)
    })

    const commonErrors = Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalErrors: this.errors.length,
      recentErrors,
      commonErrors
    }
  }
}

/**
 * Sistema de Feature Flags
 */
export class FeatureFlags {
  private static flags: Map<string, boolean> = new Map([
    ['whatsapp_business_api', false],
    ['advanced_analytics', true],
    ['auto_responses', true],
    ['virtual_scrolling', true],
    ['image_lazy_loading', true],
    ['pdf_generation_v2', false],
    ['ai_assistant', false],
    ['voice_messages', false]
  ])

  /**
   * Verifica se feature está habilitada
   */
  static isEnabled(feature: string): boolean {
    return this.flags.get(feature) || false
  }

  /**
   * Habilita/desabilita feature
   */
  static setFlag(feature: string, enabled: boolean): void {
    this.flags.set(feature, enabled)
  }

  /**
   * Carrega flags do servidor
   */
  static async loadFromServer(): Promise<void> {
    try {
      // Em produção, carregar de API
      if (process.env.NODE_ENV === 'production') {
        const response = await fetch('/api/feature-flags')
        const flags = await response.json()

        Object.entries(flags).forEach(([key, value]) => {
          this.flags.set(key, value as boolean)
        })
      }
    } catch (error) {
      console.warn('Failed to load feature flags:', error)
    }
  }

  /**
   * Obtém todas as flags
   */
  static getAllFlags(): Record<string, boolean> {
    return Object.fromEntries(this.flags.entries())
  }
}

/**
 * Sistema de A/B Testing
 */
export class ABTesting {
  /**
   * Determina qual variante do teste mostrar
   */
  static getVariant(testName: string, userId: string): 'A' | 'B' {
    const hash = this.simpleHash(testName + userId)
    return hash % 2 === 0 ? 'A' : 'B'
  }

  /**
   * Hash simples para determinismo
   */
  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Testes ativos no sistema
   */
  static getActiveTests(): string[] {
    return [
      'whatsapp_layout_v2',
      'email_composer_design',
      'dashboard_sidebar_layout'
    ]
  }
}