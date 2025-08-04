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

    // SSR: exibe versão estática sem animações
    if (!isMounted) {
        return (
            <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/images/hero-bg.jpg')`,
                        backgroundPosition: 'center 30%'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900/90" />
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
                            Seu novo
                            <span className="block font-medium bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mt-2">
                                endereço
                            </span>
                            <span className="block font-light text-2xl sm:text-3xl lg:text-4xl mt-2 text-white/90">
                                em Guararema
                            </span>
                        </h1>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-900">
            {/* Fundo estático */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    backgroundPosition: 'center 30%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900/90" />
            </div>

            {/* Conteúdo principal sem animações de container */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
                        Seu novo
                        <span className="block font-medium bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mt-2">
                            endereço
                        </span>
                        <span className="block font-light text-2xl sm:text-3xl lg:text-4xl mt-2 text-white/90">
                            em Guararema
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/80 mb-6 font-light max-w-lg mx-auto">
                        15 anos conectando pessoas aos seus sonhos
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
                        <button
                            onClick={handleQuickCall}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                            </svg>
                            Falar com Especialista
                        </button>
                        <div>
                            <Link
                                href="/catalogo"
                                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                            >
                                Ver Portfólio
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Box sem motion */}
                <div className="mb-12">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Encontre seu imóvel ideal
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Digite o que procura..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Home className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 text-base border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none"
                                >
                                    <option value="">Tipo de imóvel</option>
                                    <option value="casa">Casa</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="terreno">Terreno</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 text-base border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none"
                                >
                                    <option value="">Localização</option>
                                    <option value="guararema">Guararema</option>
                                    <option value="mogi-das-cruzes">Mogi das Cruzes</option>
                                    <option value="santa-isabel">Santa Isabel</option>
                                    <option value="salesopolis">Salesópolis</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                            >
                                <Search className="w-5 h-5" />
                                Buscar Imóveis
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators - estáticos */}
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        {[
                            { icon: Star, color: "text-yellow-400", number: "15 Anos", text: "de experiência" },
                            { icon: Award, color: "text-emerald-400", number: "500+", text: "imóveis vendidos" },
                            { icon: Users, color: "text-blue-400", number: "1000+", text: "famílias atendidas" }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                            >
                                <div className="flex items-center justify-center gap-2 text-white">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    <span className="font-semibold">{item.number}</span>
                                </div>
                                <p className="text-sm text-white/80 mt-1">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator simples */}
            <div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Deslize para ver mais</span>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
                    </div>
                </div>
            </div>
        </section>
    )
}
