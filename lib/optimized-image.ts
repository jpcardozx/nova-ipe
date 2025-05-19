'use client';

import { useMemo } from 'react';

/**
 * Extrai URL de imagem de vários formatos possíveis
 * Função robusta para lidar com diferentes estruturas de dados
 */
export function extractImageUrl(image: any): string | null {
    if (!image) return null;

    // Caso seja uma string direta
    if (typeof image === 'string') return image;

    // Objeto com url direta
    if (typeof image === 'object') {
        // Checar propriedades comuns
        if (image.url) return image.url;
        if (image.imagemUrl) return image.imagemUrl;
        if (image.src) return image.src;

        // Formato Sanity com asset
        if (image.asset) {
            if (typeof image.asset === 'object' && image.asset.url) {
                return image.asset.url;
            }

            // Formato Sanity com _ref
            if (image.asset._ref) {
                const ref = image.asset._ref;
                const [_, id, dimensions, format] = ref.split('-');

                if (id && dimensions && format) {
                    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yourprojectid';
                    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
                    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
                }
            }
        }

        // Formato aninhado
        if (image.mainImage) return extractImageUrl(image.mainImage);
    }

    return null;
}

/**
 * Hook para extrair atributos seguros de imagem para uso em componentes
 */
export function useSafeImage(image: any, fallbackUrl: string = '/images/property-placeholder.jpg') {
    return useMemo(() => {
        // Extrair URL
        const url = extractImageUrl(image) || fallbackUrl;

        // Extrair texto alternativo
        let alt = '';
        if (typeof image === 'object' && image) {
            alt = image.alt ||
                (image.mainImage && image.mainImage.alt) ||
                'Imagem';
        }

        // Extrair hotspot se disponível
        let hotspot: { x: number, y: number } | undefined;
        if (typeof image === 'object' && image && image.hotspot) {
            hotspot = {
                x: image.hotspot.x || 0.5,
                y: image.hotspot.y || 0.5
            };
        }

        // Determinar se devemos usar blur placeholder
        const hasBlurDataUrl = !!(typeof image === 'object' && image && image.blurDataUrl);
        const blurDataUrl = hasBlurDataUrl ? image.blurDataUrl : undefined;

        return {
            url,
            alt,
            hotspot,
            blurDataUrl,
            // Valores para debugging
            _originalType: typeof image,
            _hadHotspot: !!hotspot
        };
    }, [image, fallbackUrl]);
}

/**
 * Gera uma string de parâmetros de imagem otimizados para CDN
 */
export function getOptimizedImageParams(width: number = 800, quality: number = 80): string {
    return `?w=${width}&q=${quality}&auto=format,compress`;
}

/**
 * Verifica se um URL é externo (não relativo)
 */
export function isExternalUrl(url: string): boolean {
    return /^(https?:)?\/\//i.test(url);
}
