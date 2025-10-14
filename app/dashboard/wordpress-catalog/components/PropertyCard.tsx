'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Home, ImageIcon as Image, MapPin, Bed, Bath, Maximize2, DollarSign } from 'lucide-react'
import Card from '@/components/ui/card'
import NextImage from 'next/image'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { WPLProperty } from '@/scripts/wordpress-importer/types'
import { Clock, Eye, CheckCircle2, Sparkles, XCircle, Archive } from 'lucide-react'
import { getBestPhotoUrl } from '@/lib/utils/wordpress-photo-urls'

const statusConfig = {
  pending: {
    label: 'Aguardando',
    color: 'bg-amber-500 text-white border-amber-600',
    icon: Clock,
  },
  reviewing: {
    label: 'Em Análise',
    color: 'bg-blue-500 text-white border-blue-600',
    icon: Eye,
  },
  approved: {
    label: 'Aprovado',
    color: 'bg-emerald-500 text-white border-emerald-600',
    icon: CheckCircle2,
  },
  migrated: {
    label: 'Publicado',
    color: 'bg-violet-500 text-white border-violet-600',
    icon: Sparkles,
  },
  rejected: {
    label: 'Descartado',
    color: 'bg-rose-500 text-white border-rose-600',
    icon: XCircle,
  },
  archived: {
    label: 'Arquivado',
    color: 'bg-slate-400 text-white border-slate-500',
    icon: Archive,
  },
}

interface PropertyCardProps {
  property: WordPressPropertyRecord
  index: number
  onClick: () => void
}

const extractTitle = (data: WPLProperty) => {
  // Usa field_312 (título curto) ao invés de field_313 (descrição longa)
  return data.field_312 || `Imóvel ${data.mls_id || data.id}`
}

// Extrai info de quartos da descrição (field_313)
const extractBedrooms = (description: string): number | null => {
  if (!description) return null
  const match = description.match(/(\d+)\s*(?:quartos?|suítes?)/i)
  return match ? parseInt(match[1]) : null
}

// Extrai info de banheiros da descrição
const extractBathrooms = (description: string): number | null => {
  if (!description) return null
  const match = description.match(/(\d+)\s*banheiros?/i)
  return match ? parseInt(match[1]) : null
}

// Extrai área da descrição
const extractArea = (description: string): number | null => {
  if (!description) return null
  const match = description.match(/(\d+(?:[,\.]\d+)?)\s*m²/i)
  return match ? parseFloat(match[1].replace(',', '.')) : null
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

export function PropertyCard({ property, index, onClick }: PropertyCardProps) {
  const config = statusConfig[property.status]
  const Icon = config.icon
  const data = property.data

  // ✅ SOLUÇÃO TEMPORÁRIA: Usa URLs do R2 se existirem, senão mostra placeholder
  // As fotos do Lightsail não estão mais disponíveis (servidor offline ou migração)
  const imageUrl = property.photo_urls?.[0] || property.thumbnail_url
  const hasValidImage = imageUrl && (
    imageUrl.includes('r2.cloudflarestorage.com') || 
    imageUrl.includes('pub-') ||
    !imageUrl.includes('wpl-imoveis.com') // Exclui URLs inválidas
  )

  // 🐛 DEBUG: Log URL gerada
  if (typeof window !== 'undefined' && index === 0) {
    console.log('🖼️ PropertyCard Debug (primeiro card):', {
      wp_id: property.wp_id,
      photo_count: property.photo_count,
      thumbnail_url: property.thumbnail_url,
      photo_urls: property.photo_urls,
      imageUrl_disponivel: imageUrl,
      hasValidImage
    })
  }

  // ✅ USA DADOS REAIS do banco (não extrai da descrição)
  const bedrooms = data.bedrooms && parseInt(String(data.bedrooms)) > 0 ? parseInt(String(data.bedrooms)) : null
  const bathrooms = data.bathrooms && parseInt(String(data.bathrooms)) > 0 ? parseInt(String(data.bathrooms)) : null
  const area = data.living_area && parseFloat(String(data.living_area)) > 0 ? parseFloat(String(data.living_area)) : null

  // ✅ IMAGENS: Error handling
  const [imageError, setImageError] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.99 }}
      className="group cursor-pointer h-full"
    >
      <Card className="overflow-hidden border-2 border-slate-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-2xl dark:hover:shadow-amber-500/20 transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-52 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 overflow-hidden">
          {hasValidImage && !imageError ? (
            <>
              <NextImage
                src={imageUrl!}
                alt={extractTitle(data)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                quality={75}
                onError={() => {
                  console.warn('⚠️ Imagem indisponível:', imageUrl)
                  setImageError(true)
                }}
                unoptimized={!imageUrl!.includes('r2.cloudflarestorage.com')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900">
              <Home className="w-16 h-16 text-slate-300 dark:text-gray-700 mb-2" />
              <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">
                {property.photo_count > 0 ? `${property.photo_count} ${property.photo_count === 1 ? 'foto' : 'fotos'}` : 'Sem fotos'}
              </span>
              <span className="text-xs text-slate-300 dark:text-gray-600 mt-1">
                Aguardando migração
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.color} shadow-xl backdrop-blur-sm`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{config.label}</span>
            </div>
          </div>

          {/* Photo Count Badge */}
          {property.photo_count > 0 && hasValidImage && (
            <div className="absolute bottom-4 left-4 bg-slate-900/90 dark:bg-gray-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
              <Image className="w-3.5 h-3.5" />
              <span>{property.photo_count}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight min-h-[3.5rem]">
            {extractTitle(data)}
          </h3>

          {/* Location */}
          {data.location2_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 mb-4 bg-slate-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-gray-700/50">
              <MapPin className="w-4 h-4 flex-shrink-0 text-amber-500 dark:text-amber-400" />
              <span className="line-clamp-1 font-medium">
                {data.location3_name && `${data.location3_name}, `}{data.location2_name}
              </span>
            </div>
          )}

          {/* Specs */}
          {(bedrooms || bathrooms || area) && (
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300 mb-4 pb-4 border-b border-slate-100 dark:border-gray-800">
              {bedrooms && bedrooms > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-gray-700/50">
                  <Bed className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                  <span className="font-semibold text-slate-700 dark:text-gray-300">{bedrooms}</span>
                </div>
              )}
              {bathrooms && bathrooms > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-gray-700/50">
                  <Bath className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                  <span className="font-semibold text-slate-700 dark:text-gray-300">{bathrooms}</span>
                </div>
              )}
              {area && area > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-gray-700/50">
                  <Maximize2 className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                  <span className="font-semibold text-slate-700 dark:text-gray-300">{Math.round(area)}m²</span>
                </div>
              )}
            </div>
          )}

          {/* Price & Code - pushed to bottom */}
          <div className="flex items-center justify-between mt-auto">
            {formatPrice(data.price) ? (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {formatPrice(data.price)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-slate-500 dark:text-gray-400 font-medium italic">Sob consulta</div>
            )}
            <div className="text-xs text-slate-500 dark:text-gray-400 font-mono bg-slate-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg font-semibold border border-slate-200 dark:border-gray-700/50">
              #{data.mls_id || data.id}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
