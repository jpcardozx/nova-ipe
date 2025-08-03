'use client';

import React from 'react';

interface FallbackPropertyCardProps {
    title?: string;
    price?: number;
    location?: string;
    slug?: string;
    property?: any;
    error?: Error;
    className?: string;
    mainImage?: {
        url?: string;
        alt?: string;
        blurDataURL?: string;
    };
}

/**
 * FallbackPropertyCard - A simple fallback component to use when PropertyCard fails
 */
export default function FallbackPropertyCard({
    title = 'Imóvel',
    price,
    location,
    slug,
    mainImage,
    property,
    error,
    className = ''
}: FallbackPropertyCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="relative h-48 bg-gray-200">
                {mainImage?.url ? (
                    <img
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-400">Imagem não disponível</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg truncate">{title}</h3>
                {location && <p className="text-gray-500 text-sm mb-2">{location}</p>}

                {typeof price === 'number' && (
                    <p className="font-semibold text-xl mb-2">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(price)}
                    </p>
                )}

                <a
                    href={`/imovel/${slug}`}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Ver detalhes
                </a>
            </div>
        </div>
    );
}

