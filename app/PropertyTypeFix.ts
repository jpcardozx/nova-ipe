// PropertyTypeFix.ts
//
// Este arquivo contém funções auxiliares para corrigir problemas de tipagem com propriedades
// e garantir que os dados estejam no formato correto para os componentes.

import type { PropertyType } from './components/OptimizedPropertyCard';

// Custom implementation of extractImageUrl to replace the missing module
function extractImageUrl(image: SanityImage): string | null {
    // Basic implementation to extract URL from Sanity image reference
    if (image?.asset?._ref) {
        // Format: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"
        const ref = image.asset._ref;
        const [, id, dimensions, format] = ref.split('-');

        if (!id || !dimensions || !format) return null;

        // Use environment variables for project ID and dataset
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

        if (!projectId || !dataset) {
            // console.error("Sanity project ID or dataset is not configured in environment variables.");
            return null;
        }

        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
    }
    return null;
}

// Define o tipo para slug do Sanity
export interface SanitySlug {
    _type?: string;
    current: string;
}

// Definição para tipos relacionados a imagem do Sanity
export interface SanityImageAsset {
    _ref?: string;
    _type?: string;
    url?: string;
}

export interface SanityImage {
    _type?: string;
    asset?: SanityImageAsset;
    hotspot?: {
        x: number;
        y: number;
        height?: number;
        width?: number;
    };
    crop?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }; alt?: string;
    url?: string;
    responsive?: Record<string, string>;
    responsiveUrls?: {
        small?: string;
        medium?: string;
        large?: string;
        original?: string;
    };
    imagemUrl?: string;
    mainImage?: any;
}

// Define possíveis tipos de slug que podem vir do CMS
export type SlugType = string | SanitySlug | null | undefined;

// Define possíveis tipos de imagem que podem vir do CMS
export type ImageType = string | SanityImage | null | undefined;

// Define um tipo específico para o retorno da função transformPropertyData
export interface PropertyDataComplete {
    id: string;
    title: string;
    slug: string;
    location: string;
    city: string;
    price: number;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
    };
    isHighlight: boolean;
    isPremium: boolean;
    isNew: boolean;
}

/**
 * Converte arrays com possíveis valores nulos para arrays garantidamente não-nulos,
 * satisfazendo requisitos de tipagem mais estritos
 */
export function ensureNonNullProperties<T>(
    properties: (T | null | undefined)[]
): T[] {
    return properties.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Extrai o valor do slug de forma segura independente do formato
 * @param slug O slug que pode ser string ou objeto do Sanity
 * @param fallback Valor de fallback se o slug for nulo/indefinido
 * @returns Uma string representando o slug
 */
export function extractSlugString(slug: SlugType, fallback: string = ''): string {
    if (typeof slug === 'string') {
        return slug;
    } else if (slug && typeof slug === 'object' && 'current' in slug) {
        return slug.current;
    }
    return fallback;
}

/**
 * Valida e extrai URLs de imagem do Sanity de forma segura
 * @param image A imagem que pode estar em vários formatos
 * @param fallbackUrl URL de fallback para quando a imagem é inválida
 * @returns URL da imagem como string
 */
export function ensureSanityImage(image: ImageType, fallbackUrl: string = '/images/property-placeholder.jpg'): string {
    if (!image) {
        return fallbackUrl;
    }

    // Se for string direta, retornar
    if (typeof image === 'string') {
        return image;
    }

    // Se objeto tem url direto
    if (image.url) {
        return image.url;
    }

    // Se objeto tem imagemUrl
    if (image.imagemUrl) {
        return image.imagemUrl;
    }

    // Obter pelo objeto de asset
    if (image.asset) {
        // Se asset tem URL
        if (image.asset.url) {
            return image.asset.url;
        }

        // Se tem referência, tentar construir URL Sanity
        if (image.asset._ref) {
            try {
                const url = extractImageUrl(image);
                if (url) return url;
            } catch (e) {
                // console.error('Erro ao extrair URL da imagem Sanity:', e);
            }
        }
    }

    return fallbackUrl;
}
