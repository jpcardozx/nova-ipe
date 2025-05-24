// Types for property management
export type ImovelType = {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    location: string;
    city?: string;
    price: number;
    propertyType: 'rent' | 'sale';
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage?: {
        asset?: {
            url: string;
            metadata?: {
                lqip?: string;
            };
        };
        alt?: string;
    };
    status?: 'available' | 'sold' | 'rented' | 'pending';
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
};

export type PropertyType = 'rent' | 'sale';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export type ImovelClientType = {
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
    status?: PropertyStatus;
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
};
