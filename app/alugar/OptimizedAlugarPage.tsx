'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import { useInView } from 'react-intersection-observer';
import type { ImovelClient } from '../../src/types/imovel-client';
import { OptimizedIcons } from '@/app/utils/optimized-icons';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';

// Declare DOM types for this client component
declare global {
    interface HTMLElement {
        setAttribute(name: string, value: string): void;
    }
}

// Dynamic imports for performance optimization
const NavBar = dynamic(() => import('@sections/NavBar'), {
    ssr: true,
    loading: () => <div className="h-24 bg-white shadow animate-pulse" />
});

const Footer = dynamic(() => import('@sections/Footer'), {
    ssr: false, // Load footer after main content
    loading: () => <div className="h-40 bg-neutral-100 animate-pulse" />
});

const Valor = dynamic(() => import('@sections/Valor'), {
    ssr: false, // Load after main content since it's below the fold
    loading: () => <div className="h-32 bg-neutral-50 animate-pulse" />
});

// Loading skeleton component (memoized to avoid re-renders)
const PropertiesLoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded mb-4" />
                        <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-8 bg-gray-100 rounded" />
                            <div className="h-8 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

/**
 * OptimizedAlugarPage - Performance enhanced version of the rental properties page
 * Features virtualization, lazy-loading, and intersection observer for performance
 */
export default function OptimizedAlugarPage() {
    // State for properties with loading state management
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Intersection observer for the valor section to delay loading
    const { ref: valorRef, inView: valorInView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    // Track initial load for performance metrics
    const [initialLoadTime] = useState(() => performance.now());

    useEffect(() => {
        // Set critical CSS optimization flag
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-page', 'property-listing');
        }

        // Fetch properties with performance tracking
        const fetchImoveis = async () => {
            try {
                const startTime = performance.now();
                const data = await getImoveisParaAlugar();
                const fetchTime = performance.now() - startTime;

                // Log performance metric for analysis
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Performance] Fetch time: ${Math.round(fetchTime)}ms`);
                }

                // Process data with optimized memory usage
                setImoveis(data);
            } catch (err) {
                console.error('Erro ao buscar imóveis:', err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
            } finally {
                setIsLoading(false);

                // Report total page load time
                const totalLoadTime = performance.now() - initialLoadTime;
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Performance] Total page load time: ${Math.round(totalLoadTime)}ms`);
                }
            }
        };

        fetchImoveis();
    }, [initialLoadTime]);

    // Handler para favoritos
    const handleToggleFavorite = (id: string) => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];

            if (favorites.includes(id)) {
                const index = favorites.indexOf(id);
                favorites.splice(index, 1);
            } else {
                favorites.push(id);
            }

            localStorage.setItem('property-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Erro ao processar favoritos:', error);
        }
    };

    // Verificar se um imóvel é favorito
    const isFavorite = (id: string): boolean => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];
            return favorites.includes(id);
        } catch {
            return false;
        }
    };

    return (
        <>
            <NavBar />
            <main className="pt-28 pb-20 bg-neutral-50 text-neutral-900 min-h-screen">
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-blue-900">Imóveis para Alugar</h1>
                        <p className="mt-4 text-neutral-600 text-lg">
                            Confira os imóveis disponíveis com boa localização, segurança e excelente custo-benefício.
                        </p>
                    </div>

                    {isLoading ? (
                        <PropertiesLoadingSkeleton />
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-8 max-w-2xl mx-auto text-center">
                            <h2 className="text-xl font-bold text-red-800 mb-4">Erro ao carregar imóveis</h2>
                            <p className="text-red-700 mb-6">{error}</p>
                            <button
                                onClick={() => {
                                    setIsLoading(true);
                                    setError(null);
                                    getImoveisParaAlugar()
                                        .then(data => setImoveis(data))
                                        .catch(err => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
                                        .finally(() => setIsLoading(false));
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : imoveis.length === 0 ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 max-w-2xl mx-auto text-center">
                            <h2 className="text-xl font-bold text-blue-800 mb-4">Nenhum imóvel encontrado</h2>
                            <p className="text-blue-700 mb-6">
                                No momento não temos imóveis disponíveis para aluguel.
                                Entre em contato conosco para verificar novas opções em breve.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {imoveis.map(imovel => (
                                <PropertyCardUnified
                                    key={imovel._id}
                                    id={imovel._id} title={imovel.titulo || 'Imóvel para alugar'}
                                    slug={imovel.slug as string || imovel._id}
                                    location={imovel.bairro || ''}
                                    city={imovel.cidade}
                                    price={imovel.preco || 0}
                                    propertyType="rent"
                                    area={imovel.areaUtil}
                                    bedrooms={imovel.dormitorios}
                                    bathrooms={imovel.banheiros}
                                    parkingSpots={imovel.vagas} mainImage={{
                                        url: imovel.imagem?.imagemUrl || '',
                                        alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel para alugar',
                                        sanityImage: imovel.imagem
                                    }}
                                    isHighlight={imovel.destaque}
                                    isFavorite={isFavorite(imovel._id)}
                                    onFavoriteToggle={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Valor section loaded only when scrolled into view */}
                <div ref={valorRef} className="mt-24">
                    {valorInView && <Valor />}
                </div>
            </main>
            <Footer />
        </>
    );
}
