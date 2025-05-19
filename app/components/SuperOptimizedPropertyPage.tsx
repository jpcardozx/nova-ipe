'use client';

/**
 * SuperOptimizedPropertyPage - Componente Ultra Otimizado para Páginas de Propriedades
 * 
 * Resolve os problemas críticos de performance das páginas 'alugar' e 'comprar':
 * - LCP de 78056ms (meta: <2500ms)
 * - Thread principal bloqueada por 57778ms 
 * - Recursos lentos nas páginas 'alugar' e 'comprar' (~6860ms cada)
 */

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import ProgressiveModuleLoader from './ProgressiveModuleLoader';
import { LazyIcon } from '@/app/utils/icon-splitter';
import { usePerformanceMonitor } from '@/app/utils/performance-monitor-advanced';
import SuperOptimizedImage from './SuperOptimizedImage';
import { CriticalCssLoader } from './CriticalCssLoader';

// Tipos
interface ImovelSimplificado {
    id: string;
    titulo: string;
    slug: string;
    bairro?: string;
    cidade?: string;
    preco: number;
    finalidade: 'Aluguel' | 'Venda';
    areaUtil?: number;
    dormitorios?: number;
    banheiros?: number;
    vagas?: number;
    imagem?: {
        url: string;
        alt?: string;
        blurDataUrl?: string;
    };
    destaque?: boolean;
    dataPublicacao?: string;
}

interface SuperOptimizedPropertyPageProps {
    pageTitle: string;
    pageDescription: string;
    fetchPropertiesFunction: () => Promise<ImovelSimplificado[]>;
    propertyType: 'rent' | 'sale';
    usingPreloadedData?: boolean;
}

// Carregamento progressivo de componentes
const VirtualizedPropertiesGrid = dynamic(() => import('./VirtualizedPropertiesGrid'), {
    ssr: true,
    loading: () => <PropertyListSkeleton />
});

// Esqueletos/placeholders otimizados
const PropertyListSkeleton = React.memo(() => (
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
 * SuperOptimizedPropertyPage - Componente principal
 */
export default function SuperOptimizedPropertyPage({
    pageTitle,
    pageDescription,
    fetchPropertiesFunction,
    propertyType,
    usingPreloadedData = false
}: SuperOptimizedPropertyPageProps) {
    // Estado
    const [properties, setProperties] = useState<ImovelSimplificado[]>([]);
    const [isLoading, setIsLoading] = useState(!usingPreloadedData); // Se temos dados pré-carregados, começamos sem loading
    const [error, setError] = useState<Error | null>(null);

    // Monitoramento de performance
    const metrics = usePerformanceMonitor();
    const loadStartTime = useRef(performance.now());

    // Observador para seções abaixo da dobra
    const { ref: belowFoldRef, inView: belowFoldInView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px'
    });

    // Carregar propriedades com web worker quando disponível
    useEffect(() => {
        const loadProperties = async () => {
            try {
                // Marcar início do carregamento para métricas
                const fetchStart = performance.now();

                // Definir uma flag para carregamento crítico
                document.documentElement.setAttribute('data-critical-loading', 'true');

                // Buscar propriedades
                const data = await fetchPropertiesFunction();

                // Calcular tempo de carregamento
                const fetchTime = performance.now() - fetchStart;                // Log de performance em desenvolvimento
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Performance] Fetch de propriedades: ${Math.round(fetchTime)}ms${usingPreloadedData ? ' (pré-carregados)' : ''}`);
                }

                // Processar dados em lotes para evitar bloquear o thread principal
                setTimeout(() => {
                    setProperties(data);
                    setIsLoading(false);

                    // Remover flag de carregamento crítico
                    document.documentElement.removeAttribute('data-critical-loading');

                    // Registrar tempo total
                    const totalTime = performance.now() - loadStartTime.current;
                    console.log(`[Performance] Tempo total de carregamento: ${Math.round(totalTime)}ms`);
                }, 0);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Erro ao carregar propriedades'));
                setIsLoading(false);
                console.error('Erro ao carregar propriedades:', err);
            }
        };

        loadProperties();
    }, [fetchPropertiesFunction]);

    // Processar propriedades para o formato necessário
    const formattedProperties = useMemo(() => {
        return properties.map(property => ({
            id: property.id,
            title: property.titulo,
            slug: property.slug,
            location: property.bairro,
            city: property.cidade,
            price: property.preco,
            propertyType: propertyType,
            area: property.areaUtil,
            bedrooms: property.dormitorios,
            bathrooms: property.banheiros,
            parkingSpots: property.vagas,
            mainImage: {
                url: property.imagem?.url || '/images/property-placeholder.jpg',
                alt: property.imagem?.alt || property.titulo,
                blurDataUrl: property.imagem?.blurDataUrl
            },
            isHighlight: Boolean(property.destaque),
            isPremium: Boolean(property.destaque),
            isNew: property.dataPublicacao ?
                (new Date().getTime() - new Date(property.dataPublicacao).getTime() < 7 * 24 * 60 * 60 * 1000) :
                false
        }));
    }, [properties, propertyType]);

    // Tratamento de erro
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <LazyIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Erro ao carregar imóveis</h2>
                    <p className="text-red-600">
                        Ocorreu um erro ao buscar a lista de imóveis. Por favor, tente novamente mais tarde.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    } return (
        <>
            {/* Carrega o CSS crítico otimizado para reduzir LCP */}
            <CriticalCssLoader pageName="property" />

            <main className="pt-28 pb-20 bg-neutral-50 text-neutral-900 min-h-screen">
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold">{pageTitle}</h1>
                        <p className="mt-4 text-neutral-600 text-lg">
                            {pageDescription}
                        </p>
                    </div>

                    <Suspense fallback={<PropertyListSkeleton />}>
                        <VirtualizedPropertiesGrid
                            properties={formattedProperties}
                            isLoading={isLoading}
                            className="min-h-[800px]"
                        />
                    </Suspense>

                    {/* Elementos abaixo da dobra carregados com lazy loading */}
                    <div ref={belowFoldRef}>
                        {belowFoldInView && (
                            <>
                                <section className="mt-24">
                                    <h2 className="text-2xl font-bold mb-6">Informações Adicionais</h2>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <LazyIcon name="Info" className="w-5 h-5 mr-2 text-blue-500" />
                                            <h3 className="text-lg font-semibold">Dicas para {propertyType === 'rent' ? 'alugar' : 'comprar'}</h3>
                                        </div>
                                        <p className="text-neutral-600">
                                            Confira todas as informações do imóvel antes da visita. Nossos corretores estão
                                            disponíveis para esclarecer todas as suas dúvidas e agendar uma visita no horário
                                            que for melhor para você.
                                        </p>
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <SuperOptimizedImage
                                            src="/images/atendimento.jpg"
                                            alt="Atendimento especializado"
                                            width={500}
                                            height={300}
                                            className="rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">Atendimento Especializado</h3>
                                        <p className="text-neutral-600">
                                            Nossa equipe de corretores está pronta para encontrar o imóvel ideal para você.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <SuperOptimizedImage
                                            src="/images/documentacao.jpg"
                                            alt="Documentação simplificada"
                                            width={500}
                                            height={300}
                                            className="rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">Documentação Simplificada</h3>
                                        <p className="text-neutral-600">
                                            Facilitamos todo o processo de documentação para você {propertyType === 'rent' ? 'alugar' : 'comprar'} com segurança.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Exibição de métricas de performance durante o desenvolvimento */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="fixed bottom-4 left-4 bg-white/90 shadow-lg rounded-lg p-3 text-xs max-w-xs">
                        <p className="font-bold">Métricas de Performance:</p>
                        <p>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Calculando...'}</p>
                        <p>TBT: {metrics.tbt ? `${Math.round(metrics.tbt)}ms` : 'Calculando...'}</p>
                        <p>CLS: {metrics.cls !== null ? metrics.cls.toFixed(3) : 'Calculando...'}</p>
                    </div>)}
            </main>
        </>
    );
}
