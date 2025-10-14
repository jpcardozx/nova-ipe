/**
 * Alert Components Otimizados
 * Extraídos para melhor modularização
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from '../lib/icons'

interface DetailedErrorAlertProps {
  error: {
    title: string
    message: string
    technical?: string
  }
}

export function DetailedErrorAlert({ error }: DetailedErrorAlertProps) {
  const [showTechnical, setShowTechnical] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className="bg-red-500/15 border-2 border-red-400/40 backdrop-blur-xl rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-300" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-sm font-bold text-red-200">
              {error.title}
            </h3>
            <p className="text-sm text-red-100/90 mt-1">
              {error.message}
            </p>
          </div>
          
          {error.technical && (
            <div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-xs text-red-300/70 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                {showTechnical ? '▼' : '▶'} Detalhes técnicos
              </button>
              
              <AnimatePresence>
                {showTechnical && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-2 bg-black/30 rounded border border-red-400/20"
                  >
                    <code className="text-xs text-red-200/80 font-mono break-all">
                      {error.technical}
                    </code>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface AlertProps {
  type: 'error' | 'success' | 'info'
  message: string
}

export function Alert({ type, message }: AlertProps) {
  const config = {
    error: {
      bg: 'bg-red-500/15 border-red-400/40 backdrop-blur-xl',
      text: 'text-red-200',
      icon: <AlertCircle className="w-4 h-4 text-red-300" />
    },
    success: {
      bg: 'bg-green-500/15 border-green-400/40 backdrop-blur-xl',
      text: 'text-green-200',
      icon: <CheckCircle2 className="w-4 h-4 text-green-300" />
    },
    info: {
      bg: 'bg-blue-500/15 border-blue-400/40 backdrop-blur-xl',
      text: 'text-blue-200',
      icon: <AlertCircle className="w-4 h-4 text-blue-300" />
    }
  }

  const settings = config[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${settings.bg} border-2 rounded-xl p-3 flex items-center gap-3`}
    >
      <div className="flex-shrink-0">
        {settings.icon}
      </div>
      <p className={`text-sm ${settings.text}`}>
        {message}
      </p>
    </motion.div>
  )
}
