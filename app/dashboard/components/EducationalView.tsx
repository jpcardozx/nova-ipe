'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, ArrowLeft, BookOpen, Search, Filter, User, Building2, TrendingUp } from 'lucide-react'
import { featuredArticles, allArticles } from '@/app/data/educational-content'

export default function EducationalView() {
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'estrategia', name: 'Estratégia' },
        { id: 'operacional', name: 'Operacional' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'vendas', name: 'Vendas' }
    ]

    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (selectedArticle) {
        const article = allArticles.find(a => a.id === selectedArticle)
        if (!article) return null

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto"
            >
                <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Voltar aos Artigos
                </button>

                <article className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-medium">
                                {article.category}
                            </span>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                {article.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                {article.publishedAt}
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {article.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            {article.subtitle}
                        </p>

                        <div className="flex gap-2 mb-8">
                            {article.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{
                                __html: article.content.replace(/##\s/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">').replace(/###\s/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">')
                            }} />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                            >
                                Ver Mais Artigos
                            </button>
                        </div>
                    </div>
                </article>
            </motion.div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-2 rounded">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Artigos Técnicos
                        </h1>
                        <p className="text-gray-600">
                            Conhecimento estratégico para movimentar sua imobiliária
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                    <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article.id)}
                        className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                            <img
                                src={article.imageUrl || `https://images.unsplash.com/photo-1560472354-b43ff0c44a43?w=400&h=240&fit=crop&q=80`}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-t-lg"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    const nextEl = e.currentTarget.nextElementSibling as HTMLElement
                                    if (nextEl) {
                                        nextEl.style.display = 'flex'
                                    }
                                }}
                            />
                            <div className="w-full h-full bg-gray-100 rounded-t-lg items-center justify-center hidden">
                                <Building2 className="text-gray-400" size={48} />
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    {article.category}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {article.readTime}
                                </span>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {article.tags.slice(0, 2).map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Ler →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                    <Search className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                    <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
                </div>
            )}
        </div>
    )
}