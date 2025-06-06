'use client';

import { useState, useEffect, useMemo } from 'react';
import { getImageUrl, ImageType } from '@/lib/sanity-image-helper';
import { generateResponsiveImageSet, generateSizesAttribute, Breakpoint, breakpointSizes } from '@/lib/responsive-images';

export interface UseSanityImageOptions {
    // Opções básicas de imagem
    image: ImageType;
    fallbackUrl?: string;
    alt?: string;

    // Configuração de tamanhos responsivos
    // Ex: { xs: { width: 320 }, md: { width: 768 }, lg: { width: 1024 } }
    responsiveSizes?: Partial<Record<Breakpoint, { width: number, height?: number, quality?: number }>>;

    // Configuração de sizes para HTML 
    // Ex: { xs: '100vw', md: '50vw', lg: '33vw' }
    sizesAttribute?: Partial<Record<Breakpoint, string>>;

    // Outros comportamentos
    lazyLoad?: boolean;
    enablePlaceholder?: boolean;
}

export interface SanityImageResult {
    // URLs otimizadas para diferentes breakpoints
    urls: Record<Breakpoint, string>;

    // URL principal (maior resolução disponível)
    url: string;

    // Texto alternativo
    alt: string;

    // String sizes para uso no atributo sizes do HTML
    sizes: string;

    // Estado do carregamento
    isLoading: boolean;

    // Informações para posicionamento
    hotspot?: { x: number, y: number };

    // Informações para rendering
    blurDataUrl?: string;
    loading: 'lazy' | 'eager';

    // Funções utilitárias
    getSrcSet: () => string;
    getProps: () => Record<string, any>;
}

/**
 * Hook para uso avançado e otimizado de imagens Sanity
 * 
 * Principais funcionalidades:
 * - Gera URLs otimizadas para diferentes tamanhos de tela
 * - Cria srcSet e sizes automaticamente
 * - Suporta lazy loading e placeholders
 * - Extrai informações de hotspot para posicionamento inteligente
 * - Normaliza diferentes formatos de imagem do Sanity
 */
export function useSanityImage(options: UseSanityImageOptions): SanityImageResult {
    const {
        image,
        fallbackUrl = '/images/property-placeholder.jpg',
        alt = '',
        responsiveSizes = {},
        sizesAttribute = { xs: '100vw' },
        lazyLoad = true,
        enablePlaceholder = true
    } = options;

    const [isLoading, setIsLoading] = useState(true);

    // Processar URLs responsivas com memoização
    const urls = useMemo(() =>
        generateResponsiveImageSet(image, responsiveSizes),
        [image, responsiveSizes]
    );

    // Gerar string sizes
    const sizes = useMemo(() =>
        generateSizesAttribute(sizesAttribute),
        [sizesAttribute]
    );

    // Extrair URL principal (maior resolução)
    const url = useMemo(() => {
        // Se não temos URLs responsivas, usar URL diretamente
        if (Object.keys(urls).length === 0) {
            return getImageUrl(image, fallbackUrl);
        }

        // Encontrar a maior resolução disponível
        const breakpointEntries = Object.entries(urls);
        if (breakpointEntries.length === 0) {
            return getImageUrl(image, fallbackUrl);
        }

        // Ordenar por tamanho de breakpoint (descendente)
        const sortedBreakpoints = breakpointEntries
            .sort(([a], [b]) => {
                const aSize = breakpointSizes[a as Breakpoint] || 0;
                const bSize = breakpointSizes[b as Breakpoint] || 0;
                return bSize - aSize;
            });

        // Retornar URL do maior breakpoint
        return sortedBreakpoints[0][1];
    }, [image, urls, fallbackUrl]);

    // Extrair hotspot se disponível
    const hotspot = useMemo(() => {
        if (typeof image === 'object' && image?.hotspot) {
            return {
                x: image.hotspot.x,
                y: image.hotspot.y
            };
        }
        return undefined;
    }, [image]);

    // Informa o final do carregamento
    useEffect(() => {
        const img = new Image();
        img.src = url;

        const handleLoad = () => setIsLoading(false);
        img.addEventListener('load', handleLoad);

        return () => {
            img.removeEventListener('load', handleLoad);
        };
    }, [url]);

    // Gerar srcSet para uso em <img> ou <Image>
    const getSrcSet = () => {
        return Object.entries(urls)
            .map(([breakpoint, url]) => {
                const width = responsiveSizes[breakpoint as Breakpoint]?.width || breakpointSizes[breakpoint as Breakpoint];
                return `${url} ${width}w`;
            })
            .join(', ');
    };

    // Retornar todas as props necessárias para uso com <img> ou <Image>
    const getProps = () => ({
        src: url,
        alt,
        sizes,
        srcSet: getSrcSet(),
        loading: lazyLoad ? 'lazy' : 'eager',
        style: hotspot ? {
            objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`
        } : undefined
    });

    return {
        urls,
        url,
        alt: alt || 'Imóvel',
        sizes,
        isLoading,
        hotspot,
        loading: lazyLoad ? 'lazy' : 'eager',
        getSrcSet,
        getProps
    };
}
