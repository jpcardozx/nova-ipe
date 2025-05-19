'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { getImageUrl, getImageAlt, SanityImage, ImageType } from '@/lib/sanity-image-helper';
import { processEnhancedSanityImage, EnhancedSanityImage } from '@/lib/enhanced-sanity-image';
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
    const [error, setError] = useState(false);    // Processamento simplificado para garantir o funcionamento
    const enhancedImage = useMemo(() => {
        try {
            // Caso seja uma string, criar um objeto simples
            if (typeof image === 'string') {
                return {
                    url: image,
                    alt: alt || 'Imagem',
                    hotspot: undefined,
                    blurDataUrl: undefined
                };
            }

            // Se for um objeto, extrair informações de maneira mais robusta
            if (typeof image === 'object' && image !== null) {
                // Tenta extrair a URL de diversas possíveis propriedades
                const url = image.url as string ||
                    (image as any).imagemUrl ||
                    (image as any).src ||
                    fallbackUrl;

                // Tenta extrair o texto alt
                const altText = (image as any).alt || alt || 'Imagem';

                return {
                    url,
                    alt: altText,
                    hotspot: (image as any).hotspot,
                    blurDataUrl: undefined
                };
            }

            // Fallback para casos de erro
            return {
                url: fallbackUrl,
                alt: alt || 'Imagem',
                hotspot: undefined,
                blurDataUrl: undefined
            };
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            return {
                url: fallbackUrl,
                alt: alt || 'Imagem',
                hotspot: undefined,
                blurDataUrl: undefined
            };
        }
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
        if (enhancedImage.hotspot) {
            return `${enhancedImage.hotspot.x * 100}% ${enhancedImage.hotspot.y * 100}%`;
        }
        return objectPosition;
    }, [enhancedImage.hotspot, objectPosition]);

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
    };    // Determinar qual URL usar com base nos dados disponíveis
    const imageUrl = typeof image === 'string'
        ? image
        : typeof image === 'object' && image !== null
            ? (image.url ||
                // Use casting para acessar propriedades que podem não estar na interface
                ((image as any).mainImage && typeof (image as any).mainImage === 'object' ? (image as any).mainImage.url : undefined) ||
                image.imagemUrl ||
                (typeof image.asset === 'object' ? image.asset.url : undefined))
            : undefined;

    // Garantir que temos uma URL válida
    const srcForImage = imageUrl || enhancedImage.url || fallbackUrl;

    return (
        <div
            className={containerClasses}
            style={{
                aspectRatio: !fill && width && height ? `${width} / ${height}` : undefined,
            }}
        >
            {/* Imagem principal */}
            <Image
                src={srcForImage}
                alt={enhancedImage.alt}
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
                placeholder={enhancedImage.blurDataUrl ? "blur" : undefined}
                blurDataURL={enhancedImage.blurDataUrl}
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
