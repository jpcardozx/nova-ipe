/**
 * 🎨 Empty State - Professional UI Component
 * Estados vazios com ilustrações e CTAs
 */

'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-16',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-24',
      icon: 'w-24 h-24',
      title: 'text-2xl',
      description: 'text-lg',
    },
  }

  const sizeClasses = sizes[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses.container,
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl" />
            
            {/* Icon container */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-full p-6 border border-amber-200/50 dark:border-amber-800/50">
              <Icon className={cn(sizeClasses.icon, 'text-amber-600 dark:text-amber-400')} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          'font-semibold text-gray-900 dark:text-white mb-2',
          sizeClasses.title
        )}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={cn(
            'text-gray-600 dark:text-gray-400 max-w-md',
            sizeClasses.description
          )}
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'lg' ? 'lg' : 'default'}
              className="min-w-[140px]"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={size === 'lg' ? 'lg' : 'default'}
              className="min-w-[140px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================================================
// VARIANTS
// ============================================================================

export function EmptyStateNoResults({
  searchTerm,
  onClear,
}: {
  searchTerm?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      title="Nenhum resultado encontrado"
      description={
        searchTerm
          ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
          : 'Não encontramos nenhum resultado. Tente usar filtros diferentes.'
      }
      action={
        onClear
          ? {
              label: 'Limpar busca',
              onClick: onClear,
              variant: 'outline',
            }
          : undefined
      }
      size="md"
    />
  )
}

export function EmptyStateError({
  title = 'Algo deu errado',
  description = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: 'Tentar novamente',
              onClick: onRetry,
            }
          : undefined
      }
      size="md"
    />
  )
}
