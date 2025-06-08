'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Home, Building2, Star, Award, Users } from 'lucide-react'

export default function LuxuryHero() {
    const [searchQuery, setSearchQuery] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchQuery) params.append('q', searchQuery)
        if (propertyType) params.append('tipo', propertyType)
        if (location) params.append('local', location)

        window.location.href = `/catalogo?${params.toString()}`
    }

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background with Enhanced Gradients */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-[20s] ease-linear"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    animation: 'subtle-zoom 20s ease-in-out infinite alternate'
                }}
            >
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-amber-900/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-slate-900/30" />
            </div>

            {/* Floating Elements for Depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-slate-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-5xl">
                {/* Headline */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-6 tracking-tight leading-tight">
                        Imóveis em
                        <span className="block font-semibold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                            Guararema
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl mb-4 font-light opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Encontre o imóvel ideal com quem conhece e trabalha na região há mais de uma década
                    </p>

                    <p className="text-base md:text-lg font-light opacity-75 max-w-2xl mx-auto">
                        Corretores Especializados • Portfólio exclusivo • Atendimento personalizado
                    </p>
                </div>                {/* Enhanced Search Box */}
                <div className="relative mb-12">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Search Input */}
                                <div className="md:col-span-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Digite sua busca..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
                                    />
                                </div>

                                {/* Property Type */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Home className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-gray-800 shadow-sm transition-all duration-200 hover:shadow-md appearance-none"
                                    >
                                        <option value="">Tipo de imóvel</option>
                                        <option value="casa">🏠 Casa</option>
                                        <option value="apartamento">🏢 Apartamento</option>
                                        <option value="terreno">🌱 Terreno</option>
                                        <option value="chacara">🌳 Chácara</option>
                                        <option value="comercial">🏪 Comercial</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-gray-800 shadow-sm transition-all duration-200 hover:shadow-md appearance-none"
                                    >
                                        <option value="">Escolha a região</option>
                                        <option value="centro">📍 Centro</option>
                                        <option value="tanque">📍 Bairro do Tanque</option>
                                        <option value="ponte-alta">📍 Ponte Alta</option>
                                        <option value="itapema">📍 Itapema</option>
                                        <option value="rural">🌾 Zona Rural</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Search className="w-5 h-5" />
                                Buscar Imóveis
                            </button>
                        </div>
                    </div>
                </div>                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="group relative">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 text-center">
                                <div className="mb-3">
                                    <Award className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-1">
                                    15+
                                </div>
                                <div className="text-sm font-medium text-white/90">Anos de Experiência</div>
                                <div className="text-xs text-white/70 mt-1">Expertise consolidada</div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 text-center">
                                <div className="mb-3">
                                    <Building2 className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-1">
                                    500+
                                </div>
                                <div className="text-sm font-medium text-white/90">Imóveis Vendidos</div>
                                <div className="text-xs text-white/70 mt-1">Portfólio diversificado</div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10 text-center">
                                <div className="mb-3">
                                    <Star className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-1">
                                    98%
                                </div>
                                <div className="text-sm font-medium text-white/90">Satisfação dos Clientes</div>
                                <div className="text-xs text-white/70 mt-1">Excelência comprovada</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}