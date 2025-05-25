"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import NavbarResponsive from './components/NavbarResponsive';
import { PriorityContent, BelowFoldContent } from './components/OptimizedLoading';
import SectionHeader from './components/ui/SectionHeader';
import EnhancedHero from './components/EnhancedHero';

// Critical above-the-fold components - load immediately
// Everything else is dynamically imported for progressive loading

// Core content providers
const ClientSidePropertiesProvider = dynamic(() =>
    import('./components/ClientComponents').then(mod => ({ default: mod.default })),
    { loading: () => null, ssr: false }
);

// Main sections - optimized loading
const BlocoExploracaoSimbolica = dynamic(() =>
    import('./components/BlocoExploracaoSimbolica'),
    { ssr: true, loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const DestaquesSanityCarousel = dynamic(() =>
    import('./components/DestaquesSanityCarousel'),
    { loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const Destaques = dynamic(() =>
    import('./sections/Destaques'),
    { loading: () => <div className="h-80 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const Valor = dynamic(() =>
    import('./sections/Valor'),
    { loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const Referencias = dynamic(() =>
    import('./sections/Referencias'),
    { loading: () => <div className="h-80 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const ClientProgressSteps = dynamic(() =>
    import('./components/ClientProgressSteps'),
    { loading: () => <div className="h-64 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const ContactSection = dynamic(() =>
    import('./sections/Contact'),
    { loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const ExclusiveAnalysisOffer = dynamic(() =>
    import('./sections/ExclusiveAnalysisOffer'),
    { loading: () => <div className="h-80 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const FormularioContato = dynamic(() =>
    import('./components/FormularioContato'),
    { loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" /> }
);

const Footer = dynamic(() =>
    import('./sections/Footer'),
    { ssr: true, loading: () => <div className="h-64 bg-neutral-800 animate-pulse" /> }
);

// Performance optimization components
const HomepageLoadingOptimizer = dynamic(() =>
    import('./components/HomepageLoadingOptimizer'),
    { ssr: false, loading: () => null }
);

const WhatsAppSharingOptimizer = dynamic(() =>
    import('./components/WhatsAppSharingOptimizer'),
    { ssr: false, loading: () => null }
);

const WhatsAppButton = dynamic(() =>
    import('./components/WhatsAppButton'),
    { ssr: false, loading: () => null }
);

// Props interface
export interface HomeClientProps {
    destaques: any[];
    aluguel: any[];
    className?: string;
}

// Optimized client component with complete content structure
export default function HomeClient({ destaques, aluguel }: HomeClientProps) {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafaf9]">
            {/* Critical above-fold content - immediate load */}
            <PriorityContent>
                <NavbarResponsive />
            </PriorityContent>

            {/* Hero section - high priority */}
            <PriorityContent>
                <EnhancedHero />
            </PriorityContent>

            {/* Performance optimization - background load */}
            <PriorityContent fallback={null}>
                <HomepageLoadingOptimizer />
                <WhatsAppSharingOptimizer />
            </PriorityContent>

            {/* Exclusive Analysis Section - Above fold priority */}
            <section id="analise-exclusiva" className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BelowFoldContent minHeight="300px">
                        <ExclusiveAnalysisOffer />
                    </BelowFoldContent>
                </div>
            </section>

            {/* Market Exploration Block */}
            <BelowFoldContent minHeight="400px">
                <BlocoExploracaoSimbolica />
            </BelowFoldContent>            {/* Properties Content Provider */}
            <ClientSidePropertiesProvider destaques={[]} aluguel={[]} />

            {/* Properties Showcase Sections */}            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BelowFoldContent minHeight="400px">
                        <DestaquesSanityCarousel rawProperties={[]} />
                    </BelowFoldContent>

                    <div className="py-8">
                        <BelowFoldContent minHeight="300px">
                            <Destaques />
                        </BelowFoldContent>
                    </div>                    <BelowFoldContent minHeight="400px">
                        <DestaquesSanityCarousel rawProperties={[]} />
                    </BelowFoldContent>
                </div>
            </section>

            {/* Value Proposition */}
            <BelowFoldContent>
                <Valor />
            </BelowFoldContent>

            {/* Client References and Testimonials */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BelowFoldContent>
                        <Referencias />
                    </BelowFoldContent>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionHeader
                        title="Sua Jornada Imobiliária"
                        subtitle="Conduzimos você por cada etapa com transparência total"
                        align="center"
                    />
                    <BelowFoldContent>
                        <ClientProgressSteps />
                    </BelowFoldContent>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <BelowFoldContent>
                        <ContactSection />
                    </BelowFoldContent>
                </div>
            </section>

            {/* Main Contact Form */}
            <BelowFoldContent>
                <FormularioContato />
            </BelowFoldContent>

            {/* Footer */}
            <PriorityContent>
                <Footer />
            </PriorityContent>            {/* WhatsApp Floating Button */}
            <WhatsAppButton phoneNumber="+5511999999999" />
        </div>
    );
}
