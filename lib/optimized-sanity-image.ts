/**
 * Funções otimizadas para tratamento de imagens Sanity
 * Versão 3.0 - Implementação robusta e com performance melhorada
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

export interface NormalizedImage {
    url: string;
    alt: string;
    hotspot?: {
        x: number;
        y: number;
    };
}

export type ImageType = string | SanityImage | null | undefined;

// Cache local para melhorar a performance com proteções de tamanho
const URL_CACHE = new Map<string, string>();
const URL_CACHE_LIMIT = 1000;

// Placeholder padrão para usar em caso de falha
const DEFAULT_PLACEHOLDER = '/images/property-placeholder.jpg';

// Declaração global para registro de problemas
declare global {
    interface Window {
        __imageIssues?: Array<{ timestamp: string, image: any }>;
        __PROPERTY_COUNTER?: number;
    }
}

/**
 * Extrai URL da imagem de forma otimizada e segura
 */
export function getImageUrl(
    image: ImageType,
    fallbackUrl: string = DEFAULT_PLACEHOLDER
): string {
    try {
        // Fast path: imagem nula ou indefinida
        if (!image) {
            return fallbackUrl;
        }

        // Fast path: string direta
        if (typeof image === 'string') {
            return image;
        }

        // Cache lookup para objetos SanityImage
        const cacheKey = generateCacheKey(image);
        if (URL_CACHE.has(cacheKey)) {
            const cachedUrl = URL_CACHE.get(cacheKey);
            return cachedUrl !== undefined ? cachedUrl : fallbackUrl;
        }

        // Log detalhado para diagnóstico avançado
        if (process.env.NODE_ENV === 'development') {
            console.log('[getImageUrl] Analisando objeto de imagem:', {
                hasUrl: !!image.url,
                hasImagemUrl: !!image.imagemUrl,
                hasAsset: !!image.asset,
                assetHasUrl: image.asset?.url ? true : false,
                assetHasRef: image.asset?._ref ? true : false,
                imageProperties: Object.keys(image),
                assetProperties: image.asset ? Object.keys(image.asset) : []
            });
        }

        let url: string = fallbackUrl; // Valor padrão caso nenhuma estratégia funcione

        // Estratégia 1: URLs diretas no objeto
        if (image.url) {
            url = image.url;
        }
        else if (image.imagemUrl) {
            url = image.imagemUrl;
        }
        else if (image.asset?.url) {
            url = image.asset.url;
        }        // Estratégia 2: Construção de URL a partir da referência Sanity
        else if (image.asset?._ref) {
            // Garantir que _ref não é undefined antes de passar para buildSanityUrl
            url = buildSanityUrl(image.asset._ref || '');
        }
        // Estratégia 3: Tentativa de detecção de problemas comuns
        else if (Object.keys(image).length === 1 && image.alt) {
            // Detectamos o caso problemático: objeto apenas com alt
            console.warn('[getImageUrl] Objeto de imagem incompleto detectado, contém apenas alt:', image);

            // Aqui caímos no fallback, mas registramos o problema para investigação
            if (process.env.NODE_ENV === 'development') {
                console.error('[getImageUrl] ALERTA: Imagem com apenas propriedade alt encontrada');
                // No modo de desenvolvimento, podemos registrar esses problemas para posterior análise
                if (typeof window !== 'undefined') {
                    if (!window.__imageIssues) {
                        window.__imageIssues = [];
                    }
                    window.__imageIssues.push({ timestamp: new Date().toISOString(), image });
                }
            }
        }

        // Atualizar cache com proteção de tamanho
        if (URL_CACHE.size >= URL_CACHE_LIMIT) {
            const firstKey = URL_CACHE.keys().next().value;
            if (firstKey !== undefined) {
                URL_CACHE.delete(firstKey);
            }
        }
        URL_CACHE.set(cacheKey, url);

        return url;
    } catch (error) {
        console.error('[getImageUrl] Erro ao processar imagem:', error);
        return fallbackUrl;
    }
}

/**
 * Gera uma chave de cache confiável para objetos de imagem
 */
function generateCacheKey(image: SanityImage): string {
    // Para garantir determinismo, construímos uma chave baseada nos atributos
    const ref = image.asset?._ref || '';
    const url = image.url || image.imagemUrl || image.asset?.url || '';
    return `${ref}:${url}`;
}

/**
 * Constrói URL Sanity a partir da referência
 */
function buildSanityUrl(refString: string): string {
    if (!refString || typeof refString !== 'string') {
        return DEFAULT_PLACEHOLDER;
    }

    try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
        const refParts = refString.split('-');

        if (refParts[0] !== 'image' || !refParts[1]) {
            return DEFAULT_PLACEHOLDER;
        }

        const id = refParts[1];

        // Formato completo: image-abc123-800x600-jpg
        if (refParts.length >= 4) {
            const dimensions = refParts[2];
            let extension = refParts[3];
            if (extension?.includes('?')) {
                extension = extension.split('?')[0];
            }
            return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
        }
        // Formato simplificado: image-abc123-jpg
        else if (refParts.length === 3) {
            let extension = refParts[2];
            if (extension?.includes('?')) {
                extension = extension.split('?')[0];
            }
            return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
        }

        // Fallback para formato jpg simples
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.jpg`;
    } catch (error) {
        console.error('[buildSanityUrl] Erro ao construir URL:', error);
        return DEFAULT_PLACEHOLDER;
    }
}

/**
 * Extrai texto alternativo da imagem
 */
export function getImageAlt(image: ImageType, defaultAlt: string = 'Imagem'): string {
    if (!image || typeof image === 'string') {
        return defaultAlt;
    }

    return image.alt || defaultAlt;
}

/**
 * Processa imagem para formato normalizado
 */
export function processImage(image: ImageType, defaultAlt: string = 'Imagem'): NormalizedImage {
    return {
        url: getImageUrl(image),
        alt: getImageAlt(image, defaultAlt),
        hotspot: typeof image !== 'string' && image ? image.hotspot : undefined
    };
}

/**
 * Verifica se a entrada fornecida é uma imagem Sanity válida
 */
export function isValidSanityImage(image: any): boolean {
    return (
        image &&
        typeof image === 'object' &&
        (
            (image.url || image.imagemUrl) ||
            (image.asset &&
                (image.asset.url ||
                    (image.asset._ref && typeof image.asset._ref === 'string')))
        )
    );
}
