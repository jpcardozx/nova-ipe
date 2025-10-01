/**
 * Grid de Propriedades Modular e Responsivo
 * Usa as libs do projeto: framer-motion, lucide-react, cn
 * Mobile-first design com otimizações de performance
 */

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, List, LayoutGrid, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';

export type ViewMode = 'compact' | 'comfortable' | 'spacious' | 'list';
export type SortMode = 'price_asc' | 'price_desc' | 'newest' | 'area_desc' | 'relevance';

interface PropertyGridProps {
    properties: any[];
    viewMode?: ViewMode;
    sortMode?: SortMode;
    onPropertyClick?: (property: any) => void;
    onFavoriteToggle?: (propertyId: string) => void;
    onContactClick?: (propertyId: string, method: string) => void;
    favorites?: string[];
    className?: string;
}

const viewModeConfig = {
    compact: {
        cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        gap: 'gap-3 md:gap-4',
        icon: LayoutGrid,
        label: 'Compacto'
    },
    comfortable: {
        cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        gap: 'gap-4 md:gap-6',
        icon: Grid3x3,
        label: 'Confortável'
    },
    spacious: {
        cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        gap: 'gap-6 md:gap-8',
        icon: Eye,
        label: 'Espaçoso'
    },
    list: {
        cols: '',
        gap: '',
        icon: List,
        label: 'Lista'
    }
};

export default function PropertyGrid({
    properties,
    viewMode = 'comfortable',
    sortMode = 'relevance',
    onPropertyClick,
    onFavoriteToggle,
    onContactClick,
    favorites = [],
    className
}: PropertyGridProps) {

    // Ordenação de propriedades
    const sortedProperties = useMemo(() => {
        const sorted = [...properties];
        
        switch (sortMode) {
            case 'price_asc':
                return sorted.sort((a, b) => (a.preco || 0) - (b.preco || 0));
            case 'price_desc':
                return sorted.sort((a, b) => (b.preco || 0) - (a.preco || 0));
            case 'newest':
                return sorted.sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
            case 'area_desc':
                return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
            default:
                return sorted;
        }
    }, [properties, sortMode]);

    // Container de animação
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const config = viewModeConfig[viewMode];

    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Grid3x3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-600 max-w-md">
                    Tente ajustar os filtros ou fazer uma nova busca para encontrar o imóvel ideal.
                </p>
            </div>
        );
    }

    // Modo Lista
    if (viewMode === 'list') {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn("space-y-4", className)}
            >
                {sortedProperties.map((property, index) => (
                    <PropertyListItem
                        key={property.id}
                        property={property}
                        index={index}
                        isFavorite={favorites.includes(property.id)}
                        onPropertyClick={onPropertyClick}
                        onFavoriteToggle={onFavoriteToggle}
                        onContactClick={onContactClick}
                    />
                ))}
            </motion.div>
        );
    }

    // Modo Grid
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={cn(
                "grid",
                config.cols,
                config.gap,
                className
            )}
        >
            {sortedProperties.map((property, index) => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(property.id)}
                    onPropertyClick={onPropertyClick}
                    onFavoriteToggle={onFavoriteToggle}
                    onContactClick={onContactClick}
                />
            ))}
        </motion.div>
    );
}
