'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { getImageUrl, getImageAlt, SanityImage, ImageType } from '@/lib/sanity-image-helper';
import { cn } from '@/lib/utils';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

export interface ResponsiveSanityImageProps {
    image: ImageType;
    alt?: string;
    width?: number;
    height?: number;
    sizes?: string;
    className?: string;
    imgClassName?: string;
    priority?: boolean;
    fill?: boolean;
    quality?: number;
    lazy?: boolean;
    objectFit?: ImageFit;
    objectPosition?: string;
    onLoad?: () => void;
    onError?: () => void;
    fallbackUrl?: string;
}

/**
 * ResponsiveSanityImage - Um componente avançado para imagens Sanity com otimizações
 * - Suporte completo a imagens responsivas
 * - Estados de carregamento avançados
 * - Tratamento de erros profissional
 * - Caching de URLs automatizado
 * - Suporte a art direction via sizes
 * - Foco inteligente baseado em hotspot
 */
export default function ResponsiveSanityImage({
    image,
    alt,
    width,
    height,
    sizes = '100vw',
    className,
    imgClassName,
    priority = false,
    fill = false,
    quality = 80,
    lazy = !priority,
    objectFit = 'cover',
    objectPosition = 'center',
    onLoad,
    onError,
    fallbackUrl = '/images/property-placeholder.jpg'
}: ResponsiveSanityImageProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Processa imagem com memoização para evitar re-renderizações
    const processedImage = useMemo(() => {
        // Extrair URL e texto alternativo
        const url = getImageUrl(image, fallbackUrl);
        const altText = alt || getImageAlt(image, 'Imóvel');

        // Extrair hotspot se disponível para melhor foco
        const hotspot = typeof image === 'object' && image?.hotspot ? {
            x: image.hotspot.x,
            y: image.hotspot.y
        } : undefined;

        return { url, altText, hotspot };
    }, [image, alt, fallbackUrl]);

    // Classes CSS dinâmicas
    const containerClasses = cn(
        'relative overflow-hidden bg-gray-100 transition-all',
        loading && !error && 'animate-pulse',
        error && 'bg-gray-200 border border-gray-300',
        className
    );

    const imageClasses = cn(
        'transition-opacity duration-300',
        loading ? 'opacity-0' : 'opacity-100',
        error ? 'hidden' : 'block',
        imgClassName
    );

    // Calcular posição baseada no hotspot se disponível
    const imageObjectPosition = useMemo(() => {
        if (processedImage.hotspot) {
            return `${processedImage.hotspot.x * 100}% ${processedImage.hotspot.y * 100}%`;
        }
        return objectPosition;
    }, [processedImage.hotspot, objectPosition]);

    // Função de tratamento de carregamento
    const handleLoad = () => {
        setLoading(false);
        setError(false);
        if (onLoad) onLoad();
    };

    // Função de tratamento de erros
    const handleError = () => {
        setError(true);
        setLoading(false);
        if (onError) onError();
    };

    return (
        <div
            className={containerClasses}
            style={{
                aspectRatio: !fill && width && height ? `${width} / ${height}` : undefined,
            }}
        >
            {/* Imagem principal */}
            <Image
                src={processedImage.url}
                alt={processedImage.altText}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                quality={quality}
                priority={priority}
                loading={lazy ? 'lazy' : undefined}
                sizes={sizes}
                className={imageClasses}
                style={{
                    objectFit,
                    objectPosition: imageObjectPosition
                }}
                onLoad={handleLoad}
                onError={handleError}
            />

            {/* Estado de carregamento */}
            {loading && !error && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}

            {/* Estado de erro */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Não foi possível carregar esta imagem</p>
                </div>
            )}
        </div>
    );
}
