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
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-20 shadow-sm dark:shadow-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-slate-200 dark:bg-gray-800 rounded-2xl" />
            <div className="flex-1">
              <div className="h-8 bg-slate-200 dark:bg-gray-800 rounded-lg w-64 mb-2" />
              <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded w-48" />
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
        className="border-b border-slate-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-20 shadow-sm dark:shadow-gray-950/50"
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
                  <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Catálogo WordPress
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1">
                    Gestão de imóveis importados
                  </p>
                </div>

                {/* Help Button - Dark Mode */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGuide(true)}
                  className="p-2.5 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl transition-all group border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600"
                  title="Como funciona esta página?"
                >
                  <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="flex items-center gap-4">
              {/* Total Fichas - Dark Mode Elegante */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-gray-700 shadow-md dark:shadow-gray-950/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-gray-600 dark:to-gray-800 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-slate-700 to-slate-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                      {stats.total}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                      Total de Fichas
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ready to Migrate - Dark Mode Elegante */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 px-6 py-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/50 shadow-md dark:shadow-emerald-900/30 hover:shadow-xl dark:hover:shadow-emerald-900/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-xl shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      {stats.ready_to_migrate}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
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
