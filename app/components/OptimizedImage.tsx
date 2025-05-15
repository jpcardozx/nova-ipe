'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import { getImageUrl, ImageType } from '@/lib/optimized-sanity-image';

// Usamos o tipo ImageType da nossa lib para garantir consistência
// entre todos os componentes que trabalham com imagens

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
    const [hasError, setHasError] = useState(false);    // Utilizamos a função otimizada de @/lib/optimized-sanity-image
    // que já trata todos os casos possíveis e tem cache implementado

    // Extrair URL e informações de posicionamento
    const imageUrl = getImageUrl(src);
    const hotspot = typeof src !== 'string' ? src?.hotspot : undefined;
    const altText = typeof src !== 'string' ? src?.alt || alt : alt;
    const objectPosition = hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : '50% 50%';

    // Notificar o carregamento bem-sucedido
    useEffect(() => {
        if (!isLoading && !hasError && onLoad) {
            onLoad();
        }
    }, [isLoading, hasError, onLoad]);

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
    }

    // Renderizar a imagem com tratamento de erro
    return (
        <div
            className={cn(
                "relative overflow-hidden",
                isLoading ? "bg-slate-100 animate-pulse" : "",
                className
            )}
            style={{
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
                position: fill ? 'relative' : undefined,
            }}
        >
            <Image
                src={imageUrl}
                alt={altText || 'Imagem'}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    imgClassName
                )}
                style={{ objectFit: 'cover', objectPosition }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent skeleton-loading" />
            )}
        </div>
    );
}
