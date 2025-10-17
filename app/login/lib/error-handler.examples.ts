/**
 * 🧪 Exemplo de Uso - Error Handling System
 * 
 * Este arquivo demonstra como o sistema funciona na prática
 */

import { 
  buildErrorDetails, 
  generateErrorMetrics, 
  errorLogger,
  ErrorCategory 
} from '../lib/error-handler'

// ============================================================================
// EXEMPLO 1: Credenciais Inválidas
// ============================================================================

function exemploCredenciaisInvalidas() {
  const startTime = Date.now()
  const attemptNumber = 1
  
  try {
    // Simular erro do Supabase
    throw new Error('Invalid login credentials')
  } catch (error) {
    const duration = Date.now() - startTime
    
    // Sistema categoriza automaticamente como AUTH_INVALID_CREDENTIALS
    const errorDetails = buildErrorDetails(error, {
      loginMode: 'dashboard',
      email: 'user@example.com',
      attemptNumber: 1,
    })
    
    const metrics = generateErrorMetrics(
      errorDetails,
      attemptNumber,
      duration,
      'user@example.com',
      'dashboard'
    )
    
    // Log estruturado no console
    errorLogger.logError(errorDetails, metrics)
    
    /* 
    Console Output:
    
    🚨 LOGIN ERROR [ERR_1729180800000_abc123]
    ├─ 📊 Metrics
    │  ├─ category: AUTH_INVALID_CREDENTIALS
    │  ├─ timestamp: 17/10/2025 14:30:00
    │  ├─ duration: 234ms
    │  ├─ attempt: 1
    │  └─ mode: dashboard
    │
    ├─ 📝 Details
    │  ├─ title: Credenciais Inválidas
    │  ├─ message: O email ou senha fornecidos estão incorretos...
    │  ├─ canRetry: true
    │  └─ retryDelay: N/A
    │
    └─ ⚠️ Environment Issues
       └─ (nenhum detectado)
    */
    
    // Exibir para o usuário
    console.log('Mostrar para usuário:', {
      title: errorDetails.title,
      message: errorDetails.message,
      technical: `[${metrics.errorId}] ${errorDetails.category}`,
    })
  }
}

// ============================================================================
// EXEMPLO 2: Rate Limit
// ============================================================================

function exemploRateLimit() {
  const startTime = Date.now()
  const attemptNumber = 5 // 5ª tentativa
  
  try {
    throw new Error('Email rate limit exceeded')
  } catch (error) {
    const duration = Date.now() - startTime
    
    // Sistema categoriza automaticamente como AUTH_RATE_LIMIT
    const errorDetails = buildErrorDetails(error, {
      loginMode: 'dashboard',
      email: 'user@example.com',
      attemptNumber,
    })
    
    const metrics = generateErrorMetrics(
      errorDetails,
      attemptNumber,
      duration,
      'user@example.com',
      'dashboard'
    )
    
    errorLogger.logError(errorDetails, metrics)
    
    // Verificar se pode retry e quando
    console.log('Can Retry:', errorDetails.canRetry) // true
    console.log('Retry Delay:', errorDetails.retryDelay) // 300 (5 minutos)
    
    // Exibir para o usuário com countdown
    console.log('Bloqueado por:', errorDetails.retryDelay, 'segundos')
  }
}

// ============================================================================
// EXEMPLO 3: Network Error com Issues Detectados
// ============================================================================

function exemploNetworkError() {
  const startTime = Date.now()
  const attemptNumber = 1
  
  // Simular offline
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  })
  
  try {
    throw new Error('Failed to fetch')
  } catch (error) {
    const duration = Date.now() - startTime
    
    const errorDetails = buildErrorDetails(error, {
      loginMode: 'dashboard',
      email: 'user@example.com',
      attemptNumber,
    })
    
    const metrics = generateErrorMetrics(
      errorDetails,
      attemptNumber,
      duration,
      'user@example.com',
      'dashboard'
    )
    
    errorLogger.logError(errorDetails, metrics)
    
    // Environment issues detectados automaticamente
    console.log('Issues:', metrics.environmentIssues)
    // ["❌ Usuário offline - sem conexão com internet"]
    
    // Sistema já sabe que o problema é de rede
    console.log('Category:', errorDetails.category) // NETWORK_OFFLINE
  }
}

// ============================================================================
// EXEMPLO 4: Obter Estatísticas
// ============================================================================

function exemploEstatisticas() {
  // Simular vários erros
  exemploCredenciaisInvalidas()
  exemploCredenciaisInvalidas()
  exemploRateLimit()
  exemploNetworkError()
  
  // Obter estatísticas
  const stats = errorLogger.getStats()
  
  console.log('Total de erros:', stats.total) // 4
  console.log('Por categoria:', stats.byCategory)
  /*
  {
    AUTH_INVALID_CREDENTIALS: 2,
    AUTH_RATE_LIMIT: 1,
    NETWORK_OFFLINE: 1
  }
  */
  
  // Último erro
  console.log('Último erro:', stats.lastError)
  
  // Histórico completo
  const history = errorLogger.getErrorHistory()
  console.log('Histórico:', history.length, 'erros')
  
  // Limpar histórico
  errorLogger.clearHistory()
}

// ============================================================================
// EXEMPLO 5: Debug Mode
// ============================================================================

function exemploDebugMode() {
  // Ativar debug mode
  errorLogger.setDebugMode(true)
  
  // Agora os logs incluirão:
  // - Stack trace completo
  // - Original error object
  // - Environment snapshot detalhado
  // - Timing information
  
  try {
    throw new Error('Test error')
  } catch (error) {
    const errorDetails = buildErrorDetails(error)
    const metrics = generateErrorMetrics(errorDetails, 1, 100)
    
    // Log com MUITO mais detalhes
    errorLogger.logError(errorDetails, metrics)
  }
  
  // Desativar debug mode
  errorLogger.setDebugMode(false)
}

// ============================================================================
// EXEMPLO 6: Export Debug Data
// ============================================================================

function exemploExportDebugData() {
  // Simular alguns erros
  exemploCredenciaisInvalidas()
  exemploRateLimit()
  
  // Obter dados completos
  const stats = errorLogger.getStats()
  const history = errorLogger.getErrorHistory()
  
  const debugData = {
    timestamp: new Date().toISOString(),
    stats,
    history,
    sessionInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    }
  }
  
  // Exportar como JSON
  const json = JSON.stringify(debugData, null, 2)
  console.log('Debug Data:', json)
  
  // Em produção, você pode fazer download:
  // const blob = new Blob([json], { type: 'application/json' })
  // const url = URL.createObjectURL(blob)
  // const a = document.createElement('a')
  // a.href = url
  // a.download = `login-debug-${Date.now()}.json`
  // a.click()
}

// ============================================================================
// EXEMPLO 7: Integração no Componente React
// ============================================================================

function exemploComponenteReact() {
  const codigo = `
import { 
  buildErrorDetails, 
  generateErrorMetrics, 
  errorLogger 
} from './lib/error-handler'

function LoginForm() {
  const [startTime, setStartTime] = useState(0)
  const [attemptNumber, setAttemptNumber] = useState(0)
  
  const handleSubmit = async (data) => {
    const loginStartTime = Date.now()
    setStartTime(loginStartTime)
    setAttemptNumber(prev => prev + 1)
    
    try {
      await login(data.email, data.password)
      // Sucesso!
    } catch (error) {
      // ✅ Sistema completo de error handling
      const duration = Date.now() - loginStartTime
      
      const errorDetails = buildErrorDetails(error, {
        loginMode: 'dashboard',
        email: data.email,
        attemptNumber: attemptNumber + 1,
      })
      
      const metrics = generateErrorMetrics(
        errorDetails,
        attemptNumber + 1,
        duration,
        data.email,
        'dashboard'
      )
      
      // Log estruturado
      errorLogger.logError(errorDetails, metrics)
      
      // Exibir para o usuário
      setError({
        title: errorDetails.title,
        message: errorDetails.message,
        technical: \`[\${metrics.errorId}] \${errorDetails.category}\`
      })
    }
  }
  
  // ... resto do componente
}
  `
  
  console.log('Código de exemplo:', codigo)
}

// ============================================================================
// EXECUTAR EXEMPLOS
// ============================================================================

export function runExamples() {
  console.log('🧪 Executando Exemplos de Error Handling\n')
  
  console.log('1️⃣ Credenciais Inválidas')
  exemploCredenciaisInvalidas()
  
  console.log('\n2️⃣ Rate Limit')
  exemploRateLimit()
  
  console.log('\n3️⃣ Network Error')
  exemploNetworkError()
  
  console.log('\n4️⃣ Estatísticas')
  exemploEstatisticas()
  
  console.log('\n5️⃣ Debug Mode')
  exemploDebugMode()
  
  console.log('\n6️⃣ Export Debug Data')
  exemploExportDebugData()
  
  console.log('\n7️⃣ Integração React')
  exemploComponenteReact()
}

// Para executar no console:
// import { runExamples } from './examples'
// runExamples()
