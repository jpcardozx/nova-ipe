/**
 * 🔐 AUTH LOADING OVERLAY - Professional Grade
 *
 * Features:
 * - Step-by-step progress visualization
 * - Real-time error handling
 * - Accessibility (ARIA, keyboard navigation, screen readers)
 * - Microinteractions & haptic feedback
 * - Responsive design (mobile-first)
 * - Performance optimized (GPU acceleration)
 *
 * @version 2.0
 * @professional-grade
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, Shield, Database, UserCheck } from 'lucide-react'
import { useEffect } from 'react'

export type AuthStep = {
  id: string
  label: string
  status: 'pending' | 'loading' | 'success' | 'error'
  icon: React.ReactNode
  errorMessage?: string
}

export interface AuthLoadingOverlayProps {
  visible: boolean
  steps: AuthStep[]
  currentStepIndex: number
  onClose?: () => void
}

export function AuthLoadingOverlay({
  visible,
  steps,
  currentStepIndex,
  onClose,
}: AuthLoadingOverlayProps) {
  const currentStep = steps[currentStepIndex]
  const hasError = steps.some(step => step.status === 'error')
  const allSuccess = steps.every(step => step.status === 'success')

  // ============================================================================
  // ACCESSIBILITY & HAPTIC FEEDBACK
  // ============================================================================

  useEffect(() => {
    if (!visible) return

    // Prevent body scroll quando modal está aberto
    document.body.style.overflow = 'hidden'

    // Anunciar para screen readers
    const message = hasError
      ? 'Erro na autenticação. Verifique os detalhes.'
      : allSuccess
      ? 'Autenticado com sucesso! Redirecionando...'
      : `Autenticando. Etapa ${currentStepIndex + 1} de ${steps.length}.`

    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)

    // Haptic feedback (mobile)
    if ('vibrate' in navigator && hasError) {
      navigator.vibrate([50, 100, 50]) // Padrão de erro
    } else if ('vibrate' in navigator && allSuccess) {
      navigator.vibrate(200) // Vibração de sucesso
    }

    return () => {
      document.body.style.overflow = ''
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement)
      }
    }
  }, [visible, hasError, allSuccess, currentStepIndex, steps.length])

  // Keyboard navigation (ESC para fechar em caso de erro)
  useEffect(() => {
    if (!visible || !hasError || !onClose) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [visible, hasError, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-overlay-title"
          aria-describedby="auth-overlay-description"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md mx-4"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)',
              borderRadius: '24px',
              border: '1px solid rgba(226,232,240,0.6)',
            }}
          >
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: hasError
                      ? 'linear-gradient(135deg, rgb(239,68,68) 0%, rgb(220,38,38) 100%)'
                      : allSuccess
                      ? 'linear-gradient(135deg, rgb(34,197,94) 0%, rgb(22,163,74) 100%)'
                      : 'linear-gradient(135deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)',
                    boxShadow: hasError
                      ? '0 4px 16px rgba(239,68,68,0.4)'
                      : allSuccess
                      ? '0 4px 16px rgba(34,197,94,0.4)'
                      : '0 4px 16px rgba(245,158,11,0.4)',
                  }}
                  animate={hasError ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, -10, 10, 0],
                  } : allSuccess ? {
                    scale: [1, 1.15, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {hasError ? (
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : allSuccess ? (
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h2
                    id="auth-overlay-title"
                    className="text-lg sm:text-xl font-bold text-slate-900 truncate"
                  >
                    {hasError
                      ? 'Erro na Autenticação'
                      : allSuccess
                      ? 'Autenticado com Sucesso!'
                      : 'Autenticando...'}
                  </h2>
                  <p
                    id="auth-overlay-description"
                    className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate"
                  >
                    {hasError
                      ? 'Verifique os detalhes abaixo'
                      : allSuccess
                      ? 'Redirecionando você agora'
                      : `Etapa ${currentStepIndex + 1} de ${steps.length}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div
              className="px-6 sm:px-8 py-5 sm:py-6 space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[400px] overflow-y-auto overscroll-contain"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(203,213,225,0.5) transparent',
              }}
            >
              {steps.map((step, index) => {
                const isPast = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                const isFuture = index > currentStepIndex

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className="absolute left-5 top-12 w-0.5 h-8 -mb-4"
                        style={{
                          background:
                            step.status === 'success' || isPast
                              ? 'linear-gradient(180deg, rgb(34,197,94) 0%, rgb(22,163,74) 100%)'
                              : step.status === 'error'
                              ? 'linear-gradient(180deg, rgb(239,68,68) 0%, rgb(220,38,38) 100%)'
                              : 'rgb(226,232,240)',
                        }}
                      />
                    )}

                    {/* Step Content */}
                    <div
                      className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300"
                      style={{
                        background:
                          isCurrent || step.status === 'error'
                            ? 'linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.85) 100%)'
                            : 'transparent',
                        border: isCurrent || step.status === 'error' ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                        style={{
                          background:
                            step.status === 'success'
                              ? 'linear-gradient(135deg, rgb(34,197,94) 0%, rgb(22,163,74) 100%)'
                              : step.status === 'error'
                              ? 'linear-gradient(135deg, rgb(239,68,68) 0%, rgb(220,38,38) 100%)'
                              : step.status === 'loading'
                              ? 'linear-gradient(135deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)'
                              : 'rgba(226,232,240,0.6)',
                          boxShadow:
                            step.status === 'success'
                              ? '0 4px 12px rgba(34,197,94,0.3)'
                              : step.status === 'error'
                              ? '0 4px 12px rgba(239,68,68,0.3)'
                              : step.status === 'loading'
                              ? '0 4px 12px rgba(245,158,11,0.3)'
                              : 'none',
                        }}
                      >
                        {step.status === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : step.status === 'error' ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : step.status === 'loading' ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <div className="w-5 h-5 text-slate-400">{step.icon}</div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold transition-colors duration-300"
                          style={{
                            color:
                              step.status === 'error'
                                ? 'rgb(220,38,38)'
                                : step.status === 'success'
                                ? 'rgb(22,163,74)'
                                : isCurrent
                                ? 'rgb(51,65,85)'
                                : 'rgb(148,163,184)',
                          }}
                        >
                          {step.label}
                        </p>

                        {/* Error Message */}
                        {step.status === 'error' && step.errorMessage && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-700 mt-1 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                          >
                            {step.errorMessage}
                          </motion.p>
                        )}

                        {/* Loading Indicator */}
                        {step.status === 'loading' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2"
                          >
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: 'linear-gradient(90deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)',
                                }}
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer */}
            {(hasError || allSuccess) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 sm:px-8 py-5 sm:py-6 border-t border-slate-200/60"
              >
                {hasError && onClose && (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-xl text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300/50"
                    style={{
                      background: 'linear-gradient(135deg, rgb(239,68,68) 0%, rgb(220,38,38) 100%)',
                      boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                    }}
                    aria-label="Fechar e tentar novamente"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Tentar Novamente</span>
                      <span className="text-xs opacity-70">(ESC)</span>
                    </span>
                  </motion.button>
                )}

                {allSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-sm sm:text-base text-slate-600"
                  >
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="font-medium">Redirecionando...</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============= DEFAULT STEPS TEMPLATE =============

export const DEFAULT_AUTH_STEPS: AuthStep[] = [
  {
    id: 'credentials',
    label: 'Verificando credenciais',
    status: 'pending',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'session',
    label: 'Estabelecendo sessão segura',
    status: 'pending',
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 'permissions',
    label: 'Verificando permissões',
    status: 'pending',
    icon: <UserCheck className="w-5 h-5" />,
  },
]
