'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import { useInView } from 'react-intersection-observer';
import type { ImovelClient } from '@/types/imovel-client';
import { OptimizedIcons } from '@/app/utils/optimized-icons';

// Declare DOM types for this client component
declare global {
    interface Document {
        documentElement: HTMLElement;
    }

    interface HTMLElement {
        setAttribute(name: string, value: string): void;
    }

    var document: Document;
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

// VirtualizedPropertiesGrid has major performance optimizations
const VirtualizedPropertiesGrid = dynamic(() => import('@/app/components/VirtualizedPropertiesGrid'), {
    ssr: true,
    loading: () => <PropertiesLoadingSkeleton />
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

    // Intersection observer for the valor section to delay loading
    const { ref: valorRef, inView: valorInView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    // Track initial load for performance metrics
    const [initialLoadTime] = useState(() => performance.now());

    useEffect(() => {
        // Set critical CSS optimization flag
        document.documentElement.setAttribute('data-page', 'property-listing');

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

                // Process data
                setImoveis(data);
            } catch (err) {
                console.error('Erro ao buscar imóveis:', err);
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
    }, [initialLoadTime]);    // Format properties for virtualized grid
    const formattedProperties = React.useMemo(() => {
        return imoveis.map(imovel => ({
            id: imovel._id,
            title: imovel.titulo || '',
            slug: imovel.slug || imovel._id,
            location: imovel.bairro,
            city: imovel.cidade,
            price: imovel.preco || 0,
            propertyType: 'rent' as 'rent', // For rental properties
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas,
            mainImage: {
                url: imovel.imagem?.url || '/images/property-placeholder.jpg',
                alt: imovel.imagem?.alt || imovel.titulo || ''
            },
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: typeof imovel.dataPublicacao === 'string' && imovel.dataPublicacao ?
                (new Date().getTime() - new Date(imovel.dataPublicacao).getTime() < 7 * 24 * 60 * 60 * 1000) :
                false
        }));
    }, [imoveis]);

    return (
        <>
            <NavBar />
            <main className="pt-28 pb-20 bg-neutral-50 text-neutral-900 min-h-screen">
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold">Imóveis para Alugar</h1>
                        <p className="mt-4 text-neutral-600 text-lg">
                            Confira os imóveis disponíveis com boa localização, segurança e excelente custo-benefício.
                        </p>
                    </div>

                    <Suspense fallback={<PropertiesLoadingSkeleton />}>
                        <VirtualizedPropertiesGrid
                            properties={formattedProperties}
                            isLoading={isLoading}
                            className="min-h-[800px]"
                        />
                    </Suspense>
                </section>

                {/* Valor section loaded only when scrolled into view */}
                <div ref={valorRef}>
                    {valorInView && <Valor />}
                </div>
            </main>
            <Footer />
        </>
    );
}
