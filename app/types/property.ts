export interface Property {
    id: string;
    title: string;
    slug: string;
    description?: string;
    location: {
        neighborhood?: string;
        city?: string;
    } | string;
    price: number;
    priceFormatted?: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage?: {
        url: string;
        alt?: string;
    };
    photos?: {
        url: string;
        alt?: string;
    }[];
    isPremium?: boolean;
    isNew?: boolean;
    featured?: boolean;
    propertyType: 'sale' | 'rent' | 'featured';
    transactionType?: 'sale' | 'rent' | 'featured';
}

export interface PropertySectionProps {
    title: string;
    description?: string;
    properties: Property[];
    badge?: string;
    viewAllLink?: string;
    viewAllText?: string;
    backgroundColor?: string;
}
