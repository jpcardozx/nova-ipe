'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Image as ImageIcon,
  Clock,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Home,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Card from '@/components/ui/card'
import { WordPressCatalogService, WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { WPLProperty } from '@/scripts/wordpress-importer/types'
import { toast } from 'sonner'

const statusConfig = {
  pending: { 
    label: 'Pendente', 
    color: 'bg-slate-100 text-slate-700 border-slate-200', 
    icon: Clock,
    gradient: 'from-slate-400 to-slate-600'
  },
  reviewing: { 
    label: 'Em Revisão', 
    color: 'bg-blue-100 text-blue-700 border-blue-200', 
    icon: Eye,
    gradient: 'from-blue-400 to-blue-600'
  },
  approved: { 
    label: 'Aprovado', 
    color: 'bg-green-100 text-green-700 border-green-200', 
    icon: CheckCircle2,
    gradient: 'from-green-400 to-green-600'
  },
  migrated: { 
    label: 'Migrado', 
    color: 'bg-purple-100 text-purple-700 border-purple-200', 
    icon: Sparkles,
    gradient: 'from-purple-400 to-purple-600'
  },
  rejected: { 
    label: 'Rejeitado', 
    color: 'bg-red-100 text-red-700 border-red-200', 
    icon: XCircle,
    gradient: 'from-red-400 to-red-600'
  },
  archived: { 
    label: 'Arquivado', 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    icon: Database,
    gradient: 'from-gray-400 to-gray-600'
  },
}

export default function WordPressCatalogPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<WordPressPropertyRecord['status'] | 'all'>('all')
  const [page, setPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<WordPressPropertyRecord | null>(null)
  const queryClient = useQueryClient()

  // Stats
  const { data: stats, error: statsError } = useQuery({
    queryKey: ['wordpress-stats'],
    queryFn: async () => {
      console.log('[WordPress Catalog] Fetching stats...')
      try {
        const result = await WordPressCatalogService.getStats()
        console.log('[WordPress Catalog] Stats fetched:', result)
        return result
      } catch (error) {
        console.error('[WordPress Catalog] Error fetching stats:', error)
        throw error
      }
    }
  })

  // Debug stats
  console.log('[WordPress Catalog] Stats state:', {
    hasStats: !!stats,
    statsError,
    stats
  })

  // Properties list
  const { data: propertiesData, isLoading, error: queryError } = useQuery({
    queryKey: ['wordpress-properties', statusFilter, search, page],
    queryFn: async () => {
      console.log('[WordPress Catalog] Fetching properties:', { statusFilter, search, page })
      try {
        const result = await WordPressCatalogService.getProperties({
          status: statusFilter === 'all' ? undefined : statusFilter,
          search,
          page,
          limit: 30
        })
        console.log('[WordPress Catalog] Fetched properties:', {
          count: result.properties.length,
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        })
        return result
      } catch (error) {
        console.error('[WordPress Catalog] Error fetching properties:', error)
        throw error
      }
    }
  })

  // Debug log para verificar estado
  console.log('[WordPress Catalog] Render state:', {
    isLoading,
    hasError: !!queryError,
    error: queryError,
    hasData: !!propertiesData,
    propertiesData: propertiesData, // Log completo
    propertiesCount: propertiesData?.properties?.length || 0,
    statusFilter,
    search,
    page
  })

  // Debug adicional se houver dados mas array vazio
  if (propertiesData && !isLoading) {
    console.log('[WordPress Catalog] propertiesData detailed:', {
      hasProperties: !!propertiesData.properties,
      isArray: Array.isArray(propertiesData.properties),
      length: propertiesData.properties?.length,
      total: propertiesData.total,
      firstItem: propertiesData.properties?.[0]
    })
  }

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: WordPressPropertyRecord['status']; notes?: string }) =>
      WordPressCatalogService.updatePropertyStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress-properties'] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-stats'] })
      toast.success('Status atualizado com sucesso!')
      setSelectedProperty(null)
    },
    onError: () => {
      toast.error('Erro ao atualizar status')
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="p-3 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-lg"
              >
                <Database className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Catálogo WordPress
                </h1>
                <p className="text-sm text-slate-600 mt-1">Gestão inteligente de fichas legadas</p>
              </div>
            </div>
            
            {stats && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-6 bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Total de Fichas</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.ready_to_migrate}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Prontas p/ Migrar</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Pills */}
          {stats && (
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(stats.by_status).map(([status, count], idx) => {
                const config = statusConfig[status as keyof typeof statusConfig]
                const Icon = config.icon
                const isActive = statusFilter === status
                
                return (
                  <motion.button
                    key={status}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setStatusFilter(status as WordPressPropertyRecord['status'])}
                    className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 group ${
                      isActive
                        ? `border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-100`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative z-10 flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{config.label}</span>
                    </div>
                    <div className="relative z-10 text-2xl font-bold text-slate-900">{count}</div>
                    {isActive && (
                      <motion.div
                        layoutId="activeStatusBg"
                        className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
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
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 border-2 border-slate-200 focus:border-amber-400 rounded-xl bg-white shadow-sm transition-all"
            />
          </div>
          {statusFilter !== 'all' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Button
                onClick={() => setStatusFilter('all')}
                className="h-12 px-6 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar Filtro
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Debug Info */}
        {queryError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Erro ao carregar propriedades
            </h3>
            <p className="text-red-600 text-sm font-mono">
              {queryError instanceof Error ? queryError.message : 'Erro desconhecido'}
            </p>
          </motion.div>
        )}

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-96 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : propertiesData?.properties && propertiesData.properties.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${statusFilter}-${search}-${page}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {propertiesData.properties.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={idx}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
              <Search className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhuma ficha encontrada</h3>
            <p className="text-slate-600">Tente ajustar os filtros ou buscar por outro termo</p>
          </motion.div>
        )}

        {/* Pagination */}
        {propertiesData && propertiesData.totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-2 mt-10"
          >
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {[...Array(Math.min(propertiesData.totalPages, 5))].map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl ${
                    page === pageNum 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-200' 
                      : ''
                  }`}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              disabled={page === propertiesData.totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onUpdateStatus={(status, notes) => {
          if (selectedProperty) {
            updateStatusMutation.mutate({ id: selectedProperty.id, status, notes })
          }
        }}
      />
    </div>
  )
}

// Property Card Component
function PropertyCard({
  property,
  index,
  onClick
}: {
  property: WordPressPropertyRecord
  index: number
  onClick: () => void
}) {
  const config = statusConfig[property.status]
  const Icon = config.icon
  const data = property.data

  const extractTitle = (data: WPLProperty) => {
    return data.field_313 || data.field_312 || `Imóvel ${data.mls_id || data.id}`
  }

  const formatPrice = (price: string | number) => {
    const value = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(value) || value === 0) return null
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden border-2 border-slate-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
        {/* Thumbnail */}
        <div className="relative h-56 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 overflow-hidden">
          {property.thumbnail_url ? (
            <>
              <img
                src={property.thumbnail_url}
                alt={extractTitle(data)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  // Fallback elegante se imagem não carregar
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                  if (fallback) fallback.classList.remove('hidden')
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Fallback icon (hidden until image fails) */}
              <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Home className="w-20 h-20 text-slate-400" />
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <ImageIcon className="w-20 h-20 text-slate-300" />
              </motion.div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${config.color} flex items-center gap-1.5 px-3 py-1.5 border shadow-lg backdrop-blur-sm`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="font-semibold">{config.label}</span>
            </Badge>
          </div>

          {/* Photo Count */}
          {property.photo_count > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <ImageIcon className="w-3.5 h-3.5" />
              {property.photo_count} {property.photo_count === 1 ? 'foto' : 'fotos'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors leading-tight">
            {extractTitle(data)}
          </h3>

          {/* Location */}
          {data.location2_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 flex-shrink-0 text-amber-500" />
              <span className="line-clamp-1">{data.location3_name}, {data.location2_name}</span>
            </div>
          )}

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-slate-700 mb-4 pb-4 border-b border-slate-100">
            {data.bedrooms && parseInt(String(data.bedrooms)) > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{data.bedrooms}</span>
              </div>
            )}
            {data.bathrooms && parseInt(String(data.bathrooms)) > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{data.bathrooms}</span>
              </div>
            )}
            {data.living_area && parseFloat(String(data.living_area)) > 0 && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{data.living_area}m²</span>
              </div>
            )}
          </div>

          {/* Price & Code */}
          <div className="flex items-center justify-between">
            {formatPrice(data.price) ? (
              <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatPrice(data.price)}
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">Preço sob consulta</div>
            )}
            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
              #{data.mls_id || data.id}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Property Detail Modal Component  
function PropertyDetailModal({
  property,
  onClose,
  onUpdateStatus
}: {
  property: WordPressPropertyRecord | null
  onClose: () => void
  onUpdateStatus: (status: WordPressPropertyRecord['status'], notes?: string) => void
}) {
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState('details')

  if (!property) return null

  const data = property.data
  const config = statusConfig[property.status]
  const Icon = config.icon
  
  const extractTitle = (data: WPLProperty) => {
    return data.field_313 || data.field_312 || `Imóvel ${data.mls_id || data.id}`
  }

  const formatPrice = (price: string | number) => {
    const value = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(value)) return 'Preço não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{extractTitle(data)}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-600">WP ID: <span className="font-mono font-semibold">{property.wp_id}</span></span>
                  <div className="h-4 w-px bg-slate-300" />
                  <Badge className={`${config.color} flex items-center gap-1.5 border`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-semibold">{config.label}</span>
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full w-10 h-10 p-0 border-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { value: 'details', label: 'Detalhes', icon: Home },
                { value: 'photos', label: `Fotos (${property.photo_count})`, icon: ImageIcon },
                { value: 'actions', label: 'Ações', icon: Sparkles }
              ].map(tab => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      activeTab === tab.value
                        ? 'bg-white text-slate-900 shadow-md border-2 border-amber-200'
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  {data.field_308 && (
                    <div className="bg-slate-50 p-5 rounded-2xl">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                        Descrição
                      </h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{data.field_308}</p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem label="Finalidade" value={data.listing === 10 ? 'Aluguel' : 'Venda'} icon={Home} />
                    <DetailItem label="Dormitórios" value={data.bedrooms} icon={Bed} />
                    <DetailItem label="Banheiros" value={data.bathrooms} icon={Bath} />
                    <DetailItem label="Área" value={data.living_area ? `${data.living_area}m²` : undefined} icon={Maximize2} />
                    <DetailItem label="Preço" value={formatPrice(data.price)} icon={DollarSign} />
                    <DetailItem label="Código" value={data.mls_id} />
                  </div>

                  {/* Location */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Localização
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Endereço" value={data.field_42} />
                      <DetailItem label="Bairro" value={data.location3_name} />
                      <DetailItem label="Cidade" value={data.location2_name} />
                      <DetailItem label="Estado" value={data.location1_name} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {property.photo_urls && property.photo_urls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.photo_urls.map((url, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="relative aspect-video rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200"
                        >
                          <img
                            src={url}
                            alt={`Foto ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback se foto não carregar
                              e.currentTarget.style.display = 'none'
                              const fallback = e.currentTarget.parentElement?.querySelector('.photo-fallback')
                              if (fallback) fallback.classList.remove('hidden')
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-white text-sm font-semibold">Foto {i + 1}</span>
                          </div>
                          {/* Fallback icon */}
                          <div className="photo-fallback hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-xs font-medium">Foto {i + 1}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="inline-block p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-4">
                        <ImageIcon className="w-20 h-20 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma foto disponível</h3>
                      <p className="text-sm text-slate-600">As fotos ainda não foram carregadas do servidor</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'actions' && (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Notas de Revisão
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-xl resize-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                      placeholder="Adicione observações sobre esta ficha..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {property.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => onUpdateStatus('reviewing', notes)}
                          className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-200"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Iniciar Revisão
                        </Button>
                        <Button
                          onClick={() => onUpdateStatus('approved', notes)}
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-200"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Aprovar Direto
                        </Button>
                      </>
                    )}

                    {property.status === 'reviewing' && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => onUpdateStatus('approved', notes)}
                          className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-200"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => onUpdateStatus('rejected', notes)}
                          className="h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg shadow-red-200"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    )}

                    {property.status === 'approved' && (
                      <Button
                        onClick={() => {
                          toast.info('Migração será implementada em breve')
                        }}
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-lg shadow-purple-200"
                      >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Migrar para Sanity
                      </Button>
                    )}

                    {property.status === 'rejected' && (
                      <Button
                        onClick={() => onUpdateStatus('pending', notes)}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-2"
                      >
                        Reabrir Ficha
                      </Button>
                    )}

                    {property.status === 'migrated' && (
                      <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                        <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Ficha Migrada!</h3>
                        <p className="text-sm text-purple-700">
                          Esta ficha já está no Sanity
                          {property.sanity_id && <span className="block mt-1 font-mono text-xs">ID: {property.sanity_id}</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Previous Notes */}
                  {property.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                    >
                      <p className="text-xs font-semibold text-amber-900 mb-2">📝 Notas anteriores:</p>
                      <p className="text-sm text-amber-800">{property.notes}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function DetailItem({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string
  value?: string | number
  icon?: React.ComponentType<{ className?: string }>
}) {
  if (!value) return null
  
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-200 transition-colors">
      {Icon && (
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
      )}
      {!Icon && (
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      )}
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}
