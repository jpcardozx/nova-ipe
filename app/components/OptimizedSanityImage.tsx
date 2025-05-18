'use client';

import React, { useState, useEffect, memo, useMemo, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImageUrl, getImageAlt } from '@/lib/sanity-image-helper';
import { ImageOff } from 'lucide-react';
import { useImageAnalytics } from '../providers/ImageAnalyticsProvider';

export interface SanityImageProps {
    image: any;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    className?: string;
    imgClassName?: string;
    quality?: number;
    onLoad?: () => void;
    objectFit?: 'cover' | 'contain' | 'fill';
    objectPosition?: string;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
}

/**
 * Componente otimizado para renderização de imagens do Sanity
 * Implementa:
 * - Tratamento de erros unificado
 * - Melhor experiência de carregamento
 * - Integração com sistema de cache
 * - Loading states com visual aprimorado
 */
const OptimizedSanityImage = memo(({
    image,
    alt = '',
    width,
    height,
    fill = false,
    priority = false,
    sizes = fill ? '100vw' : undefined,
    className = '',
    imgClassName = '',
    quality = 80,
    onLoad,
    objectFit = 'cover',
    objectPosition = 'center',
    placeholder = 'empty',
    blurDataURL
}: SanityImageProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const analytics = useImageAnalytics();
    const trackingIdRef = useRef<string>('');

    // Extrair URL e texto alternativo com memorização
    const { imageUrl, imageAlt } = useMemo(() => {
        if (!image) {
            return {
                imageUrl: '/images/property-placeholder.jpg',
                imageAlt: alt || 'Imagem não disponível'
            };
        }

        return {
            imageUrl: getImageUrl(image, '/images/property-placeholder.jpg'),
            imageAlt: alt || getImageAlt(image, 'Imóvel')
        };
    }, [image, alt]);

    // Iniciar tracking ao montar o componente
    useEffect(() => {
        // Iniciar tracking de carregamento
        if (analytics && typeof analytics.trackStart === 'function') {
            trackingIdRef.current = analytics.trackStart(
                imageUrl,
                'OptimizedSanityImage',
                priority
            );
        }
    }, [imageUrl, analytics, priority]);

    // Detectar erros no carregamento
    const handleError = () => {
        setError(true);
        setLoading(false);

        // Reportar erro para analytics
        if (analytics && typeof analytics.trackComplete === 'function' && trackingIdRef.current) {
            analytics.trackComplete(trackingIdRef.current, false);
        }

        console.error('[OptimizedSanityImage] Erro ao carregar imagem:', imageUrl);
    };

    // Confirmar carregamento bem-sucedido
    const handleLoad = () => {
        setLoading(false);
        setError(false);

        // Reportar sucesso para analytics com metadados
        if (analytics && typeof analytics.trackComplete === 'function' && trackingIdRef.current) {
            const img = imgRef.current;
            analytics.trackComplete(trackingIdRef.current, true, {
                width: img?.naturalWidth,
                height: img?.naturalHeight,
                fromCache: img ? (performance.getEntriesByName(imageUrl).length > 0) : undefined
            });
        }

        if (onLoad) onLoad();
    };

    // Classes para container e imagem
    const containerClasses = cn(
        'relative overflow-hidden bg-gray-100',
        loading && 'animate-pulse',
        className
    );

    const imageClasses = cn(
        'transition-opacity duration-300',
        loading ? 'opacity-0' : 'opacity-100',
        error ? 'hidden' : 'block',
        imgClassName
    );

    return (
        <div className={containerClasses} style={{ aspectRatio: !fill && width && height ? width / height : undefined }}>            {!error ? (
            <Image
                src={imageUrl}
                alt={imageAlt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                onLoad={handleLoad}
                onError={handleError}
                className={imageClasses}
                style={{
                    objectFit,
                    objectPosition
                }}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                // @ts-ignore - Adicionar ref para tracking
                ref={imgRef}
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center text-gray-400">
                    <ImageOff size={24} className="mb-2" />
                    <span className="text-xs">Imagem não disponível</span>
                </div>
            </div>
        )}

            {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
        </div>
    );
});

OptimizedSanityImage.displayName = 'OptimizedSanityImage';

export default OptimizedSanityImage;
