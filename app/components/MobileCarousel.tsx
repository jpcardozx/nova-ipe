'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileCarouselProps {
    children: React.ReactNode[];
    className?: string;
    showDots?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export default function MobileCarousel({
    children,
    className = '',
    showDots = true,
    autoPlay = false,
    autoPlayInterval = 5000
}: MobileCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const carouselRef = useRef<HTMLDivElement>(null);

    const totalSlides = children.length;
    const minSwipeDistance = 50;

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || totalSlides <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % totalSlides);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isAutoPlaying, autoPlayInterval, totalSlides]);

    // Touch handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrevious();
        }
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
    };

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="overflow-hidden rounded-2xl"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        width: `${totalSlides * 100}%`
                    }}
                >
                    {children.map((child, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0"
                            style={{ width: `${100 / totalSlides}%` }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons - Hidden on very small screens */}
            {totalSlides > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center z-10 transition-all duration-200 hover:scale-110"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center z-10 transition-all duration-200 hover:scale-110"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-amber-500 scale-125'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Swipe Instruction */}
            {totalSlides > 1 && (
                <div className="text-center mt-2 sm:hidden">
                    <p className="text-xs text-slate-500">
                        Deslize para ver mais
                    </p>
                </div>
            )}
        </div>
    );
}
