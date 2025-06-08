'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import ScrollAnimations from './components/ScrollAnimations';
import OptimizationProvider from './components/OptimizationProvider';
import ClientOnlyNavbar from './components/ClientOnlyNavbar';
import WhatsAppButton from './components/WhatsAppButton';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';
import PremiumHero from './components/PremiumHero';
import { Property } from './types/property';
import PropertySection from './components/layouts/PropertySection';

// Dynamic imports com loading states otimizados
const BlocoExploracaoGuararema = dynamic(() => import('./components/BlocoExploracaoSimbolica'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

const MarketAnalysisSection = dynamic(() => import('./components/MarketAnalysisSection'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando análise..." />,
});

const ClientProgressSteps = dynamic(() => import('./components/ClientProgressSteps'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

    loading: () => <UnifiedLoading height="400px" title="Carregando formulário..." />,
});

const ReferencesSection = dynamic(() => import('./components/ReferencesSection'), {
    loading: () => <UnifiedLoading height="600px" title="Carregando referências..." />,
});

interface HomePageClientProps {
    propertiesForSale: Property[];
    propertiesForRent: Property[];
    featuredProperties: Property[];
}

export default function HomePageClient({
    propertiesForSale,
    propertiesForRent,
    featuredProperties
}: HomePageClientProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <OptimizationProvider>
            {/* Mensagens e notificações */}            <div className="fixed top-0 left-0 right-0 z-50">
                <NotificacaoBanner
                    text="Novas propriedades disponíveis em Guararema. Confira!"
                    linkText="Ver Destaques"
                    linkHref="#featured-properties"
                    variant="default"
                    autoHideAfter={10000}
                    dismissible={true}
                />
                <FeedbackBanner />
            </div>

            {/* Navbar e Hero */}
            <header className="relative">
                <ClientOnlyNavbar transparent={true} />
                <PremiumHero />
            </header>

            {/* Conteúdo principal */}
            <main>
                <ScrollAnimations>
                    {/* Bloco Exploração Guararema */}
                    <BlocoExploracaoGuararema />

                    {/* Steps e Análise de Mercado */}
                    <ClientProgressSteps />
                    <MarketAnalysisSection />

                    {/* Seção de Propriedades Destacadas */}                <PropertySection
                        id="featured-properties"
                        title="Propriedades Selecionadas"
                        description="Nossa seleção de imóveis em Guararema, escolhidos por especialistas para oferecer o melhor em localização, estrutura e potencial de valorização."
                        properties={featuredProperties}
                        badge="Destaques"
                        viewAllLink="/imoveis/destaque"
                        viewAllText="Ver todos os destaques"
                        variant="featured"
                        className="bg-gradient-to-b from-white to-stone-50"
                    />

                    {/* Seções de Venda e Aluguel */}
                    <PropertySection
                        id="sale-properties"
                        title="Imóveis à Venda"
                        description="Encontre seu próximo lar em Guararema. Casas e apartamentos selecionados para venda."
                        properties={propertiesForSale}
                        badge="Venda"
                        viewAllLink="/imoveis/venda"
                        viewAllText="Ver todos para venda"
                        propertyType="sale"
                    />

                    <PropertySection
                        id="rent-properties"
                        title="Imóveis para Aluguel"
                        description="As melhores opções de aluguel em Guararema, com localização privilegiada e ótima estrutura."
                        properties={propertiesForRent}
                        badge="Aluguel"
                        viewAllLink="/imoveis/aluguel"
                        viewAllText="Ver todos para aluguel"
                        propertyType="rent"
                        className="bg-stone-50"
                    />

                    {/* Seção de Referências e Contato */}
                    <ReferencesSection />
                </ScrollAnimations>
            </main>

            {/* Botão do WhatsApp fixo */}
            <WhatsAppButton phoneNumber="+5511999999999" />
        </OptimizationProvider>
    );
}
