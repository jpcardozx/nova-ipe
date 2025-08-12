'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, MapPin, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import SimplePropertyCard from '@/app/components/SimplePropertyCard'

// Simplified interface for the clean catalog
interface SimpleProperty {
    id: string
    title: string
    location: string
    price: number
    propertyType: 'sale' | 'rent'
    bedrooms?: number
    bathrooms?: number
    area?: number
    mainImage?: { url: string }
    description?: string
}

interface PropertyCatalogSimpleProps {
    searchParams?: Record<string, string>
    className?: string
    variant?: 'catalog' | 'home' | 'search'
    initialProperties?: SimpleProperty[]
}

interface FilterState {
    search: string
    type: string
    location: string
    priceMin: number
    priceMax: number
    bedrooms: string
}

// Mock data - replace with real data
const mockProperties: SimpleProperty[] = [
    {
        id: '1',
        title: 'Casa em Guararema',
        location: 'Centro, Guararema',
        price: 350000,
        propertyType: 'sale',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        mainImage: { url: '/placeholder-house.jpg' },
        description: 'Casa bem localizada no centro de Guararema'
    },
    {
        id: '2',
        title: 'Apartamento Moderno',
        location: 'Bairro do Tanque, Guararema',
        price: 280000,
        propertyType: 'sale',
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        mainImage: { url: '/placeholder-apt.jpg' },
        description: 'Apartamento novo em área nobre'
    }
]

export default function PropertyCatalogSimple({
    searchParams = {},
    className,
    variant = 'catalog',
    initialProperties = []
}: PropertyCatalogSimpleProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    const [filters, setFilters] = useState<FilterState>({
        search: searchParams.q || '',
        type: searchParams.tipo || '',
        location: searchParams.local || '',
        priceMin: 0,
        priceMax: 2000000,
        bedrooms: '',
    })

    // Use mock data if no initial properties
    const properties = initialProperties.length > 0 ? initialProperties : mockProperties

    // Simple filtering
    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            const matchesSearch = !filters.search ||
                property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                property.location.toLowerCase().includes(filters.search.toLowerCase())

            const matchesType = !filters.type || property.propertyType === filters.type
            const matchesLocation = !filters.location ||
                property.location.toLowerCase().includes(filters.location.toLowerCase())
            const matchesPrice = property.price >= filters.priceMin && property.price <= filters.priceMax
            const matchesBedrooms = !filters.bedrooms || property.bedrooms === parseInt(filters.bedrooms)

            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms
        })
    }, [properties, filters])

    const clearFilters = () => {
        setFilters({
            search: '',
            type: '',
            location: '',
            priceMin: 0,
            priceMax: 2000000,
            bedrooms: '',
        })
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Simple Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Imóveis Disponíveis
                        </h2>
                        <p className="text-slate-600">
                            {filteredProperties.length} imóveis encontrados
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View mode toggle */}
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'grid' ? "bg-white shadow-sm" : "text-slate-600"
                                )}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'list' ? "bg-white shadow-sm" : "text-slate-600"
                                )}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                showFilters
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Simple Filters */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar imóveis..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>

                        {/* Type */}
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Todos os tipos</option>
                            <option value="sale">Venda</option>
                            <option value="rent">Aluguel</option>
                        </select>

                        {/* Location */}
                        <select
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Todas as regiões</option>
                            <option value="centro">Centro</option>
                            <option value="tanque">Bairro do Tanque</option>
                            <option value="ponte-alta">Ponte Alta</option>
                        </select>

                        {/* Bedrooms */}
                        <select
                            value={filters.bedrooms}
                            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Quartos</option>
                            <option value="1">1 quarto</option>
                            <option value="2">2 quartos</option>
                            <option value="3">3 quartos</option>
                            <option value="4">4+ quartos</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Faixa de Preço: até R$ {filters.priceMax.toLocaleString()}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2000000"
                            step="50000"
                            value={filters.priceMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) }))}
                            className="w-full accent-amber-500"
                        />
                    </div>

                    {/* Clear Filters */}
                    {(filters.search || filters.type || filters.location || filters.bedrooms) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            )}

            {/* Properties Grid */}
            <div className="min-h-[400px]">
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-400 text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Nenhum imóvel encontrado
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Tente ajustar seus filtros para encontrar mais opções
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                            : 'space-y-4'
                    )}>
                        {filteredProperties.map((property) => (
                            <div key={property.id} className="group">
                                <SimplePropertyCard
                                    id={property.id}
                                    title={property.title}
                                    location={property.location}
                                    price={property.price}
                                    propertyType={property.propertyType}
                                    bedrooms={property.bedrooms}
                                    bathrooms={property.bathrooms}
                                    area={property.area}
                                    mainImage={property.mainImage}
                                    description={property.description}
                                    className="h-full"
                                    showFavoriteButton
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
