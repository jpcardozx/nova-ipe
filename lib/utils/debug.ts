interface LogData {
  [key: string]: any
}

interface DebugContext {
  component?: string
  userId?: string
  sessionId?: string
  timestamp: string
  environment: 'development' | 'production'
}

class Logger {
  private static instance: Logger
  private context: Partial<DebugContext> = {}
  private isDevelopment = process.env.NODE_ENV === 'development'

  private constructor() {
    this.context = {
      timestamp: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production'
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  setContext(context: Partial<DebugContext>) {
    this.context = { ...this.context, ...context }
  }

  private formatMessage(level: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString()
    const contextStr = JSON.stringify({
      ...this.context,
      timestamp,
      level
    })
    
    if (data) {
      return `[${level.toUpperCase()}] ${message}\nContext: ${contextStr}\nData: ${JSON.stringify(data, null, 2)}`
    }
    
    return `[${level.toUpperCase()}] ${message}\nContext: ${contextStr}`
  }

  debug(message: string, data?: LogData) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, data))
    }
  }

  info(message: string, data?: LogData) {
    console.info(this.formatMessage('info', message, data))
  }

  warn(message: string, data?: LogData) {
    console.warn(this.formatMessage('warn', message, data))
  }

  error(message: string, error?: Error | any, data?: LogData) {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...data
    } : { error, ...data }
    
    console.error(this.formatMessage('error', message, errorData))
    
    // Em produção, você poderia enviar para um serviço de monitoramento
    if (!this.isDevelopment) {
      this.sendToMonitoring('error', message, errorData)
    }
  }

  // Método para tracking de performance
  performance(operation: string, startTime: number, data?: LogData) {
    const duration = performance.now() - startTime
    const performanceData = {
      operation,
      duration: `${duration.toFixed(2)}ms`,
      ...data
    }
    
    if (duration > 1000) { // Log operations > 1s
      this.warn(`Slow operation detected: ${operation}`, performanceData)
    } else if (this.isDevelopment) {
      this.debug(`Performance: ${operation}`, performanceData)
    }
  }

  // Método para tracking de user actions
  userAction(action: string, userId?: string, data?: LogData) {
    this.info(`User Action: ${action}`, {
      userId: userId || this.context.userId,
      action,
      ...data
    })
  }

  // Método para database operations
  database(operation: string, table: string, data?: LogData) {
    this.debug(`Database ${operation}: ${table}`, data)
  }

  private sendToMonitoring(level: string, message: string, data: LogData) {
    // Implementar integração com serviço de monitoramento (Sentry, LogRocket, etc.)
    // Por enquanto, apenas console.error para não perder os logs
    console.error('MONITORING:', { level, message, data })
  }
}

// Utilitários de debug específicos para componentes React
export const withDebug = <T extends {}>(componentName: string, props: T) => {
  const logger = Logger.getInstance()
  logger.setContext({ component: componentName })
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Component ${componentName} rendered`, { props })
  }
  
  return {
    logger,
    debugProps: process.env.NODE_ENV === 'development' ? props : undefined
  }
}

// Performance timer
export const createTimer = (operation: string) => {
  const startTime = performance.now()
  const logger = Logger.getInstance()
  
  return {
    end: (data?: LogData) => {
      logger.performance(operation, startTime, data)
    }
  }
}

// Singleton instance
export const logger = Logger.getInstance()

// Utility functions
export const debugDatabase = (operation: string, table: string, data?: LogData) => {
  logger.database(operation, table, data)
}

export const debugUserAction = (action: string, userId?: string, data?: LogData) => {
  logger.userAction(action, userId, data)
}

export const debugError = (message: string, error?: Error | any, data?: LogData) => {
  logger.error(message, error, data)
}

export const debugPerformance = (operation: string, fn: () => Promise<any>) => {
  const timer = createTimer(operation)
  return fn().finally(() => timer.end())
}