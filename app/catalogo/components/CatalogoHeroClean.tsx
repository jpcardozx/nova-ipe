'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search, MapPin, TrendingUp } from 'lucide-react'

interface CatalogoHeroCleanProps {
    className?: string
}

export default function CatalogoHeroClean({ className }: CatalogoHeroCleanProps) {
    return (
        <section className={cn("relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900", className)}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent)] opacity-50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white">
                            Catálogo Premium
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Encontre seu
                        <span className="text-amber-400 block">
                            Imóvel Ideal
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Explore nossa seleção premium de imóveis em Guararema e região.
                        Qualidade, confiança e transparência em cada negócio.
                    </p>

                    {/* Quick Search */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl p-2 shadow-2xl">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Digite o bairro, cidade ou tipo de imóvel..."
                                        className="w-full pl-12 pr-4 py-3 text-slate-900 placeholder-slate-500 bg-transparent border-0 focus:ring-0 focus:outline-none"
                                    />
                                </div>
                                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap">
                                    Buscar Imóveis
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">150+</div>
                            <div className="text-sm text-slate-400">Imóveis Disponíveis</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-slate-400">Clientes Satisfeitos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">15+</div>
                            <div className="text-sm text-slate-400">Anos de Experiência</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">98%</div>
                            <div className="text-sm text-slate-400">Taxa de Sucesso</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
