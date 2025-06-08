"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import PremiumPropertyCardOptimized from './PremiumPropertyCardOptimized'
import Link from 'next/link'

interface PropertyData {
    id: string
    title: string
    price: number
    address: string
    location?: string
    images: { url: string; alt?: string }[]
    mainImage?: { url: string; alt?: string }
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
}

interface PremiumPropertyCarouselOptimizedProps {
    properties: PropertyData[]
    title?: string
    subtitle?: string
    badge?: string
    viewAllLink?: string
    viewAllText?: string
    className?: string
    cardVariant?: 'default' | 'compact' | 'featured' | 'hero'
    slidesToShow?: {
        desktop: number
        tablet: number
        mobile: number
    }
    spacing?: number
    autoplay?: boolean
    autoplayDelay?: number
    showControls?: boolean
    showIndicators?: boolean
    onFavoriteToggle?: (id: string) => void
    favoriteIds?: Set<string>
}

const PremiumPropertyCarouselOptimized: React.FC<PremiumPropertyCarouselOptimizedProps> = ({
    properties = [],
    title,
    subtitle,
    badge,
    viewAllLink,
    viewAllText = "Ver todos",
    className,
    cardVariant = 'default',
    slidesToShow = {
        desktop: 3,
        tablet: 2,
        mobile: 1
    },
    spacing = 24,
    autoplay = false,
    autoplayDelay = 5000,
    showControls = true,
    showIndicators = true,
    onFavoriteToggle,
    favoriteIds = new Set()
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)

    // Responsive slides calculation
    const getCurrentSlidesToShow = useCallback(() => {
        if (typeof window === 'undefined') return slidesToShow.desktop

        const width = window.innerWidth
        if (width < 768) return slidesToShow.mobile
        if (width < 1024) return slidesToShow.tablet
        return slidesToShow.desktop
    }, [slidesToShow])

    const [currentSlidesToShow, setCurrentSlidesToShow] = useState(getCurrentSlidesToShow())

    // Update slides on resize
    useEffect(() => {
        const handleResize = () => {
            setCurrentSlidesToShow(getCurrentSlidesToShow())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [getCurrentSlidesToShow])

    const totalSlides = Math.max(0, properties.length - currentSlidesToShow + 1)
    const hasMultipleSlides = totalSlides > 1

    // Autoplay functionality
    useEffect(() => {
        if (autoplay && hasMultipleSlides && !isAutoplayPaused) {
            autoplayRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % totalSlides)
            }, autoplayDelay)
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current)
            }
        }
    }, [autoplay, hasMultipleSlides, isAutoplayPaused, totalSlides, autoplayDelay])

    // Navigation functions
    const goToNext = useCallback(() => {
        if (hasMultipleSlides) {
            setCurrentIndex(prev => (prev + 1) % totalSlides)
        }
    }, [hasMultipleSlides, totalSlides])

    const goToPrev = useCallback(() => {
        if (hasMultipleSlides) {
            setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides)
        }
    }, [hasMultipleSlides, totalSlides])

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
    }, [totalSlides])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrev()
            } else if (e.key === 'ArrowRight') {
                goToNext()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [goToNext, goToPrev])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const headerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    }

    const carouselVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    }

    if (!properties.length) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">Nenhuma propriedade encontrada</p>
            </div>
        )
    }

    return (
        <motion.section
            className={cn("relative py-16", className)}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            onMouseEnter={() => setIsAutoplayPaused(true)}
            onMouseLeave={() => setIsAutoplayPaused(false)}
        >
            {/* Header */}
            {(title || subtitle || badge) && (
                <motion.div
                    className="text-center mb-12"
                    variants={headerVariants}
                >
                    {badge && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full text-amber-700 text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            {badge}
                        </div>
                    )}

                    {title && (
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            {title}
                        </h2>
                    )}

                    {subtitle && (
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    {viewAllLink && (
                        <div className="mt-8">
                            <Link
                                href={viewAllLink}
                                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors duration-300 group"
                            >
                                <span>{viewAllText}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Carousel Container */}
            <motion.div
                className="relative"
                variants={carouselVariants}
            >
                {/* Main Carousel */}
                <div
                    ref={carouselRef}
                    className="overflow-hidden rounded-2xl"
                >
                    <motion.div
                        className="flex transition-transform duration-700 ease-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / currentSlidesToShow)}%)`,
                            width: `${(properties.length / currentSlidesToShow) * 100}%`
                        }}
                    >
                        {properties.map((property, index) => (
                            <div
                                key={property.id}
                                className="flex-shrink-0 px-3"
                                style={{
                                    width: `${100 / properties.length}%`,
                                    paddingLeft: index === 0 ? 0 : spacing / 2,
                                    paddingRight: index === properties.length - 1 ? 0 : spacing / 2
                                }}
                            >
                                <PremiumPropertyCardOptimized
                                    {...property}
                                    variant={cardVariant}
                                    onFavoriteToggle={onFavoriteToggle}
                                    isFavorited={favoriteIds.has(property.id)}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Controls */}
                {showControls && hasMultipleSlides && (
                    <>
                        {/* Previous Button */}
                        <motion.button
                            onClick={goToPrev}
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                                "p-4 rounded-full bg-white/90 backdrop-blur-md border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!hasMultipleSlides}
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>

                        {/* Next Button */}
                        <motion.button
                            onClick={goToNext}
                            className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                                "p-4 rounded-full bg-white/90 backdrop-blur-md border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!hasMultipleSlides}
                            aria-label="Próximo slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </>
                )}

                {/* Progress Indicators */}
                {showIndicators && hasMultipleSlides && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "h-3 rounded-full transition-all duration-300 focus:outline-none",
                                    currentIndex === index
                                        ? "w-8 bg-amber-600 shadow-lg"
                                        : "w-3 bg-gray-300 hover:bg-gray-400 hover:scale-110"
                                )}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Slide Counter */}
                {hasMultipleSlides && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="px-3 py-1 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm">
                            {currentIndex + 1} / {totalSlides}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.section>
    )
}

export default PremiumPropertyCarouselOptimized
