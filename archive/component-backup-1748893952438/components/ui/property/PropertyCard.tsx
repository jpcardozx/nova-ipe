'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import {
    BedDouble, Bath, Car, AreaChart,
    Clock, ArrowUpRight, Home, TrendingUp,
    Star, MapPin, Heart
} from 'lucide-react';
import { cn, formatarMoeda } from '@/lib/utils';
import SanityImage from '@/components/SanityImage';

// Fonte otimizada
const montSerrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
});

// Tipos unificados
export type PropertyType = 'rent' | 'sale';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface PropertyCardProps {
    id: string;
    title: string;
    slug: string;
    location?: string;
    city?: string;
    price: number;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
        responsive?: Record<string, string>;
        hotspot?: {
            x: number;
            y: number;
        };
        blurDataUrl?: string;
    };
    status?: PropertyStatus;
    isHighlight?: boolean;
    isPremium?: boolean;
    isNew?: boolean;
    isFavorite?: boolean;
    className?: string;
    priority?: boolean;
    onFavoriteToggle?: (id: string) => void;
    onAddToFavorites?: (id: string) => void;
}

// Função para formatar o preço do imóvel
const formatPropertyPrice = (price: number, propertyType: PropertyType): string => {
    const formattedPrice = formatarMoeda(price);
    return `${formattedPrice}${propertyType === 'rent' ? '/mês' : ''}`;
};

// Componente principal consolidado
export const PropertyCard: React.FC<PropertyCardProps> = ({
    id,
    title,
    slug,
    location,
    city,
    price,
    propertyType,
    area,
    bedrooms,
    bathrooms,
    parkingSpots,
    mainImage,
    status = 'available',
    isHighlight = false,
    isPremium = false,
    isNew = false,
    isFavorite = false,
    className = '',
    priority = false,
    onFavoriteToggle,
    onAddToFavorites
}) => {
    const [favorite, setFavorite] = useState(isFavorite);
    const [loaded, setLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Formatação de preço com memorização
    const formattedPrice = useMemo(() => {
        return formatPropertyPrice(price, propertyType);
    }, [price, propertyType]);

    // Calcula tamanhos apropriados para carregamento responsivo de imagens
    const imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    // Handler para favoritos
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setFavorite(!favorite);

        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        } else if (onAddToFavorites) {
            onAddToFavorites(id);
        }
    };

    // Variantes de animação
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.1
            }
        }
    };

    const badgeVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className={cn(
                `group relative overflow-hidden bg-white rounded-2xl border shadow-md hover:shadow-xl transition-all duration-500 ${montSerrat.className}`,
                isPremium ? 'border-amber-200 ring-2 ring-amber-100' : 'border-gray-100',
                isHighlight ? 'ring-2 ring-primary-200 border-primary-300' : '',
                className
            )}
        >
            <Link href={`/imoveis/${slug}`} className="block">
                {/* Container da imagem */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <SanityImage
                        image={mainImage}
                        alt={mainImage.alt || title}
                        fill
                        sizes={imageSizes}
                        priority={priority || isHighlight || isPremium}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onLoad={() => setLoaded(true)}
                    />

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                        {isPremium && (
                            <motion.div
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                                className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg"
                            >
                                <Star className="w-3 h-3 fill-current" />
                                Premium
                            </motion.div>
                        )}

                        {isNew && (
                            <motion.div
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                                className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg"
                            >
                                Novo
                            </motion.div>
                        )}

                        {isHighlight && (
                            <motion.div
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                                className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg"
                            >
                                <TrendingUp className="w-3 h-3" />
                                Destaque
                            </motion.div>
                        )}

                        {status && status !== 'available' && (
                            <motion.div
                                variants={badgeVariants}
                                initial="initial"
                                animate="animate"
                                className={cn(
                                    "px-2 py-1 rounded-md text-xs font-semibold shadow-lg",
                                    status === 'sold' ? 'bg-red-500 text-white' :
                                        status === 'rented' ? 'bg-orange-500 text-white' :
                                            status === 'pending' ? 'bg-yellow-500 text-white' :
                                                'bg-gray-500 text-white'
                                )}
                            >
                                {status === 'sold' ? 'Vendido' :
                                    status === 'rented' ? 'Alugado' :
                                        status === 'pending' ? 'Pendente' : status}
                            </motion.div>
                        )}
                    </div>

                    {/* Botão de favorito */}
                    <motion.button
                        onClick={handleFavoriteClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-10 hover:bg-white transition-colors duration-200"
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4 transition-colors duration-200",
                                favorite ? "fill-red-500 text-red-500" : "text-gray-600"
                            )}
                        />
                    </motion.button>

                    {/* Ícone de link no hover */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: hovered ? 1 : 0,
                            scale: hovered ? 1 : 0.8
                        }}
                        className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                    >
                        <ArrowUpRight className="w-4 h-4 text-gray-700" />
                    </motion.div>
                </div>

                {/* Conteúdo do card */}
                <div className="p-5">
                    {/* Localização */}
                    {(location || city) && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                                {location}{city && location ? `, ${city}` : city}
                            </span>
                        </div>
                    )}

                    {/* Título */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                        {title}
                    </h3>                    {/* Preço */}
                    <div className="mb-4">
                        <div className="text-2xl font-bold text-primary-600">
                            {formattedPrice}
                        </div>
                        {propertyType === 'rent' && (
                            <div className="text-xs text-green-600 font-medium flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                ROI estimado: ~7.2% a.a.
                            </div>
                        )}
                        {propertyType === 'sale' && (
                            <div className="text-xs text-amber-600 font-medium flex items-center mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Valorização média: 9% a.a.
                            </div>
                        )}
                    </div>

                    {/* Características */}
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                        <div className="flex items-center gap-4">
                            {area && (
                                <div className="flex items-center gap-1">
                                    <AreaChart className="w-4 h-4" />
                                    <span>{area}m²</span>
                                </div>
                            )}
                            {bedrooms && (
                                <div className="flex items-center gap-1">
                                    <BedDouble className="w-4 h-4" />
                                    <span>{bedrooms}</span>
                                </div>
                            )}
                            {bathrooms && (
                                <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4" />
                                    <span>{bathrooms}</span>
                                </div>
                            )}
                            {parkingSpots && (
                                <div className="flex items-center gap-1">
                                    <Car className="w-4 h-4" />
                                    <span>{parkingSpots}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// Export padrão
export default PropertyCard;