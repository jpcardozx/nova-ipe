'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * COMPONENTE UNIFICADO DE CARROSSEL
 * 
 * Solução definitiva para todos os carrosséis do projeto.
 * Resolve problemas de:
 * - Múltiplos componentes fragmentados
 * - Performance inconsistente
 * - UX/UI não unificado
 * - Responsividade problemática
 */

interface UnifiedCarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey: (item: T, index: number) => string;

    // Configuração de slides
    slidesToShow?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };

    // Comportamento
    autoplay?: boolean;
    autoplayDelay?: number;
    infinite?: boolean;
    pauseOnHover?: boolean;

    // Navegação
    showControls?: boolean;
    showDots?: boolean;
    showProgress?: boolean;

    // Estilo
    className?: string;
    gap?: number;

    // Acessibilidade
    title?: string;
    subtitle?: string;
    ariaLabel?: string;

    // Callbacks
    onSlideChange?: (currentIndex: number) => void;
    onInit?: () => void;
}

export function UnifiedCarousel<T>({
    items,
    renderItem,
    getKey,
    slidesToShow = { mobile: 1, tablet: 2, desktop: 3 },
    autoplay = false,
    autoplayDelay = 5000,
    infinite = true,
    pauseOnHover = true,
    showControls = true,
    showDots = true,
    showProgress = false,
    className,
    gap = 16,
    title,
    subtitle,
    ariaLabel,
    onSlideChange,
    onInit
}: UnifiedCarouselProps<T>) {

    // Estados
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
    const [isHovered, setIsHovered] = useState(false);
    const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow.desktop);
    const [isDragging, setIsDragging] = useState(false);

    // Refs
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setCurrentSlidesToShow(slidesToShow.mobile);
            } else if (width < 1024) {
                setCurrentSlidesToShow(slidesToShow.tablet);
            } else {
                setCurrentSlidesToShow(slidesToShow.desktop);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slidesToShow]);

    // Calcular limites
    const maxIndex = infinite ? items.length : Math.max(0, items.length - currentSlidesToShow);
    const canGoNext = infinite || currentIndex < maxIndex;
    const canGoPrev = infinite || currentIndex > 0;

    // Navegação
    const goToNext = useCallback(() => {
        if (!canGoNext) return;

        const nextIndex = infinite && currentIndex >= maxIndex
            ? 0
            : Math.min(currentIndex + 1, maxIndex);

        setCurrentIndex(nextIndex);
        onSlideChange?.(nextIndex);
    }, [currentIndex, maxIndex, infinite, canGoNext, onSlideChange]);

    const goToPrev = useCallback(() => {
        if (!canGoPrev) return;

        const prevIndex = infinite && currentIndex <= 0
            ? maxIndex
            : Math.max(currentIndex - 1, 0);

        setCurrentIndex(prevIndex);
        onSlideChange?.(prevIndex);
    }, [currentIndex, maxIndex, infinite, canGoPrev, onSlideChange]);

    const goToSlide = useCallback((index: number) => {
        const clampedIndex = Math.max(0, Math.min(index, maxIndex));
        setCurrentIndex(clampedIndex);
        onSlideChange?.(clampedIndex);
    }, [maxIndex, onSlideChange]);

    // Autoplay
    useEffect(() => {
        if (isAutoPlaying && !isHovered && !isDragging && items.length > currentSlidesToShow) {
            autoplayRef.current = setInterval(goToNext, autoplayDelay);
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, [isAutoPlaying, isHovered, isDragging, items.length, currentSlidesToShow, goToNext, autoplayDelay]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        const touchDiff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(touchDiff) > threshold) {
            if (touchDiff > 0 && canGoNext) {
                goToNext();
            } else if (touchDiff < 0 && canGoPrev) {
                goToPrev();
            }
        }
    };

    // Mouse handlers
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (pauseOnHover) setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (pauseOnHover && autoplay) setIsAutoPlaying(true);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNext();
        }
    };

    // Init callback
    useEffect(() => {
        onInit?.();
    }, [onInit]);

    if (!items.length) {
        return (
            <div className={cn("flex items-center justify-center p-8 text-gray-500", className)}>
                Nenhum item para exibir
            </div>
        );
    }

    return (
        <div className={cn("relative w-full", className)}>
            {/* Header */}
            {(title || subtitle) && (
                <div className="text-center mb-8">
                    {title && (
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h2>
                    )}
                    {subtitle && (
                        <motion.p
                            className="text-gray-600 text-lg max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            )}

            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-label={ariaLabel || title || "Carrossel interativo"}
            >
                {/* Items Container */}
                <motion.div
                    className="flex"
                    animate={{
                        x: `-${currentIndex * (100 / currentSlidesToShow)}%`
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    }}
                    style={{
                        gap: `${gap}px`,
                        width: `${(items.length / currentSlidesToShow) * 100}%`
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={getKey(item, index)}
                            className="flex-shrink-0"
                            style={{
                                width: `${100 / items.length}%`,
                                paddingRight: index < items.length - 1 ? `${gap}px` : 0
                            }}
                        >
                            <motion.div
                                className="h-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {renderItem(item, index)}
                            </motion.div>
                        </div>
                    ))}
                </motion.div>

                {/* Navigation Controls - Hidden on mobile */}
                {showControls && (
                    <AnimatePresence>
                        {(canGoPrev || canGoNext) && (
                            <>
                                <motion.button
                                    onClick={goToPrev}
                                    className={cn(
                                        "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10",
                                        "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center",
                                        "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                        "text-gray-700 hover:text-gray-900 hover:bg-white",
                                        "shadow-lg hover:shadow-xl transition-all duration-300",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                        // Hide on mobile (screens smaller than 768px)
                                        "hidden md:flex"
                                    )}
                                    disabled={!canGoPrev}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.button>

                                <motion.button
                                    onClick={goToNext}
                                    className={cn(
                                        "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10",
                                        "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center",
                                        "rounded-full bg-white/90 backdrop-blur-sm border border-white/20",
                                        "text-gray-700 hover:text-gray-900 hover:bg-white",
                                        "shadow-lg hover:shadow-xl transition-all duration-300",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                        // Hide on mobile (screens smaller than 768px)
                                        "hidden md:flex"
                                    )}
                                    disabled={!canGoNext}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    aria-label="Próximo slide"
                                >
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Dots Navigation */}
            {showDots && items.length > currentSlidesToShow && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: Math.ceil(items.length / currentSlidesToShow) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                currentIndex === index
                                    ? "w-6 bg-blue-600"
                                    : "bg-gray-300 hover:bg-gray-400"
                            )}
                            aria-label={`Ir para slide ${index + 1}`}
                            aria-current={currentIndex === index ? "true" : "false"}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {showProgress && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <motion.div
                            className="bg-blue-600 h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${((currentIndex + 1) / Math.ceil(items.length / currentSlidesToShow)) * 100}%`
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnifiedCarousel;
