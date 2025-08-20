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
        <div className="space-y-8 sm:space-y-10">
            {/* Enhanced description container */}
            <div className="group relative">
                {/* Sophisticated background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-white rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/40 via-transparent to-slate-100/30 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-slate-50/60 rounded-3xl group-hover:from-white/90 group-hover:to-slate-25/70 transition-all duration-500"></div>

                {/* Enhanced border system */}
                <div className="absolute inset-0 border border-slate-200/60 rounded-3xl group-hover:border-slate-300/70 transition-all duration-300"></div>
                <div className="absolute inset-0 border border-white/50 rounded-3xl"></div>

                {/* Subtle inner glow */}
                <div className="absolute inset-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                {/* Premium floating shadow */}
                <div className="absolute inset-x-4 -bottom-2 h-6 bg-gradient-to-r from-transparent via-slate-400/15 to-transparent rounded-full blur-lg group-hover:via-slate-500/20 transition-all duration-300"></div>

                <div className="relative p-6 sm:p-8 lg:p-10">
                    {/* Enhanced title with gradient and accent */}
                    <div className="relative mb-5 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                Sobre o Imóvel
                            </span>
                        </h3>
                        {/* Decorative accent line */}
                        <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-80"></div>
                        {/* Secondary accent dot */}
                        <div className="absolute bottom-0.5 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                    </div>

                    {/* Enhanced description content */}
                    <div className="relative">
                        {/* Content background with subtle texture */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 via-transparent to-slate-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                        <div className="relative prose prose-slate max-w-none">
                            <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed sm:leading-loose font-medium">
                                {shouldTruncateDescription && !isDescriptionExpanded
                                    ? `${description.substring(0, 200)}...`
                                    : description
                                }
                            </p>
                        </div>
                    </div>

                    {/* Enhanced expand/collapse button */}
                    {shouldTruncateDescription && (
                        <div className="relative mt-5 sm:mt-6">
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="group/btn relative overflow-hidden"
                            >
                                {/* Button background with glassmorphism */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/80 to-blue-50 rounded-xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-transparent to-blue-200/30 rounded-xl group-hover/btn:from-blue-200/50 group-hover/btn:to-blue-300/40 transition-all duration-300"></div>

                                {/* Button border */}
                                <div className="absolute inset-0 border border-blue-200/60 rounded-xl group-hover/btn:border-blue-300/80 transition-all duration-300"></div>

                                {/* Hover shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-500 ease-out"></div>

                                <div className="relative flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-blue-700 group-hover/btn:text-blue-800 font-semibold transition-all duration-300 group-hover/btn:scale-[1.02] active:scale-[0.98]">
                                    <span className="tracking-wide">
                                        {isDescriptionExpanded ? 'Ver menos' : 'Ver mais'}
                                    </span>
                                    <div className="relative">
                                        {isDescriptionExpanded ? (
                                            <>
                                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                                                <ChevronUp className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-blue-500 opacity-0 group-hover/btn:opacity-40 transition-all duration-300 blur-sm scale-125" />
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                                                <ChevronDown className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-blue-500 opacity-0 group-hover/btn:opacity-40 transition-all duration-300 blur-sm scale-125" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Top accent highlight */}
                <div className="absolute top-2 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
            </div>
        </div>
    );
}
