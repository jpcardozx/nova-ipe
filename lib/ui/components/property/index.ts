// Exportação de componentes relacionados a imóveis
export * from '@/components/ui/property/PropertyCard';
export * from './PropertyCarousel';
export * from './PropertyFeatures';
export * from './PropertyHero';
export * from './PropertyMap';

// Exportação de tipos
export type {
    PropertyType,
    PropertyStatus,
    PropertyCardProps
} from '@/components/ui/property/PropertyCard';

export type {
    AmenityType
} from './PropertyFeatures';

export type {
    NearbyPlace
} from './PropertyMap'; 