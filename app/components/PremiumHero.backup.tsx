'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, TrendingUp, Award, Users } from 'lucide-react';
import Image from 'next/image';

type SearchType = 'comprar' | 'alugar' | 'investir';

interface SearchTab {
    id: SearchType;
    label: string;
    icon: string;
    description: string;
}

interface Metric {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

export default function PremiumHero() {
    const [searchType, setSearchType] = useState<SearchType>('comprar');
    const [searchValue, setSearchValue] = useState('');

    const searchTabs: SearchTab[] = [
        { id: 'comprar', label: 'Comprar', icon: '🏡', description: 'Encontre sua casa dos sonhos' },
        { id: 'alugar', label: 'Alugar', icon: '🔑', description: 'Alugue com segurança total' },
        { id: 'investir', label: 'Investir', icon: '📈', description: 'Multiplique seu patrimônio' },
    ];

    const metrics: Metric[] = [
        {
            value: "R$ 120M+",
            label: "Negociados em 2024",
            description: "Volume recorde de vendas",
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            value: "200+",
            label: "Imóveis Premium",
            description: "Portfólio exclusivo",
            icon: <Award className="w-5 h-5" />
        },
        {
            value: "1000+",
            label: "Famílias Realizadas",
            description: "Clientes satisfeitos",
            icon: <Users className="w-5 h-5" />
        }
    ];

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        const query = encodeURIComponent(searchValue.trim());
        window.location.href = `/${searchType}?q=${query}`;
    }, [searchValue, searchType]); return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Dynamic Background with Parallax Effect */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Portfólio Exclusivo Nova Ipê - Guararema Premium"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={95}
                    priority
                    className="transform scale-105 transition-transform duration-[20s] ease-out"
                />
                {/* Sophisticated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-black/60" />
                {/* Dynamic light overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/5 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 py-32">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Content */}
                    <div className="text-center mb-16">
                        {/* Premium Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-amber-400/20 backdrop-blur-xl px-6 py-3 rounded-full border border-amber-400/30 mb-8"
                        >
                            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-amber-200 text-sm font-semibold tracking-wide">LÍDER ABSOLUTO EM GUARAREMA</span>
                        </motion.div>                        {/* Revolutionary Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tight"
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
                            className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-12 font-medium"
                        >
                            Pare de sonhar. <span className="text-amber-300 font-bold">Comece a viver.</span><br />
                            Em 15 anos, mudamos a vida de mais de 1.000 famílias em Guararema.<br />
                            <span className="text-white font-semibold">Agora é a sua vez.</span>
                        </motion.p>

                        {/* Compelling Metrics Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
                        >
                            {metrics.map((metric, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                                    className="text-center group"
                                >
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                                        <div className="flex items-center justify-center mb-3 text-amber-400">
                                            {metric.icon}
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                                        <div className="text-amber-200 font-semibold text-sm mb-1">{metric.label}</div>
                                        <div className="text-slate-300 text-xs">{metric.description}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>                    </div>

                    {/* Search Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
                            <h2 className="text-2xl font-medium text-neutral-800 mb-6">
                                Busca Personalizada
                            </h2>

                            {/* Tabs de Busca */}
                            <div className="flex space-x-2 mb-6">
                                {searchTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSearchType(tab.id)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${searchType === tab.id
                                            ? 'bg-amber-500 text-white shadow-sm'
                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Campo de Busca */}
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Digite o bairro ou região..."
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Search className="w-5 h-5" />
                                    Buscar Imóveis
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Sugestão de Scroll */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-neutral-400 text-sm">Explorar</span>
                    <ChevronDown className="w-5 h-5 text-neutral-400 animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}
