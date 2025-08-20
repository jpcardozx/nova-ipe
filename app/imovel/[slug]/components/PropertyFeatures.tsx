'use client';

import React from 'react';
import { Ruler, Bed, Bath, Car } from 'lucide-react';

interface PropertyFeaturesProps {
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
}

export default function PropertyFeatures({
    area,
    bedrooms,
    bathrooms,
    parkingSpots
}: PropertyFeaturesProps) {
    const features = [
        {
            icon: Ruler,
            value: area,
            label: 'm² úteis',
            show: !!area
        },
        {
            icon: Bed,
            value: bedrooms,
            label: bedrooms === 1 ? 'Dormitório' : 'Dormitórios',
            show: bedrooms !== undefined && bedrooms > 0
        },
        {
            icon: Bath,
            value: bathrooms,
            label: bathrooms === 1 ? 'Banheiro' : 'Banheiros',
            show: bathrooms !== undefined && bathrooms > 0
        },
        {
            icon: Car,
            value: parkingSpots,
            label: parkingSpots === 1 ? 'Vaga' : 'Vagas',
            show: parkingSpots !== undefined && parkingSpots > 0
        }
    ].filter(feature => feature.show);

    if (features.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                    <div
                        key={index}
                        className="group text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-md hover:scale-105"
                    >
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-600 mx-auto mb-2 sm:mb-3 group-hover:text-slate-700 transition-colors" />
                        <div className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-900">
                            {feature.value}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                            {feature.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
