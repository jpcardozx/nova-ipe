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
import PropertyCard from '@/lib/components/ui/PropertyCard';

// Função para transformar dados para PropertyCard
const transformToPropertyCard = (imovel: ImovelClient, type: 'sale' | 'rent') => ({
    id: imovel._id,
    title: imovel.titulo || 'Imóvel disponível',
    price: imovel.preco || 0,
    location: imovel.bairro || imovel.cidade || 'Guararema',
    imageUrl: imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg',
    bedrooms: imovel.dormitorios,
    bathrooms: imovel.banheiros,
    parkingSpots: imovel.vagas,
    area: imovel.areaUtil,
    slug: imovel.slug || '',
    purpose: type,
});

// Carrossel Mobile-First
const ResponsiveCarousel: React.FC<{
    children: React.ReactNode[];
    className?: string;
}> = ({ children, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const checkScrollPosition = () => {
        if (!containerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!containerRef.current) return;

        const cardWidth = containerRef.current.querySelector('[data-card]')?.clientWidth || 300;
        const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

        containerRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        checkScrollPosition();
        container.addEventListener('scroll', checkScrollPosition);

        return () => container.removeEventListener('scroll', checkScrollPosition);
    }, [children]);

    return (
        <div className={cn("relative", className)}>
            {/* Navegação Desktop */}
            <div className="hidden md:flex absolute -top-12 right-0 gap-2 z-10">
                <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        canScrollLeft
                            ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                        canScrollRight
                            ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Container de Cards */}
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        data-card
                        className="flex-none w-[280px] sm:w-[300px] lg:w-[320px]"
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Indicadores Mobile */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(children.length / 1) }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            index === Math.floor(currentIndex)
                                ? "bg-slate-600"
                                : "bg-slate-300"
                        )}
                    />
                ))}
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
    const transformedProperties = displayProperties.map(p => transformToPropertyCard(p, type));

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
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 lg:mb-12">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-600 text-base lg:text-lg">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className={cn(
                                "mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                                "bg-gradient-to-r text-white font-medium transition-all",
                                "hover:shadow-md active:scale-[0.98]",
                                colorScheme
                            )}
                        >
                            Ver Todos
                        </Link>
                    )}
                </div>                {/* Carrossel de Cards */}
                <ResponsiveCarousel>
                    {transformedProperties.map((property) => (
                        <PropertyCard
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
