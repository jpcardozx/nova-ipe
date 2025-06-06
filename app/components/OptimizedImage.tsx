'use client';

import Image from 'next/image';
import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import { getImageUrl, ImageType } from '@/lib/optimized-sanity-image';

// Versão otimizada para performance - redução do LCP
// Foco em carregamento prioritário e tratamento robusto de erros

interface Props {
    src: ImageType;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    className?: string;
    imgClassName?: string;
    priority?: boolean;
    quality?: number;
    onLoad?: () => void;
    fallbackUrl?: string;
}

/**
 * Componente otimizado para imagens que lida com múltiplos formatos e erros
 */
export default function OptimizedImage({
    src,
    alt = 'Imagem',
    width,
    height,
    fill = false,
    sizes = '100vw',
    className = '',
    imgClassName = '',
    priority = false,
    quality = 80,
    onLoad,
    fallbackUrl = '/images/property-placeholder.jpg'
}: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Memoize processamento da imagem para evitar recálculos desnecessários
    const { imageUrl, hotspot, altText } = useMemo(() => {
        // Extrair URL e informações de posicionamento com melhor performance
        const url = getImageUrl(src) || fallbackUrl;
        const imgHotspot = typeof src !== 'string' ? src?.hotspot : undefined;
        const text = typeof src !== 'string' ? src?.alt || alt : alt;

        // Aplicar cache em development para debugging
        if (process.env.NODE_ENV === 'development') {
            const key = typeof src === 'string' ? src : ((src as any)?._ref || JSON.stringify(src));
            (window as any).__imageCache = (window as any).__imageCache || {};
            (window as any).__imageCache[key] = url;
        }

        return { imageUrl: url, hotspot: imgHotspot, altText: text };
    }, [src, alt, fallbackUrl]);

    const objectPosition = hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : '50% 50%';

    // Handler de carregamento otimizado
    const handleLoad = useCallback(() => {
        setIsLoading(false);
        if (onLoad) onLoad();
    }, [onLoad]);

    // Handler de erro otimizado
    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);

        // Log em development para diagnóstico
        if (process.env.NODE_ENV === 'development') {
            console.warn('OptimizedImage: Failed to load image', {
                src,
                processedUrl: imageUrl
            });
        }
    }, [src, imageUrl]);

    // Renderizar placeholder em caso de erro
    if (hasError) {
        return (
            <div
                className={cn(
                    "relative bg-slate-100 flex items-center justify-center overflow-hidden",
                    fill ? "w-full h-full" : "",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                    <ImageOff size={24} className="mb-2" />
                    <span className="text-xs text-center">{alt || 'Imagem não disponível'}</span>
                </div>
            </div>
        );
    }    // Renderizar a imagem com tratamento de erro
    return (
        <div
            className={cn(
                "relative overflow-hidden",
                isLoading ? "bg-slate-100 animate-pulse" : "",
                className
            )}
            style={fill ? { position: 'relative', width: '100%', height: '100%' } : { width, height }}
        >            <Image
                src={imageUrl}
                alt={altText || 'Imagem'}
                width={fill ? undefined : width}
                height={fill ? undefined : height || width ? 'auto' : undefined}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    imgClassName
                )}
                style={fill ? {} : { objectFit: 'cover', objectPosition }}
                onLoad={handleLoad}
                onError={handleError}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent skeleton-loading" />
            )}
        </div>
    );
}
