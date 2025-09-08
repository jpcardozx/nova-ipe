'use client'

import { Category } from '@/app/types/educational'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
    categories: Category[]
    selectedCategory: string | null
    onSelectCategory: (categoryId: string | null) => void
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory
}: CategoryFilterProps) {

    const getCategoryIcon = (categoryId: string) => {
        switch (categoryId) {
            case 'trafego-pago': return '🎯'
            case 'aquisicao-clientes': return '👥'
            case 'vendas-imobiliario': return '🏠'
            case 'crm-automacao': return '⚙️'
            case 'analytics-metricas': return '📊'
            default: return '📚'
        }
    }

    const getCategoryColor = (categoryId: string) => {
        switch (categoryId) {
            case 'trafego-pago': return 'blue'
            case 'aquisicao-clientes': return 'green'
            case 'vendas-imobiliario': return 'purple'
            case 'crm-automacao': return 'orange'
            case 'analytics-metricas': return 'red'
            default: return 'gray'
        }
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categorias
            </h3>

            <div className="flex flex-wrap gap-3">
                {/* Filtro "Todos" */}
                <motion.button
                    onClick={() => onSelectCategory(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === null
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span>📋</span>
                    <span>Todos</span>
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                        {categories.reduce((total, cat) => total + cat.articleCount, 0)}
                    </span>
                </motion.button>

                {/* Filtros por categoria */}
                {categories.map((category, index) => {
                    const isSelected = selectedCategory === category.id
                    const color = getCategoryColor(category.id)

                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isSelected
                                    ? `bg-${color}-600 text-white shadow-lg`
                                    : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <span>{getCategoryIcon(category.id)}</span>
                            <span>{category.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected
                                    ? 'bg-white/20'
                                    : `bg-${color}-200 text-${color}-700`
                                }`}>
                                {category.articleCount}
                            </span>
                        </motion.button>
                    )
                })}
            </div>

            {/* Descrição da categoria selecionada */}
            {selectedCategory && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                    {categories.find(cat => cat.id === selectedCategory) && (
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">
                                {getCategoryIcon(selectedCategory)}
                            </span>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {categories.find(cat => cat.id === selectedCategory)?.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {categories.find(cat => cat.id === selectedCategory)?.description}
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}
