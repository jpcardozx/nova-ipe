'use client';

import React from 'react';
import { Star, TrendingUp, Shield, DollarSign } from 'lucide-react';

interface PropertyBadgesProps {
    isPremium?: boolean;
    isHighlight?: boolean;
    isNew?: boolean;
    propertyType: 'sale' | 'rent';
    documentationOk?: boolean;
    acceptsFinancing?: boolean;
}

export default function PropertyBadges({
    isPremium = false,
    isHighlight = false,
    isNew = false,
    propertyType,
    documentationOk = false,
    acceptsFinancing = false
}: PropertyBadgesProps) {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {isPremium && (
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    PREMIUM
                </span>
            )}

            {isHighlight && (
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    DESTAQUE
                </span>
            )}

            {isNew && (
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg">
                    NOVO
                </span>
            )}

            <span className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg ${propertyType === 'sale'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}>
                {propertyType === 'sale' ? 'VENDA' : 'ALUGUEL'}
            </span>

            {documentationOk && (
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">DOCS OK</span>
                    <span className="sm:hidden">OK</span>
                </span>
            )}

            {acceptsFinancing && (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">FINANCIA</span>
                    <span className="sm:hidden">$$</span>
                </span>
            )}
        </div>
    );
}
