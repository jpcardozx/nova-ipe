'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, Home, TrendingUp, MapPin, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Tipos limpos e focados
interface HeroContent {
    phase: 'discovery' | 'investment' | 'lifestyle';
    headline: string;
    subline: string;
    value_prop: string;
    cta_primary: string;
    cta_secondary?: string;
    href: string;
}

// Conteúdo estruturado com linha de progressão clara
const heroContent: HeroContent[] = [
    {
        phase: 'discovery',
        headline: 'Encontre Seu Próximo Lar',
        subline: 'Residências selecionadas em Guararema',
        value_prop: 'Mais de 1.200 famílias já encontraram o lar ideal através da nossa consultoria especializada.',
        cta_primary: 'Ver Imóveis Disponíveis',
        cta_secondary: 'Falar com Consultor',
        href: '/imoveis'
    },
    {
        phase: 'investment',
        headline: 'Invista em Valorização',
        subline: 'Oportunidades de alto potencial',
        value_prop: 'Região com crescimento de 12% ao ano, infraestrutura em expansão e demanda crescente.',
        cta_primary: 'Analisar Investimentos',
        href: '/investimentos'
    },
    {
        phase: 'lifestyle',
        headline: 'Viva Com Qualidade',
        subline: 'A 60km de SP, longe do caos',
        value_prop: 'Segurança, natureza e proximidade com a capital. O equilíbrio perfeito para sua família.',
        cta_primary: 'Conhecer Guararema',
        href: '/regiao'
    }
];

// Trust indicators simplificados
const trustMetrics = [
    { icon: Home, value: '1.200+', label: 'Famílias Atendidas' },
    { icon: TrendingUp, value: '12%', label: 'Valorização Anual' },
    { icon: MapPin, value: '15', label: 'Anos de Mercado' },
    { icon: Shield, value: '100%', label: 'Satisfação' }
];

// Loading simplificado e eficiente
const LoadingSequence = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 300);
                    return 100;
                }
                return prev + Math.random() * 20 + 10;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
        >
            <div className="text-center space-y-6">
                <motion.div
                    className="w-16 h-16 border-2 border-amber-500/30 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Home className="w-6 h-6 text-amber-500" />
                </motion.div>
                <div className="space-y-3">
                    <h2 className="text-xl font-medium text-white">Nova Ipê</h2>
                    <div className="w-48 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                        <motion.div
                            className="h-full bg-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function RefinedHero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const currentContent = heroContent[currentIndex];

    // Sequência de inicialização limpa
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleLoadComplete = () => {
        setIsVisible(true);
    };

    // Auto-rotação simples e controlada
    useEffect(() => {
        if (!isVisible) return;
        
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % heroContent.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <>
            <AnimatePresence>
                {!isVisible && <LoadingSequence onComplete={handleLoadComplete} />}
            </AnimatePresence>

            <section className="relative min-h-screen bg-slate-900 overflow-hidden">
                {/* Background consolidado */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Nova Ipê Imóveis"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-slate-900/90" />
                </div>

                {/* Conteúdo principal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex items-center"
                >
                    <div className="grid lg:grid-cols-12 gap-8 items-center w-full">
                        
                        {/* Conteúdo principal - 8 colunas */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.6 }}
                                    className="space-y-6"
                                >
                                    {/* Título principal */}
                                    <div className="space-y-4">
                                        <motion.h1
                                            className="text-5xl lg:text-7xl font-light text-white leading-tight"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {currentContent.headline}
                                        </motion.h1>
                                        
                                        <motion.p
                                            className="text-xl lg:text-2xl text-slate-300 font-light max-w-2xl"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {currentContent.subline}
                                        </motion.p>
                                    </div>

                                    {/* Proposta de valor */}
                                    <motion.p
                                        className="text-lg text-slate-400 leading-relaxed max-w-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {currentContent.value_prop}
                                    </motion.p>

                                    {/* CTAs otimizados */}
                                    <motion.div
                                        className="flex flex-col sm:flex-row gap-4 pt-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                            asChild
                                        >
                                            <Link href={currentContent.href}>
                                                {currentContent.cta_primary}
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>

                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-6 py-6 rounded-xl transition-all duration-300"
                                                asChild
                                            >
                                                <Link href="tel:+551146938200">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    Ligar
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-green-600 text-green-400 hover:bg-green-900/30 hover:text-green-300 px-6 py-6 rounded-xl transition-all duration-300"
                                                asChild
                                            >
                                                <Link href="https://wa.me/5511946938200">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    WhatsApp
                                                </Link>
                                            </Button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Sidebar com métricas - 4 colunas */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-6"
                            >
                                {/* Trust indicators */}
                                <div className="grid grid-cols-2 gap-4">
                                    {trustMetrics.map((metric, index) => {
                                        const Icon = metric.icon;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 + index * 0.1 }}
                                                className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-6 text-center hover:bg-slate-700/60 transition-colors"
                                            >
                                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                    <Icon className="w-6 h-6 text-amber-400" />
                                                </div>
                                                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                                                <div className="text-sm text-slate-400">{metric.label}</div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Navegação entre conteúdos */}
                                <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-6">
                                    <h3 className="text-white font-medium mb-4">Explore Nossas Soluções</h3>
                                    <div className="space-y-3">
                                        {heroContent.map((content, index) => (
                                            <button
                                                key={content.phase}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`w-full text-left p-3 rounded-lg transition-all ${
                                                    currentIndex === index
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                                                }`}
                                            >
                                                <div className="font-medium text-sm">{content.headline}</div>
                                                <div className="text-xs opacity-75 mt-1">{content.subline}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Indicador de progresso simplificado */}
                <motion.div
                    className="absolute bottom-8 left-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="flex items-center gap-4 px-4 py-3 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700">
                        <div className="flex gap-2">
                            {heroContent.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex ? 'bg-amber-500 w-6' : 'bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="text-xs text-slate-400">
                            {currentIndex + 1} / {heroContent.length}
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
}
