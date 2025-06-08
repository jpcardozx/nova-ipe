'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
    Home,
    MapPin,
    TrendingUp,
    Star,
    Phone,
    MessageCircle,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Shield,
    Clock,
    Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ContentSegment {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    highlight: string;
    cta: string;
    href: string;
    benefits: string[];
}

const contentSegments: ContentSegment[] = [
    {
        id: 'home',
        title: 'Residências Exclusivas',
        subtitle: 'Imóveis cuidadosamente selecionados para famílias exigentes',
        description: 'Nossa curadoria de 15 anos identifica propriedades que combinam localização privilegiada, arquitetura diferenciada e potencial de valorização em Guararema.',
        highlight: 'Consultoria imobiliária personalizada',
        cta: 'Explorar Portfólio Residencial',
        href: '/imoveis',
        benefits: ['Consultoria especializada', 'Due diligence completa', 'Suporte jurídico incluso']
    },
    {
        id: 'investment',
        title: 'Oportunidades de Investimento',
        subtitle: 'Ativos imobiliários com retorno consistente e valorização sólida',
        description: 'Guararema representa uma das regiões de maior potencial imobiliário do interior paulista, oferecendo segurança de investimento e crescimento sustentável.',
        highlight: 'Track record de 12% a.a. de valorização',
        cta: 'Acessar Relatório de Mercado',
        href: '/investimentos',
        benefits: ['ROI transparente', 'Análise fundamentalista', 'Acompanhamento dedicado']
    },
    {
        id: 'lifestyle',
        title: 'Lifestyle Premium',
        subtitle: 'Viva com qualidade excepcional a 60km da capital',
        description: 'Uma proposta de vida que combina a tranquilidade do interior com acesso direto às oportunidades metropolitanas, criando o ambiente ideal para famílias e profissionais.',
        highlight: 'Conectividade metropolitana preservando bem-estar',
        cta: 'Descobrir Guararema',
        href: '/regiao',
        benefits: ['Qualidade do ar superior', 'Segurança comprovada', 'Comunidade selecta']
    }
];

const LoadingShell = ({ isLoading, progress }: { isLoading: boolean; progress: number }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden"
                >
                    {/* Sophisticated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-600/10 to-amber-400/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-600/10 to-purple-400/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [360, 180, 0]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="relative text-center space-y-12 max-w-md mx-auto px-8">
                        {/* Premium Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            <motion.div
                                className="w-28 h-28 border-2 border-amber-500/40 rounded-3xl flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl shadow-2xl shadow-amber-500/20"
                                animate={{
                                    borderColor: ["rgba(245, 158, 11, 0.4)", "rgba(245, 158, 11, 0.8)", "rgba(245, 158, 11, 0.4)"],
                                    boxShadow: [
                                        "0 25px 50px -12px rgba(245, 158, 11, 0.2)",
                                        "0 25px 50px -12px rgba(245, 158, 11, 0.4)",
                                        "0 25px 50px -12px rgba(245, 158, 11, 0.2)"
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Home className="w-12 h-12 text-amber-400" />
                            </motion.div>

                            {/* Sophisticated Orbital Elements */}
                            <motion.div
                                className="absolute inset-0 border border-amber-500/20 rounded-3xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-[-8px] border border-amber-500/10 rounded-3xl"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-[-16px] border border-blue-500/10 rounded-3xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        {/* Premium Loading Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <h2 className="text-3xl font-light text-white tracking-wide">
                                    Preparando sua
                                </h2>
                                <h3 className="text-4xl font-semibold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                                    experiência premium
                                </h3>
                            </div>

                            {/* Sophisticated Progress Bar */}
                            <div className="w-80 mx-auto space-y-4">
                                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-full shadow-lg shadow-amber-500/50"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(progress + 10, 100)}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-medium">{Math.round(progress)}%</span>
                                    <span className="text-amber-400 font-medium">Nova Ipê</span>
                                </div>
                            </div>

                            {/* Dynamic Loading Messages */}
                            <motion.div
                                key={Math.floor(progress / 25)}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="text-slate-300 text-lg font-light leading-relaxed"
                            >
                                {progress < 25 && "Conectando às melhores oportunidades imobiliárias..."}
                                {progress >= 25 && progress < 50 && "Carregando portfólio exclusivo de propriedades..."}
                                {progress >= 50 && progress < 75 && "Preparando consultoria especializada personalizada..."}
                                {progress >= 75 && "Finalizando sua experiência premium..."}
                            </motion.div>
                        </motion.div>

                        {/* Elegant Loading Dots */}
                        <motion.div
                            className="flex justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-lg shadow-amber-500/50"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function InteractiveHero() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [activeSegment, setActiveSegment] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth mouse tracking
    const springMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    // Parallax transforms
    const y = useTransform(scrollY, [0, 1000], [0, 100]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0.9]);

    // Loading sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsLoading(false), 500);
                        setTimeout(() => setIsVisible(true), 800);
                        return 100;
                    }
                    return prev + Math.random() * 15 + 5;
                });
            }, 200);

            return () => clearInterval(interval);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Auto-rotate content segments
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setActiveSegment(prev => (prev + 1) % contentSegments.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [isVisible]);

    // Mouse movement handler
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;

        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        mouseX.set(x * 20);
        mouseY.set(y * 20);
    };

    const currentSegment = contentSegments[activeSegment];

    return (
        <>
            <LoadingShell isLoading={isLoading} progress={loadingProgress} />

            <motion.section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative min-h-screen bg-slate-900 overflow-hidden"
            >
                {/* Consolidated Background */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Nova Ipê - Imóveis em Guararema"
                        fill
                        className="object-cover"
                        quality={90}
                        priority
                    />

                    {/* Dynamic overlay that responds to content */}
                    <motion.div
                        key={activeSegment}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                        style={{
                            background: activeSegment === 0
                                ? "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 50%, rgba(15,23,42,0.9) 100%)"
                                : activeSegment === 1
                                    ? "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(22,48,63,0.8) 50%, rgba(15,23,42,0.85) 100%)"
                                    : "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(41,37,36,0.75) 50%, rgba(15,23,42,0.9) 100%)"
                        }}
                    />
                </motion.div>

                {/* Interactive particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    <motion.div
                        style={{ x: springMouseX, y: springMouseY }}
                        className="absolute top-1/4 right-1/3 w-64 h-64 border border-amber-400/5 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        style={{ x: springMouseX.get() * -0.5, y: springMouseY.get() * -0.5 }}
                        className="absolute bottom-1/3 left-1/4 w-32 h-32 border border-amber-400/8 rounded-lg"
                        animate={{ rotate: [0, 25, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Main Content */}
                <motion.div
                    style={{ opacity }}
                    className="relative z-20 container mx-auto px-6 lg:px-12 min-h-screen flex items-center"
                >
                    <div className="grid lg:grid-cols-12 gap-12 items-center w-full">

                        {/* Dynamic Content */}
                        <div className="lg:col-span-8 space-y-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSegment}
                                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="space-y-6"
                                >                                    {/* Highlight Badge - Premium Style */}
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-2xl border border-amber-500/30 rounded-2xl shadow-lg shadow-amber-500/10"
                                    >
                                        <motion.div
                                            className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-lg shadow-amber-400/50"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.8, 1, 0.8]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <span className="text-amber-100 text-base font-medium tracking-wide">
                                            {currentSegment.highlight}
                                        </span>
                                    </motion.div>                                    {/* Main Title - Ultra Premium Typography */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-6xl lg:text-8xl font-extralight text-white leading-[0.9] tracking-tight"
                                    >
                                        <motion.span
                                            className="block font-light text-slate-100 mb-2"
                                            custom={1.5}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                        >
                                            {currentSegment.title.split(' ').slice(0, -1).join(' ')}
                                        </motion.span>
                                        <motion.span
                                            className="block font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-lg"
                                            custom={2}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6, duration: 0.8 }}
                                        >
                                            {currentSegment.title.split(' ').slice(-1)}
                                        </motion.span>
                                    </motion.h1>

                                    {/* Premium Subtitle with Better Spacing */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-2xl lg:text-3xl text-slate-200 font-light leading-relaxed max-w-3xl tracking-wide"
                                        style={{
                                            fontFamily: "'Inter', 'system-ui', sans-serif",
                                            letterSpacing: '0.02em'
                                        }}
                                    >
                                        {currentSegment.subtitle}
                                    </motion.p>

                                    {/* Refined Description */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl"
                                        style={{
                                            fontFamily: "'Inter', 'system-ui', sans-serif",
                                            lineHeight: '1.7'
                                        }}
                                    >
                                        {currentSegment.description}
                                    </motion.p>{/* Benefits - Premium Pills */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex flex-wrap gap-3"
                                    >
                                        {currentSegment.benefits.map((benefit, index) => (
                                            <motion.div
                                                key={benefit}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7 + index * 0.1 }}
                                                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-2xl border border-emerald-400/30 rounded-xl shadow-lg hover:shadow-emerald-400/20 hover:border-emerald-400/50 transition-all duration-300 group"
                                            >
                                                <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                                                <span className="text-slate-200 text-sm font-medium tracking-wide">{benefit}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>                                    {/* Premium CTA System */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex flex-col sm:flex-row gap-6 pt-8"
                                    >
                                        {/* Primary CTA - Luxury Design */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700 group-hover:duration-200"></div>
                                            <Button
                                                size="lg"
                                                className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-700 hover:via-amber-600 hover:to-amber-500 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-500 border-0 group-hover:shadow-2xl"
                                                asChild
                                            >
                                                <Link href={currentSegment.href} className="flex items-center gap-3">
                                                    <span className="tracking-wide">{currentSegment.cta}</span>
                                                    <motion.div
                                                        className="bg-white/20 rounded-lg p-1"
                                                        whileHover={{ x: 4 }}
                                                        transition={{ type: "spring", stiffness: 400 }}
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </motion.div>
                                                </Link>
                                            </Button>
                                        </motion.div>

                                        {/* Contact Action Group */}
                                        <div className="flex gap-4">
                                            {/* Premium Phone CTA */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative group"
                                            >
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="relative bg-slate-800/90 border-2 border-slate-600/50 text-slate-200 hover:bg-slate-700/90 hover:border-slate-500 hover:text-white px-8 py-6 rounded-xl backdrop-blur-xl transition-all duration-300 shadow-xl group-hover:shadow-slate-500/20"
                                                    asChild
                                                >
                                                    <Link href="tel:+551146938200" className="flex items-center gap-3">
                                                        <motion.div
                                                            className="p-1.5 bg-emerald-500/20 rounded-lg"
                                                            whileHover={{ rotate: 12, scale: 1.1 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            <Phone className="w-4 h-4 text-emerald-400" />
                                                        </motion.div>
                                                        <span className="font-medium">Contato Direto</span>
                                                    </Link>
                                                </Button>
                                            </motion.div>

                                            {/* Premium WhatsApp CTA */}
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative group"
                                            >
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="relative bg-green-900/30 border-2 border-green-600/50 text-green-200 hover:bg-green-800/50 hover:border-green-500 hover:text-green-100 px-8 py-6 rounded-xl backdrop-blur-xl transition-all duration-300 shadow-xl group-hover:shadow-green-500/20"
                                                    asChild
                                                >
                                                    <Link href="https://wa.me/5511946938200" className="flex items-center gap-3">
                                                        <motion.div
                                                            className="p-1.5 bg-green-500/20 rounded-lg"
                                                            whileHover={{ scale: 1.15 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            <MessageCircle className="w-4 h-4 text-green-400" />
                                                        </motion.div>
                                                        <span className="font-medium">WhatsApp</span>
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>                        {/* Sophisticated Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Premium Navigation Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="space-y-4"
                            >
                                {contentSegments.map((segment, index) => (
                                    <motion.div
                                        key={segment.id}
                                        className="relative group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`absolute -inset-0.5 rounded-2xl blur transition duration-400 ${activeSegment === index
                                            ? 'bg-gradient-to-r from-amber-600 to-amber-400 opacity-50'
                                            : 'bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 group-hover:opacity-30'
                                            }`}></div>
                                        <motion.button
                                            onClick={() => setActiveSegment(index)}
                                            className={`relative w-full text-left p-6 rounded-2xl transition-all duration-500 backdrop-blur-2xl ${activeSegment === index
                                                ? 'bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-2 border-amber-500/40 text-white shadow-2xl shadow-amber-500/10'
                                                : 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/30 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500/50 hover:text-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    className={`w-4 h-4 rounded-lg transition-all duration-300 ${activeSegment === index
                                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-400/50'
                                                        : 'bg-slate-600 group-hover:bg-slate-500'
                                                        }`}
                                                    animate={activeSegment === index ? {
                                                        scale: [1, 1.2, 1],
                                                        rotate: [0, 180, 360]
                                                    } : {}}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <div className="flex-1">
                                                    <div className={`font-semibold text-lg mb-1 tracking-wide ${activeSegment === index ? 'text-amber-100' : 'text-slate-200'
                                                        }`}>
                                                        {segment.title}
                                                    </div>
                                                    <div className="text-sm opacity-80 leading-relaxed">
                                                        {segment.subtitle}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${activeSegment === index
                                                        ? 'border-amber-400 bg-amber-400/20'
                                                        : 'border-slate-500 group-hover:border-slate-400'
                                                        }`}
                                                    animate={activeSegment === index ? { scale: [1, 1.1, 1] } : {}}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {activeSegment === index && (
                                                        <motion.div
                                                            className="w-2 h-2 bg-amber-400 rounded-full"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </div>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>                            {/* Premium Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                {[
                                    { icon: Home, value: "1.200+", label: "Famílias Atendidas", color: "emerald" },
                                    { icon: MapPin, value: "15", label: "Anos de Expertise", color: "blue" },
                                    { icon: TrendingUp, value: "12%", label: "Valorização Anual", color: "amber" },
                                    { icon: Award, value: "100%", label: "Índice de Satisfação", color: "purple" }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    const colorClasses = {
                                        emerald: 'from-emerald-600 to-emerald-400',
                                        blue: 'from-blue-600 to-blue-400',
                                        amber: 'from-amber-600 to-amber-400',
                                        purple: 'from-purple-600 to-purple-400'
                                    };
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.3 + index * 0.1 }}
                                            className="relative group"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses]} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-400`}></div>
                                            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-2xl border border-slate-600/40 rounded-2xl p-6 text-center hover:border-slate-500/60 transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                                                <div className={`p-4 bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses]} rounded-xl mx-auto w-fit mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                                                <div className="text-sm text-slate-300 font-medium leading-relaxed">{item.label}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>                            {/* Luxury Contact Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.5 }}
                                className="relative group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-8 space-y-6 shadow-2xl shadow-amber-500/10">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                            <motion.div
                                                className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 180, 360]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            >
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xl font-bold text-white mb-1">Consultoria Executiva</div>
                                            <div className="text-amber-200 text-sm font-medium">Especialização em alto padrão</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-200 leading-relaxed">
                                            Nossa equipe de consultores especialistas desenvolve estratégias personalizadas para cada perfil de cliente, garantindo as melhores oportunidades do mercado.
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
                                                <Clock className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <div className="text-white text-sm font-medium">Resposta</div>
                                                    <div className="text-slate-300 text-xs">24 horas</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
                                                <Shield className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <div className="text-white text-sm font-medium">Suporte</div>
                                                    <div className="text-slate-300 text-xs">Completo</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>                {/* Sophisticated Progress Indicator */}
                <motion.div
                    className="absolute bottom-8 left-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <div className="flex items-center gap-6 px-6 py-4 bg-slate-800/80 backdrop-blur-2xl border border-slate-600/40 rounded-2xl shadow-xl">
                        <div className="flex gap-2">
                            {contentSegments.map((_, index) => (
                                <motion.div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-700 cursor-pointer ${index === activeSegment
                                        ? 'w-12 bg-gradient-to-r from-amber-500 to-amber-400 shadow-lg shadow-amber-400/50'
                                        : 'w-2 bg-slate-600 hover:bg-slate-500'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveSegment(index)}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-slate-300 font-medium tracking-wider">
                            <span className="text-amber-400">
                                {String(activeSegment + 1).padStart(2, '0')}
                            </span>
                            <span className="text-slate-500 mx-1">/</span>
                            <span className="text-slate-400">
                                {String(contentSegments.length).padStart(2, '0')}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">
                            {contentSegments[activeSegment].id}
                        </div>
                    </div>
                </motion.div>
            </motion.section>
        </>
    );
}
