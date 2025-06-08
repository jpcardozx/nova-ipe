'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import ScrollAnimations from './components/ScrollAnimations';
import OptimizationProvider from './components/OptimizationProvider';
import WhatsAppButton from './components/WhatsAppButton';
import EnhancedNotificationBanner from './components/EnhancedNotificationBanner';
import EnhancedTestimonials from './components/EnhancedTestimonials';
import LuxuryHero from './components/LuxuryHero';
import { ProcessedProperty } from './types/property';
import { transformPropertiesArrayToPremium } from './utils/property-transformer';

// Importando os novos componentes premium otimizados
const PremiumPropertyCarouselOptimized = dynamic(() => import('./components/premium/PremiumPropertyCarouselOptimized'), {
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

const IpeConcept = dynamic(() => import('./components/ipeConcept'), {
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
                <EnhancedNotificationBanner
                    message="Novos imóveis disponíveis! Confira nosso catálogo atualizado"
                    link="/contato"
                    linkText="Entre em contato"
                    variant="promotional"
                    storageKey="home_notification_dismissed"
                />
            </header>
            <LuxuryHero />
            <BlocoExploracaoGuararema />

            {/* Conteúdo principal */}
            <main>
                <ScrollAnimations>                    {/* Imóveis para Venda - Carrossel Premium Otimizado */}
                    <PremiumPropertyCarouselOptimized
                        properties={transformPropertiesArrayToPremium(propertiesForSale)}
                        title="Imóveis para Venda"
                        subtitle="Encontre a casa dos seus sonhos em Guararema"
                        badge="Vendas"
                        viewAllLink="/imoveis/venda"
                        viewAllText="Ver todos para venda"
                        cardVariant="featured"
                        slidesToShow={{
                            desktop: 3,
                            tablet: 2,
                            mobile: 1
                        }}
                        autoplay={true}
                        autoplayDelay={6000}
                        className="mb-16"
                    />


                    {/* 2. Apresentação Institucional - IpeConcept original */}
                    <IpeConcept />                    {/* Imóveis para Aluguel (principal) - Carrossel Premium Otimizado */}
                    <PremiumPropertyCarouselOptimized
                        properties={transformPropertiesArrayToPremium(propertiesForRent)}
                        title="Imóveis para Aluguel"
                        subtitle="Encontre o imóvel ideal para locação em Guararema"
                        badge="Locações"
                        viewAllLink="/imoveis/aluguel"
                        viewAllText="Ver todos para aluguel"
                        cardVariant="default"
                        slidesToShow={{
                            desktop: 3,
                            tablet: 2,
                            mobile: 1
                        }}
                        autoplay={true}
                        autoplayDelay={7000}
                        className="mb-16"
                    /><MarketAnalysisSection />

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