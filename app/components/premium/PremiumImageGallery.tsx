"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Share2,
    Maximize2,
    Play,
    Pause
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageData {
    url: string
    alt?: string
    caption?: string
    width?: number
    height?: number
}

interface PremiumImageGalleryProps {
    images: ImageData[]
    className?: string
    aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | '3/4'
    showThumbnails?: boolean
    showControls?: boolean
    showFullscreen?: boolean
    autoplay?: boolean
    autoplayDelay?: number
    quality?: number
    sizes?: string
    priority?: boolean
    onImageChange?: (index: number) => void
}

const PremiumImageGallery: React.FC<PremiumImageGalleryProps> = ({
    images = [],
    className,
    aspectRatio = '16/9',
    showThumbnails = true,
    showControls = true,
    showFullscreen = true,
    autoplay = false,
    autoplayDelay = 5000,
    quality = 90,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = false,
    onImageChange
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isPlaying, setIsPlaying] = useState(autoplay)
    const [isLoading, setIsLoading] = useState(true)
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)
    const galleryRef = useRef<HTMLDivElement>(null)

    const hasMultipleImages = images.length > 1
    const currentImage = images[currentIndex]

    // Autoplay functionality
    useEffect(() => {
        if (isPlaying && hasMultipleImages && !isFullscreen) {
            autoplayRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % images.length)
            }, autoplayDelay)
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current)
            }
        }
    }, [isPlaying, hasMultipleImages, isFullscreen, images.length, autoplayDelay])

    // Navigation functions
    const goToNext = useCallback(() => {
        if (hasMultipleImages) {
            const nextIndex = (currentIndex + 1) % images.length
            setCurrentIndex(nextIndex)
            onImageChange?.(nextIndex)
        }
    }, [currentIndex, hasMultipleImages, images.length, onImageChange])

    const goToPrev = useCallback(() => {
        if (hasMultipleImages) {
            const prevIndex = (currentIndex - 1 + images.length) % images.length
            setCurrentIndex(prevIndex)
            onImageChange?.(prevIndex)
        }
    }, [currentIndex, hasMultipleImages, images.length, onImageChange])

    const goToImage = useCallback((index: number) => {
        setCurrentIndex(index)
        onImageChange?.(index)
    }, [onImageChange])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isFullscreen) return

            switch (e.key) {
                case 'ArrowLeft':
                    goToPrev()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
                case 'Escape':
                    setIsFullscreen(false)
                    break
                case ' ':
                    e.preventDefault()
                    setIsPlaying(prev => !prev)
                    break
                case '+':
                    setZoom(prev => Math.min(prev * 1.2, 3))
                    break
                case '-':
                    setZoom(prev => Math.max(prev / 1.2, 0.5))
                    break
                case 'r':
                    setRotation(prev => (prev + 90) % 360)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isFullscreen, goToNext, goToPrev])

    // Image loading handler
    const handleImageLoad = useCallback((index: number) => {
        setLoadedImages(prev => new Set([...prev, index]))
        if (index === currentIndex) {
            setIsLoading(false)
        }
    }, [currentIndex])

    // Reset zoom and rotation when changing images
    useEffect(() => {
        setZoom(1)
        setRotation(0)
    }, [currentIndex])

    // Get aspect ratio classes
    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case '16/9': return 'aspect-video'
            case '4/3': return 'aspect-[4/3]'
            case '1/1': return 'aspect-square'
            case '3/4': return 'aspect-[3/4]'
            default: return 'aspect-auto'
        }
    }

    // Animation variants
    const imageVariants = {
        enter: { opacity: 0, scale: 1.1 },
        center: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    }

    if (!images.length) {
        return (
            <div className={cn("flex items-center justify-center bg-gray-100 rounded-2xl", getAspectRatioClass(), className)}>
                <p className="text-gray-500">Nenhuma imagem disponível</p>
            </div>
        )
    }

    return (
        <>
            {/* Main Gallery */}
            <div className={cn("relative group rounded-2xl overflow-hidden bg-gray-100", className)} ref={galleryRef}>
                {/* Main Image Container */}
                <div className={cn("relative overflow-hidden", getAspectRatioClass())}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="relative w-full h-full"
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <Image
                                src={currentImage.url}
                                alt={currentImage.alt || `Imagem ${currentIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes={sizes}
                                quality={quality}
                                priority={priority && currentIndex === 0}
                                onLoad={() => handleImageLoad(currentIndex)}
                                onLoadingComplete={() => setIsLoading(false)}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Loading overlay */}
                    {isLoading && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-gray-100"
                            variants={overlayVariants}
                            initial="visible"
                            animate="visible"
                            exit="hidden"
                        >
                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                        </motion.div>
                    )}

                    {/* Gradient overlay for controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Navigation Controls */}
                    {showControls && hasMultipleImages && (
                        <>
                            <motion.button
                                onClick={goToPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Próxima imagem"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </>
                    )}

                    {/* Top Controls */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Autoplay toggle */}
                        {hasMultipleImages && (
                            <motion.button
                                onClick={() => setIsPlaying(prev => !prev)}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={isPlaying ? "Pausar slideshow" : "Iniciar slideshow"}
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </motion.button>
                        )}

                        {/* Fullscreen toggle */}
                        {showFullscreen && (
                            <motion.button
                                onClick={() => setIsFullscreen(true)}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Tela cheia"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>

                    {/* Image counter */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}

                    {/* Caption */}
                    {currentImage.caption && (
                        <div className="absolute bottom-4 left-4 right-16 p-3 bg-black/70 text-white text-sm rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {currentImage.caption}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {showThumbnails && hasMultipleImages && (
                    <div className="p-4 bg-white">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToImage(index)}
                                    className={cn(
                                        "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105",
                                        currentIndex === index
                                            ? "border-amber-500 ring-2 ring-amber-200"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Fullscreen controls */}
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <button
                                onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                aria-label="Zoom in"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.5))}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                aria-label="Zoom out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setRotation(prev => (prev + 90) % 360)}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                aria-label="Girar"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fullscreen image */}
                        <div className="relative w-full h-full flex items-center justify-center p-16">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    className="relative max-w-full max-h-full"
                                    variants={imageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    style={{
                                        transform: `scale(${zoom}) rotate(${rotation}deg)`
                                    }}
                                >
                                    <Image
                                        src={currentImage.url}
                                        alt={currentImage.alt || `Imagem ${currentIndex + 1}`}
                                        width={currentImage.width || 1920}
                                        height={currentImage.height || 1080}
                                        className="max-w-full max-h-full object-contain"
                                        quality={95}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Fullscreen navigation */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Fullscreen counter */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-sm">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default PremiumImageGallery
