'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, TrendingUp, Award, Users, Star, CheckCircle, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';

type SearchType = 'comprar' | 'alugar' | 'investir';

interface SearchTab {
    id: SearchType;
    label: string;
    icon: string;
    description: string;
    urgency: string;
}

interface Metric {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    highlight?: boolean;
}

export default function PremiumHero() {
    const [searchType, setSearchType] = useState<SearchType>('comprar');
    const [searchValue, setSearchValue] = useState('');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const searchTabs: SearchTab[] = [
        {
            id: 'comprar',
            label: 'Comprar',
            icon: '🏡',
            description: 'Realize o sonho da casa própria',
            urgency: 'Últimas 48h: 12 propriedades vendidas'
        },
        {
            id: 'alugar',
            label: 'Alugar',
            icon: '🔑',
            description: 'More com segurança total',
            urgency: 'Taxa de aprovação: 94% em 24h'
        },
        {
            id: 'investir',
            label: 'Investir',
            icon: '📈',
            description: 'Multiplique seu patrimônio',
            urgency: 'ROI médio: 18% ao ano'
        },
    ];

    const metrics: Metric[] = [
        {
            value: "R$ 180M+",
            label: "Vendidos em 2024",
            description: "Volume recorde de negócios",
            icon: <TrendingUp className="w-6 h-6" />,
            highlight: true
        },
        {
            value: "300+", label: "Imóveis Premium",
            description: "Portfólio ativo selecionado",
            icon: <Award className="w-6 h-6" />
        },
        {
            value: "1.200+",
            label: "Famílias Realizadas",
            description: "Sonhos transformados em realidade",
            icon: <Users className="w-6 h-6" />
        }
    ];

    const testimonials = [
        {
            text: "A Nova Ipê vendeu nossa casa em 15 dias pelo preço que queríamos. Profissionalismo excepcional!",
            author: "Marina Silva",
            role: "Cliente Vendedora",
            rating: 5
        },
        {
            text: "Encontramos o investimento perfeito em Guararema. ROI de 22% no primeiro ano!",
            author: "Carlos Eduardo",
            role: "Investidor",
            rating: 5
        },
        {
            text: "Processo de compra transparente e ágil. Recomendo sem hesitar!",
            author: "Família Oliveira",
            role: "Compradores",
            rating: 5
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        const query = encodeURIComponent(searchValue.trim());
        window.location.href = `/${searchType}?q=${query}`;
    }, [searchValue, searchType]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Enhanced Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Guararema Premium Real Estate - Nova Ipê"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={95}
                    priority
                    className="transform scale-105"
                />
                {/* Sophisticated Multi-Layer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-black/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Subtle Brand Accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
            </div>

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                        initial={{
                            x: Math.random() * 1200,
                            y: 800,
                        }}
                        animate={{
                            y: -10,
                            x: Math.random() * 1200,
                        }}
                        transition={{
                            duration: Math.random() * 10 + 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Content */}
                    <div className="text-center mb-12">
                        {/* Urgency Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-amber-500/20 backdrop-blur-xl px-8 py-4 rounded-full border border-amber-400/40 mb-8"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                                <span className="text-red-300 text-sm font-bold tracking-wide">MERCADO AQUECIDO</span>
                            </div>
                            <span className="text-amber-200 text-sm">•</span>
                            <span className="text-amber-200 text-sm font-semibold">Preços subiram 23% em 6 meses</span>
                        </motion.div>

                        {/* Power Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8"
                        >
                            <span className="block">Pare de</span>
                            <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                                SONHAR
                            </span>
                            <span className="block text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
                                Comece a <span className="text-amber-400">CONQUISTAR</span>
                            </span>
                        </motion.h1>

                        {/* Compelling Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8 font-medium"
                        >
                            Em Guararema, cada dia que você espera é dinheiro que você perde.
                            <span className="text-amber-300 font-bold"> A Nova Ipê </span>
                            já garantiu o futuro de mais de 1.200 famílias.
                            <span className="block mt-2 text-lg text-amber-200">
                                Qual será sua próxima conquista?
                            </span>
                        </motion.p>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-white font-semibold">4.9/5</span>
                                <span className="text-slate-300">• 847 avaliações</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">98% taxa de sucesso</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-semibold">Média 45 dias para vender</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced Search Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="max-w-5xl mx-auto bg-white/98 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20 mb-16"
                    >
                        {/* Search Tabs */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {searchTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSearchType(tab.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${searchType === tab.id
                                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-500/20'
                                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{tab.icon}</span>
                                        <span className={`text-xl font-bold ${searchType === tab.id ? 'text-amber-700' : 'text-gray-700'
                                            }`}>
                                            {tab.label}
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-2 ${searchType === tab.id ? 'text-amber-600' : 'text-gray-600'
                                        }`}>
                                        {tab.description}
                                    </p>
                                    <p className={`text-xs font-semibold ${searchType === tab.id ? 'text-orange-600' : 'text-gray-500'
                                        }`}>
                                        {tab.urgency}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 w-6 h-6" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={`Buscar imóveis para ${searchType} em Guararema...`}
                                    className="w-full pl-14 pr-6 py-6 text-xl border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-0 transition-all duration-300"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold py-6 px-8 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-amber-500/30 group"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <Search className="w-6 h-6" />
                                        Encontrar Agora
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="md:w-auto bg-gray-800 text-white text-xl font-bold py-6 px-8 rounded-2xl hover:bg-gray-700 transition-all duration-300 group"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <Play className="w-5 h-5" />
                                        Ver Tour Virtual
                                    </span>
                                </button>
                            </div>
                        </form>

                        {/* Urgency Message */}                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl">
                            <p className="text-blue-700 text-sm font-semibold text-center">
                                💡 <span className="text-blue-800">INFORMAÇÃO:</span> Diversas propriedades disponíveis em nosso portfólio selecionado
                            </p>
                        </div>
                    </motion.div>

                    {/* Powerful Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
                    >
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                                className={`text-center group cursor-pointer ${metric.highlight ? 'transform scale-110' : ''
                                    }`}
                            >
                                <div className={`${metric.highlight
                                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/50'
                                    : 'bg-white/10 border-white/20'
                                    } backdrop-blur-xl rounded-3xl p-8 border hover:bg-white/15 transition-all duration-500 group-hover:scale-105`}>
                                    <div className={`flex items-center justify-center mb-4 ${metric.highlight ? 'text-amber-400' : 'text-white'
                                        }`}>
                                        {metric.icon}
                                    </div>
                                    <div className={`text-4xl font-black mb-2 ${metric.highlight ? 'text-amber-300' : 'text-white'
                                        }`}>
                                        {metric.value}
                                    </div>
                                    <div className={`font-bold text-lg mb-2 ${metric.highlight ? 'text-amber-200' : 'text-amber-200'
                                        }`}>
                                        {metric.label}
                                    </div>
                                    <div className="text-slate-300 text-sm">{metric.description}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Rotating Testimonial */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-xl text-white mb-6 italic leading-relaxed">
                                    "{testimonials[currentTestimonial].text}"
                                </blockquote>
                                <div className="text-amber-300 font-bold text-lg">
                                    {testimonials[currentTestimonial].author}
                                </div>
                                <div className="text-amber-200 text-sm">
                                    {testimonials[currentTestimonial].role}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}