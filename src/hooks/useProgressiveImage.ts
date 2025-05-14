'use client';

import { useState, useEffect } from 'react';

type ImageLoadingState = 'loading' | 'loaded' | 'error';

/**
 * Hook para gerenciar o carregamento progressivo de imagens
 * Permite o uso de um placeholder enquanto a imagem principal carrega
 * 
 * @param src URL da imagem principal
 * @param placeholderSrc URL da imagem de baixa resolução (opcional)
 * @param options Opções adicionais para customização
 * @returns Estado, src atual e handlers para gerenciar a imagem
 */
export function useProgressiveImage(
    src: string | null | undefined,
    placeholderSrc?: string,
    options?: {
        delay?: number;
        shouldLoad?: boolean;
        onLoad?: () => void;
        onError?: (error: Error) => void;
    }
) {
    const [imgSrc, setImgSrc] = useState<string | null>(placeholderSrc || null);
    const [state, setState] = useState<ImageLoadingState>('loading');
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Se não houver src ou não devemos carregar, retorne
        if (!src || options?.shouldLoad === false) {
            return;
        }

        // Resetar estado quando o src mudar
        setState('loading');
        setError(null);

        // Se tivermos placeholder, começamos com ele
        if (placeholderSrc) {
            setImgSrc(placeholderSrc);
        }

        // Opcional: delay para carregamento (útil para testes ou animations staggered)
        const timer = options?.delay
            ? setTimeout(() => loadImage(), options.delay)
            : loadImage();

        function loadImage() {
            if (!src) return; // Early return if src is null or undefined

            const img = new Image();
            img.src = src;

            img.onload = () => {
                setImgSrc(src);
                setState('loaded');
                if (options?.onLoad) options.onLoad();
            };

            img.onerror = (e) => {
                const err = new Error(`Falha no carregamento da imagem: ${src}`);
                setError(err);
                setState('error');
                if (options?.onError) options.onError(err);
            };
        }

        // Limpar timer se componente for desmontado
        return () => {
            if (options?.delay) clearTimeout(timer as NodeJS.Timeout);
        };
    }, [src, placeholderSrc, options?.delay, options?.shouldLoad, options?.onLoad, options?.onError]);

    // Funções auxiliares para gerenciar a imagem
    const retry = () => {
        if (!src) return; // Early return if src is null or undefined

        setState('loading');
        setError(null);
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImgSrc(src);
            setState('loaded');
            if (options?.onLoad) options.onLoad();
        };

        img.onerror = (e) => {
            const err = new Error(`Falha no carregamento da imagem: ${src}`);
            setError(err);
            setState('error');
            if (options?.onError) options.onError(err);
        };
    };

    return {
        src: imgSrc,
        state,
        isLoading: state === 'loading',
        isLoaded: state === 'loaded',
        hasError: state === 'error',
        error,
        retry
    };
}

export default useProgressiveImage;
