'use client';

import { useState, useCallback, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';

interface PerformantImageProps extends Omit<React.ComponentProps<typeof Image>, 'onError' | 'onLoad'> {
  fallbackSrc?: string;
  showFallback?: boolean;
  eager?: boolean;
}

const PerformantImage = memo(function PerformantImage({
  src,
  alt,
  fallbackSrc,
  showFallback = true,
  eager = false,
  className,
  ...props
}: PerformantImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (hasError && showFallback) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        {fallbackSrc ? (
          <Image
            src={fallbackSrc}
            alt={alt}
            {...props}
            onError={() => {}}
            className={className}
          />
        ) : (
          <ImageOff className="w-8 h-8" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse bg-gray-200 ${className}`} />
      )}
      <Image
        src={src}
        alt={alt}
        {...props}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={eager}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKrSdZKm3ix8sQ1xE5zqyLLDOLdqT2Cvy0IG"
      />
    </div>
  );
});

export default PerformantImage;