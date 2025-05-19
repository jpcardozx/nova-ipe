'use client';

/**
 * Componente de Imagem Super Otimizado
 * 
 * Este componente resolve problemas comuns de performance com imagens:
 * 1. Layout shifts durante o carregamento 
 * 2. Impacto no LCP (Largest Contentful Paint)
 * 3. Carregamento excessivo de recursos
 * 
 * Inclui:
 * - Estratégia de carregamento LQIP (Low Quality Image Placeholders)
 * - Carregamento progressivo
 * - Tratamento adequado de erros
 * - Carregamento prioritário para imagens above-the-fold
 */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SuperOptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    quality?: number;
    className?: string;
    imgClassName?: string;
    placeholderColor?: string;
    onLoad?: () => void;
    blurDataUrl?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * SuperOptimizedImage - Componente de imagem ultra performático
 */
export default function SuperOptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    priority = false,
    quality = 75,
    className = '',
    imgClassName = '',
    placeholderColor = '#f3f4f6',
    onLoad,
    blurDataUrl,
    objectFit = 'cover'
}: SuperOptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isVisible, setIsVisible] = useState(priority);
    const imageRef = useRef<HTMLDivElement>(null);

    // Preconnect para o domínio da imagem para reduzir o tempo de conexão
    useEffect(() => {
        if (typeof window === 'undefined' || !src) return;

        try {
            if (!src.startsWith('data:') && !src.startsWith('/')) {
                const domain = new URL(src).origin;

                if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = domain;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            }
        } catch (error) {
            // Ignora erros de parsing de URL
        }

        // Configurar Intersection Observer para carregamento preguiçoso
        if (!priority && !isVisible) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                },
                {
                    rootMargin: '200px 0px', // Carrega 200px antes da imagem aparecer
                    threshold: 0.01
                }
            );

            if (imageRef.current) {
                observer.observe(imageRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }
    }, [src, isVisible, priority]);

    // Função para lidar com o carregamento da imagem
    const handleImageLoaded = () => {
        setIsLoading(false);

        // Relatar métricas de performance para imagens prioritárias
        if (priority && typeof window !== 'undefined' && 'performance' in window) {
            const loadTime = performance.now();

            // Registra se a imagem é potencialmente um LCP
            if (width && height && width * height > 50000) { // Imagens grandes são candidatas a LCP
                console.info(`[Performance] Imagem grande carregada em ${Math.round(loadTime)}ms:`, {
                    src: src.substring(0, 80) + '...',
                    size: `${width}x${height}`
                });
            }
        }

        if (onLoad) onLoad();
    };

    // Função para lidar com erros de carregamento
    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Estado de erro
    if (hasError) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-slate-100 overflow-hidden rounded",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <div className="flex flex-col items-center justify-center p-2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Imagem não disponível</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={imageRef}
            className={cn(
                "relative overflow-hidden bg-gradient-to-tr from-slate-100 to-slate-50",
                className
            )}
            style={{
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
                background: isLoading ? placeholderColor : undefined,
            }}
        >
            {/* A imagem só é renderizada quando entra na viewport (ou é prioritária) */}
            {(isVisible || priority) && (
                <Image
                    src={src}
                    alt={alt}
                    width={fill ? undefined : width}
                    height={fill ? undefined : height}
                    fill={fill}
                    sizes={sizes}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    quality={quality}
                    onLoad={handleImageLoaded}
                    onError={handleError}
                    className={cn(
                        imgClassName,
                        "transition-opacity duration-500",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    placeholder={blurDataUrl ? "blur" : undefined}
                    blurDataURL={blurDataUrl}
                    style={{
                        objectFit
                    }}
                />
            )}

            {/* Indicador de carregamento animado */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{ backgroundSize: '200% 100%' }}
                />
            )}
        </div>
    );
}
