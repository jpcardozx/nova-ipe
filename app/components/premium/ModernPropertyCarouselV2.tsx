"use client"

import React, { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, Grid3X3, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import ModernPropertyCardV2 from './ModernPropertyCardV2'

interface PropertyImage {
    url: string
    alt?: string
}

interface CarouselProperty {
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
}

interface SlidesToShow {
    desktop: number
    tablet: number
    mobile: number
}

interface ModernPropertyCarouselV2Props {
    properties: CarouselProperty[]
    title?: string
    subtitle?: string
    badge?: string
    viewAllLink?: string
    viewAllText?: string
    cardVariant?: 'default' | 'compact' | 'featured' | 'hero'
    slidesToShow?: SlidesToShow
    autoplay?: boolean
    autoplayDelay?: number
    infinite?: boolean
    showDots?: boolean
    showProgress?: boolean
    className?: string
}

const ModernPropertyCarouselV2 = memo<ModernPropertyCarouselV2Props>(({
    properties = [],
    title = "Imóveis em Destaque",
    subtitle,
    badge,
    viewAllLink,
    viewAllText = "Ver todos",
    cardVariant = 'default',
    slidesToShow = { desktop: 3, tablet: 2, mobile: 1 },
    autoplay = false,
    autoplayDelay = 5000,
    infinite = true,
    showDots = true,
    showProgress = true,
    className
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay)
    const [isHovered, setIsHovered] = useState(false)
    const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel')
    const [visibleProperties, setVisibleProperties] = useState<CarouselProperty[]>([])
    const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow.desktop)

    const carouselRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isInView = useInView(carouselRef, { once: true, amount: 0.2 })

    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 768) {
                setCurrentSlidesToShow(slidesToShow.mobile)
            } else if (width < 1024) {
                setCurrentSlidesToShow(slidesToShow.tablet)
            } else {
                setCurrentSlidesToShow(slidesToShow.desktop)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [slidesToShow])

    // Update visible properties when currentIndex or currentSlidesToShow changes
    useEffect(() => {
        if (properties.length === 0) return

        const startIndex = currentIndex
        const endIndex = startIndex + currentSlidesToShow

        let newVisibleProperties: CarouselProperty[]

        if (infinite && properties.length > currentSlidesToShow) {
            newVisibleProperties = []
            for (let i = 0; i < currentSlidesToShow; i++) {
                const index = (startIndex + i) % properties.length
                newVisibleProperties.push(properties[index])
            }
        } else {
            newVisibleProperties = properties.slice(startIndex, endIndex)
        }

        setVisibleProperties(newVisibleProperties)
    }, [currentIndex, currentSlidesToShow, properties, infinite])

    // Autoplay functionality
    useEffect(() => {
        if (isAutoPlaying && !isHovered && properties.length > currentSlidesToShow) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (infinite) {
                        return (prev + 1) % properties.length
                    } else {
                        const maxIndex = properties.length - currentSlidesToShow
                        return prev >= maxIndex ? 0 : prev + 1
                    }
                })
            }, autoplayDelay)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isAutoPlaying, isHovered, properties.length, currentSlidesToShow, infinite, autoplayDelay])

    const nextSlide = () => {
        setCurrentIndex(prev => {
            if (infinite) {
                return (prev + 1) % properties.length
            } else {
                const maxIndex = properties.length - currentSlidesToShow
                return prev >= maxIndex ? prev : prev + 1
            }
        })
    }

    const prevSlide = () => {
        setCurrentIndex(prev => {
            if (infinite) {
                return (prev - 1 + properties.length) % properties.length
            } else {
                return prev <= 0 ? prev : prev - 1
            }
        })
    }

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying)
    }

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'carousel' ? 'grid' : 'carousel')
    }

    // Progress calculation
    const progress = infinite
        ? ((currentIndex % properties.length) / properties.length) * 100
        : (currentIndex / Math.max(properties.length - currentSlidesToShow, 1)) * 100

    // Total pages for dots
    const totalPages = infinite
        ? properties.length
        : Math.max(Math.ceil(properties.length / currentSlidesToShow), 1)

    if (properties.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="text-gray-500">Nenhum imóvel encontrado.</p>
            </div>
        )
    }

    return (
        <section className={cn("py-16 relative", className)} ref={carouselRef}>
            <div className="container mx-auto px-4">
                {/* Header da seção */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {badge && (
                                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {badge}
                                </span>
                            )}
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                {title}
                            </h2>
                        </div>
                        {subtitle && (
                            <p className="text-gray-600 text-lg max-w-2xl">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Controles do header */}
                    <div className="flex items-center gap-4">
                        {/* Toggle view mode */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('carousel')}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === 'carousel'
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === 'grid'
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Autoplay toggle (apenas para carousel) */}
                        {viewMode === 'carousel' && properties.length > currentSlidesToShow && (
                            <button
                                onClick={toggleAutoPlay}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                    isAutoPlaying
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {isAutoPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {isAutoPlaying ? 'Pausar' : 'Reproduzir'}
                                </span>
                            </button>
                        )}

                        {/* Ver todos */}
                        {viewAllLink && (
                            <a
                                href={viewAllLink}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                {viewAllText}
                                <ChevronRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Conteúdo principal */}
                {viewMode === 'grid' ? (
                    /* Grid View */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {properties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ModernPropertyCardV2
                                    {...property}
                                    variant={cardVariant}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Carousel View */
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Container dos cards */}
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex gap-6"
                                animate={{ x: 0 }}
                                transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                            >
                                <AnimatePresence mode="wait">
                                    {visibleProperties.map((property, index) => (
                                        <motion.div
                                            key={`${property.id}-${currentIndex}-${index}`}
                                            initial={{ opacity: 0, x: 300 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -300 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeOut" as const,
                                                delay: index * 0.1
                                            }}
                                            className="flex-shrink-0"
                                            style={{
                                                width: `calc((100% - ${(currentSlidesToShow - 1) * 1.5}rem) / ${currentSlidesToShow})`
                                            }}
                                        >
                                            <ModernPropertyCardV2
                                                {...property}
                                                variant={cardVariant}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Controles de navegação */}
                        {properties.length > currentSlidesToShow && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                    disabled={!infinite && currentIndex === 0}
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                                </button>

                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                    disabled={!infinite && currentIndex >= properties.length - currentSlidesToShow}
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Progress bar e dots (apenas para carousel) */}
                {viewMode === 'carousel' && properties.length > currentSlidesToShow && (
                    <div className="mt-8 space-y-4">
                        {/* Progress bar */}
                        {showProgress && (
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        )}

                        {/* Dots */}
                        {showDots && (
                            <div className="flex justify-center gap-2">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(infinite ? index : index * currentSlidesToShow)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-200",
                                            (infinite ? index === currentIndex % totalPages : index === Math.floor(currentIndex / currentSlidesToShow))
                                                ? "bg-blue-600 w-6"
                                                : "bg-gray-300 hover:bg-gray-400"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
})

ModernPropertyCarouselV2.displayName = 'ModernPropertyCarouselV2'

export default ModernPropertyCarouselV2

