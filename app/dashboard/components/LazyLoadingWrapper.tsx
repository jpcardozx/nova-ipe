/**
 * Dashboard Lazy Loading Wrapper
 * HOC para carregar módulos pesados do dashboard sob demanda
 * 
 * @example
 * const LazyPropertiesPage = withDashboardLazyLoading(() => import('./properties/page'))
 */

import { lazy, Suspense, ComponentType } from 'react'
import { motion } from 'framer-motion'

interface LazyLoadingProps {
  fallbackText?: string
  minHeight?: string
}

/**
 * Skeleton Loader genérico para páginas do dashboard
 */
export function DashboardPageSkeleton({ 
  fallbackText = 'Carregando módulo...', 
  minHeight = 'min-h-screen' 
}: LazyLoadingProps) {
  return (
    <div className={`${minHeight} bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30 p-6`}>
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="h-10 w-64 bg-slate-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-gray-700 rounded animate-pulse" />
      </motion.div>

      {/* Content Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-64 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-800 rounded-xl animate-pulse"
          >
            <div className="p-6 space-y-4">
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-full bg-slate-100 dark:bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 dark:bg-gray-700 rounded" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-8 right-8 bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-800 rounded-xl shadow-xl px-6 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
            {fallbackText}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Skeleton para cards/grids
 */
export function DashboardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-2xl border-2 border-slate-200 dark:border-gray-700"
        />
      ))}
    </div>
  )
}

/**
 * Skeleton para modais
 */
export function DashboardModalSkeleton({ title = 'Carregando...' }: { title?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4"
      >
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
            <div className="h-8 w-64 bg-slate-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-8 bg-slate-100 dark:bg-gray-700 rounded-full" />
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-100 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 dark:bg-gray-700 rounded" />
            <div className="h-4 w-4/6 bg-slate-100 dark:bg-gray-700 rounded" />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-24 bg-slate-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-10 w-24 bg-slate-100 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <span className="text-sm text-slate-500 dark:text-gray-400">{title}</span>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * HOC para lazy loading de componentes
 */
export function withDashboardLazyLoading<P extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallbackProps?: LazyLoadingProps
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={<DashboardPageSkeleton {...fallbackProps} />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}

/**
 * Hook para pre-load de módulos (prefetch)
 */
export function usePrefetchModule(importFunc: () => Promise<any>) {
  const prefetch = () => {
    // Apenas carrega o módulo, não renderiza
    importFunc().catch(() => {
      // Silenciosamente falha se não conseguir carregar
    })
  }
  
  return { prefetch }
}
