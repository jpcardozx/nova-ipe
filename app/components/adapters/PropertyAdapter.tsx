'use client';

import React from 'react';
import PropertyCard from '../build-safe/PropertyCard';
import FallbackPropertyCard from '../build-safe/FallbackPropertyCard';
import type { PropertyType } from '../build-safe/PropertyCard';
import { ProcessedProperty } from '@/app/page';

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
                    title={property.title}
                    slug={property.slug}
                    location={property.location}
                    price={property.price}
                    mainImage={property.mainImage}
                />
            );
        }

        return (
            <PropertyCard
                id={property.id}
                title={property.title}
                slug={property.slug}
                location={property.location || ''}
                price={property.price}
                propertyType={adaptedPropertyType}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                parkingSpots={property.parkingSpots}
                status={'available'}
                mainImage={property.mainImage}
                isHighlight={property.isHighlight}
                isPremium={property.isPremium}
                className={variant === 'carousel' ? 'h-full' : ''}
            />
        );
    } catch (error) {
        console.error('Error rendering PropertyCard:', error);
        return (
            <FallbackPropertyCard
                title={property.title}
                slug={property.slug}
                location={property.location}
                price={property.price}
                mainImage={property.mainImage}
            />
        );
    }
}
