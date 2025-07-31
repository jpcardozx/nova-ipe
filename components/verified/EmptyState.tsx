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
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
        >
            <div className="max-w-md mx-auto">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum imóvel disponível'}
                </h3>
                
                <p className="text-gray-600 mb-6">
                    {searchQuery 
                        ? `Não encontramos imóveis para "${searchQuery}". Tente ajustar sua busca.`
                        : 'Não há imóveis disponíveis no momento.'
                    }
                </p>
                
                {hasFilters && (
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Limpar filtros
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default EmptyState;