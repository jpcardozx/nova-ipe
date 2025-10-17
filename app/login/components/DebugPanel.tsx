/**
 * Debug Panel Component
 * Painel de debugging para erros de login (somente em dev mode)
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loginErrorHandler, type ErrorMetrics } from '../lib/error-handler-v2'

interface DebugPanelProps {
  enabled?: boolean
}

export function DebugPanel({ enabled = false }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [errorHistory, setErrorHistory] = useState<ErrorMetrics[]>([])
  const [stats, setStats] = useState<ReturnType<typeof loginErrorHandler.getStats>>()

  useEffect(() => {
    // Detectar modo debug
    const debugMode = 
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && localStorage.getItem('LOGIN_DEBUG_MODE') === 'true')
    
    setIsVisible(enabled && debugMode)

    // Atualizar stats a cada 2 segundos se visível
    if (debugMode) {
      const interval = setInterval(() => {
        setErrorHistory([...loginErrorHandler.getHistory()])
        setStats(loginErrorHandler.getStats())
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [enabled])

  // Toggle debug mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+D para toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        const newState = !isVisible
        setIsVisible(newState)
        loginErrorHandler.setDebugMode(newState)
        console.log(`[DebugPanel] Debug mode ${newState ? 'enabled' : 'disabled'}`)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={() => {
            setIsVisible(true)
            loginErrorHandler.setDebugMode(true)
          }}
          className="bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded backdrop-blur-sm
                     hover:bg-gray-800 hover:text-white transition-colors border border-gray-700"
          title="Ctrl+Shift+D para abrir"
        >
          🐛 Debug
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 max-h-[600px] z-[9999]
                 bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 
                 rounded-lg shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-4 py-3 border-b border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐛</span>
            <h3 className="text-sm font-bold text-amber-400">Login Debug Panel</h3>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              loginErrorHandler.setDebugMode(false)
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[520px] p-4 space-y-4">
        {/* Stats */}
        {stats && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <h4 className="text-xs font-semibold text-amber-400 mb-2">📊 Statistics</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Total Errors:</span>
                <span className="font-mono text-red-400">{stats.total}</span>
              </div>
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between text-[10px] pl-2">
                  <span className="text-gray-400">{category}:</span>
                  <span className="font-mono">{String(count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-amber-400">🔍 Error History</h4>
            {errorHistory.length > 0 && (
              <button
                onClick={() => {
                  loginErrorHandler.clearHistory()
                  setErrorHistory([])
                  setStats(loginErrorHandler.getStats())
                }}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {errorHistory.length === 0 ? (
            <div className="bg-gray-800/30 rounded p-3 text-center text-xs text-gray-500">
              No errors recorded
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {[...errorHistory].reverse().map((error, idx) => (
                <motion.div
                  key={error.errorId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800/50 rounded-lg p-2 border border-red-500/30 text-[10px]"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-mono text-red-400">{error.errorId}</span>
                    <span className="text-gray-500">
                      {new Date(error.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5 text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-semibold">{error.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{error.duration}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attempt:</span>
                      <span>#{error.attemptNumber}</span>
                    </div>
                    {error.loginMode && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mode:</span>
                        <span>{error.loginMode}</span>
                      </div>
                    )}
                    {error.userEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-mono">{error.userEmail}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <h4 className="text-xs font-semibold text-amber-400 mb-2">⚙️ Controls</h4>
          <div className="space-y-2 text-[10px] text-gray-400">
            <div>
              <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                Ctrl+Shift+D
              </kbd>
              <span className="ml-2">Toggle Debug Panel</span>
            </div>
            <div className="pt-2 border-t border-gray-700 space-y-1">
              <button
                onClick={() => {
                  console.clear()
                  console.log('[DebugPanel] Console cleared')
                }}
                className="w-full text-left px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 
                         text-gray-300 hover:text-white transition-colors"
              >
                Clear Console
              </button>
              <button
                onClick={() => {
                  const data = {
                    stats,
                    history: errorHistory,
                    timestamp: new Date().toISOString(),
                  }
                  const json = JSON.stringify(data, null, 2)
                  const blob = new Blob([json], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `login-debug-${Date.now()}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="w-full text-left px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 
                         text-gray-300 hover:text-white transition-colors"
              >
                Export Debug Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
