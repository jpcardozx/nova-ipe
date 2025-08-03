"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  searchQuery?: string
  hasFilters: boolean
  onClearFilters: () => void
}

function EmptyState({ searchQuery, hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="mb-6">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nenhum imóvel encontrado
        </h3>
        <p className="text-gray-500 max-w-md">
          {searchQuery
            ? `Não encontramos imóveis para "${searchQuery}".`
            : 'Não há imóveis que correspondam aos filtros selecionados.'
          }
        </p>
      </div>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Limpar filtros
        </button>
      )}

      <div className="mt-8 text-sm text-gray-400">
        <p>Sugestões:</p>
        <ul className="mt-2 space-y-1">
          <li>• Tente ampliar a área de busca</li>
          <li>• Remova alguns filtros</li>
          <li>• Verifique a ortografia</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default EmptyState;