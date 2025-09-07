'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import OptimizationProvider from './components/OptimizationProvider';
import WebVitalsOptimizer from './components/WebVitalsOptimizer';
import WhatsAppButton from './components/WhatsAppButton';
import EnhancedTestimonials from './components/EnhancedTestimonials';
import MobileFirstHeroClean from './components/MobileFirstHeroClean';
import { ProcessedProperty } from './types/property';
import { transformPropertiesArrayToPremium } from './utils/property-transformer';
import type { ImovelClient } from '../src/types/imovel-client';
import { LazyComponent } from '../lib/hooks/useLazyLoad';

// Importação direta sem dynamic - props já têm os dados
import DestaquesVendaPremium from './sections/DestaquesVendaPremium';
import SecaoImoveisParaAlugarPremium from './sections/SecaoImoveisParaAlugarPremium';

const ValorAprimorado = dynamic(() => import('./sections/ValorAprimoradoV4'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

const MarketAnalysisSection = dynamic(() => import('./components/MarketAnalysisSection'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando análise de mercado..." />,
});

// Dynamic imports com loading states otimizados
const BlocoExploracaoGuararema = dynamic(() => import('./components/BlocoExploracaoSimbolica'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

const IpeConcept = dynamic(() => import('./components/ipeConcept'), {
    loading: () => <UnifiedLoading height="550px" title="Carregando..." />,
});

interface HomePageClientProps {
    propertiesForSale: ImovelClient[];
    propertiesForRent: ImovelClient[];
    featuredProperties: ImovelClient[];
}

export default function HomePageClient({
    propertiesForSale,
    propertiesForRent,
    featuredProperties,
}: HomePageClientProps) {

    return (
        <OptimizationProvider>
            <WebVitalsOptimizer />
            {/* Hero sem navbar sobreposta */}
            <MobileFirstHeroClean imoveisEmAlta={featuredProperties} />
            <BlocoExploracaoGuararema />

            {/* Conteúdo principal com espaçamento otimizado */}
            <main>
                {/* Seção de Imóveis para Venda - Sistema Premium */}
                <DestaquesVendaPremium properties={propertiesForSale} />

                {/* Apresentação Institucional - IpeConcept original */}
                <LazyComponent 
                    rootMargin="200px 0px"
                    fallback={<div className="h-96 bg-gray-50 animate-pulse" />}
                >
                    <IpeConcept />
                </LazyComponent>

                {/* Seção de Imóveis para Aluguel - Sistema Premium */}
                <LazyComponent 
                    rootMargin="150px 0px"
                    fallback={<div className="h-64 bg-gray-50 animate-pulse" />}
                >
                    <SecaoImoveisParaAlugarPremium properties={propertiesForRent} />
                </LazyComponent>

                {/* Análise de Mercado */}
                <LazyComponent 
                    rootMargin="200px 0px"
                    fallback={<div className="h-80 bg-gray-50 animate-pulse" />}
                >
                    <MarketAnalysisSection />
                </LazyComponent>

                {/* Seção de Precificação */}
                <LazyComponent 
                    rootMargin="200px 0px"
                    fallback={<div className="h-96 bg-gray-50 animate-pulse" />}
                >
                    <ValorAprimorado />
                </LazyComponent>

                {/* Banner de depoimentos para aumentar a confiança */}
                <LazyComponent 
                    rootMargin="100px 0px"
                    fallback={<div className="h-48 bg-gray-50 animate-pulse" />}
                >
                    <EnhancedTestimonials />
                </LazyComponent>

            </main>

            {/* Botão do WhatsApp fixo */}
            <WhatsAppButton phoneNumber="+5511981845016" />
        </OptimizationProvider>
    );
}