'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, BedDouble, Bath, Car, Ruler, Heart, Eye, ArrowRight,
    Star, Sparkles, Award, TrendingUp, Phone, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobilePropertyCardProps {
    id: string
    title: string
    price: number
    address?: string
    location?: string
    images?: Array<{ url: string; alt?: string }>
    mainImage?: { url: string; alt?: string }
    bedrooms?: number
    bathrooms?: number
    area?: number
    parkingSpots?: number
    type?: 'sale' | 'rent'
    featured?: boolean
    isNew?: boolean
    isPremium?: boolean
    exclusive?: boolean
    trend?: string
    className?: string
    onFavoriteToggle?: (id: string) => void
    isFavorited?: boolean
}

export default function MobilePropertyCard({
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
    featured = false,
    isNew = false,
    isPremium = false,
    exclusive = false,
    trend,
    className,
    onFavoriteToggle,
    isFavorited = false
}: MobilePropertyCardProps) {
    const [isPressed, setIsPressed] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchEndX, setTouchEndX] = useState(0)

    const displayImage = mainImage || images[0]
    const allImages = mainImage ? [mainImage, ...images] : images
    const hasMultipleImages = allImages.length > 1

    // Format price for Brazilian currency
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)

    // Handle swipe gestures for image navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!hasMultipleImages) return

        const swipeThreshold = 50
        const swipeDistance = touchStartX - touchEndX

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next image
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
            } else {
                // Swipe right - previous image
                setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
            }
        }
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavoriteToggle) {
            onFavoriteToggle(id)
        }
    }

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const message = `Olá! Tenho interesse no imóvel: ${title}. Podemos conversar?`
        window.open(`https://wa.me/5511981845016?text=${encodeURIComponent(message)}`, '_blank')
    }

    const handleCall = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        window.open('tel:+5521990051961', '_self')
    }

    return (
        <motion.div
            className={cn(
                "relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300",
                "active:scale-[0.98] transform-gpu",
                className
            )}
            onTapStart={() => setIsPressed(true)}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={`/imovel/${id}`} className="block">
                {/* Image Container with Touch Navigation */}
                <div
                    className="relative h-56 overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0.8, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0.8, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={allImages[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
                                alt={allImages[currentImageIndex]?.alt || title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={featured}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                        {isNew && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-medium backdrop-blur-sm">
                                <Sparkles className="w-3 h-3" />
                                Novo
                            </span>
                        )}
                        {featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm">
                                <Star className="w-3 h-3" />
                                Destaque
                            </span>
                        )}
                        {isPremium && !featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/90 text-white text-xs font-medium backdrop-blur-sm">
                                <Award className="w-3 h-3" />
                                Premium
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {onFavoriteToggle && (
                            <motion.button
                                onClick={handleFavorite}
                                className={cn(
                                    "w-10 h-10 rounded-full backdrop-blur-sm border transition-all duration-300 flex items-center justify-center",
                                    isFavorited
                                        ? "bg-red-500/90 text-white border-red-400/50"
                                        : "bg-white/90 hover:bg-white text-gray-600 border-white/50 hover:text-red-500"
                                )}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                            </motion.button>
                        )}

                        <motion.button
                            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 backdrop-blur-sm border border-white/50 transition-all duration-300 flex items-center justify-center"
                            whileTap={{ scale: 0.9 }}
                        >
                            <Eye className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-3 right-3">
                        <span className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border text-white",
                            type === 'sale'
                                ? "bg-emerald-500/90 border-emerald-400/50"
                                : "bg-blue-500/90 border-blue-400/50"
                        )}>
                            {type === 'sale' ? 'Venda' : 'Locação'}
                        </span>
                    </div>

                    {/* Image Indicators */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {allImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        index === currentImageIndex
                                            ? "bg-white scale-125"
                                            : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Title and Location */}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{location || address}</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                        {bedrooms !== undefined && (
                            <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                <span>{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms !== undefined && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{bathrooms}</span>
                            </div>
                        )}
                        {area && (
                            <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span>{area}m²</span>
                            </div>
                        )}
                        {parkingSpots !== undefined && parkingSpots > 0 && (
                            <div className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                <span>{parkingSpots}</span>
                            </div>
                        )}
                    </div>

                    {/* Price and Trend */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-gray-900">
                                {formattedPrice}
                            </div>
                            {type === 'rent' && (
                                <span className="text-sm text-gray-500">/mês</span>
                            )}
                        </div>
                        {trend && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Mobile Action Bar */}
            <div className="px-5 pb-5">
                <div className="flex gap-2">
                    <motion.button
                        onClick={handleCall}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        Ligar
                    </motion.button>
                    <motion.button
                        onClick={handleWhatsApp}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

