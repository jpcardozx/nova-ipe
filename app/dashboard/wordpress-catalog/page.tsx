'use client'

import { useState, lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { dashboardApi } from '@/lib/utils/authenticated-fetch'
import { StatsHeader } from './components/StatsHeader'

// ⚡ Lazy Loading: Componentes pesados carregam sob demanda
const PropertiesGrid = lazy(() => import('./components/PropertiesGrid').then(mod => ({ default: mod.PropertiesGrid })))
const PropertyDetailModal = lazy(() => import('./components/PropertyDetailModal').then(mod => ({ default: mod.PropertyDetailModal })))

const STATUS_FILTERS = [
  { value: 'pending', label: 'Aguardando', color: 'from-amber-500 to-amber-600', icon: '⏳' },
  { value: 'reviewing', label: 'Em Análise', color: 'from-blue-500 to-blue-600', icon: '👁️' },
  { value: 'approved', label: 'Aprovados', color: 'from-emerald-500 to-emerald-600', icon: '✓' },
  { value: 'migrated', label: 'Publicados', color: 'from-violet-500 to-violet-600', icon: '✨' },
  { value: 'archived', label: 'Arquivados', color: 'from-slate-400 to-slate-500', icon: '📦' },
] as const

export default function WordPressCatalogPage() {
  const [statusFilter, setStatusFilter] = useState<WordPressPropertyRecord['status'] | 'archived' | null>('pending')
  const [page, setPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<WordPressPropertyRecord | null>(null)

  // Stats Query
  const { data: stats, error: statsError } = useQuery({
    queryKey: ['wordpress-stats'],
    queryFn: async () => {
      const result = await dashboardApi.getStats()
      return result
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  })

  // Properties Query
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError
  } = useQuery({
    queryKey: ['wordpress-properties', statusFilter, page],
    queryFn: async () => {
      const result = await dashboardApi.getProperties({
        status: statusFilter || undefined,
        page,
        limit: 30
      })
      return result
    },
    staleTime: 10000,
    refetchOnWindowFocus: false
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Header with Stats */}
      <StatsHeader stats={stats || null} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters - Dark Mode Elegante */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {/* Botão "Todos" */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setStatusFilter(null)
                setPage(1)
              }}
              className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                statusFilter === null
                  ? 'bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-gray-900 shadow-lg shadow-slate-500/20 dark:shadow-slate-100/20'
                  : 'bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:border-slate-400 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-gray-700/50'
              }`}
            >
              <span className="mr-2">📋</span>
              Todos <span className="ml-1 text-sm opacity-80">({stats?.total || 0})</span>
            </motion.button>

            {/* Filtros por Status */}
            {STATUS_FILTERS.map((filter) => {
              const count = stats?.by_status[filter.value] || 0
              const isActive = statusFilter === filter.value

              return (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStatusFilter(filter.value)
                    setPage(1)
                  }}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg shadow-${filter.color.split('-')[1]}-500/30 dark:shadow-${filter.color.split('-')[1]}-500/20`
                      : 'bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 hover:border-slate-400 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-gray-700/50'
                  }`}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.label} <span className="ml-1 text-sm opacity-80">({count})</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Error Display */}
        {(statsError || propertiesError) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/50 rounded-2xl backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Erro ao carregar dados
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm font-mono">
              {statsError instanceof Error ? `Stats: ${statsError.message}` : ''}
              {propertiesError instanceof Error ? `Properties: ${propertiesError.message}` : ''}
            </p>
          </motion.div>
        )}

        {/* Properties Grid - Lazy Loaded */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-2xl border-2 border-slate-200 dark:border-gray-700"
              />
            ))}
          </div>
        }>
          <PropertiesGrid
            properties={propertiesData?.properties || []}
            isLoading={propertiesLoading}
            onPropertyClick={(property) => setSelectedProperty(property)}
          />
        </Suspense>

        {/* Pagination */}
        {propertiesData && propertiesData.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl">
              <span className="text-sm text-slate-600 dark:text-gray-300 font-semibold">
                Página {page} de {propertiesData.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              disabled={page === propertiesData.totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>

      {/* Property Detail Modal - Lazy Loaded */}
      {selectedProperty && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-64 bg-slate-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-48 bg-slate-100 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        }>
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        </Suspense>
      )}
    </div>
  )
}
