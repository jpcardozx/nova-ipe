/**
 * Carrossel com paleta premium do Hero
 * Design elegante inspirado nos cards do hero com gradient amber/orange
 */

"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HeroStyleCarouselProps {
    children: React.ReactNode[]
    title?: string
    subtitle?: string
    className?: string
    itemsPerView?: {
        mobile: number
        tablet: number
        desktop: number
    }
    autoPlay?: boolean
    autoPlayInterval?: number
}

export default function HeroStyleCarousel({
    children,
    title,
    subtitle,
    className = "",
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
    autoPlay = false,
    autoPlayInterval = 5000
}: HeroStyleCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
    const carouselRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(carouselRef, { once: true, margin: '-50px' })

    const totalSlides = children.length
    const maxSlides = {
        mobile: Math.max(0, totalSlides - itemsPerView.mobile),
        tablet: Math.max(0, totalSlides - itemsPerView.tablet),
        desktop: Math.max(0, totalSlides - itemsPerView.desktop)
    }

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide(prev => {
                const max = maxSlides.desktop
                return prev >= max ? 0 : prev + 1
            })
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [isAutoPlaying, autoPlayInterval, maxSlides.desktop])

    const goToPrevious = () => {
        setIsAutoPlaying(false)
        setCurrentSlide(prev => prev <= 0 ? maxSlides.desktop : prev - 1)
    }

    const goToNext = () => {
        setIsAutoPlaying(false)
        setCurrentSlide(prev => prev >= maxSlides.desktop ? 0 : prev + 1)
    }

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false)
        setCurrentSlide(Math.min(index, maxSlides.desktop))
    }

    return (
        <motion.section
            ref={carouselRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden",
                // Padding condicional - mais compacto quando transparente
                className?.includes('bg-transparent')
                    ? "py-2 sm:py-4 lg:py-6"
                    : "py-8 sm:py-12 lg:py-16",
                // Background condicional - transparente quando especificado
                className?.includes('bg-transparent')
                    ? "bg-transparent"
                    : "bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30",
                className
            )}
        >
            {/* Background sutil - Apenas quando não for transparente */}
            {!className?.includes('bg-transparent') && (
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl" />
                </div>
            )}

            <div className={cn(
                "relative z-10",
                // Padding condicional
                className?.includes('bg-transparent')
                    ? "px-2 sm:px-4 lg:px-6"
                    : "px-4 sm:px-6 lg:px-8"
            )}>
                {/* Cabeçalho Simplificado */}
                {(title || subtitle) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-8 sm:mb-10"
                    >
                        {title && (
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Container do Carrossel Mobile-First */}
                <div className="relative px-0 sm:px-12 lg:px-16">
                    {/* Área de visualização do carrossel com touch support */}
                    <div
                        className={cn(
                            "overflow-hidden rounded-xl border shadow-sm touch-pan-x",
                            // Background condicional baseado no contexto
                            className?.includes('bg-transparent')
                                ? "bg-transparent border-transparent shadow-none"
                                : "bg-white/70 backdrop-blur-sm border-amber-200/30"
                        )}
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            (e.currentTarget as any).touchStartX = touch.clientX;
                            (e.currentTarget as any).touchStartTime = Date.now();
                        }}
                        onTouchEnd={(e) => {
                            const touchStartX = (e.currentTarget as any).touchStartX;
                            const touchStartTime = (e.currentTarget as any).touchStartTime;
                            const touchEndX = e.changedTouches[0].clientX;
                            const touchEndTime = Date.now();

                            const deltaX = touchStartX - touchEndX;
                            const deltaTime = touchEndTime - touchStartTime;

                            // Swipe detection: minimum distance and maximum time
                            if (Math.abs(deltaX) > 50 && deltaTime < 500) {
                                if (deltaX > 0) {
                                    goToNext();
                                } else {
                                    goToPrevious();
                                }
                            }
                        }}
                    >
                        <motion.div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${currentSlide * (
                                    100 / (
                                        typeof window !== 'undefined' && window.innerWidth < 640 ? itemsPerView.mobile :
                                            typeof window !== 'undefined' && window.innerWidth < 1024 ? itemsPerView.tablet :
                                                itemsPerView.desktop
                                    )
                                )}%)`
                            }}
                        >
                            {children.map((child, index) => (
                                <motion.div
                                    key={index}
                                    className={cn(
                                        "flex-shrink-0 select-none",
                                        // Padding condicional baseado no background
                                        className?.includes('bg-transparent')
                                            ? "px-1 sm:px-2 py-1 sm:py-2"
                                            : "px-2 sm:px-3 py-4 sm:py-6"
                                    )}
                                    style={{
                                        width: `${100 / (
                                            typeof window !== 'undefined' && window.innerWidth < 640 ? itemsPerView.mobile :
                                                typeof window !== 'undefined' && window.innerWidth < 1024 ? itemsPerView.tablet :
                                                    itemsPerView.desktop
                                        )}%`
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: isInView ? 1 : 0,
                                        scale: isInView ? 1 : 0.9
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1
                                    }}
                                >
                                    {child}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Botões de Navegação - Posicionados dentro do padding seguro */}
                    {maxSlides.desktop > 0 && (
                        <>
                            <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-0 z-20">
                                <motion.button
                                    onClick={goToPrevious}
                                    disabled={currentSlide === 0}
                                    className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
                                        "bg-white text-gray-700 border-2 border-amber-200",
                                        "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 hover:shadow-xl",
                                        "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
                                        "focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2",
                                        "backdrop-blur-sm"
                                    )}
                                    whileHover={{ scale: currentSlide === 0 ? 1 : 1.05 }}
                                    whileTap={{ scale: currentSlide === 0 ? 1 : 0.95 }}
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-0 z-20">
                                <motion.button
                                    onClick={goToNext}
                                    disabled={currentSlide >= maxSlides.desktop}
                                    className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
                                        "bg-white text-gray-700 border-2 border-amber-200",
                                        "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 hover:shadow-xl",
                                        "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
                                        "focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2",
                                        "backdrop-blur-sm"
                                    )}
                                    whileHover={{ scale: currentSlide >= maxSlides.desktop ? 1 : 1.05 }}
                                    whileTap={{ scale: currentSlide >= maxSlides.desktop ? 1 : 0.95 }}
                                    aria-label="Próximo slide"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </>
                    )}                    {/* Indicadores para mobile com responsividade melhorada */}
                    <div className="flex sm:hidden justify-center mt-4 space-x-2">
                        {Array.from({
                            length: Math.ceil(children.length / (
                                typeof window !== 'undefined' && window.innerWidth < 640 ? itemsPerView.mobile :
                                    typeof window !== 'undefined' && window.innerWidth < 1024 ? itemsPerView.tablet :
                                        itemsPerView.desktop
                            ))
                        }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300 touch-manipulation",
                                    currentSlide === index
                                        ? "bg-amber-600 w-6 shadow-sm"
                                        : "bg-gray-300 hover:bg-gray-400 active:bg-amber-400"
                                )}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Instruções de swipe para mobile */}
                    <div className="flex sm:hidden justify-center mt-2">
                        <p className="text-xs text-gray-500 flex items-center">
                            <span className="mr-1">👈</span>
                            Deslize para navegar
                            <span className="ml-1">👉</span>
                        </p>
                    </div>

                    {/* Indicadores desktop */}
                    <div className="hidden sm:flex justify-center mt-6 gap-2">
                        {Array.from({ length: maxSlides.desktop + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    currentSlide === index
                                        ? "bg-amber-500 w-6"
                                        : "bg-gray-300 w-2 hover:bg-amber-300"
                                )}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navegação mobile simplificada */}
                    <div className="flex justify-center mt-4 gap-4 sm:hidden">
                        <button
                            onClick={goToPrevious}
                            disabled={currentSlide === 0}
                            className={cn(
                                "px-3 py-2 rounded text-sm font-medium transition-colors",
                                "bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-gray-200"
                            )}
                        >
                            ← Anterior
                        </button>

                        <button
                            onClick={goToNext}
                            disabled={currentSlide >= maxSlides.desktop}
                            className={cn(
                                "px-3 py-2 rounded text-sm font-medium transition-colors",
                                "bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-gray-200"
                            )}
                        >
                            Próximo →
                        </button>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}
