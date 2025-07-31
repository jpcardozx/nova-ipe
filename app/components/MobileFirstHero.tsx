'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Home, Building2, Star, Award, Users, ChevronDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MobileFirstHero() {
    const [searchQuery, setSearchQuery] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery); if (propertyType) params.append('tipo', propertyType);
        if (location) params.append('local', location);
        window.location.href = `/catalogo?${params.toString()}`;
    }

    const handleQuickCall = () => {
        window.open('https://wa.me/5511981845016?text=Olá! Gostaria de uma consultoria especializada sobre imóveis em Guararema.', '_blank');
    }

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Enhanced background with geometric patterns */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    backgroundPosition: 'center 30%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/90 to-slate-900/95" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/15 via-transparent to-blue-900/15" />
                {/* Subtle geometric overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rotate-45 rounded-lg"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-amber-400/30 rotate-12 rounded-lg"></div>
                </div>
            </div>

            {/* Content Container - Mobile First */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">                {/* Main Headline - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="mb-6">
                        <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg mb-4">
                            ✨ 15 anos de excelência em Guararema
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Encontre o
                        <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-extrabold">
                            imóvel perfeito
                        </span>
                        <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-white/90 mt-2">
                            em Guararema
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-white/85 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
                        <strong className="text-amber-400 font-semibold">15 anos de expertise</strong> conectando famílias aos seus lares ideais.
                        <br className="hidden sm:block" />
                        <span className="text-lg sm:text-xl text-white/75">Consultoria personalizada • Atendimento premium • Resultados garantidos</span>
                    </p>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                        <motion.button
                            onClick={handleQuickCall}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group border border-emerald-500/20"
                        >
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                            </svg>
                            Consultoria Especializada
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">Gratuita</span>
                        </motion.button>

                        <Link
                            href="/catalogo"
                            className="w-full sm:w-auto bg-white/95 backdrop-blur-md border border-white/40 text-slate-800 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-white hover:border-white hover:shadow-2xl transition-all duration-300 group"
                        >
                            <Building2 className="w-6 h-6" />
                            Explorar Catálogo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Professional trust indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-8 text-white/75 text-sm">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-400" />
                            <span className="font-medium">CRECI Certificado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-400" />
                            <span className="font-medium">500+ Famílias</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                            <span className="font-medium">15 Anos</span>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="bg-white/98 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                Busca Inteligente
                            </h3>
                            <p className="text-slate-600 text-lg">
                                Encontre o imóvel ideal com nossa ferramenta avançada
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Enhanced Search Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ex: Casa 3 quartos no centro, apartamento vista para montanha..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-5 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white placeholder:text-slate-400 shadow-sm"
                                />
                            </div>

                            {/* Enhanced Filters Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Home className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                    </div>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white appearance-none cursor-pointer shadow-sm font-medium"
                                    >
                                        <option value="">Tipo de imóvel</option>
                                        <option value="casa">🏠 Casa</option>
                                        <option value="apartamento">🏢 Apartamento</option>
                                        <option value="terreno">🏞️ Terreno</option>
                                        <option value="chacara">🌳 Chácara</option>
                                        <option value="comercial">🏪 Comercial</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                    </div>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white appearance-none cursor-pointer shadow-sm font-medium"
                                    >
                                        <option value="">Região de interesse</option>
                                        <option value="centro">📍 Centro</option>
                                        <option value="tanque">📍 Bairro do Tanque</option>
                                        <option value="ponte-alta">📍 Ponte Alta</option>
                                        <option value="itapema">📍 Itapema</option>
                                        <option value="rural">🌾 Zona Rural</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Enhanced Search Button */}
                            <motion.button
                                onClick={handleSearch}
                                whileTap={{ scale: 0.98 }}
                                whileHover={{ scale: 1.01 }}
                                className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl group"
                            >
                                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Encontrar Meu Imóvel
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            {/* Professional quick filters */}
                            <div className="flex flex-wrap gap-2 pt-3">
                                <span className="text-sm text-slate-500 mr-2 font-medium">Buscas populares:</span>
                                {['Casa 3 quartos', 'Apartamento centro', 'Terreno 1000m²', 'Chácara'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-full transition-all duration-200 font-medium border border-slate-200 hover:border-emerald-200"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile-Optimized Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >                        {[
                    {
                        icon: <Award className="w-6 h-6" />,
                        value: "15+",
                        label: "Anos no Mercado",
                        color: "from-amber-400 to-amber-500"
                    },
                    {
                        icon: <Building2 className="w-6 h-6" />,
                        value: "500+",
                        label: "Transações",
                        color: "from-blue-400 to-blue-500"
                    },
                    {
                        icon: <Star className="w-6 h-6" />,
                        value: "4.9★",
                        label: "Avaliação",
                        color: "from-green-400 to-green-500"
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="text-center"
                    >
                        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/25 hover:border-white/40 transition-all duration-300 group">
                            <div className="flex justify-center mb-3">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-white/90 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
                </motion.div>
            </div>

            {/* Mobile Scroll Indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <span className="text-sm mb-2 font-light">Explore mais</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.div>
        </section>
    )
}
