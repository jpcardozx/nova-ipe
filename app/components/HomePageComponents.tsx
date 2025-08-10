'use client';

import React from 'react';
import { Suspense, lazy } from 'react';
import { UnifiedLoading } from './ui/UnifiedComponents';
import NoSSRWrapper from './ui/NoSSRWrapper';
import WhatsAppButton from './WhatsAppButton';
import EnhancedNotificationBanner from './EnhancedNotificationBanner';
import MobileFirstHero from './MobileFirstHero';
import type { ImovelClient } from '../../src/types/imovel-client';

// Lazy loading dos componentes
const BlocoExploracaoSimbolica = lazy(() => import('./BlocoExploracaoSimbolica'));
const MarketAnalysisSection = lazy(() => import('./MarketAnalysisSection'));
const CleanSalesSection = lazy(() => import('./premium/CleanPropertySections').then(mod => ({ default: mod.CleanSalesSection })));
const CleanRentalsSection = lazy(() => import('./premium/CleanPropertySections').then(mod => ({ default: mod.CleanRentalsSection })));
const FooterAprimorado = lazy(() => import('../sections/FooterAprimorado'));

const FallbackLoader = ({ title, height = '500px' }: { title: string, height?: string }) => (
    <UnifiedLoading height={height} title={title} />
);

interface HomePageComponentsProps {
    propertiesForSale: ImovelClient[];
    propertiesForRent: ImovelClient[];
    featuredProperties: ImovelClient[];
}

export default function HomePageComponents({ propertiesForSale, propertiesForRent, featuredProperties }: HomePageComponentsProps) {
    return (
        <>
            <header>
                <EnhancedNotificationBanner
                    message="Novos imóveis disponíveis! Confira nosso catálogo atualizado"
                    link="/contato"
                    linkText="Entre em contato"
                    variant="promotional"
                    storageKey="home_notification_dismissed"
                />
            </header>

            <MobileFirstHero />

            <Suspense fallback={<FallbackLoader title="Carregando exploração de Guararema..." />}>
                <BlocoExploracaoSimbolica />
            </Suspense>

            <Suspense fallback={<FallbackLoader title="Carregando análise de mercado..." />}>
                <MarketAnalysisSection />
            </Suspense>

            <main className="min-h-screen">
                <Suspense fallback={<FallbackLoader title="Carregando imóveis para venda..." />}>
                    <CleanSalesSection
                        properties={propertiesForSale}
                        title="Imóveis para Venda"
                        subtitle="Encontre a casa dos seus sonhos em Guararema"
                        maxItems={12}
                        className="mb-20"
                    />
                </Suspense>

                <Suspense fallback={<FallbackLoader title="Carregando imóveis para aluguel..." />}>
                    <CleanRentalsSection
                        properties={propertiesForRent}
                        title="Imóveis para Aluguel"
                        subtitle="Encontre o imóvel ideal para locação em Guararema"
                        maxItems={12}
                        className="mb-20"
                    />
                </Suspense>
            </main>

            <WhatsAppButton phoneNumber="+5521990051961" />

            <Suspense fallback={<FallbackLoader title="Carregando rodapé..." height="300px" />}>
                <FooterAprimorado />
            </Suspense>
        </>
    );
}