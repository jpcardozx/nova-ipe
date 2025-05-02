'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';

// Tipo de imagem que corresponde ao formato retornado pela função toClientImage
type ClientImage = {
    imagemUrl?: string;
    alt?: string;
    hotspot?: {
        x: number;
        y: number;
    };
};

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
    accentColor?: {
        light: string;
        dark: string;
        accent: string;
    };
    onLoad?: () => void;
    showPlaceholderIcon?: boolean;
}

/**
 * Componente para renderizar imagens do Sanity
 * Compatível com o formato { imagemUrl, alt } retornado por toClientImage
 * Com melhorias visuais e de performance
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
    accentColor,
    onLoad,
    showPlaceholderIcon = true,
}: SanityImageProps) {
    const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
    const [isHovered, setIsHovered] = useState(false);

    // Extrair a URL da imagem e hotspot se disponível
    const imageUrl = image?.imagemUrl || null;
    const hotspot = image?.hotspot;

    // Cores de destaque para os estados
    const colors = accentColor || {
        light: 'bg-gray-100',
        dark: 'bg-gray-200',
        accent: 'text-gray-500'
    };

    // Calcular a posição do objeto com base no hotspot se disponível
    const objectPosition = hotspot
        ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
        : '50% 50%';

    // Notificar o componente pai quando a imagem for carregada com sucesso
    useEffect(() => {
        if (loadState === 'success' && onLoad) {
            onLoad();
        }
    }, [loadState, onLoad]);

    // Fallback quando não há imagem ou ocorre erro
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
                    <div className={cn(
                        "flex items-center justify-center p-3 mb-2 rounded-full",
                        colors.light
                    )}>
                        <ImageOff className={cn("w-6 h-6", colors.accent)} />
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
                onLoadingComplete={() => setLoadState('success')}
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