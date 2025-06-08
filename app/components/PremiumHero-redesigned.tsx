'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Search,
    Home,
    MapPin,
    TrendingUp,
    Star,
    Award,
    Users,
    ArrowRight,
    Building2,
    Shield,
    Target,
    CheckCircle,
    Play,
    Pause,
    ChevronDown,
    Mail,
    Phone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    highlight: string;
    description: string;
    image: string;
    ctaPrimary: { text: string; href: string };
    ctaSecondary: { text: string; href: string };
}

const heroSlides: HeroSlide[] = [
    {
        id: 'dream',
        title: 'Seu Novo Lar',
        subtitle: 'O lugar perfeito onde sua família crescerá',
        highlight: 'Mais de 1.200 famílias já encontraram',
        description: 'Transformamos a busca pelo lar ideal em uma jornada tranquila e segura. Cada casa tem uma história única esperando por você.',
        image: '/images/escritorioInterior.jpg',
        ctaPrimary: { text: 'Encontrar Meu Lar', href: '/imoveis' },
        ctaSecondary: { text: 'Agendar Visita', href: '/contato' }
    },
    {
        id: 'investment',
        title: 'Patrimônio Inteligente',
        subtitle: 'Invista onde o futuro já chegou',
        highlight: 'Valorização média de 12% ao ano',
        description: 'Guararema cresce, e quem investe aqui colhe os frutos de uma região em expansão. Descubra oportunidades que geram renda hoje e valorizam amanhã.',
        image: '/images/hero-investment.jpg',
        ctaPrimary: { text: 'Ver Investimentos', href: '/investimentos' },
        ctaSecondary: { text: 'Simular Rendimento', href: '/consultoria' }
    },
    {
        id: 'location',
        title: 'Viva Guararema',
        subtitle: 'Qualidade de vida que você merece',
        highlight: 'A 60km de São Paulo, longe do caos',
        description: 'Respire ar puro, tenha segurança, natureza e ainda assim esteja conectado com tudo. Guararema oferece o melhor dos dois mundos.',
        image: '/images/hero-experience.jpg',
        ctaPrimary: { text: 'Conhecer a Região', href: '/guararema' },
        ctaSecondary: { text: 'Agendar Tour', href: '/tour' }
    }
];

const trustIndicators = [
    {
        icon: Home,
        title: '1.200+',
        subtitle: 'Lares Conquistados',
        description: 'Famílias vivendo seus sonhos'
    },
    {
        icon: MapPin,
        title: 'Guararema',
        subtitle: 'Nossa Especialidade',
        description: 'Conhecemos cada cantinho da cidade'
    },
    {
        icon: TrendingUp,
        title: '12%',
        subtitle: 'Valorização/Ano',
        description: 'Crescimento médio da região'
    },
    {
        icon: Star,
        title: '15 Anos',
        subtitle: 'De Confiança',
        description: 'Tradição em realizar sonhos'
    }
];

export default function PremiumHeroRedesigned() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { scrollY } = useScroll();

    // Parallax mais sutil e natural
    const y = useTransform(scrollY, [0, 1000], [0, 150]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0.85]);
    const scale = useTransform(scrollY, [0, 600], [1, 1.02]);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 9000); // Mais tempo para absorver o conteúdo

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const currentSlideData = heroSlides[currentSlide];

    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Variantes de animação mais sutis
    const slideVariants = {
        enter: { opacity: 0, x: 30, filter: "blur(4px)" },
        center: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -30, filter: "blur(4px)" }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        })
    };

    return (
        <section className="relative min-h-screen bg-slate-50 overflow-hidden">
            {/* Background Layer com transições suaves */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >        <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{
                            duration: 2,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={currentSlideData.image}
                            alt={currentSlideData.title}
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                        />
                        {/* Overlay mais sutil e elegante */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-slate-800/20" />
                    </motion.div>
                </AnimatePresence>
            </motion.div>      {/* Elementos geométricos mais sutis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <motion.div
                    className="absolute top-1/3 right-1/3 w-80 h-80 border border-amber-400/6 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-1/4 left-1/5 w-48 h-48 border border-amber-400/8 rounded-lg rotate-12"
                    animate={{
                        rotate: [12, 32, 12],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content Layer */}
            <motion.div
                style={{ opacity }}
                className="relative z-20 container mx-auto px-6 lg:px-12 py-16"
            >
                <div className="grid lg:grid-cols-12 gap-8 items-center min-h-screen">

                    {/* Main Content com animações mais naturais */}
                    <div className="lg:col-span-7 space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 1.2,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                className="space-y-6"
                            >                {/* Professional Badge com animação mais sutil */}
                                <motion.div
                                    custom={0}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/8 backdrop-blur-xl border border-white/15 rounded-full text-amber-300 text-sm font-medium"
                                >
                                    <motion.div
                                        className="w-2 h-2 bg-amber-400 rounded-full"
                                        animate={{
                                            opacity: [0.7, 1, 0.7],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <span>{currentSlideData.highlight}</span>
                                </motion.div>

                                {/* Main Title com stagger natural */}
                                <motion.h1
                                    custom={1}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-5xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight"
                                >
                                    <motion.span
                                        className="block font-extralight text-slate-200"
                                        custom={1.5}
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {currentSlideData.title.split(' ').slice(0, -1).join(' ')}
                                    </motion.span>
                                    <motion.span
                                        className="block font-medium bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent"
                                        custom={2}
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {currentSlideData.title.split(' ').slice(-1)}
                                    </motion.span>
                                </motion.h1>

                                {/* Subtitle */}
                                <motion.p
                                    custom={2.5}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-2xl text-slate-300 font-light leading-relaxed max-w-2xl"
                                >
                                    {currentSlideData.subtitle}
                                </motion.p>                {/* Description */}
                                <motion.p
                                    custom={3}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-lg text-slate-400 leading-relaxed max-w-xl"
                                >
                                    {currentSlideData.description}
                                </motion.p>

                                {/* Call to Actions com hover mais sutil */}
                                <motion.div
                                    custom={4}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="flex flex-col sm:flex-row gap-4 pt-6"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-10 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-500 group hover:scale-[1.02]"
                                        asChild
                                    >
                                        <Link href={currentSlideData.ctaPrimary.href}>
                                            {currentSlideData.ctaPrimary.text}
                                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-white/25 text-white hover:bg-white/8 hover:border-white/40 px-10 py-4 text-lg backdrop-blur-xl rounded-full transition-all duration-500 hover:scale-[1.02]"
                                        asChild
                                    >
                                        <Link href={currentSlideData.ctaSecondary.href}>
                                            {currentSlideData.ctaSecondary.text}
                                        </Link>
                                    </Button>
                                </motion.div>

                                {/* Quick Contact mais integrado */}
                                <motion.div
                                    custom={5}
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="flex items-center gap-6 pt-4"
                                >
                                    <motion.div
                                        className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Phone className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium">(11) 4693-8200</span>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Mail className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium">contato@novaipe.com.br</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Trust Indicators - Redesigned sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {trustIndicators.map((indicator, index) => {
                                const Icon = indicator.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 + index * 0.1 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3">
                                            <div className="p-3 bg-amber-500/20 rounded-xl group-hover:bg-amber-500/30 transition-colors">
                                                <Icon className="h-6 w-6 text-amber-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                {indicator.title}
                                            </div>
                                            <div className="text-sm font-medium text-slate-300">
                                                {indicator.subtitle}
                                            </div>
                                            <div className="text-xs text-slate-400 text-center">
                                                {indicator.description}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Info Card focado no cliente */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Sua Nova Vida em Guararema</div>
                                    <div className="text-slate-400 text-sm">Onde tranquilidade encontra oportunidade</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 leading-relaxed">
                                Imagine acordar com vista para a natureza, mas a 60km de SP. Aqui você encontra segurança, qualidade de vida e o melhor investimento para seu futuro.
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                <span>Consultoria completa inclusa</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Slide Navigation - Mais minimalista */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                >                    <div className="flex gap-2">
                        {heroSlides.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleSlideChange(index)}
                                className={`h-1 rounded-full transition-all duration-700 ease-out ${index === currentSlide
                                    ? 'w-8 bg-amber-500'
                                    : 'w-1 bg-slate-500 hover:bg-slate-400'
                                    }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <motion.span
                            key={currentSlide}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {String(currentSlide + 1).padStart(2, '0')}
                        </motion.span>
                        <span className="text-slate-600">/</span>
                        <span>{String(heroSlides.length).padStart(2, '0')}</span>
                    </div>

                    <motion.button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="p-2 hover:bg-white/8 rounded-full transition-all duration-300 text-slate-400 hover:text-slate-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isAutoPlaying ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </motion.div>
                    </motion.button>
                </motion.div>

                {/* Scroll Indicator - Mais elegante */}
                <motion.div
                    className="absolute bottom-8 right-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                >                    <motion.div
                    className="flex flex-col items-center gap-2 text-slate-400 cursor-pointer group"
                    animate={{
                        y: [0, 6, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.1 }}
                >
                        <div className="text-xs font-medium tracking-wider group-hover:text-slate-300 transition-colors duration-300">
                            EXPLORAR
                        </div>
                        <motion.div
                            animate={{
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
