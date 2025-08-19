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
import { ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
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
        <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-pattern-dots" />
            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center mb-3 px-4 py-1.5 border border-blue-200 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
                        {subtitle}
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-blue-900">
                        {title}
                    </h2>
                    <p className="text-stone-600 text-lg">{description}</p>
                </header>
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
            title="Imóveis para aluguel"
            subtitle="Aluguéis exclusivos"
            description="Espaços selecionados por localização, qualidade e conforto para toda a família."
        >
            <div ref={sectionRef} tabIndex={0} onKeyDown={handleKeyNav}>
                {status !== 'success' && (
                    <SectionState status={status} onRetry={refetch} emptyLink="/alugar" />
                )}                {status === 'success' && data.length > 0 && (
                    <>
                        {/* Grid de Cards Premium */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(() => {
                                const unifiedProperties = transformToUnifiedPropertyList(data.slice(0, 6))
                                return unifiedProperties.map((property) => {
                                    const cardProps = toPropertyCardPremiumProps(property)
                                    return (
                                        <PropertyCardPremium
                                            key={property.id}
                                            {...cardProps}
                                            variant="default"
                                            className="hover:shadow-xl transition-shadow duration-300"
                                        />
                                    )
                                })
                            })()}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/alugar"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
                            >
                                Ver mais opções para alugar
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </SectionWrapper>
    );
}
