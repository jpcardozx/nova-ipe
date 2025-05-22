'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface para props
interface HighPerformanceImageProps {
    src: string | null | undefined;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    className?: string;
    loading?: 'eager' | 'lazy';
    quality?: number;
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * HighPerformanceImage - Componente otimizado para renderização eficiente
 * 
 * Implementa:
 * - Carregamento otimizado para LCP
 * - Tratamento correto de erros
 * - Prevenção de layout shifts
 * - Placeholders durante carregamento
 */
export default function HighPerformanceImage({
    src,
    alt = '',
    width,
    height,
    fill = false,
    sizes = '100vw',
    priority = false,
    className = '',
    loading,
    quality = 80,
    onLoad,
    onError
}: HighPerformanceImageProps) {
    // Estados mínimos necessários
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Handlers otimizados
    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
        onError?.();
    }, [onError]);

    // Classes com memorização
    const rootClassName = useMemo(() =>
        cn(
            'relative overflow-hidden',
            !isLoaded && 'bg-gray-100',
            hasError && 'bg-gray-200',
            className
        ),
        [isLoaded, hasError, className]
    );

    // Nenhum src fornecido - mostrar placeholder
    if (!src) {
        return (
            <div
                className={rootClassName}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                    aspectRatio: !fill && width && height ? `${width}/${height}` : undefined
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={rootClassName}
            style={{
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
                aspectRatio: !fill && width && height ? `${width}/${height}` : undefined
            }}
        >
            {/* Imagem principal */}
            {!hasError ? (
                <Image
                    src={src}
                    alt={alt}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    fill={fill}
                    sizes={sizes}
                    quality={quality}
                    priority={priority}
                    loading={loading || (priority ? 'eager' : 'lazy')}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-gray-400" />
                </div>
            )}
        </div>
    );
}
