'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Home, Building2, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';

// Navegação entre seções
export function SectionNavigation({
    activeSection,
    onSectionChange
}: {
    activeSection: 'sale' | 'rent';
    onSectionChange: (section: 'sale' | 'rent') => void;
}) {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl p-1 border border-white/30">
                {['sale', 'rent'].map((section) => {
                    const isActive = activeSection === section;
                    const Icon = section === 'sale' ? Building2 : Home;
                    const label = section === 'sale' ? 'Comprar' : 'Alugar';

                    return (
                        <motion.button
                            key={section}
                            onClick={() => onSectionChange(section as 'sale' | 'rent')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative",
                                isActive
                                    ? "text-white shadow-lg"
                                    : "text-stone-600 hover:text-stone-900"
                            )}
                            whileHover={{ scale: isActive ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={cn(
                                        "absolute inset-0 rounded-xl",
                                        section === 'sale'
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                            : "bg-gradient-to-r from-blue-500 to-slate-500"
                                    )}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon size={18} className="relative z-10" />
                            <span className="relative z-10">{label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

// Filtros rápidos
export function QuickFilters({
    type,
    activeFilter,
    onFilterChange
}: {
    type: 'sale' | 'rent';
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}) {
    const filters = {
        sale: [
            { id: 'all', label: 'Todos', count: 47 },
            { id: 'house', label: 'Casas', count: 28 },
            { id: 'lot', label: 'Terrenos', count: 19 },
            { id: 'featured', label: 'Destaques', count: 8 }
        ],
        rent: [
            { id: 'all', label: 'Todos', count: 31 },
            { id: 'house', label: 'Casas', count: 22 },
            { id: 'apartment', label: 'Apartamentos', count: 9 },
            { id: 'featured', label: 'Destaques', count: 5 }
        ]
    };

    return (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {filters[type].map((filter, index) => {
                const isActive = activeFilter === filter.id;

                return (
                    <motion.button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap",
                            isActive
                                ? type === 'sale'
                                    ? "bg-amber-500 text-white shadow-lg"
                                    : "bg-blue-500 text-white shadow-lg"
                                : "bg-white/50 text-stone-600 hover:bg-white/70"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{filter.label}</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            isActive
                                ? "bg-white/20 text-white"
                                : "bg-stone-200 text-stone-600"
                        )}>
                            {filter.count}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}

// Ordenação rápida
export function QuickSort({
    activeSort,
    onSortChange
}: {
    activeSort: string;
    onSortChange: (sort: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { id: 'recent', label: 'Mais recentes' },
        { id: 'price-asc', label: 'Menor preço' },
        { id: 'price-desc', label: 'Maior preço' },
        { id: 'area-desc', label: 'Maior área' },
        { id: 'featured', label: 'Destaques primeiro' }
    ];

    const activeOption = sortOptions.find(opt => opt.id === activeSort);

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-xl text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <SortAsc size={16} />
                <span>{activeOption?.label || 'Ordenar'}</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-20 min-w-48"
                    >
                        {sortOptions.map((option) => (
                            <motion.button
                                key={option.id}
                                onClick={() => {
                                    onSortChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-3 text-sm transition-colors",
                                    activeSort === option.id
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-stone-600 hover:bg-stone-50"
                                )}
                                whileHover={{ backgroundColor: activeSort === option.id ? undefined : '#f8fafc' }}
                            >
                                {option.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Indicador de scroll horizontal para mobile
export function ScrollIndicator({
    hasMore,
    onLoadMore
}: {
    hasMore: boolean;
    onLoadMore: () => void;
}) {
    if (!hasMore) return null;

    return (
        <div className="flex justify-center mt-8">
            <motion.button
                onClick={onLoadMore}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-slate-500 text-white rounded-xl font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span>Ver mais propriedades</span>
                <ArrowRight size={18} />
            </motion.button>
        </div>
    );
}

// Navegação entre cards (para mobile)
export function CardNavigation({
    currentIndex,
    totalCards,
    onNavigate
}: {
    currentIndex: number;
    totalCards: number;
    onNavigate: (direction: 'prev' | 'next') => void;
}) {
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < totalCards - 1;

    return (
        <div className="flex items-center justify-between mt-6 lg:hidden">
            <motion.button
                onClick={() => onNavigate('prev')}
                disabled={!canGoPrev}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                    canGoPrev
                        ? "bg-white/50 text-stone-600 hover:bg-white/70"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed"
                )}
                whileHover={canGoPrev ? { scale: 1.05 } : undefined}
                whileTap={canGoPrev ? { scale: 0.95 } : undefined}
            >
                <ArrowLeft size={16} />
                <span>Anterior</span>
            </motion.button>

            <div className="flex items-center gap-2">
                {[...Array(Math.min(totalCards, 5))].map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            i === currentIndex ? "bg-blue-500" : "bg-stone-300"
                        )}
                    />
                ))}
            </div>

            <motion.button
                onClick={() => onNavigate('next')}
                disabled={!canGoNext}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                    canGoNext
                        ? "bg-white/50 text-stone-600 hover:bg-white/70"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed"
                )}
                whileHover={canGoNext ? { scale: 1.05 } : undefined}
                whileTap={canGoNext ? { scale: 0.95 } : undefined}
            >
                <span>Próximo</span>
                <ArrowRight size={16} />
            </motion.button>
        </div>
    );
}

export default {
    SectionNavigation,
    QuickFilters,
    QuickSort,
    ScrollIndicator,
    CardNavigation
};
