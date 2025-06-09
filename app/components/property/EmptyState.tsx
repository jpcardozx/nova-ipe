"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  searchQuery?: string
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({ searchQuery, hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-96 text-center px-4"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchQuery 
          ? `Nenhum resultado para "${searchQuery}"`
          : 'Nenhum imóvel encontrado'
        }
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {hasFilters 
          ? 'Tente ajustar seus filtros para encontrar mais opções disponíveis.'
          : 'Não encontramos imóveis que correspondam aos seus critérios de busca.'
        }
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
        
        <button
          onClick={() => window.location.href = '/contato'}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg transition-colors font-medium"
        >
          Entre em Contato
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Sugestões:</p>
        <ul className="mt-2 space-y-1">
          <li>• Verifique se os termos estão escritos corretamente</li>
          <li>• Tente usar termos mais gerais</li>
          <li>• Experimente diferentes filtros de localização</li>
        </ul>
      </div>
    </motion.div>
  )
}
