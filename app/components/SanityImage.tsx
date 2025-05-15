'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';
import { getImageUrl } from '@/lib/optimized-sanity-image';

// Unified image type that supports both format styles
export interface ClientImage {
    _type?: string;
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
        _type?: string;
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
    const [isHovered, setIsHovered] = useState(false);
    const [processedImage, setProcessedImage] = useState<ClientImage | null | undefined>(image);

    // Pré-processamento da imagem para resolver possíveis problemas de referência
    useEffect(() => {
        // Importar dinamicamente para evitar problemas de ciclo
        import('@/lib/image-monitor').then(({ ensureValidImage, trackImageUsage }) => {
            try {
                // Garante que a imagem está válida
                const validImage = ensureValidImage(image);
                setProcessedImage(validImage);

                // Registra uso para monitoramento
                trackImageUsage('SanityImage', validImage, 'loading');
            } catch (err) {
                console.error('Erro ao processar imagem:', err);
                setProcessedImage(image);
            }
        }).catch(err => {
            console.error('Falha ao carregar utilitário de monitoramento:', err);
        });
    }, [image]);

    // Usar a função otimizada com fallback manual adicional
    const imageUrl = processedImage?.url ||
        processedImage?.imagemUrl ||
        (processedImage?.asset?.url) ||
        (processedImage?.asset?._ref ? getImageUrl(processedImage) : '');

    const hotspot = processedImage?.hotspot;

    // Calculate object position based on hotspot data
    const objectPosition = hotspot
        ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
        : '50% 50%';

    // Notify parent component when the image loads successfully
    useEffect(() => {
        if (loadState === 'success' && typeof onLoad === 'function') {
            onLoad();
        }
    }, [loadState, onLoad]);

    // Registra quando a imagem carrega ou falha 
    useEffect(() => {
        if (loadState !== 'loading') {
            import('@/lib/image-monitor').then(({ trackImageUsage }) => {
                trackImageUsage('SanityImage', processedImage, loadState);
            }).catch(() => { });
        }
    }, [loadState, processedImage]);

    // Fallback when there's no image or it fails to load
    if (!imageUrl || loadState === 'error') {
        if (process.env.NODE_ENV === 'development') {
            console.log("SanityImage: Fallback usado", {
                reason: !imageUrl ? 'URL de imagem não disponível' : 'Erro ao carregar imagem',
                loadState,
                imageUrl,
                hasImage: !!processedImage,
                hasAsset: !!processedImage?.asset,
                hasAssetRef: !!processedImage?.asset?._ref
            });
        }

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
                        <Home className="w-6 h-6 text-amber-500" />
                    </div>
                )}
                <p className="text-stone-500 text-sm font-medium px-4 text-center">
                    {processedImage?.alt || alt || 'Imóvel disponível'}
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
                alt={processedImage?.alt || alt || 'Imagem do imóvel'}
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