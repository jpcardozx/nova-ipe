'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, TrendingUp, Award, Users, Heart, Star, Zap } from 'lucide-react';
import Image from 'next/image';

type SearchType = 'comprar' | 'alugar' | 'investir';

interface SearchTab {
    id: SearchType;
    label: string;
    icon: string;
    description: string;
}

export default function PremiumHero() {
    const [searchType, setSearchType] = useState<SearchType>('comprar');
    const [searchValue, setSearchValue] = useState('');

    const searchTabs: SearchTab[] = [
        { id: 'comprar', label: 'Comprar', icon: '🏡', description: 'Encontre sua casa dos sonhos' },
        { id: 'alugar', label: 'Alugar', icon: '🔑', description: 'Alugue com segurança total' },
        { id: 'investir', label: 'Investir', icon: '📈', description: 'Multiplique seu patrimônio' },
    ];

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        const query = encodeURIComponent(searchValue.trim());
        window.location.href = `/${searchType}?q=${query}`;
    }, [searchValue, searchType]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Revolutionary Background */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Nova Ipê - Guararema Premium Real Estate"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={95}
                    priority
                    className="transform scale-105"
                />
                {/* Dramatic overlay for maximum impact */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/75 to-black/90" />
                {/* Premium light accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/10 to-transparent" />
            </div>

            {/* Main Content Container */}
            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Hero Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left Column - Main Message */}
                        <div className="text-center lg:text-left">
                            
                            {/* Exclusive Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 backdrop-blur-xl px-6 py-3 rounded-full border border-amber-400/40 mb-8"
                            >
                                <Star className="w-4 h-4 text-amber-300 animate-pulse" />
                                <span className="text-amber-200 text-sm font-bold tracking-wider">EXCLUSIVO EM GUARAREMA</span>
                            </motion.div>

                            {/* Revolutionary Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tight"
                            >
                                <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-amber-200 mb-4">
                                    Você merece mais que
                                </span>
                                O IMÓVEL{' '}
                                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent animate-pulse">
                                    PERFEITO
                                </span>
                                <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 text-amber-100">
                                    está aqui.
                                </span>
                            </motion.h1>

                            {/* Provocative Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto lg:mx-0 leading-relaxed mb-12 font-medium"
                            >
                                Pare de sonhar. <span className="text-amber-300 font-bold">Comece a viver.</span><br/>
                                Em 15 anos, mudamos a vida de mais de 1.000 famílias em Guararema.<br/>
                                <span className="text-white font-semibold">Agora é a sua vez.</span>
                            </motion.p>

                            {/* Power Metrics */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                            >
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-3xl font-black text-white">R$ 120M+</span>
                                    </div>
                                    <p className="text-amber-200 font-semibold text-sm">Negociados em 2024</p>
                                    <p className="text-slate-300 text-xs mt-1">Volume recorde de vendas</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Award className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-3xl font-black text-white">200+</span>
                                    </div>
                                    <p className="text-amber-200 font-semibold text-sm">Imóveis Premium</p>
                                    <p className="text-slate-300 text-xs mt-1">Portfólio exclusivo</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Heart className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-3xl font-black text-white">1000+</span>
                                    </div>
                                    <p className="text-amber-200 font-semibold text-sm">Famílias Realizadas</p>
                                    <p className="text-slate-300 text-xs mt-1">Sonhos concretizados</p>
                                </div>
                            </motion.div>

                            {/* Urgent CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <button className="group relative bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/50 transform hover:scale-105">
                                    <span className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                                        VER IMÓVEIS AGORA
                                    </span>
                                </button>
                                
                                <button className="group border-2 border-white/30 hover:border-amber-400 text-white hover:text-amber-400 font-semibold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm">
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 group-hover:animate-pulse" />
                                        AVALIAR MEU IMÓVEL
                                    </span>
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Column - Search Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
                        >
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
                                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                                    Busca Inteligente
                                </h2>
                                <p className="text-neutral-600 text-sm mb-6">
                                    Encontre o imóvel perfeito para você
                                </p>

                                {/* Search Tabs */}
                                <div className="flex space-x-2 mb-6">
                                    {searchTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSearchType(tab.id)}
                                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                searchType === tab.id
                                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                        >
                                            <span className="mr-2">{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="Digite o bairro ou região..."
                                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/50 transform hover:scale-105"
                                    >
                                        <Search className="w-5 h-5" />
                                        BUSCAR AGORA
                                    </button>
                                </form>

                                {/* Quick Stats */}
                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-amber-600">98%</div>
                                            <div className="text-xs text-neutral-600">Satisfação</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-amber-600">24h</div>
                                            <div className="text-xs text-neutral-600">Resposta</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-white/60 text-sm font-medium">Explore mais</span>
                    <ChevronDown className="w-6 h-6 text-white/60 animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}
