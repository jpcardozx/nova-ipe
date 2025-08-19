'use client'

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Home, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImovelClient } from '../../src/types/imovel-client';
import PropertyCardPremium from '@/app/components/PropertyCardPremium';
import {
    transformToUnifiedPropertyList,
    toPropertyCardPremiumProps
} from '@/lib/unified-property-transformer';

interface DestaquesVendaProps {
    imoveis: ImovelClient[];
    titulo?: string;
    subtitulo?: string;
    className?: string;
}

export default function DestaquesVendaClean({
    imoveis = [],
    titulo = "Imóveis em Destaque",
    subtitulo = "Oportunidades selecionadas para você",
    className
}: DestaquesVendaProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '100px',
        threshold: 0.1
    });

    // Filter only sale properties
    const imoveisVenda = imoveis.filter(imovel =>
        imovel.finalidade === 'Venda'
    );

    if (!imoveisVenda.length) {
        return null;
    }

    return (
        <section
            ref={ref}
            className={cn(
                "py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/30",
                className
            )}
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className={cn(
                        "transition-all duration-700 ease-out",
                        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                                DESTAQUES
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                            {titulo}
                        </h2>

                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {subtitulo}
                        </p>
                    </div>
                </div>

                {/* Properties Grid */}
                <div className={cn(
                    "transition-all duration-700 ease-out delay-200",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    {(() => {
                        const unifiedProperties = transformToUnifiedPropertyList(imoveisVenda.slice(0, 6));

                        if (unifiedProperties.length === 0) {
                            return (
                                <div className="text-center py-16">
                                    <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                        Novos destaques em breve
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        Nossa equipe está selecionando os melhores imóveis para você.
                                    </p>
                                    <Link
                                        href="/catalogo"
                                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Ver Catálogo Completo
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {unifiedProperties.map((property, index) => {
                                    const cardProps = toPropertyCardPremiumProps(property);

                                    return (
                                        <div
                                            key={property.id}
                                            className={cn(
                                                "transition-all duration-500 ease-out",
                                                inView
                                                    ? "opacity-100 translate-y-0"
                                                    : "opacity-0 translate-y-8"
                                            )}
                                            style={{
                                                transitionDelay: `${300 + index * 100}ms`
                                            }}
                                        >
                                            <PropertyCardPremium
                                                {...cardProps}
                                                variant="featured"
                                                className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                {/* Call to Action */}
                {imoveisVenda.length > 6 && (
                    <div className={cn(
                        "text-center mt-12 lg:mt-16 transition-all duration-700 ease-out delay-500",
                        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        <Link
                            href="/comprar"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-500 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <span>Ver Todos os Imóveis à Venda</span>
                            <ExternalLink className="w-5 h-5" />
                        </Link>
                    </div>
                )}

                {/* Stats */}
                <div className={cn(
                    "mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ease-out delay-600",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-3xl font-bold text-amber-600 mb-2">
                            {imoveisVenda.length}+
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            Imóveis à Venda
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            15+
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            Anos de Experiência
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            500+
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            Negócios Realizados
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            100%
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            Satisfação Cliente
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
