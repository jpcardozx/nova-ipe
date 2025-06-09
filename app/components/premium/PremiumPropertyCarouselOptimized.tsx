"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import PremiumPropertyCardOptimized from './PremiumPropertyCardOptimized'
import Link from 'next/link'
import SectionWrapper from '../ui/SectionWrapper'
import './premiumCarousel.css'

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
    const [isTouching, setIsTouching] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)

    // Responsive slides calculation
    const getCurrentSlidesToShow = useCallback(() => {
        if (typeof window === 'undefined') return slidesToShow.desktop

        const width = window.innerWidth
        if (width < 640) return Math.min(slidesToShow.mobile, 1) // Enforce single slide on smallest screens
        if (width < 768) return slidesToShow.mobile
        if (width < 1024) return slidesToShow.tablet
        return slidesToShow.desktop
    }, [slidesToShow])

    const [currentSlidesToShow, setCurrentSlidesToShow] = useState(getCurrentSlidesToShow())

    // Update slides on resize
    useEffect(() => {
        const handleResize = () => {
            setCurrentSlidesToShow(getCurrentSlidesToShow())

            // Reset to first slide when screen size changes significantly
            // to prevent showing empty spaces
            setCurrentIndex(0)
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

    // Touch gesture handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsTouching(true)
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(e.targetTouches[0].clientX)
        setIsAutoplayPaused(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isTouching) return
        setTouchEnd(e.targetTouches[0].clientX)

        // Apply smooth drag effect during touch
        if (carouselRef.current) {
            const touchDiff = touchEnd - touchStart
            const slideWidth = carouselRef.current.offsetWidth / currentSlidesToShow
            const maxTranslate = slideWidth * (totalSlides - 1)

            let translate = -currentIndex * slideWidth + touchDiff

            // Constrain movement within bounds with resistance
            if (translate > 0) {
                translate = translate * 0.3 // Add resistance when pulling beyond start
                carouselRef.current.classList.add('dragging-beyond-start')
            } else if (translate < -maxTranslate) {
                translate = -maxTranslate + (translate + maxTranslate) * 0.3 // Add resistance when pulling beyond end
                carouselRef.current.classList.add('dragging-beyond-end')
            } else {
                carouselRef.current.classList.remove('dragging-beyond-start')
                carouselRef.current.classList.remove('dragging-beyond-end')
            }

            carouselRef.current.style.transform = `translateX(${translate}px)`
            carouselRef.current.style.transition = 'none'
        }
    }

    const handleTouchEnd = () => {
        setIsTouching(false)
        setIsAutoplayPaused(false)

        // Reset inline styling and let React handle transitions
        if (carouselRef.current) {
            carouselRef.current.style.transform = ''
            carouselRef.current.style.transition = ''
            carouselRef.current.classList.remove('dragging-beyond-start')
            carouselRef.current.classList.remove('dragging-beyond-end')
        }

        if (touchStart === touchEnd) return // Just a tap, not a swipe

        const touchDiff = touchEnd - touchStart
        const threshold = 100 // Minimum distance to be considered a swipe

        if (touchDiff > threshold && currentIndex > 0) {
            // Swipe right, go back
            goToPrev()
        } else if (touchDiff < -threshold && currentIndex < totalSlides - 1) {
            // Swipe left, go forward
            goToNext()
        }
    }

    // Accessibility navigation with keyboard
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only handle keypresses when carousel is in viewport
            if (!carouselRef.current) return

            const rect = carouselRef.current.getBoundingClientRect()
            const isInView =
                rect.top < window.innerHeight &&
                rect.bottom > 0

            if (!isInView) return

            if (e.key === 'ArrowLeft') {
                goToPrev()
            } else if (e.key === 'ArrowRight') {
                goToNext()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [goToNext, goToPrev])

    if (!properties.length) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-50/50 rounded-2xl shadow-inner">
                <p className="text-gray-500 text-lg">Nenhuma propriedade encontrada</p>
            </div>
        )
    }

    return (
        <SectionWrapper
            className={cn("premium-carousel", className)}
            background="transparent"
            noPadding
            animate={false}
        >
            <div
                className="relative"
                onMouseEnter={() => setIsAutoplayPaused(true)}
                onMouseLeave={() => setIsAutoplayPaused(false)}
            >
                {/* Header */}
                {(title || subtitle || badge) && (
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {badge && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full text-amber-700 text-sm font-semibold mb-6 shadow-md backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {badge}
                            </div>
                        )}

                        {title && (
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Main Carousel */}                    <div
                        ref={carouselRef}
                        className="overflow-hidden rounded-2xl slide-container"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <motion.div
                            className="flex"
                            animate={
                                isTouching
                                    ? {} // During touch, manually controlled
                                    : {
                                        x: `-${currentIndex * (100 / currentSlidesToShow)}%`,
                                        transition: {
                                            duration: 0.7,
                                            ease: [0.32, 0.72, 0, 1]
                                        }
                                    }
                            }
                            style={{
                                width: `${(properties.length / currentSlidesToShow) * 100}%`
                            }}
                        >
                            {properties.map((property, index) => (
                                <div
                                    key={property.id}
                                    className="flex-shrink-0"
                                    style={{
                                        width: `${100 / properties.length}%`,
                                        padding: `0 ${spacing / 2}px`,
                                    }}
                                >                                <div className={cn(
                                    "slide-item",
                                    index === currentIndex ? "scale-100 active" : "scale-95 opacity-80"
                                )}>
                                        <PremiumPropertyCardOptimized
                                            {...property}
                                            variant={cardVariant}
                                            onFavoriteToggle={onFavoriteToggle}
                                            isFavorited={favoriteIds.has(property.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Controls - optimized for mobile */}
                    {showControls && hasMultipleSlides && (<>
                        {/* Previous Button */}
                        <motion.button
                            onClick={goToPrev}
                            className={cn(
                                "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 slide-controls",
                                "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center",
                                "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={currentIndex === 0}
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.button>                            {/* Next Button */}
                        <motion.button
                            onClick={goToNext}
                            className={cn(
                                "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 slide-controls",
                                "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center",
                                "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                "text-gray-700 hover:text-gray-900 hover:bg-white",
                                "shadow-lg hover:shadow-xl transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={currentIndex === totalSlides - 1}
                            aria-label="Próximo slide"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.button>
                    </>
                    )}                    {/* Progress Indicators - improved for mobile */}
                    {showIndicators && hasMultipleSlides && (
                        <div
                            className={cn(
                                "flex justify-center gap-1 md:gap-2 mt-6 md:mt-8 slide-indicators",
                                totalSlides > 5 ? "flex-wrap max-w-xs mx-auto" : ""
                            )}
                        >
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={cn(
                                        "transition-all duration-300 focus:outline-none rounded-full",
                                        currentIndex === index
                                            ? "h-2 md:h-3 w-6 md:w-8 bg-amber-600 shadow-md"
                                            : "h-2 md:h-3 w-2 md:w-3 bg-gray-300 hover:bg-gray-400 hover:scale-110"
                                    )}
                                    aria-label={`Ir para slide ${index + 1}`}
                                    aria-current={currentIndex === index ? "true" : "false"}
                                />
                            ))}
                        </div>
                    )}

                    {/* Slide Counter - improved for mobile */}
                    {hasMultipleSlides && (
                        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
                            <div className="px-2 md:px-3 py-1 bg-black/70 text-white text-xs md:text-sm rounded-full backdrop-blur-sm">
                                {currentIndex + 1} / {totalSlides}
                            </div>
                        </div>
                    )}
                </motion.div>                </div>
        </SectionWrapper>
    )
}

export default PremiumPropertyCarouselOptimized
