'use client'

import { motion } from 'framer-motion'
import { Search, Filter, SortAsc } from 'lucide-react'

interface SearchAndFiltersProps {
    searchTerm: string
    onSearchChange: (term: string) => void
    sortBy: string
    onSortChange: (sort: string) => void
    difficulty: string
    onDifficultyChange: (difficulty: string) => void
}

export default function SearchAndFilters({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    difficulty,
    onDifficultyChange
}: SearchAndFiltersProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca */}
                <div className="relative">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar artigos
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            id="search"
                            type="text"
                            placeholder="Digite para buscar..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Ordenação */}
                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                        Ordenar por
                    </label>
                    <div className="relative">
                        <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="newest">Mais recentes</option>
                            <option value="oldest">Mais antigos</option>
                            <option value="title">Título A-Z</option>
                            <option value="readTime">Tempo de leitura</option>
                            <option value="difficulty">Dificuldade</option>
                        </select>
                    </div>
                </div>

                {/* Filtro por dificuldade */}
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                        Nível de dificuldade
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => onDifficultyChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">Todos os níveis</option>
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Indicadores de filtros ativos */}
            {(searchTerm || difficulty) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200"
                >
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Filtros ativos:</span>

                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Busca: "{searchTerm}"
                                <button
                                    onClick={() => onSearchChange('')}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {difficulty && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                <button
                                    onClick={() => onDifficultyChange('')}
                                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
