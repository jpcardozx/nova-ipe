'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Blurhash } from 'react-blurhash';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Tipo de imagem que corresponde ao formato retornado pela função toClientImage
type ClientImage = {
    imagemUrl?: string;
    alt?: string;
    hotspot?: {
        x: number;
        y: number;
    };
    // Campos adicionais para melhor gerenciamento de imagens
    dimensions?: {
        width: number;
        height: number;
    };
    blurHash?: string;
    lqip?: string; // Low Quality Image Placeholder
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
    aspectRatio?: number | string;
    quality?: number;
    optimized?: boolean;  // Flag para ativar/desativar recursos de otimização
    accentColor?: {
        light: string;
        dark: string;
        accent: string;
    };
    onLoad?: () => void;
    showPlaceholderIcon?: boolean;
    animateLoad?: boolean;
}

/**
 * Componente para renderizar imagens do Sanity com otimização
 * Características:
 * - Suporte a blurhash e LQIP para carregar progressivamente
 * - Animações de carregamento suaves
 * - Tratamento de erros elegante
 * - Suporte a aspect ratio controlado
 * - Otimização de performance
 */
export default function SanityImage({
    image,
    alt = '',
    width,
    height,
    fill = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    className,
    priority = false,
    aspectRatio = "16 / 9",
    quality = 80,
    accentColor,
    onLoad,
    showPlaceholderIcon = true,
    animateLoad = true,
    optimized = true,
}: SanityImageProps) {
    const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);

    // Extrair a URL da imagem e outros dados
    const imageUrl = image?.imagemUrl || null;
    const hotspot = image?.hotspot;
    const blurHash = image?.blurHash || 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH';
    const lqip = image?.lqip;

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

    // Verificar se a imagem está no viewport
    useEffect(() => {
        if (!imageUrl) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        const element = document.getElementById(`sanity-img-${imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.lastIndexOf('?'))}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [imageUrl]);

    // Notificar o componente pai quando a imagem for carregada com sucesso
    useEffect(() => {
        if (loadState === 'success' && onLoad) {
            onLoad();
        }
    }, [loadState, onLoad]);

    // Componente de fallback para erro ou sem imagem
    if (loadState === 'error' || !imageUrl) {
        return (
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center overflow-hidden",
                    "bg-gradient-to-b from-neutral-100 to-neutral-200",
                    "border border-neutral-200 rounded-md",
                    fill ? "w-full h-full" : "",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <AspectRatio ratio={typeof aspectRatio === 'string' ? parseInt(aspectRatio.split('/')[0]) / parseInt(aspectRatio.split('/')[1]) : aspectRatio}>
                    <div className="flex flex-col items-center justify-center h-full">
                        {showPlaceholderIcon && (
                            <div className={cn(
                                "flex items-center justify-center p-3 mb-2 rounded-full",
                                colors.light
                            )}>
                                <ImageOff className={cn("w-6 h-6", colors.accent)} />
                            </div>
                        )}
                        <p className="text-neutral-500 text-sm font-medium px-4 text-center">
                            {image?.alt || alt || 'Imagem indisponível'}
                        </p>
                    </div>
                </AspectRatio>
            </div>
        );
    }

    // Renderizar imagem com otimização
    return (
        <div
            id={`sanity-img-${imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.lastIndexOf('?'))}`}
            className={cn(
                "relative overflow-hidden",
                fill ? "w-full h-full" : "",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!fill && aspectRatio ? (
                <AspectRatio ratio={typeof aspectRatio === 'string' ? parseInt(aspectRatio.split('/')[0]) / parseInt(aspectRatio.split('/')[1]) : aspectRatio}>
                    {/* Placeholder enquanto carrega */}
                    {loadState === 'loading' && (
                        <div className="absolute inset-0 z-10">
                            {lqip ? (
                                <img
                                    src={lqip}
                                    alt=""
                                    className="w-full h-full object-cover blur-md scale-110"
                                    aria-hidden="true"
                                />
                            ) : blurHash ? (
                                <Blurhash
                                    hash={blurHash}
                                    width="100%"
                                    height="100%"
                                    resolutionX={32}
                                    resolutionY={32}
                                    punch={1}
                                />
                            ) : (
                                <Skeleton className="w-full h-full" />
                            )}
                        </div>
                    )}

                    {/* Imagem principal */}
                    {(priority || isInView || !optimized) && (
                        <Image
                            src={imageUrl}
                            alt={image?.alt || alt || 'Imagem do imóvel'}
                            fill={true}
                            sizes={sizes}
                            quality={quality}
                            className={cn(
                                "object-cover transition-all duration-500",
                                isHovered && animateLoad ? "scale-105" : "scale-100",
                                loadState === 'loading' ? "opacity-0" : "opacity-100"
                            )}
                            style={{
                                objectPosition,
                            }}
                            priority={priority}
                            onLoadingComplete={() => setLoadState('success')}
                            onError={() => setLoadState('error')}
                        />
                    )}
                </AspectRatio>
            ) : (
                <>
                    {/* Placeholder enquanto carrega */}
                    {loadState === 'loading' && (
                        <div className="absolute inset-0 z-10">
                            {lqip ? (
                                <img
                                    src={lqip}
                                    alt=""
                                    className="w-full h-full object-cover blur-md scale-110"
                                    aria-hidden="true"
                                />
                            ) : blurHash ? (
                                <Blurhash
                                    hash={blurHash}
                                    width="100%"
                                    height="100%"
                                    resolutionX={32}
                                    resolutionY={32}
                                    punch={1}
                                />
                            ) : (
                                <Skeleton className="w-full h-full" />
                            )}
                        </div>
                    )}

                    {/* Imagem principal */}
                    {(priority || isInView || !optimized) && (
                        <Image
                            src={imageUrl}
                            alt={image?.alt || alt || 'Imagem do imóvel'}
                            width={fill ? undefined : width || 800}
                            height={fill ? undefined : height || 600}
                            fill={fill}
                            sizes={sizes}
                            quality={quality}
                            className={cn(
                                "object-cover transition-all duration-500",
                                isHovered && animateLoad ? "scale-105" : "scale-100",
                                loadState === 'loading' ? "opacity-0" : "opacity-100"
                            )}
                            style={{
                                objectPosition,
                            }}
                            priority={priority}
                            onLoadingComplete={() => setLoadState('success')}
                            onError={() => setLoadState('error')}
                        />
                    )}
                </>
            )}
        </div>
    );
}
