'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Play, Pause, Search, MapPin, Home, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    highlight: string;
    description: string;
    image: string;
    cta: {
        primary: { text: string; href: string };
        secondary: { text: string; href: string };
    };
}

const heroSlides: HeroSlide[] = [
    {
        id: 'investment',
        title: 'Seu investimento inteligente em Guararema',
        subtitle: 'Propriedades selecionadas com alto potencial de valorização',
        highlight: 'R$ 120M+ negociados',
        description: 'Especialistas em identificar oportunidades únicas no mercado imobiliário de Guararema',
        image: '/images/hero-investment.jpg',
        cta: {
            primary: { text: 'Ver Oportunidades', href: '/comprar' },
            secondary: { text: 'Análise Gratuita', href: '/analise' }
        }
    },
    {
        id: 'experience',
        title: 'Experiência que transforma sonhos em realidade',
        subtitle: '15 anos construindo histórias de sucesso',
        highlight: '92% de satisfação',
        description: 'Do primeiro contato à entrega das chaves, acompanhamos cada etapa da sua jornada',
        image: '/images/hero-experience.jpg',
        cta: {
            primary: { text: 'Conhecer História', href: '/sobre' },
            secondary: { text: 'Falar com Especialista', href: '/contato' }
        }
    },
    {
        id: 'innovation',
        title: 'Tecnologia e inovação a seu favor',
        subtitle: 'Ferramentas avançadas para decisões precisas',
        highlight: 'IA + Expertise humana',
        description: 'Combinamos inteligência artificial com conhecimento local para resultados excepcionais',
        image: '/images/hero-innovation.jpg',
        cta: {
            primary: { text: 'Ver Tecnologia', href: '/tecnologia' },
            secondary: { text: 'Demo Gratuita', href: '/demo' }
        }
    }
];

const EnhancedPremiumHero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchType, setSearchType] = useState('comprar');
    const { scrollY } = useScroll();

    // Parallax effects
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Auto-slide functionality
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    // Initial animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSlideChange = useCallback((index: number) => {
        setCurrentSlide(index);
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 8000); // Resume after 8s
    }, []);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        // Converter para URL-friendly
        const query = encodeURIComponent(searchValue.trim());
        window.location.href = `/${searchType}?q=${query}`;
    }, [searchValue, searchType]);

    const currentSlideData = heroSlides[currentSlide];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Images with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${currentSlideData.image})`,
                            filter: 'brightness(0.5)'
                        }}
                    />
                </AnimatePresence>
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-amber-800/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-transparent to-transparent z-10" />

            {/* Golden Particles */}
            <div className="absolute inset-0 overflow-hidden z-10 opacity-60">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-300 rounded-full"
                        animate={{
                            x: [Math.random() * 100, Math.random() * 100 + 50],
                            y: [Math.random() * 100, Math.random() * 100 + 900],
                            opacity: [0.2, 0.8, 0]
                        }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: -10,
                            scale: Math.random() * 2 + 0.5
                        }}
                        transition={{
                            duration: Math.random() * 20 + 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 z-20 py-24">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Left Column - Hero Content */}
                    <div className="lg:col-span-3 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                {/* Tag line */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="mb-3"
                                >
                                    <span className="inline-block bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent text-lg font-semibold tracking-wider">
                                        {currentSlideData.highlight}
                                    </span>
                                </motion.div>

                                {/* Main title */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                    {currentSlideData.title}
                                </h1>

                                {/* Subtitle */}
                                <p className="text-xl text-white/80 mb-8 max-w-2xl">
                                    {currentSlideData.description}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={currentSlideData.cta.primary.href}
                                        className="relative overflow-hidden group px-7 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            {currentSlideData.cta.primary.text}
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </a>
                                    <a
                                        href={currentSlideData.cta.secondary.href}
                                        className="px-7 py-3 bg-transparent border border-white/30 hover:border-white/60 text-white font-medium rounded-lg transition-all hover:bg-white/10"
                                    >
                                        {currentSlideData.cta.secondary.text}
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Search Panel */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
                        >
                            <h2 className="text-white text-2xl font-bold mb-6">Encontre seu imóvel</h2>

                            {/* Search Tabs */}
                            <div className="flex mb-6 bg-white/5 rounded-lg p-1">
                                <button
                                    onClick={() => setSearchType('comprar')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${searchType === 'comprar'
                                        ? 'bg-amber-500 text-white'
                                        : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    Comprar
                                </button>
                                <button
                                    onClick={() => setSearchType('alugar')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${searchType === 'alugar'
                                        ? 'bg-amber-500 text-white'
                                        : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    Alugar
                                </button>
                                <button
                                    onClick={() => setSearchType('investir')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${searchType === 'investir'
                                        ? 'bg-amber-500 text-white'
                                        : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    Investir
                                </button>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch}>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-300 h-5 w-5" />
                                        <input
                                            type="text"
                                            placeholder="Bairro, cidade ou região..."
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-lg transition-all flex items-center justify-center"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Buscar Imóveis
                                    </button>
                                </div>
                            </form>

                            {/* Stats */}
                            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                <div className="text-white">
                                    <div className="text-amber-300 text-xl font-bold">230+</div>
                                    <div className="text-xs text-white/60">Imóveis</div>
                                </div>
                                <div className="text-white">
                                    <div className="text-amber-300 text-xl font-bold">15+</div>
                                    <div className="text-xs text-white/60">Anos</div>
                                </div>
                                <div className="text-white">
                                    <div className="text-amber-300 text-xl font-bold">98%</div>
                                    <div className="text-xs text-white/60">Satisfação</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Slide Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 flex items-center justify-center space-x-4"
                >
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlideChange(index)}
                            className="group relative"
                        >
                            <div className={`w-12 h-1 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-white'
                                : 'bg-white/40 group-hover:bg-white/60'
                                }`}
                            />
                            {index === currentSlide && (
                                <motion.div
                                    layoutId="activeSlide"
                                    className="absolute inset-0 w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            >
                <div className="flex flex-col items-center text-white/80">
                    <span className="text-sm mb-2 font-medium">Explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default EnhancedPremiumHero;
