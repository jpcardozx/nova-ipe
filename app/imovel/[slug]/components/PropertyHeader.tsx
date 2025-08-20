'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';

interface PropertyHeaderProps {
    title: string;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    onShare: () => void;
}

export default function PropertyHeader({
    title,
    isFavorite,
    onFavoriteToggle,
    onShare
}: PropertyHeaderProps) {
    return (
        <div className="relative">
            {/* Gradient backdrop with advanced layering */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/98 via-white/96 to-slate-50/98 backdrop-blur-md"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/60"></div>

            {/* Main container with enhanced glass effect */}
            <div className="bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/50 sticky top-16 sm:top-18 z-40 border-b border-slate-200/60">
                {/* Subtle top highlight */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300/40 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-center justify-between">
                        {/* Enhanced back button with micro-interactions */}
                        <Link
                            href="/catalogo"
                            className="group relative flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-all duration-300 ease-out"
                        >
                            {/* Hover background effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-slate-100/0 via-slate-100/60 to-slate-100/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>

                            <div className="relative flex items-center gap-3">
                                <div className="relative">
                                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1.5 transition-all duration-300 ease-out" />
                                    {/* Icon glow effect */}
                                    <ArrowLeft className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-slate-400 opacity-0 group-hover:opacity-30 transition-all duration-300 blur-sm" />
                                </div>
                                <span className="font-semibold text-sm sm:text-base tracking-wide">Voltar aos imóveis</span>
                            </div>
                        </Link>

                        {/* Enhanced action buttons with premium styling */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Favorite button with dynamic styling */}
                            <button
                                onClick={onFavoriteToggle}
                                className="group relative flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            >
                                {/* Dynamic background based on favorite state */}
                                <div className={`absolute inset-0 transition-all duration-300 ${isFavorite
                                        ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50'
                                        : 'bg-gradient-to-r from-slate-50 via-slate-100/80 to-slate-50'
                                    }`}></div>
                                <div className={`absolute inset-0 transition-all duration-300 ${isFavorite
                                        ? 'bg-gradient-to-b from-red-100/40 to-rose-200/20 group-hover:from-red-200/60 group-hover:to-rose-300/30'
                                        : 'bg-gradient-to-b from-slate-100/40 to-slate-200/20 group-hover:from-slate-200/60 group-hover:to-slate-300/30'
                                    }`}></div>

                                <div className="relative flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
                                    <div className="relative">
                                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isFavorite
                                                ? 'text-red-600 fill-red-500 group-hover:scale-110'
                                                : 'text-slate-600 group-hover:text-red-500 group-hover:scale-110'
                                            }`} />
                                        {/* Heart pulse effect when favorited */}
                                        {isFavorite && (
                                            <Heart className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-red-400 fill-red-300 opacity-0 group-hover:opacity-60 transition-all duration-300 scale-125 blur-sm" />
                                        )}
                                    </div>
                                    <span className={`text-xs sm:text-sm font-semibold hidden sm:block transition-colors duration-300 ${isFavorite ? 'text-red-700' : 'text-slate-700 group-hover:text-red-600'
                                        }`}>
                                        {isFavorite ? 'Favoritado' : 'Favoritar'}
                                    </span>
                                </div>
                            </button>

                            {/* Share button with premium golden styling */}
                            <button
                                onClick={onShare}
                                className="group relative flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-amber-500/25"
                                aria-label="Compartilhar imóvel"
                            >
                                {/* Layered golden gradient backgrounds */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-400/20 via-transparent to-amber-700/30"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-amber-600/40 group-hover:from-yellow-300/30 group-hover:to-amber-500/50 transition-all duration-300"></div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

                                <div className="relative flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
                                    <div className="relative">
                                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-all duration-300" />
                                        {/* Icon glow */}
                                        <Share2 className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-white opacity-0 group-hover:opacity-40 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-white hidden sm:block tracking-wide">
                                        Compartilhar
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subtle bottom shadow */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300/30 to-transparent"></div>
            </div>
        </div>
    );
}
