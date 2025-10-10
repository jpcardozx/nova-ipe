'use client'

import { motion } from 'framer-motion'
import { Clock, Eye, CheckCircle2, Sparkles, XCircle, Archive, LayoutGrid } from 'lucide-react'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'

// 🎨 Color scheme moderno e profissional
const statusConfig = {
  pending: {
    label: 'Aguardando Revisão',
    color: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: Clock,
    gradient: 'from-amber-500 to-orange-600',
    activeGradient: 'from-amber-50 to-orange-50',
    count: 0
  },
  reviewing: {
    label: 'Em Análise',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: Eye,
    gradient: 'from-blue-500 to-indigo-600',
    activeGradient: 'from-blue-50 to-indigo-50',
    count: 0
  },
  approved: {
    label: 'Aprovado',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-teal-600',
    activeGradient: 'from-emerald-50 to-teal-50',
    count: 0
  },
  migrated: {
    label: 'Publicado',
    color: 'bg-violet-50 text-violet-900 border-violet-200',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    activeGradient: 'from-violet-50 to-purple-50',
    count: 0
  },
  rejected: {
    label: 'Descartado',
    color: 'bg-rose-50 text-rose-900 border-rose-200',
    icon: XCircle,
    gradient: 'from-rose-500 to-red-600',
    activeGradient: 'from-rose-50 to-red-50',
    count: 0
  },
  archived: {
    label: 'Arquivado',
    color: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: Archive,
    gradient: 'from-slate-400 to-slate-500',
    activeGradient: 'from-slate-50 to-slate-100',
    count: 0
  },
}

interface StatusPillsProps {
  stats: {
    by_status: Record<string, number>
  } | null
  activeStatus: WordPressPropertyRecord['status'] | 'all'
  onStatusChange: (status: WordPressPropertyRecord['status'] | 'all') => void
}

export function StatusPills({ stats, activeStatus, onStatusChange }: StatusPillsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 animate-pulse">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    )
  }

  const totalCount = Object.values(stats.by_status).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
      {/* Botão "Todos" */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => onStatusChange('all')}
        className={`relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-300 ${
          activeStatus === 'all'
            ? 'border-slate-900 bg-gradient-to-br from-slate-900 to-slate-700 shadow-xl shadow-slate-200'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
        }`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-xl ${activeStatus === 'all' ? 'bg-white/20' : 'bg-slate-100'}`}>
              <LayoutGrid className={`w-4 h-4 ${activeStatus === 'all' ? 'text-white' : 'text-slate-600'}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${activeStatus === 'all' ? 'text-white' : 'text-slate-500'}`}>
              Todos
            </span>
          </div>
          <div className={`text-3xl font-black ${activeStatus === 'all' ? 'text-white' : 'text-slate-900'}`}>
            {totalCount}
          </div>
        </div>
      </motion.button>

      {/* Status Pills */}
      {Object.entries(stats.by_status).map(([status, count], idx) => {
        const config = statusConfig[status as keyof typeof statusConfig]
        if (!config) return null

        const Icon = config.icon
        const isActive = activeStatus === status

        return (
          <motion.button
            key={status}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: (idx + 1) * 0.05 }}
            onClick={() => onStatusChange(status as WordPressPropertyRecord['status'])}
            className={`relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-300 ${
              isActive
                ? `border-transparent bg-gradient-to-br ${config.gradient} shadow-xl`
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-gradient-to-br ' + config.gradient}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white'}`} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {config.label}
                </span>
              </div>
              <div className={`text-3xl font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {count}
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
