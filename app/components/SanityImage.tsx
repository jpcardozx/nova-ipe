'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';

// Unified image type that supports both format styles
export interface ClientImage {
    imagemUrl?: string;
    url?: string;
    alt?: string;
    hotspot?: {
        x: number;
        y: number;
    };
    asset?: {
        _ref?: string;
        url?: string;
    };
}

interface SanityImageProps {
    image: ClientImage | null | undefined;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
    aspectRatio?: string;
    quality?: number;
    onLoad?: () => void;
    showPlaceholderIcon?: boolean;
}

/**
 * Componente aprimorado para renderizar imagens, com suporte a múltiplos formatos:
 * - Formatos Sanity { url, imagemUrl, asset }
 * - Imagens convencionais
 * - Tratamento de erros e carregamento
 * - Animações e efeitos visuais
 */
export default function SanityImage({
    image,
    alt = '',
    width,
    height,
    fill = false,
    sizes,
    className,
    priority = false,
    aspectRatio,
    onLoad,
    showPlaceholderIcon = true,
}: SanityImageProps) {
    const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
    const [isHovered, setIsHovered] = useState(false);    // Extract image URL from various possible formats
    const getImageUrl = (img: ClientImage | null | undefined): string | null => {
        if (!img) return null;

        // Direct URL on the image object
        if (img.url) return img.url;

        // For backward compatibility with imagemUrl naming
        if (img.imagemUrl) return img.imagemUrl;

        // Sanity asset reference format
        if (img.asset?.url) return img.asset.url;

        // Sanity reference that needs to be constructed
        if (img.asset?._ref) {
            try {
                // Parse Sanity asset reference: image-abc123-800x600-jpg
                const refParts = img.asset._ref.split('-');

                // Handle different reference formats
                if (refParts.length >= 4) {
                    const [type, id, dimensions, extension] = refParts;

                    if (type === 'image' && id) {
                        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project-id';
                        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
                        // Correctly formatting URL with dimensions and extension
                        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                    }
                }

                console.error("Invalid Sanity asset reference format:", img.asset._ref);
            } catch (error) {
                console.error("Error parsing Sanity asset reference:", error, img.asset._ref);
            }
        }

        console.warn("Could not determine image URL from:", img);
        return null;
    };

    // Get the URL and hotspot information
    const imageUrl = getImageUrl(image);
    const hotspot = image?.hotspot;

    // Calculate object position based on hotspot data
    const objectPosition = hotspot
        ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
        : '50% 50%';

    // Notify parent component when the image loads successfully
    useEffect(() => {
        if (loadState === 'success' && onLoad) {
            onLoad();
        }
    }, [loadState, onLoad]);

    // Fallback when there's no image or it fails to load
    if (loadState === 'error' || !imageUrl) {
        return (
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center",
                    "bg-gradient-to-b from-stone-100 to-stone-200",
                    "border border-stone-200 rounded-md",
                    fill ? "w-full h-full" : "",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                    aspectRatio: fill ? undefined : aspectRatio,
                }}
            >
                {showPlaceholderIcon && (
                    <div className="flex items-center justify-center p-3 mb-2 rounded-full bg-stone-100">
                        <ImageOff className="w-6 h-6 text-stone-500" />
                    </div>
                )}
                <p className="text-stone-500 text-sm font-medium px-4 text-center">
                    {image?.alt || alt || 'Imagem indisponível'}
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative overflow-hidden group",
                fill ? "w-full h-full" : "",
                className
            )}
            style={{
                aspectRatio: fill ? undefined : aspectRatio,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Imagem principal */}
            <Image
                src={imageUrl}
                alt={image?.alt || alt || 'Imagem do imóvel'}
                width={fill ? undefined : width || 800}
                height={fill ? undefined : height || 600}
                fill={fill}
                sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
                className={cn(
                    "object-cover transition-all duration-500",
                    isHovered ? "scale-105" : "scale-100",
                    loadState === 'loading' ? "opacity-0" : "opacity-100"
                )}
                style={{
                    objectPosition,
                }}
                priority={priority}
                onLoad={() => setLoadState('success')}
                onError={() => setLoadState('error')}
            />

            {/* Estado de carregamento */}
            {loadState === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200 animate-pulse">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
                    </div>
                    {showPlaceholderIcon && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center justify-center p-3 rounded-full bg-white/80 backdrop-blur-sm">
                                <Home className="w-6 h-6 text-stone-400" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Adicione este estilo ao seu CSS global para o efeito de shimmer:
 * 
 * .shimmer {
 *   animation: shimmer 1.5s infinite;
 * }
 * 
 * @keyframes shimmer {
 *   0% {
 *     transform: translateX(-100%);
 *   }
 *   100% {
 *     transform: translateX(100%);
 *   }
 * }
 */