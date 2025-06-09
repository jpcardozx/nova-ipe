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
        if (searchQuery) params.append('q', searchQuery);
        if (propertyType) params.append('tipo', propertyType);
        if (location) params.append('local', location);
        window.location.href = `/catalogo?${params.toString()}`;
    }

    const handleQuickCall = () => {
        window.open('https://wa.me/5511981845016?text=Olá! Tenho interesse em conhecer mais sobre os imóveis disponíveis.', '_blank');
    }

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-900">
            {/* Mobile-optimized background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    backgroundPosition: 'center 30%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900/90" />
            </div>

            {/* Content Container - Mobile First */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">

                {/* Main Headline - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
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

                    {/* Mobile CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
                        <motion.button
                            onClick={handleQuickCall}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                            </svg>
                            Falar com Especialista
                        </motion.button>

                        <Link
                            href="/catalogo"
                            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                        >
                            Ver Portfólio
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>

                {/* Mobile-First Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Encontre seu imóvel ideal
                        </h3>

                        <div className="space-y-4">
                            {/* Search Input - Mobile Optimized */}
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

                            {/* Property Type - Touch Optimized */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Home className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">Tipo de imóvel</option>
                                    <option value="casa">Casa</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="terreno">Terreno</option>
                                    <option value="chacara">Chácara</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                            </div>

                            {/* Location - Touch Optimized */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">Região de interesse</option>
                                    <option value="centro">Centro</option>
                                    <option value="tanque">Bairro do Tanque</option>
                                    <option value="ponte-alta">Ponte Alta</option>
                                    <option value="itapema">Itapema</option>
                                    <option value="rural">Zona Rural</option>
                                </select>
                            </div>

                            {/* Search Button - Mobile Optimized */}
                            <motion.button
                                onClick={handleSearch}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg"
                            >
                                <Search className="w-5 h-5" />
                                Buscar Imóveis
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile-Optimized Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {[
                        {
                            icon: <Award className="w-6 h-6" />,
                            value: "15+",
                            label: "Anos de Experiência",
                            color: "from-amber-400 to-amber-500"
                        },
                        {
                            icon: <Building2 className="w-6 h-6" />,
                            value: "250+",
                            label: "Imóveis Vendidos",
                            color: "from-blue-400 to-blue-500"
                        },
                        {
                            icon: <Star className="w-6 h-6" />,
                            value: "98%",
                            label: "Clientes Satisfeitos",
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
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="flex justify-center mb-3">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-white/80 font-medium">
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
