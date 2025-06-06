'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPropertyPlaceholder } from '../../lib/image-placeholder';
import { logImageError } from '../../lib/image-logger';

interface PropertyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    title?: string;
    propertyId?: string;
    fill?: boolean;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    quality?: number;
    unoptimized?: boolean;
    sizes?: string;
}

/**
 * Componente otimizado para exibição de imagens de imóveis com tratamento robusto de erros
 * Versão atualizada: Maio 2025
 * 
 * Características:
 * - Placeholder visual gerado dinamicamente baseado no título
 * - Tratamento elegante de erros de carregamento
 * - Suporte a priorização de imagens (LCP)
 * - Estado de carregamento visual
 * - Logging detalhado para diagnóstico
 * - Suporte para blurDataUrl e efeitos de loading
 */
export default function PropertyImage({
    src,
    alt,
    width = 640,
    height = 480,
    className = '',
    priority = false,
    title,
    propertyId,
    fill = false,
    objectFit = 'cover',
    quality = 85,
    unoptimized = false,
    sizes
}: PropertyImageProps) {
    // Estados
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Gera um placeholder SVG dinâmico com base no título do imóvel
    const placeholderSrc = createPropertyPlaceholder(
        title || alt || 'Imóvel em Guararema',
        `${width}:${height}`
    );

    // Limita número de tentativas de carregamento
    const maxRetryCount = 2;

    // Verifica se a URL é válida e acessível
    useEffect(() => {
        // Reset estados quando a URL muda
        setIsLoading(true);
        setHasError(false);

        // Verifica se a URL é válida
        if (!src || src === 'undefined' || src === 'null') {
            setHasError(true);
            setIsLoading(false);

            logImageError('URL inválida detectada', {
                url: src,
                propertyId,
                details: { reason: 'URL inválida ou vazia' }
            });
        }

        // Pré-valida URLs do Sanity para garantir que são válidas
        // Evita erros comuns como referências malformadas
        if (src && src.includes('cdn.sanity.io') && !src.includes('.jpg') && !src.includes('.png') && !src.includes('.webp')) {
            setHasError(true);
            setIsLoading(false);

            logImageError('URL Sanity malformada', {
                url: src,
                propertyId,
                details: { reason: 'URL Sanity não contém extensão de arquivo válida' }
            });
        }
    }, [src, propertyId]);

    // Combinação de classes condicionais para efeitos visuais
    const imageClasses = `
        transition-all duration-300
        ${isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}
        ${fill ? 'object-' + objectFit : ''}
        ${className}
    `;

    // Função de retry com limite de tentativas
    const handleRetry = () => {
        if (retryCount < maxRetryCount) {
            setRetryCount(prev => prev + 1);
            setIsLoading(true);
            setHasError(false);
        }
    };

    return (
        <div className="relative overflow-hidden w-full h-full group">
            {/* Imagem principal com fallback para placeholder */}            <Image
                src={hasError ? placeholderSrc : src}
                alt={alt}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                fill={fill}
                className={imageClasses}
                priority={priority}
                quality={quality}
                unoptimized={unoptimized}
                sizes={fill ? sizes : undefined} onLoadStart={() => setIsLoading(true)}
                onLoadingComplete={() => setIsLoading(false)}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    setHasError(true);
                    setIsLoading(false);

                    logImageError('Falha ao carregar imagem', {
                        url: src,
                        propertyId,
                        error: e,
                        details: { attempt: retryCount + 1 }
                    });
                }}
                placeholder={!hasError ? 'blur' : undefined}
                blurDataURL={placeholderSrc}
            />

            {/* Efeito de carregamento */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}

            {/* Botão de retry visível apenas quando hover em caso de erro */}
            {hasError && retryCount < maxRetryCount && (
                <button
                    onClick={handleRetry}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                    aria-label="Tentar carregar imagem novamente"
                >
                    <div className="bg-white/90 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    );
}
