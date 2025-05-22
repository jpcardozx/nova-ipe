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
    montSerratClass: string;
}

// Client component: receives all data and font class as props
export default function HomeClient({ destaques, aluguel, montSerratClass }: HomeClientProps) {
    return (
        <div className={`${montSerratClass} flex flex-col min-h-screen bg-[#fafaf9]`}>
            <Suspense fallback={null}>
                <HomepageLoadingOptimizer />
            </Suspense>

            {/* Otimizador para links compartilhados no WhatsApp */}
            <WhatsAppSharingOptimizer
                title="Nova Ipê Imobiliária - Imóveis Premium em Guararema"
                description="Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão."
                imageUrl="/images/og-image-whatsapp.jpg"
            />

            {/* Otimizador de imagens para melhorar Core Web Vitals */}
            <Suspense fallback={null}>
                <ImageOptimizer />
            </Suspense>

            <OptimizationProvider>
                <NavbarResponsive />
                <EnhancedHero />
                <ClientSidePropertiesProvider destaques={destaques} aluguel={aluguel} />
                <BlocoExploracaoSimbolica />

                <Suspense fallback={<section className="py-24 bg-white"><div className="container mx-auto px-4 max-w-7xl"><PropertiesLoadingSkeleton /></div></section>}>
                    <DestaquesSanityCarousel
                        rawProperties={destaques}
                        title="Imóveis Cuidadosamente Selecionados"
                        subtitle="Descubra propriedades que se destacam pela arquitetura impecável, localização estratégica e potencial de valorização excepcional em Guararema."
                    />
                </Suspense>

                <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
                    <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                    <Destaques />
                </section>

                <section className="py-24 bg-[#F8FAFC]">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
                    <Suspense fallback={<div className="container mx-auto px-4 max-w-7xl relative z-10"><PropertiesLoadingSkeleton /></div>}>
                        <DestaquesSanityCarousel
                            rawProperties={aluguel}
                            title="Seu Próximo Lar Está Aqui"
                            subtitle="Uma seleção de imóveis para alugar que prioriza qualidade de vida, ótima localização e custo-benefício real. Experimente morar com qualidade em Guararema."
                        />
                    </Suspense>
                </section>

                <div className="relative bg-white">
                    <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                    <Valor />
                </div>

                <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <SectionHeader
                            badge="Histórias de Sucesso"
                            badgeColor="amber"
                            title="O que Nossos Clientes Dizem"
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
