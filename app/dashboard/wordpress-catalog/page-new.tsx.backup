'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  ArrowRight,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Card from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WordPressCatalogService, WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { WPLProperty } from '@/scripts/wordpress-importer/types'
import { toast } from 'sonner'

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-800', icon: Clock },
  reviewing: { label: 'Em Revisão', color: 'bg-blue-100 text-blue-800', icon: Eye },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  migrated: { label: 'Migrado', color: 'bg-purple-100 text-purple-800', icon: ArrowRight },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function WordPressCatalogPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<WordPressPropertyRecord['status'] | 'all'>('all')
  const [page, setPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<WordPressPropertyRecord | null>(null)
  const queryClient = useQueryClient()

  // Stats
  const { data: stats } = useQuery({
    queryKey: ['wordpress-stats'],
    queryFn: () => WordPressCatalogService.getStats()
  })

  // Properties list
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['wordpress-properties', statusFilter, search, page],
    queryFn: () => WordPressCatalogService.getProperties({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search,
      page,
      limit: 30
    })
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: WordPressPropertyRecord['status']; notes?: string }) =>
      WordPressCatalogService.updatePropertyStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress-properties'] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-stats'] })
      toast.success('Status atualizado com sucesso!')
      setSelectedProperty(null)
    }
  })

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Catálogo WordPress</h1>
                <p className="text-sm text-gray-600">Gestão e migração de fichas legadas</p>
              </div>
            </div>
            
            {stats && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-600">Fichas Totais</div>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{stats.ready_to_migrate}</div>
                  <div className="text-xs text-gray-600">Prontas</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(stats.by_status).map(([status, count]) => {
                const config = statusConfig[status as keyof typeof statusConfig]
                const Icon = config.icon
                return (
                  <motion.button
                    key={status}
                    onClick={() => setStatusFilter(status as WordPressPropertyRecord['status'])}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      statusFilter === status
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">{config.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search & Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por título, endereço, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 border-gray-300"
            />
          </div>
          <Button
            variant={statusFilter !== 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className="h-12"
          >
            <Filter className="w-4 h-4 mr-2" />
            {statusFilter === 'all' ? 'Todos' : 'Limpar Filtro'}
          </Button>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${statusFilter}-${search}-${page}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {propertiesData?.properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {propertiesData && propertiesData.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(propertiesData.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                onClick={() => setPage(i + 1)}
                className="w-10 h-10 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Property Detail Dialog */}
      <PropertyDetailDialog
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
  onClick
}: {
  property: WordPressPropertyRecord
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
    if (isNaN(value)) return null
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden border-2 border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          {property.thumbnail_url ? (
            <img
              src={property.thumbnail_url}
              alt={extractTitle(data)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${config.color} flex items-center gap-1 px-3 py-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>

          {/* Photo Count */}
          {property.photo_count > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              {property.photo_count} fotos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {extractTitle(data)}
          </h3>

          {/* Location */}
          {data.location2_name && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              {data.location3_name}, {data.location2_name}
            </div>
          )}

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
            {data.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {data.bedrooms}
              </div>
            )}
            {data.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {data.bathrooms}
              </div>
            )}
            {data.living_area && (
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4" />
                {data.living_area}m²
              </div>
            )}
          </div>

          {/* Price */}
          {formatPrice(data.price) && (
            <div className="text-xl font-bold text-green-600">
              {formatPrice(data.price)}
            </div>
          )}

          {/* Code */}
          <div className="text-xs text-gray-500 mt-2">
            Código: {data.mls_id || data.id}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Property Detail Dialog Component  
function PropertyDetailDialog({
  property,
  onClose,
  onUpdateStatus
}: {
  property: WordPressPropertyRecord | null
  onClose: () => void
  onUpdateStatus: (status: WordPressPropertyRecord['status'], notes?: string) => void
}) {
  const [notes, setNotes] = useState('')

  if (!property) return null

  const data = property.data
  const extractTitle = (data: WPLProperty) => {
    return data.field_313 || data.field_312 || `Imóvel ${data.mls_id || data.id}`
  }

  return (
    <>
      {property && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{extractTitle(data)}</h2>
                <div className="text-sm text-gray-600">
                  Código WordPress: {property.wp_id} • Status:{' '}
                  <Badge className={statusConfig[property.status].color}>
                    {statusConfig[property.status].label}
                  </Badge>
                </div>
              </div>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="photos">Fotos ({property.photo_count})</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Description */}
            {data.field_308 && (
              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.field_308}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Tipo" value={data.property_type} />
              <DetailItem label="Finalidade" value={data.listing === 10 ? 'Aluguel' : 'Venda'} />
              <DetailItem label="Dormitórios" value={data.bedrooms} />
              <DetailItem label="Banheiros" value={data.bathrooms} />
              <DetailItem label="Área" value={data.living_area ? `${data.living_area}m²` : undefined} />
              <DetailItem label="Endereço" value={data.field_42} />
              <DetailItem label="Bairro" value={data.location3_name} />
              <DetailItem label="Cidade" value={data.location2_name} />
              <DetailItem label="Estado" value={data.location1_name} />
            </div>
          </TabsContent>

          <TabsContent value="photos">
            {property.photo_urls && property.photo_urls.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {property.photo_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>Nenhuma foto disponível</p>
                <p className="text-sm mt-2">As fotos ainda não foram carregadas do servidor</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Notas de Revisão</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 px-3 py-2 border rounded-lg resize-none"
                placeholder="Adicione observações sobre esta ficha..."
              />
            </div>

            <div className="flex gap-2">
              {property.status === 'pending' && (
                <>
                  <Button
                    onClick={() => onUpdateStatus('reviewing', notes)}
                    className="flex-1"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Iniciar Revisão
                  </Button>
                  <Button
                    onClick={() => onUpdateStatus('approved', notes)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprovar Direto
                  </Button>
                </>
              )}

              {property.status === 'reviewing' && (
                <>
                  <Button
                    onClick={() => onUpdateStatus('approved', notes)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => onUpdateStatus('rejected', notes)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </>
              )}

              {property.status === 'approved' && (
                <Button
                  onClick={() => {
                    // TODO: Implement migration
                    toast.info('Migração será implementada')
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Migrar para Sanity
                </Button>
              )}

              {property.status === 'rejected' && (
                <Button
                  onClick={() => onUpdateStatus('pending', notes)}
                  className="flex-1"
                  variant="outline"
                >
                  Reabrir
                </Button>
              )}
            </div>

            {property.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Notas anteriores:</p>
                <p className="text-sm text-gray-700">{property.notes}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DetailItem({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}
