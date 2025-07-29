'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import ScrollAnimations from './components/ScrollAnimations';
import OptimizationProvider from './components/OptimizationProvider';
import WhatsAppButton from './components/WhatsAppButton';
import EnhancedNotificationBanner from './components/EnhancedNotificationBanner';
import EnhancedTestimonials from './components/EnhancedTestimonials';
import { Hero, Section } from '@/lib/components';
import { ProcessedProperty } from './types/property';
import { transformPropertiesArrayToPremium } from './utils/property-transformer';
import type { ImovelClient } from '../src/types/imovel-client';

// Importando os componentes limpos e funcionais
const CleanSalesSection = dynamic(() => import('./components/premium/CleanPropertySections').then(mod => ({ default: mod.CleanSalesSection })), {
    ssr: true,
    loading: () => <UnifiedLoading height="500px" title="Carregando imóveis para venda..." />
});

const CleanRentalsSection = dynamic(() => import('./components/premium/CleanPropertySections').then(mod => ({ default: mod.CleanRentalsSection })), {
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

const FooterAprimorado = dynamic(() => import('./sections/FooterAprimorado'), {
    loading: () => <UnifiedLoading height="300px" title="Carregando rodapé..." />,
});

interface HomePageClientProps {
    propertiesForSale: ImovelClient[];
    propertiesForRent: ImovelClient[];
    featuredProperties: ImovelClient[];
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
            <Hero />
            <BlocoExploracaoGuararema />

            {/* Main Content */}
            <main>
                <ScrollAnimations>
                    {/* Properties for Sale Section */}
                    <Section variant="feature" background="gray">
                        <CleanSalesSection
                            properties={propertiesForSale}
                            title="Imóveis para Venda"
                            subtitle="Encontre a casa dos seus sonhos em Guararema"
                            maxItems={12}
                            className="mb-20"
                        />
                    </Section>

                    {/* Institutional Presentation */}
                    <Section variant="default">
                        <IpeConcept />
                    </Section>

                    {/* Properties for Rent Section */}
                    <Section variant="feature" background="gray">
                        <CleanRentalsSection
                            properties={propertiesForRent}
                            title="Imóveis para Aluguel"
                            subtitle="Encontre o imóvel ideal para locação em Guararema"
                            maxItems={12}
                            className="mb-20"
                        />
                    </Section>

                    <MarketAnalysisSection />

                    {/* Value Proposition Section */}
                    <Section variant="cta">
                        <ValorAprimorado />
                    </Section>

                    {/* Testimonials */}
                    <Section variant="default" background="gray">
                        <EnhancedTestimonials />
                    </Section>
                </ScrollAnimations>
            </main>

            {/* Botão do WhatsApp fixo */}
            <WhatsAppButton phoneNumber="+5511981845016" />

            {/* Footer - Era o componente que estava faltando na página inicial */}
            <FooterAprimorado />
        </OptimizationProvider>
    );
}