'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Home, Building2, Star, Award, Users, ChevronDown, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EnhancedHero() {
    const [searchQuery, setSearchQuery] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (propertyType) params.append('tipo', propertyType);
        if (location) params.append('local', location);
        window.location.href = `/catalogo?${params.toString()}`;
    }

    const handleQuickCall = () => {
        window.open('https://wa.me/5521990051961?text=Olá! Gostaria de uma avaliação profissional sobre imóveis em Guararema.', '_blank');
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
                    <div className="absolute top-1/2 right-1/6 w-16 h-16 border border-blue-400/20 -rotate-12 rounded-lg"></div>
                </div>
            </div>

            {/* Content Container - Professional Layout */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-6xl">

                {/* Enhanced headline with professional tone */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                >
                    <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium backdrop-blur-sm border border-amber-400/30">
                            Consultoria Imobiliária Especializada
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
                        Imóveis
                        <span className="block font-medium bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent mt-2">
                            premium
                        </span>
                        <span className="block font-light text-2xl sm:text-3xl lg:text-4xl mt-3 text-white/90">
                            em Guararema
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-white/85 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
                        Expertise de 15 anos no mercado imobiliário regional
                    </p>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                        <motion.button
                            onClick={handleQuickCall}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-5 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 border border-green-500/30"
                        >
                            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                            Avaliação Gratuita
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <Link
                            href="/catalogo"
                            className="w-full sm:w-auto bg-white/15 backdrop-blur-lg border border-white/30 text-white px-10 py-5 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-white/25 transition-all duration-300 shadow-xl"
                        >
                            <Building2 className="w-5 h-5" />
                            Portfólio Premium
                        </Link>
                    </div>
                </motion.div>

                {/* Enhanced Search Box with modern design */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="bg-white/98 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Localize seu imóvel ideal
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Enhanced Search Input */}
                            <div className="relative md:col-span-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por características..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white shadow-sm"
                                />
                            </div>

                            {/* Property Type */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Home className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">Categoria</option>
                                    <option value="casa">Residencial</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="terreno">Terreno</option>
                                    <option value="chacara">Chácara</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">Localização</option>
                                    <option value="centro">Centro</option>
                                    <option value="tanque">Bairro do Tanque</option>
                                    <option value="ponte-alta">Ponte Alta</option>
                                    <option value="itapema">Itapema</option>
                                    <option value="rural">Zona Rural</option>
                                </select>
                            </div>
                        </div>

                        {/* Enhanced Search Button */}
                        <motion.button
                            onClick={handleSearch}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.01 }}
                            className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-xl"
                        >
                            <Search className="w-5 h-5" />
                            Buscar Imóveis Premium
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Enhanced Stats with professional metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        {
                            icon: <Clock className="w-7 h-7" />,
                            value: "15+",
                            label: "Anos de Experiência",
                            sublabel: "No mercado regional",
                            color: "from-amber-400 to-amber-500"
                        },
                        {
                            icon: <Building2 className="w-7 h-7" />,
                            value: "800+",
                            label: "Transações Realizadas",
                            sublabel: "Vendas e locações",
                            color: "from-blue-400 to-blue-500"
                        },
                        {
                            icon: <TrendingUp className="w-7 h-7" />,
                            value: "R$ 120M+",
                            label: "Volume Negociado",
                            sublabel: "Últimos 5 anos",
                            color: "from-green-400 to-green-500"
                        },
                        {
                            icon: <Star className="w-7 h-7" />,
                            value: "4.9★",
                            label: "Avaliação Clientes",
                            sublabel: "Google Reviews",
                            color: "from-purple-400 to-purple-500"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group">
                                <div className="flex justify-center mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-white/90 font-medium mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-xs text-white/70">
                                    {stat.sublabel}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Enhanced scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <span className="text-sm mb-3 font-light">Explore nosso portfólio</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.div>
        </section>
    )
}
