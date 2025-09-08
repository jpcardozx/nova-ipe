'use client'

import { Article } from '@/app/types/educational'
import { motion } from 'framer-motion'
import { Clock, User, ArrowLeft, BookOpen, Share2, Heart } from 'lucide-react'

interface ArticleViewerProps {
    article: Article
    onBack: () => void
}

export default function ArticleViewer({ article, onBack }: ArticleViewerProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'iniciante': return 'bg-green-100 text-green-800'
            case 'intermediario': return 'bg-yellow-100 text-yellow-800'
            case 'avancado': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header com botão voltar */}
            <div className="flex items-center gap-4 mb-6">
                <motion.button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar aos artigos
                </motion.button>
            </div>

            {/* Cabeçalho do artigo */}
            <motion.header
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className="text-xl text-gray-600 mb-6">
                        {article.subtitle}
                    </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {article.author}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {article.readTime} de leitura
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {formatDate(article.publishedAt)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                    </span>
                </div>

                {/* Ações do artigo */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className="h-4 w-4" />
                        Curtir
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Share2 className="h-4 w-4" />
                        Compartilhar
                    </motion.button>
                </div>
            </motion.header>

            {/* Conteúdo do artigo */}
            <motion.article
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div
                    className="space-y-6 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: article.content.split('\n').map(paragraph => {
                            // Conversão básica de markdown para HTML
                            if (paragraph.startsWith('# ')) {
                                return `<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">${paragraph.slice(2)}</h1>`
                            }
                            if (paragraph.startsWith('## ')) {
                                return `<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">${paragraph.slice(3)}</h2>`
                            }
                            if (paragraph.startsWith('### ')) {
                                return `<h3 class="text-xl font-bold text-gray-900 mt-4 mb-2">${paragraph.slice(4)}</h3>`
                            }
                            if (paragraph.startsWith('- ')) {
                                return `<li class="ml-4">${paragraph.slice(2)}</li>`
                            }
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                return `<p class="font-bold">${paragraph.slice(2, -2)}</p>`
                            }
                            if (paragraph.trim() === '') {
                                return '<br/>'
                            }
                            return `<p class="mb-4">${paragraph}</p>`
                        }).join('')
                    }}
                />
            </motion.article>

            {/* Footer do artigo */}
            <motion.footer
                className="mt-12 pt-8 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Gostou deste artigo?
                    </h3>
                    <p className="text-blue-700 mb-4">
                        Explore mais conteúdos sobre marketing digital e vendas imobiliárias em nossa biblioteca educacional.
                    </p>
                    <motion.button
                        onClick={onBack}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Ver mais artigos
                    </motion.button>
                </div>
            </motion.footer>
        </motion.div>
    )
}
