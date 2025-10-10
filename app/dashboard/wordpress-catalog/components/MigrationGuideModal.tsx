'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, CheckCircle, Upload, Globe, Lightbulb } from 'lucide-react'

interface MigrationGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MigrationGuideModal({ isOpen, onClose }: MigrationGuideModalProps) {
  const steps = [
    {
      icon: Eye,
      title: 'Revisar Imóvel',
      description: 'Confira se os dados do imóvel estão corretos: fotos, preço, endereço e descrição.',
      color: 'from-blue-500 to-blue-600',
      badge: 'Primeiro Passo'
    },
    {
      icon: CheckCircle,
      title: 'Aprovar para Publicação',
      description: 'Se estiver tudo certo, aprove o imóvel. Ele ficará pronto para ir ao site.',
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Segundo Passo'
    },
    {
      icon: Upload,
      title: 'Publicar no Site',
      description: 'Execute a publicação. O imóvel será transferido automaticamente para o site.',
      color: 'from-violet-500 to-violet-600',
      badge: 'Terceiro Passo'
    },
    {
      icon: Globe,
      title: 'Disponível Online',
      description: 'Pronto! O imóvel está publicado e visível para os clientes no site.',
      color: 'from-amber-500 to-amber-600',
      badge: 'Concluído'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container - Fixed overflow */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-6">
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Como Funciona
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">
                        Entenda o processo de publicação dos imóveis
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content - Fixed overflow */}
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                  {/* Steps */}
                  <div className="space-y-5">
                    {steps.map((step, idx) => {
                      const Icon = step.icon

                      return (
                        <motion.div
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          <div className="flex gap-4 items-start">
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                  {step.badge}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {step.title}
                              </h3>
                              <p className="text-slate-600 leading-relaxed text-sm">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          {/* Connector */}
                          {idx < steps.length - 1 && (
                            <div className="ml-7 mt-2 mb-0 w-0.5 h-4 bg-slate-200" />
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Tips Section */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-2 border-blue-200"
                  >
                    <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Dicas Importantes
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Use os botões coloridos acima para filtrar imóveis por situação</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Imóveis "Arquivados" foram removidos do sistema antigo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>As fotos são transferidas automaticamente durante a publicação</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-8 py-5 bg-slate-50">
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Entendi, vamos começar!
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
