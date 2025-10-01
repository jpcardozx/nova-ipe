/**
 * Sistema completo de manipulação de imagens do Sanity
 * Inclui imagem principal + galeria com carrossel
 */

import { imagePresets } from './sanity-image-helpers';

const SANITY_PROJECT_ID = '0nks58lj';
const SANITY_DATASET = 'production';

export interface SanityImageAsset {
    _id?: string;
    _ref?: string;
    _type?: string;
    url?: string;
    metadata?: {
        dimensions?: {
            width: number;
            height: number;
        };
    };
}

export interface SanityImageData {
    asset?: SanityImageAsset;
    alt?: string;
    hotspot?: any;
    crop?: any;
    imagemUrl?: string;
    titulo?: string;
}

export interface ProcessedImage {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: string;
}

export interface PropertyImageSet {
    principal: ProcessedImage | null;
    galeria: ProcessedImage[];
    total: number;
    hasImages: boolean;
}

/**
 * Constrói URL otimizada do Sanity
 */
function buildSanityUrl(ref: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'clip' | 'min';
} = {}): string {
    if (!ref) return '';
    
    // Limpa a referência
    let cleanRef = ref;
    if (ref.startsWith('image-')) {
        cleanRef = ref.replace('image-', '').replace(/-(\w+)$/, '.$1');
    }
    
    const baseUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${cleanRef}`;
    
    const {
        width,
        height,
        quality = 85,
        format = 'webp',
        fit = 'crop'
    } = options;
    
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 85) params.set('q', quality.toString());
    if (format !== 'auto') params.set('fm', format);
    if (fit !== 'crop') params.set('fit', fit);
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

/**
 * Processa uma única imagem do Sanity
 */
function processImage(imageData: SanityImageData | null | undefined, preset: keyof typeof imagePresets = 'card'): ProcessedImage | null {
    if (!imageData) return null;
    
    const config = imagePresets[preset];
    let url = '';
    
    // Múltiplos fallbacks para URL com verificação robusta
    if (imageData.imagemUrl && imageData.imagemUrl.startsWith('http')) {
        url = imageData.imagemUrl;
    } else if (imageData.asset?.url && imageData.asset.url.startsWith('http')) {
        url = imageData.asset.url;
    } else if (imageData.asset?._ref) {
        url = buildSanityUrl(imageData.asset._ref, config);
    } else if (imageData.asset?._id) {
        url = buildSanityUrl(imageData.asset._id, config);
    }
    
    if (!url || !url.startsWith('http')) return null;
    
    return {
        url,
        alt: imageData.alt || imageData.titulo || 'Imagem do imóvel',
        width: config.width,
        height: config.height,
        aspectRatio: `${config.width}/${config.height}`
    };
}

/**
 * Processa todas as imagens de um imóvel
 */
export function processPropertyImages(property: any): PropertyImageSet {
    const result: PropertyImageSet = {
        principal: null,
        galeria: [],
        total: 0,
        hasImages: false
    };

    // Validação básica da propriedade
    if (!property) {
        console.warn('⚠️ Propriedade nula passada para processPropertyImages');
        return result;
    }

    // Processa imagem principal
    if (property.imagem) {
        const processed = processImage(property.imagem);
        if (processed) {
            result.principal = processed;
            result.total++;
        }
    }

    // Processa galeria
    if (property.galeria && Array.isArray(property.galeria)) {
        result.galeria = property.galeria
            .map((img: any) => processImage(img))
            .filter((img): img is ProcessedImage => img !== null);
        result.total += result.galeria.length;
    }

    result.hasImages = result.total > 0;
    return result;
}

/**
 * Gera múltiplos tamanhos para imagem responsiva
 */
export function generateResponsiveUrls(imageRef: string): {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
} {
    return {
        thumbnail: buildSanityUrl(imageRef, { width: 300, height: 200, quality: 80 }),
        small: buildSanityUrl(imageRef, { width: 600, height: 400, quality: 85 }),
        medium: buildSanityUrl(imageRef, { width: 800, height: 600, quality: 85 }),
        large: buildSanityUrl(imageRef, { width: 1200, height: 800, quality: 90 }),
        xlarge: buildSanityUrl(imageRef, { width: 1600, height: 1200, quality: 95 })
    };
}

/**
 * Gera srcSet para Next.js Image
 */
export function generateSrcSet(imageRef: string): string {
    const sizes = [400, 600, 800, 1200, 1600];
    return sizes
        .map(size => `${buildSanityUrl(imageRef, { width: size, quality: 85 })} ${size}w`)
        .join(', ');
}

/**
 * Valida se a imagem é válida
 */
export function isValidImage(imageData: SanityImageData | null | undefined): boolean {
    if (!imageData) return false;
    
    return !!(
        imageData.imagemUrl ||
        imageData.asset?.url ||
        imageData.asset?._ref ||
        imageData.asset?._id
    );
}

/**
 * Debug de imagens - para desenvolvimento
 */
export function debugImageData(imovel: any): void {
    console.group(`🖼️ Debug Imagens - ${imovel.titulo || imovel._id}`);
    
    console.log('Imagem principal:', {
        exists: !!imovel.imagem,
        imagemUrl: imovel.imagem?.imagemUrl,
        assetUrl: imovel.imagem?.asset?.url,
        assetRef: imovel.imagem?.asset?._ref,
        assetId: imovel.imagem?.asset?._id
    });
    
    console.log('Galeria:', {
        count: imovel.galeria?.length || 0,
        items: imovel.galeria?.map((img: any, index: number) => ({
            index,
            imagemUrl: img.imagemUrl,
            assetUrl: img.asset?.url,
            assetRef: img.asset?._ref
        })) || []
    });
    
    const processed = processPropertyImages(imovel);
    console.log('Processado:', processed);
    
    console.groupEnd();
}