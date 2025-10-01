/**
 * Filtros Horizontais para Catálogo
 * Filtros que demandam espaço horizontal ficam acima do grid
 * Mobile-friendly com scroll horizontal e design responsivo
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, MapPin, DollarSign, Bed, Bath, Square, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HorizontalFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    activeFilters: FilterState;
    totalResults: number;
}

export interface FilterState {
    tipo?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: string;
    bathrooms?: string;
    areaMin?: number;
    location?: string;
}

const propertyTypes = [
    { value: '', label: 'Todos', icon: Home },
    { value: 'casa', label: 'Casa', icon: Home },
    { value: 'apartamento', label: 'Apartamento', icon: Building2 },
    { value: 'terreno', label: 'Terreno', icon: MapPin },
    { value: 'comercial', label: 'Comercial', icon: Building2 },
];

const priceRanges = [
    { min: 0, max: 0, label: 'Qualquer' },
    { min: 0, max: 300000, label: 'Até R$ 300k' },
    { min: 300000, max: 500000, label: 'R$ 300k - 500k' },
    { min: 500000, max: 1000000, label: 'R$ 500k - 1M' },
    { min: 1000000, max: 0, label: 'Acima de R$ 1M' },
];

const bedroomOptions = ['', '1+', '2+', '3+', '4+', '5+'];

export default function HorizontalFilters({ 
    onFilterChange, 
    activeFilters, 
    totalResults 
}: HorizontalFiltersProps) {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    
    const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== '' && v !== 0);

    const handleTypeChange = (tipo: string) => {
        onFilterChange({ ...activeFilters, tipo: tipo || undefined });
    };

    const handlePriceRangeChange = (min: number, max: number) => {
        onFilterChange({ 
            ...activeFilters, 
            priceMin: min || undefined, 
            priceMax: max || undefined 
        });
    };

    const handleBedroomsChange = (bedrooms: string) => {
        onFilterChange({ ...activeFilters, bedrooms: bedrooms || undefined });
    };

    const clearFilters = () => {
        onFilterChange({});
        setShowAdvanced(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header com Total de Resultados */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {totalResults} {totalResults === 1 ? 'Imóvel' : 'Imóveis'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">
                            {hasActiveFilters ? 'Filtros aplicados' : 'Explore nossa seleção'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {hasActiveFilters && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Limpar
                            </motion.button>
                        )}
                        
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all",
                                showAdvanced 
                                    ? "bg-gray-900 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros Avançados
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros Principais - Scroll Horizontal em Mobile */}
            <div className="px-4 sm:px-6 py-4">
                {/* Tipo de Imóvel */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tipo de Imóvel
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {propertyTypes.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => handleTypeChange(value)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0",
                                    activeFilters.tipo === value
                                        ? "bg-amber-500 text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Faixa de Preço */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Faixa de Preço
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {priceRanges.map(({ min, max, label }) => {
                            const isActive = activeFilters.priceMin === min && 
                                           (max === 0 || activeFilters.priceMax === max);
                            return (
                                <button
                                    key={label}
                                    onClick={() => handlePriceRangeChange(min, max)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 font-medium text-sm",
                                        isActive
                                            ? "bg-green-500 text-white shadow-lg scale-105"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dormitórios */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Dormitórios
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {bedroomOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleBedroomsChange(option)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 font-medium text-sm min-w-[80px] justify-center",
                                    activeFilters.bedrooms === option
                                        ? "bg-blue-500 text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                                )}
                            >
                                <Bed className="w-4 h-4" />
                                {option || 'Todos'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filtros Avançados - Expansível */}
            {showAdvanced && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Banheiros */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Banheiros
                            </label>
                            <select
                                value={activeFilters.bathrooms || ''}
                                onChange={(e) => onFilterChange({ ...activeFilters, bathrooms: e.target.value || undefined })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                            >
                                <option value="">Qualquer</option>
                                <option value="1+">1+</option>
                                <option value="2+">2+</option>
                                <option value="3+">3+</option>
                                <option value="4+">4+</option>
                            </select>
                        </div>

                        {/* Área Mínima */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Área Mínima (m²)
                            </label>
                            <input
                                type="number"
                                value={activeFilters.areaMin || ''}
                                onChange={(e) => onFilterChange({ ...activeFilters, areaMin: Number(e.target.value) || undefined })}
                                placeholder="Ex: 100"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        {/* Localização */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Localização/Bairro
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={activeFilters.location || ''}
                                    onChange={(e) => onFilterChange({ ...activeFilters, location: e.target.value || undefined })}
                                    placeholder="Digite o bairro..."
                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
