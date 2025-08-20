'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils';

interface PropertyMainInfoProps {
    title: string;
    location: string;
    price: number;
    propertyType: 'sale' | 'rent';
}

export default function PropertyMainInfo({
    title,
    location,
    price,
    propertyType
}: PropertyMainInfoProps) {
    return (
        <div className="mb-4 sm:mb-6">
            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 leading-tight">
                {title}
            </h1>

            {/* Localização */}
            <div className="flex items-center gap-2 text-slate-600 mb-4 sm:mb-6">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <span className="text-base sm:text-lg">{location}</span>
            </div>

            {/* Preço Destacado */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 sm:p-6 border border-amber-200">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-amber-700 mb-1 sm:mb-2">
                    {formatarMoeda(price)}
                    {propertyType === 'rent' && (
                        <span className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal ml-2">/mês</span>
                    )}
                </div>
                {propertyType === 'rent' && (
                    <p className="text-xs sm:text-sm text-amber-800">
                        * Valor pode variar conforme negociação
                    </p>
                )}
            </div>
        </div>
    );
}
