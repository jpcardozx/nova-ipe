import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { generateLowQualityPlaceholder } from '@/lib/image-performance-optimizer';
import { cn } from '@/lib/utils';

export interface SanityImageProps {
  image: any; // Sanity image reference
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  eager?: boolean; // Para imagens acima da dobra
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
}

export type ClientImage = {
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt?: string;
};

/**
 * SanityImage - Componente otimizado para imagens do Sanity CMS
 * Implementa estratégias avançadas de carregamento para melhorar Web Vitals
 */
export default function SanityImage({
  image,
  alt = 'Imagem Nova Ipê',
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
  priority = false,
  className = '',
  quality = 85,
  objectFit = 'cover',
  eager = false,
  loading: loadingProp,
  onLoad,
  ...props
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  // Determina o modo de carregamento
  const loading = priority || eager ? 'eager' : loadingProp || 'lazy';

  // Gera placeholder SVG para evitar CLS
  const placeholderWidth = width || 400;
  const placeholderHeight = height || 300;
  const placeholder = generateLowQualityPlaceholder(placeholderWidth, placeholderHeight);

  // Extrai URL da imagem do Sanity
  const imageUrl = image?.url || (typeof image === 'string' ? image : '');

  // Define dimensões e proporção
  const imageWidth = width || image?.width || 800;
  const imageHeight = height || image?.height || 600;

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  if (!imageUrl) {
    return (
      <div
        className={`bg-neutral-200 animate-pulse ${className}`}
        style={{ width: width || '100%', height: height || 300 }}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      data-component="sanity-image"
    >
      <Image
        src={imageUrl}
        alt={alt || image?.alt || 'Imagem Nova Ipê'}
        width={imageWidth}
        height={imageHeight}
        loading={loading}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={cn(
          'transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain'
        )}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL={placeholder}
        {...props}
      />
    </div>
  );
}
