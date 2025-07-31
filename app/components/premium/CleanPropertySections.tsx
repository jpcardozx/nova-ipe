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
import MobilePropertyCard from '../MobilePropertyCard';

// Função para transformar dados para MobilePropertyCard
const transformToMobileCard = (imovel: ImovelClient, type: 'sale' | 'rent') => ({
    id: imovel._id,
    title: imovel.titulo || 'Imóvel disponível',
    price: imovel.preco || 0,
    address: imovel.endereco || '',
    location: imovel.bairro || imovel.cidade || 'Guararema',
    images: imovel.galeria?.map(img => ({
        url: img.imagemUrl || '/images/placeholder-property.jpg',
        alt: imovel.titulo || 'Imóvel'
    })) || [],
    mainImage: imovel.imagem ? {
        url: imovel.imagem.imagemUrl || '/images/placeholder-property.jpg',
        alt: imovel.titulo || 'Imóvel'
    } : undefined,
    bedrooms: imovel.dormitorios,
    bathrooms: imovel.banheiros,
    area: imovel.areaUtil,
    parkingSpots: imovel.vagas,
    type,
    isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    featured: Boolean(imovel.destaque),
    isPremium: false // We'll default this to false for now
});

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
    const transformedProperties = displayProperties.map(p => transformToMobileCard(p, type));

    const colorScheme = type === 'sale'
        ? 'from-emerald-500 to-green-600'
        : 'from-blue-500 to-indigo-600';

    if (transformedProperties.length === 0) {
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
        <section className={cn("py-8 lg:py-16", className)}>
            <div className="container mx-auto px-4">
                {/* Enhanced Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 lg:mb-12">
                    <div className="max-w-2xl">
                        <div className="mb-3">
                            <span className={cn(
                                "inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full",
                                type === 'sale' 
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-blue-100 text-blue-700"
                            )}>
                                {type === 'sale' ? '🏠 Para Venda' : '🏢 Para Aluguel'}
                                <span className="bg-white/80 text-xs px-2 py-0.5 rounded-full">
                                    {properties.length} imóveis
                                </span>
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-3 leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-neutral-600 text-lg lg:text-xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                            <Link
                                href={viewAllLink}
                                className={cn(
                                    "inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300",
                                    "bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                                    type === 'sale' 
                                        ? "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                                        : "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                )}
                            >
                                Ver Todos
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contato"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
                            >
                                Consultoria
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>                {/* Carrossel de Cards */}
                <ResponsiveCarousel>
                    {transformedProperties.map((property) => (
                        <MobilePropertyCard
                            key={property.id}
                            {...property}
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
