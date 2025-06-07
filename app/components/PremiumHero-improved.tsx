'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, TrendingUp, Award, Users, Star, CheckCircle, ArrowRight, Home } from 'lucide-react';
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
    highlight?: boolean;
}

export default function PremiumHeroImproved() {
    const [searchType, setSearchType] = useState<SearchType>('comprar');
    const [searchValue, setSearchValue] = useState('');
    const [currentTestimonial, setCurrentTestimonial] = useState(0); const searchTabs: SearchTab[] = [
        {
            id: 'comprar',
            label: 'Comprar',
            icon: '🏡',
            description: 'Propriedades à venda'
        },
        {
            id: 'alugar',
            label: 'Alugar',
            icon: '🔑',
            description: 'Imóveis para locação'
        },
        {
            id: 'investir',
            label: 'Investir',
            icon: '📈',
            description: 'Oportunidades de investimento'
        },
    ]; const metrics: Metric[] = [
        {
            value: "2009",
            label: "Fundação",
            description: "Tradição em Guararema",
            icon: <Award className="w-6 h-6" />,
            highlight: true
        },
        {
            value: "300+",
            label: "Propriedades",
            description: "Portfólio criterioso",
            icon: <Home className="w-6 h-6" />
        },
        {
            value: "15+",
            label: "Anos",
            description: "Conhecimento local",
            icon: <MapPin className="w-6 h-6" />
        }
    ]; const testimonials = [
        {
            text: "Atendimento personalizado e processo eficiente na aquisição da nossa casa.",
            author: "Marina Silva",
            role: "Cliente"
        },
        {
            text: "A assessoria na venda de nossa propriedade foi precisa e profissional.",
            author: "Carlos Eduardo",
            role: "Vendedor"
        },
        {
            text: "Processo de negociação conduzido com transparência e atenção aos detalhes.",
            author: "Família Oliveira",
            role: "Compradores"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
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
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Guararema Real Estate - Nova Ipê"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="max-w-6xl mx-auto">

                    {/* Hero Content */}
                    <div className="text-center mb-16">
                        {/* Brand Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/40 mb-8"
                        >
                            <span className="text-amber-300 text-sm font-medium">Nova Ipê</span>
                            <span className="text-amber-200 text-sm">• Guararema desde 2009</span>
                        </motion.div>

                        {/* Hero Headline */}                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
                        >
                            Imóveis selecionados em{' '}
                            <span className="text-amber-300">
                                Guararema
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-3xl mx-auto"
                        >                            Desde 2009 oferecendo atendimento especializado e um portfólio
                            criterioso de propriedades para venda e locação em Guararema.
                        </motion.p>                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
                        >
                            <div className="flex items-center gap-2 text-slate-300">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="font-medium">Excelência em atendimento</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="font-medium">Compromisso com transparência</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span className="font-medium">CRECI 29.159-J</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Search Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-2xl mb-16"
                    >
                        {/* Search Tabs */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {searchTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSearchType(tab.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${searchType === tab.id
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{tab.icon}</div>
                                    <div className={`font-semibold mb-1 ${searchType === tab.id ? 'text-amber-700' : 'text-gray-700'
                                        }`}>
                                        {tab.label}
                                    </div>
                                    <div className={`text-sm ${searchType === tab.id ? 'text-amber-600' : 'text-gray-600'
                                        }`}>
                                        {tab.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={`Buscar imóveis para ${searchType} em Guararema...`}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-0 transition-all duration-300"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg group"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <Search className="w-5 h-5" />
                                    Buscar Imóveis
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    </motion.div>

                    {/* Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16"
                    >
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                                className="text-center"
                            >
                                <div className={`${metric.highlight
                                    ? 'bg-amber-500/20 border-amber-400/50'
                                    : 'bg-white/10 border-white/20'
                                    } backdrop-blur-sm rounded-2xl p-6 border hover:bg-white/15 transition-all duration-300`}>
                                    <div className={`flex items-center justify-center mb-4 ${metric.highlight ? 'text-amber-400' : 'text-white'
                                        }`}>
                                        {metric.icon}
                                    </div>
                                    <div className={`text-3xl font-bold mb-2 ${metric.highlight ? 'text-amber-300' : 'text-white'
                                        }`}>
                                        {metric.value}
                                    </div>
                                    <div className="font-semibold text-lg mb-2 text-amber-200">
                                        {metric.label}
                                    </div>
                                    <div className="text-slate-300 text-sm">{metric.description}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Testimonial */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-lg text-white mb-4 leading-relaxed">
                                    "{testimonials[currentTestimonial].text}"
                                </blockquote>
                                <div className="text-amber-300 font-semibold">
                                    {testimonials[currentTestimonial].author}
                                </div>
                                <div className="text-amber-200 text-sm">
                                    {testimonials[currentTestimonial].role}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>        </section>
    );
}
