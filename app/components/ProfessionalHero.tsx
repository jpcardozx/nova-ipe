'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Search, ChevronDown, Award, Home, Users, CheckCircle, TrendingUp, Shield, Clock } from 'lucide-react';

const ProfessionalHero = () => {
    const [searchType, setSearchType] = useState('comprar');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const overlayOpacity = useTransform(scrollY, [0, 300], [0.7, 0.9]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const trustIndicators = [
        { icon: Award, label: '25+', subtitle: 'Anos de Experiência', color: 'from-amber-400 to-orange-400' },
        { icon: Home, label: '2.500+', subtitle: 'Imóveis Vendidos', color: 'from-emerald-400 to-teal-400' },
        { icon: Users, label: '98%', subtitle: 'Clientes Satisfeitos', color: 'from-blue-400 to-indigo-400' },
        { icon: Shield, label: 'CRECI', subtitle: 'Regularizado', color: 'from-purple-400 to-pink-400' }
    ];

    const additionalStats = [
        { icon: TrendingUp, value: 'R$ 2.5Bi', label: 'Em Negócios' },
        { icon: Clock, value: '24h', label: 'Atendimento' },
        { icon: CheckCircle, value: '100%', label: 'Segurança' }
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Enhanced Background with Parallax */}
            <motion.div
                className="absolute inset-0"
                style={{ y: backgroundY }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
                    style={{
                        backgroundImage: 'url(/images/hero-bg.jpg)',
                        filter: 'brightness(0.7) contrast(1.1) saturate(1.2)'
                    }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-800/70 to-yellow-700/60"
                    style={{ opacity: overlayOpacity }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>

            {/* Geometric Accent Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute top-20 right-10 w-64 h-64 border border-amber-300/30 rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.05, x: 0 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-2xl rotate-45"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-6 py-20">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block mb-6"
                        >
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent text-lg font-semibold tracking-wide uppercase">
                                Ipê Imobiliária
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tight">
                            Encontre o{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                                    Imóvel Perfeito
                                </span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 origin-left"
                                />
                            </span>
                            <br />
                            para Sua Família
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-xl md:text-2xl text-amber-50/90 mb-4 max-w-4xl mx-auto leading-relaxed font-light"
                        >
                            Conectando sonhos à realidade há mais de duas décadas em São Paulo
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-lg text-amber-200/80 max-w-3xl mx-auto"
                        >
                            Experiência, confiança e resultados excepcionais no mercado imobiliário
                        </motion.p>
                    </motion.div>

                    {/* Enhanced Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative mb-16"
                    >
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                            {/* Search Form Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-yellow-500/5 rounded-3xl" />

                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row gap-6 items-center">
                                    {/* Search Type Toggle */}
                                    <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1.5 border border-white/30">
                                        {['comprar', 'alugar'].map((type) => (
                                            <motion.button
                                                key={type}
                                                onClick={() => setSearchType(type)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${searchType === type
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {type === 'comprar' ? 'Comprar' : 'Alugar'}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Search Fields */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-amber-500" />
                                            <input
                                                type="text"
                                                placeholder="Bairro ou Região"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-gray-800 placeholder-gray-500"
                                            />
                                        </div>

                                        <div className="relative">
                                            <select
                                                value={propertyType}
                                                onChange={(e) => setPropertyType(e.target.value)}
                                                className="w-full px-4 py-4 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-gray-800 appearance-none cursor-pointer"
                                            >
                                                <option value="">Tipo de Imóvel</option>
                                                <option value="apartamento">Apartamento</option>
                                                <option value="casa">Casa</option>
                                                <option value="studio">Studio</option>
                                                <option value="cobertura">Cobertura</option>
                                                <option value="terreno">Terreno</option>
                                                <option value="comercial">Comercial</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                                        </div>

                                        <div className="relative">
                                            <select
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(e.target.value)}
                                                className="w-full px-4 py-4 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-gray-800 appearance-none cursor-pointer"
                                            >
                                                <option value="">Faixa de Preço</option>
                                                <option value="ate-300k">Até R$ 300.000</option>
                                                <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                                <option value="500k-1m">R$ 500.000 - R$ 1.000.000</option>
                                                <option value="1m-2m">R$ 1.000.000 - R$ 2.000.000</option>
                                                <option value="acima-2m">Acima de R$ 2.000.000</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 whitespace-nowrap"
                                    >
                                        <Search className="h-5 w-5" />
                                        Buscar Imóveis
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Indicators Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {trustIndicators.map((indicator, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="group relative"
                            >
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:border-white/40 transition-all duration-300 relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${indicator.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    <div className="relative z-10">
                                        <div className="mb-4 relative">
                                            <indicator.icon className="h-10 w-10 text-amber-300 mx-auto group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-2 group-hover:text-amber-100 transition-colors">
                                            {indicator.label}
                                        </div>
                                        <div className="text-amber-200/80 text-sm font-medium group-hover:text-white/90 transition-colors">
                                            {indicator.subtitle}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Additional Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex flex-wrap justify-center gap-8 mb-8"
                    >
                        {additionalStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10"
                            >
                                <stat.icon className="h-6 w-6 text-amber-300" />
                                <div className="text-white">
                                    <span className="font-bold text-lg">{stat.value}</span>
                                    <span className="text-amber-200/80 ml-2 text-sm">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            >
                <div className="flex flex-col items-center text-white/70 group cursor-pointer">
                    <span className="text-sm mb-3 group-hover:text-white transition-colors">Explore Nossos Imóveis</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center group-hover:border-white/60 transition-colors"
                    >
                        <motion.div
                            animate={{ y: [0, 16, 0], opacity: [1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-4 bg-gradient-to-b from-amber-300 to-transparent rounded-full mt-2"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default ProfessionalHero;
