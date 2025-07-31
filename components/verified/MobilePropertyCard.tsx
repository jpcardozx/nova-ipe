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
        window.open('tel:+5511981845016', '_self')
    }

    return (
        <motion.div
            className={cn(
                "relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100/50 transition-all duration-300 group",
                "hover:shadow-2xl hover:shadow-gray-900/10 hover:-translate-y-1 transform-gpu",
                "active:scale-[0.98]",
                className
            )}
            onTapStart={() => setIsPressed(true)}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
        >
            <Link href={`/imovel/${id}`} className="block">
                {/* Image Container with Touch Navigation */}
                <div
                    className="relative h-56 overflow-hidden group-hover:scale-105 transition-transform duration-500"
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

                    {/* Enhanced gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />

                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[70%]">
                        {isNew && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/95 text-white text-xs font-semibold backdrop-blur-md border border-emerald-400/30"
                            >
                                <Sparkles className="w-3 h-3" />
                                Novo
                            </motion.span>
                        )}
                        {featured && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/95 text-white text-xs font-semibold backdrop-blur-md border border-amber-400/30"
                            >
                                <Star className="w-3 h-3 fill-current" />
                                Destaque
                            </motion.span>
                        )}
                        {isPremium && !featured && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/95 text-white text-xs font-semibold backdrop-blur-md border border-purple-400/30"
                            >
                                <Award className="w-3 h-3" />
                                Premium
                            </motion.span>
                        )}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {onFavoriteToggle && (
                            <motion.button
                                onClick={handleFavorite}
                                className={cn(
                                    "w-11 h-11 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center justify-center shadow-lg",
                                    isFavorited
                                        ? "bg-red-500/95 text-white border-red-400/50 hover:bg-red-600"
                                        : "bg-white/95 hover:bg-white text-gray-600 border-white/50 hover:text-red-500 hover:scale-105"
                                )}
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                            </motion.button>
                        )}

                        <motion.button
                            className="w-11 h-11 rounded-xl bg-white/95 hover:bg-white text-gray-600 hover:text-emerald-600 backdrop-blur-md border border-white/50 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-105"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Eye className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Enhanced Type Badge */}
                    <div className="absolute bottom-4 right-4">
                        <span className={cn(
                            "px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border text-white shadow-lg",
                            type === 'sale'
                                ? "bg-emerald-500/95 border-emerald-400/50"
                                : "bg-blue-500/95 border-blue-400/50"
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

                {/* Enhanced Content */}
                <div className="p-6 space-y-4">
                    {/* Title and Location */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-emerald-600" />
                            <span className="line-clamp-1 font-medium">{location || address}</span>
                        </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                        {bedrooms !== undefined && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <BedDouble className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold">{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms !== undefined && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Bath className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">{bathrooms}</span>
                            </div>
                        )}
                        {area && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Ruler className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold">{area}m²</span>
                            </div>
                        )}
                        {parkingSpots !== undefined && parkingSpots > 0 && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Car className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold">{parkingSpots}</span>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Price and Trend */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {formattedPrice}
                            </div>
                            {type === 'rent' && (
                                <span className="text-sm text-gray-500 font-medium">/mês</span>
                            )}
                        </div>
                        {trend && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl font-semibold border border-emerald-100">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Enhanced Mobile Action Bar */}
            <div className="px-6 pb-6">
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleCall}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
                    >
                        <Phone className="w-4 h-4" />
                        Ligar
                    </motion.button>
                    <motion.button
                        onClick={handleWhatsApp}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
                    >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

