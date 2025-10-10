/**
 * Conditional Logger
 * Logs apenas em desenvolvimento para evitar poluição em produção
 */

const isDev = process.env.NODE_ENV === 'development'
const isBrowser = typeof window !== 'undefined'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args)
  },

  info: (...args: any[]) => {
    if (isDev) console.info(...args)
  },

  warn: (...args: any[]) => {
    // Warnings são sempre mostrados
    console.warn(...args)
  },

  error: (...args: any[]) => {
    // Errors são sempre mostrados
    console.error(...args)
  },

  // Logger específico para serviços
  service: (serviceName: string, method: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[${serviceName}] ${method}:`, ...args)
    }
  },

  // Logger específico para componentes React
  component: (componentName: string, ...args: any[]) => {
    if (isDev && isBrowser) {
      console.log(`[Component: ${componentName}]`, ...args)
    }
  },

  // Logger para API routes
  api: (route: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[API: ${route}]`, ...args)
    }
  }
}
