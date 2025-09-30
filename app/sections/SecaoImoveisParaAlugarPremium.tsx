'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertTriangle,
    Home,
    Eye,
    MessageSquare
} from 'lucide-react';
import type { ImovelClient as Imovel } from '../../src/types/imovel-client';
import PropertyCardNew from '../components/PropertyCardNew'
import HeroStyleCarousel from '../components/HeroStyleCarousel'
import {
    transformToUnifiedPropertyList,
    toPropertyCardSectionProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer';
import { cn } from '@/lib/utils';

interface SecaoImoveisParaAlugarPremiumProps {
    properties: Imovel[];
}

export default function SecaoImoveisParaAlugarPremium({ properties }: SecaoImoveisParaAlugarPremiumProps) {
    const imoveis = properties;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Transform data
    const unifiedProperties = React.useMemo(() => {
        if (!imoveis || !Array.isArray(imoveis) || !imoveis.length) return [];
        return transformToUnifiedPropertyList(imoveis.slice(0, 9));
    }, [imoveis]);

    // Função retry para recarregar
    const retry = () => {
        window.location.reload();
    };

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || unifiedProperties.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % Math.ceil(unifiedProperties.length / 3));
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, unifiedProperties.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 12000);
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % Math.ceil(unifiedProperties.length / 3));
    };

    const prevSlide = () => {
        goToSlide(currentSlide === 0 ? Math.ceil(unifiedProperties.length / 3) - 1 : currentSlide - 1);
    };

    if (status === 'loading') {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50/50 to-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600">Carregando imóveis para alugar...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (status === 'error') {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50/50 to-red-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Erro ao carregar imóveis
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Não foi possível carregar os imóveis para alugar no momento.
                        </p>
                        <button
                            onClick={retry}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (status === 'empty' || !unifiedProperties.length) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50/50 to-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <Home className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                            Novos Imóveis em Breve
                        </h3>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Nossa equipe está organizando novos imóveis para aluguel em Guararema.
                            Entre em contato para conhecer oportunidades exclusivas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/catalogo"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Eye className="w-5 h-5" />
                                Ver Todos os Imóveis
                            </Link>
                            <Link
                                href="/contato"
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Falar Conosco
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const slidesCount = Math.ceil(unifiedProperties.length / 3);

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50/50 to-slate-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Premium S-Tier */}
                <div className="text-center mb-4">
                    {/* Badge S-Tier */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 text-blue-800 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <Home className="w-4 h-4" />
                        Oportunidades
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Imóveis para{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 bg-clip-text text-transparent">
                            Aluguel
                        </span>
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Encontre o lar ideal para sua família em Guararema com{' '}
                        <span className="font-semibold text-blue-700">as melhores condições</span>{' '}
                        de aluguel do mercado
                    </p>
                </div>

                {/* Carrossel Premium com paleta do Hero */}
                <div className="relative px-4 sm:px-8">
                    <HeroStyleCarousel
                        title=""
                        subtitle=""
                        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                        autoPlay={true}
                        autoPlayInterval={7000}
                        className="bg-transparent"
                    >
                        {unifiedProperties.map((property, index) => {
                            const cardProps = toPropertyCardSectionProps(property);
                            return (
                                <PropertyCardNew
                                    key={property.id}
                                    {...cardProps}
                                    isHighlighted={index < 2} // Destaque nos 2 primeiros
                                    className="h-full"
                                />
                            );
                        })}
                    </HeroStyleCarousel>
                </div>

                {/* Dots Indicator */}
                {slidesCount > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: slidesCount }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "transition-all duration-300 rounded-full",
                                    index === currentSlide
                                        ? "w-6 h-2 bg-blue-500"
                                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                                )}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* CTA Section Simplificado */}
            <div className="text-center mt-12">
                <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        Encontre seu Novo Lar
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        Explore todas as opções de aluguel disponíveis ou entre em contato para mais informações.
                    </p>

                    {/* Catálogo Complementar */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/60 rounded-xl p-6 mb-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <p className="text-slate-700 font-medium">
                                Catálogo Complementar
                            </p>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Explore opções adicionais de imóveis em{' '}
                            <a
                                href="https://portal.imobiliariaipe.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1"
                            >
                                portal.imobiliariaipe.com.br
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/catalogo?tipo=aluguel"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye className="w-5 h-5" />
                            Ver Todos para Aluguel
                        </Link>

                        <Link
                            href="/contato"
                            className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Fale Conosco
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
