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
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import type { ImovelClient as Imovel } from '../../src/types/imovel-client';
import PropertyCardPremium from '@/app/components/PropertyCardPremium';
import {
    transformToUnifiedPropertyList,
    toPropertyCardPremiumProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer';
import { cn } from '@/lib/utils';
import { useDataWithFallback } from '../../lib/hooks/useDataWithFallback';
import { fallbackImoveisAluguel, fallbackMessage } from '../../lib/fallback/mock-data';

function useDestaquesAluguel(staleTime = 300_000) {
    return useDataWithFallback({
        fetchFunction: getImoveisParaAlugar,
        fallbackData: fallbackImoveisAluguel,
        cacheKey: 'imoveis-para-alugar',
        staleTime,
        fallbackMessage
    });
}

export default function SecaoImoveisParaAlugarPremium() {
    const { data: imoveis, status, retry, isFallback, message } = useDestaquesAluguel();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Transform data
    const unifiedProperties = React.useMemo(() => {
        if (!imoveis || !Array.isArray(imoveis) || !imoveis.length) return [];
        return transformToUnifiedPropertyList(imoveis.slice(0, 9));
    }, [imoveis]);

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
                {/* Notification for fallback data */}
                {isFallback && message && (
                    <div className="mb-8 mx-auto max-w-4xl">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-sm">🔧</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-blue-800 text-sm font-medium">
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={retry}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                            >
                                Tentar reconectar
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Simplificado */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Home className="w-4 h-4" />
                        Oportunidades de Aluguel
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Imóveis para Alugar
                    </h2>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Encontre o lar ideal para sua família em Guararema com as melhores condições.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Properties Carousel */}
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: slidesCount }).map((_, slideIndex) => (
                                <div key={slideIndex} className="w-full flex-shrink-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 p-2 sm:p-4">
                                        {unifiedProperties
                                            .slice(slideIndex * 3, (slideIndex + 1) * 3)
                                            .map((property) => {
                                                const cardProps = toPropertyCardPremiumProps(property);
                                                return (
                                                    <div key={property.id} className="transform hover:scale-[1.02] transition-all duration-300">
                                                        <PropertyCardPremium
                                                            {...cardProps}
                                                            variant="compact"
                                                            className="h-full shadow-md hover:shadow-lg"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {slidesCount > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-slate-700 shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 z-10 border border-slate-200"
                                aria-label="Imóvel anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-slate-700 shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 z-10 border border-slate-200"
                                aria-label="Próximo imóvel"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

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
            </div>
        </section>
    );
}
