'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';
import { getImageUrl } from '@/lib/optimized-sanity-image';

// Unified image type that supports multiple formats
export interface ClientImage {
  _type?: string;
  imagemUrl?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  hotspot?: {
    x: number;
    y: number;
  };
  asset?: {
    _ref?: string;
    url?: string;
    _type?: string;
  };
  blurDataUrl?: string;
}

export interface SanityImageProps {
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
  objectFit?: 'cover' | 'contain' | 'fill';
  eager?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
}

/**
 * Componente consolidado para renderizar imagens, com suporte a múltiplos formatos: * - Formatos Sanity { url, imagemUrl, asset }
 * - Imagens convencionais
 * - Tratamento de erros e carregamento
 * - Animações e efeitos visuais
 * - Otimizações de performance
 */
function SanityImage({
  image,
  alt = '',
  width,
  height,
  fill = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
  className = '',
  priority = false,
  aspectRatio,
  quality = 85,
  onLoad,
  showPlaceholderIcon = true,
  objectFit = 'cover',
  eager = false,
  loading: loadingProp,
  placeholder = 'blur',
  ...props
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Determina o modo de carregamento
  const loading = priority || eager ? 'eager' : loadingProp || 'lazy';

  // Extrai a URL da imagem de diferentes formatos
  useEffect(() => {
    if (!image) {
      setHasError(true);
      return;
    }

    let resolvedUrl = '';

    // Tenta diferentes formatos de URL
    if (image.url) {
      resolvedUrl = image.url;
    } else if (image.imagemUrl) {
      resolvedUrl = image.imagemUrl;
    } else if (image.asset?.url) {
      resolvedUrl = image.asset.url;
    } else if (image.asset?._ref) {
      // Usa função utilitária para gerar URL do Sanity
      try {
        resolvedUrl = getImageUrl(image);
      } catch (error) {
        console.warn('Erro ao gerar URL da imagem Sanity:', error);
        setHasError(true);
        return;
      }
    }

    if (resolvedUrl) {
      setImageSrc(resolvedUrl);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [image]);

  // Handler para quando a imagem carrega com sucesso
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
  };

  // Handler para erros de carregamento
  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Determina as dimensões
  const imageDimensions = {
    width: width || image?.width || undefined,
    height: height || image?.height || undefined,
  };

  // Se não há imagem ou erro, mostra placeholder
  if (!image || hasError || !imageSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          fill ? 'absolute inset-0' : 'relative',
          className
        )}
        style={{
          width: fill ? undefined : imageDimensions.width,
          height: fill ? undefined : imageDimensions.height,
          aspectRatio: aspectRatio || (imageDimensions.width && imageDimensions.height
            ? `${imageDimensions.width}/${imageDimensions.height}`
            : undefined),
        }}
      >
        {showPlaceholderIcon && (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <ImageOff className="w-8 h-8" />
            <span className="text-sm">Imagem não disponível</span>
          </div>
        )}
      </div>
    );
  }

  // Props comuns para o componente Image
  const imageProps = {
    src: imageSrc,
    alt: alt || image.alt || 'Imagem Nova Ipê',
    quality,
    loading,
    priority,
    sizes: fill ? sizes : undefined,
    onLoad: handleLoad,
    onError: handleError,
    placeholder: image.blurDataUrl && placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: image.blurDataUrl,
    className: cn(
      'transition-opacity duration-300',
      !isLoaded && 'opacity-0',
      isLoaded && 'opacity-100',
      className
    ),
    style: {
      objectFit: objectFit,
    },
    ...props,
  };

  // Renderiza com fill
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>
    );
  }

  // Renderiza com dimensões específicas
  return (
    <div
      className="relative"
      style={{
        width: imageDimensions.width,
        height: imageDimensions.height,
        aspectRatio: aspectRatio || (imageDimensions.width && imageDimensions.height
          ? `${imageDimensions.width}/${imageDimensions.height}`
          : undefined),
      }}
    >
      <Image
        {...imageProps}
        width={imageDimensions.width}
        height={imageDimensions.height}
      />      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-md" />
      )}
    </div>
  );
}

// Default export
export default SanityImage;

// Tipo export para compatibilidade
export type { ClientImage as SanityImageType };
