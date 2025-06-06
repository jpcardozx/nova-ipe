/**
 * Utilitários para construção de URLs otimizadas para imagens Sanity
 * Criando versões responsivas específicas para diferentes breakpoints
 */

import { getImageUrl, ImageType } from './sanity-image-helper';

// Define breakpoints comuns para responsividade
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const breakpointSizes: Record<Breakpoint, number> = {
    'xs': 320,
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536
};

export interface ImageFormat {
    width: number;
    height?: number;
    quality?: number;
}

/**
 * Gera imagens otimizadas para diferentes breakpoints
 * 
 * @param image Imagem do Sanity
 * @param formats Configuração para cada breakpoint
 * @returns Um conjunto de URLs para cada breakpoint
 */
export function generateResponsiveImageSet(
    image: ImageType,
    formats: Partial<Record<Breakpoint, ImageFormat>>
): Record<Breakpoint, string> {
    if (!image) return {} as Record<Breakpoint, string>;

    const baseUrl = getImageUrl(image);

    // Se a URL base não contém sanity.io, não podemos adicionar parâmetros
    if (!baseUrl.includes('sanity.io')) {
        return Object.keys(formats).reduce((acc, breakpoint) => {
            acc[breakpoint as Breakpoint] = baseUrl;
            return acc;
        }, {} as Record<Breakpoint, string>);
    }

    // Para URLs do Sanity, podemos adicionar parâmetros de transformação
    return Object.entries(formats).reduce((acc, [breakpoint, format]) => {
        // Adicionar parâmetros à URL do Sanity
        let optimizedUrl = baseUrl;

        // Adicionar parâmetros somente se for URL do Sanity
        if (optimizedUrl.includes('sanity.io')) {
            // Remover parâmetros existentes se houver
            if (optimizedUrl.includes('?')) {
                optimizedUrl = optimizedUrl.split('?')[0];
            }

            // Adicionar novos parâmetros
            const params = new URLSearchParams();

            if (format.width) params.append('w', format.width.toString());
            if (format.height) params.append('h', format.height.toString());
            if (format.quality) params.append('q', format.quality.toString());

            // Auto=format para obter WebP em navegadores modernos
            params.append('auto', 'format');

            // Adicionar parâmetros à URL
            optimizedUrl = `${optimizedUrl}?${params.toString()}`;
        }

        acc[breakpoint as Breakpoint] = optimizedUrl;
        return acc;
    }, {} as Record<Breakpoint, string>);
}

/**
 * Gera uma string de tamanhos para o atributo sizes do elemento img
 * baseado nos breakpoints especificados
 * 
 * @example 
 * const sizes = generateSizesAttribute({
 *   'xs': '100vw',
 *   'md': '50vw', 
 *   'lg': '33vw'
 * });
 * // Resultado: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
 */
export function generateSizesAttribute(
    sizes: Partial<Record<Breakpoint, string>>
): string {
    const breakpoints = Object.entries(sizes)
        .sort(([a], [b]) => {
            // Ordenar breakpoints do maior para o menor
            const aIndex = Object.keys(breakpointSizes).indexOf(a as Breakpoint);
            const bIndex = Object.keys(breakpointSizes).indexOf(b as Breakpoint);
            return bIndex - aIndex;
        });

    // Se só tem uma entrada, é o tamanho padrão
    if (breakpoints.length === 1) {
        return breakpoints[0][1];
    }

    // Construir a string sizes
    const sizesArr = breakpoints.map(([breakpoint, size], index) => {
        // O último item não precisa de media query
        if (index === breakpoints.length - 1) return size;

        // Para outros items, adicionar media query
        const breakpointSize = breakpointSizes[breakpoint as Breakpoint];
        return `(max-width: ${breakpointSize}px) ${size}`;
    });

    return sizesArr.join(', ');
}
