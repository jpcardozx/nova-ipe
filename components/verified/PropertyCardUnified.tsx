'use client';

import React from 'react';

// Types básicos para propriedades
export type PropertyType = 'sale' | 'rent' | 'investment';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved';

export interface BasePropertyProps {
    id: string;
    title: string;
    slug: string;
    location?: string;
    city?: string;  // Adicionado suporte para cidade
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
        sanityImage?: any; // Adicionando suporte para imagens do Sanity
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

// Componente simplificado para resolver erros de compilação
const PropertyCardUnified: React.FC<PropertyCardUnifiedProps> = ({
    id,
    title,
    location,
    price,
    area,
    bedrooms,
    bathrooms,
    propertyType,
    mainImage,
    isPremium,
    isNew,
    isFavorite,
    onFavoriteToggle,
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            <div className="relative h-48 bg-gray-200">
                {mainImage?.url ? (
                    <img
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-400">Sem imagem</span>
                    </div>
                )}

                {isPremium && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded">
                        PREMIUM
                    </span>
                )}                {isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
                        NOVO
                    </span>
                )}

                {onFavoriteToggle && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (id) onFavoriteToggle(id);
                        }}
                        className="absolute top-2 right-12 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md transition-all"
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "#ff385c" : "none"} stroke={isFavorite ? "#ff385c" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg truncate">{title}</h3>
                {location && <p className="text-gray-500 text-sm mb-2">{location}</p>}

                <p className="font-semibold text-xl mb-2">
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(price)}
                    {propertyType === 'rent' && <span className="text-sm text-gray-500">/mês</span>}
                </p>

                <div className="flex justify-between text-sm text-gray-600">
                    {area && <span>{area} m²</span>}
                    {bedrooms !== undefined && <span>{bedrooms} {bedrooms === 1 ? 'quarto' : 'quartos'}</span>}
                    {bathrooms !== undefined && <span>{bathrooms} {bathrooms === 1 ? 'banho' : 'banhos'}</span>}
                </div>
            </div>        </div>
    );
};

// Export both as default and named for compatibility
export { PropertyCardUnified };
export default PropertyCardUnified;