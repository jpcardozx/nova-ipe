'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import UltraOptimizedImage from './UltraOptimizedImage';
import OptimizedImageGallery from './OptimizedImageGallery';
import {
    BedDouble, Bath, Car, AreaChart,
    Clock, ArrowUpRight, Home, TrendingUp,
    Star, MapPin, Heart
} from 'lucide-react';
import { cn, formatarMoeda } from '@/lib/utils';

// Fonte otimizada
const montSerrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
});

// Tipos
export type PropertyType = 'rent' | 'sale';

export interface OptimizedPropertyCardProps {
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
        blurDataUrl?: string;
    };
    isHighlight?: boolean;
    isPremium?: boolean;
    isNew?: boolean;
    className?: string;
    status?: string;
    isFavorite?: boolean;
    onFavoriteToggle?: (id: string) => void;
}

// Função para formatar o preço do imóvel com unidade apropriada
const formatPropertyPrice = (price: number, propertyType: PropertyType): string => {
    const formattedPrice = formatarMoeda(price);
    return `${formattedPrice}${propertyType === 'rent' ? '/mês' : ''}`;
};

// Componente principal com otimizações avançadas
export const OptimizedPropertyCard: React.FC<OptimizedPropertyCardProps> = ({
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
    isHighlight = false,
    isPremium = false,
    isNew = false,
    className = '',
    isFavorite = false,
    onFavoriteToggle
}) => {
    // Formatação de preço com memorização para evitar recálculos desnecessários
    const formattedPrice = React.useMemo(() => {
        return formatarMoeda(price);
    }, [price]);

    // Calcula tamanhos apropriados para carregamento responsivo de imagens
    const imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    // Otimize loading priority based on card properties
    const loadingPriority = isHighlight || isPremium ? 'high' : isNew ? 'medium' : 'low';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={cn(
                `group relative overflow-hidden bg-white rounded-2xl border shadow-md hover:shadow-xl transition-all duration-500 ${montSerrat.className}`,
                isPremium ? 'border-amber-200' : 'border-gray-100',
                className
            )}
        >
            {/* Link envolvendo todo o card para melhorar UX */}
            <Link
                href={`/imoveis/${slug}`}
                className="block text-neutral-900 no-underline"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <UltraOptimizedImage
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={isHighlight}
                        loadingPriority={loadingPriority}
                        sizes={imageSizes}
                        height={480}
                        width={640}
                        blurDataURL={mainImage.blurDataUrl}
                        fallbackSrc="/images/property-placeholder.svg"
                        preventCLS={true}
                    />
                    {/* Tags de status */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                        <div className="flex gap-2">
                            {isNew && (
                                <span className="text-caption font-medium text-emerald-700 bg-emerald-50/90 backdrop-blur-sm py-1 px-2.5 rounded-full">
                                    Novo
                                </span>
                            )}
                            {isPremium && (
                                <span className="text-caption font-medium text-amber-700 bg-amber-50/90 backdrop-blur-sm py-1 px-2.5 rounded-full">
                                    Premium
                                </span>
                            )}
                        </div>
                        {propertyType === 'rent' && (
                            <span className="text-caption font-medium text-blue-700 bg-blue-50/90 backdrop-blur-sm py-1 px-2.5 rounded-full">
                                Aluguel
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Localização */}
                    <div className="flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-neutral-400 mt-1 shrink-0" />
                        <div className="text-body-2 text-neutral-600">
                            {location && <span>{location}</span>}
                            {city && (
                                <span className="block text-neutral-400">{city}</span>
                            )}
                        </div>
                    </div>

                    {/* Título e preço */}
                    <div>
                        <h3 className="text-heading-3 text-neutral-900 mb-2 font-medium">
                            {title}
                        </h3>
                        <div className="text-heading-2 text-primary-600 font-semibold">
                            {formattedPrice}
                            {propertyType === 'rent' && (
                                <span className="text-body-2 text-neutral-500 font-normal ml-1">
                                    /mês
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {area && (
                            <div className="flex items-center gap-1.5">
                                <AreaChart className="w-4 h-4 text-neutral-400" />
                                <span className="text-body-2 text-neutral-700">{area}m²</span>
                            </div>
                        )}
                        {bedrooms && (
                            <div className="flex items-center gap-1.5">
                                <BedDouble className="w-4 h-4 text-neutral-400" />
                                <span className="text-body-2 text-neutral-700">{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms && (
                            <div className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4 text-neutral-400" />
                                <span className="text-body-2 text-neutral-700">{bathrooms}</span>
                            </div>
                        )}
                        {parkingSpots && (
                            <div className="flex items-center gap-1.5">
                                <Car className="w-4 h-4 text-neutral-400" />
                                <span className="text-body-2 text-neutral-700">{parkingSpots}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Botão de favorito (se habilitado) */}
            {onFavoriteToggle && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavoriteToggle(id);
                    }}
                    className="absolute top-14 right-3 z-30 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-colors"
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                    <Heart className={cn("w-4 h-4", isFavorite ? "fill-red-500 text-red-500" : "text-gray-400")} />
                </button>
            )}

            {/* Contorno premium para imóveis em destaque */}
            {isPremium && (
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-300 opacity-30 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            )}
        </motion.div>
    );
};

// Default export para mais facilidade de importação
export default OptimizedPropertyCard;
