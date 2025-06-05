'use client';

import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SectionHeader from './ui/SectionHeader';
import { cn } from '@/lib/utils';
import { processProperties, ProcessedPropertyData } from './PropertyProcessor';
import type { PropertyType } from '@/app/components/ui/property/PropertyCardUnified';
import { motion } from 'framer-motion';

// Import icons directly for better compatibility
import {
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    Star,
    Filter as FilterIcon,
    Home,
    TrendingUp,
    BedDouble,
    AreaChart
} from 'lucide-react';

// Componente principal otimizado com carregamento dinâmico
const OptimizedPropertyCarousel = dynamic(() => import('@/app/components/OptimizedPropertyCarousel').then(mod => ({ default: mod.OptimizedPropertyCarousel })),
    {
        ssr: false,
        loading: () => <PropertiesLoadingSkeleton />,
    }
);

// Componente de esqueleto de carregamento otimizado e mais bonito
const PropertiesLoadingSkeleton = memo(() => (
    <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="h-9 w-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg mb-3"></div>
                <div className="h-5 w-96 bg-gradient-to-r from-gray-100 to-gray-50 rounded-md"></div>
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100"></div>
                    <div className="p-5">
                        <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                        <div className="h-5 bg-gray-100 rounded-md w-1/2 mb-5"></div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

PropertiesLoadingSkeleton.displayName = 'PropertiesLoadingSkeleton';

// Botões de controle melhorados
interface CarouselControlProps {
    direction: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
}

const CarouselControl = memo(({ direction, onClick, disabled }: CarouselControlProps) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
            disabled && "opacity-40 cursor-not-allowed"
        )}
        aria-label={direction === 'next' ? 'Próximo' : 'Anterior'}
    >
        {direction === 'next' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
    </motion.button>
));

CarouselControl.displayName = 'CarouselControl';

// Interface para os filtros melhorados
interface FilterState {
    type: PropertyType | 'all';
    bedrooms: number | null;
    priceRange: [number, number] | null;
    area: [number, number] | null;
}

// Badge do filtro - componente melhorado
interface FilterBadgeProps {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

const FilterBadge = memo(({ children, isActive, onClick, icon }: FilterBadgeProps) => (
    <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1.5",
            isActive
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
        )}
    >
        {icon}
        {children}
    </motion.button>
));

FilterBadge.displayName = 'FilterBadge';

// Filtro de tipos de propriedade melhorado
interface PropertyFilterProps {
    filters: FilterState;
    onChange: (newFilters: Partial<FilterState>) => void;
    propertyData: ProcessedPropertyData[];
}

const PropertyFilter = memo(({ filters, onChange, propertyData }: PropertyFilterProps) => {
    // Calcular os filtros disponíveis com base nos dados
    const availableBedrooms = useMemo(() => {
        const bedroomsSet = new Set<number>();
        propertyData.forEach(property => {
            if (property.bedrooms !== undefined) {
                bedroomsSet.add(property.bedrooms);
            }
        });
        return Array.from(bedroomsSet).sort((a, b) => a - b);
    }, [propertyData]);

    return (
        <div className="flex flex-wrap gap-y-3 gap-x-2 mb-8">
            <div className="flex flex-wrap gap-2 mr-4">
                <FilterBadge
                    isActive={filters.type === 'all'}
                    onClick={() => onChange({ type: 'all' })}
                    icon={<FilterIcon className="w-3.5 h-3.5" />}
                >
                    Todos
                </FilterBadge>
                <FilterBadge
                    isActive={filters.type === 'sale'}
                    onClick={() => onChange({ type: 'sale' })}
                    icon={<TrendingUp className="w-3.5 h-3.5" />}
                >
                    Venda
                </FilterBadge>
                <FilterBadge
                    isActive={filters.type === 'rent'}
                    onClick={() => onChange({ type: 'rent' })}
                    icon={<Home className="w-3.5 h-3.5" />}
                >
                    Aluguel
                </FilterBadge>
            </div>

            {availableBedrooms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <FilterBadge
                        isActive={filters.bedrooms === null}
                        onClick={() => onChange({ bedrooms: null })}
                        icon={<BedDouble className="w-3.5 h-3.5" />}
                    >
                        Qualquer
                    </FilterBadge>
                    {availableBedrooms.map(num => (
                        <FilterBadge
                            key={`bedroom-${num}`}
                            isActive={filters.bedrooms === num}
                            onClick={() => onChange({ bedrooms: num })}
                            icon={<BedDouble className="w-3.5 h-3.5" />}
                        >
                            {num} {num === 1 ? 'quarto' : 'quartos'}
                        </FilterBadge>
                    ))}
                </div>
            )}
        </div>
    );
});

PropertyFilter.displayName = 'PropertyFilter';

// Importar nosso hook personalizado
import { useSanityProperties } from '../hooks/useSanityProperties';

// Componente principal de Destaques com imóveis do Sanity CMS
export function DestaquesSanityCarousel({
    rawProperties,
    title = "Imóveis em Destaque",
    subtitle = "Confira nossas opções selecionadas de imóveis com ótimo potencial em toda Guararema"
}: {
    rawProperties: any[];
    title?: string;
    subtitle?: string;
}) {
    // Estado para filtros melhorados
    const [filters, setFilters] = useState<FilterState>({
        type: 'all',
        bedrooms: null,
        priceRange: null,
        area: null
    });

    // Atualizar filtros
    const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Processar propriedades usando nosso hook otimizado
    const {
        properties: processedProperties,
        isLoading,
        isEmpty
    } = useSanityProperties(rawProperties, {
        filterType: filters.type === 'all' ? 'all' : filters.type,
        sortBy: 'date',
        sortDirection: 'desc'
    });

    // Filtrar propriedades localmente para filtros adicionais
    const filteredProperties = useMemo(() => {
        return processedProperties.filter(property => {
            // Filtrar por número de quartos se o filtro estiver ativo
            if (filters.bedrooms !== null && property.bedrooms !== filters.bedrooms) {
                return false;
            }

            // Filtrar por preço se o filtro estiver ativo
            if (filters.priceRange !== null) {
                const [min, max] = filters.priceRange;
                if (property.price < min || property.price > max) {
                    return false;
                }
            }

            // Filtrar por área se o filtro estiver ativo
            if (filters.area !== null && property.area !== undefined) {
                const [min, max] = filters.area;
                if (property.area < min || property.area > max) {
                    return false;
                }
            }

            return true;
        });
    }, [processedProperties, filters]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="container mx-auto py-16 px-4 md:px-6"
        >
            <div className="mb-8">
                <SectionHeader
                    title={
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-amber-500" />
                            <span>{title}</span>
                        </div>
                    }
                    subtitle={subtitle}
                    align="left"
                    className="max-w-3xl" titleClassName="text-display-3 text-gray-800"
                    subtitleClassName="text-body-large text-gray-600 mt-2"
                />

                <PropertyFilter
                    filters={filters}
                    onChange={updateFilters}
                    propertyData={processedProperties}
                />
            </div>

            {isLoading ? (
                <PropertiesLoadingSkeleton />
            ) : filteredProperties.length > 0 ? (
                <OptimizedPropertyCarousel
                    properties={filteredProperties}
                    variant="featured"
                    slidesToShow={3}
                    showControls={true}
                    autoplay={true}
                    autoplayInterval={6000}
                    className="pb-8"
                />
            ) : (<div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
                <h3 className="text-heading-3 text-amber-700 mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-body text-amber-600 mb-4">Não encontramos imóveis com os critérios de filtro selecionados.</p>
                <button
                    onClick={() => setFilters({ type: 'all', bedrooms: null, priceRange: null, area: null })}
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                    Limpar todos os filtros
                </button>
            </div>
            )}

            <div className="mt-8 flex justify-center">
                <Link href="/imoveis" className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                    Ver todos os imóveis
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.span>
                </Link>
            </div>
        </motion.section>
    );
}

export default DestaquesSanityCarousel;
