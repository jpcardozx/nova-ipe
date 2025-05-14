'use client';

import { useState, useEffect, useCallback } from 'react';

// Simple local implementation of generateBlurPreview to avoid external dependency
function generateBlurPreview(src: string, quality = 20): string {
    if (!src) return '';

    // If it's a Sanity URL
    if (src.includes('cdn.sanity.io')) {
        return `${src}?w=100&q=${quality}&blur=50&fit=max`;
    }

    // For local images
    if (src.startsWith('/')) {
        return `/_next/image?url=${encodeURIComponent(src)}&w=100&q=${quality}`;
    }

    return src;
}

interface UseImageOptimizationOptions {
    src: string;
    preloadLowQuality?: boolean;
    preloadBlur?: boolean;
    quality?: number;
}

interface UseImageOptimizationResult {
    optimizedSrc: string;
    isLoaded: boolean;
    previewSrc: string;
    handleLoad: () => void;
    handleError: () => void;
}

/**
 * Hook para otimizar a carga de imagens com técnicas de carregamento progressivo
 */
export function useImageOptimization({
    src,
    preloadLowQuality = true,
    preloadBlur = true,
    quality = 20,
}: UseImageOptimizationOptions): UseImageOptimizationResult {
    // Estado para controlar se a imagem completa foi carregada
    const [isLoaded, setIsLoaded] = useState(false);

    // URL da versão de baixa qualidade para pré-carregamento
    const [previewSrc, setPreviewSrc] = useState<string>('');

    // URL da imagem otimizada
    const [optimizedSrc, setOptimizedSrc] = useState<string>(src);

    // Gera a previsualização quando o componente monta
    useEffect(() => {
        if (preloadLowQuality || preloadBlur) {
            setPreviewSrc(generateBlurPreview(src, quality));
        }

        // Reset quando a URL da fonte muda
        setIsLoaded(false);
        setOptimizedSrc(src);
    }, [src, preloadLowQuality, preloadBlur, quality]);

    // Handler para quando a imagem completa carrega
    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // Handler para quando a imagem falha ao carregar
    const handleError = useCallback(() => {
        console.warn(`Failed to load image: ${src}`);
        // Você pode configurar para usar uma imagem de fallback aqui
    }, [src]);

    return {
        optimizedSrc,
        isLoaded,
        previewSrc,
        handleLoad,
        handleError
    };
}

export default useImageOptimization;
