'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getImoveisParaVenda } from '@lib/sanity/fetchImoveis';
import type { ImovelClient } from '../../src/types/imovel-client';
import { OptimizedIcons } from '@/app/utils/optimized-icons';
import { usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

// Declare DOM types for this client component
declare global {
    interface HTMLElement {
        setAttribute(name: string, value: string): void;
    }
}

// Dynamic imports for performance optimization
const NavBar = dynamic(() => import('@/app/sections/NavBar'), {
    ssr: true,
    loading: () => <div className="h-24 bg-white shadow animate-pulse" />
});

const Footer = dynamic(() => import('@/app/sections/Footer'), {
    ssr: false, // Load footer after main content
    loading: () => <div className="h-40 bg-neutral-100 animate-pulse" />
});

const Valor = dynamic(() => import('@/app/sections/Valor'), {
    ssr: false, // Load after main content since it's below the fold
    loading: () => <div className="h-32 bg-neutral-50 animate-pulse" />
});

// Import the unified property card component with explicit webpack chunkName for better code splitting
const PropertyCardUnified = dynamic(
    () => import(/* webpackChunkName: "property-card-unified" */ '@/app/components/ui/property/PropertyCardUnified'), {
    ssr: true,
    loading: () => <div className="h-96 bg-white animate-pulse rounded-lg" />
}
);

// Import the unified virtualized grid component with explicit webpack chunkName
const VirtualizedPropertiesGridUnified = dynamic(
    () => import(/* webpackChunkName: "virtualized-grid-unified" */ '@/app/components/VirtualizedPropertiesGridUnified'), {
    ssr: true,
    loading: () => <PropertiesLoadingSkeleton />
}
);

// Loading skeleton component (memoized to avoid re-renders)
const PropertiesLoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100">
                    <div className="h-56 bg-stone-200 relative">
                        {/* Badge placeholder */}
                        <div className="absolute top-3 left-3 h-6 w-16 bg-emerald-200 rounded-md"></div>
                        {/* Favorite button placeholder */}
                        <div className="absolute top-3 right-3 h-8 w-8 bg-white/80 rounded-full"></div>
                    </div>
                    <div className="p-5">
                        {/* Price */}
                        <div className="h-7 bg-emerald-100 rounded-md w-1/3 mb-3"></div>
                        {/* Title */}
                        <div className="h-6 bg-stone-100 rounded-md w-5/6 mb-2"></div>
                        <div className="h-6 bg-stone-100 rounded-md w-3/4 mb-4"></div>
                        {/* Location */}
                        <div className="h-5 bg-stone-100 rounded-md w-2/3 mb-6 flex items-center">
                            <div className="h-4 w-4 bg-stone-200 rounded mr-2"></div>
                        </div>
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {Array(4).fill(0).map((_, j) => (
                                <div key={j} className="flex items-center">
                                    <div className="h-8 w-8 bg-stone-100 rounded-md mr-2"></div>
                                    <div>
                                        <div className="h-3 bg-stone-100 rounded-md w-14 mb-1"></div>
                                        <div className="h-4 bg-stone-100 rounded-md w-8"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* CTA */}
                        <div className="h-5 bg-blue-100 rounded-md w-1/2 mt-3"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

/**
 * OptimizedComprarPage - Performance enhanced version of the sales properties page
 * Features virtualization, lazy-loading, and intersection observer for performance
 */
export default function OptimizedComprarPage() {
    // State for properties with loading state management
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    // Intersection observer for the valor section to delay loading
    const { ref: valorRef, inView: valorInView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    // Track initial load for performance metrics
    const [initialLoadTime] = useState(() => performance.now());    // Function to retry loading if it fails
    const retryLoading = useCallback(() => {
        setIsLoading(true);
        setLoadingError(null);
        fetchImoveis();
    }, []);

    // Fetch properties with performance tracking
    const fetchImoveis = async () => {
        try {
            const startTime = performance.now();
            const data = await getImoveisParaVenda();
            const fetchTime = performance.now() - startTime;

            // Log performance metric for analysis
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Performance] Fetch time: ${Math.round(fetchTime)}ms`);
            }

            // Process data
            setImoveis(data);
            setLoadingError(null);
        } catch (err) {
            console.error('Erro ao buscar imóveis para venda:', err);
            setLoadingError('Não foi possível carregar os imóveis. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);

            // Report total page load time
            const totalLoadTime = performance.now() - initialLoadTime;
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Performance] Total page load time: ${Math.round(totalLoadTime)}ms`);
            }
        }
    };

    useEffect(() => {
        // Set critical CSS optimization flag
        document.documentElement.setAttribute('data-page', 'property-listing');
        fetchImoveis();
    }, [initialLoadTime]);    // Function to handle toggling favorites
    const handleFavoriteToggle = useCallback((id: string) => {
        try {
            // Get current favorites from localStorage
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];

            // Toggle favorite status
            if (favorites.includes(id)) {
                const index = favorites.indexOf(id);
                favorites.splice(index, 1);
            } else {
                favorites.push(id);
            }

            // Save back to localStorage
            localStorage.setItem('property-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Erro ao salvar favorito:', error);
        }
    }, []);

    // Format properties for virtualized grid with favorite status
    const formattedProperties = React.useMemo(() => {
        // Try to get favorites from localStorage
        let favorites: string[] = [];
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            favorites = JSON.parse(savedFavorites) as string[];
        } catch (error) {
            console.error('Erro ao ler favoritos:', error);
        }

        return imoveis.map(imovel => ({
            id: imovel._id,
            title: imovel.titulo || '',
            slug: imovel.slug || imovel._id,
            location: imovel.bairro,
            city: imovel.cidade,
            price: imovel.preco || 0,
            propertyType: 'sale' as const, // For sales properties
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas,
            mainImage: {
                url: imovel.imagem?.imagemUrl || '/images/property-placeholder.jpg',
                alt: imovel.imagem?.alt || imovel.titulo || ''
            },
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: typeof imovel.dataPublicacao === 'string' && imovel.dataPublicacao ?
                (new Date().getTime() - new Date(imovel.dataPublicacao).getTime() < 7 * 24 * 60 * 60 * 1000) :
                false,
            isFavorite: favorites.includes(imovel._id)
        }));
    }, [imoveis]);

    return (
        <>
            <NavBar />
            <main className="bg-gradient-to-b from-white to-emerald-50/30 text-neutral-800 pt-24 pb-32">                {/* Hero da seção */}
                <section className="max-w-4xl mx-auto px-6 text-center mb-20">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                        Imóveis para <span className="text-emerald-600">compra</span> em Guararema
                    </h1>
                    <p className="mt-4 text-lg text-neutral-600">
                        Encontre o <strong>lar dos seus sonhos</strong> em localizações privilegiadas,
                        com <span className="font-medium">conforto e qualidade</span> para você e sua família.
                    </p>
                </section>                {/* Listagem de imóveis */}
                <section className="max-w-7xl mx-auto px-6">                    <Suspense fallback={<PropertiesLoadingSkeleton />}>
                    {loadingError ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-red-100">
                            <div className="max-w-md mx-auto">
                                <div className="text-red-500 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Ops! Algo deu errado</h3>
                                <p className="text-gray-600 mb-6">{loadingError}</p>
                                <button
                                    onClick={retryLoading}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        </div>
                    ) : (<VirtualizedPropertiesGridUnified
                        properties={formattedProperties}
                        isLoading={isLoading}
                        className="min-h-[800px]"
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                    )}
                </Suspense>
                </section>                {/* Seção de valor e compromisso familiar */}
                <div ref={valorRef} className="mt-24">
                    {valorInView && (
                        <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl shadow-inner mb-16">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-emerald-800 mb-4">Compromisso com sua família</h2>
                                <p className="text-lg text-emerald-700">Ajudamos você a encontrar o imóvel perfeito para sua nova história</p>
                            </div>
                            <Valor />
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
