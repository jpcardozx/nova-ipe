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

// Tipos simplificados
interface SimplePropertyData {
    id: string;
    title: string;
    slug: string;
    price: number;
    location: string;
    image: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parkingSpots?: number;
    type: 'sale' | 'rent';
    isNew?: boolean;
    isFeatured?: boolean;
}

// Função para transformar dados
const transformProperty = (imovel: ImovelClient, type: 'sale' | 'rent'): SimplePropertyData => ({
    id: imovel._id,
    title: imovel.titulo || 'Imóvel disponível',
    slug: imovel.slug || imovel._id,
    price: imovel.preco || 0,
    location: imovel.bairro || imovel.cidade || 'Guararema',
    image: imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '/images/placeholder-property.jpg',
    bedrooms: imovel.dormitorios,
    bathrooms: imovel.banheiros,
    area: imovel.areaUtil,
    parkingSpots: imovel.vagas,
    type,
    isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    isFeatured: Boolean(imovel.destaque)
});

// Formatação de preço
const formatPrice = (price: number, type: 'sale' | 'rent') => {
    if (price === 0) return 'Consulte';

    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);

    return type === 'rent' ? `${formatted}/mês` : formatted;
};

// Card de Propriedade Limpo
const CleanPropertyCard: React.FC<{
    property: SimplePropertyData;
    className?: string;
}> = ({ property, className }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const colorScheme = property.type === 'sale'
        ? 'from-emerald-500 to-green-600'
        : 'from-blue-500 to-indigo-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={cn(
                "bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300",
                "border border-slate-100 overflow-hidden group",
                className
            )}
        >
            {/* Imagem */}
            <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-500 group-hover:scale-105",
                        imageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {property.isNew && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                            Novo
                        </span>
                    )}
                    {property.isFeatured && (
                        <span className={cn(
                            "bg-gradient-to-r text-white text-xs px-2 py-1 rounded-md font-medium",
                            colorScheme
                        )}>
                            Destaque
                        </span>
                    )}
                </div>

                {/* Ações */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLiked(!isLiked);
                        }}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            "bg-white/90 backdrop-blur-sm hover:bg-white",
                            isLiked ? "text-red-500" : "text-slate-600"
                        )}
                    >
                        <Heart size={14} className={isLiked ? "fill-current" : ""} />
                    </button>
                </div>

                {/* Overlay no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                {/* Preço */}
                <div className="mb-3">
                    <span className={cn(
                        "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        colorScheme
                    )}>
                        {formatPrice(property.price, property.type)}
                    </span>
                </div>

                {/* Título */}
                <h3 className="text-slate-800 font-semibold text-base mb-2 line-clamp-2 leading-tight">
                    {property.title}
                </h3>

                {/* Localização */}
                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                </div>

                {/* Características */}
                <div className="flex items-center gap-4 text-slate-600 text-sm">
                    {property.bedrooms && (
                        <div className="flex items-center gap-1">
                            <BedDouble size={14} />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-1">
                            <Bath size={14} />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.area && (
                        <div className="flex items-center gap-1">
                            <Ruler size={14} />
                            <span>{property.area}m²</span>
                        </div>
                    )}
                    {property.parkingSpots && (
                        <div className="flex items-center gap-1">
                            <Car size={14} />
                            <span>{property.parkingSpots}</span>
                        </div>
                    )}
                </div>

                {/* Botão Ver Mais */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <Link
                        href={`/imovel/${property.slug}`}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
                            "bg-gradient-to-r text-white font-medium text-sm transition-all",
                            "hover:shadow-md active:scale-[0.98]",
                            colorScheme
                        )}
                    >
                        <Eye size={14} />
                        Ver Detalhes
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

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
    const transformedProperties = displayProperties.map(p => transformProperty(p, type));

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
                </div>

                {/* Carrossel de Cards */}
                <ResponsiveCarousel>
                    {transformedProperties.map((property) => (
                        <CleanPropertyCard
                            key={property.id}
                            property={property}
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
