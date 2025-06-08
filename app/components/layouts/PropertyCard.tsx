'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Home, Maximize2, BedDouble, Bath, Star, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/app/types/property';

interface PropertyCardProps {
    property: Property;
    variant?: 'grid' | 'horizontal' | 'featured' | 'compact' | 'carousel';
}

export default function PropertyCard({
    property,
    variant = 'grid'
}: PropertyCardProps) {
    // Extrair dados da propriedade com fallbacks seguros
    const {
        id,
        title,
        description,
        price,
        priceFormatted,
        location,
        bedrooms,
        bathrooms,
        area,
        photos,
        featured,
        slug,
        transactionType,
        propertyType
    } = property;

    // Formatações e valores default
    const imageUrl = photos && photos.length > 0 ? photos[0].url : '/images/property-placeholder.jpg';
    const formattedPrice = priceFormatted || `R$ ${price?.toLocaleString('pt-BR') || '---'}`; const formattedArea = area ? `${area} m²` : '---';
    const shortDescription = description && description.length > 120
        ? `${description.substring(0, 120)}...`
        : description; const displayLocation = typeof location === 'object' && location?.neighborhood
            ? `${location.neighborhood}${location.city ? `, ${location.city}` : ''}`
            : (typeof location === 'object' && location?.city ? location.city : (typeof location === 'string' ? location : '---'));

    // Determinar o tipo de transação para mostrar o badge apropriado
    const getBadgeText = () => {
        if (transactionType === 'sale') return 'Venda';
        if (transactionType === 'rent') return 'Aluguel';
        return 'Destaque';
    };

    const getBadgeColor = () => {
        if (transactionType === 'sale') return 'bg-amber-700 text-white';
        if (transactionType === 'rent') return 'bg-blue-700 text-white';
        return 'bg-emerald-700 text-white';
    };

    // Retorna as tags apropriadas para o tipo de propriedade
    const renderPropertyType = () => {
        if (!propertyType) return null;

        const getIcon = () => {
            switch (propertyType.toLowerCase()) {
                case 'apartamento':
                    return <Building2 className="w-3 h-3 mr-1" />;
                case 'casa':
                    return <Home className="w-3 h-3 mr-1" />;
                case 'comercial':
                    return <Building2 className="w-3 h-3 mr-1" />;
                default:
                    return <Home className="w-3 h-3 mr-1" />;
            }
        };

        return (
            <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {getIcon()}
                {propertyType}
            </div>
        );
    };

    // Determinar o layout baseado no variant
    if (variant === 'horizontal') {
        return (
            <Link href={`/imoveis/${slug || id}`}>
                <div className="flex bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="w-1/3 relative">
                        <Image
                            src={imageUrl}
                            alt={title || 'Imóvel'}
                            width={150}
                            height={120}
                            className="object-cover h-full w-full"
                        />
                        <div className="absolute top-2 left-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeColor()}`}>
                                {getBadgeText()}
                            </span>
                        </div>
                    </div>
                    <div className="w-2/3 p-3">
                        <div className="flex flex-col h-full">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
                            <div className="flex items-center text-gray-500 text-xs gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">{displayLocation}</span>
                            </div>
                            <div className="mt-auto flex justify-between items-center">
                                <p className="font-bold text-amber-700">{formattedPrice}</p>
                                <div className="flex space-x-2">
                                    {bedrooms != null && (
                                        <span className="flex items-center text-xs text-gray-600">
                                            <BedDouble className="w-3 h-3 mr-1" />
                                            {bedrooms}
                                        </span>
                                    )}
                                    {bathrooms != null && (
                                        <span className="flex items-center text-xs text-gray-600">
                                            <Bath className="w-3 h-3 mr-1" />
                                            {bathrooms}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'featured') {
        return (
            <Link href={`/imoveis/${slug || id}`}>
                <div className="group relative h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <div className="relative h-72">
                        <Image
                            src={imageUrl}
                            alt={title || 'Imóvel em destaque'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                        <div className="absolute top-4 left-4 flex space-x-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor()}`}>
                                {getBadgeText()}
                            </span>
                            {featured && (
                                <span className="flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-800">
                                    <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                    Destaque
                                </span>
                            )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                            <div className="flex items-center text-amber-100 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{displayLocation}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-bold text-white">{formattedPrice}</p>
                                <div className="flex space-x-3">
                                    {bedrooms != null && (
                                        <span className="flex items-center text-sm text-white">
                                            <BedDouble className="w-4 h-4 mr-1" />
                                            {bedrooms}
                                        </span>
                                    )}
                                    {bathrooms != null && (
                                        <span className="flex items-center text-sm text-white">
                                            <Bath className="w-4 h-4 mr-1" />
                                            {bathrooms}
                                        </span>
                                    )}
                                    {area && (
                                        <span className="flex items-center text-sm text-white">
                                            <Maximize2 className="w-4 h-4 mr-1" />
                                            {formattedArea}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex gap-2 mb-3">
                            {renderPropertyType()}                            <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                <MapPin className="w-3 h-3 mr-1" />
                                {displayLocation}
                            </div>
                        </div>
                        <p className="text-gray-600 line-clamp-3 mb-4">{shortDescription || 'Entre em contato para mais informações sobre este imóvel.'}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                                {bedrooms != null && (
                                    <div className="flex flex-col items-center">
                                        <span className="flex items-center text-gray-700">
                                            <BedDouble className="w-4 h-4 mr-1" />
                                            {bedrooms}
                                        </span>
                                        <span className="text-xs text-gray-500">Quartos</span>
                                    </div>
                                )}
                                {bathrooms != null && (
                                    <div className="flex flex-col items-center">
                                        <span className="flex items-center text-gray-700">
                                            <Bath className="w-4 h-4 mr-1" />
                                            {bathrooms}
                                        </span>
                                        <span className="text-xs text-gray-500">Banheiros</span>
                                    </div>
                                )}
                                {area && (
                                    <div className="flex flex-col items-center">
                                        <span className="flex items-center text-gray-700">
                                            <Maximize2 className="w-4 h-4 mr-1" />
                                            {formattedArea}
                                        </span>
                                        <span className="text-xs text-gray-500">Área</span>
                                    </div>
                                )}
                            </div>
                            <button className="text-amber-700 hover:text-amber-800 font-medium text-sm transition-colors">
                                Ver detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={`/imoveis/${slug || id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                    <div className="relative h-36">
                        <Image
                            src={imageUrl}
                            alt={title || 'Imóvel'}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getBadgeColor()}`}>
                                {getBadgeText()}
                            </span>
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-gray-900 line-clamp-1 text-sm">{title}</h3>
                        <div className="flex items-center text-gray-500 text-xs mt-1 mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{displayLocation}</span>
                        </div>
                        <p className="font-bold text-amber-700 text-sm">{formattedPrice}</p>
                        <div className="flex space-x-3 mt-2 text-xs text-gray-600">
                            {bedrooms != null && (
                                <span className="flex items-center">
                                    <BedDouble className="w-3 h-3 mr-1" />
                                    {bedrooms}
                                </span>
                            )}
                            {bathrooms != null && (
                                <span className="flex items-center">
                                    <Bath className="w-3 h-3 mr-1" />
                                    {bathrooms}
                                </span>
                            )}
                            {area && (
                                <span className="flex items-center">
                                    <Maximize2 className="w-3 h-3 mr-1" />
                                    {formattedArea}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'carousel') {
        return (
            <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt={title || 'Imóvel em destaque'}
                        fill
                        className="object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                <div className="relative h-full flex flex-col p-6">
                    <div className="mt-auto">
                        <div className="flex gap-2 mb-3">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor()}`}>
                                {getBadgeText()}
                            </span>
                            {featured && (
                                <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-amber-500/80 text-white">
                                    <Star className="w-3 h-3 mr-1 fill-white text-white" />
                                    Premium
                                </span>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>

                        <div className="flex items-center text-amber-200 mb-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{displayLocation}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6 text-white">
                            {bedrooms != null && (
                                <div className="flex items-center">
                                    <BedDouble className="w-5 h-5 mr-2 opacity-80" />
                                    <div>
                                        <p className="text-sm font-medium">{bedrooms}</p>
                                        <p className="text-xs text-gray-300">Quartos</p>
                                    </div>
                                </div>
                            )}

                            {bathrooms != null && (
                                <div className="flex items-center">
                                    <Bath className="w-5 h-5 mr-2 opacity-80" />
                                    <div>
                                        <p className="text-sm font-medium">{bathrooms}</p>
                                        <p className="text-xs text-gray-300">Banheiros</p>
                                    </div>
                                </div>
                            )}

                            {area && (
                                <div className="flex items-center">
                                    <Maximize2 className="w-5 h-5 mr-2 opacity-80" />
                                    <div>
                                        <p className="text-sm font-medium">{formattedArea}</p>
                                        <p className="text-xs text-gray-300">Área</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Valor</p>
                                <p className="text-2xl font-bold text-white">{formattedPrice}</p>
                            </div>

                            <Link
                                href={`/imoveis/${slug || id}`}
                                className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                Ver detalhes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default grid layout
    return (
        <Link href={`/imoveis/${slug || id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full border border-gray-100 flex flex-col"
            >
                <div className="relative h-48">
                    <Image
                        src={imageUrl}
                        alt={title || 'Imóvel'}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor()}`}>
                            {getBadgeText()}
                        </span>
                        {featured && (
                            <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-amber-100/90 text-amber-800">
                                <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                Destaque
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                        {renderPropertyType()}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{title}</h3>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">{displayLocation}</span>
                    </div>

                    {description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{shortDescription}</p>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                        <p className="font-bold text-amber-700">{formattedPrice}</p>

                        <div className="flex space-x-3">
                            {bedrooms != null && (
                                <span className="flex items-center text-sm text-gray-600">
                                    <BedDouble className="w-4 h-4 mr-1" />
                                    {bedrooms}
                                </span>
                            )}

                            {bathrooms != null && (
                                <span className="flex items-center text-sm text-gray-600">
                                    <Bath className="w-4 h-4 mr-1" />
                                    {bathrooms}
                                </span>
                            )}

                            {area && (
                                <span className="flex items-center text-sm text-gray-600">
                                    <Maximize2 className="w-4 h-4 mr-1" />
                                    {formattedArea}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
