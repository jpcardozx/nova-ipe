// Tipos compartilhados para componentes de propriedade unificados

export type PropertyType = 'rent' | 'sale';

export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface PropertyImage {
    url: string; // Required URL for the main image
    alt: string; // Required alt text for accessibility
    blurDataUrl?: string;
    imagemUrl?: string; // Suporte para formato legacy
    sanityImage?: any; // Suporte para referência direta do Sanity
}

export interface BasePropertyProps {
    id: string;
    title: string;
    slug: string;
    location: string; // Made required since we're ensuring it's always set
    city?: string;
    state?: string;
    price: number;
    propertyType: PropertyType;
    status?: PropertyStatus;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: PropertyImage; // Required main image
    isHighlight?: boolean;
    isNew?: boolean;
    isPremium?: boolean;
    isFavorite?: boolean;
    referenceCode?: string;
}
