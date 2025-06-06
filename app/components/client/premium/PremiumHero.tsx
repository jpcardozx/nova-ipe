'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Play, Pause } from 'lucide-react';

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

const PremiumHero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
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
        setTimeout(() => setIsPlaying(true), 3000); // Resume after 3s
    }, []);

    const currentSlideData = heroSlides[currentSlide];

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
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
                            filter: 'brightness(0.4)'
                        }}
                    />
                </AnimatePresence>
            </motion.div>

            {/* Gradient Overlays */}            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-amber-800/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-transparent to-amber-800/30 z-10" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden z-15">
                {[...Array(12)].map((_, i) => (<motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    animate={{
                        y: [-20, -800], // Fixed: Use fixed value instead of window.innerHeight
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.max(4, Math.random() * 3 + 4), // Fixed: Ensure minimum duration
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '100%',
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden',
                        willChange: 'transform, opacity'
                    }}
                />
                ))}
            </div>

            {/* Main Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-20 container mx-auto px-6 text-white"
            >
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center lg:text-left"
                        >
                            {/* Highlight Badge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl"
                            >
                                ✨ {currentSlideData.highlight}
                            </motion.div>

                            {/* Main Title */}
                            <motion.h1
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                            >
                                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    {currentSlideData.title}
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="text-xl lg:text-2xl mb-4 text-blue-100 font-medium"
                            >
                                {currentSlideData.subtitle}
                            </motion.p>

                            {/* Description */}
                            <motion.p
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="text-lg mb-10 text-slate-300 max-w-3xl mx-auto lg:mx-0"
                            >
                                {currentSlideData.description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <motion.a
                                    href={currentSlideData.cta.primary.href}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300"
                                >
                                    <span className="relative z-10">{currentSlideData.cta.primary.text}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.a>

                                <motion.a
                                    href={currentSlideData.cta.secondary.href}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
                                >
                                    {currentSlideData.cta.secondary.text}
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Slide Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                <div className="flex items-center space-x-6">
                    {/* Play/Pause Button */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                        ) : (
                            <Play className="w-5 h-5 text-white" />
                        )}
                    </button>

                    {/* Slide Indicators */}
                    <div className="flex space-x-3">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlideChange(index)}
                                className="group relative"
                            >
                                <div className={`w-12 h-1 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white'
                                    : 'bg-white/40 group-hover:bg-white/60'
                                    }`} />
                                {index === currentSlide && (
                                    <motion.div
                                        layoutId="activeSlide"
                                        className="absolute inset-0 w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 right-8 z-30"
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

            {/* Performance Stats Overlay */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="absolute top-1/2 right-8 transform -translate-y-1/2 z-30 hidden xl:block"
            >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-400">15+</div>
                            <div className="text-xs text-slate-300">Anos de Mercado</div>
                        </div>
                        <div className="w-px h-8 bg-white/20 mx-auto" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">450+</div>
                            <div className="text-xs text-slate-300">Imóveis Vendidos</div>
                        </div>
                        <div className="w-px h-8 bg-white/20 mx-auto" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">92%</div>
                            <div className="text-xs text-slate-300">Satisfação</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default PremiumHero;
