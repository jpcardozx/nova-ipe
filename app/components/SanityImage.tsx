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
    const [isHovered, setIsHovered] = useState(false);    /**
     * Extrai a URL da imagem a partir de diferentes formatos possíveis
     * Função otimizada com cache e menor volume de logs
     */
    const getImageUrl = (img: ClientImage | null | undefined): string => {
        // Cache local para esta renderização (memoização)
        const cacheKey = JSON.stringify(img);
        const cachedResults = (window as any).__imageUrlCache = (window as any).__imageUrlCache || {};

        if (cachedResults[cacheKey]) {
            return cachedResults[cacheKey];
        }

        // Logger otimizado que só executa em ambiente de desenvolvimento
        const logDebug = (message: string, data?: any) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`SanityImage: ${message}`, data);
            }
        };

        // Informativo: versão resumida do diagnóstico
        logDebug("Processando imagem:", {
            hasImage: !!img,
            imageType: img ? typeof img : 'null/undefined',
            hasUrl: img?.url ? true : false,
            hasImagemUrl: img?.imagemUrl ? true : false,
            hasAsset: img?.asset ? true : false,
            hasRef: img?.asset?._ref ? true : false,
        });

        // Verificações para cada formato possível
        if (!img) {
            logDebug("Sem imagem fornecida");
            return '/placeholder.png';
        }

        // Direct URL on the image object (formato mais simples)
        if (img.url) {
            logDebug("Usando URL direta", img.url);
            cachedResults[cacheKey] = img.url;
            return img.url;
        }

        // For backward compatibility with imagemUrl naming (compatibilidade)
        if (img.imagemUrl) {
            logDebug("Usando imagemUrl", img.imagemUrl);
            cachedResults[cacheKey] = img.imagemUrl;
            return img.imagemUrl;
        }

        // Sanity asset with direct URL (objeto Sanity com URL direta)
        if (img.asset?.url) {
            logDebug("Usando asset.url", img.asset.url);
            cachedResults[cacheKey] = img.asset.url;
            return img.asset.url;
        }

        // Sanity reference that needs to be constructed (referência Sanity que precisa de construção)
        if (img.asset?._ref) {
            try {
                const refString = img.asset._ref;

                // Validação da string de referência
                if (!refString || typeof refString !== 'string') {
                    throw new Error('Referência inválida');
                }

                const refParts = refString.split('-');
                logDebug("Partes da referência", refParts);

                // Validação do ID do projeto
                const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
                const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

                // Estrutura para suportar múltiplos formatos de referência
                if (refParts[0] === 'image') {
                    const id = refParts[1];

                    if (!id) {
                        throw new Error('ID da imagem não encontrado na referência');
                    }

                    let url: string;

                    // Formato completo: image-abc123-800x600-jpg
                    if (refParts.length >= 4) {
                        const dimensions = refParts[2];
                        let extension = refParts[3];

                        // Limpar parâmetros da URL se existirem
                        if (extension && extension.includes('?')) {
                            extension = extension.split('?')[0];
                        }

                        url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                    }
                    // Formato simplificado: image-abc123-jpg (sem dimensões)
                    else if (refParts.length === 3) {
                        let extension = refParts[2];
                        if (extension && extension.includes('?')) {
                            extension = extension.split('?')[0];
                        }
                        url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
                    }
                    // Formato mínimo: tenta inferir jpg (alta compatibilidade)
                    else {
                        url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.jpg`;
                    }

                    logDebug("URL construída", url);
                    cachedResults[cacheKey] = url;
                    return url;
                }
            } catch (error) {
                console.error("Erro ao processar referência Sanity:", error);
            }
        }

        // Fallback para placeholder se nenhum formato for reconhecido
        logDebug("Não foi possível determinar a URL da imagem");
        cachedResults[cacheKey] = '/placeholder.png';
        return '/placeholder.png';
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
    }, [loadState, onLoad]);    // Fallback when there's no image or it fails to load
    if (!imageUrl || loadState === 'error') {
        console.log("SanityImage: Fallback usado", {
            reason: !imageUrl ? 'URL de imagem não disponível' : 'Erro ao carregar imagem',
            loadState,
            imageUrl,
            hasImage: !!image,
            hasAsset: !!image?.asset,
            hasAssetRef: !!image?.asset?._ref,
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        });

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
            >                {showPlaceholderIcon && (
                <div className="flex items-center justify-center p-3 mb-2 rounded-full bg-stone-100">
                    <Home className="w-6 h-6 text-amber-500" />
                </div>
            )}
                <p className="text-stone-500 text-sm font-medium px-4 text-center">
                    {image?.alt || alt || 'Imóvel disponível'}
                </p>
            </div>
        );
    } return (
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
            {/* Imagem principal */}            <Image
                src={imageUrl || '/placeholder.png'} /* Garantindo que src nunca seja null ou undefined */
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