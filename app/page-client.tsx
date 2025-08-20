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

// Importando os componentes premium
const DestaquesVendaPremium = dynamic(() => import('./sections/DestaquesVendaPremium'), {
    ssr: true,
    loading: () => <UnifiedLoading height="500px" title="Carregando imóveis para venda..." />
});

const SecaoImoveisParaAlugarPremium = dynamic(() => import('./sections/SecaoImoveisParaAlugarPremium'), {
    ssr: true,
    loading: () => <UnifiedLoading height="500px" title="Carregando imóveis para aluguel..." />
});

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
    hotProperties?: ImovelClient[]; // Nova prop para imóveis em alta
}

export default function HomePageClient({
    propertiesForSale,
    propertiesForRent,
    featuredProperties,
    hotProperties = [] // Default vazio para imóveis em alta
}: HomePageClientProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <OptimizationProvider>
            <WebVitalsOptimizer />
            {/* Hero sem navbar sobreposta */}
            <MobileFirstHeroClean imoveisEmAlta={hotProperties} />
            <BlocoExploracaoGuararema />

            {/* Conteúdo principal com espaçamento otimizado */}
            <main className="space-y-8 lg:space-y-12">
                {/* Seção de Imóveis para Venda - Sistema Premium */}
                <DestaquesVendaPremium />

                {/* Apresentação Institucional - IpeConcept original */}
                <IpeConcept />

                {/* Seção de Imóveis para Aluguel - Sistema Premium */}
                <SecaoImoveisParaAlugarPremium />

                {/* Análise de Mercado */}
                <MarketAnalysisSection />

                {/* Seção de Precificação */}
                <ValorAprimorado />

                {/* Banner de depoimentos para aumentar a confiança */}
                <EnhancedTestimonials />

            </main>

            {/* Botão do WhatsApp fixo */}
            <WhatsAppButton phoneNumber="+5511981845016" />
        </OptimizationProvider>
    );
}