'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, MapPin, Clock, Users, Building2, Search, Zap, Star, TrendingUp } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

interface HeroStats {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    subtitle: string
    trend?: string
}

// Enhanced stats with conversion psychology
const heroStats: HeroStats[] = [
    {
        icon: Building2,
        label: 'Oportunidades Ativas',
        value: '127',
        subtitle: 'Atualizadas hoje',
        trend: '+12 esta semana'
    },
    {
        icon: TrendingUp,
        label: 'Taxa de Conversão',
        value: '8.7%',
        subtitle: 'Média do mercado: 2.3%',
        trend: '278% acima da média'
    },
    {
        icon: Clock,
        label: 'Tempo Médio',
        value: '22 dias',
        subtitle: 'Do primeiro contato ao fechamento',
        trend: '48% mais rápido'
    },
    {
        icon: Star,
        label: 'Satisfação',
        value: '9.2/10',
        subtitle: 'Baseado em 340+ avaliações',
        trend: '94% recomendam'
    },
]

// Enhanced search state interface
interface SearchState {
    query: string
    propertyType: string
    priceRange: string
    urgency: string
}

export default function CatalogoHeroEnhanced() {
    const [searchState, setSearchState] = useState<SearchState>({
        query: '',
        propertyType: '',
        priceRange: '',
        urgency: ''
    })

    const [showUrgencyAlert, setShowUrgencyAlert] = useState(false)
    const [liveViewers, setLiveViewers] = useState(23)
    const heroRef = useRef<HTMLElement>(null)
    const isInView = useInView(heroRef, { once: true, margin: '-100px' })

    // Simulate live activity for urgency
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveViewers(prev => prev + Math.floor(Math.random() * 3) - 1)
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    // Enhanced search handler with analytics
    const handleSearch = () => {
        // Track conversion intent
        const searchIntent = {
            query: searchState.query,
            type: searchState.propertyType,
            price: searchState.priceRange,
            urgency: searchState.urgency,
            timestamp: new Date().toISOString()
        }

        // Analytics event (simulate)
        if (typeof window !== 'undefined') {
            console.log('Search Intent:', searchIntent)
        }

        // Navigate to filtered results
        const params = new URLSearchParams()
        if (searchState.query) params.set('q', searchState.query)
        if (searchState.propertyType) params.set('tipo', searchState.propertyType)
        if (searchState.priceRange) params.set('faixa', searchState.priceRange)

        window.location.href = `#imoveis?${params.toString()}`
    }

    // Urgency triggers
    const urgencyTriggers = [
        "🔥 Apenas 3 imóveis restantes nesta faixa de preço",
        "⚡ 15 pessoas visualizaram estes imóveis nas últimas 2h",
        "🎯 81% dos imóveis similares vendidos em 48h"
    ]

    return (
        <motion.section
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
        >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0">
                {/* Refined grid pattern with amber accents */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(245,158,11,0.15) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Premium amber lighting effects */}
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-400/6 rounded-full blur-3xl"></div>

                {/* Directional gradient overlays */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
            </div>

            <div className="relative container mx-auto px-6 lg:px-8 py-20 lg:py-28 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced breadcrumb with live indicators */}
                    <motion.nav
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Link
                                href="/"
                                className="hover:text-amber-300 transition-colors duration-200 flex items-center gap-1"
                            >
                                ← Voltar ao início
                            </Link>
                            <span>/</span>
                            <span className="text-amber-300">Catálogo Premium</span>
                        </div>

                        {/* Live activity indicator */}
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white/90 text-xs font-medium">
                                    {liveViewers} pessoas navegando agora
                                </span>
                            </div>
                        </div>
                    </motion.nav>

                    {/* Main content grid */}
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        {/* Left content - Enhanced copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-7"
                        >
                            {/* Premium status badge with urgency */}
                            <div className="inline-flex items-center gap-3 mb-8 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-400/30">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                                    <div className="absolute inset-0 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-amber-200 text-sm font-semibold">
                                    127 oportunidades exclusivas • Atualizadas hoje
                                </span>
                            </div>

                            {/* Power headline with conversion psychology */}
                            <h1 className="text-5xl lg:text-8xl font-bold text-white mb-8 leading-[0.95]">
                                Encontre seu{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                        próximo
                                    </span>
                                    <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full opacity-80" />
                                </span>
                                <br />
                                <span className="text-white/90">
                                    investimento
                                </span>
                            </h1>

                            {/* Enhanced value proposition */}
                            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mb-8">
                                <strong className="text-amber-300">8.7% de conversão</strong> (média do mercado: 2.3%).
                                Não mostramos qualquer imóvel — apenas oportunidades que{' '}
                                <span className="text-white font-semibold">fazem sentido para seu perfil</span>.
                            </p>

                            {/* Trust signals row */}
                            <div className="flex flex-wrap items-center gap-6 mb-12 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                    <span>Análise em tempo real</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Users className="w-4 h-4 text-amber-400" />
                                    <span>+340 clientes satisfeitos</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <TrendingUp className="w-4 h-4 text-amber-400" />
                                    <span>ROI médio 12.8% a.a.</span>
                                </div>
                            </div>

                            {/* Enhanced CTA section */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={handleSearch}
                                    className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-10 py-5 rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-3 text-lg"
                                >
                                    <Search className="w-5 h-5" />
                                    Ver Oportunidades Agora
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link
                                    href="/visita"
                                    className="border-2 border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-white font-semibold px-8 py-5 rounded-xl transition-all duration-300 hover:bg-amber-500/10 text-center"
                                >
                                    Consultoria Personalizada
                                </Link>
                            </div>

                            {/* Urgency alert */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 }}
                                className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm"
                            >
                                <p className="text-red-300 text-sm font-medium">
                                    {urgencyTriggers[Math.floor(Date.now() / 10000) % urgencyTriggers.length]}
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Right stats grid - Enhanced with premium design */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-5"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {heroStats.map((stat, index) => {
                                    const IconComponent = stat.icon
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                                        >
                                            <IconComponent className="w-8 h-8 mb-4 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                                            <div className="text-3xl font-bold text-white mb-2 leading-none">{stat.value}</div>
                                            <div className="text-sm font-medium text-slate-300 mb-2">{stat.label}</div>
                                            <div className="text-xs text-slate-400 mb-1">{stat.subtitle}</div>
                                            {stat.trend && (
                                                <div className="text-xs text-amber-300 font-medium">{stat.trend}</div>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Enhanced search overlay - floating above content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6"
            >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Enhanced search input */}
                        <div className="md:col-span-2">
                            <label className="block text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                                O que você procura?
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Casa 3 quartos, apartamento centro..."
                                value={searchState.query}
                                onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Property type selector */}
                        <div>
                            <label className="block text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                                Tipo
                            </label>
                            <select
                                value={searchState.propertyType}
                                onChange={(e) => setSearchState(prev => ({ ...prev, propertyType: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="" className="text-slate-900">Todos</option>
                                <option value="casa" className="text-slate-900">🏠 Casa</option>
                                <option value="apartamento" className="text-slate-900">🏢 Apartamento</option>
                                <option value="terreno" className="text-slate-900">🌱 Terreno</option>
                                <option value="comercial" className="text-slate-900">🏪 Comercial</option>
                            </select>
                        </div>

                        {/* Price range */}
                        <div>
                            <label className="block text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                                Faixa de Preço
                            </label>
                            <select
                                value={searchState.priceRange}
                                onChange={(e) => setSearchState(prev => ({ ...prev, priceRange: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="" className="text-slate-900">Qualquer valor</option>
                                <option value="ate-300k" className="text-slate-900">Até R$ 300k</option>
                                <option value="300k-500k" className="text-slate-900">R$ 300k - 500k</option>
                                <option value="500k-800k" className="text-slate-900">R$ 500k - 800k</option>
                                <option value="acima-800k" className="text-slate-900">Acima R$ 800k</option>
                            </select>
                        </div>
                    </div>

                    {/* Enhanced search button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSearch}
                            className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-12 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center gap-3 text-lg"
                        >
                            <Search className="w-5 h-5" />
                            Buscar Oportunidades Premium
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    )
}
