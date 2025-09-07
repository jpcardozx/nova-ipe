'use client';

import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
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
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                    {title}
                </h1>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-5 h-5" />
                <span className="text-base font-medium">
                    {location}
                </span>
            </div>

            {/* Price Section - Clean and Minimal */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="space-y-3">
                            {/* Main price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    {formatarMoeda(price)}
                                </span>
                                {propertyType === 'rent' && (
                                    <span className="text-lg font-medium text-slate-600">
                                        /mês
                                    </span>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-600">
                                    {propertyType === 'sale' ? 'À venda' : 'Para locação'}
                                </span>
                            </div>

                            {/* Additional info for rent */}
                            {propertyType === 'rent' && (
                                <p className="text-xs text-slate-500">
                                    *Valor sujeito à negociação
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Simple icon */}
                    <div className="hidden sm:block">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                            <DollarSign className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}