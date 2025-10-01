/**
 * Utilitários para trabalhar com imagens do Sanity CMS
 * Garante URLs corretas e fallbacks robustos
 */

const SANITY_PROJECT_ID = '0nks58lj';
const SANITY_DATASET = 'production';

export interface SanityImageAsset {
    _ref?: string;
    _type?: string;
    url?: string;
    _id?: string;
    metadata?: any;
}

export interface SanityImage {
    asset?: SanityImageAsset;
    alt?: string;
    hotspot?: any;
    imagemUrl?: string;
}

/**
 * Constrói URL do Sanity a partir de uma referência de asset
 */
export function buildSanityImageUrl(ref: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string {
    if (!ref) return '';
    
    const { width, height, quality = 75, format = 'auto' } = options;
    
    // Remove o prefixo 'image-' e substitui a extensão
    const cleanRef = ref
        .replace('image-', '')
        .replace('-jpg', '.jpg')
        .replace('-jpeg', '.jpeg')
        .replace('-png', '.png')
        .replace('-webp', '.webp')
        .replace('-gif', '.gif');
    
    let url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${cleanRef}`;
    
    // Adiciona parâmetros de otimização
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 75) params.set('q', quality.toString());
    if (format !== 'auto') params.set('fm', format);
    
    const queryString = params.toString();
    if (queryString) {
        url += `?${queryString}`;
    }
    
    return url;
}

/**
 * Extrai URL de uma imagem do Sanity com múltiplos fallbacks
 */
export function extractSanityImageUrl(image: SanityImage | null | undefined, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string {
    if (!image) return '';
    
    // Prioridade 1: URL direta já processada
    if (image.imagemUrl) {
        return image.imagemUrl;
    }
    
    // Prioridade 2: URL do asset
    if (image.asset?.url) {
        return image.asset.url;
    }
    
    // Prioridade 3: Construir URL a partir da referência
    if (image.asset?._ref) {
        return buildSanityImageUrl(image.asset._ref, options);
    }
    
    return '';
}

/**
 * Gera srcset para imagens responsivas
 */
export function generateSanityImageSrcSet(image: SanityImage | null | undefined, sizes: number[] = [400, 800, 1200, 1600]): string {
    const baseUrl = extractSanityImageUrl(image);
    if (!baseUrl) return '';
    
    return sizes
        .map(size => {
            const url = image?.asset?._ref 
                ? buildSanityImageUrl(image.asset._ref, { width: size, quality: 80 })
                : `${baseUrl}?w=${size}&q=80`;
            return `${url} ${size}w`;
        })
        .join(', ');
}

/**
 * Valida se uma imagem do Sanity tem dados válidos
 */
export function isValidSanityImage(image: SanityImage | null | undefined): boolean {
    if (!image) return false;
    
    return !!(
        image.imagemUrl || 
        image.asset?.url || 
        image.asset?._ref
    );
}

/**
 * Extrai texto alternativo da imagem
 */
export function extractImageAlt(image: SanityImage | null | undefined, fallback = 'Imagem'): string {
    return image?.alt || fallback;
}

/**
 * Configurações padrão para diferentes tipos de imagem
 */
export const imagePresets = {
    thumbnail: { width: 400, height: 300, quality: 80 },
    card: { width: 600, height: 400, quality: 85 },
    hero: { width: 1200, height: 800, quality: 90 },
    gallery: { width: 800, height: 600, quality: 85 },
    fullscreen: { width: 1600, height: 1200, quality: 95 }
};

/**
 * Hook personalizado para imagens do Sanity (para uso futuro)
 */
export function useSanityImage(image: SanityImage | null | undefined, preset: keyof typeof imagePresets = 'card') {
    const url = extractSanityImageUrl(image, imagePresets[preset]);
    const alt = extractImageAlt(image);
    const isValid = isValidSanityImage(image);
    const srcSet = generateSanityImageSrcSet(image);
    
    return {
        url,
        alt,
        isValid,
        srcSet,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    };
}