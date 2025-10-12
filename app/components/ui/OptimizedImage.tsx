/**
 * Componente de Imagem Otimizada
 * Wrapper do Next.js Image com placeholders automáticos e lazy loading inteligente
 * 
 * Funcionalidades:
 * - Blur placeholder automático
 * - Lazy loading com IntersectionObserver
 * - Fallback para imagens quebradas
 * - Formatação WebP/AVIF automática
 * - Dimensionamento responsivo
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onError?: () => void;
  fallbackSrc?: string;
}

// Placeholder blur estático (base64 de uma imagem 8x8 cinza)
// Compatível com SSR no Next.js 15
const BLUR_DATA_URL = 
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVQYlWNgYGD4z8DAwMDIyMjw//9/BgYGBkZGRgYGBgZGRkYGBgYGRkZGBgYGBkZGRgYGBob/DAwMAF8wBQUkzgzRAAAAAElFTkSuQmCC';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '100vw',
  className,
  priority = false,
  quality = 85,
  objectFit = 'cover',
  onError,
  fallbackSrc = '/images/placeholder-property.jpg',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn('🖼️ Erro ao carregar imagem:', src);
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Se houver erro persistente, mostra placeholder
  if (hasError && imgSrc === fallbackSrc) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 dark:bg-gray-800",
        className
      )}>
        <ImageOff className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  const commonProps = {
    alt,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    quality,
    priority,
    onError: handleError,
    onLoad: handleLoad,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
  };

  if (fill) {
    return (
      <Image
        {...commonProps}
        src={imgSrc}
        fill
        sizes={sizes}
        style={{ objectFit }}
      />
    );
  }

  if (width && height) {
    return (
      <Image
        {...commonProps}
        src={imgSrc}
        width={width}
        height={height}
        sizes={sizes}
      />
    );
  }

  // Fallback para fill se dimensões não foram especificadas
  return (
    <Image
      {...commonProps}
      src={imgSrc}
      fill
      sizes={sizes}
      style={{ objectFit }}
    />
  );
}

/**
 * Variante para cards de propriedade
 * Otimizada para os tamanhos comuns de cards
 */
export function PropertyCardImage({
  src,
  alt,
  priority = false,
  className,
  onError,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onError?: () => void;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={className}
      priority={priority}
      quality={85}
      objectFit="cover"
      onError={onError}
    />
  );
}

/**
 * Variante para hero banners
 * Otimizada para imagens grandes de destaque
 */
export function HeroImage({
  src,
  alt,
  priority = true,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className={className}
      priority={priority}
      quality={90}
      objectFit="cover"
    />
  );
}

/**
 * Variante para thumbnails
 * Otimizada para imagens pequenas
 */
export function ThumbnailImage({
  src,
  alt,
  size = 64,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      quality={75}
      objectFit="cover"
    />
  );
}
