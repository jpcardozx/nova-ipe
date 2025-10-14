/**
 * 🎨 Toast Notification System - Enterprise Grade
 * Sistema de notificações profissional com animações e acessibilidade
 */

'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// ============================================================================
// PROVIDER
// ============================================================================

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  // ✅ Garantir hydration antes de renderizar ToastContainer
  useEffect(() => {
    setMounted(true)
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss
    if (newToast.duration) {
      setTimeout(() => {
        dismissToast(id)
      }, newToast.duration)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* ✅ Apenas renderizar após hydration para evitar mismatch */}
      {mounted && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </ToastContext.Provider>
  )
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div
      className="fixed top-0 right-0 z-[9999] p-4 space-y-4 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// TOAST ITEM
// ============================================================================

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!toast.duration) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (toast.duration! / 100))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [toast.duration])

  const config = getToastConfig(toast.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="pointer-events-auto w-full max-w-md"
    >
      <div
        className={`relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-xl ${config.colors}`}
        role="alert"
        aria-labelledby={`toast-title-${toast.id}`}
        aria-describedby={toast.message ? `toast-desc-${toast.id}` : undefined}
      >
        {/* Progress bar */}
        {toast.duration && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
            <motion.div
              className={config.progressColor}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                id={`toast-title-${toast.id}`}
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {toast.title}
              </h3>
              {toast.message && (
                <p
                  id={`toast-desc-${toast.id}`}
                  className="mt-1 text-sm text-gray-600 dark:text-gray-300"
                >
                  {toast.message}
                </p>
              )}
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action!.onClick()
                    onDismiss(toast.id)
                  }}
                  className={`mt-2 text-sm font-medium ${config.actionColor} hover:underline`}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// CONFIG
// ============================================================================

function getToastConfig(type: ToastType) {
  const configs = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      colors: 'bg-green-50/95 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      progressColor: 'h-full bg-green-600 dark:bg-green-400',
      actionColor: 'text-green-700 dark:text-green-400',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5" />,
      colors: 'bg-red-50/95 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      progressColor: 'h-full bg-red-600 dark:bg-red-400',
      actionColor: 'text-red-700 dark:text-red-400',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      colors: 'bg-amber-50/95 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      progressColor: 'h-full bg-amber-600 dark:bg-amber-400',
      actionColor: 'text-amber-700 dark:text-amber-400',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      colors: 'bg-blue-50/95 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      progressColor: 'h-full bg-blue-600 dark:bg-blue-400',
      actionColor: 'text-blue-700 dark:text-blue-400',
    },
  }

  return configs[type]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const toast = {
  success: (title: string, message?: string, action?: Toast['action']) => {
    // This will be replaced by context hook
    console.log('Toast success:', title, message)
  },
  error: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Toast error:', title, message)
  },
  warning: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Toast warning:', title, message)
  },
  info: (title: string, message?: string, action?: Toast['action']) => {
    console.log('Toast info:', title, message)
  },
}
