'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Grid, List, MapPin, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import PropertyCardPremium from '@/app/components/PropertyCardPremium'
import {
    transformToUnifiedPropertyList,
    toPropertyCardPremiumProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer'
import type { ImovelClient } from '@/src/types/imovel-client'

interface PropertyCatalogCleanProps {
    searchParams?: Record<string, string>
    className?: string
    variant?: 'catalog' | 'home' | 'search'
    initialProperties?: ImovelClient[]
}

interface FilterState {
    search: string
    type: string
    location: string
    priceMin: number
    priceMax: number
    bedrooms: string
}

interface SortOption {
    value: string
    label: string
}

// Dados reais conectados via props - sem mock data
export default function PropertyCatalogClean({
    searchParams = {},
    className,
    variant = 'catalog',
    initialProperties = []
}: PropertyCatalogCleanProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [sortBy, setSortBy] = useState('relevant')
    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    const [filters, setFilters] = useState<FilterState>({
        search: searchParams.q || '',
        type: searchParams.tipo || '',
        location: searchParams.local || '',
        priceMin: 0,
        priceMax: 2000000,
        bedrooms: '',
    })

    // Opções de ordenação
    const sortOptions: SortOption[] = [
        { value: 'relevant', label: 'Mais Relevantes' },
        { value: 'price-asc', label: 'Menor Preço' },
        { value: 'price-desc', label: 'Maior Preço' },
        { value: 'newest', label: 'Mais Recentes' },
        { value: 'area-desc', label: 'Maior Área' },
        { value: 'bedrooms-desc', label: 'Mais Quartos' }
    ]

    // Usar dados reais vindos das props
    const sourceProperties = initialProperties

    // Transformar para formato unificado
    const unifiedProperties = useMemo(() => {
        try {
            return transformToUnifiedPropertyList(sourceProperties)
        } catch (error) {
            console.error('Erro ao transformar propriedades:', error)
            return []
        }
    }, [sourceProperties])

    // Carregar favoritos do localStorage
    React.useEffect(() => {
        const savedFavorites = localStorage.getItem('property-favorites')
        if (savedFavorites) {
            try {
                const favoriteIds = JSON.parse(savedFavorites)
                setFavorites(new Set(favoriteIds))
            } catch (error) {
                console.error('Erro ao carregar favoritos:', error)
            }
        }
    }, [])

    // Debug otimizado - só quando mudar conteúdo
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && initialProperties.length > 0) {
            const debugData = {
                '📊 Total imóveis': initialProperties.length,
                '✅ Com imagem': initialProperties.filter(p => p.imagem?.imagemUrl).length,
                '🖼️ Com galeria': initialProperties.filter(p => p.galeria?.length > 0).length,
                '🎆 Destaques': initialProperties.filter(p => p.destaque).length
            };
            console.log('🏠 Catálogo carregado:', debugData);
        }
    }, [initialProperties.length])    // Filtros e ordenação aprimorados
    const filteredAndSortedProperties = useMemo(() => {
        let filtered = unifiedProperties.filter(property => {
            const matchesSearch = !filters.search ||
                property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                property.location.toLowerCase().includes(filters.search.toLowerCase()) ||
                property.description?.toLowerCase().includes(filters.search.toLowerCase())

            const matchesType = !filters.type || property.propertyType === filters.type

            const matchesLocation = !filters.location ||
                property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                property.city.toLowerCase().includes(filters.location.toLowerCase())

            const matchesPrice = property.price >= filters.priceMin && property.price <= filters.priceMax

            const matchesBedrooms = !filters.bedrooms ||
                (property.bedrooms !== undefined && property.bedrooms >= parseInt(filters.bedrooms))

            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms
        })

        // Aplicar ordenação
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'newest':
                filtered.sort((a, b) => new Date(b.publishedDate || '').getTime() - new Date(a.publishedDate || '').getTime())
                break
            case 'area-desc':
                filtered.sort((a, b) => (b.area || 0) - (a.area || 0))
                break
            case 'bedrooms-desc':
                filtered.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0))
                break
            default:
                // Manter ordem original (relevância)
                break
        }

        return filtered
    }, [unifiedProperties, filters, sortBy])

    // Handlers
    const handleFavoriteToggle = (propertyId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(propertyId)) {
                newFavorites.delete(propertyId)
            } else {
                newFavorites.add(propertyId)
            }
            // Salvar no localStorage
            localStorage.setItem('property-favorites', JSON.stringify([...newFavorites]))
            return newFavorites
        })
    }

    const handleSearch = (searchTerm: string) => {
        setIsLoading(true)
        setFilters(prev => ({ ...prev, search: searchTerm }))
        // Simular loading para melhor UX
        setTimeout(() => setIsLoading(false), 300)
    }

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
                            {filteredAndSortedProperties.length} imóveis encontrados
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Ordenação */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* View mode toggle */}
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'grid' ? "bg-white shadow-sm" : "text-slate-600"
                                )}
                                title="Visualização em Grade"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'list' ? "bg-white shadow-sm" : "text-slate-600"
                                )}
                                title="Visualização em Lista"
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
                                placeholder="Buscar por título, localização..."
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                            {isLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
                                </div>
                            )}
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

                    {/* Filtros Rápidos */}
                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <p className="text-sm font-medium text-slate-700 mb-3">Filtros Rápidos:</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Venda', type: 'sale' },
                                { label: 'Aluguel', type: 'rent' },
                                { label: 'Até R$ 500k', priceMax: 500000 },
                                { label: 'R$ 500k - R$ 1M', priceMin: 500000, priceMax: 1000000 },
                                { label: 'Acima R$ 1M', priceMin: 1000000 },
                                { label: '3+ Quartos', bedrooms: '3' },
                            ].map((quickFilter, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if ('type' in quickFilter) {
                                            setFilters(prev => ({ ...prev, type: quickFilter.type }))
                                        } else if ('bedrooms' in quickFilter) {
                                            setFilters(prev => ({ ...prev, bedrooms: quickFilter.bedrooms! }))
                                        } else {
                                            setFilters(prev => ({
                                                ...prev,
                                                priceMin: quickFilter.priceMin || 0,
                                                priceMax: quickFilter.priceMax || 2000000
                                            }))
                                        }
                                    }}
                                    className="px-3 py-1 text-sm border border-slate-200 rounded-full hover:bg-amber-50 hover:border-amber-300 transition-colors"
                                >
                                    {quickFilter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-4">
                        {(filters.search || filters.type || filters.location || filters.bedrooms) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-amber-600 hover:text-amber-700 font-medium underline"
                            >
                                Limpar todos os filtros
                            </button>
                        )}
                        <span className="text-sm text-slate-500 ml-auto">
                            {filteredAndSortedProperties.length} de {unifiedProperties.length} imóveis
                        </span>
                    </div>
                </div>
            )}

            {/* Properties Grid */}
            <div className="min-h-[400px]">
                {filteredAndSortedProperties.length === 0 ? (
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
                        {filteredAndSortedProperties.map((property) => {
                            const cardProps = toPropertyCardPremiumProps(property)
                            return (
                                <div key={property.id} className="group">
                                    <PropertyCardPremium
                                        {...cardProps}
                                        variant={viewMode === 'list' ? 'compact' : 'default'}
                                        className="h-full transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                                        showFavoriteButton={true}
                                        isFavorite={favorites.has(property.id)}
                                        onFavoriteToggle={handleFavoriteToggle}
                                        isNew={property.publishedDate && new Date(property.publishedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
