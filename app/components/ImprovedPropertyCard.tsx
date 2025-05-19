'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import SimpleResponsiveImage from './SimpleResponsiveImage';
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

export interface ImprovedPropertyCardProps {
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
export default function ImprovedPropertyCard({
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
    onFavoriteToggle,
}: ImprovedPropertyCardProps) {
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />

                    {/* Tag de destaque ou Novo */}
                    {isNew && (
                        <div className="absolute top-3 left-3 z-20 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Clock className="w-3 h-3" />
                            <span>Novo</span>
                        </div>
                    )}

                    {isPremium && !isNew && (
                        <div className="absolute top-3 left-3 z-20 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3" />
                            <span>Destaque</span>
                        </div>
                    )}

                    {/* Tipo do imóvel */}
                    <div className={cn(
                        "absolute top-3 right-3 z-20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md",
                        propertyType === 'rent' ? "bg-blue-600/80" : "bg-amber-500/80"
                    )}>
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
                    </div>                    {/* Imagem principal com componente simplificado */}
                    <SimpleResponsiveImage
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        quality={isPremium ? 90 : 80}
                        priority={isHighlight}
                        objectFit="cover"
                        objectPosition={mainImage.hotspot ? `${mainImage.hotspot.x * 100}% ${mainImage.hotspot.y * 100}%` : 'center'}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        fallbackSrc="/images/property-placeholder.jpg"
                    />

                    {/* Preço do imóvel destacado na imagem */}
                    <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/80 to-transparent py-3 px-4">
                        <p className="text-white font-bold text-lg drop-shadow-md">
                            {formatPropertyPrice(price, propertyType)}
                        </p>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                    {/* Título e Localização */}
                    <div className="mb-4">
                        <h3 className="text-gray-800 font-bold text-lg leading-snug mb-2 line-clamp-2">
                            {title}
                        </h3>
                        {location && (
                            <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                    {city ? `${location}, ${city}` : location}
                                </span>
                            </div>
                        )}
                    </div>                    {/* Características em grade melhorada */}
                    <div className="py-3 px-1 mb-2 border-y border-gray-100">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-1.5 bg-amber-50 rounded-full text-amber-600 mb-1">
                                    <BedDouble className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium">{bedrooms || '-'}</span>
                                <span className="text-[10px] text-gray-500">Quartos</span>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-1.5 bg-blue-50 rounded-full text-blue-600 mb-1">
                                    <Bath className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium">{bathrooms || '-'}</span>
                                <span className="text-[10px] text-gray-500">Banheiros</span>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-1.5 bg-gray-100 rounded-full text-gray-600 mb-1">
                                    <Car className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium">{parkingSpots || '-'}</span>
                                <span className="text-[10px] text-gray-500">Vagas</span>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-1.5 bg-green-50 rounded-full text-green-600 mb-1">
                                    <AreaChart className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium">{area || '-'}</span>
                                <span className="text-[10px] text-gray-500">m²</span>
                            </div>
                        </div>
                    </div>

                    {/* Botão de "Ver Detalhes" */}
                    <div className="mt-auto text-right">
                        <div className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
                            Ver detalhes
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Botão de Favorito (opcional) */}
            {onFavoriteToggle && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavoriteToggle(id);
                    }}
                    className="absolute top-12 right-3 z-30 bg-white rounded-full p-1.5 shadow-md transition-all hover:bg-amber-50"
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-colors",
                            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                        )}
                    />
                </button>
            )}

            {/* Contorno premium para imóveis em destaque */}
            {isPremium && (
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-300 opacity-30 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            )}
        </motion.div>
    );
}
