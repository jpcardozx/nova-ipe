'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'
import { PropertyCard } from './PropertyCard'
import { logger } from '@/lib/utils/logger'

interface PropertiesGridProps {
  properties: WordPressPropertyRecord[]
  isLoading: boolean
  onPropertyClick: (property: WordPressPropertyRecord) => void
}

export function PropertiesGrid({ properties, isLoading, onPropertyClick }: PropertiesGridProps) {
  logger.component('PropertiesGrid', 'Rendering:', {
    propertiesCount: properties?.length || 0,
    isLoading,
    hasProperties: !!properties,
    isArray: Array.isArray(properties)
  })

  if (isLoading) {
    logger.component('PropertiesGrid', 'Showing skeleton loaders')
    return (
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
    )
  }

  if (!properties || properties.length === 0) {
    logger.component('PropertiesGrid', 'No properties to show')
    return (
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
    )
  }

  logger.component('PropertiesGrid', 'Rendering', properties.length, 'property cards')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {properties.map((property, idx) => (
          <PropertyCard
            key={property.id}
            property={property}
            index={idx}
            onClick={() => onPropertyClick(property)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
