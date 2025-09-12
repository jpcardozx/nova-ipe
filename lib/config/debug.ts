// Configurações de debug e logging
export const DEBUG_CONFIG = {
  // Níveis de log
  LOG_LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  },

  // Configurações por ambiente
  DEVELOPMENT: {
    enabled: true,
    logLevel: 0, // DEBUG
    logToConsole: true,
    logPerformance: true,
    logUserActions: true,
    logDatabaseQueries: true
  },

  PRODUCTION: {
    enabled: true,
    logLevel: 2, // WARN
    logToConsole: false,
    logPerformance: true,
    logUserActions: true,
    logDatabaseQueries: false
  },

  // Configurações de performance
  PERFORMANCE: {
    slowQueryThreshold: 1000, // ms
    slowComponentRenderThreshold: 100, // ms
    slowApiCallThreshold: 2000 // ms
  },

  // Filtros de logging
  FILTERS: {
    // Componentes a serem logados (vazio = todos)
    components: [] as string[],
    
    // Usuários específicos para debug (vazio = todos)
    users: [] as string[],
    
    // Operações específicas
    operations: [] as string[]
  }
}

// Função para obter configuração baseada no ambiente
export const getDebugConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  return isDevelopment ? DEBUG_CONFIG.DEVELOPMENT : DEBUG_CONFIG.PRODUCTION
}

// Função para verificar se deve logar baseado no nível
export const shouldLog = (level: keyof typeof DEBUG_CONFIG.LOG_LEVELS) => {
  const config = getDebugConfig()
  return config.enabled && DEBUG_CONFIG.LOG_LEVELS[level] >= config.logLevel
}