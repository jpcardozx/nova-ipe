'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

export interface SimpleResponsiveImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sizes?: string;
    className?: string;
    imgClassName?: string;
    priority?: boolean;
    fill?: boolean;
    quality?: number;
    objectFit?: ImageFit;
    objectPosition?: string;
    fallbackSrc?: string;
}

/**
 * Componente de imagem simplificado que substitui ResponsiveSanityImage
 * para resolver problemas de compatibilidade com diferentes formatos de dados
 */
export default function SimpleResponsiveImage({
    src,
    alt,
    width,
    height,
    sizes = '100vw',
    className,
    imgClassName,
    priority = false,
    fill = false,
    quality = 80,
    objectFit = 'cover',
    objectPosition = 'center',
    fallbackSrc = '/images/property-placeholder.jpg',
}: SimpleResponsiveImageProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Usar URL de fallback em caso de erro
    const imageSrc = error ? fallbackSrc : src || fallbackSrc;

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

    // Função de tratamento de carregamento
    const handleLoad = () => {
        setLoading(false);
        setError(false);
    };

    // Função de tratamento de erros
    const handleError = () => {
        setError(true);
        setLoading(false);
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
                src={imageSrc}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                quality={quality}
                priority={priority}
                sizes={sizes}
                className={imageClasses}
                style={{
                    objectFit,
                    objectPosition
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
