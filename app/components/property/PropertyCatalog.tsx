"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List, MapPin, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebounce } from '@/app/hooks/useDebounce'
import { PropertyCard } from './PropertyCard'
import { PropertyFilters } from './PropertyFilters'
import { PropertySearch } from './PropertySearch'
import { PropertySort } from './PropertySort'
import { EmptyState } from './EmptyState'
import { LoadingGrid } from './LoadingGrid'
import { cn } from '@/lib/utils'
import type { PropertySearchParams, PropertyData } from '@/app/types/property'

interface PropertyCatalogProps {
    initialProperties?: PropertyData[]
    searchParams?: PropertySearchParams
    className?: string
    variant?: 'catalog' | 'featured' | 'search'
}

export default function PropertyCatalog({
    initialProperties = [],
    searchParams = {},
    className,
    variant = 'catalog'
}: PropertyCatalogProps) {
    const router = useRouter()
    const urlSearchParams = useSearchParams()

    // State management
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '')
    const [filters, setFilters] = useState({
        type: searchParams.tipo || '',
        location: searchParams.local || '',
        priceMin: Number(searchParams.precoMin) || 0,
        priceMax: Number(searchParams.precoMax) || 2000000,
        bedrooms: searchParams.dormitorios || '',
        bathrooms: searchParams.banheiros || '',
        area: searchParams.area || '',
        amenities: searchParams.comodidades || []
    })
    const [sortBy, setSortBy] = useState(searchParams.ordem || 'relevance')    // Debounced search for better performance
    const debouncedSearch = useDebounce(searchQuery, 300)

    // Smart search suggestions
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Enhanced loading states
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [lastSearchTime, setLastSearchTime] = useState<number>(0)

    // Search performance tracking
    const [searchMetrics, setSearchMetrics] = useState({
        totalResults: 0,
        searchTime: 0,
        lastQuery: ''
    })

    // Enhanced error handling
    const [hasSearchError, setHasSearchError] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    // Infinite query for properties with advanced filtering
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error, isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ['properties', debouncedSearch, filters, sortBy],
        queryFn: ({ pageParam = 0 }) => fetchProperties({
            page: pageParam,
            limit: 20,
            search: debouncedSearch,
            filters,
            sort: sortBy
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasMore ? pages.length : undefined
        }
    })// Flatten all pages for virtualization
    const allProperties = useMemo(() => {
        return data?.pages.flatMap(page => page.properties) || []
    }, [data])

    // URL synchronization
    const updateURL = useCallback((newParams: Partial<PropertySearchParams>) => {
        const params = new URLSearchParams(urlSearchParams)
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        params.set(key, value.join(','))
                    } else {
                        params.delete(key)
                    }
                } else if (typeof value === 'string' && value !== '0') {
                    params.set(key, value)
                } else if (typeof value === 'number' && value !== 0) {
                    params.set(key, String(value))
                } else {
                    params.delete(key)
                }
            } else {
                params.delete(key)
            }
        })

        router.push(`?${params.toString()}`, { scroll: false })
    }, [router, urlSearchParams])

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters)
        updateURL({ ...newFilters, q: debouncedSearch, ordem: sortBy })
    }, [updateURL, debouncedSearch, sortBy])

    // Handle search changes
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query)
        updateURL({ q: query, ...filters, ordem: sortBy })
    }, [updateURL, filters, sortBy])

    // Handle sort changes
    const handleSortChange = useCallback((sort: string) => {
        setSortBy(sort)
        updateURL({ ordem: sort, q: debouncedSearch, ...filters })
    }, [updateURL, debouncedSearch, filters])

    // Active filters count
    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(value =>
            value && value !== '' && value !== 0 &&
            (Array.isArray(value) ? value.length > 0 : true)
        ).length
    }, [filters])

    // Clear all filters
    const clearFilters = useCallback(() => {
        const resetFilters = {
            type: '',
            location: '',
            priceMin: 0,
            priceMax: 2000000,
            bedrooms: '',
            bathrooms: '',
            area: '',
            amenities: []
        }
        setFilters(resetFilters)
        setSearchQuery('')
        setSortBy('relevance')
        router.push(window.location.pathname)
    }, [router])

    // Virtual scrolling setup for performance
    const parentRef = React.useRef<HTMLDivElement>(null)
    const virtualizer = useVirtualizer({
        count: allProperties.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => viewMode === 'grid' ? 400 : 200,
        overscan: 5
    })

    // Generate search suggestions based on property data and common searches
    const generateSearchSuggestions = useCallback((query: string) => {
        if (!query || query.length < 2) {
            setSearchSuggestions([])
            return
        }

        const popularSearches = [
            'Apartamento 2 quartos', 'Casa com piscina', 'Cobertura', 'Studio',
            'Loft', 'Casa geminada', 'Apartamento Garden', 'Sobrado',
            'Vila', 'Penthouse', 'Flat', 'Kitnet'
        ]

        const locationSuggestions = [
            'Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca',
            'Zona Sul', 'Zona Norte', 'Centro', 'Tijuca'
        ]

        const allSuggestions = [...popularSearches, ...locationSuggestions]
        const filtered = allSuggestions
            .filter(suggestion =>
                suggestion.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 6)

        setSearchSuggestions(filtered)
    }, [])

    // Enhanced search with performance tracking
    const handleEnhancedSearch = useCallback((query: string) => {
        const startTime = Date.now()
        setLastSearchTime(startTime)
        setHasSearchError(false)

        handleSearchChange(query)
        generateSearchSuggestions(query)

        // Track search metrics
        setTimeout(() => {
            setSearchMetrics(prev => ({
                totalResults: allProperties.length,
                searchTime: Date.now() - startTime,
                lastQuery: query
            }))
        }, 100)
    }, [handleSearchChange, generateSearchSuggestions, allProperties.length])

    // Auto-retry on search errors
    useEffect(() => {
        if (isError && retryCount < 3) {
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1)
                // Trigger refetch here if available
            }, 2000 * (retryCount + 1)) // Progressive delay

            return () => clearTimeout(timer)
        }
    }, [isError, retryCount])

    // Initial load handling
    useEffect(() => {
        if (isInitialLoad && !isLoading) {
            setIsInitialLoad(false)
        }
    }, [isLoading, isInitialLoad])

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Enhanced Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Title and Results Count */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {variant === 'catalog' && 'Catálogo de Imóveis'}
                                {variant === 'featured' && 'Imóveis em Destaque'}
                                {variant === 'search' && 'Resultados da Busca'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {allProperties.length} {allProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                                {debouncedSearch && ` para "${debouncedSearch}"`}
                            </p>
                        </div>

                        {/* Search and Controls */}
                        <div className="flex items-center gap-3">
                            <PropertySearch
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Buscar por título, localização, características..."
                                className="w-80"
                            />

                            <PropertySort
                                value={sortBy}
                                onChange={handleSortChange}
                            />

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-md transition-colors",
                                        viewMode === 'grid'
                                            ? "bg-white text-amber-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-800"
                                    )}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-md transition-colors",
                                        viewMode === 'list'
                                            ? "bg-white text-amber-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-800"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                    showFilters
                                        ? "bg-amber-500 text-white"
                                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filtros
                                {activeFiltersCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <PropertyFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        onClear={clearFilters}
                        activeCount={activeFiltersCount}
                    />)}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading && <LoadingGrid viewMode={viewMode} />}

                {isError && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 font-medium">Erro ao carregar imóveis</p>
                            <p className="text-gray-600 text-sm mt-1">{error?.message}</p>
                        </div>
                    </div>
                )}

                {status === 'success' && allProperties.length === 0 && (
                    <EmptyState
                        searchQuery={debouncedSearch}
                        hasFilters={activeFiltersCount > 0}
                        onClearFilters={clearFilters}
                    />
                )}

                {status === 'success' && allProperties.length > 0 && (
                    <div
                        ref={parentRef}
                        className="h-full overflow-auto"
                        style={{ contain: 'strict' }}
                    >
                        <div
                            style={{
                                height: `${virtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            <div className="container mx-auto px-4 py-6">
                                <div
                                    className={cn(
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
                                            : 'space-y-4'
                                    )}
                                >
                                    {virtualizer.getVirtualItems().map((virtualItem) => {
                                        const property = allProperties[virtualItem.index]
                                        return (
                                            <div
                                                key={property.id}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${virtualItem.size}px`,
                                                    transform: `translateY(${virtualItem.start}px)`,
                                                }}
                                            >
                                                <PropertyCard
                                                    property={property}
                                                    viewMode={viewMode}
                                                    variant={variant === 'featured' ? 'featured' : 'default'}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Load More Trigger */}
                                {hasNextPage && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                        >
                                            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais imóveis'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Error State Component */}
                {isError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 px-4 text-center"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Ops! Algo deu errado
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Não conseguimos carregar os imóveis no momento.
                            {retryCount > 0 && ` Tentativa ${retryCount + 1} de 3.`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Enhanced Search Results Summary */}
                {status === 'success' && allProperties.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-900">{allProperties.length}</span> imóveis
                                    {searchMetrics.searchTime > 0 && (
                                        <span className="ml-2">
                                            em <span className="font-medium">{searchMetrics.searchTime}ms</span>
                                        </span>
                                    )}
                                </div>
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">
                                            {activeFiltersCount} filtros ativos
                                        </span>
                                    </div>
                                )}
                            </div>
                            {(debouncedSearch || activeFiltersCount > 0) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                                >
                                    Limpar tudo
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// Fetch function for properties with advanced filtering
async function fetchProperties(params: {
    page: number
    limit: number
    search: string
    filters: any
    sort: string
}) {
    const { getTodosImoveis } = await import('../../../lib/sanity/fetchImoveis')

    // This would be replaced with actual API call with pagination and filtering
    const allProperties = await getTodosImoveis()

    // Apply client-side filtering (would be server-side in production)
    let filtered = allProperties.filter(property => {
        const matchesSearch = !params.search ||
            property.titulo?.toLowerCase().includes(params.search.toLowerCase()) ||
            property.bairro?.toLowerCase().includes(params.search.toLowerCase()) ||
            property.descricao?.toLowerCase().includes(params.search.toLowerCase())

        const matchesType = !params.filters.type || property.tipoImovel === params.filters.type
        const matchesLocation = !params.filters.location ||
            property.bairro?.toLowerCase().includes(params.filters.location.toLowerCase())

        const price = property.preco || 0
        const matchesPrice = price >= params.filters.priceMin && price <= params.filters.priceMax

        return matchesSearch && matchesType && matchesLocation && matchesPrice
    })

    // Apply sorting
    filtered.sort((a, b) => {
        switch (params.sort) {
            case 'price-asc':
                return (a.preco || 0) - (b.preco || 0)
            case 'price-desc':
                return (b.preco || 0) - (a.preco || 0)
            case 'area':
                return (b.areaUtil || 0) - (a.areaUtil || 0)
            case 'newest':
                return new Date(b.dataPublicacao || 0).getTime() - new Date(a.dataPublicacao || 0).getTime()
            default:
                return 0
        }
    })    // Pagination
    const start = params.page * params.limit
    const end = start + params.limit
    const paginatedProperties = filtered.slice(start, end)

    return {
        properties: paginatedProperties.map(prop => ({
            _id: prop._id,
            id: prop._id,
            title: prop.titulo || '',
            price: prop.preco || 0,
            location: prop.bairro || '',
            city: prop.cidade || '',
            type: prop.tipoImovel || '',
            bedrooms: prop.dormitorios || 0,
            bathrooms: prop.banheiros || 0,
            area: prop.areaUtil || 0,
            image: prop.imagem?.imagemUrl || '',
            gallery: prop.galeria?.map(img => img.imagemUrl).filter(Boolean) || [],
            amenities: prop.caracteristicas || [],
            featured: prop.destaque || false,
            slug: prop.slug || '',
            description: prop.descricao || '',
            address: prop.endereco || ''
        })),
        hasMore: end < filtered.length,
        total: filtered.length
    }
}
