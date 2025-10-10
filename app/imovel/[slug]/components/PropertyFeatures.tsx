'use client';

import React from 'react';
import { Ruler, Home, Bed, Bath, Car } from 'lucide-react';

interface PropertyFeaturesProps {
    area?: number;          // área construída
    totalArea?: number;     // área do terreno
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
}

export default function PropertyFeatures({
    area,
    totalArea,
    bedrooms,
    bathrooms,
    parkingSpots
}: PropertyFeaturesProps) {
    const features = [
        {
            icon: Home,
            value: area,
            label: 'Área Construída',
            unit: 'm²',
            show: !!area,
            color: 'blue',
            priority: 1
        },
        {
            icon: Ruler,
            value: totalArea,
            label: 'Área do Terreno',
            unit: 'm²',
            show: !!totalArea && totalArea !== area,
            color: 'emerald',
            priority: 2
        },
        {
            icon: Bed,
            value: bedrooms,
            label: bedrooms === 1 ? 'Dormitório' : 'Dormitórios',
            unit: '',
            show: bedrooms !== undefined && bedrooms > 0,
            color: 'purple',
            priority: 3
        },
        {
            icon: Bath,
            value: bathrooms,
            label: bathrooms === 1 ? 'Banheiro' : 'Banheiros',
            unit: '',
            show: bathrooms !== undefined && bathrooms > 0,
            color: 'cyan',
            priority: 4
        },
        {
            icon: Car,
            value: parkingSpots,
            label: parkingSpots === 1 ? 'Vaga' : 'Vagas',
            unit: '',
            show: parkingSpots !== undefined && parkingSpots > 0,
            color: 'amber',
            priority: 5
        }
    ].filter(feature => feature.show).sort((a, b) => a.priority - b.priority);

    if (features.length === 0) return null;

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: 'from-blue-50 via-blue-50 to-blue-100',
                border: 'border-blue-200',
                icon: 'text-blue-600',
                text: 'text-blue-900',
                accent: 'bg-blue-500'
            },
            emerald: {
                bg: 'from-emerald-50 via-emerald-50 to-emerald-100',
                border: 'border-emerald-200',
                icon: 'text-emerald-600',
                text: 'text-emerald-900',
                accent: 'bg-emerald-500'
            },
            purple: {
                bg: 'from-purple-50 via-purple-50 to-purple-100',
                border: 'border-purple-200',
                icon: 'text-purple-600',
                text: 'text-purple-900',
                accent: 'bg-purple-500'
            },
            cyan: {
                bg: 'from-cyan-50 via-cyan-50 to-cyan-100',
                border: 'border-cyan-200',
                icon: 'text-cyan-600',
                text: 'text-cyan-900',
                accent: 'bg-cyan-500'
            },
            amber: {
                bg: 'from-amber-50 via-amber-50 to-amber-100',
                border: 'border-amber-200',
                icon: 'text-amber-600',
                text: 'text-amber-900',
                accent: 'bg-amber-500'
            }
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                        <Ruler className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                        Características do Imóvel
                    </h3>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent"></div>
                <span className="text-sm text-slate-500 font-medium">
                    {features.length} {features.length === 1 ? 'característica' : 'características'}
                </span>
            </div>

            <div className={`grid gap-4 ${features.length === 1 ? 'grid-cols-1 max-w-xs' :
                features.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    features.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                }`}>
                {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    const colorClasses = getColorClasses(feature.color);

                    return (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                        >
                            {/* Background gradients */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60"></div>

                            {/* Content */}
                            <div className="relative p-6">
                                {/* Icon section */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        {/* Icon background with glassmorphism */}
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500"></div>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                                        <div className={`relative w-14 h-14 bg-gradient-to-br from-white to-slate-50 rounded-2xl flex items-center justify-center border ${colorClasses.border} group-hover:border-opacity-60 transition-all duration-500`}>
                                            <IconComponent className={`w-6 h-6 ${colorClasses.icon} group-hover:scale-110 transition-transform duration-300`} />
                                        </div>
                                        {/* Accent dot */}
                                        <div className={`absolute -top-1 -right-1 w-4 h-4 ${colorClasses.accent} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100`}></div>
                                    </div>
                                </div>

                                {/* Value and label */}
                                <div className="text-center space-y-2">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className={`text-2xl font-bold ${colorClasses.text} group-hover:scale-105 transition-transform duration-300`}>
                                            {feature.value}
                                        </span>
                                        {feature.unit && (
                                            <span className="text-sm font-semibold text-slate-500">
                                                {feature.unit}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">
                                        {feature.label}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorClasses.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
