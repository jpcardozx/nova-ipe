'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, Home, TrendingUp, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Tipos essenciais
interface HeroPhase {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    href: string;
    metrics?: { label: string; value: string }[];
}

// Conteúdo com progressão clara e objetiva
const phases: HeroPhase[] = [
    {
        id: 1,
        title: "Encontre Seu Lar Ideal",
        subtitle: "Residências selecionadas em Guararema",
        description: "Consultoria imobiliária especializada com mais de 1.200 famílias atendidas e 15 anos de expertise no mercado local.",
        cta: "Ver Imóveis Disponíveis",
        href: "/imoveis",
        metrics: [
            { label: "Famílias Atendidas", value: "1.200+" },
            { label: "Anos de Mercado", value: "15" }
        ]
    },
    {
        id: 2,
        title: "Invista Com Inteligência",
        subtitle: "Oportunidades de valorização consistente",
        description: "Região com crescimento de 12% ao ano, infraestrutura em expansão e alta demanda. Investimento seguro e rentável.",
        cta: "Analisar Oportunidades",
        href: "/investimentos",
        metrics: [
            { label: "Valorização Anual", value: "12%" },
            { label: "ROI Médio", value: "18%" }
        ]
    },
    {
        id: 3,
        title: "Viva Com Qualidade",
        subtitle: "A 60km de SP, longe do caos urbano",
        description: "Segurança, natureza preservada e proximidade estratégica com a capital. O equilíbrio perfeito para sua família.",
        cta: "Conhecer a Região",
        href: "/guararema",
        metrics: [
            { label: "Distância de SP", value: "60km" },
            { label: "Índice de Segurança", value: "95%" }
        ]
    }
];

// Loading minimalista e eficiente
const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 200);
                    return 100;
                }
                return prev + 25;
            });
        }, 200);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
        >
            <div className="text-center space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full mx-auto"
                />
                <div className="space-y-2">
                    <h2 className="text-lg font-medium text-white">Nova Ipê</h2>
                    <div className="w-32 h-0.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                        <motion.div
                            className="h-full bg-amber-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Componente principal limpo e focado
export default function ProfessionalHero() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPhase, setCurrentPhase] = useState(0);

    // Auto-progressão das fases
    useEffect(() => {
        if (isLoading) return;

        const interval = setInterval(() => {
            setCurrentPhase(prev => (prev + 1) % phases.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isLoading]);

    const currentContent = phases[currentPhase];

    return (
        <div className="relative">
            <AnimatePresence>
                {isLoading && <InitialLoader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {/* Hero Background */}
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Nova Ipê Imóveis"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
                </div>

                {/* Content Container */}
                <div className="relative z-20 flex items-center min-h-screen">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Main Content */}
                            <motion.div
                                key={currentPhase}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                {/* Headlines */}
                                <div className="space-y-4">
                                    <motion.h1
                                        className="text-4xl lg:text-6xl font-bold text-white leading-tight"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {currentContent.title}
                                    </motion.h1>
                                    <motion.p
                                        className="text-xl lg:text-2xl text-slate-300 font-light"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {currentContent.subtitle}
                                    </motion.p>
                                    <motion.p
                                        className="text-lg text-slate-400 leading-relaxed max-w-2xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {currentContent.description}
                                    </motion.p>
                                </div>

                                {/* Metrics */}
                                {currentContent.metrics && (
                                    <motion.div
                                        className="flex gap-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {currentContent.metrics.map((metric, index) => (
                                            <div key={index} className="text-center">
                                                <div className="text-2xl font-bold text-amber-500">{metric.value}</div>
                                                <div className="text-sm text-slate-400">{metric.label}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Actions */}
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 h-auto group"
                                    >
                                        <Link href={currentContent.href}>
                                            {currentContent.cta}
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10 px-8 py-4 h-auto"
                                        asChild
                                    >
                                        <Link href="tel:+5511999999999">
                                            <Phone className="mr-2 w-4 h-4" />
                                            Falar com Consultor
                                        </Link>
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Phase Indicators */}
                            <div className="hidden lg:flex flex-col justify-center space-y-6">
                                <motion.div
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    {phases.map((phase, index) => (
                                        <motion.button
                                            key={phase.id}
                                            onClick={() => setCurrentPhase(index)}
                                            className={`p-4 rounded-lg text-left transition-all duration-300 w-full ${index === currentPhase
                                                ? 'bg-white/10 border border-amber-500/50'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full ${index === currentPhase ? 'bg-amber-500' : 'bg-white/30'
                                                    }`} />
                                                <span className={`text-sm font-medium ${index === currentPhase ? 'text-white' : 'text-slate-300'
                                                    }`}>
                                                    {phase.title}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>

                                {/* Contact Card */}
                                <motion.div
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="text-center space-y-4">
                                        <div className="text-sm text-slate-400">Consultoria Especializada</div>
                                        <div className="flex justify-center space-x-3">
                                            <Button size="sm" variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
                                                <Phone className="w-4 h-4 mr-2" />
                                                Ligar
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex space-x-2">
                        {phases.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setCurrentPhase(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPhase ? 'bg-amber-500 w-8' : 'bg-white/30'
                                    }`}
                                whileHover={{ scale: 1.2 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
