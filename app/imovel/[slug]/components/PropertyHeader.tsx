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
        <div className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-16 sm:top-18 z-40 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/catalogo"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 group"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm sm:text-base">Voltar aos imóveis</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={onFavoriteToggle}
                            className="flex items-center gap-1 sm:gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 sm:px-4 rounded-lg transition-all duration-200"
                            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
                            <span className="text-xs sm:text-sm font-medium hidden sm:block">
                                {isFavorite ? 'Favoritado' : 'Favoritar'}
                            </span>
                        </button>

                        <button
                            onClick={onShare}
                            className="flex items-center gap-1 sm:gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 sm:px-4 rounded-lg transition-all duration-200"
                            aria-label="Compartilhar imóvel"
                        >
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:block">Compartilhar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
