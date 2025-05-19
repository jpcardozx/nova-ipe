'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import ResponsiveSanityImage from './ResponsiveSanityImage';
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

// Componente principal com otimizações
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
                href={`/imovel/${slug}`}
                className="block h-full"
                aria-label={`Ver detalhes de ${title}`}
            >
                {/* Imagem com otimização de carregamento */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    {/* Overlay gradiente mais suave */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-10" />

                    {/* Tag de destaque ou Novo */}
                    {isNew && (
                        <div className="absolute top-3 left-3 z-20 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3" />
                            <span>Novo</span>
                        </div>
                    )}

                    {isPremium && (
                        <div className="absolute top-3 left-3 z-20 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3" />
                            <span>Destaque</span>
                        </div>
                    )}

                    {/* Tipo do imóvel */}
                    <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md">
                        {propertyType === 'rent' ? (
                            <span className="flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                Aluguel
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Venda
                            </span>
                        )}
                    </div>

                    {/* Imagem principal com componente otimizado */}
                    <ResponsiveSanityImage
                        image={mainImage}
                        alt={mainImage.alt || title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        quality={isPremium ? 90 : 80}
                        priority={isHighlight}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                    {/* Preço destacado */}
                    <div className="mb-3 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                        <p className="text-xl font-bold text-amber-700">
                            {formatPropertyPrice(price, propertyType)}
                        </p>
                    </div>

                    {/* Localização */}
                    {location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span className="truncate">{city ? `${location}, ${city}` : location}</span>
                        </div>
                    )}

                    {/* Título */}
                    <h3 className="text-gray-800 font-semibold line-clamp-2 min-h-[48px] mb-4 text-base">
                        {title}
                    </h3>

                    {/* Características em grid para melhor organização */}
                    <div className="grid grid-cols-2 gap-2">
                        {bedrooms !== undefined && (
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
                                    <BedDouble className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700">{bedrooms} quarto{bedrooms !== 1 ? 's' : ''}</span>
                            </div>
                        )}

                        {bathrooms !== undefined && (
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                                    <Bath className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700">{bathrooms} banheiro{bathrooms !== 1 ? 's' : ''}</span>
                            </div>
                        )}

                        {parkingSpots !== undefined && (
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                <div className="p-1.5 bg-gray-100 rounded-md text-gray-600">
                                    <Car className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700">{parkingSpots} vaga{parkingSpots !== 1 ? 's' : ''}</span>
                            </div>
                        )}

                        {area !== undefined && (
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                <div className="p-1.5 bg-green-50 rounded-md text-green-600">
                                    <AreaChart className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700">{area}m²</span>
                            </div>
                        )}
                    </div>

                    {/* CTA para ver detalhes */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center gap-1 text-amber-600 font-medium text-sm">
                            Ver detalhes
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
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
