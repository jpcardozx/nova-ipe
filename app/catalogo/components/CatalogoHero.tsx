'use client'

import React from 'react'
import { ArrowRight, MapPin, Clock, Users, Building2 } from 'lucide-react'
import Link from 'next/link'

interface HeroStats {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    subtitle: string
}

const heroStats: HeroStats[] = [
    { icon: Building2, label: 'Imóveis Ativos', value: '84', subtitle: 'Casas, apartamentos e terrenos' },
    { icon: MapPin, label: 'Localização', value: 'Guararema', subtitle: 'Região do Alto Tietê' },
    { icon: Clock, label: 'Experiência', value: '10 anos', subtitle: 'Conhecimento do mercado local' },
    { icon: Users, label: 'Avaliação', value: '4.8/5', subtitle: 'Baseado em experiências reais' },
]

export default function CatalogoHero() {
    return (
        <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Consistent Background Pattern - matching homepage */}
            <div className="absolute inset-0">
                {/* Refined grid pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Amber accents to match homepage */}
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>

                {/* Subtle amber lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
            </div>

            <div className="relative container mx-auto px-6 lg:px-8 py-20 lg:py-28 z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Navigation breadcrumb */}
                    <nav className="flex items-center gap-2 text-slate-400 text-sm mb-12">
                        <Link
                            href="/"
                            className="hover:text-amber-300 transition-colors duration-200 flex items-center gap-1"
                        >
                            ← Voltar ao início
                        </Link>
                        <span>/</span>
                        <span className="text-amber-300">Catálogo de Imóveis</span>
                    </nav>

                    {/* Main content */}
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            {/* Authentic status badge */}
                            <div className="inline-flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 border border-white/20">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-white/90 text-sm font-medium">
                                    84 imóveis ativos em Guararema
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                                Descubra seu{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                        novo lar
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full opacity-60" />
                                </span>
                            </h1>

                            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mb-12">
                                10 anos de experiência no mercado imobiliário de Guararema. Conhecemos cada
                                bairro, cada rua, e podemos ajudar você a encontrar exatamente o que precisa.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="#imoveis"
                                    className="group bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/25 flex items-center justify-center gap-2"
                                >
                                    Ver Imóveis Disponíveis
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/visita"
                                    className="border-2 border-amber-400/50 text-amber-300 hover:border-amber-300 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-amber-400/10 text-center"
                                >
                                    Agendar Consultoria
                                </Link>
                            </div>
                        </div>

                        {/* Stats grid - aligned with homepage amber theme */}
                        <div className="lg:col-span-5">
                            <div className="grid grid-cols-2 gap-6">
                                {heroStats.map((stat, index) => {
                                    const IconComponent = stat.icon
                                    return (
                                        <div
                                            key={stat.label}
                                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                        >
                                            <IconComponent className="w-8 h-8 mb-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                            <div className="text-sm font-medium text-slate-300 mb-1">{stat.label}</div>
                                            <div className="text-xs text-slate-400">{stat.subtitle}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
