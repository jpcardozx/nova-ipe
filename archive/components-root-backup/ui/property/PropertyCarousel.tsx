'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import PropertyCardUnified, { PropertyCardUnifiedProps } from './PropertyCardUnified';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PropertyCarouselProps {
    properties: PropertyCardUnifiedProps[];
    title?: string;
    subtitle?: string;
    variant?: 'default' | 'compact' | 'featured' | 'grid';
    slidesToShow?: number;
    showControls?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    className?: string;
    showEmptyState?: boolean;
    emptyStateMessage?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
}

export function PropertyCarousel({
    properties,
    title,
    subtitle,
    variant = 'default',
    slidesToShow = 3,
    showControls = true,
    autoplay = false,
    autoplayInterval = 5000,
    className,
    showEmptyState = true,
    emptyStateMessage = 'Nenhum imóvel disponível no momento.',
    viewAllLink,
    viewAllLabel = 'Ver todos',
}: PropertyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState(slidesToShow);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [touchStartTime, setTouchStartTime] = useState(0);
    const totalSlides = properties.length;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardWidth = useRef<number>(0);

    // Prefetching próximos slides
    useEffect(() => {
        // Precarregando as próximas imagens
        const nextIndex = (currentIndex + visibleSlides) % totalSlides;
        const imagesToPreload: string[] = []; for (let i = 0; i < Math.min(visibleSlides * 2, totalSlides); i++) {
            const idx = (nextIndex + i) % totalSlides;
            const imageUrl = properties[idx].mainImage.url || properties[idx].mainImage.imagemUrl;
            if (imageUrl) {
                imagesToPreload.push(imageUrl);
            }
        }

        if (typeof window !== 'undefined') {
            imagesToPreload.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }
    }, [currentIndex, visibleSlides, properties, totalSlides]);

    // Ajusta o número de slides visíveis com base no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleSlides(1);
            } else if (window.innerWidth < 1024) {
                setVisibleSlides(2);
            } else {
                setVisibleSlides(slidesToShow);
            }

            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                cardWidth.current = containerWidth / visibleSlides;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slidesToShow]);

    // Configura o autoplay
    useEffect(() => {
        if (autoplay && properties.length > visibleSlides) {
            resetAutoplay();
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [autoplay, currentIndex, properties.length, visibleSlides, autoplayInterval]);

    const resetAutoplay = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            goToNext();
        }, autoplayInterval);
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            // Se atingiu o fim, volta para o início
            if (prevIndex >= totalSlides - visibleSlides) {
                return 0;
            }
            return prevIndex + 1;
        });
    }, [totalSlides, visibleSlides]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            // Se está no início, vai para o fim
            if (prevIndex <= 0) {
                return Math.max(0, totalSlides - visibleSlides);
            }
            return prevIndex - 1;
        });
    }, [totalSlides, visibleSlides]);

    // Handlers para gestos de arraste e swipe
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setTouchStartTime(Date.now());
        e.preventDefault();
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setTouchStartTime(Date.now());
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const newOffset = currentX - dragStartX;
        setDragOffset(newOffset);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const newOffset = currentX - dragStartX;
        setDragOffset(newOffset);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        const dragDuration = Date.now() - touchStartTime;
        const dragThreshold = cardWidth.current * 0.4;
        const velocityThreshold = 0.5; // pixels por ms
        const velocity = Math.abs(dragOffset) / dragDuration;

        if (Math.abs(dragOffset) > dragThreshold || velocity > velocityThreshold) {
            if (dragOffset > 0) {
                goToPrev();
            } else {
                goToNext();
            }
        }

        setIsDragging(false);
        setDragOffset(0);
    };

    // Não mostra o carousel se não houver propriedades
    if (properties.length === 0) {
        if (showEmptyState) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-neutral-500 text-lg">{emptyStateMessage}</p>
                </div>
            );
        }
        return null;
    }

    // Se a opção grid estiver selecionada, renderiza um grid em vez de carrossel
    if (variant === 'grid') {
        return (
            <div className={cn('w-full', className)}>
                {/* Cabeçalho do carrossel */}
                {renderHeader()}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCardUnified
                            key={property.id}
                            {...property}
                            className={property.isPremium ? "border-2 border-primary-500" : ""}
                        />
                    ))}
                </div>

                {/* Link para ver todos */}
                {renderViewAllLink()}
            </div>
        );
    }

    function renderHeader() {
        return (
            <>
                {(title || subtitle) && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                {title && (
                                    <h2 className="text-3xl font-bold text-neutral-900 mb-1">
                                        {title}
                                    </h2>
                                )}
                                {subtitle && (
                                    <p className="text-neutral-600">{subtitle}</p>
                                )}
                            </div>

                            {viewAllLink && variant !== 'grid' && (
                                <Link
                                    href={viewAllLink}
                                    className="hidden md:flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors"
                                >
                                    {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </>
        );
    }

    function renderViewAllLink() {
        return (
            <>
                {viewAllLink && (
                    <div className="mt-8 text-center">
                        <Link
                            href={viewAllLink}
                            className="md:hidden inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 font-medium transition-colors shadow-sm"
                        >
                            {viewAllLabel} <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                )}
            </>
        );
    }

    const containerStyle = {
        transform: `translateX(calc(-${currentIndex * (100 / visibleSlides)}% + ${dragOffset}px))`,
    };

    return (
        <div className={cn('w-full', className)}>
            {/* Cabeçalho do carrossel */}
            {renderHeader()}

            {/* Carrossel */}
            <div className="relative">
                {/* Container dos slides */}
                <div
                    ref={containerRef}
                    className="overflow-hidden touch-pan-y select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleDragEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={containerStyle}
                    >
                        {properties.map((property, index) => (
                            <div
                                key={property.id}
                                className="px-3"
                                style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}
                            >                                <PropertyCardUnified
                                    {...property}
                                    className={cn(
                                        variant === 'compact' && 'h-64',
                                        variant === 'featured' && property.isPremium && 'border-2 border-primary-500'
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controles */}
                {showControls && totalSlides > visibleSlides && (
                    <>
                        <button
                            onClick={goToPrev}
                            className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3",
                                "shadow-lg hover:bg-neutral-50 transition-all border border-neutral-100 z-10",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                                "disabled:opacity-40 disabled:pointer-events-none",
                                currentIndex <= 0 && "opacity-60"
                            )}
                            aria-label="Anterior"
                            disabled={currentIndex <= 0}
                        >
                            <ChevronLeft className="h-5 w-5 text-neutral-600" />
                        </button>
                        <button
                            onClick={goToNext}
                            className={cn(
                                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3",
                                "shadow-lg hover:bg-neutral-50 transition-all border border-neutral-100 z-10",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                                "disabled:opacity-40 disabled:pointer-events-none",
                                currentIndex >= totalSlides - visibleSlides && "opacity-60"
                            )}
                            aria-label="Próximo"
                            disabled={currentIndex >= totalSlides - visibleSlides}
                        >
                            <ChevronRight className="h-5 w-5 text-neutral-600" />
                        </button>
                    </>
                )}

                {/* Indicadores de página */}
                {totalSlides > visibleSlides && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: totalSlides - visibleSlides + 1 }).map((_, i) => (
                            <button
                                key={i}
                                className={cn(
                                    'w-2.5 h-2.5 rounded-full transition-all',
                                    currentIndex === i
                                        ? 'bg-primary-500 w-6'
                                        : 'bg-neutral-300 hover:bg-neutral-400'
                                )}
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`Ir para página ${i + 1}`}
                                aria-current={currentIndex === i ? 'page' : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Link para ver todos em mobile */}
            {renderViewAllLink()}
        </div>
    );
}

export default PropertyCarousel; 