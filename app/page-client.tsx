"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import NavbarResponsive from './components/NavbarResponsive';
import HighPerformanceHero from './components/HighPerformanceHero';
import LoadingSpinner from './components/LoadingSpinner';
import { PriorityContent, BelowFoldContent } from './components/OptimizedLoading';
import SectionHeader from './components/ui/SectionHeader';
import EnhancedHero from '@/backups/pagina-aprimorada-backup/components/EnhancedHero';
import { safeDynamicImport } from './utils/dynamic-import-fix';

// Only import critical above-the-fold components directly
// Everything else is dynamically imported for better initial load performance

// Dynamically import below-the-fold components - fixed to prevent webpack call undefined errors
const ClientSidePropertiesProvider = dynamic(() =>
    safeDynamicImport(import('./components/ClientComponents'), 'ClientSidePropertiesProvider'),
    { loading: () => null }
);
const BlocoExploracaoSimbolica = dynamic(() =>
    safeDynamicImport(import('./components/BlocoExploracaoSimbolica'), 'BlocoExploracaoSimbolica'),
    { ssr: true }
);
const DestaquesSanityCarousel = dynamic(() =>
    safeDynamicImport(import('./components/DestaquesSanityCarousel'), 'DestaquesSanityCarousel')
);
const Destaques = dynamic(() =>
    safeDynamicImport(import('./sections/Destaques'), 'Destaques')
);
const Valor = dynamic(() =>
    safeDynamicImport(import('./sections/Valor'), 'Valor')
);
const Testimonials = dynamic(() =>
    safeDynamicImport(import('./sections/Testimonials'), 'Testimonials')
);
const ClientProgressSteps = dynamic(() =>
    safeDynamicImport(import('./components/ClientProgressSteps'), 'ClientProgressSteps')
);
const FormularioContatoAprimorado = dynamic(() =>
    safeDynamicImport(import('./components/FormularioContato'), 'FormularioContatoAprimorado')
);
const Footer = dynamic(() =>
    safeDynamicImport(import('./sections/Footer'), 'Footer'),
    { ssr: true }
);

// Dynamic imports for optimization components with better loading strategy
const HomepageLoadingOptimizer = dynamic(() =>
    safeDynamicImport(import('./components/HomepageLoadingOptimizer'), 'HomepageLoadingOptimizer'),
    {
        ssr: false,
        loading: () => null
    }
);

const WhatsAppSharingOptimizer = dynamic(() =>
    safeDynamicImport(import('./components/WhatsAppSharingOptimizer'), 'WhatsAppSharingOptimizer'),
    {
        ssr: false,
        loading: () => null
    }
);

// Props interface
export interface HomeClientProps {
    destaques: any[];
    aluguel: any[];
    className?: string;
}

// Client component with optimized loading
export default function HomeClient({ destaques, aluguel }: HomeClientProps) {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafaf9]">
            {/* Critical above-fold content - loaded immediately and optimized */}
            <PriorityContent>
                <NavbarResponsive />
            </PriorityContent>

            {/* Hero section - high priority and optimized */}
            <PriorityContent>
                <EnhancedHero />
            </PriorityContent>

            {/* Optimization components - loaded in background */}
            <PriorityContent fallback={null}>
                <HomepageLoadingOptimizer />
                <WhatsAppSharingOptimizer
                    title="Ipê Imóveis - Serviços e Atendimento Imobiliário em Guararema"
                    description="Imóveis selecionados com valorização acima da média do mercado. Conheça os melhores bairros e oportunidades em Guararema."
                    imageUrl="/images/og-image-whatsapp.jpg"
                />
            </PriorityContent>

            {/* Main content - loaded progressively as user scrolls */}
            <ClientSidePropertiesProvider destaques={destaques} aluguel={aluguel} />

            {/* Progressive loading below-the-fold content */}
            <BelowFoldContent minHeight="400px">
                <BlocoExploracaoSimbolica />
            </BelowFoldContent>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BelowFoldContent minHeight="400px">
                        <DestaquesSanityCarousel
                            rawProperties={destaques}
                            title="Destaques para Compra"
                            subtitle="Imóveis selecionados para você"
                        />
                    </BelowFoldContent>

                    <BelowFoldContent minHeight="300px">
                        <Destaques />
                    </BelowFoldContent>

                    <BelowFoldContent minHeight="400px">
                        <DestaquesSanityCarousel
                            rawProperties={aluguel}
                            title="Destaques para Aluguel"
                            subtitle="As melhores opções para locação"
                        />
                    </BelowFoldContent>
                </div>
            </section>

            <BelowFoldContent>
                <Valor />
            </BelowFoldContent>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionHeader
                        title="O que nossos clientes dizem"
                        subtitle="Histórias reais de sucesso"
                    />
                    <BelowFoldContent>
                        <Testimonials />
                    </BelowFoldContent>
                </div>
            </section>

            <BelowFoldContent>
                <ClientProgressSteps />
            </BelowFoldContent>

            <BelowFoldContent>
                <FormularioContatoAprimorado />
            </BelowFoldContent>

            <PriorityContent>
                <Footer />
            </PriorityContent>
        </div>
    );
}
