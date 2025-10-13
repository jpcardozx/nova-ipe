'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Loader2,
    AlertTriangle,
    Home,
    TrendingUp,
    ArrowRight,
    MapPin,
    Eye,
    Star,
    Award,
    DollarSign,
    Users
} from 'lucide-react';
import type { ImovelClient as Imovel } from '../../src/types/imovel-client';
import PropertyCardNew from '../components/PropertyCardNew'
import HeroStyleCarousel from '../components/HeroStyleCarousel'
import {
    transformToUnifiedPropertyList,
    toPropertyCardSectionProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer'
import { cn } from '@/lib/utils';

interface DestaquesVendaPremiumProps {
    properties: Imovel[];
}

export default function DestaquesVendaPremium({ properties }: DestaquesVendaPremiumProps) {
    const imoveis = properties;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Transform data
    const unifiedProperties = React.useMemo(() => {
        if (!imoveis || !imoveis.length) return [];
        return transformToUnifiedPropertyList(imoveis.slice(0, 9));
    }, [imoveis]);

    // Determine loading/error states based on data
    const isLoading = !properties; // Se properties é undefined/null
    const isEmpty = !unifiedProperties.length;
    const hasError = false; // Por enquanto sempre false, pode ser estendido

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

    if (isLoading) {
        return (
            <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600">Carregando imóveis em destaque...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (hasError) {
        return (
            <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-red-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Erro ao carregar destaques
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Não foi possível carregar os imóveis em destaque no momento.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (isEmpty) {
        return (
            <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <Star className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                            Novos Destaques em Breve
                        </h3>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Nossa equipe está selecionando os melhores imóveis para venda em Guararema.
                            Entre em contato para conhecer oportunidades exclusivas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/catalogo"
                                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Eye className="w-5 h-5" />
                                Ver Todos os Imóveis
                            </Link>
                            <Link
                                href="/contato"
                                className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-5 h-5" />
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
        <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50/30">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Premium S-Tier */}
                <div className="text-center mb-4">
                    {/* Badge S-Tier */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 text-amber-800 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <Star className="w-4 h-4" />
                        Oportunidades em Destaque
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Imóveis à{' '}
                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Venda
                        </span>
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Oportunidades exclusivas em Guararema com{' '}
                        <span className="font-semibold text-amber-500">as melhores condições</span>{' '}
                        do mercado imobiliário
                    </p>
                </div>

                {/* Carrossel Premium */}
                <div className="relative px-4 sm:px-8">
                    <HeroStyleCarousel
                        title=""
                        subtitle=""
                        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                        autoPlay={true}
                        autoPlayInterval={6000}
                        className="bg-transparent"
                    >
                        {unifiedProperties.map((property, index) => {
                            const cardProps = toPropertyCardSectionProps(property);
                            return (
                                <PropertyCardNew
                                    key={property.id}
                                    {...cardProps}
                                    isHighlighted={index < 3}
                                    className="h-full transform hover:scale-[1.02] transition-all duration-300"
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
                                        ? "w-6 h-2 bg-amber-500"
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
                        Encontre seu Imóvel Ideal
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        Navegue por nossa seleção completa ou fale conosco para um atendimento personalizado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/catalogo?tipo=venda"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye className="w-5 h-5" />
                            Ver Todos para Venda
                        </Link>

                        <Link
                            href="/contato"
                            className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-5 h-5" />
                            Fale Conosco
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
