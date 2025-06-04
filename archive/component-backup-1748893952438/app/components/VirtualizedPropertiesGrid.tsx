'use client';

import React, { useCallback } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { PropertyCard as OptimizedPropertyCard } from '@/components/ui/property/PropertyCard';
import { XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyItem {
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
        url: string;
        alt: string;
        blurDataUrl?: string;
    };
    status?: 'available' | 'sold' | 'rented' | 'pending';
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
    isFavorite?: boolean;
}

interface VirtualizedPropertiesGridProps {
    properties: PropertyItem[];
    isLoading?: boolean;
    resetFilters?: () => void;
    onFavoriteToggle?: (id: string) => void;
    className?: string;
}

// Constants for grid layout
const ROW_HEIGHT = 440; // Height of a property card row
const CARD_WIDTH = 380; // Width of a property card
const GAP = 20; // Gap between cards

/**
 * PropertiesLoadingSkeleton - Shows a loading state while properties are being fetched
 * Memoized to avoid recreating this component on every render
 */
const PropertiesLoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded mb-4" />
                        <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-8 bg-gray-100 rounded" />
                            <div className="h-8 bg-gray-100 rounded" />
                            <div className="h-8 bg-gray-100 rounded" />
                            <div className="h-8 bg-gray-100 rounded" />
                        </div>
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
    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-10 text-center shadow-inner">
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-md">
                <XCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-amber-700 mb-3">Nenhum imóvel encontrado</h3>
            <p className="text-amber-600 mb-6">
                Não foi possível encontrar imóveis com os critérios selecionados. Tente ajustar os filtros.
            </p>
            {resetFilters && (
                <button
                    onClick={resetFilters}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Limpar filtros
                </button>
            )}
        </div>
    </div>
));

/**
 * VirtualizedPropertiesGrid - High-performance grid for displaying large property lists
 * Uses virtualization to only render visible items for major performance improvements
 */
export default function VirtualizedPropertiesGrid({
    properties,
    isLoading = false,
    resetFilters,
    onFavoriteToggle,
    className
}: VirtualizedPropertiesGridProps) {
    // Grid cell renderer memoized with properties that affect it
    const renderCell = useCallback(({ columnIndex, rowIndex, style, properties, onFavoriteToggle }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
        properties: PropertyItem[];
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
                <OptimizedPropertyCard
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
    }, []);    // Memoize the cell renderer with current properties and callback
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
            <AutoSizer>
                {({ height, width }) => {
                    // Calculate the number of columns that can fit in the available width
                    const columnCount = Math.max(1, Math.floor(width / CARD_WIDTH));
                    // Calculate the number of rows needed to display all items
                    const rowCount = Math.ceil(properties.length / columnCount);

                    // Calculate column width based on available space
                    const calculatedColumnWidth = (width - GAP * (columnCount - 1)) / columnCount;

                    return (
                        <Grid
                            columnCount={columnCount}
                            columnWidth={() => calculatedColumnWidth}
                            height={height}
                            rowCount={rowCount}
                            rowHeight={() => ROW_HEIGHT}
                            width={width} itemKey={({ columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }) => {
                                const index = rowIndex * columnCount + columnIndex;
                                return index < properties.length ? properties[index].id : `empty-${index}`;
                            }}
                        >
                            {Cell}
                        </Grid>
                    );
                }}
            </AutoSizer>
        </div>
    );
}
