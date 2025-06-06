'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/optimized-sanity-image';
import type { ClientImage } from '@/app/components/SanityImage';
import { cn } from '@/lib/utils';

interface DiagnosticImageProps {
    image: ClientImage | null | undefined;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    sizes?: string;
}

export function DiagnosticImage({
    image,
    alt = '',
    width,
    height,
    fill = false,
    className,
    sizes,
}: DiagnosticImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [showDebug, setShowDebug] = useState(false);    // Verificação inicial dos dados da imagem
    const hasImage = !!image;
    const hasAsset = hasImage && typeof image !== 'string' && !!image?.asset;
    const hasAssetRef = hasAsset && !!image?.asset?._ref;
    const hasUrl = hasImage && typeof image !== 'string' && (!!image?.url || !!image?.imagemUrl);
    const assetUrl = hasAsset && typeof image !== 'string' ? image?.asset?.url : undefined;

    // Estratégia final para obter URL da imagem
    let imageUrl;
    let urlSource = ''; try {
        if (hasUrl && typeof image !== 'string') {
            imageUrl = image?.url || image?.imagemUrl;
            urlSource = 'direct';
        } else if (assetUrl) {
            imageUrl = assetUrl;
            urlSource = 'asset';
        } else if (hasAssetRef) {
            imageUrl = getImageUrl(image);
            urlSource = 'ref';
        } else {
            imageUrl = '/images/property-placeholder.jpg';
            urlSource = 'fallback';
        }
    } catch (error) {
        console.error('Erro ao processar URL da imagem:', error);
        imageUrl = '/images/property-placeholder.jpg';
        urlSource = 'error';
    }

    // Para log e depuração
    useEffect(() => {
        if (!image) {
            console.warn('DiagnosticImage: imagem não fornecida');
            return;
        }
        console.log('DiagnosticImage: Detalhes da imagem', {
            hasImage,
            hasAsset,
            hasAssetRef,
            hasUrl,
            imageProps: typeof image === 'object' && image ? Object.keys(image) : [],
            assetProps: hasAsset && image.asset ? Object.keys(image.asset) : [],
            url: imageUrl,
            urlSource
        });
    }, [image]);

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative overflow-hidden",
                    hasError ? "bg-gray-200" : "",
                    !isLoaded ? "bg-gray-100" : "",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={alt || (image?.alt || 'Imagem')}
                        fill={fill}
                        width={!fill ? width : undefined}
                        height={!fill ? height : undefined}
                        sizes={sizes}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => {
                            console.error(`Erro ao carregar imagem: ${imageUrl}`);
                            setHasError(true);
                        }}
                        className={cn(
                            "object-cover transition-opacity",
                            !isLoaded ? "opacity-0" : "opacity-100"
                        )}
                        priority
                    />
                )}

                {/* Camada de erro ou carregamento */}
                {(hasError || !isLoaded) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                        {hasError ? (
                            <div className="text-center p-2">
                                <div className="text-red-500 font-bold">Erro ao carregar imagem</div>
                                <div className="text-xs text-gray-500">URL: {imageUrl?.substring(0, 30)}...</div>
                            </div>
                        ) : (
                            <div className="animate-pulse bg-gray-300 w-full h-full" />
                        )}
                    </div>
                )}

                {/* Botão de diagnóstico */}
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="absolute bottom-1 right-1 p-1 bg-black/50 text-white rounded text-xs"
                    title="Mostrar diagnóstico"
                >
                    {showDebug ? 'x' : '?'}
                </button>

                {/* Overlay de diagnóstico */}
                {showDebug && (
                    <div className="absolute inset-0 bg-black/80 text-white p-2 text-xs overflow-auto font-mono">
                        <strong>Diagnóstico:</strong>
                        <ul className="mt-1 space-y-1">
                            <li>Tipo: {typeof image}</li>
                            <li>Tem URL: {hasUrl ? 'Sim' : 'Não'}</li>
                            <li>Tem asset: {hasAsset ? 'Sim' : 'Não'}</li>
                            <li>Tem asset._ref: {hasAssetRef ? 'Sim' : 'Não'}</li>
                            <li>Origem URL: {urlSource}</li>
                            <li>Status: {hasError ? '❌ Erro' : isLoaded ? '✅ OK' : '⌛ Carregando'}</li>
                            <li className="truncate">URL: {imageUrl}</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
