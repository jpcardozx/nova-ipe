// Loading States - IPÊ Imóveis Dashboard
// Componentes de loading padronizados e acessíveis

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from './components'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={cn('animate-spin text-primary-600', sizes[size], className)} />
  )
}

interface LoadingStateProps {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  title = 'Carregando...', 
  description, 
  size = 'md', 
  className 
}: LoadingStateProps) {
  const containerSizes = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }

  const spinnerSizes = {
    sm: 'sm',
    md: 'md', 
    lg: 'lg'
  } as const

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      containerSizes[size],
      className
    )}>
      <LoadingSpinner size={spinnerSizes[size]} className="mb-4" />
      <h3 className="font-medium text-neutral-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500">{description}</p>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  visible: boolean
  title?: string
  description?: string
  className?: string
}

export function LoadingOverlay({ 
  visible, 
  title = 'Carregando...', 
  description,
  className 
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10',
        className
      )}
    >
      <div className="text-center">
        <LoadingSpinner className="mb-4" />
        <h3 className="font-medium text-neutral-900 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

// Loading específico para métricas do dashboard
interface MetricsLoadingProps {
  count?: number
  className?: string
}

export function MetricsLoading({ count = 4, className }: MetricsLoadingProps) {
  return (
    <div className={cn(
      'grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-md border border-neutral-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

// Loading para listas (tabelas, cards, etc)
interface ListLoadingProps {
  rows?: number
  variant?: 'table' | 'cards' | 'list'
  className?: string
}

export function ListLoading({ rows = 5, variant = 'list', className }: ListLoadingProps) {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-md border border-neutral-200 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  // variant === 'list' (default)
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

// Loading inline para ações (botões, inputs, etc)
interface InlineLoadingProps {
  size?: 'sm' | 'md'
  text?: string
  className?: string
}

export function InlineLoading({ size = 'sm', text = 'Carregando...', className }: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2 text-neutral-600', className)}>
      <LoadingSpinner size={size} />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Loading com progresso (para uploads, processamentos, etc)
interface ProgressLoadingProps {
  progress?: number
  title?: string
  description?: string
  className?: string
}

export function ProgressLoading({ 
  progress = 0, 
  title = 'Processando...', 
  description,
  className 
}: ProgressLoadingProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      <LoadingSpinner className="mb-4" />
      <h3 className="font-medium text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 mb-4">{description}</p>
      )}
      <div className="max-w-xs mx-auto">
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-1">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

// Hook para gerenciar estados de loading
export function useLoadingState() {
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const startLoading = React.useCallback(() => setLoading(true), [])
  const stopLoading = React.useCallback(() => setLoading(false), [])
  const updateProgress = React.useCallback((value: number) => setProgress(Math.max(0, Math.min(100, value))), [])

  return {
    loading,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    setLoading
  }
}