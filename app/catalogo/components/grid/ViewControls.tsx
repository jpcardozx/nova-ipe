/**
 * Controles de Visualização
 * Permite alternar entre modos de visualização e ordenação
 * Mobile-friendly com design compacto
 */

'use client';

import React from 'react';
import { Grid3x3, List, LayoutGrid, Eye, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode, SortMode } from './PropertyGrid';

interface ViewControlsProps {
    viewMode: ViewMode;
    sortMode: SortMode;
    totalResults: number;
    onViewModeChange: (mode: ViewMode) => void;
    onSortModeChange: (mode: SortMode) => void;
    className?: string;
}

const viewModes: Array<{ mode: ViewMode; icon: any; label: string }> = [
    { mode: 'compact', icon: LayoutGrid, label: 'Compacto' },
    { mode: 'comfortable', icon: Grid3x3, label: 'Confortável' },
    { mode: 'spacious', icon: Eye, label: 'Espaçoso' },
    { mode: 'list', icon: List, label: 'Lista' }
];

const sortOptions: Array<{ value: SortMode; label: string }> = [
    { value: 'relevance', label: 'Mais Relevantes' },
    { value: 'price_asc', label: 'Menor Preço' },
    { value: 'price_desc', label: 'Maior Preço' },
    { value: 'newest', label: 'Mais Recentes' },
    { value: 'area_desc', label: 'Maior Área' }
];

export default function ViewControls({
    viewMode,
    sortMode,
    totalResults,
    onViewModeChange,
    onSortModeChange,
    className
}: ViewControlsProps) {

    return (
        <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6", className)}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Visualização */}
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Visualização:
                    </span>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {viewModes.map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => onViewModeChange(mode)}
                                className={cn(
                                    "p-2.5 md:p-3 rounded-lg transition-all duration-200",
                                    viewMode === mode
                                        ? "bg-white shadow-md text-amber-600 scale-105"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                                title={label}
                            >
                                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ordenação */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            Ordenar:
                        </span>
                    </div>
                    <select
                        value={sortMode}
                        onChange={(e) => onSortModeChange(e.target.value as SortMode)}
                        className="flex-1 lg:flex-initial px-4 py-2.5 md:py-3 bg-white border border-gray-300 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-w-[180px]"
                    >
                        {sortOptions.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Contador de resultados */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-sm font-semibold text-amber-900">
                        {totalResults} {totalResults === 1 ? 'imóvel' : 'imóveis'}
                    </span>
                </div>
            </div>
        </div>
    );
}
