'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Tipo de imagem que corresponde ao formato retornado pela função toClientImage
type ClientImage = {
    imagemUrl?: string
    alt?: string
}

interface SanityImageProps {
    image: ClientImage | null | undefined
    alt?: string
    width?: number
    height?: number
    fill?: boolean
    sizes?: string
    className?: string
    priority?: boolean
}

/**
 * Componente para renderizar imagens do Sanity
 * Compatível com o formato { imagemUrl, alt } retornado por toClientImage
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
}: SanityImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    // Extrair a URL da imagem
    const imageUrl = image?.imagemUrl || null

    // Fallback quando não há imagem ou ocorre erro
    if (isError || !imageUrl) {
        return (
            <div
                className={cn(
                    "bg-stone-100 flex items-center justify-center text-stone-400 text-sm",
                    fill ? "w-full h-full" : "",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height
                }}
            >
                {alt || 'Imagem indisponível'}
            </div>
        )
    }

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={imageUrl}
                alt={image?.alt || alt || 'Imagem do imóvel'}
                width={fill ? undefined : width || 800}
                height={fill ? undefined : height || 600}
                fill={fill}
                sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
                className={cn(
                    "object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                priority={priority}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setIsError(true)}
            />

            {isLoading && (
                <div className="absolute inset-0 bg-stone-100 animate-pulse" />
            )}
        </div>
    )
}