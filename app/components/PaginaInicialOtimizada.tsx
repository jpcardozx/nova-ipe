'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// === IMPORTS DINÂMICOS OTIMIZADOS ===
const FormularioContatoSubtil = dynamic(() => import('./FormularioContatoSubtil'), {
    loading: () => (
        <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl animate-pulse flex items-center justify-center">
            <div className="text-slate-600">Carregando formulário premium...</div>
        </div>
    ),
    ssr: false
});

const ConsolidatedHero = dynamic(() => import('./ConsolidatedHero'), {
    loading: () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
            <div className="text-white text-xl">Carregando hero premium...</div>
        </div>
    )
});

const ValorAprimorado = dynamic(() => import('../sections/ValorAprimorado'), {
    loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-2xl"></div>
});

const Referencias = dynamic(() => import('../sections/Referencias'), {
    loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-2xl"></div>
});

const ExclusiveAnalysisOffer = dynamic(() => import('../sections/ExclusiveAnalysisOffer'), {
    loading: () => <div className="h-80 bg-slate-50 animate-pulse rounded-2xl"></div>
});

// === COMPONENTES CORE (CARREGADOS IMEDIATAMENTE) ===
import OptimizationProvider from './OptimizationProvider';
import ClientOnlyNavbar from './ClientOnlyNavbar';
import NotificacaoBanner from './NotificacaoBanner';
import { FeedbackBanner } from './FeedbackBanner';
import WhatsAppButton from './WhatsAppButton';
import FooterAprimorado from '../sections/FooterAprimorado';
import SkipToContent from './SkipToContent';
import ScrollAnimations from './ScrollAnimations';

// === TIPOS ===
interface PaginaInicialProps {
    imoveisDestaque?: any[];
    imoveisVenda?: any[];
    imoveisAluguel?: any[];
}

// === LOADING COMPONENTS OTIMIZADOS ===
const LoadingShell = React.memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                            Nova Ipê
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Carregando experiência premium de imóveis
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex justify-center space-x-1"
                >
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 200}ms`,
                                animationDuration: '1s'
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    </div>
));

LoadingShell.displayName = 'LoadingShell';

// === SEÇÃO DE ESTATÍSTICAS RÁPIDAS ===
const EstatisticasRapidas = React.memo(() => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const stats = [
        { label: "Imóveis Vendidos", value: "500+", color: "text-green-600" },
        { label: "Clientes Satisfeitos", value: "1000+", color: "text-blue-600" },
        { label: "Anos de Experiência", value: "15+", color: "text-amber-600" },
        { label: "Regiões Atendidas", value: "10+", color: "text-purple-600" }
    ];

    return (
        <section ref={sectionRef} className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>
                                {stat.value}
                            </div>
                            <div className="text-slate-600 text-sm lg:text-base">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});

EstatisticasRapidas.displayName = 'EstatisticasRapidas';

// === COMPONENTE PRINCIPAL ===
export default function PaginaInicialOtimizada({
    imoveisDestaque = [],
    imoveisVenda = [],
    imoveisAluguel = []
}: PaginaInicialProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [componentsLoaded, setComponentsLoaded] = useState({
        hero: false,
        valor: false,
        referencias: false,
        form: false
    });

    const mainRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: mainRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // Controle inteligente de carregamento
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Callback para marcar componentes como carregados
    const markComponentLoaded = useCallback((component: keyof typeof componentsLoaded) => {
        setComponentsLoaded(prev => ({ ...prev, [component]: true }));
    }, []);

    // Loading shell durante carregamento inicial
    if (isLoading) {
        return <LoadingShell />;
    }

    return (
        <main ref={mainRef} className="min-h-screen bg-white">
            <OptimizationProvider>
                {/* Skip to content para acessibilidade */}
                <SkipToContent />

                {/* Navegação fixa */}
                <div className="fixed top-0 left-0 right-0 z-50">
                    <NotificacaoBanner
                        text="🎯 Oportunidade: Casas em condomínio com 20% de entrada facilitada"
                        linkText="Saiba mais"
                        linkHref="/contato"
                        variant="default"
                        dismissible={true}
                        storageKey="promo-banner-2025"
                    />
                    <ClientOnlyNavbar />
                </div>

                {/* Hero Section Premium */}
                <Suspense fallback={
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
                        <div className="text-white text-xl">Carregando hero premium...</div>
                    </div>
                }>
                    <ConsolidatedHero
                        imoveisDestaque={imoveisDestaque}
                        onLoad={() => markComponentLoaded('hero')}
                    />
                </Suspense>

                {/* Estatísticas Rápidas */}
                <EstatisticasRapidas />

                {/* Seção de Valor Premium */}
                <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse"></div>}>
                    <ValorAprimorado onLoad={() => markComponentLoaded('valor')} />
                </Suspense>

                {/* Ofertas Exclusivas */}
                <Suspense fallback={<div className="h-80 bg-slate-50 animate-pulse"></div>}>
                    <ExclusiveAnalysisOffer />
                </Suspense>

                {/* Referências e Credibilidade */}
                <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse"></div>}>
                    <Referencias onLoad={() => markComponentLoaded('referencias')} />
                </Suspense>

                {/* Formulário de Contato Premium */}
                <section id="contato" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                                Encontre Seu <span className="text-blue-600">Imóvel Ideal</span>
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Nossa equipe especializada está pronta para ajudar você a encontrar o imóvel perfeito em Guararema e região
                            </p>
                        </motion.div>

                        <Suspense fallback={
                            <div className="min-h-[600px] bg-white rounded-2xl shadow-lg animate-pulse flex items-center justify-center">
                                <div className="text-slate-600">Carregando formulário premium...</div>
                            </div>
                        }>
                            <FormularioContatoSubtil
                                className="max-w-4xl mx-auto"
                                onLoad={() => markComponentLoaded('form')}
                            />
                        </Suspense>
                    </div>
                </section>

                {/* Footer Premium */}
                <FooterAprimorado />

                {/* Componentes Flutuantes */}
                <WhatsAppButton
                    phoneNumber="5511999999999"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema."
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                <FeedbackBanner />
                <ScrollAnimations />
            </OptimizationProvider>
        </main>
    );
}
