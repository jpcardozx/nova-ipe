'use client';

import React from 'react';
import PropertyCard from './PropertyCard';
import FallbackPropertyCard from './FallbackPropertyCard';
import type { PropertyData } from '@/app/types/property';
import { ProcessedProperty } from '@/app/types/property';

interface PropertyAdapterProps {
    property: ProcessedProperty;
    variant?: string;
}

/**
 * PropertyAdapter - Adapta ProcessedProperty para formato compatível com PropertyCardUnified
 */
export default function PropertyAdapter({ property, variant = 'default' }: PropertyAdapterProps) {
    // Converte o tipo de propriedade se necessário
    const adaptedPropertyType: PropertyType =
        property.propertyType === 'investment' ? 'sale' :
            (property.propertyType as PropertyType) || 'sale';    // Try to render PropertyCard, but fall back to FallbackPropertyCard if it fails
    try {
        if (!PropertyCard || typeof PropertyCard !== 'function') {
            console.error('PropertyCard is undefined or not a function! Using fallback...');
            return (
                <FallbackPropertyCard
                    title={property.title || property.titulo}
                    slug={typeof property.slug === 'object' ? property.slug.current : property.slug}
                    location={property.location || property.localizacao}
                    price={property.price || property.preco}
                    mainImage={property.mainImage}
                />
            );
        }

        return (
            <PropertyCard
                id={property.id || property._id}
                title={property.title || property.titulo}
                slug={typeof property.slug === 'object' ? property.slug.current : property.slug}
                location={property.location || property.localizacao || ''}
                price={property.price || property.preco || 0}
                propertyType={adaptedPropertyType}
                area={property.area}
                bedrooms={property.bedrooms || property.quartos}
                bathrooms={property.bathrooms || property.banheiros}
                parkingSpots={property.parkingSpots}
                status={'available'}
                mainImage={property.mainImage}
                isHighlight={property.featured || property.destaque}
                isPremium={property.isPremium || property.destaque}
                className={variant === 'carousel' ? 'h-full' : ''}
            />
        );
    } catch (error) {
        console.error('Error rendering PropertyCard:', error);
        return (
            <FallbackPropertyCard
                title={property.title || property.titulo}
                slug={typeof property.slug === 'object' ? property.slug.current : property.slug}
                location={property.location || property.localizacao}
                price={property.price || property.preco}
                mainImage={property.mainImage}
            />
        );
    }
}

