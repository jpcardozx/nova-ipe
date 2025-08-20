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
        <div className="mb-6 sm:mb-8">
            {/* Enhanced Title with gradient text */}
            <div className="relative mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        {title}
                    </span>
                </h1>
                {/* Subtle underline effect */}
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full opacity-80"></div>
            </div>

            {/* Enhanced Location with glass background */}
            <div className="group relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-white/60 to-slate-50/80 rounded-xl backdrop-blur-sm"></div>
                <div className="relative flex items-center gap-3 p-3 sm:p-4">
                    <div className="relative">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                        {/* Icon glow effect */}
                        <MapPin className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-amber-400 opacity-0 group-hover:opacity-40 transition-all duration-300 blur-sm scale-125" />
                    </div>
                    <span className="text-base sm:text-lg font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                        {location}
                    </span>
                </div>
                {/* Subtle border highlight */}
                <div className="absolute inset-0 border border-slate-200/60 rounded-xl group-hover:border-amber-300/40 transition-colors duration-300"></div>
            </div>

            {/* Premium Price Display with advanced styling */}
            <div className="relative group">
                {/* Multiple background layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-amber-200/30 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/30 via-transparent to-amber-300/20 rounded-2xl group-hover:from-yellow-50/40 group-hover:to-amber-200/30 transition-all duration-300"></div>

                {/* Animated border */}
                <div className="absolute inset-0 border-2 border-amber-200/60 rounded-2xl group-hover:border-amber-300/80 transition-all duration-300"></div>
                <div className="absolute inset-0 border border-amber-300/20 rounded-2xl group-hover:border-amber-400/30 transition-all duration-300"></div>

                {/* Inner glow effect */}
                <div className="absolute inset-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                <div className="relative p-6 sm:p-8">
                    {/* Price with enhanced typography */}
                    <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                        <div className="relative">
                            <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 bg-clip-text text-transparent">
                                {formatarMoeda(price)}
                            </span>
                            {/* Price glow effect */}
                            <span className="absolute inset-0 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-600 opacity-0 group-hover:opacity-20 transition-all duration-300 blur-sm">
                                {formatarMoeda(price)}
                            </span>
                        </div>
                        {propertyType === 'rent' && (
                            <span className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium">
                                /mês
                            </span>
                        )}
                    </div>

                    {propertyType === 'rent' && (
                        <div className="relative">
                            <p className="text-xs sm:text-sm text-amber-800/80 font-medium flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                                Valor pode variar conforme negociação
                            </p>
                        </div>
                    )}
                </div>

                {/* Subtle floating shadow */}
                <div className="absolute inset-x-4 -bottom-2 h-4 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent rounded-full blur-md group-hover:via-amber-500/15 transition-all duration-300"></div>
            </div>
        </div>
    );
}
