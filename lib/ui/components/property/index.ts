// Exportação de componentes relacionados a imóveis
export * from '@/app/components/ui/property/PropertyCardUnified';
export * from './PropertyCarousel';
export * from './PropertyFeatures';
export * from './PropertyHero';
export * from './PropertyMap';

// Exportação de tipos unificados
export type {
    PropertyType,
    PropertyStatus,
    PropertyImage,
    BasePropertyProps
} from '@/app/components/ui/property/types';

export type {
    PropertyCardUnifiedProps as PropertyCardProps
} from '@/app/components/ui/property/PropertyCardUnified';

export type {
    AmenityType
} from './PropertyFeatures';

export type {
    NearbyPlace
} from './PropertyMap';