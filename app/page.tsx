'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// === FALLBACK COMPONENTS ===
import { HeroLoadingFallback, PropertyLoadingFallback, ErrorFallback } from './components/ErrorBoundaryComponents';

// === DYNAMIC IMPORTS - NO FRAMER MOTION TO AVOID HYDRATION ISSUES ===
const OptimizationProvider = dynamic(() => import('./components/OptimizationProvider'), {
  ssr: false,
  loading: () => <div className="min-h-[60px] bg-amber-50 animate-pulse"></div>
});

const ClientOnlyNavbar = dynamic(() => import('./components/ClientOnlyNavbar'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white border-b animate-pulse"></div>
});

const ProfessionalHero = dynamic(() => import('./components/ProfessionalHero'), {
  ssr: false,
  loading: () => <HeroLoadingFallback />
});

const BlocoExploracaoGuararema = dynamic(() => import('./components/BlocoExploracaoSimbolica'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] bg-stone-50 animate-pulse"></div>
});

const PremiumSalesSection = dynamic(() => import('./components/PremiumSalesSection'), {
  ssr: false,
  loading: () => <div className="min-h-[800px] bg-gradient-to-br from-amber-50 to-orange-50 animate-pulse"></div>
});

const StrategicRentalsSection = dynamic(() => import('./components/StrategicRentalsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[800px] bg-gradient-to-br from-emerald-50 to-teal-50 animate-pulse"></div>
});

const ValorAprimorado = dynamic(() => import('./sections/ValorAprimorado'), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-gradient-to-br from-amber-50 to-stone-50 animate-pulse"></div>
});

const Referencias = dynamic(() => import('./sections/Referencias'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] bg-stone-100 animate-pulse"></div>
});

const MarketAnalysisSection = dynamic(() => import('./components/MarketAnalysisSection').then(mod => mod.MarketAnalysisSection), {
  ssr: false,
  loading: () => <div className="min-h-[500px] bg-white animate-pulse"></div>
});

// IMPORTANT: Use the no-motion version to avoid framer-motion hydration issues
const ClientProgressSteps = dynamic(() => import('./components/ClientProgressSteps-no-motion').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="min-h-[600px] bg-gradient-to-br from-stone-50 to-amber-50 animate-pulse"></div>
});

const FamilyStoriesSection = dynamic(() => import('./components/FamilyStoriesSection'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] bg-amber-50 animate-pulse"></div>
});

const FormularioContatoSubtil = dynamic(() => import('./components/FormularioContatoSubtil'), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-stone-100 animate-pulse"></div>
});

const FooterAprimorado = dynamic(() => import('./sections/FooterAprimorado'), {
  ssr: false,
  loading: () => <div className="min-h-[200px] bg-stone-900 animate-pulse"></div>
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <OptimizationProvider>
        <ClientOnlyNavbar />

        {/* Hero Section - Premium */}
        <Suspense fallback={<HeroLoadingFallback />}>
          <ProfessionalHero />
        </Suspense>

        {/* Seção de Exploração - Contextualização Premium */}
        <Suspense fallback={<div className="min-h-[400px] bg-stone-50 animate-pulse"></div>}>
          <BlocoExploracaoGuararema />
        </Suspense>        {/* === SEÇÃO DE VENDAS PREMIUM === */}
        {/* Imóveis de destaque para venda - Logo após exploração de Guararema */}
        <Suspense fallback={<div className="min-h-[800px] bg-gradient-to-br from-amber-50 to-orange-50 animate-pulse"></div>}>
          <PremiumSalesSection />
        </Suspense>

        {/* === VALOR E MERCADO === */}
        <Suspense fallback={<div className="min-h-[300px] bg-gradient-to-br from-amber-50 to-stone-50 animate-pulse"></div>}>
          <ValorAprimorado />
        </Suspense>

        {/* === ANÁLISE DE MERCADO PREMIUM === */}
        <Suspense fallback={<div className="min-h-[500px] bg-white animate-pulse"></div>}>
          <MarketAnalysisSection />
        </Suspense>

        {/* === PROCESSO DE TRABALHO COMPACTO === */}
        <Suspense fallback={<div className="min-h-[600px] bg-gradient-to-br from-stone-50 to-amber-50 animate-pulse"></div>}>
          <ClientProgressSteps />
        </Suspense>        {/* === HISTÓRIAS DE FAMÍLIA === */}
        <Suspense fallback={<div className="min-h-[400px] bg-amber-50 animate-pulse"></div>}>
          <FamilyStoriesSection />
        </Suspense>

        {/* === SEÇÃO DE ALUGUÉIS ESTRATÉGICA === */}
        {/* Posicionada após histórias familiares para criar conexão emocional */}
        <Suspense fallback={<div className="min-h-[800px] bg-gradient-to-br from-emerald-50 to-teal-50 animate-pulse"></div>}>
          <StrategicRentalsSection />
        </Suspense>

        {/* === REFERÊNCIAS E CREDIBILIDADE === */}
        <Suspense fallback={<div className="min-h-[400px] bg-stone-100 animate-pulse"></div>}>
          <Referencias />
        </Suspense>

        {/* === FORMULÁRIO SUTIL DE CONTATO === */}
        <Suspense fallback={<div className="min-h-[300px] bg-stone-100 animate-pulse"></div>}>
          <FormularioContatoSubtil />
        </Suspense>

        {/* === FOOTER APRIMORADO === */}
        <Suspense fallback={<div className="min-h-[200px] bg-stone-900 animate-pulse"></div>}>
          <FooterAprimorado />
        </Suspense>
      </OptimizationProvider>
    </main>
  )
}