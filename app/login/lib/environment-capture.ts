/**
 * 🔍 Environment Capture Utility
 * Captura informações detalhadas do ambiente no momento do erro
 */

export interface EnvironmentSnapshot {
  // Browser
  userAgent: string
  language: string
  platform: string
  vendor: string
  cookiesEnabled: boolean
  doNotTrack: string | null
  
  // Screen
  screenWidth: number
  screenHeight: number
  screenColorDepth: number
  screenPixelRatio: number
  
  // Viewport
  viewportWidth: number
  viewportHeight: number
  
  // Network
  online: boolean
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
  
  // Memory (se disponível)
  jsHeapSizeLimit?: number
  totalJSHeapSize?: number
  usedJSHeapSize?: number
  
  // Storage
  localStorageAvailable: boolean
  sessionStorageAvailable: boolean
  
  // Timing
  timestamp: string
  timezoneOffset: number
  
  // Page
  url: string
  referrer: string
  
  // Performance
  performanceTimingAvailable: boolean
  navigationTiming?: {
    domContentLoaded?: number
    loadComplete?: number
  }
}

export function captureEnvironment(): EnvironmentSnapshot {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const memory = (performance as any).memory
  
  let localStorageAvailable = false
  let sessionStorageAvailable = false
  
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    localStorageAvailable = true
  } catch (e) {
    localStorageAvailable = false
  }
  
  try {
    sessionStorage.setItem('test', 'test')
    sessionStorage.removeItem('test')
    sessionStorageAvailable = true
  } catch (e) {
    sessionStorageAvailable = false
  }
  
  const snapshot: EnvironmentSnapshot = {
    // Browser
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: (navigator as any).doNotTrack || null,
    
    // Screen
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelRatio: window.devicePixelRatio,
    
    // Viewport
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    
    // Network
    online: navigator.onLine,
    connectionType: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    
    // Memory (se disponível)
    jsHeapSizeLimit: memory?.jsHeapSizeLimit,
    totalJSHeapSize: memory?.totalJSHeapSize,
    usedJSHeapSize: memory?.usedJSHeapSize,
    
    // Storage
    localStorageAvailable,
    sessionStorageAvailable,
    
    // Timing
    timestamp: new Date().toISOString(),
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // Page
    url: window.location.href,
    referrer: document.referrer,
    
    // Performance
    performanceTimingAvailable: !!window.performance?.timing,
  }
  
  // Navigation timing (se disponível)
  if (window.performance?.timing) {
    const timing = window.performance.timing
    const navigationStart = timing.navigationStart
    
    snapshot.navigationTiming = {
      domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
      loadComplete: timing.loadEventEnd - navigationStart,
    }
  }
  
  return snapshot
}

/**
 * Formata snapshot para console
 */
export function logEnvironmentSnapshot(snapshot: EnvironmentSnapshot) {
  console.group('🌍 Environment Snapshot')
  
  console.group('📱 Device')
  console.log('User Agent:', snapshot.userAgent)
  console.log('Platform:', snapshot.platform)
  console.log('Language:', snapshot.language)
  console.log('Screen:', `${snapshot.screenWidth}x${snapshot.screenHeight} @ ${snapshot.screenPixelRatio}x`)
  console.log('Viewport:', `${snapshot.viewportWidth}x${snapshot.viewportHeight}`)
  console.groupEnd()
  
  console.group('🌐 Network')
  console.log('Online:', snapshot.online)
  if (snapshot.connectionType) console.log('Type:', snapshot.connectionType)
  if (snapshot.effectiveType) console.log('Effective Type:', snapshot.effectiveType)
  if (snapshot.downlink) console.log('Downlink:', `${snapshot.downlink} Mbps`)
  if (snapshot.rtt) console.log('RTT:', `${snapshot.rtt}ms`)
  if (snapshot.saveData !== undefined) console.log('Save Data:', snapshot.saveData)
  console.groupEnd()
  
  console.group('💾 Storage')
  console.log('LocalStorage:', snapshot.localStorageAvailable ? '✅' : '❌')
  console.log('SessionStorage:', snapshot.sessionStorageAvailable ? '✅' : '❌')
  console.log('Cookies:', snapshot.cookiesEnabled ? '✅' : '❌')
  console.groupEnd()
  
  if (snapshot.jsHeapSizeLimit) {
    console.group('🧠 Memory')
    console.log('Heap Limit:', formatBytes(snapshot.jsHeapSizeLimit))
    console.log('Total Heap:', formatBytes(snapshot.totalJSHeapSize || 0))
    console.log('Used Heap:', formatBytes(snapshot.usedJSHeapSize || 0))
    console.groupEnd()
  }
  
  console.group('⏱️ Timing')
  console.log('Timestamp:', new Date(snapshot.timestamp).toLocaleString('pt-BR'))
  console.log('Timezone Offset:', `${snapshot.timezoneOffset} minutes`)
  if (snapshot.navigationTiming) {
    console.log('DOM Content Loaded:', `${snapshot.navigationTiming.domContentLoaded}ms`)
    console.log('Load Complete:', `${snapshot.navigationTiming.loadComplete}ms`)
  }
  console.groupEnd()
  
  console.groupEnd()
}

/**
 * Formata bytes para leitura humana
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Detecta possíveis problemas no ambiente
 */
export function detectEnvironmentIssues(snapshot: EnvironmentSnapshot): string[] {
  const issues: string[] = []
  
  // Offline
  if (!snapshot.online) {
    issues.push('❌ Usuário offline - sem conexão com internet')
  }
  
  // Conexão lenta
  if (snapshot.effectiveType && ['slow-2g', '2g'].includes(snapshot.effectiveType)) {
    issues.push('⚠️ Conexão muito lenta (2G)')
  }
  
  // Storage desabilitado
  if (!snapshot.localStorageAvailable) {
    issues.push('⚠️ LocalStorage não disponível (pode afetar sessão)')
  }
  
  if (!snapshot.cookiesEnabled) {
    issues.push('❌ Cookies desabilitados (necessário para autenticação)')
  }
  
  // Viewport muito pequeno
  if (snapshot.viewportWidth < 320) {
    issues.push('⚠️ Viewport muito estreito (possível problema de layout)')
  }
  
  // Memória baixa
  if (snapshot.usedJSHeapSize && snapshot.jsHeapSizeLimit) {
    const usage = snapshot.usedJSHeapSize / snapshot.jsHeapSizeLimit
    if (usage > 0.9) {
      issues.push('⚠️ Uso de memória alto (>90%)')
    }
  }
  
  return issues
}
