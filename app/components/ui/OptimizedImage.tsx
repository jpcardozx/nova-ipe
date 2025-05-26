import React, { useState } from 'react';
'use client';

import Image from 'next/image';
interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    fill?: boolean;
    fallbackSrc?: string;
    blurDataURL?: string;
    onError?: () => void;
    onLoad?: () => void;
}

/**
 * Componente de imagem otimizada com fallback e blur placeholder
 * Wrapper sobre next/image com tratamento de erro e carregamento
 */
export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 85,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    fill = false,
    fallbackSrc = '/images/property-placeholder.jpg',
    blurDataURL,
    onError,
    onLoad
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
        onError?.();
    };

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    // Gerar blur placeholder simples se não fornecido
    const defaultBlurDataURL = blurDataURL ||
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

    const imageProps = {
        src: imageSrc,
        alt,
        className: `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`,
        quality,
        priority,
        sizes,
        onError: handleError,
        onLoad: handleLoad,
        placeholder: 'blur' as const,
        blurDataURL: defaultBlurDataURL,
        ...(fill ? { fill: true } : { width, height })
    };

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} overflow-hidden`}>
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                </div>
            )}

            {/* Error state */}
            {hasError && imageSrc === fallbackSrc && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Imagem não disponível</span>
                    </div>
                </div>
            )}

            <Image {...imageProps} />
        </div>
    );
}

// Hook para pré-carregar imagens críticas
export function useImagePreload(urls: string[]) {
    useState(() => {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    });
}

// Utilidade para gerar blur placeholder
export function generateBlurPlaceholder(width: number = 8, height: number = 8): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Criar gradiente simples
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f1f5f9');
    gradient.addColorStop(1, '#e2e8f0');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.1);
}
