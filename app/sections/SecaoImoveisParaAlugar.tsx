'use client';

import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
    KeyboardEvent,
} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Loader2, AlertTriangle, Key, Award, Home } from 'lucide-react';
import { getImoveisParaAlugar } from '../../lib/sanity/fetchImoveis';
import type { ImovelClient as Imovel } from '../../src/types/imovel-client';
import PropertyCardPremium from '@/app/components/PropertyCardPremium';
import {
    transformToUnifiedPropertyList,
    toPropertyCardPremiumProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer';
import { cn } from '@/lib/utils';

function useDestaquesAluguel(staleTime = 300_000) {
    const [data, setData] = useState<Imovel[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
    const [retry, setRetry] = useState(0);

    const fetchData = useCallback(async () => {
        setStatus('loading');
        try {
            const cacheKey = 'destaques-aluguel';
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data: d, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < staleTime) {
                    setData(d);
                    return setStatus(d.length ? 'success' : 'empty');
                }
            }
            const d = await getImoveisParaAlugar();
            setData(d);
            setStatus(d.length ? 'success' : 'empty');
            sessionStorage.setItem(cacheKey, JSON.stringify({ data: d, timestamp: Date.now() }));
        } catch {
            setStatus('error');
        }
    }, [staleTime, retry]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, status, refetch: () => setRetry((c) => c + 1) };
}

function SectionWrapper({
    title,
    subtitle,
    description,
    children,
}: {
    title: string;
    subtitle: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="relative py-16 bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-pattern-dots" />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header Premium S-Tier */}
                <div className="text-center mb-16">
                    {/* Badge S-Tier */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/50 text-emerald-800 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <Key className="w-4 h-4" />
                        Locações Exclusivas
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Imóveis para{' '}
                        <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">
                            Aluguel
                        </span>
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Espaços selecionados em Guararema com{' '}
                        <span className="font-semibold text-emerald-700">localização privilegiada</span>{' '}
                        e total conforto para sua família
                    </p>
                </div>
                {children}
            </div>
        </section>
    );
}

function SectionState({
    status,
    onRetry,
    emptyLink,
}: {
    status: 'loading' | 'empty' | 'error';
    onRetry: () => void;
    emptyLink: string;
}) {
    // loading
    if (status === 'loading') {
        return <CarouselSkeleton />;
    }
    // error
    if (status === 'error') {
        return (
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-2">Não foi possível carregar os imóveis</h3>
                <p className="text-red-700 mb-4">Ocorreu um erro ao buscar os imóveis para alugar.</p>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Recarregar
                </button>
            </div>
        );
    }
    // empty
    return (
        <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhum imóvel</h3>
            <p className="text-stone-600 mb-4">Em breve teremos novidades.</p>
            <Link href={emptyLink} className="text-blue-700 hover:underline font-medium">
                Ver todos
            </Link>
        </div>
    );
}

function CarouselSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-stone-200 rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300" />
                    <div className="p-4 space-y-2">
                        <div className="h-6 bg-stone-300 rounded" />
                        <div className="h-4 bg-stone-300 rounded w-3/4" />
                        <div className="flex gap-2">
                            <div className="h-8 bg-stone-300 rounded w-1/2" />
                            <div className="h-8 bg-stone-300 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SecaoImoveisParaAlugar() {
    const { data, status, refetch } = useDestaquesAluguel();
    const { ref: sectionRef } = useInView({ triggerOnce: true, rootMargin: '200px', threshold: 0.1 });

    const handleKeyNav = (e: KeyboardEvent<HTMLDivElement>) => {
        // Navegação por teclado será implementada internamente pelo PropertyCarousel
    };

    return (
        <SectionWrapper
            title=""
            subtitle=""
            description=""
        >
            <div ref={sectionRef} tabIndex={0} onKeyDown={handleKeyNav}>
                {status !== 'success' && (
                    <SectionState status={status} onRetry={refetch} emptyLink="/alugar" />
                )}                {status === 'success' && data.length > 0 && (
                    <>
                        {/* Grid de Cards Premium */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(() => {
                                const unifiedProperties = transformToUnifiedPropertyList(data.slice(0, 6))
                                return unifiedProperties.map((property, index) => {
                                    const cardProps = toPropertyCardPremiumProps(property)
                                    return (
                                        <PropertyCardPremium
                                            key={property.id}
                                            {...cardProps}
                                            variant="default"
                                            className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-md"
                                        />
                                    )
                                })
                            })()}
                        </div>

                        {/* CTA Section Premium */}
                        <div className="mt-16 text-center">
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100/50 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    Encontre seu Lar Ideal
                                </h3>
                                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                                    Explore nossa seleção completa de imóveis para locação em Guararema
                                </p>
                                <Link
                                    href="/catalogo"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold"
                                >
                                    <Home className="w-5 h-5" />
                                    Ver Todos os Aluguéis
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SectionWrapper>
    );
}
