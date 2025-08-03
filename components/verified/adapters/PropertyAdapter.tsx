import React from 'react';
import PropertyCard from '../PropertyCard';
import FallbackPropertyCard from '../FallbackPropertyCard';
import type { PropertyData, ProcessedProperty, PropertyType } from '@/app/types/property';

interface PropertyAdapterProps {
    property: PropertyData | ProcessedProperty;
    variant?: 'default' | 'fallback' | 'grid' | 'compact' | 'featured' | 'carousel' | 'horizontal';
    viewMode?: 'grid' | 'list';
    className?: string;
    onFavoriteToggle?: (id: string) => void;
    isFavorited?: boolean;
}

function PropertyAdapter({
    property,
    variant = 'default',
    viewMode = 'grid',
    className,
    onFavoriteToggle,
    isFavorited = false
}: PropertyAdapterProps) {
    // Helper function to get slug string
    const getSlugString = (property: PropertyData | ProcessedProperty): string => {
        if ('slug' in property) {
            if (typeof property.slug === 'string') {
                return property.slug;
            } else if (property.slug && typeof property.slug === 'object' && 'current' in property.slug) {
                return property.slug.current;
            }
        }
        return property._id || (property as any).id || '';
    };

    // Use fallback if property data is incomplete
    const shouldUseFallback = variant === 'fallback' || !((property as any).titulo || (property as any).title);

    if (shouldUseFallback) {
        return (
            <FallbackPropertyCard
                title={(property as any).titulo || (property as any).title}
                price={(property as any).preco || (property as any).price}
                location={(property as any).localizacao || ''}
                slug={getSlugString(property)}
                mainImage={{
                    url: (property as any).imagem?.imagemUrl || (property as any).mainImage?.url,
                    alt: (property as any).titulo || (property as any).title
                }}
                className={className}
            />
        );
    }

    try {
        // Adapt the property to PropertyData format
        const adaptedProperty: PropertyData = {
            _id: property._id || (property as any).id || '',
            title: (property as any).title || (property as any).titulo || '',
            slug: getSlugString(property),
            price: (property as any).price || (property as any).preco || 0,
            area: (property as any).area,
            bedrooms: (property as any).bedrooms || (property as any).quartos,
            bathrooms: (property as any).bathrooms || (property as any).banheiros,
            parkingSpots: (property as any).parkingSpots || (property as any).vagas,
            featured: (property as any).featured || (property as any).destaque || false,
            description: (property as any).description || (property as any).descricao || '',
            bairro: (property as any).bairro || (property as any).localizacao || '',
            cidade: (property as any).cidade || ''
        };

        return (
            <PropertyCard
                property={adaptedProperty}
                viewMode={viewMode}
                variant={variant as any}
                className={className}
                onFavoriteToggle={onFavoriteToggle}
                isFavorited={isFavorited}
            />
        );
    } catch (error) {
        console.error('Error in PropertyAdapter:', error);
        return (
            <FallbackPropertyCard
                title={(property as any).titulo || (property as any).title || 'Propriedade'}
                price={(property as any).preco || (property as any).price}
                location={(property as any).localizacao || ''}
                slug={getSlugString(property)}
                error={error instanceof Error ? error : new Error('Unknown error')}
                className={className}
            />
        );
    }
}

export default PropertyAdapter;
export type { PropertyAdapterProps };
