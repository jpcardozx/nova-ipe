'use client'

import { Article } from '@/app/types/educational'
import { motion } from 'framer-motion'
import { Clock, User, ArrowRight, Star } from 'lucide-react'

interface ArticleCardProps {
    article: Article
    onClick: () => void
    index?: number
}

export default function ArticleCard({ article, onClick, index = 0 }: ArticleCardProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'iniciante': return 'bg-green-100 text-green-800 border-green-200'
            case 'intermediario': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'avancado': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'trafego-pago': return 'bg-blue-100 text-blue-800'
            case 'aquisicao-clientes': return 'bg-green-100 text-green-800'
            case 'vendas-imobiliario': return 'bg-purple-100 text-purple-800'
            case 'crm-automacao': return 'bg-orange-100 text-orange-800'
            case 'analytics-metricas': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group"
            onClick={onClick}
        >
            {/* Badge de destaque */}
            {article.featured && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3" />
                        Destaque
                    </div>
                </div>
            )}

            {/* Imagem do artigo */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                {article.imageUrl ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-center p-6">
                            <div className="text-6xl mb-2">📚</div>
                            <div className="text-sm opacity-80">Artigo Educacional</div>
                        </div>
                    </div>
                )}

                {/* Overlay com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Categoria */}
                <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-6">
                {/* Metadados */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                    </div>
                    <div className="text-gray-400">
                        {formatDate(article.publishedAt)}
                    </div>
                </div>

                {/* Título e subtítulo */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                </h3>

                {article.subtitle && (
                    <p className="text-gray-600 text-sm mb-3">
                        {article.subtitle}
                    </p>
                )}

                {/* Excerpt */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.excerpt}
                </p>

                {/* Tags e dificuldade */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                    </span>
                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                    {article.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{article.tags.length - 2}
                        </span>
                    )}
                </div>

                {/* Call to action */}
                <div className="flex items-center justify-between">
                    <motion.button
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group-hover:gap-3 transition-all"
                        whileHover={{ x: 4 }}
                    >
                        Ler artigo
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
