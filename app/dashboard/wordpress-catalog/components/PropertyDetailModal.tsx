'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, CheckCircle, XCircle, Upload, Bed, Bath, Maximize2, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/utils/authenticated-fetch'
import { toast } from 'sonner'

interface PropertyDetailModalProps {
  property: WordPressPropertyRecord | null
  onClose: () => void
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

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [notes, setNotes] = useState('')
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: WordPressPropertyRecord['status'] }) => {
      if (!property) throw new Error('No property selected')
      return dashboardApi.updatePropertyStatus(property.id, status, notes || undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress-properties'] })
      queryClient.invalidateQueries({ queryKey: ['wordpress-stats'] })
      toast.success('Status atualizado com sucesso!')
      onClose()
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status')
      console.error(error)
    }
  })

  if (!property) return null

  const data = property.data
  const bedrooms = data.bedrooms && parseInt(String(data.bedrooms)) > 0 ? parseInt(String(data.bedrooms)) : null
  const bathrooms = data.bathrooms && parseInt(String(data.bathrooms)) > 0 ? parseInt(String(data.bathrooms)) : null
  const area = data.living_area && parseFloat(String(data.living_area)) > 0 ? parseFloat(String(data.living_area)) : null

  const actions = [
    {
      status: 'reviewing' as const,
      label: 'Iniciar Revisão',
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
      description: 'Marcar como em análise para revisão detalhada'
    },
    {
      status: 'approved' as const,
      label: 'Aprovar',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Aprovar imóvel para publicação no site'
    },
    {
      status: 'rejected' as const,
      label: 'Rejeitar',
      icon: XCircle,
      color: 'from-rose-500 to-rose-600',
      description: 'Descartar imóvel (não será publicado)'
    }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
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

              <h2 className="text-2xl font-bold text-white pr-12">
                {data.field_312 || `Imóvel #${data.mls_id || data.id}`}
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                Referência #{data.mls_id || data.id}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Property Info */}
              <div className="mb-6">
                {/* Location */}
                {data.location2_name && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{data.location3_name && `${data.location3_name}, `}{data.location2_name}</span>
                  </div>
                )}

                {/* Specs */}
                <div className="flex items-center gap-4 mb-4">
                  {bedrooms && (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Bed className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-700">{bedrooms} quartos</span>
                    </div>
                  )}
                  {bathrooms && (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Bath className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-700">{bathrooms} banheiros</span>
                    </div>
                  )}
                  {area && (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Maximize2 className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-700">{Math.round(area)}m²</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                {formatPrice(data.price) && (
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatPrice(data.price)}
                    </span>
                  </div>
                )}

                {/* Description */}
                {data.field_313 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Descrição</h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                      {data.field_313}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre este imóvel..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Escolha uma ação:</h3>
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.status}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatusMutation.mutate({ status: action.status })}
                      disabled={updateStatusMutation.isPending}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-transparent bg-gradient-to-r ${action.color} hover:shadow-lg transition-all group disabled:opacity-50`}
                    >
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-white">{action.label}</div>
                        <div className="text-xs text-white/80">{action.description}</div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
