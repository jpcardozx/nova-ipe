'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import ScrollAnimations from './components/ScrollAnimations';
import OptimizationProvider from './components/OptimizationProvider';
import ClientOnlyNavbar from './components/ClientOnlyNavbar';
import WhatsAppButton from './components/WhatsAppButton';
import EnhancedNotificationBanner from './components/EnhancedNotificationBanner';
import EnhancedTestimonials from './components/EnhancedTestimonials';
import PremiumHeroImproved from './components/PremiumHero-improved';
import { ProcessedProperty } from './page';
// Importando os novos componentes modernos para catálogo de imóveis
const PropertyCarouselModern = dynamic(() => import('../components/modern/PropertyCarouselModern'), {
    ssr: true,
    loading: () => <UnifiedLoading height="500px" title="Carregando imóveis..." />
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

const IpeConcept = dynamic(() => import('./components/TestEnhancedIpeConcept'), {
    loading: () => <UnifiedLoading height="550px" title="Carregando..." />,
});

const FormularioContatoModerno = dynamic(() => import('./components/FormularioContatoModerno'), {
    loading: () => <UnifiedLoading height="400px" title="Carregando formulário..." />,
});

const FooterAprimorado = dynamic(() => import('./sections/FooterAprimorado'), {
    loading: () => <UnifiedLoading height="300px" title="Carregando rodapé..." />,
});

interface HomePageClientProps {
    propertiesForSale: ProcessedProperty[];
    propertiesForRent: ProcessedProperty[];
    featuredProperties: ProcessedProperty[];
}

export default function HomePageClient({
    propertiesForSale,
    propertiesForRent,
    featuredProperties
}: HomePageClientProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(true);
    }, []); return (
        <OptimizationProvider>
            {/* Navbar e Hero */}
            <header className="relative">
                <ClientOnlyNavbar />
                <EnhancedNotificationBanner
                    message="Novos imóveis disponíveis! Confira nosso catálogo e consulte nossa equipe."
                    link="/contato"
                    linkText="Entre em contato"
                    variant="promotional"
                    storageKey="home_notification_dismissed"
                />
            </header>
            <PremiumHeroImproved />
            <BlocoExploracaoGuararema />

            {/* Conteúdo principal */}
            <main>
                <ScrollAnimations>
                    {/* Imóveis em Destaque - Nova experiência premium */}
                    <PropertyCarouselModern
                        properties={featuredProperties}
                        variant="sales"
                        title="Imóveis em Destaque"
                        showViewAll={true}
                    />

                    {/* 1. Imóveis para Aluguel (principal) - Carrossel Moderno */}
                    <PropertyCarouselModern
                        properties={propertiesForRent}
                        variant="rentals"
                        title="Imóveis para Aluguel"
                        showViewAll={true}
                    />

                    {/* Imóveis para Venda - Carrossel Moderno */}
                    <PropertyCarouselModern
                        properties={propertiesForSale}
                        variant="sales"
                        title="Imóveis para Venda"
                        showViewAll={true}
                    />                    {/* 2. Apresentação Institucional */}
                    <IpeConcept />
                    <MarketAnalysisSection />

                    {/* 3. Seção de Precificação */}
                    <ValorAprimorado />

                    {/* Banner de depoimentos para aumentar a confiança */}
                    <EnhancedTestimonials />
                </ScrollAnimations>
            </main>

            {/* Botão do WhatsApp fixo */}
            <WhatsAppButton phoneNumber="+5511981845016" />

            {/* Footer - Era o componente que estava faltando na página inicial */}
            <FooterAprimorado />
        </OptimizationProvider>
    );
}