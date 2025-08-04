'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

// Componentes e providers
import OptimizationProvider from '../components/OptimizationProvider';
import WhatsAppButton from '../components/WhatsAppButton';
import SkipToContent from '../components/SkipToContent';
import Footer from "../sections/Footer";
import VisitaHero from './components/VisitaHero';
import ComparacaoROI from './components/ComparacaoROI';

export default function VisitaPage() {
    const abordagemSteps = [
        {
            number: "01",
            title: "Mapeamos seu perfil de investidor",
            description: "Em 15 minutos, entendemos exatamente o que você procura: não apenas tamanho e localização, mas ROI esperado, prazo de retorno e nível de risco aceitável.",
        },
        {
            number: "02",
            title: "Curadoria de oportunidades exclusivas",
            description: "Selecionamos apenas 3-5 propriedades que fazem sentido para você. Não perdemos seu tempo com imóveis que não se encaixam no seu perfil.",
        },
        {
            number: "03",
            title: "Visita com análise completa",
            description: "Acompanhamos você pessoalmente, com relatório de valorização, análise de custos ocultos e projeção de retorno personalizada na hora.",
        }
    ];

    return (
        <OptimizationProvider>
            <div className="font-body min-h-screen flex flex-col" style={{ paddingTop: '80px' }}>
                <SkipToContent />

                {/* Hero Section */}
                <VisitaHero />

                {/* Comparação de ROI */}
                <ComparacaoROI />

                {/* Nossa abordagem consultiva - Refatorada */}
                <section id="abordagem" className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto">
                            <div className="mb-16 max-w-4xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 mb-6 bg-blue-100 rounded-full px-6 py-3">
                                    <Check className="w-5 h-5 text-blue-600" />
                                    <span className="text-blue-700 text-sm font-semibold uppercase tracking-wide">
                                        Metodologia Comprovada
                                    </span>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                    Por que 94% dos nossos clientes fecham negócio em{' '}
                                    <span className="text-blue-600">até 30 dias</span>?
                                </h2>

                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Porque não perdemos tempo. Não mostramos qualquer imóvel. Mostramos apenas aqueles que
                                    fazem sentido para seu perfil, orçamento e objetivos. <strong>Resultado: decisões mais rápidas e certeiras.</strong>
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                                <div className="order-2 lg:order-1">
                                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl">
                                        <img
                                            src="/bg3.jpg"
                                            alt="Consultoria imobiliária especializada"
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                                                <div className="text-sm font-semibold text-gray-900 mb-1">Resultado Comprovado</div>
                                                <div className="text-xs text-gray-600">94% de taxa de sucesso • Média de 22 dias para fechamento</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2 space-y-8">
                                    {abordagemSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-6 group"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-600 font-bold transition-colors">
                                                {step.number}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Pronto para começar sua jornada?
                                </h3>
                                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                    Agende uma consultoria gratuita e descubra como nossa metodologia pode
                                    transformar sua busca por imóveis em resultados concretos.
                                </p>
                                <Link
                                    href="#agendar"
                                    className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2 text-lg"
                                >
                                    Agendar Consultoria Gratuita
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />

                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de agendar uma consultoria imobiliária em Guararema (via página de visita)."
                    pulseAnimation={true}
                    showAfterScroll={true}
                />
            </div>
        </OptimizationProvider>
    );
}
