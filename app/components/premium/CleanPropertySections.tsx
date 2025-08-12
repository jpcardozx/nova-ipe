'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImovelClient } from '../../../src/types/imovel-client';
import PremiumPropertyCard from '../PremiumPropertyCard';
import PropertyCardOptimized from '../PropertyCardOptimized';

// Seção de Propriedades Limpa
interface CleanPropertySectionProps {
    properties: ImovelClient[];
    title: string;
    subtitle?: string;
    viewAllLink?: string;
    className?: string;
    type: 'sale' | 'rent';
}

// Enhanced Carrossel Mobile-First with Premium Design
const ResponsiveCarousel: React.FC<{
    children: React.ReactNode[];
    className?: string;
}> = ({ children, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scroll = (direction: 'left' | 'right') => {
        const container = containerRef.current;
        if (!container) return;

        const cardWidth = 320; // Width of each card + gap
        const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollToIndex = (index: number) => {
        const container = containerRef.current;
        if (!container) return;

        const cardWidth = 320;
        const scrollPosition = index * cardWidth;

        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    };

    const checkScrollPosition = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Update current index based on scroll position
        const cardWidth = 320;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        checkScrollPosition();
        container.addEventListener('scroll', checkScrollPosition);

        return () => container.removeEventListener('scroll', checkScrollPosition);
    }, [children]);

    if (children.length === 0) return null;

    return (
        <div className={cn("relative", className)}>
            {/* Enhanced Navigation - Desktop */}
            <div className="hidden md:flex absolute -top-16 right-0 gap-3 z-10">
                <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={cn(
                        "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        canScrollLeft
                            ? "bg-white border-neutral-200 text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 shadow-sm hover:shadow-md"
                            : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
                    )}
                    aria-label="Anterior"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={cn(
                        "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        canScrollRight
                            ? "bg-white border-neutral-200 text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 shadow-sm hover:shadow-md"
                            : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
                    )}
                    aria-label="Próximo"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Enhanced Container with better scrolling */}
            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory'
                }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        data-card
                        className="flex-none w-[280px] sm:w-[300px] lg:w-[320px]"
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Enhanced Mobile Indicators */}
            <div className="md:hidden flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(children.length / 1) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            index === Math.floor(currentIndex)
                                ? "bg-primary-500 shadow-sm"
                                : "bg-neutral-300 hover:bg-neutral-400"
                        )}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar for desktop */}
            <div className="hidden md:block mt-6">
                <div className="w-full bg-neutral-200 rounded-full h-1">
                    <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1 rounded-full transition-all duration-300"
                        style={{
                            width: `${Math.min(100, ((currentIndex + 1) / children.length) * 100)}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// Seção de Propriedades Limpa
interface CleanPropertySectionProps {
    properties: ImovelClient[];
    title: string;
    subtitle?: string;
    type: 'sale' | 'rent';
    maxItems?: number;
    viewAllLink?: string;
    className?: string;
}

const CleanPropertySection: React.FC<CleanPropertySectionProps> = ({
    properties,
    title,
    subtitle,
    type,
    maxItems = 6,
    viewAllLink,
    className
}) => {
    const displayProperties = properties.slice(0, maxItems);

    const colorScheme = type === 'sale'
        ? 'from-emerald-500 to-green-600'
        : 'from-blue-500 to-indigo-600';

    if (displayProperties.length === 0) {
        return (
            <section className={cn("py-8 lg:py-12", className)}>
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
                        <p className="text-slate-600 mb-6">
                            Em breve novos imóveis {type === 'sale' ? 'para venda' : 'para aluguel'}
                        </p>
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className={cn(
                                    "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                                    "bg-gradient-to-r text-white font-medium transition-all",
                                    "hover:shadow-md active:scale-[0.98]",
                                    colorScheme
                                )}
                            >
                                Ver Catálogo Completo
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={cn("py-12 lg:py-16", className)}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Enhanced Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 lg:mb-12">
                    <div className="max-w-3xl">
                        <div className="mb-4">
                            <span className={cn(
                                "inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full backdrop-blur-sm",
                                type === 'sale'
                                    ? "bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-700 border border-emerald-200"
                                    : "bg-gradient-to-r from-blue-100 to-indigo-50 text-blue-700 border border-blue-200"
                            )}>
                                {type === 'sale' ? '🏠 Para Venda' : '🏢 Para Aluguel'}
                                <span className="bg-white/90 text-xs px-2 py-0.5 rounded-full shadow-sm">
                                    {properties.length} imóveis
                                </span>
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent mb-4 leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-stone-600 text-lg lg:text-xl leading-relaxed max-w-2xl">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
                            <Link
                                href={viewAllLink}
                                className={cn(
                                    "inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] transform-gpu",
                                    "bg-gradient-to-r text-white backdrop-blur-sm",
                                    type === 'sale'
                                        ? "from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700"
                                        : "from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700"
                                )}
                            >
                                Ver Todos os Imóveis
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contato"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold border-2 border-stone-300 text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 backdrop-blur-sm bg-white/80"
                            >
                                Consultoria Gratuita
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Carrossel de Cards */}
                <ResponsiveCarousel>
                    {displayProperties.map((imovel) => (
                        <PropertyCardOptimized
                            key={imovel._id}
                            imovel={imovel}
                        />
                    ))}
                </ResponsiveCarousel>
            </div>
        </section>
    );
};

// Exportações
export const CleanSalesSection: React.FC<Omit<CleanPropertySectionProps, 'type'>> = (props) => (
    <CleanPropertySection {...props} type="sale" />
);

export const CleanRentalsSection: React.FC<Omit<CleanPropertySectionProps, 'type'>> = (props) => (
    <CleanPropertySection {...props} type="rent" />
);

export default CleanPropertySection;
