'use client';

import React from 'react';
import PropertyCard from './PropertyCard';
import FallbackPropertyCard from './FallbackPropertyCard';
import type { PropertyData, ProcessedProperty, PropertyType } from '@/app/types/property';

export interface PropertyAdapterProps {
    property: PropertyData | ProcessedProperty;
    viewMode: 'grid' | 'list';
    variant?: 'default' | 'featured' | 'compact' | 'showcase' | 'hero' | 'highlight' | 'premium';
    className?: string;
    onFavoriteToggle?: (id: string) => void;
    isFavorited?: boolean;
}

const PropertyAdapter: React.FC<PropertyAdapterProps> = ({
    property,
    viewMode,
    variant = 'default',
    className = '',
    onFavoriteToggle,
    isFavorited = false
}) => {
    // Converte o tipo de propriedade se necessário
    const adaptedPropertyType: PropertyType =
        (property as any).propertyType === 'investment' ? 'sale' :
            ((property as any).propertyType as PropertyType) || 'sale';

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
            bairro: (property as any).location || (property as any).localizacao || '',
            cidade: (property as any).cidade || ''
        };

        return (
            <PropertyCard
                property={adaptedProperty}
                viewMode={viewMode}
                variant={variant}
                className={className}
                onFavoriteToggle={onFavoriteToggle}
                isFavorited={isFavorited}
            />
        );
    } catch (error) {
        console.error('Error in PropertyAdapter:', error);
        return (
            <FallbackPropertyCard
                property={property}
                error={error instanceof Error ? error : new Error('Unknown error')}
                className={className}
            />
        );
    }
};

export default PropertyAdapter;

