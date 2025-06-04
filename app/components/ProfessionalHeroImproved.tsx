'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Search, ChevronDown, Award, Home, Users, CheckCircle, TrendingUp, Shield, Clock } from 'lucide-react';

const ProfessionalHeroImproved = () => {
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
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Imóveis Premium em{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                            Guararema
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Sua referência em negócios imobiliários há mais de 25 anos. 
                        Encontre o imóvel ideal com quem entende do mercado.
                    </p>

                    {/* Enhanced Search Form */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto mb-12 border border-white/20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select 
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400 transition-all"
                            >
                                <option value="comprar">Comprar</option>
                                <option value="alugar">Alugar</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder="Localização" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400 transition-all"
                            />
                            <select 
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400 transition-all"
                            >
                                <option value="">Tipo de Imóvel</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                                <option value="comercial">Comercial</option>
                            </select>
                            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <Search size={20} />
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* Trust Indicators Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                        {trustIndicators.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${item.color} mb-3`}>
                                        <item.icon className="text-white" size={24} />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{item.label}</div>
                                    <div className="text-sm text-amber-200">{item.subtitle}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex justify-center items-center gap-8 flex-wrap"
                    >
                        {additionalStats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-3 text-amber-200">
                                <stat.icon size={20} />
                                <span className="font-semibold">{stat.value}</span>
                                <span className="text-sm opacity-75">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-amber-200"
                    >
                        <span className="text-sm font-medium">Explorar</span>
                        <ChevronDown size={24} />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProfessionalHeroImproved;
