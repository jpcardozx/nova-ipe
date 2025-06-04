/**
 * @deprecated Use PropertyCarousel from @/components/ui/property/PropertyCarousel instead
 * Este componente será removido na próxima versão major
 * Data de remoção planejada: Julho 2025
 */
'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
const OptimizedPropertyCard = PropertyCardUnified;
import { adaptPropertyCarouselProps } from './PropertyCarouselAdapter';

// Lazy load heavy components
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), { ssr: true });
const Search = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: true });
const OptimizedCarousel = dynamic(() => import('@/app/components/ui/OptimizedCarousel').then(mod => ({ default: mod.OptimizedCarousel })), {
    ssr: true,
    loading: () => <div className="animate-pulse w-full h-[320px] bg-neutral-100 rounded-md"></div>
});

// Reutilizando o tipo do PropertyCard consolidado
import type { PropertyType } from '@/app/components/ui/property/PropertyCardUnified';

export interface OptimizedPropertyCarouselProps {
    properties: Array<{
        id: string;
        title: string;
        slug: string;
        location: string;
        city?: string;
        price: number;
        propertyType: PropertyType;
        area?: number;
        bedrooms?: number;
        bathrooms?: number;
        parkingSpots?: number;
        mainImage: {
            url: string;
            alt: string;
            blurDataUrl?: string;
        };
        status?: 'available' | 'sold' | 'rented' | 'pending';
        isNew?: boolean;
        isHighlight?: boolean;
        isPremium?: boolean;
    }>;
    title?: string;
    subtitle?: string;
    variant?: 'default' | 'compact' | 'featured' | 'grid';
    slidesToShow?: number;
    showControls?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    className?: string;
    showEmptyState?: boolean;
    emptyStateMessage?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
    mobileLayout?: 'scroll' | 'stack';
    hasAccentBackground?: boolean;
}

// Componente de mensagem vazia memoizado
const EmptyState = memo(({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-500 text-lg">{message}</p>
    </div>
));

EmptyState.displayName = 'EmptyState';

// Componente de cabeçalho memoizado
const CarouselHeader = memo(({
    title,
    subtitle,
    viewAllLink,
    viewAllLabel = 'Ver todos'
}: {
    title?: string,
    subtitle?: string,
    viewAllLink?: string,
    viewAllLabel?: string
}) => {
    if (!title && !subtitle) return null;

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div>
                    {title && (
                        <h2 className="text-3xl font-bold text-neutral-900 mb-1">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-neutral-600">{subtitle}</p>
                    )}
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="hidden md:flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors mt-4 sm:mt-0"
                    >
                        {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                    </Link>
                )}
            </div>
        </div>
    );
});

CarouselHeader.displayName = 'CarouselHeader';

// Componente principal - otimizado com memo para evitar re-renders desnecessários
export const OptimizedPropertyCarousel = memo(function OptimizedPropertyCarousel({
    properties,
    title,
    subtitle,
    variant = 'default',
    slidesToShow = 3,
    showControls = true,
    autoplay = false,
    autoplayInterval = 5000,
    className,
    showEmptyState = true,
    emptyStateMessage = 'Nenhum imóvel disponível no momento.',
    viewAllLink,
    viewAllLabel = 'Ver todos',
    mobileLayout = 'scroll',
    hasAccentBackground = false,
}: OptimizedPropertyCarouselProps) {
    // Gerenciar favoritos localmente com localStorage persistente
    const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const saved = window.localStorage.getItem('property-favorites');
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error('Erro ao carregar favoritos:', e);
                return {};
            }
        }
        return {};
    });

    // Otimização: função para lidar com favoritos é memoizada e persiste no localStorage
    const handleFavoriteToggle = useCallback((id: string) => {
        setFavorites(prev => {
            const updated = { ...prev, [id]: !prev[id] };
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('property-favorites', JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    // Não mostrar nada se não houver propriedades
    if (properties.length === 0) {
        if (showEmptyState) {
            return <EmptyState message={emptyStateMessage} />;
        }
        return null;
    }    // Responsividade: configurar breakpoints para diferentes tamanhos de tela
    const breakpoints = {
        '(max-width: 640px)': { slidesToShow: 1, spacing: 12 },
        '(min-width: 641px) and (max-width: 1024px)': { slidesToShow: Math.min(2, slidesToShow), spacing: 16 },
        '(min-width: 1025px)': { slidesToShow, spacing: 24 },
    };

    // Se a opção grid estiver selecionada, renderizamos um grid em vez de carrossel
    if (variant === 'grid') {
        return (
            <div className={cn('w-full', className)}>
                <CarouselHeader
                    title={title}
                    subtitle={subtitle}
                    viewAllLink={viewAllLink}
                    viewAllLabel={viewAllLabel}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <OptimizedPropertyCard
                            key={property.id}
                            {...property}
                            onFavoriteToggle={handleFavoriteToggle}
                            isFavorite={!!favorites[property.id]} className={cn(
                                "h-full",
                                property.isPremium && "ring-2 ring-primary-500"
                            )}
                        />
                    ))}
                </div>

                {/* Link para ver todos - apenas em mobile */}
                {viewAllLink && (
                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full 
                bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 
                font-medium transition-colors shadow-sm"
                        >
                            {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // Para layouts mobile do tipo stack, adapter a aparência em telas pequenas
    // Check for mobile stack layout using ternary pattern instead of &&
    if (mobileLayout === 'stack' && typeof window !== 'undefined' && window.innerWidth < 640) {
        return (
            <div className={cn('w-full', className)}>
                <CarouselHeader
                    title={title}
                    subtitle={subtitle}
                    viewAllLink={viewAllLink}
                    viewAllLabel={viewAllLabel}
                />

                <div className="flex flex-col gap-4">
                    {properties.slice(0, 3).map((property) => (
                        <OptimizedPropertyCard
                            key={property.id}
                            {...property}
                            onFavoriteToggle={handleFavoriteToggle}
                            isFavorite={!!favorites[property.id]} className={cn(
                                property.isPremium && "ring-2 ring-primary-500"
                            )}
                        />
                    ))}
                </div>

                {/* Link para ver todos */}
                {viewAllLink && (
                    <div className="mt-6 text-center">
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full 
                bg-primary-500 hover:bg-primary-600 text-white
                font-medium transition-colors shadow-sm"
                        >
                            {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                )}
            </div>
        );
    }    // Configurar opções do carrossel base - adaptado para a interface do OptimizedCarousel
    const carouselOptions = {
        slidesToShow: slidesToShow,
        spacing: 24,
        loop: properties.length > slidesToShow,
        autoplay: autoplay,
        autoplayDelay: autoplayInterval,
        breakpoints: {
            '(max-width: 640px)': { slidesToShow: 1, spacing: 12 },
            '(min-width: 641px) and (max-width: 1024px)': { slidesToShow: Math.min(2, slidesToShow), spacing: 16 },
            '(min-width: 1025px)': { slidesToShow, spacing: 24 },
        },
    };

    // Cores específicas para diferentes variantes
    const accentColor = hasAccentBackground
        ? {
            primary: 'bg-white text-primary-600',
            secondary: 'bg-white/90 text-neutral-800',
            highlight: 'bg-white/10',
            ring: 'focus:ring-white/40',
            accent: 'text-white',
        }
        : {
            primary: 'bg-primary-500 text-white',
            secondary: 'bg-neutral-100 text-neutral-800',
            highlight: 'bg-primary-500/10',
            ring: 'focus:ring-primary-500/40',
            accent: 'text-primary-500',
        };    // Renderizar carrossel padrão
    return (
        <div className={cn('w-full', className)}>
            <CarouselHeader
                title={title}
                subtitle={subtitle}
                viewAllLink={viewAllLink}
                viewAllLabel={viewAllLabel}
            />            <OptimizedCarousel
                items={properties || []}
                getKey={(item: any) => item.id}
                renderItem={(property: any, index: number) => (
                    <OptimizedPropertyCard
                        key={property.id}
                        id={property.id}
                        title={property.title} slug={property.slug}
                        location={property.location}
                        city={property.city}
                        price={property.price}
                        propertyType={property.propertyType}
                        area={property.area}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parkingSpots={property.parkingSpots}
                        mainImage={property.mainImage}
                        isNew={property.isNew}
                        isHighlight={property.isHighlight}
                        isPremium={property.isPremium}
                        isFavorite={favorites[property.id] || false}
                        onFavoriteToggle={(id: string) => handleFavoriteToggle(id)}
                    />
                )}
                options={{
                    align: 'start',
                    loop: properties.length > (slidesToShow || 3),
                    slidesToShow: slidesToShow || 3,
                    spacing: 16,
                    autoplay: autoplay || false,
                    autoplayDelay: autoplayInterval || 5000,
                    breakpoints: {
                        '(max-width: 768px)': { slidesToShow: 1, spacing: 8 },
                        '(min-width: 769px) and (max-width: 1024px)': { slidesToShow: 2, spacing: 12 },
                    }
                }}
                className={className}
                accentColor={accentColor}
            />

            {/* Link para ver todos - apenas em mobile */}            {viewAllLink && (
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href={viewAllLink}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full 
              bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 
              font-medium transition-colors shadow-sm"
                    >
                        {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            )}
        </div>
    );
});

// Exportação padrão para manter compatibilidade com importações existentes
export default OptimizedPropertyCarousel;
