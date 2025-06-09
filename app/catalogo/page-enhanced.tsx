'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, TrendingUp, Filter } from 'lucide-react'
import Link from 'next/link'
import PropertyCatalog from '@/app/components/property/PropertyCatalog'
import { Button } from '@/app/components/ui/button'
import { PropertySearchParams } from '@/app/types/property'

interface CatalogoPageProps {
    searchParams?: {
        q?: string
        tipo?: string
        local?: string
        precoMin?: string
        precoMax?: string
        ordem?: string
        dormitorios?: string
        banheiros?: string
        area?: string
        comodidades?: string
    }
}

// Function to transform URL search params to PropertySearchParams
function transformSearchParams(searchParams?: CatalogoPageProps['searchParams']): PropertySearchParams | undefined {
    if (!searchParams) return undefined

    return {
        q: searchParams.q,
        tipo: searchParams.tipo,
        local: searchParams.local,
        precoMin: searchParams.precoMin,
        precoMax: searchParams.precoMax,
        ordem: searchParams.ordem,
        dormitorios: searchParams.dormitorios,
        banheiros: searchParams.banheiros,
        area: searchParams.area,
        comodidades: searchParams.comodidades ? searchParams.comodidades.split(',') : undefined,
    }
}

// Enhanced loading component
function CatalogLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-64 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="w-32 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function CatalogoPageEnhanced({ searchParams }: CatalogoPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Enhanced Hero Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                <div className="relative container mx-auto px-4 py-12">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-2 text-white/90 text-sm mb-6"
                        >
                            <Link
                                href="/"
                                className="hover:text-white transition-colors duration-200 flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Início
                            </Link>
                            <span>/</span>
                            <span className="text-white font-medium">Catálogo de Imóveis</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                Encontre o Imóvel dos{' '}
                                <span className="relative">
                                    seus Sonhos
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"
                                    />
                                </span>
                            </h1>
                            <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                                Descubra nossa seleção exclusiva de imóveis premium. Tecnologia avançada,
                                filtros inteligentes e experiência personalizada para encontrar sua nova casa.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {[
                                { icon: Sparkles, label: 'Imóveis Premium', value: '500+' },
                                { icon: TrendingUp, label: 'Vendas Realizadas', value: '1.2k+' },
                                { icon: Filter, label: 'Filtros Avançados', value: '15+' },
                                { icon: ArrowLeft, label: 'Anos de Experiência', value: '10+' },
                            ].map((stat, index) => (
                                <div key={stat.label} className="text-center text-white">
                                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-sm text-white/80">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Main Catalog Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative -mt-8"
            >                <Suspense fallback={<CatalogLoadingSkeleton />}>
                    <PropertyCatalog
                        searchParams={transformSearchParams(searchParams)}
                        variant="catalog"
                        className="relative z-10"
                    />
                </Suspense>
            </motion.main>

            {/* Call to Action Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Não encontrou o que procurava?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Nossa equipe especializada pode ajudar você a encontrar o imóvel perfeito.
                        Entre em contato e descubra oportunidades exclusivas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg"
                        >
                            <Link href="/contato">
                                Falar com Especialista
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
                        >
                            <Link href="/alugar">
                                Ver Aluguéis
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.section>
        </div>
    )
}
