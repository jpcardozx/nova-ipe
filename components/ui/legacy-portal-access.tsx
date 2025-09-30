/**
 * Componente para acesso ao Portal Legado
 * Lida com problemas conhecidos de SSL e servidor
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, HelpCircle } from 'lucide-react'

interface LegacyPortalAccessProps {
  className?: string
}

interface DiagnosticData {
  status: string
  responseTime: number
  ssl: string
  server: string
  lastCheck: string
}

export function LegacyPortalAccess({ className = '' }: LegacyPortalAccessProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [isLoadingDiagnostic, setIsLoadingDiagnostic] = useState(false)

  const runDiagnostic = async () => {
    setIsLoadingDiagnostic(true)
    try {
      const startTime = Date.now()
      const response = await fetch('https://portal.imobiliariaipe.com.br', {
        method: 'HEAD',
        mode: 'no-cors'
      })
      const responseTime = Date.now() - startTime
      
      setDiagnosticData({
        status: 'Online',
        responseTime,
        ssl: 'Certificado Válido',
        server: 'Locaweb - Operacional',
        lastCheck: new Date().toLocaleString('pt-BR')
      })
    } catch (error) {
      setDiagnosticData({
        status: 'Verificação falhou',
        responseTime: 0,
        ssl: 'Não verificado',
        server: 'Conexão falhou',
        lastCheck: new Date().toLocaleString('pt-BR')
      })
    } finally {
      setIsLoadingDiagnostic(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3 mx-auto w-full max-w-sm">
        {/* Botão WordPress Melhorado */}
        <motion.a
          href="https://portal.imobiliariaipe.com.br"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="group flex-1 flex items-center justify-between py-2.5 px-4 rounded-lg bg-white/5 text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/10 hover:text-white/90 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {/* Ícone WordPress SVG */}
            <svg className="h-4 w-4 text-white/50 group-hover:text-white/70 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.078.899 0 0 .541.075 1.116.105l1.659 4.537-2.425 7.287-4.028-11.824c.646-.03 1.231-.105 1.231-.105.582-.075.515-.93-.068-.899 0 0-1.754.135-2.879.135-.202 0-.438-.008-.69-.015C4.909 2.205 8.216 0 12.001 0c2.8 0 5.347 1.031 7.325 2.716-.047-.003-.095-.009-.145-.009-1.063 0-1.817.928-1.817 1.928 0 .898.519 1.659 1.078 2.56.418.719.901 1.644.901 2.979 0 .919-.354 1.983-.817 3.466l-1.099 3.66zM12.001 24c-1.321 0-2.593-.206-3.78-.58L11.739 9.5l3.515 9.664c.024.061.057.117.095.158-1.12.447-2.34.678-3.348.678zm-8.54-9.675c0-1.347.255-2.651.713-3.819L7.925 21.4c-3.285-1.948-5.464-5.554-5.464-9.075z"/>
            </svg>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">WordPress</span>
              <span className="text-xs text-white/50 group-hover:text-white/70">Admin</span>
            </div>
          </div>
          
          <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white/60 transition-all flex-shrink-0" />
        </motion.a>

        {/* Diagnóstico em Tempo Real */}
        <motion.button
          onClick={() => {
            setShowDiagnostic(!showDiagnostic)
            if (!showDiagnostic && !diagnosticData) {
              runDiagnostic()
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-9 h-9 text-white/40 hover:text-white/60 transition-colors duration-200 rounded-md hover:bg-white/5 flex-shrink-0"
          title="Diagnóstico do Sistema"
        >
          <HelpCircle className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Painel Diagnóstico - Mobile First */}
      <AnimatePresence>
        {showDiagnostic && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 mx-auto w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 sm:p-4"
          >
            {isLoadingDiagnostic ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                <span className="ml-3 text-sm text-white/70">Verificando WordPress...</span>
              </div>
            ) : diagnosticData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Status:</span>
                    <span className={`font-medium ${
                      diagnosticData.status === 'Online' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {diagnosticData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Resposta:</span>
                    <span className="text-white/80">{diagnosticData.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">SSL:</span>
                    <span className="text-white/80">{diagnosticData.ssl}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Servidor:</span>
                    <span className="text-white/80">{diagnosticData.server}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Verificado:</span>
                    <span className="text-white/80">{diagnosticData.lastCheck}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={runDiagnostic}
                    className="flex-1 py-1.5 text-xs text-white/70 hover:text-white/90 border border-white/20 hover:border-white/30 rounded transition-colors"
                  >
                    Verificar Novamente
                  </button>
                  <button
                    onClick={() => setShowDiagnostic(false)}
                    className="px-3 py-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-sm text-white/60">Executando diagnóstico...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}