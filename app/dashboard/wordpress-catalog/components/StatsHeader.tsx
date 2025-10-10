'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, HelpCircle, TrendingUp, CheckCircle2 } from 'lucide-react'
import { MigrationGuideModal } from './MigrationGuideModal'

interface StatsHeaderProps {
  stats: {
    total: number
    ready_to_migrate: number
    by_status: Record<string, number>
  } | null
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  const [showGuide, setShowGuide] = useState(false)

  if (!stats) {
    return (
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded-lg w-64 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Title with Help */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-xl"
              >
                <Database className="w-8 h-8 text-white" />
              </motion.div>

              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Catálogo WordPress
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Gestão de imóveis importados
                  </p>
                </div>

                {/* Help Button - Fixed: botão clicável direto */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGuide(true)}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all group border-2 border-amber-200 hover:border-amber-400"
                  title="Como funciona esta página?"
                >
                  <HelpCircle className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="flex items-center gap-4">
              {/* Total Fichas */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                      {stats.total}
                    </div>
                    <div className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-0.5">
                      Total de Fichas
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ready to Migrate */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-4 rounded-2xl border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {stats.ready_to_migrate}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-0.5">
                      Prontas p/ Publicar
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Migration Guide Modal */}
      <MigrationGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  )
}
