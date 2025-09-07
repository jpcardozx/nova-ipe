// lib/sanity-logger.ts
// Sistema de logging inteligente para Sanity - preserva debugging mas reduz poluição

const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.SANITY_DEBUG === 'true';
const isProd = process.env.NODE_ENV === 'production';

export interface LogContext {
  query?: string;
  params?: Record<string, any>;
  tags?: string[];
  duration?: number;
  retryCount?: number;
  fromFallback?: boolean;
  error?: string;
  configured?: boolean;
  environment?: 'server' | 'client';
}

export const sanityLogger = {
  // Logs sempre visíveis (críticos para operação)
  error: (message: string, context?: LogContext) => {
    console.error(`❌ [Sanity] ${message}`, context ? {
      error: context.error,
      configured: context.configured,
      query: context.query?.slice(0, 100) + '...',
      retryCount: context.retryCount
    } : undefined);
  },

  // Logs importantes mas só em dev/debug
  warn: (message: string, context?: LogContext) => {
    if (isDev || isDebug) {
      console.warn(`⚠️ [Sanity] ${message}`, context ? {
        fromFallback: context.fromFallback,
        retryCount: context.retryCount,
        error: context.error
      } : undefined);
    }
  },

  // Logs informativos só com SANITY_DEBUG
  info: (message: string, context?: LogContext) => {
    if (isDebug) {
      console.log(`🔍 [Sanity] ${message}`, context ? {
        query: context.query?.slice(0, 50) + '...',
        params: context.params,
        tags: context.tags,
        environment: context.environment
      } : undefined);
    }
  },

  // Logs de performance só com SANITY_DEBUG
  perf: (message: string, context?: LogContext) => {
    if (isDebug) {
      console.log(`⚡ [Sanity Performance] ${message}`, context ? {
        duration: context.duration,
        retryCount: context.retryCount,
        tags: context.tags
      } : undefined);
    }
  },

  // Logs de sucesso só em dev
  success: (message: string, context?: LogContext) => {
    if (isDev) {
      console.log(`✅ [Sanity] ${message}`, context ? {
        resultCount: context.query?.includes('*[') && !context.query.includes('[0]') 
          ? 'array query' 
          : 'single item',
        tags: context.tags,
        fromCache: context.fromFallback ? 'fallback' : 'fresh'
      } : undefined);
    }
  },

  // Feature para sócios: Log de métricas de negócio
  business: (metric: string, value: number, context?: { period?: string, comparison?: number }) => {
    if (isDev || isDebug) {
      const improvement = context?.comparison 
        ? `(${value > context.comparison ? '+' : ''}${((value - context.comparison) / context.comparison * 100).toFixed(1)}%)`
        : '';
      console.log(`📊 [Business Metric] ${metric}: ${value} ${improvement}`, context);
    }
  }
};

// Utility para timing
export function withTiming<T>(
  operation: () => Promise<T>, 
  operationName: string
): Promise<T & { duration: number }> {
  const start = performance.now();
  
  return operation().then(result => {
    const duration = performance.now() - start;
    sanityLogger.perf(`${operationName} completed`, { duration });
    
    // Business metric para sócios
    if (operationName.includes('fetch')) {
      sanityLogger.business('Query Response Time', Math.round(duration), { period: 'current' });
    }
    
    return { ...result as any, duration };
  }).catch(error => {
    const duration = performance.now() - start;
    sanityLogger.error(`${operationName} failed after ${Math.round(duration)}ms`, { 
      error: error.message, 
      duration 
    });
    throw error;
  });
}