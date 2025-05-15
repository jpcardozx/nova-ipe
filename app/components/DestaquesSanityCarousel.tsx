'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SectionHeader from './ui/SectionHeader';
import { cn } from '@/lib/utils';
import { processProperties, ProcessedPropertyData } from './PropertyProcessor';
import type { PropertyType } from './OptimizedPropertyCard';

// Lazy load pesados com priority para renderização inicial
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), { ssr: true });

// Componente principal otimizado com carregamento dinâmico
const OptimizedPropertyCarousel = dynamic(() => import('@/app/components/OptimizedPropertyCarousel').then(mod => ({ default: mod.OptimizedPropertyCarousel })),
    {
        ssr: false,
        loading: () => <PropertiesLoadingSkeleton />,
        // Aumentando a prioridade para iniciar o carregamento mais cedo
        // Isso ajuda a reduzir o CLS (Cumulative Layout Shift)
        // Nota: suspense foi removido pois não é uma propriedade válida para DynamicOptions
    }
);

// Componente de esqueleto de carregamento otimizado
const PropertiesLoadingSkeleton = memo(() => (
    <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-96 bg-gray-100 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-[360px] bg-gray-100 rounded-xl overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="flex space-x-2">
                            <div className="h-4 w-14 bg-gray-100 rounded"></div>
                            <div className="h-4 w-14 bg-gray-100 rounded"></div>
                            <div className="h-4 w-14 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

PropertiesLoadingSkeleton.displayName = 'PropertiesLoadingSkeleton';

// Estado vazio com feedback visual
const EmptyState = memo(({ message = 'Nenhum imóvel disponível no momento' }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel disponível</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
    </div>
));

EmptyState.displayName = 'EmptyState';

// Mapeador para transformar os dados do Sanity para o formato esperado pelos componentes de UI
/**
 * Mapeia um imóvel do Sanity para o formato esperado pelos componentes UI
 * com tratamento de erro robusto e validação de cada campo
 */
function mapSanityToUIFormat(imovel: any) {
    try {
        // Usar a função centralizada de processamento de imóveis
        // que já inclui todo o tratamento de imagens, tipos e erros
        const processedProperty = processProperties([imovel])[0];

        // Se processou com sucesso, retornar
        if (processedProperty) {
            return processedProperty;
        }

        throw new Error('Falha ao processar propriedade');
    } catch (error) {
        console.error('Erro ao mapear imóvel:', error);

        // Log detalhado do objeto com problema (apenas para diagnóstico)
        if (imovel) {
            try {
                console.log('Objeto problemático:',
                    JSON.stringify({
                        id: imovel._id,
                        hasImage: !!imovel.imagem,
                        slug: imovel.slug
                    }, null, 2)
                );
            } catch (e) {
                console.log('Não foi possível serializar o objeto problemático');
            }
        }

        // Retornar um objeto válido mesmo em caso de erro para evitar crash da UI
        return {
            id: `error-${Date.now()}`,
            title: 'Imóvel disponível',
            slug: 'imovel',
            location: 'Guararema',
            city: 'Guararema',
            price: 0,
            propertyType: 'sale' as PropertyType,
            mainImage: {
                url: '/images/property-placeholder.jpg',
                alt: 'Imóvel',
            },
            isHighlight: false,
            isPremium: false,
            isNew: false,
        };
    }
}

interface DestaquesSanityCarouselProps {
    properties: any[];
    tipo: 'destaque' | 'aluguel';
    titulo: string;
    subtitulo: string;
    verTodosLink: string;
    verTodosLabel?: string;
}

// Componente principal otimizado com memo para evitar rerenderizações
const DestaquesSanityCarousel = memo(function DestaquesSanityCarousel({
    properties,
    tipo,
    titulo,
    subtitulo,
    verTodosLink,
    verTodosLabel = 'Ver todos'
}: DestaquesSanityCarouselProps) {
    // Ensure formattedProperties is defined
    const formattedProperties = properties.map(mapSanityToUIFormat);

    // Ensure config is properly defined
    const config = {
        destaque: {
            badgeColor: "amber" as const,
            badge: "Portfólio Exclusivo",
            hasAccentBackground: false,
        },
        aluguel: {
            badgeColor: "blue" as const,
            badge: "Conforto e Praticidade",
            hasAccentBackground: true,
        }
    }[tipo];

    // Ensure validatedProperties is properly filtered
    const validatedProperties = formattedProperties.filter(prop => {
        const isValid = prop &&
            typeof prop.id === 'string' &&
            typeof prop.title === 'string' &&
            typeof prop.price === 'number' &&
            prop.mainImage &&
            typeof prop.mainImage.url === 'string';

        if (!isValid) {
            console.error('Invalid property found:', prop);
        }

        return isValid;
    });

    if (validatedProperties.length === 0) {
        return <EmptyState message={`Nenhum imóvel de ${tipo === 'destaque' ? 'destaque' : 'aluguel'} disponível no momento.`} />;
    }

    return (
        <section className="py-16 w-full">
            <div className="container mx-auto px-4 max-w-7xl">
                <SectionHeader
                    badge={config.badge}
                    badgeColor={config.badgeColor}
                    title={titulo}
                    description={subtitulo}
                />
                <div className="min-h-card carousel-container">
                    <OptimizedPropertyCarousel
                        properties={validatedProperties}
                        slidesToShow={3}
                        showControls={true}
                        autoplay={false}
                        autoplayInterval={tipo === 'destaque' ? 5000 : 6000}
                        viewAllLink={verTodosLink}
                        viewAllLabel={verTodosLabel}
                        className="mb-16"
                        hasAccentBackground={config.hasAccentBackground}
                        showEmptyState={true}
                        emptyStateMessage={`Carregando imóveis ${tipo === 'destaque' ? 'em destaque' : 'para aluguel'}...`}
                        mobileLayout="stack"
                    />
                </div>
            </div>
        </section>
    );
});

export default DestaquesSanityCarousel;
