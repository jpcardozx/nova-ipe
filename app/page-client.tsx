"use client";

import React from 'react';
import { Suspense } from 'react';
import HomepageLoadingOptimizer from './components/HomepageLoadingOptimizer';
import OptimizationProvider from './components/OptimizationProvider';
import WhatsAppSharingOptimizer from './components/WhatsAppSharingOptimizer';
import ImageOptimizer from './components/ImageOptimizer';
import NavbarResponsive from './components/NavbarResponsive';
import EnhancedHero from './components/EnhancedHero';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import { default as ClientSidePropertiesProvider } from './components/ClientComponents';
import ClientCarouselWrapper from './components/ClientCarouselWrapper';
import DestaquesSanityCarousel from './components/DestaquesSanityCarousel';
import Destaques from './sections/Destaques';
import Valor from './sections/Valor';
import Testimonials from './sections/Testimonials';
import ClientProgressSteps from './components/ClientProgressSteps';
import FormularioContatoAprimorado from './components/FormularioContato';
import Footer from './sections/Footer';
import SectionHeader from './components/ui/SectionHeader';

// Props for hydration from server
export interface HomeClientProps {
    destaques: any[];
    aluguel: any[];
    className?: string;
}

// Client component: receives all data and font class as props
export default function HomeClient({ destaques, aluguel }: HomeClientProps) {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafaf9]">
            <Suspense fallback={null}>
                <HomepageLoadingOptimizer />
            </Suspense>            {/* Otimizador para links compartilhados no WhatsApp */}            <WhatsAppSharingOptimizer
                title="Nova Ipê Imobiliária - Seu Futuro em Guararema Começa Aqui"
                description="Realize seu sonho da casa própria ou faça um excelente investimento em Guararema. Imóveis selecionados com valorização acima da média do mercado."
                imageUrl="/images/og-image-whatsapp.jpg"
            />

            {/* Otimizador de imagens para melhorar Core Web Vitals */}
            <Suspense fallback={null}>
                <ImageOptimizer />
            </Suspense>

            <OptimizationProvider>
                <NavbarResponsive />
                <EnhancedHero />
                <ClientSidePropertiesProvider destaques={destaques} aluguel={aluguel} />                <BlocoExploracaoSimbolica />                    <Suspense fallback={<section className="py-24 bg-white"><div className="container mx-auto px-4 max-w-7xl"><PropertiesLoadingSkeleton /></div></section>}>
                    <DestaquesSanityCarousel
                        rawProperties={destaques}
                        title="Imóveis em Destaque"
                        subtitle="Seleção de oportunidades com potencial de valorização e localização estratégica. Atualizados periodicamente."
                    />
                </Suspense>

                <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
                    <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                    <Destaques />
                </section>

                <section className="py-24 bg-[#F8FAFC]">                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>                    <Suspense fallback={<div className="container mx-auto px-4 max-w-7xl relative z-10"><PropertiesLoadingSkeleton /></div>}>
                    <DestaquesSanityCarousel
                        rawProperties={aluguel}
                        title="Propriedades para Locação"
                        subtitle="Residências de alto padrão disponíveis para locação imediata. Consulte condições contratuais."
                    />
                </Suspense>
                </section>

                <div className="relative bg-white">
                    <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                    <Valor />
                </div>

                <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
                    <div className="container mx-auto px-4 max-w-7xl">                        <SectionHeader
                        badge="Experiências"
                        badgeColor="amber"
                        title="Depoimentos de Clientes"
                    />
                        <Testimonials />
                    </div>
                </section>

                <section className="py-24 bg-white">
                    <ClientProgressSteps />
                </section>

                <FormularioContatoAprimorado />
                <Footer />
            </OptimizationProvider>
        </div>
    );
}

// Only UI/CSR logic below
function PropertiesLoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-8 w-56 bg-neutral-200 animate-pulse rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-lg shadow-md"></div>
                ))}
            </div>
        </div>
    );
}
