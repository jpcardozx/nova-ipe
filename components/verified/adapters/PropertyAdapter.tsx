import React from 'react';
import PropertyCard from '../PropertyCard';
import FallbackPropertyCard from '../FallbackPropertyCard';
import type { PropertyData } from '@/app/types/property';

interface PropertyAdapterProps {
    property: PropertyData;
    variant?: 'default' | 'fallback';
    viewMode?: 'grid' | 'list';
    className?: string;
}

function PropertyAdapter({
    property,
    variant = 'default',
    viewMode = 'grid',
    className
}: PropertyAdapterProps) {
    // Use fallback if property data is incomplete
    const shouldUseFallback = variant === 'fallback' || !property?.titulo;

    if (shouldUseFallback) {
        return (
            <FallbackPropertyCard
                title={property.titulo || property.title}
                price={property.preco || property.price}
                location={`${property.bairro || ''}, ${property.cidade || ''}`.trim()}
                slug={property.slug || property._id}
                mainImage={{
                    url: property.imagem?.imagemUrl,
                    alt: property.titulo || property.title
                }}
            />
        );
    }

    return (
        <PropertyCard
            property={property}
            viewMode={viewMode}
            className={className}
        />
    );
}

export default PropertyAdapter;
export type { PropertyAdapterProps };
