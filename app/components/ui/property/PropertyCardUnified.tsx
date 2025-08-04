'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Eye, Heart, Star } from 'lucide-react';

// Types básicos para propriedades
export type PropertyType = 'sale' | 'rent' | 'investment';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved';

export interface BasePropertyProps {
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
    status?: PropertyStatus;
    mainImage?: {
        url: string;
        alt?: string;
        blurDataURL?: string;
        sanityImage?: any;
    };
    isHighlight?: boolean;
    isPremium?: boolean;
    isNew?: boolean;
}

export interface PropertyCardUnifiedProps extends BasePropertyProps {
    className?: string;
    onClick?: () => void;
    featuredPosition?: number;
    isFavorite?: boolean;
    onFavoriteToggle?: (id: string) => void;
}

const PropertyCardUnified: React.FC<PropertyCardUnifiedProps> = ({
    id,
    title,
    slug,
    location,
    price,
    area,
    bedrooms,
    bathrooms,
    parkingSpots,
    propertyType,
    mainImage,
    isPremium,
    isNew,
    isHighlight,
    isFavorite,
    onFavoriteToggle,
    className = '',
}) => {
    const propertyUrl = `/imovel/${slug}`;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 ${className}`}>
            {/* Container da Imagem */}
            <div className="relative h-56 overflow-hidden">
                {mainImage?.url ? (
                    <img
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200">
                        <div className="text-center">
                            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <span className="text-slate-500 text-sm">Imagem em breve</span>
                        </div>
                    </div>
                )}

                {/* Overlay com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isPremium && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                            PREMIUM
                        </span>
                    )}
                    {isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                            NOVO
                        </span>
                    )}
                    {isHighlight && (
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            DESTAQUE
                        </span>
                    )}
                </div>

                {/* Botão de Favorito */}
                {onFavoriteToggle && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (id) onFavoriteToggle(id);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 group-hover:scale-110"
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-600 hover:text-red-500'
                                }`}
                        />
                    </button>
                )}

                {/* Tipo de Propriedade */}
                <div className="absolute bottom-3 right-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${propertyType === 'sale'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-blue-500/90 text-white'
                        }`}>
                        {propertyType === 'sale' ? 'VENDA' : 'ALUGUEL'}
                    </span>
                </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-5">
                {/* Preço */}
                <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                            {formatPrice(price)}
                        </span>
                        {propertyType === 'rent' && (
                            <span className="text-sm text-slate-500 font-medium">/mês</span>
                        )}
                    </div>
                </div>

                {/* Título */}
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
                    {title}
                </h3>

                {/* Localização */}
                {location && (
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <p className="text-slate-600 text-sm truncate">{location}</p>
                    </div>
                )}

                {/* Características */}
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-4">
                        {area && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{area} m²</span>
                            </div>
                        )}
                        {bedrooms !== undefined && (
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span>{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms !== undefined && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{bathrooms}</span>
                            </div>
                        )}
                        {parkingSpots !== undefined && parkingSpots > 0 && (
                            <div className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                <span>{parkingSpots}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão de Ver Mais */}
                <Link
                    href={propertyUrl}
                    className="block w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-500 hover:to-amber-600 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    Ver Detalhes
                </Link>
            </div>
        </div>
    );
};

// Export both as default and named for compatibility
export { PropertyCardUnified };
export default PropertyCardUnified;