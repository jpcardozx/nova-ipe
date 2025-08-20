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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                    <div
                        key={index}
                        className="group relative overflow-hidden"
                    >
                        {/* Multiple background layers for sophisticated depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/40 via-transparent to-slate-200/30 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-slate-100/80 rounded-2xl group-hover:from-white/80 group-hover:to-slate-50/90 transition-all duration-500"></div>

                        {/* Animated border with glassmorphism */}
                        <div className="absolute inset-0 border border-slate-200/60 rounded-2xl group-hover:border-slate-300/80 transition-all duration-300"></div>
                        <div className="absolute inset-0 border border-white/40 rounded-2xl"></div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                        {/* Subtle floating shadow */}
                        <div className="absolute inset-x-2 -bottom-1 h-3 bg-gradient-to-r from-transparent via-slate-400/15 to-transparent rounded-full blur-sm group-hover:via-slate-500/20 transition-all duration-300"></div>

                        <div className="relative text-center p-4 sm:p-5 lg:p-7 group-hover:scale-[1.02] transition-all duration-300">
                            {/* Enhanced icon with multiple effects */}
                            <div className="relative mb-3 sm:mb-4">
                                <div className="relative mx-auto w-fit">
                                    {/* Icon background glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 via-slate-500/30 to-slate-400/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                    {/* Primary icon */}
                                    <IconComponent className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-slate-600 group-hover:text-slate-800 group-hover:scale-110 transition-all duration-300" />

                                    {/* Icon reflection effect */}
                                    <IconComponent className="absolute inset-0 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-slate-400 opacity-0 group-hover:opacity-30 transition-all duration-300 blur-sm scale-125" />
                                </div>
                            </div>

                            {/* Enhanced value display */}
                            <div className="relative mb-1 sm:mb-2">
                                <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                                    <span className="relative">
                                        {feature.value}
                                        {/* Value glow */}
                                        <span className="absolute inset-0 font-bold text-xl sm:text-2xl lg:text-3xl text-slate-700 opacity-0 group-hover:opacity-20 transition-all duration-300 blur-sm">
                                            {feature.value}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced label */}
                            <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight group-hover:text-slate-700 transition-colors duration-300">
                                {feature.label}
                            </div>
                        </div>

                        {/* Subtle inner highlight */}
                        <div className="absolute top-1 inset-x-1 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
                    </div>
                );
            })}
        </div>
    );
}
