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
 * Extrai URL de imagem usando uma abordagem segura e robusta
 * Lida com todos os formatos possíveis do Sanity
 * 
 * @param image Imagem em qualquer formato válido
 * @param fallbackUrl URL de fallback quando imagem é inválida
 * @returns URL da imagem ou fallback
 */
export function getImageUrl(image: ImageType, fallbackUrl: string = '/images/property-placeholder.jpg'): string {
    try {
        // Log detalhado para ajudar no diagnóstico
        console.log('[getImageUrl] Processando imagem:', {
            tipo: image ? typeof image : 'undefined/null',
            isString: typeof image === 'string',
            hasUrl: typeof image === 'object' && image && 'url' in image,
            hasImagemUrl: typeof image === 'object' && image && 'imagemUrl' in image,
            hasAsset: typeof image === 'object' && image && 'asset' in image,
            assetHasRef: typeof image === 'object' && image?.asset && '_ref' in (image.asset || {})
        });

        // Caso 1: Imagem não definida
        if (!image) {
            console.log('[getImageUrl] Imagem não definida, usando fallback');
            return fallbackUrl;
        }

        // Caso 2: String direta (URL)
        if (typeof image === 'string') {
            console.log('[getImageUrl] Imagem é uma string URL');
            return image;
        }

        // Caso 3: Objeto com URL direta
        if ('url' in image && image.url) {
            console.log('[getImageUrl] Usando URL direta do objeto');
            return image.url;
        }

        // Caso 4: Objeto com imagemUrl (comum em nosso projeto)
        if ('imagemUrl' in image && image.imagemUrl) {
            console.log('[getImageUrl] Usando imagemUrl do objeto');
            return image.imagemUrl;
        }

        // Caso 5: Tem um asset com URL
        if (image.asset?.url) {
            console.log('[getImageUrl] Usando URL do asset');
            return image.asset.url;
        }

        // Caso 6: Tem referência do Sanity para construção de URL
        if (image.asset?._ref) {
            const refString = image.asset._ref;
            console.log('[getImageUrl] Processando referência Sanity:', refString);

            // Validar referência
            if (!refString || typeof refString !== 'string') {
                console.warn('[getImageUrl] Referência inválida');
                return fallbackUrl;
            }

            // Construir URL do Sanity baseada na referência
            const refParts = refString.split('-');
            console.log('[getImageUrl] Partes da referência:', refParts);

            // Validar formato básico (deve começar com 'image')
            if (refParts[0] !== 'image' || refParts.length < 2) {
                console.warn('[getImageUrl] Formato de referência inválido');
                return fallbackUrl;
            }

            // Extrair componentes da referência
            const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
            const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
            const id = refParts[1];

            // Identificar formato da referência
            if (refParts.length >= 4) {
                // Formato padrão: image-abc123-800x600-jpg
                const dimensions = refParts[2];
                const extension = refParts[3].split('?')[0];
                const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                console.log('[getImageUrl] URL gerada (formato padrão):', url);
                return url;
            }
            else if (refParts.length === 3) {
                // Formato simplificado: image-abc123-jpg
                const extension = refParts[2].split('?')[0];
                const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
                console.log('[getImageUrl] URL gerada (formato simples):', url);
                return url;
            }
            // Handle specific formats like "image-1854e7dd5423c8cbe4ae42eb038cd95a0aa0db9a-3456x5184-jpg"
            else if (refParts.length > 4 && refParts[2].includes('x') && refParts[0] === 'image') {
                // This is likely a hash-based format with dimensions
                const dimensions = refParts[2];
                const extension = refParts[3].split('?')[0];
                const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                console.log('[getImageUrl] URL gerada (formato complexo):', url);
                return url;
            }
            else {
                // Fallback para formato simples com extensão jpg
                const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.jpg`;
                console.log('[getImageUrl] URL gerada (fallback):', url);
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
