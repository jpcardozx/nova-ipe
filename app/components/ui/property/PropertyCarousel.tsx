'use client';

import React from 'react';
import { PropertyCardUnified, PropertyCardUnifiedProps } from './PropertyCardUnified';

interface PropertyCarouselProps {
    properties: PropertyCardUnifiedProps[];
    title?: string;
    subtitle?: string;
    // Added additional props to match usage
    slidesToShow?: number;
    showControls?: boolean;
    className?: string;
    variant?: string;
}

export const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
    properties,
    title,
    subtitle,
    slidesToShow = 3,
    showControls = true,
    className = '',
    variant = 'default'
}) => {
    return (
        <div className={`w-full ${className}`}>
            {title && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {subtitle && <p className="text-gray-600">{subtitle}</p>}
                </div>
            )}

            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                {properties.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-72">
                        <PropertyCardUnified {...property} />
                    </div>
                ))}

                {properties.length === 0 && (
                    <div className="flex items-center justify-center w-full p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Nenhuma propriedade encontrada</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCarousel;
