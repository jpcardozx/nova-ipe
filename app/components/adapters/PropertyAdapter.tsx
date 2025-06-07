'use client';

import React from 'react';
import PropertyCardUnified from '../../components/ui/property/PropertyCardUnified';
import { ProcessedProperty } from '../../page';
import { PropertyType } from '../../components/ui/property/PropertyCardUnified';

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
            (property.propertyType as PropertyType) || 'sale';

    // Passa os dados diretamente para o PropertyCardUnified
    return (
        <PropertyCardUnified
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
}
