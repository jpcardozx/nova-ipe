'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building2, Star, Award, Users, ChevronDown, ArrowRight } from 'lucide-react'
// Removido framer-motion para containers principais
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export default function MobileFirstHeroEnhanced() {
    const [searchQuery, setSearchQuery] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    // Hidratação segura
    useIsomorphicLayoutEffect(() => {
        setIsMounted(true)
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 150)

        return () => clearTimeout(timer)
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (propertyType) params.append('tipo', propertyType);
        if (location) params.append('local', location);
        router.push(`/catalogo?${params.toString()}`);
    }

    const handleQuickCall = () => {
        if (typeof window !== 'undefined') {
            window.open('https://wa.me/5511981845016?text=Olá! Tenho interesse em conhecer mais sobre os imóveis disponíveis.', '_blank');
        }
    }

    // Removidas variantes de animação para containers principais

    // SSR: exibe versão estática otimizada
    if (!isMounted) {
        return (
            <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `url('/images/hero-bg.jpg')`,
                        backgroundPosition: 'center center'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/85" />
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-24 lg:py-32 max-w-7xl mx-auto w-full">
                    <div className="text-center mb-12 lg:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>15 anos conectando sonhos em Guararema</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extralight text-white mb-6 leading-[0.9] tracking-tight">
                            Encontre seu
                            <span className="block font-light bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mt-2 mb-2">
                                lar ideal
                            </span>
                            <span className="block font-extralight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mt-4 text-white/95 tracking-normal">
                                em Guararema
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl lg:text-3xl text-white/85 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
                            Especialistas em imóveis residenciais e comerciais
                            <span className="block text-lg sm:text-xl lg:text-2xl mt-2 text-white/70">
                                com atendimento personalizado e conhecimento local
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-900">
            {/* Fundo otimizado */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    backgroundPosition: 'center center'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/85" />
            </div>

            {/* Conteúdo principal com padding adequado */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-24 lg:py-32 max-w-7xl mx-auto w-full">
                <div className="text-center mb-12 lg:mb-16">
                    {/* Badge superior */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>15 anos conectando sonhos em Guararema</span>
                    </div>

                    {/* Título principal reformulado */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extralight text-white mb-6 leading-[0.9] tracking-tight">
                        Encontre seu
                        <span className="block font-light bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mt-2 mb-2">
                            lar ideal
                        </span>
                        <span className="block font-extralight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mt-4 text-white/95 tracking-normal">
                            em Guararema
                        </span>
                    </h1>

                    {/* Subtítulo melhorado */}
                    <p className="text-xl sm:text-2xl lg:text-3xl text-white/85 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
                        Especialistas em imóveis residenciais e comerciais
                        <span className="block text-lg sm:text-xl lg:text-2xl mt-2 text-white/70">
                            com atendimento personalizado e conhecimento local
                        </span>
                    </p>

                    {/* Botões de ação melhorados */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
                        <button
                            onClick={handleQuickCall}
                            className="group w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-semibold text-lg lg:text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                            </svg>
                            <span>Falar no WhatsApp</span>
                        </button>
                        <Link
                            href="/catalogo"
                            className="group w-full sm:w-auto bg-white/15 backdrop-blur-md border border-white/30 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-semibold text-lg lg:text-xl flex items-center justify-center gap-3 hover:bg-white/25 hover:border-white/40 transition-all duration-300 hover:scale-105"
                        >
                            <span>Explorar Catálogo</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Search Box aprimorado */}
                <div className="mb-16 lg:mb-20">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/30 max-w-4xl mx-auto">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
                            Busque o imóvel dos seus sonhos
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="O que você procura?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-4 py-5 text-lg border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Home className="h-6 w-6 text-gray-400" />
                                </div>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full pl-14 pr-12 py-5 text-lg border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none shadow-sm hover:shadow-md"
                                >
                                    <option value="">Tipo de imóvel</option>
                                    <option value="casa">Casa</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="terreno">Terreno</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-6 w-6 text-gray-400" />
                                </div>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-14 pr-12 py-5 text-lg border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none shadow-sm hover:shadow-md"
                                >
                                    <option value="">Localização</option>
                                    <option value="guararema">Guararema</option>
                                    <option value="mogi-das-cruzes">Mogi das Cruzes</option>
                                    <option value="santa-isabel">Santa Isabel</option>
                                    <option value="salesopolis">Salesópolis</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] mt-6"
                        >
                            <Search className="w-6 h-6" />
                            Buscar Imóveis
                        </button>
                    </div>
                </div>

                {/* Trust Indicators redesenhados */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Star,
                                color: "text-yellow-400",
                                bgColor: "bg-yellow-400/10",
                                number: "15 Anos",
                                text: "de experiência no mercado",
                                subtitle: "Conhecimento sólido"
                            },
                            {
                                icon: Award,
                                color: "text-emerald-400",
                                bgColor: "bg-emerald-400/10",
                                number: "500+",
                                text: "imóveis vendidos",
                                subtitle: "Histórico comprovado"
                            },
                            {
                                icon: Users,
                                color: "text-blue-400",
                                bgColor: "bg-blue-400/10",
                                number: "1000+",
                                text: "famílias atendidas",
                                subtitle: "Confiança conquistada"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/15 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/30 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{item.number}</div>
                                <p className="text-lg text-white/90 font-medium mb-1">{item.text}</p>
                                <p className="text-sm text-white/70">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator melhorado */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium tracking-wide">Descubra mais</span>
                    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden">
                        <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    )
}
