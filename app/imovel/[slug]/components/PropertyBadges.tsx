'use client';

import React from 'react';
import { Star, TrendingUp, Shield, DollarSign } from 'lucide-react';

interface PropertyBadgesProps {
    isPremium?: boolean;
    isHighlight?: boolean;
    isNew?: boolean;
    propertyType: 'sale' | 'rent';
    status?: 'available' | 'sold' | 'rented' | 'reserved';
    documentationOk?: boolean;
    acceptsFinancing?: boolean;
}

export default function PropertyBadges({
    isPremium = false,
    isHighlight = false,
    isNew = false,
    propertyType,
    status = 'available',
    documentationOk = false,
    acceptsFinancing = false
}: PropertyBadgesProps) {
    return (
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
            {isPremium && (
                <div className="group relative overflow-hidden">
                    {/* Multiple layered backgrounds for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/30 via-transparent to-amber-700/50 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/40 via-transparent to-amber-800/30 rounded-full group-hover:from-yellow-200/50 group-hover:to-amber-700/40 transition-all duration-300"></div>

                    {/* Shine animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>

                    <span className="relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider shadow-xl shadow-amber-500/30 group-hover:shadow-2xl group-hover:shadow-amber-500/40 transition-all duration-300">
                        <div className="relative">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                            <Star className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 text-yellow-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                        </div>
                        PREMIUM
                    </span>
                </div>
            )}

            {isHighlight && (
                <div className="group relative overflow-hidden">
                    {/* Purple gradient with enhanced depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-violet-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-400/30 via-transparent to-purple-800/50 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/30 via-transparent to-purple-800/40 rounded-full group-hover:from-pink-300/40 group-hover:to-purple-700/50 transition-all duration-300"></div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>

                    <span className="relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider shadow-xl shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-all duration-300">
                        <div className="relative">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                            <TrendingUp className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 text-pink-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                        </div>
                        DESTAQUE
                    </span>
                </div>
            )}

            {isNew && (
                <div className="group relative overflow-hidden">
                    {/* Green gradient with modern styling */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/30 via-transparent to-emerald-800/50 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/30 via-transparent to-emerald-800/40 rounded-full group-hover:from-lime-300/40 group-hover:to-emerald-700/50 transition-all duration-300"></div>

                    {/* Pulse effect for new items */}
                    <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 animate-pulse"></div>

                    <span className="relative px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                        NOVO
                    </span>
                </div>
            )}

            {/* Property type badge with enhanced styling */}
            <div className="group relative overflow-hidden">
                <div className={`absolute inset-0 rounded-full ${propertyType === 'sale'
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600'
                    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
                    }`}></div>
                <div className={`absolute inset-0 rounded-full ${propertyType === 'sale'
                    ? 'bg-gradient-to-b from-emerald-400/30 via-transparent to-emerald-800/50'
                    : 'bg-gradient-to-b from-blue-400/30 via-transparent to-blue-800/50'
                    }`}></div>
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${propertyType === 'sale'
                    ? 'bg-gradient-to-tr from-lime-400/30 via-transparent to-emerald-800/40 group-hover:from-lime-300/40 group-hover:to-emerald-700/50'
                    : 'bg-gradient-to-tr from-cyan-400/30 via-transparent to-blue-800/40 group-hover:from-cyan-300/40 group-hover:to-blue-700/50'
                    }`}></div>

                <span className={`relative px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider transition-all duration-300 ${propertyType === 'sale'
                    ? 'shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/40'
                    : 'shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40'
                    }`}>
                    {propertyType === 'sale' ? 'VENDA' : 'ALUGUEL'}
                </span>
            </div>

            {documentationOk && (
                <div className="group relative overflow-hidden">
                    {/* Success green styling */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/30 via-transparent to-emerald-800/50 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/30 via-transparent to-emerald-800/40 rounded-full group-hover:from-lime-300/40 group-hover:to-emerald-700/50 transition-all duration-300"></div>

                    {/* Check mark glow */}
                    <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-15 transition-all duration-300"></div>

                    <span className="relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                        <div className="relative">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                            <Shield className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 text-emerald-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                        </div>
                        <span className="hidden sm:inline">DOCS OK</span>
                        <span className="sm:hidden">OK</span>
                    </span>
                </div>
            )}

            {acceptsFinancing && (
                <div className="group relative overflow-hidden">
                    {/* Financial blue styling */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 via-transparent to-blue-800/50 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 via-transparent to-blue-800/40 rounded-full group-hover:from-cyan-300/40 group-hover:to-blue-700/50 transition-all duration-300"></div>

                    {/* Money symbol pulse */}
                    <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-15 transition-all duration-300"></div>

                    <span className="relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white tracking-wider shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                        <div className="relative">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                            <DollarSign className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 text-cyan-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                        </div>
                        <span className="hidden sm:inline">FINANCIA</span>
                        <span className="sm:hidden">$$</span>
                    </span>
                </div>
            )}
        </div>
    );
}
