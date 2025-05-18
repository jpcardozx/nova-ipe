/**
 * Utilitários reforçados para processamento de imagens do Sanity
 */

/**
 * Define tipos para objetos de imagem do Sanity
 */
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
    };
    alt?: string;
    url?: string;
    imagemUrl?: string;
}

export type ImageType = string | SanityImage | null | undefined;

/**
 * Cache local para evitar reprocessamento repetido de URLs de imagem
 * Melhora significativamente o desempenho em componentes que renderizam
 * múltiplas vezes com as mesmas imagens
 */
const imageUrlCache = new Map<string, string>();
const CACHE_SIZE_LIMIT = 100;

/**
 * Gera uma chave de cache única para uma imagem
 */
function generateCacheKey(image: ImageType): string {
    if (!image) return 'undefined';
    if (typeof image === 'string') return `str:${image.substring(0, 50)}`;

    const ref = image.asset?._ref;
    const url = image.url || image.imagemUrl || image.asset?.url;

    if (ref) return `ref:${ref}`;
    if (url) return `url:${String(url)}`;

    // Fallback para caso extremo
    return `obj:${JSON.stringify(image).substring(0, 50)}`;
}

/**
 * Extrai URL de imagem usando uma abordagem segura e robusta
 * Lida com todos os formatos possíveis do Sanity
 * 
 * @param image Imagem em qualquer formato válido
 * @param fallbackUrl URL de fallback quando imagem é inválida
 * @returns URL da imagem ou fallback
 */
export function getImageUrl(image: ImageType, fallbackUrl: string = '/images/property-placeholder.jpg'): string {
    try {
        // Verificar cache primeiro para melhorar performance
        const cacheKey = generateCacheKey(image);
        if (imageUrlCache.has(cacheKey)) {
            return imageUrlCache.get(cacheKey)!;
        }

        // Caso 1: Imagem não definida
        if (!image) {
            return fallbackUrl;
        }

        // Caso 2: String direta (URL)
        if (typeof image === 'string') {
            cacheAndReturn(cacheKey, image);
            return image;
        }

        // Caso 3: Objeto com URL direta
        if ('url' in image && image.url) {
            cacheAndReturn(cacheKey, image.url);
            return image.url;
        }

        // Caso 4: Objeto com imagemUrl (comum em nosso projeto)
        if ('imagemUrl' in image && image.imagemUrl) {
            cacheAndReturn(cacheKey, image.imagemUrl);
            return image.imagemUrl;
        }

        // Caso 5: Tem um asset com URL
        if (image.asset?.url) {
            cacheAndReturn(cacheKey, image.asset.url);
            return image.asset.url;
        }

        // Caso 6: Tem referência do Sanity para construção de URL
        if (image.asset?._ref) {
            const refString = image.asset._ref;

            // Validar referência
            if (!refString || typeof refString !== 'string') {
                return fallbackUrl;
            }

            // Construir URL do Sanity baseada na referência
            const refParts = refString.split('-');

            // Validar formato básico (deve começar com 'image')
            if (refParts[0] !== 'image' || refParts.length < 2) {
                return fallbackUrl;
            }

            // Extrair componentes da referência
            const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
            const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

            try {
                // Padrão de referência: image-{id}-{dimensions}-{format}
                let id, dimensions, extension;

                // Identificar formato com base no padrão da referência
                if (refParts.length > 4) {
                    // Identificar a parte que contém dimensões (formato: NxM)
                    const dimIndex = refParts.findIndex(part => /^\d+x\d+$/.test(part));
                    if (dimIndex > 1) {
                        id = refParts.slice(1, dimIndex).join('-');
                        dimensions = refParts[dimIndex];
                        extension = refParts[dimIndex + 1].split('?')[0];
                    } else {
                        id = refParts[1];
                        dimensions = '';
                        extension = 'jpg';
                    }
                }
                else if (refParts.length >= 4 && refParts[2].includes('x')) {
                    id = refParts[1];
                    dimensions = refParts[2];
                    extension = refParts[3].split('?')[0];
                }
                else if (refParts.length === 3) {
                    id = refParts[1];
                    dimensions = '';
                    extension = refParts[2].split('?')[0];
                }
                else {
                    id = refParts[1];
                    dimensions = '';
                    extension = 'jpg';
                }

                // Construir URL final
                const url = dimensions
                    ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`
                    : `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;

                cacheAndReturn(cacheKey, url);
                return url;
            } catch (err) {
                // Fallback para formato simples com extensão jpg
                const id = refParts[1];
                const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.jpg`;
                cacheAndReturn(cacheKey, url);
                return url;
            }
        }

        // Nenhum formato reconhecido
        return fallbackUrl;
    } catch (error) {
        console.error('[getImageUrl] Erro ao processar imagem:', error);
        return fallbackUrl;
    }
}

/**
 * Armazena URL no cache e controla o tamanho do cache
 */
function cacheAndReturn(key: string, url: string): string {
    // Limitar o tamanho do cache
    if (imageUrlCache.size >= CACHE_SIZE_LIMIT) {
        const firstKey = imageUrlCache.keys().next().value;
        if (firstKey !== undefined) {
            imageUrlCache.delete(firstKey);
        }
    }

    imageUrlCache.set(key, url);
    return url;
}

/**
 * Extrai texto alternativo de uma imagem do Sanity
 * 
 * @param image Imagem em qualquer formato
 * @param defaultAlt Texto alternativo padrão
 * @returns Texto alternativo da imagem
 */
export function getImageAlt(image: ImageType, defaultAlt: string = 'Imagem'): string {
    try {
        if (!image) return defaultAlt;

        if (typeof image === 'object' && 'alt' in image && image.alt) {
            return image.alt;
        }

        return defaultAlt;
    } catch (error) {
        return defaultAlt;
    }
}

/**
 * Processa um objeto de imagem Sanity em um formato padronizado
 * 
 * @param image Imagem em qualquer formato
 * @param defaultAlt Texto alternativo padrão
 * @returns Objeto de imagem normalizado
 */
export function processImage(image: ImageType, defaultAlt: string = 'Imagem') {
    return {
        url: getImageUrl(image),
        alt: getImageAlt(image, defaultAlt)
    };
}
