/**
 * 🔍 Performance Monitor - Debugging de tempos anômalos
 * Detecta e loga gargalos de performance em tempo real
 */

export class PerformanceMonitor {
  private static thresholds = {
    page_load: 3000, // 3s
    api_call: 1000, // 1s
    auth: 2000, // 2s
    render: 500, // 500ms
    dynamic_import: 5000, // 5s
    critical: 10000, // 10s - ANÔMALO
  }

  /**
   * Inicia timer e retorna função para finalizar e logar
   */
  static startTimer(label: string, category: keyof typeof PerformanceMonitor.thresholds = 'page_load') {
    const start = performance.now()
    console.log(`⏱️ [Performance] ${label} - Iniciado`)

    return {
      end: (metadata?: Record<string, any>) => {
        const duration = performance.now() - start
        const threshold = this.thresholds[category]
        const isAnomaly = duration > threshold
        const isCritical = duration > this.thresholds.critical

        const emoji = isCritical ? '🚨' : isAnomaly ? '⚠️' : '✅'
        const level = isCritical ? 'CRÍTICO' : isAnomaly ? 'LENTO' : 'OK'

        console.log(
          `${emoji} [Performance] ${label} - ${level}`,
          {
            duration: `${duration.toFixed(0)}ms`,
            threshold: `${threshold}ms`,
            status: level,
            ...metadata,
          }
        )

        // Alertar no console se crítico
        if (isCritical) {
          console.error(
            `🚨 TEMPO CRÍTICO DETECTADO: ${label} levou ${duration.toFixed(0)}ms (limite: ${this.thresholds.critical}ms)`
          )
        }

        return { duration, isAnomaly, isCritical }
      },
      duration: () => performance.now() - start,
    }
  }

  /**
   * Wrapper para funções async com timing automático
   */
  static async measure<T>(
    label: string,
    fn: () => Promise<T>,
    category: keyof typeof PerformanceMonitor.thresholds = 'page_load'
  ): Promise<T> {
    const timer = this.startTimer(label, category)
    try {
      const result = await fn()
      timer.end()
      return result
    } catch (error) {
      timer.end({ error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  /**
   * Loga métricas de navegação
   */
  static logNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance) return

    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    const connectTime = perfData.responseEnd - perfData.requestStart
    const renderTime = perfData.domComplete - perfData.domLoading

    console.log('📊 [Performance] Navigation Timing:', {
      'Total Page Load': `${pageLoadTime}ms`,
      'Server Response': `${connectTime}ms`,
      'DOM Render': `${renderTime}ms`,
      'DNS Lookup': `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
      'TCP Connection': `${perfData.connectEnd - perfData.connectStart}ms`,
    })

    if (pageLoadTime > this.thresholds.critical) {
      console.error(
        `🚨 PÁGINA CARREGOU LENTAMENTE: ${pageLoadTime}ms (limite crítico: ${this.thresholds.critical}ms)`
      )
    }
  }

  /**
   * Monitora Web Vitals
   */
  static monitorWebVitals() {
    if (typeof window === 'undefined') return

    // FCP - First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const value = entry.startTime
        const isGood = value < 1800
        const emoji = isGood ? '✅' : value < 3000 ? '⚠️' : '🚨'
        
        console.log(`${emoji} [Web Vitals] ${entry.name}: ${value.toFixed(0)}ms`)
      }
    })

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
    } catch (e) {
      // Browser não suporta
    }
  }

  /**
   * Analisa tamanho de módulos carregados
   */
  static analyzeModules() {
    if (typeof window === 'undefined' || !window.performance) return

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const scripts = resources.filter((r) => r.initiatorType === 'script')
    
    const totalSize = scripts.reduce((acc, r) => acc + (r.transferSize || 0), 0)
    const totalDuration = scripts.reduce((acc, r) => acc + r.duration, 0)

    console.log('📦 [Performance] Bundle Analysis:', {
      'Total Scripts': scripts.length,
      'Total Size': `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      'Total Load Time': `${totalDuration.toFixed(0)}ms`,
      'Average per Script': `${(totalDuration / scripts.length).toFixed(0)}ms`,
    })

    // Listar scripts mais pesados
    const heavyScripts = scripts
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 10)

    if (heavyScripts.length > 0) {
      console.log('🎯 [Performance] Top 10 scripts mais pesados:')
      heavyScripts.forEach((script, idx) => {
        const size = (script.transferSize || 0) / 1024
        const emoji = size > 500 ? '🚨' : size > 200 ? '⚠️' : '✅'
        console.log(
          `${emoji} ${idx + 1}. ${script.name.split('/').pop()} - ${size.toFixed(0)}KB em ${script.duration.toFixed(0)}ms`
        )
      })
    }
  }
}
