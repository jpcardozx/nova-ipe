'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyDescriptionProps {
    description?: string;
    amenities?: string[];
}

export default function PropertyDescription({
    description,
    amenities = []
}: PropertyDescriptionProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);

    if (!description && amenities.length === 0) return null;

    const shouldTruncateDescription = description && description.length > 200;
    const shouldTruncateAmenities = amenities.length > 6;

    const visibleAmenities = isAmenitiesExpanded ? amenities : amenities.slice(0, 6);

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Descrição */}
            {description && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Sobre o Imóvel
                    </h3>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                            {shouldTruncateDescription && !isDescriptionExpanded
                                ? `${description.substring(0, 200)}...`
                                : description
                            }
                        </p>
                    </div>

                    {shouldTruncateDescription && (
                        <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="mt-3 sm:mt-4 flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            {isDescriptionExpanded ? (
                                <>
                                    <span>Ver menos</span>
                                    <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <span>Ver mais</span>
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Comodidades */}
            {amenities.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Comodidades
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {visibleAmenities.map((amenity, index) => (
                            <div
                                key={index}
                                className="flex items-center p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700 font-medium">
                                    {amenity}
                                </span>
                            </div>
                        ))}
                    </div>

                    {shouldTruncateAmenities && (
                        <button
                            onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                            className="mt-4 sm:mt-6 flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            {isAmenitiesExpanded ? (
                                <>
                                    <span>Ver menos comodidades</span>
                                    <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <span>Ver todas as comodidades ({amenities.length})</span>
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
