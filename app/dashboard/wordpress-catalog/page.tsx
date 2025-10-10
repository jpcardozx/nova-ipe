'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { dashboardApi } from '@/lib/utils/authenticated-fetch'
import { StatsHeader } from './components/StatsHeader'
import { PropertiesGrid } from './components/PropertiesGrid'
import { PropertyDetailModal } from './components/PropertyDetailModal'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header with Stats */}
      <StatsHeader stats={stats || null} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters - Melhorado */}
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
                  ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400'
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
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400'
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
            className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Erro ao carregar dados
            </h3>
            <p className="text-red-600 text-sm font-mono">
              {statsError instanceof Error ? `Stats: ${statsError.message}` : ''}
              {propertiesError instanceof Error ? `Properties: ${propertiesError.message}` : ''}
            </p>
          </motion.div>
        )}

        {/* Properties Grid */}
        <PropertiesGrid
          properties={propertiesData?.properties || []}
          isLoading={propertiesLoading}
          onPropertyClick={(property) => setSelectedProperty(property)}
        />

        {/* Pagination */}
        {propertiesData && propertiesData.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl"
            >
              ← Anterior
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
              <span className="text-sm text-slate-600">
                Página {page} de {propertiesData.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              disabled={page === propertiesData.totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl"
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  )
}
