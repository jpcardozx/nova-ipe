"use client"

import React, { useState, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, BedDouble, Bath, Car, Ruler, Heart, Eye,
    ArrowRight, Star, Clock, TrendingUp, Play, Pause,
    ChevronLeft, ChevronRight, Share2, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyImage {
    url: string
    alt?: string
}

interface ModernPropertyCardV2Props {
    id: string
    title: string
    price: number
    address: string
    location?: string
    images: PropertyImage[]
    mainImage?: PropertyImage
    bedrooms?: number
    bathrooms?: number
    area?: number
    parkingSpots?: number
    type?: 'sale' | 'rent'
    tags?: string[]
    featured?: boolean
    isNew?: boolean
    isPremium?: boolean
    exclusive?: boolean
    className?: string
    variant?: 'default' | 'compact' | 'featured' | 'hero'
    onFavoriteToggle?: (id: string) => void
    isFavorited?: boolean
}

const ModernPropertyCardV2 = memo<ModernPropertyCardV2Props>(({
    id,
    title,
    price,
    address,
    location,
    images = [],
    mainImage,
    bedrooms,
    bathrooms,
    area,
    parkingSpots,
    type = 'sale',
    tags = [],
    featured = false,
    isNew = false,
    isPremium = false,
    exclusive = false,
    className,
    variant = 'default',
    onFavoriteToggle,
    isFavorited = false
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isAutoPlaying, setIsAutoPlaying] = useState(false)

    const displayImage = mainImage || images[0]
    const allImages = mainImage ? [mainImage, ...images] : images
    const hasMultipleImages = allImages.length > 1

    // Formatação de preço aprimorada
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)

    // Preço por m² se área disponível
    const pricePerSqm = area ?
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price / area) : null

    // Navegação de imagens
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
        }
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
        }
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavoriteToggle) {
            onFavoriteToggle(id)
        }
    }

    // Auto-play toggle
    const toggleAutoPlay = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAutoPlaying(!isAutoPlaying)
    }

    // Badge inteligente - mostra apenas o mais importante
    const renderPrimaryBadge = () => {
        if (exclusive) {
            return (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    EXCLUSIVO
                </div>
            )
        }
        if (featured) {
            return (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    DESTAQUE
                </div>
            )
        }
        if (isNew) {
            return (
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    NOVO
                </div>
            )
        }
        if (isPremium) {
            return (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    PREMIUM
                </div>
            )
        }
        return null
    }

    // Variantes de tamanho
    const cardSizes = {
        compact: "h-72",
        default: "h-96",
        featured: "h-[28rem]",
        hero: "h-[32rem]"
    }

    const imageSizes = {
        compact: "h-48",
        default: "h-60",
        featured: "h-72",
        hero: "h-80"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500",
                "border border-gray-100 hover:border-gray-200",
                cardSizes[variant],
                className
            )}
        >
            {/* Container da Imagem */}
            <div className={cn("relative overflow-hidden", imageSizes[variant])}>
                <Link href={`/imoveis/${id}`} className="block h-full">
                    <Image
                        src={allImages[currentImageIndex]?.url || '/placeholder-property.jpg'}
                        alt={allImages[currentImageIndex]?.alt || title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onLoad={() => setImageLoaded(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={featured}
                    />
                </Link>

                {/* Overlay gradiente para melhor legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20">
                    {renderPrimaryBadge()}
                </div>

                {/* Indicador de tipo (Venda/Aluguel) */}
                <div className="absolute top-4 right-4 z-20">
                    <div className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm",
                        type === 'sale'
                            ? "bg-green-500/90 text-white"
                            : "bg-blue-500/90 text-white"
                    )}>
                        {type === 'sale' ? 'VENDA' : 'ALUGUEL'}
                    </div>
                </div>

                {/* Controles de Imagem - só aparecem no hover */}
                <AnimatePresence>
                    {isHovered && hasMultipleImages && (
                        <>
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={prevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>

                {/* Indicador de múltiplas imagens */}
                {hasMultipleImages && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                        {allImages.slice(0, 5).map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    index === currentImageIndex
                                        ? "bg-white"
                                        : "bg-white/50"
                                )}
                            />
                        ))}
                        {allImages.length > 5 && (
                            <div className="text-white text-xs ml-1">
                                +{allImages.length - 5}
                            </div>
                        )}
                    </div>
                )}

                {/* Ações no hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 right-4 flex gap-2 z-30"
                        >
                            <button
                                onClick={handleFavorite}
                                className={cn(
                                    "p-2 rounded-full shadow-lg transition-colors backdrop-blur-sm",
                                    isFavorited
                                        ? "bg-red-500 text-white"
                                        : "bg-white/80 hover:bg-white text-gray-700"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                            </button>

                            <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-lg transition-colors backdrop-blur-sm">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Informações do Imóvel */}
            <div className="p-5 space-y-4">
                {/* Preço principal */}
                <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-900">
                        {formattedPrice}
                    </div>
                    {pricePerSqm && (
                        <div className="text-sm text-gray-500">
                            {pricePerSqm}/m²
                        </div>
                    )}
                </div>

                {/* Título e localização */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{address}</span>
                    </div>
                </div>

                {/* Características principais */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {bedrooms && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <BedDouble className="w-4 h-4 mr-1" />
                            <span>{bedrooms}</span>
                        </div>
                    )}

                    {bathrooms && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{bathrooms}</span>
                        </div>
                    )}

                    {area && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <Ruler className="w-4 h-4 mr-1" />
                            <span>{area}m²</span>
                        </div>
                    )}

                    {parkingSpots && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <Car className="w-4 h-4 mr-1" />
                            <span>{parkingSpots}</span>
                        </div>
                    )}
                </div>

                {/* Botão de ação */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        href={`/imoveis/${id}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 px-4 rounded-xl font-medium transition-all duration-200 group/btn"
                    >
                        Ver Detalhes
                        <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
})

ModernPropertyCardV2.displayName = 'ModernPropertyCardV2'

export default ModernPropertyCardV2
