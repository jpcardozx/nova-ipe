'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  sizes?: string
  quality?: number
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  fill = false,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Imagem LazyImage carregada: ${src.slice(-50)}`)
    }
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🖼️ Erro ao carregar imagem LazyImage: ${src}`)
    }
    onError?.()
  }

  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli6Hp5QNLT+wGtNtjUsOqVhHq7wt3y8+5tI2F7/vEhZH1/FnY+b3sY/gysIwKgk+e6Jnl5E2gFy7ePi2vhT4jBx6v+/FJ6Hn3Eg"

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {!isInView && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse'
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}
      
      {isInView && !isError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            fill ? 'object-cover' : ''
          )}
          {...props}
        />
      )}

      {isError && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 flex items-center justify-center',
          'text-gray-500 text-sm'
        )}>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-400 rounded" />
            <span>Imagem não encontrada</span>
          </div>
        </div>
      )}
    </div>
  )
}