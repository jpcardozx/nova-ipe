'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyDescriptionProps {
    description?: string;
}

export default function PropertyDescription({
    description
}: PropertyDescriptionProps) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    if (!description) return null;

    const shouldTruncateDescription = description && description.length > 200;

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Descrição */}
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
        </div>
    );
}
