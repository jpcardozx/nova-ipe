'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import MobilePropertyCard from './MobilePropertyCard'
import Link from 'next/link'

interface PropertyData {
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
}

interface MobileCarouselProps {
    properties: PropertyData[]
    title?: string
    subtitle?: string
    viewAllLink?: string
    viewAllText?: string
    className?: string
    showControls?: boolean
    autoplay?: boolean
    autoplayDelay?: number
    onFavoriteToggle?: (id: string) => void
    favoriteIds?: Set<string>
}

export default function MobilePropertyCarousel({
    properties = [],
    title,
    subtitle,
    viewAllLink,
    viewAllText = "Ver todos",
    className,
    showControls = true,
    autoplay = false,
    autoplayDelay = 5000,
    onFavoriteToggle,
    favoriteIds = new Set()
}: MobileCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchEndX, setTouchEndX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)

    const carouselRef = useRef<HTMLDivElement>(null)
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)

    // Responsive slides calculation
    const [slidesToShow, setSlidesToShow] = useState(1)

    useEffect(() => {
        const updateSlidesToShow = () => {
            const width = window.innerWidth
            if (width < 640) {
                setSlidesToShow(1) // Mobile: 1 card
            } else if (width < 1024) {
                setSlidesToShow(1.5) // Tablet: 1.5 cards
            } else {
                setSlidesToShow(2.5) // Desktop: 2.5 cards
            }
        }

        updateSlidesToShow()
        window.addEventListener('resize', updateSlidesToShow)
        return () => window.removeEventListener('resize', updateSlidesToShow)
    }, [])

    const totalSlides = Math.max(0, properties.length - Math.floor(slidesToShow))
    const canGoNext = currentIndex < totalSlides
    const canGoPrev = currentIndex > 0

    // Navigation functions
    const goToNext = useCallback(() => {
        if (canGoNext) {
            setCurrentIndex(prev => prev + 1)
        } else if (autoplay) {
            setCurrentIndex(0) // Loop back to start in autoplay
        }
    }, [canGoNext, autoplay])

    const goToPrev = useCallback(() => {
        if (canGoPrev) {
            setCurrentIndex(prev => prev - 1)
        }
    }, [canGoPrev])

    // Autoplay functionality
    useEffect(() => {
        if (autoplay && !isAutoplayPaused && properties.length > slidesToShow) {
            autoplayRef.current = setInterval(goToNext, autoplayDelay)
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current)
            }
        }
    }, [autoplay, isAutoplayPaused, autoplayDelay, goToNext, properties.length, slidesToShow])

    // Touch handling for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX)
        setTouchEndX(e.targetTouches[0].clientX)
        setIsDragging(true)
        setIsAutoplayPaused(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return
        setTouchEndX(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!isDragging) return
        setIsDragging(false)
        setIsAutoplayPaused(false)

        const swipeThreshold = 50
        const swipeDistance = touchStartX - touchEndX

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && canGoNext) {
                goToNext()
            } else if (swipeDistance < 0 && canGoPrev) {
                goToPrev()
            }
        }
    }

    // Pause autoplay on hover/focus
    const handleMouseEnter = () => setIsAutoplayPaused(true)
    const handleMouseLeave = () => setIsAutoplayPaused(false)

    if (!properties.length) {
        return (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <p className="text-gray-500">Nenhum imóvel encontrado</p>
            </div>
        )
    }

    const cardWidth = window.innerWidth < 640 ? 'w-full' : window.innerWidth < 1024 ? 'w-80' : 'w-72'

    return (
        <div className={cn("w-full", className)}>
            {/* Header */}
            {(title || subtitle || viewAllLink) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-4 sm:px-0">
                    <div className="mb-4 sm:mb-0">
                        {title && (
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-gray-600 text-lg">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors group"
                        >
                            <span>{viewAllText}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>
            )}

            {/* Carousel Container */}
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Main Carousel */}
                <div
                    ref={carouselRef}
                    className="overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <motion.div
                        className="flex gap-4 px-4 sm:px-0"
                        animate={{
                            x: `-${currentIndex * (100 / slidesToShow)}%`
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                        style={{
                            width: `${(properties.length / slidesToShow) * 100}%`
                        }}
                    >
                        {properties.map((property, index) => (
                            <div
                                key={property.id}
                                className={cn(
                                    "flex-shrink-0",
                                    cardWidth
                                )}
                                style={{
                                    width: `${100 / properties.length}%`,
                                }}
                            >
                                <MobilePropertyCard
                                    {...property}
                                    onFavoriteToggle={onFavoriteToggle}
                                    isFavorited={favoriteIds.has(property.id)}
                                    className={cn(
                                        "transition-all duration-300",
                                        // Highlight current slide on mobile
                                        window.innerWidth < 640 && index === currentIndex
                                            ? "scale-100 opacity-100"
                                            : window.innerWidth < 640
                                                ? "scale-95 opacity-70"
                                                : "scale-100 opacity-100"
                                    )}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Controls - Hidden on mobile, visible on larger screens */}
                {showControls && (canGoPrev || canGoNext) && (
                    <>
                        <motion.button
                            onClick={goToPrev}
                            disabled={!canGoPrev}
                            className={cn(
                                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                                "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
                                "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hidden sm:flex"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>

                        <motion.button
                            onClick={goToNext}
                            disabled={!canGoNext}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                                "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
                                "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hidden sm:flex"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>
                    </>
                )}

                {/* Mobile Pagination Dots */}
                <div className="flex justify-center gap-2 mt-6 sm:hidden">
                    {Array.from({ length: Math.min(properties.length, 5) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "bg-amber-500 scale-125"
                                    : "bg-gray-300 hover:bg-gray-400"
                            )}
                        />
                    ))}
                    {properties.length > 5 && (
                        <span className="text-xs text-gray-500 ml-2">
                            {currentIndex + 1} de {properties.length}
                        </span>
                    )}
                </div>

                {/* Desktop Progress Bar */}
                <div className="hidden sm:block mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <motion.div
                            className="bg-amber-500 h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${((currentIndex + 1) / (totalSlides + 1)) * 100}%`
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Slide {currentIndex + 1}</span>
                        <span>{totalSlides + 1} total</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
