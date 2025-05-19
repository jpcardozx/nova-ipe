'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './ui/SectionHeader';
import { cn } from '@/lib/utils';
import { formatarMoeda } from '@/lib/utils';
import { PropertyFilters, SortOptions, useEnhancedSanityProperties } from '../hooks/useEnhancedSanityProperties';
import ImprovedPropertiesGrid from './ImprovedPropertiesGrid';
import FavoritesEnabledGrid from './FavoritesEnabledGrid';

// Lazy load ícones para melhor performance
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), { ssr: true });
const FilterIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Filter })), { ssr: true });
const Home = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Home })), { ssr: true });
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: true });
const BedDouble = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BedDouble })), { ssr: true });
const Bath = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Bath })), { ssr: true });
const AreaChart = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AreaChart })), { ssr: true });
const SlidersHorizontal = dynamic(() => import('lucide-react').then(mod => ({ default: mod.SlidersHorizontal })), { ssr: true });
const MapPin = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MapPin })), { ssr: true });
const XCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.XCircle })), { ssr: true });
const Check = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Check })), { ssr: true });
const Heart = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Heart })), { ssr: true });
const Clock = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: true });

// Esqueleto de carregamento da seção de filtros
const PropertiesLoadingSkeleton = React.memo(() => (
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
    </div>
));

PropertiesLoadingSkeleton.displayName = 'PropertiesLoadingSkeleton';

// Badge do filtro - componente melhorado
interface FilterBadgeProps {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    className?: string;
}

const FilterBadge = React.memo(({ children, isActive, onClick, icon, className }: FilterBadgeProps) => (
    <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1.5",
            isActive
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50",
            className
        )}
    >
        {icon}
        {children}
    </motion.button>
));

FilterBadge.displayName = 'FilterBadge';

// Componente principal para exibir imóveis com filtros intuitivos
export default function ImprovedPropertiesDisplay({
    rawProperties,
    title = "Imóveis em Destaque",
    subtitle = "Confira nossas opções selecionadas de imóveis com ótimo potencial em toda Guararema",
    viewAllLink = "/imoveis",
    viewAllLabel = "Ver todos os imóveis",
    maxCards = 6
}: {
    rawProperties: any[];
    title?: string | React.ReactNode;
    subtitle?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
    maxCards?: number;
}) {
    // Estados para gerenciar filtros e ordenação
    const [filters, setFilters] = useState<PropertyFilters>({
        type: 'all',
        bedrooms: null,
        bathrooms: null,
        priceRange: null,
        areaRange: null,
        locations: null
    });

    const [sort, setSort] = useState<SortOptions>({
        sortBy: 'date',
        sortDirection: 'desc'
    });

    // Estado para filtros avançados visíveis
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Atualizar filtros
    const updateFilters = useCallback((newFilters: Partial<PropertyFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Resetar filtros
    const resetFilters = useCallback(() => {
        setFilters({
            type: 'all',
            bedrooms: null,
            bathrooms: null,
            priceRange: null,
            areaRange: null,
            locations: null
        });
    }, []);

    // Usar nosso hook aprimorado para processar e filtrar propriedades
    const {
        properties,
        stats,
        isLoading,
        isEmpty
    } = useEnhancedSanityProperties(rawProperties, {
        filters,
        sortOptions: sort,
        limit: maxCards
    });

    // Calcular quantos filtros estão ativos
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.type && filters.type !== 'all') count++;
        if (filters.bedrooms !== null) count++;
        if (filters.bathrooms !== null) count++;
        if (filters.priceRange !== null) count++;
        if (filters.areaRange !== null) count++;
        if (filters.locations !== null && filters.locations?.length > 0) count++;
        return count;
    }, [filters]);

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
                    title={title}
                    subtitle={subtitle}
                    align="left"
                    className="max-w-3xl"
                    titleClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    subtitleClassName="text-gray-600 mt-2 text-lg"
                />

                {/* Filtro básico */}
                <div className="flex flex-wrap gap-y-3 gap-x-2 mb-6">
                    <div className="flex flex-wrap gap-2 mr-2">
                        <FilterBadge
                            isActive={filters.type === 'all'}
                            onClick={() => updateFilters({ type: 'all' })}
                            icon={<FilterIcon className="w-3.5 h-3.5" />}
                        >
                            Todos
                        </FilterBadge>
                        <FilterBadge
                            isActive={filters.type === 'sale'}
                            onClick={() => updateFilters({ type: 'sale' })}
                            icon={<TrendingUp className="w-3.5 h-3.5" />}
                        >
                            Venda
                        </FilterBadge>
                        <FilterBadge
                            isActive={filters.type === 'rent'}
                            onClick={() => updateFilters({ type: 'rent' })}
                            icon={<Home className="w-3.5 h-3.5" />}
                        >
                            Aluguel
                        </FilterBadge>
                    </div>

                    {/* Quartos - Filtro rápido */}
                    {stats.bedroomOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mr-2 border-l border-gray-200 pl-2">
                            {stats.bedroomOptions.slice(0, 4).map(num => (
                                <FilterBadge
                                    key={`quick-bedroom-${num}`}
                                    isActive={filters.bedrooms === num}
                                    onClick={() => updateFilters({ bedrooms: num === filters.bedrooms ? null : num })}
                                    icon={<BedDouble className="w-3.5 h-3.5" />}
                                >
                                    {num}
                                </FilterBadge>
                            ))}
                        </div>
                    )}

                    <div className="ml-auto flex gap-2">
                        {/* Seletor de ordenação */}
                        <div className="relative">
                            <select
                                value={`${sort.sortBy}-${sort.sortDirection}`}
                                onChange={(e) => {
                                    const [sortBy, sortDirection] = e.target.value.split('-');
                                    setSort({
                                        sortBy: sortBy as 'price' | 'date' | 'area' | 'bedrooms',
                                        sortDirection: sortDirection as 'asc' | 'desc'
                                    });
                                }}
                                className="py-2 px-3 pr-8 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-amber-300 appearance-none cursor-pointer"
                            >
                                <option value="date-desc">Mais recentes</option>
                                <option value="price-asc">Menor preço</option>
                                <option value="price-desc">Maior preço</option>
                                <option value="area-asc">Menor área</option>
                                <option value="area-desc">Maior área</option>
                                <option value="bedrooms-asc">Menos quartos</option>
                                <option value="bedrooms-desc">Mais quartos</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <FilterBadge
                            isActive={showAdvancedFilters}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                            className={activeFilterCount > 0 ? "bg-amber-50 border-amber-200" : ""}
                        >
                            Filtros avançados {activeFilterCount > 0 &&
                                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            }
                        </FilterBadge>
                    </div>
                </div>

                {/* Filtros avançados */}
                <AnimatePresence>
                    {showAdvancedFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-medium text-gray-800 text-lg flex items-center">
                                        <SlidersHorizontal className="w-5 h-5 mr-2 text-amber-500" />
                                        Filtros avançados
                                    </h4>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={resetFilters}
                                            className="flex items-center text-sm text-amber-600 hover:text-amber-700 py-1 px-3 bg-amber-50 rounded-full hover:bg-amber-100 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4 mr-1.5" />
                                            Limpar todos os filtros
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                    {/* Filtros de quartos */}
                                    {stats.bedroomOptions.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-600 mb-2.5 flex items-center">
                                                <BedDouble className="w-4 h-4 mr-1.5 text-amber-500" />
                                                Quartos
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <FilterBadge
                                                    isActive={filters.bedrooms === null}
                                                    onClick={() => updateFilters({ bedrooms: null })}
                                                    className="!py-1.5 !px-3 text-xs"
                                                >
                                                    Qualquer
                                                </FilterBadge>
                                                {stats.bedroomOptions.map(num => (
                                                    <FilterBadge
                                                        key={`bedroom-${num}`}
                                                        isActive={filters.bedrooms === num}
                                                        onClick={() => updateFilters({ bedrooms: num === filters.bedrooms ? null : num })}
                                                        className="!py-1.5 !px-3 text-xs"
                                                    >
                                                        {num} {num === 1 ? 'quarto' : 'quartos'}
                                                    </FilterBadge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Filtros de banheiros */}
                                    {stats.bathroomOptions.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-600 mb-2.5 flex items-center">
                                                <Bath className="w-4 h-4 mr-1.5 text-blue-500" />
                                                Banheiros
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <FilterBadge
                                                    isActive={filters.bathrooms === null}
                                                    onClick={() => updateFilters({ bathrooms: null })}
                                                    className="!py-1.5 !px-3 text-xs"
                                                >
                                                    Qualquer
                                                </FilterBadge>
                                                {stats.bathroomOptions.map(num => (
                                                    <FilterBadge
                                                        key={`bathroom-${num}`}
                                                        isActive={filters.bathrooms === num}
                                                        onClick={() => updateFilters({ bathrooms: num === filters.bathrooms ? null : num })}
                                                        className="!py-1.5 !px-3 text-xs"
                                                    >
                                                        {num} {num === 1 ? 'banheiro' : 'banheiros'}
                                                    </FilterBadge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Filtro de Preço */}
                                    {stats.maxPrice > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-600 mb-2.5 flex items-center">
                                                <TrendingUp className="w-4 h-4 mr-1.5 text-green-500" />
                                                Faixa de Preço
                                            </p>
                                            <div className="px-2">
                                                <input
                                                    type="range"
                                                    min={stats.minPrice}
                                                    max={stats.maxPrice}
                                                    step={(stats.maxPrice - stats.minPrice) / 100}
                                                    value={filters.priceRange ? filters.priceRange[1] : stats.maxPrice}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        updateFilters({
                                                            priceRange: [stats.minPrice, value]
                                                        });
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>{formatarMoeda(stats.minPrice)}</span>
                                                    <span>{formatarMoeda(filters.priceRange ? filters.priceRange[1] : stats.maxPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Filtro de Novidades */}
                                    <div className="mb-3">
                                        <p className="text-sm font-medium text-gray-600 mb-2.5 flex items-center">
                                            <Clock className="w-4 h-4 mr-1.5 text-green-500" />
                                            Novidades
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <FilterBadge
                                                isActive={filters.showOnlyNew === undefined}
                                                onClick={() => updateFilters({ showOnlyNew: undefined })}
                                                className="!py-1.5 !px-3 text-xs"
                                            >
                                                Todos
                                            </FilterBadge>
                                            <FilterBadge
                                                isActive={filters.showOnlyNew === true}
                                                onClick={() => updateFilters({ showOnlyNew: true })}
                                                className="!py-1.5 !px-3 text-xs bg-green-50 hover:bg-green-100 border-green-100"
                                            >
                                                Apenas novos
                                            </FilterBadge>
                                        </div>
                                    </div>

                                    {/* Localização */}
                                    {stats.locationOptions.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-600 mb-2.5 flex items-center">
                                                <MapPin className="w-4 h-4 mr-1.5 text-amber-500" />
                                                Localização
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <FilterBadge
                                                    isActive={!filters.locations}
                                                    onClick={() => updateFilters({ locations: null })}
                                                    className="!py-1.5 !px-3 text-xs"
                                                >
                                                    Qualquer
                                                </FilterBadge>
                                                {stats.locationOptions.map(location => (
                                                    <FilterBadge
                                                        key={`location-${location}`}
                                                        isActive={Boolean(filters.locations?.includes(location))}
                                                        onClick={() => updateFilters({
                                                            locations: filters.locations?.includes(location) && filters.locations
                                                                ? filters.locations.filter(l => l !== location)
                                                                : [...(filters.locations || []), location]
                                                        })}
                                                        className="!py-1.5 !px-3 text-xs"
                                                    >
                                                        {location}
                                                    </FilterBadge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Indicador de filtros ativos */}
                {activeFilterCount > 0 && !showAdvancedFilters && (
                    <div className="flex items-center mb-5 text-sm text-amber-600 bg-amber-50 rounded-lg py-2 px-4 border border-amber-100">
                        <Check className="w-4 h-4 mr-2" />
                        {activeFilterCount} {activeFilterCount === 1 ? 'filtro ativo' : 'filtros ativos'} -
                        <button
                            onClick={() => setShowAdvancedFilters(true)}
                            className="underline ml-1 hover:text-amber-700"
                        >
                            Ver detalhes
                        </button>
                    </div>
                )}
            </div>            {/* Exibir imóveis usando o componente de grid com favoritos */}            <FavoritesEnabledGrid
                properties={properties}
                stats={{
                    ...stats,
                    totalProperties: stats.totalProperties || properties.length // Ensure totalProperties is always defined
                }}
                isLoading={isLoading}
                resetFilters={resetFilters}
            />{/* Mobile only - botão de filtro fixo */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
                        showAdvancedFilters
                            ? "bg-amber-500 text-white"
                            : "bg-white text-gray-700 border border-amber-200"
                    )}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                </motion.button>
            </div>

            {/* Link para ver mais */}
            <div className="mt-10 flex justify-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Link href={viewAllLink} className="group inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-full shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                        {viewAllLabel}
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.span>
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}
