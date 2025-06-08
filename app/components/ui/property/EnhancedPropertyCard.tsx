'use client';

import React from 'react';
import { PropertyCardUnifiedProps } from './PropertyCardUnified';

interface EnhancedPropertyCardProps {
    property: any;
    index: number;
    variant: 'default' | 'featured' | 'highlight' | 'masonry' | 'carousel';
    className?: string;
}

// Componente aprimorado que funciona como adaptador para PropertyCardUnified
const EnhancedPropertyCard: React.FC<EnhancedPropertyCardProps> = ({ property, index, variant, className = '' }) => {
    // Extraindo propriedades do objeto property
    const {
        id,
        title,
        location,
        price,
        propertyType,
        mainImage,
        isPremium,
        isNew,
        slug
    } = property;

    return (
        <div className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <div className="relative h-56 bg-gray-200">
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
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                        PREMIUM
                    </span>
                )}

                {isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                        NOVO
                    </span>
                )}
            </div>

            <div className="p-4 bg-white">
                <h3 className="font-bold text-lg truncate">{title}</h3>
                {location && <p className="text-gray-500 text-sm mb-2">{location}</p>}

                <p className="font-semibold text-xl mb-3">
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(price)}
                    {propertyType === 'rent' && <span className="text-sm text-gray-500">/mês</span>}
                </p>

                <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md transition-colors">
                    Ver detalhes
                </button>
            </div>
        </div>
    );
};

export default EnhancedPropertyCard;
