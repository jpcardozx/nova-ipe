'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, X, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WordPressCatalogService, WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { toast } from 'sonner'
import { StatsHeader } from './components/StatsHeader'
import { StatusPills } from './components/StatusPills'
import { PropertiesGrid } from './components/PropertiesGrid'

export default function WordPressCatalogPageModular() {
  console.log('[WordPressCatalogPage] Component mounted')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<WordPressPropertyRecord['status'] | 'all'>('all')
  const [page, setPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<WordPressPropertyRecord | null>(null)
  const queryClient = useQueryClient()

  // Stats Query
  const { data: stats, error: statsError, isLoading: statsLoading } = useQuery({
    queryKey: ['wordpress-stats'],
    queryFn: async () => {
      console.log('[Query] Fetching stats...')
      const result = await WordPressCatalogService.getStats()
      console.log('[Query] Stats result:', result)
      return result
    },
    staleTime: 30000, // 30s
    refetchOnWindowFocus: false
  })

  // Properties Query
  const { 
    data: propertiesData, 
    isLoading: propertiesLoading, 
    error: propertiesError 
  } = useQuery({
    queryKey: ['wordpress-properties', statusFilter, search, page],
    queryFn: async () => {
      console.log('[Query] Fetching properties:', { statusFilter, search, page })
      const result = await WordPressCatalogService.getProperties({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search,
        page,
        limit: 30
      })
      console.log('[Query] Properties result:', {
        count: result.properties.length,
        total: result.total,
        page: result.page
      })
      return result
    },
    staleTime: 10000, // 10s
    refetchOnWindowFocus: false
  })

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { 
      id: string
      status: WordPressPropertyRecord['status']
      notes?: string 
    }) => WordPressCatalogService.updatePropertyStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress-properties'] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-stats'] })
      toast.success('Status atualizado com sucesso!')
      setSelectedProperty(null)
    },
    onError: (error) => {
      console.error('[Mutation] Error updating status:', error)
      toast.error('Erro ao atualizar status')
    }
  })

  // Debug logs
  console.log('[WordPressCatalogPage] Render state:', {
    statsLoading,
    statsError: !!statsError,
    stats,
    propertiesLoading,
    propertiesError: !!propertiesError,
    propertiesData,
    propertiesCount: propertiesData?.properties?.length || 0,
    statusFilter,
    search,
    page
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header with Stats */}
      <StatsHeader stats={stats || null} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Pills */}
        {stats && (
          <div className="mb-8">
            <StatusPills 
              stats={stats}
              activeStatus={statusFilter}
              onStatusChange={(status) => {
                console.log('[StatusChange]', status)
                setStatusFilter(status)
                setPage(1)
              }}
            />
          </div>
        )}

        {/* Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <Input
              placeholder="Buscar por título, endereço, cidade, bairro..."
              value={search}
              onChange={(e) => {
                console.log('[Search] Value changed:', e.target.value)
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-12 h-12 border-2 border-slate-200 focus:border-amber-400 rounded-xl bg-white shadow-sm transition-all"
            />
          </div>
          {statusFilter !== 'all' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Button
                onClick={() => {
                  console.log('[Filter] Clearing filter')
                  setStatusFilter('all')
                  setPage(1)
                }}
                className="h-12 px-6 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar Filtro
              </Button>
            </motion.div>
          )}
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
            <p className="text-red-500 text-xs mt-2">
              Verifique o console do navegador (F12) para mais detalhes
            </p>
          </motion.div>
        )}

        {/* Properties Grid */}
        <PropertiesGrid
          properties={propertiesData?.properties || []}
          isLoading={propertiesLoading}
          onPropertyClick={(property) => {
            console.log('[PropertyClick]', property.id)
            setSelectedProperty(property)
          }}
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
    </div>
  )
}
