'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImageUrl, ImageType } from '@/lib/optimized-sanity-image';

// Interface para props
export interface HighPerformanceImageProps {
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
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    blurDataUrl?: string;
    placeholderColor?: string;
    lazyBoundary?: string;
}

/**
 * HighPerformanceImage - Componente otimizado para renderização eficiente de imagens
 * 
 * Projetado para melhorar significativamente o LCP e evitar layout shifts
 * Inclui otimizações avançadas para reduzir o impacto no thread principal
 */
export default function HighPerformanceImage({
    src,
    alt = 'Imagem',
    width,
    height,
    fill = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    className = '',
    imgClassName = '',
    priority = false,
    quality = 80,
    onLoad,
    fallbackUrl = '/images/property-placeholder.jpg',
    objectFit = 'cover',
    blurDataUrl,
    placeholderColor = '#f5f5f5',
    lazyBoundary = '200px',
}: HighPerformanceImageProps) {
    // Estados para tracking de carregamento
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Preconnect para domínios de imagens para reduzir tempo de conexão
    useEffect(() => {
        try {
            // Obtém a URL da imagem
            const imageUrl = typeof src === 'string' ? src : getImageUrl(src);

            // Add preconnect for external image domains
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
                const domain = new URL(imageUrl).origin;

                // Create preconnect link if it doesn't exist
                if (!document.head.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = domain;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            }
        } catch (e) {
            // Ignore URL parsing errors
        }
    }, [src]);

    // Processamento eficiente da imagem com memoização
    const imageData = useMemo(() => {
        // Extrair URL
        const url = getImageUrl(src) || fallbackUrl;

        // Extrair hotspot e outras informações
        const hotspot = typeof src !== 'string' && src ? src.hotspot : undefined;
        const textAlt = typeof src !== 'string' && src ? src.alt || alt : alt;

        return {
            url,
            hotspot, alt: textAlt,
            // Adiciona um placeholder blur data URL se não for fornecido
            blurDataUrl: blurDataUrl || (typeof src !== 'string' && src && (src as any).blurDataUrl) || undefined
        };
    }, [src, alt, fallbackUrl, blurDataUrl]);

    // Calcular posição com base no hotspot
    const objectPosition = imageData.hotspot
        ? `${imageData.hotspot.x * 100}% ${imageData.hotspot.y * 100}%`
        : '50% 50%';

    // Handler de carregamento otimizado
    const handleLoad = useCallback(() => {
        setIsLoading(false);
        if (onLoad) onLoad();

        // Report LCP para análise se for uma imagem prioritária
        if (priority && typeof window !== 'undefined' && 'performance' in window) {
            const lcpEntry = {
                element: `image:${imageData.url.substring(0, 50)}...`,
                timestamp: performance.now(),
                url: window.location.href
            };
            console.info('[Performance] Potential LCP image loaded:', lcpEntry);
        }
    }, [onLoad, priority, imageData.url]);

    // Handler de erro
    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);

        if (process.env.NODE_ENV === 'development') {
            console.warn('Image failed to load:', {
                src,
                processedUrl: imageData.url
            });
        }
    }, [src, imageData.url]);

    // Em caso de erro, mostrar placeholder
    if (hasError) {
        return (
            <div
                className={cn(
                    "relative bg-slate-50 flex items-center justify-center overflow-hidden rounded",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                    <ImageOff size={24} className="mb-2" />
                    <span className="text-xs text-center">{imageData.alt || 'Imagem não disponível'}</span>
                </div>
            </div>
        );
    }

    // Renderizar a imagem com otimizações
    return (
        <div
            className={cn(
                "relative overflow-hidden",
                isLoading ? "bg-slate-50" : "",
                className
            )}
            style={{
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
                position: fill ? 'relative' : undefined,
            }}
        >
            <Image
                src={imageData.url}
                alt={imageData.alt || 'Imagem'}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    imgClassName
                )}
                style={{ objectFit, objectPosition }}
                onLoad={handleLoad}
                onError={handleError}
            />

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute inset-0 bg-slate-50">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent animate-pulse-x" />
                </div>
            )}
        </div>
    );
}
