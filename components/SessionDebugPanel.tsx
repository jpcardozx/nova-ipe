/**
 * 🐛 Session Debug Panel - Component para debugging visual
 * 
 * Exibe estado da sessão, trace ID e event log em tempo real
 * Apenas visível em desenvolvimento
 * 
 * Data: 13 de outubro de 2025
 */

'use client'

import { useState } from 'react'
import { useSession } from '@/lib/hooks/useSession'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react'

export function SessionDebugPanel() {
  const { session, isAuthenticated, isLoading, getDebugInfo, getEventLog, clearEventLog } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [showEventLog, setShowEventLog] = useState(false)

  // Apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para clipboard!')
  }

  const exportDebug = () => {
    const debugInfo = getDebugInfo()
    const json = JSON.stringify(debugInfo, null, 2)
    copyToClipboard(json)
  }

  const eventLog = getEventLog()

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
        title="Session Debug Panel"
      >
        <Bug className="w-5 h-5" />
        {isOpen && <X className="w-4 h-4" />}
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] bg-gray-900 text-gray-100 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                <h3 className="font-bold">Session Debug</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-purple-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Status */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-2">STATUS</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">State:</span>
                    <span
                      className={`font-mono px-2 py-0.5 rounded ${
                        session.state === 'authenticated'
                          ? 'bg-green-900 text-green-300'
                          : session.state === 'authenticating'
                          ? 'bg-yellow-900 text-yellow-300'
                          : session.state === 'error'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {session.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Authenticated:</span>
                    <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                      {isAuthenticated ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loading:</span>
                    <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
                      {isLoading ? '⟳ Yes' : '✓ No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-2">USER</h4>
                {session.user ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400">Email:</span>
                      <span className="font-mono text-xs text-right">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Role:</span>
                      <span className="font-mono text-xs">{session.user.role}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400">ID:</span>
                      <span className="font-mono text-xs text-right truncate max-w-[200px]">
                        {session.user.id}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No user</p>
                )}
              </div>

              {/* Trace ID */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-2">TRACE ID</h4>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                    {session.traceId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(session.traceId)}
                    className="hover:bg-gray-700 p-1 rounded"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Error */}
              {session.error && (
                <div>
                  <h4 className="text-xs font-bold text-red-400 mb-2">ERROR</h4>
                  <div className="bg-red-900/20 border border-red-700 rounded p-2 text-xs text-red-300">
                    {session.error}
                  </div>
                </div>
              )}

              {/* Event Log */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-400">
                    EVENT LOG ({eventLog.length})
                  </h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowEventLog(!showEventLog)}
                      className="hover:bg-gray-700 p-1 rounded"
                      title="Toggle"
                    >
                      {showEventLog ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={clearEventLog}
                      className="hover:bg-gray-700 p-1 rounded text-red-400"
                      title="Clear"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {showEventLog && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {eventLog.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No events yet</p>
                    ) : (
                      eventLog.slice().reverse().map((event, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 rounded p-2 text-xs space-y-1"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-purple-400">{event.event}</span>
                            <span className="text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {Object.keys(event.data).length > 0 && (
                            <pre className="text-gray-400 overflow-x-auto">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-700 p-3 flex gap-2">
              <button
                onClick={exportDebug}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Export Debug Info
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
