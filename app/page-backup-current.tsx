'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// === FALLBACK COMPONENTS ===
import { HeroLoadingFallback, PropertyLoadingFallback, ErrorFallback } from './components/ErrorBoundaryComponents';

// === DYNAMIC IMPORTS - ALL CLIENT-SIDE TO AVOID SERIALIZATION ISSUES ===
const OptimizationProvider = dynamic(() => import('./components/OptimizationProvider'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const ClientOnlyNavbar = dynamic(() => import('./components/ClientOnlyNavbar'), {
  ssr: false,
  loading: () => <div>Loading navigation...</div>
});

const ProfessionalHero = dynamic(() => import('./components/ProfessionalHero'), {
  ssr: false,
  loading: () => <HeroLoadingFallback />
});

const BlocoExploracaoGuararema = dynamic(() => import('./components/BlocoExploracaoSimbolica'), {
  ssr: false,
  loading: () => <div>Loading exploration...</div>
});

const ClientPropertySection = dynamic(() => import('./components/ClientPropertySection').then(mod => mod.ClientPropertySection), {
  ssr: false,
  loading: () => <PropertyLoadingFallback />
});

const ValorAprimorado = dynamic(() => import('./sections/ValorAprimorado'), {
  ssr: false,
  loading: () => <div>Loading market data...</div>
});

const Referencias = dynamic(() => import('./sections/Referencias'), {
  ssr: false,
  loading: () => <div>Loading testimonials...</div>
});

const MarketAnalysisSection = dynamic(() => import('./components/MarketAnalysisSection').then(mod => mod.MarketAnalysisSection), {
  ssr: false,
  loading: () => <div>Loading market analysis...</div>
});

const ClientProgressSteps = dynamic(() => import('./components/ClientProgressSteps').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading progress steps...</div>
});

const FamilyStoriesSection = dynamic(() => import('./components/FamilyStoriesSection'), {
  ssr: false,
  loading: () => <div>Loading family stories...</div>
});

const FormularioContatoSubtil = dynamic(() => import('./components/FormularioContatoSubtil'), {
  ssr: false,
  loading: () => <div>Loading contact form...</div>
});

const FooterAprimorado = dynamic(() => import('./sections/FooterAprimorado'), {
  ssr: false,
  loading: () => <div>Loading footer...</div>
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
        <Suspense fallback={<div>Loading exploration...</div>}>
          <BlocoExploracaoGuararema />
        </Suspense>

        {/* === PROFESSIONAL PROPERTY SECTIONS === */}
        {/* SEÇÃO 1: IMÓVEIS À VENDA EM DESTAQUE - Premium Sales Highlights */}
        <Suspense fallback={
          <div className="min-h-[400px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-amber-800 text-lg">Carregando vendas...</div>
          </div>
        }>
          <ClientPropertySection
            type="sale"
            title="Oportunidades Exclusivas de Compra"
            subtitle="Imóveis premium selecionados em Guararema - Investimentos com alta valorização"
            viewAllLink="/comprar"
            viewAllLabel="Ver todos os imóveis à venda"
            className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
          />
        </Suspense>

        {/* SEÇÃO 2: IMÓVEIS PARA ALUGUEL EM DESTAQUE - Premium Rental Highlights */}
        <Suspense fallback={
          <div className="min-h-[400px] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-orange-800 text-lg">Carregando aluguéis...</div>
          </div>
        }>
          <ClientPropertySection
            type="rent"
            title="Aluguéis Premium Selecionados"
            subtitle="Propriedades para locação com filtros inteligentes e qualidade superior"
            viewAllLink="/alugar"
            viewAllLabel="Ver todos os imóveis para alugar"
            className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
          />
        </Suspense>

        {/* Seção de Valor Aprimorado */}
        <Suspense fallback={<div>Loading market data...</div>}>
          <ValorAprimorado />
        </Suspense>

        {/* Seção de Referências */}
        <Suspense fallback={<div>Loading testimonials...</div>}>
          <Referencias />
        </Suspense>

        {/* Seção de Análise de Mercado */}
        <Suspense fallback={<div>Loading market analysis...</div>}>
          <MarketAnalysisSection />
        </Suspense>        {/* Client Progress Steps */}
        <Suspense fallback={<div>Loading progress steps...</div>}>
          <ClientProgressSteps />
        </Suspense>

        {/* Family Stories Section */}
        <Suspense fallback={<div>Loading family stories...</div>}>
          <FamilyStoriesSection />
        </Suspense>

        {/* Seção de Contato */}
        <Suspense fallback={<div>Loading contact form...</div>}>
          <FormularioContatoSubtil />
        </Suspense>

        {/* Rodapé Aprimorado */}
        <Suspense fallback={<div>Loading footer...</div>}>
          <FooterAprimorado />
        </Suspense>
      </OptimizationProvider>
    </main>
  );
}
