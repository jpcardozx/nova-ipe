'use client';

import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the PropertyCardUnified component dynamically to avoid circular dependencies
const PropertyCardUnified = dynamic(() => import('@/app/components/ui/property/PropertyCardUnified'), {
    ssr: true,
    loading: () => (
        <div className="bg-white rounded-lg shadow-sm h-96 animate-pulse border border-stone-100">
            <div className="h-56 bg-stone-200 rounded-t-lg"></div>
            <div className="p-5">
                <div className="h-7 bg-stone-100 rounded-md w-1/3 mb-3"></div>
                <div className="h-6 bg-stone-100 rounded-md w-5/6 mb-2"></div>
                <div className="h-5 bg-stone-100 rounded-md w-2/3 mb-4"></div>
            </div>
        </div>
    )
});

// Simple AutoSizer replacement
function SimpleAutoSizer({ children }: { children: (size: { width: number; height: number }) => React.ReactNode }) {
    const [size, setSize] = useState({ width: 1200, height: 800 });

    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: window.innerWidth - 64, // Account for padding
                height: window.innerHeight - 200 // Account for header/footer
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return <>{children(size)}</>;
}

// Interface matching the unified property card format
export interface UnifiedPropertyItem {
    id: string;
    title: string;
    slug: string;
    location?: string;
    city?: string;
    price: number;
    propertyType: 'rent' | 'sale';
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url?: string;
        alt?: string;
        imagemUrl?: string;
        sanityImage?: any;
    };
    isHighlight?: boolean;
    isPremium?: boolean;
    isNew?: boolean;
    isFavorite?: boolean;
}

interface VirtualizedPropertiesGridUnifiedProps {
    properties: UnifiedPropertyItem[];
    isLoading?: boolean;
    resetFilters?: () => void;
    onFavoriteToggle?: (id: string) => void;
    className?: string;
}

// Constants for grid layout
const ROW_HEIGHT = 450; // Height of a property card row
const CARD_WIDTH = 380; // Width of a property card
const GAP = 24; // Gap between cards

/**
 * PropertiesLoadingSkeleton - Shows a loading state while properties are being fetched
 */
const PropertiesLoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100">
                    <div className="h-56 bg-stone-200 relative">
                        {/* Badge placeholder */}
                        <div className="absolute top-3 left-3 h-6 w-16 bg-emerald-200 rounded-md"></div>
                        {/* Favorite button placeholder */}
                        <div className="absolute top-3 right-3 h-8 w-8 bg-white/80 rounded-full"></div>
                    </div>
                    <div className="p-5">
                        {/* Price */}
                        <div className="h-7 bg-emerald-100 rounded-md w-1/3 mb-3"></div>
                        {/* Title */}
                        <div className="h-6 bg-stone-100 rounded-md w-5/6 mb-2"></div>
                        <div className="h-6 bg-stone-100 rounded-md w-3/4 mb-4"></div>
                        {/* Location */}
                        <div className="h-5 bg-stone-100 rounded-md w-2/3 mb-6 flex items-center">
                            <div className="h-4 w-4 bg-stone-200 rounded mr-2"></div>
                        </div>
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {Array(4).fill(0).map((_, j) => (
                                <div key={j} className="flex items-center">
                                    <div className="h-8 w-8 bg-stone-100 rounded-md mr-2"></div>
                                    <div>
                                        <div className="h-3 bg-stone-100 rounded-md w-14 mb-1"></div>
                                        <div className="h-4 bg-stone-100 rounded-md w-8"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* CTA */}
                        <div className="h-5 bg-blue-100 rounded-md w-1/2 mt-3"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

/**
 * EmptyState - Shows a message when no properties match the criteria
 */
const EmptyState = React.memo(({ resetFilters }: { resetFilters?: () => void }) => (
    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-10 text-center shadow-inner">
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-md">
                <Home className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Nenhum imóvel encontrado</h3>
            <p className="text-emerald-600 mb-6">
                Não foi possível encontrar imóveis que correspondam aos critérios selecionados. Tente utilizar outros filtros ou volte mais tarde.
            </p>
            {resetFilters && (
                <button
                    onClick={resetFilters}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Limpar filtros
                </button>
            )}
        </div>
    </div>
));

/**
 * VirtualizedPropertiesGridUnified - High-performance grid using the unified property card
 */
export default function VirtualizedPropertiesGridUnified({
    properties,
    isLoading = false,
    resetFilters,
    onFavoriteToggle,
    className
}: VirtualizedPropertiesGridUnifiedProps) {
    // Grid cell renderer memoized with properties that affect it
    const renderCell = useCallback(({ columnIndex, rowIndex, style, properties, onFavoriteToggle }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
        properties: UnifiedPropertyItem[];
        onFavoriteToggle?: (id: string) => void;
    }) => {
        const index = rowIndex * 3 + columnIndex;
        if (index >= properties.length) return null;

        const property = properties[index];
        const cellStyle = {
            ...style,
            paddingRight: columnIndex < 2 ? GAP : 0,
            paddingBottom: GAP,
            height: ROW_HEIGHT,
        };

        return (
            <div style={cellStyle}>
                <PropertyCardUnified
                    id={property.id}
                    title={property.title}
                    slug={property.slug}
                    location={property.location}
                    city={property.city}
                    price={property.price}
                    propertyType={property.propertyType}
                    area={property.area}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    parkingSpots={property.parkingSpots}
                    mainImage={property.mainImage}
                    isHighlight={property.isHighlight}
                    isPremium={property.isPremium}
                    isNew={property.isNew}
                    isFavorite={property.isFavorite}
                    onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(property.id) : undefined}
                />
            </div>
        );
    }, []);

    // Memoize the cell renderer with current properties and callback
    const Cell = useCallback(({ columnIndex, rowIndex, style }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties
    }) => {
        return renderCell({ columnIndex, rowIndex, style, properties, onFavoriteToggle });
    }, [renderCell, properties, onFavoriteToggle]);

    // Show loading state while properties are being fetched
    if (isLoading) {
        return <PropertiesLoadingSkeleton />;
    }

    // Show empty state if no properties match the criteria
    if (properties.length === 0) {
        return <EmptyState resetFilters={resetFilters} />;
    }

    return (
        <div className={cn("w-full h-screen max-h-[1200px]", className)}>
            <SimpleAutoSizer>
                {({ height, width }) => {
                    // Calculate the number of columns that can fit in the available width
                    const columnCount = Math.max(1, Math.floor(width / CARD_WIDTH));
                    
                    return (
                        <div 
                            className="overflow-auto" 
                            style={{ height, width }}
                        >
                            <div 
                                className="grid gap-4 p-4"
                                style={{
                                    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                                    gridAutoRows: `${ROW_HEIGHT}px`
                                }}
                            >
                                {properties.map((property, index) => (
                                    <div key={property.id} className="w-full">
                                        <PropertyCardUnified
                                            property={property}
                                            priority={index < 6}
                                            format="unified"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }}
            </SimpleAutoSizer>
        </div>
    );
}
