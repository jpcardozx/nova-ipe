/**
 * Loading Overlay Otimizado
 * Componente extraído para reduzir bundle do login
 */

'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Loader2 } from '../lib/icons'

interface LoadingOverlayProps {
  message?: string
  currentStep?: number
}

const STEPS = [
  { label: 'Verificando', icon: '🔐' },
  { label: 'Autenticando', icon: '✓' },
  { label: 'Estabelecendo Sessão', icon: '🔒' },
  { label: 'Carregando', icon: '🚀' }
]

export function LoadingOverlay({ 
  message, 
  currentStep = 0 
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/[0.09] backdrop-blur-2xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-3 border-white/10"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-3 border-amber-400 border-t-transparent border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </motion.div>
          </div>
          
          <div className="text-center space-y-3 w-full">
            <p className="text-base sm:text-lg font-semibold text-white">
              {message || 'Autenticando...'}
            </p>
            
            {/* Steps Progress */}
            <div className="space-y-2 pt-2">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${isCurrent ? 'bg-amber-500/20 border border-amber-400/30' : ''}
                      ${isCompleted ? 'opacity-70' : ''}
                      ${isPending ? 'opacity-30' : ''}
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                      transition-all duration-300
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-amber-500 text-white animate-pulse' : ''}
                      ${isPending ? 'bg-white/10 text-white/40' : ''}
                    `}>
                      {isCompleted ? '✓' : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (index + 1)}
                    </div>
                    
                    <span className={`
                      text-xs sm:text-sm font-medium
                      ${isCurrent || isCompleted ? 'text-white' : 'text-white/40'}
                    `}>
                      {step.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
            
            <p className="text-xs text-white/60 mt-3">
              Aguarde enquanto processamos sua solicitação
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
