"use client"

import React, { useState, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    Heart,
    Eye,
    ArrowRight,
    Star,
    Sparkles,
    Award,
    Clock,
    TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { novaIpeColors } from '@/app/utils/nova-ipe-gradients'

interface PropertyImage {
    url: string
    alt?: string
}

interface PremiumPropertyCardOptimizedProps {
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
    trend?: string
    className?: string
    variant?: 'default' | 'compact' | 'featured' | 'hero'
    onFavoriteToggle?: (id: string) => void
    isFavorited?: boolean
}

const PremiumPropertyCardOptimized = memo<PremiumPropertyCardOptimizedProps>(({
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
    trend,
    className,
    variant = 'default',
    onFavoriteToggle,
    isFavorited = false
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [imageLoaded, setImageLoaded] = useState(false)

    const displayImage = mainImage || images[0]
    const allImages = mainImage ? [mainImage, ...images] : images
    const hasMultipleImages = allImages.length > 1

    // Price formatting
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    }

    const imageVariants = {
        hidden: { scale: 1.1, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    // Handle image navigation
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
        }
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavoriteToggle) {
            onFavoriteToggle(id)
        }
    }    // Render badges - mais sutis e elegantes
    const renderBadges = () => {
        // Priorizar apenas um badge principal
        const primaryBadge = featured || exclusive || isPremium || isNew

        return (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 max-w-[60%]">
                {isNew && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50/95 border border-emerald-200/50 text-emerald-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Clock className="w-2.5 h-2.5" />
                        Novo
                    </motion.div>
                )}

                {featured && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50/95 border border-amber-200/50 text-amber-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Sparkles className="w-2.5 h-2.5" />
                        Destaque
                    </motion.div>
                )}

                {isPremium && !featured && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50/95 border border-blue-200/50 text-blue-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Star className="w-2.5 h-2.5" />
                        Premium
                    </motion.div>
                )}

                {exclusive && !featured && !isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50/95 border border-purple-200/50 text-purple-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Award className="w-2.5 h-2.5" />
                        Exclusivo
                    </motion.div>
                )}
            </div>
        )
    }    // Render action buttons - mais sutis e elegantes
    const renderActionButtons = () => (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            {onFavoriteToggle && (
                <motion.button
                    onClick={handleFavorite}
                    className={cn(
                        "p-2.5 rounded-lg backdrop-blur-sm border transition-all duration-300 shadow-sm hover:shadow-md",
                        isFavorited
                            ? "bg-red-50/95 text-red-600 border-red-200/50 hover:bg-red-100/95"
                            : "bg-white/90 hover:bg-white text-gray-600 border-gray-200/50 hover:text-red-500"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                </motion.button>
            )}

            <motion.button
                className="p-2.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visualização rápida"
            >
                <Eye className="w-4 h-4" />
            </motion.button>
        </div>
    )

    // Render property features
    const renderFeatures = () => (
        <div className="flex items-center gap-4 text-sm text-gray-600">
            {bedrooms !== undefined && (
                <div className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    <span className="font-medium">{bedrooms}</span>
                </div>
            )}

            {bathrooms !== undefined && (
                <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span className="font-medium">{bathrooms}</span>
                </div>
            )}

            {parkingSpots !== undefined && (
                <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span className="font-medium">{parkingSpots}</span>
                </div>
            )}

            {area && (
                <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    <span className="font-medium">{area}m²</span>
                </div>
            )}
        </div>
    )

    // Render image indicators
    const renderImageIndicators = () => {
        if (!hasMultipleImages) return null

        return (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                {allImages.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            currentImageIndex === index
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/60 hover:bg-white/80"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                        }}
                        aria-label={`Ver imagem ${index + 1}`}
                    />
                ))}
            </div>
        )
    }    // Get variant-specific classes
    const getVariantClasses = () => {
        switch (variant) {
            case 'compact':
                return {
                    container: "h-80",
                    image: "h-44",
                    content: "p-4"
                }
            case 'featured':
                return {
                    container: "h-[450px]",
                    image: "h-64",
                    content: "p-6"
                }
            case 'hero':
                return {
                    container: "h-[520px]",
                    image: "h-80",
                    content: "p-8"
                }
            default:
                return {
                    container: "h-[440px]",
                    image: "h-52",
                    content: "p-5"
                }
        }
    }

    const variantClasses = getVariantClasses()

    return (
        <motion.div
            className={cn(
                "group relative bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 flex flex-col",
                variantClasses.container,
                isHovered && "shadow-2xl border-amber-200/80 -translate-y-2 scale-[1.02]",
                "hover:shadow-2xl hover:border-amber-200/80 hover:-translate-y-2 hover:scale-[1.02]",
                className
            )}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
                boxShadow: isHovered
                    ? `0 30px 60px -12px rgba(0, 0, 0, 0.15), 0 0 40px -5px ${novaIpeColors.primary.ipe}15`
                    : `0 8px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)`
            }}
        >
            <Link href={`/imovel/${id}`} className="flex-1 flex flex-col">
                {/* Image Container */}
                <div className={cn("relative overflow-hidden", variantClasses.image)}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="relative w-full h-full"
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <Image
                                src={allImages[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
                                alt={allImages[currentImageIndex]?.alt || title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={90}
                                priority={featured}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        variants={overlayVariants}
                        animate={isHovered ? "visible" : "hidden"}
                    />

                    {/* Image navigation button */}
                    {hasMultipleImages && (
                        <button
                            onClick={nextImage}
                            className="absolute inset-0 w-full h-full bg-transparent z-10"
                            aria-label="Próxima imagem"
                        />
                    )}

                    {renderBadges()}
                    {renderActionButtons()}
                    {renderImageIndicators()}

                    {/* Type badge */}
                    <div className="absolute bottom-4 right-4 z-20">
                        <span className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg",
                            type === 'sale'
                                ? "bg-emerald-500/90 text-white border-emerald-400/30"
                                : "bg-blue-500/90 text-white border-blue-400/30"
                        )}>
                            {type === 'sale' ? 'VENDA' : 'ALUGUEL'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className={cn("flex-1 flex flex-col", variantClasses.content)}>
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">
                            {location || address}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Features */}
                    <div className="mb-4">
                        {renderFeatures()}
                    </div>

                    {/* Price and trend */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-2xl font-bold text-gray-900">
                                {formattedPrice}
                            </div>
                            {trend && (
                                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    {trend}
                                </div>
                            )}
                        </div>

                        {/* Call to action */}
                        <motion.div
                            className="flex items-center justify-between text-amber-700 font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 10
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-sm">Ver detalhes</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
})

PremiumPropertyCardOptimized.displayName = 'PremiumPropertyCardOptimized'

export default PremiumPropertyCardOptimized
