'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do conteúdo da página inicial (Server Component)
const HomePageContent = dynamic(() => import('./page-consolidated'), {
    loading: () => <p className="text-white text-center py-8">Carregando conteúdo...</p>,
    ssr: true
});

// === CORE IMPORTS ===
import OptimizationProvider from './components/OptimizationProvider';
import NavbarResponsive from './components/NavbarResponsive';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import SafeSuspenseWrapper from './components/SafeSuspenseWrapper';
import ScrollAnimations from './components/ScrollAnimations';

// === SECTION IMPORTS ===
import ValorAprimorado from './sections/ValorAprimorado';
import Referencias from './sections/Referencias';
import ClientProgressSteps from './components/ClientProgressSteps';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import { MarketAnalysisSection } from './components/MarketAnalysisSection';
import { TrustAndCredibilitySection } from './components/TrustAndCredibilitySection';
import ConsolidatedHero from './components/ConsolidatedHero';

// Shell de loading premium
const PremiumLoadingShell = () => {
    const [loadingText, setLoadingText] = useState('Carregando experiência premium');

    useEffect(() => {
        const texts = [
            'Carregando catálogo de imóveis',
            'Buscando oportunidades recentes',
            'Finalizando carregamento',
            'Imóveis em destaque selecionados',
        ];

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % texts.length;
            setLoadingText(texts[index]);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Hero Shell com animações sutis */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background animado */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>

                    {/* Orbs animados */}
                    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Loading Badge */}
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 animate-fade-in">
                            <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-ping"></div>
                            <span className="text-white/90 text-sm font-medium">{loadingText}</span>
                        </div>

                        {/* Título Principal com animação de digitação */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Transforme seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 animate-gradient-shift">sonho</span> em
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 animate-gradient-shift">endereço</span>
                        </h1>

                        {/* Skeleton de estatísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="text-center animate-pulse">
                                    <div className="h-8 bg-white/20 rounded mb-2 animate-shimmer"></div>
                                    <div className="h-4 bg-white/10 rounded"></div>
                                </div>
                            ))}
                        </div>

                        {/* Loading Indicator Premium */}
                        <div className="mt-12">
                            <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-400 to-blue-500 rounded-full animate-loading-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

// Componente principal que orquestra tudo
export default function Home() {
    const [shellVisible, setShellVisible] = useState(true);

    useEffect(() => {
        // Esconde o shell após 2 segundos para dar tempo do SSR carregar
        const timer = setTimeout(() => {
            setShellVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="font-body antialiased bg-white">
            <OptimizationProvider>
                {/* Shell de navegação que aparece imediatamente */}
                <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shellVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <NotificacaoBanner
                        text="🎯 Oportunidade: Casas em condomínio com 20% de entrada facilitada"
                        linkText="Saiba mais"
                        linkHref="/contato"
                        variant="default"
                        dismissible={true}
                        storageKey="promo-banner-2025"
                    />
                    <NavbarResponsive />
                </div>

                {/* Conteúdo SSR carregado dinamicamente */}                <Suspense fallback={<PremiumLoadingShell />}>
                    {!shellVisible && (
                        <HomePageContent />
                    )}
                </Suspense>
            </OptimizationProvider>
        </div>
    );
}