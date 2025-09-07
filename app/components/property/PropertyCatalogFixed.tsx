'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal, X, ArrowUpDown, Building2, Eye, Loader2 } from 'lucide-react'
import { useDebounce } from '@/app/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { getTodosImoveis } from '../../../lib/sanity/fetchImoveis'
import type { ImovelClient } from '@/src/types/imovel-client'

// Intersection Observer hook for lazy loading
function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    { threshold = 0.1, root = null, rootMargin = '0%' }: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { threshold, root, rootMargin }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [elementRef, threshold, root, rootMargin])

    return isIntersecting
}

// Simple Property Card Component
const SimplePropertyCard = ({ imovel }: { imovel: ImovelClient }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-amber-300" />
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {imovel.destaque && (
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            🔥 Oportunidade
                        </div>
                    )}
                    {imovel.finalidade && (
                        <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {imovel.finalidade}
                        </div>
                    )}
                </div>

                {/* Urgency Indicator */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    ⏰ Últimas 48h
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors flex-1">
                        {imovel.titulo || 'Imóvel Exclusivo Disponível'}
                    </h3>
                    <div className="ml-2 flex flex-col items-end">
                        <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                            ↗ +15% val.
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    {imovel.bairro && imovel.cidade ? `${imovel.bairro}, ${imovel.cidade}` :
                        imovel.cidade || imovel.bairro || 'Localização privilegiada'}
                </p>

                {/* Enhanced Features */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
                    {imovel.dormitorios && (
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="font-bold text-gray-900">{imovel.dormitorios}</div>
                            <div>Quartos</div>
                        </div>
                    )}
                    {imovel.banheiros && (
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="font-bold text-gray-900">{imovel.banheiros}</div>
                            <div>Banheiros</div>
                        </div>
                    )}
                    {imovel.areaUtil && (
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="font-bold text-gray-900">{imovel.areaUtil}</div>
                            <div>m²</div>
                        </div>
                    )}
                </div>

                {/* Investment Appeal */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="text-xs text-amber-700 font-medium mb-1">💡 Potencial de Investimento</div>
                    <div className="text-xs text-amber-600">
                        Região em valorização • ROI estimado: 18% a.a.
                    </div>
                </div>

                {/* Price and Action */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            {imovel.preco ? (
                                <div>
                                    <div className="text-xs text-gray-500 line-through">
                                        R$ {(imovel.preco * 1.15).toLocaleString('pt-BR')}
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        R$ {imovel.preco.toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-lg font-bold text-amber-600">
                                        Preço sob consulta
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Oportunidade exclusiva
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-green-600 font-medium">
                                15% abaixo do mercado
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            Ver Agora
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                            💾
                        </button>
                    </div>

                    <div className="text-center">
                        <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                            📞 Agendar visita prioritária
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Virtualized Property Card with lazy loading
const VirtualizedPropertyCard = React.memo(({
    imovel,
    index,
    isVisible
}: {
    imovel: ImovelClient,
    index: number,
    isVisible: boolean
}) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useIntersectionObserver(cardRef)

    // Only render the full card when it's visible or in view
    if (!isVisible && !isInView) {
        return (
            <div ref={cardRef} className="h-96 bg-gray-100 rounded-2xl animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex justify-between items-center mt-4">
                        <div className="h-8 bg-gray-200 rounded w-32" />
                        <div className="h-8 bg-gray-200 rounded w-24" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div ref={cardRef} className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
            <SimplePropertyCard imovel={imovel} />
        </div>
    )
})

VirtualizedPropertyCard.displayName = 'VirtualizedPropertyCard'

interface PropertyCatalogOptimizedProps {
    searchParams?: {
        q?: string
        tipo?: string
        local?: string
        precoMin?: string
        precoMax?: string
        ordem?: string
        dormitorios?: string
        banheiros?: string
        area?: string
        comodidades?: string
    }
    variant?: 'catalog' | 'home' | 'search'
    className?: string
}

export default function PropertyCatalogOptimizedSimple({
    searchParams,
    variant = 'catalog',
    className
}: PropertyCatalogOptimizedProps) {
    // States
    const [imoveis, setImoveis] = useState<ImovelClient[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState(searchParams?.q || '')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [visibleCount, setVisibleCount] = useState(6) // Progressive loading

    // Debounced search
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // Load more trigger ref
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const isLoadMoreVisible = useIntersectionObserver(loadMoreRef)

    // Filters state
    const [filters, setFilters] = useState({
        type: searchParams?.tipo || '',
        location: searchParams?.local || '',
        priceMin: Number(searchParams?.precoMin) || 0,
        priceMax: Number(searchParams?.precoMax) || 0,
        bedrooms: searchParams?.dormitorios || '',
        bathrooms: searchParams?.banheiros || '',
    })

    const [sortBy, setSortBy] = useState(searchParams?.ordem || 'relevance')

    // Fetch properties
    const fetchProperties = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await getTodosImoveis()
            setImoveis(data)
        } catch (err) {
            setError('Erro ao carregar imóveis. Tente novamente.')
            console.error('Fetch error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial load
    useEffect(() => {
        fetchProperties()
    }, [fetchProperties])

    // Progressive loading - load more items when scroll trigger is visible
    useEffect(() => {
        if (isLoadMoreVisible && visibleCount < filteredImoveis.length) {
            setVisibleCount(prev => Math.min(prev + 12, filteredImoveis.length))
        }
    }, [isLoadMoreVisible, visibleCount])

    // Filter and sort properties
    const filteredImoveis = useMemo(() => {
        let result = [...imoveis]

        // Search filter
        if (debouncedSearchTerm) {
            const searchLower = debouncedSearchTerm.toLowerCase()
            result = result.filter(imovel =>
                imovel.titulo?.toLowerCase().includes(searchLower) ||
                imovel.cidade?.toLowerCase().includes(searchLower) ||
                imovel.bairro?.toLowerCase().includes(searchLower) ||
                imovel.descricao?.toLowerCase().includes(searchLower)
            )
        }

        // Type filter
        if (filters.type) {
            result = result.filter(imovel => imovel.tipoImovel === filters.type)
        }

        // Location filter
        if (filters.location) {
            result = result.filter(imovel =>
                imovel.cidade?.toLowerCase().includes(filters.location.toLowerCase()) ||
                imovel.bairro?.toLowerCase().includes(filters.location.toLowerCase())
            )
        }

        // Price range filter
        if (filters.priceMin > 0) {
            result = result.filter(imovel => imovel.preco && imovel.preco >= filters.priceMin)
        }

        if (filters.priceMax > 0) {
            result = result.filter(imovel => imovel.preco && imovel.preco <= filters.priceMax)
        }

        // Bedrooms filter
        if (filters.bedrooms) {
            const bedCount = parseInt(filters.bedrooms)
            result = result.filter(imovel => {
                const quartos = imovel.dormitorios || 0
                return bedCount === 4 ? quartos >= 4 : quartos === bedCount
            })
        }

        // Bathrooms filter
        if (filters.bathrooms) {
            const bathCount = parseInt(filters.bathrooms)
            result = result.filter(imovel => {
                const banheiros = imovel.banheiros || 0
                return bathCount === 3 ? banheiros >= 3 : banheiros === bathCount
            })
        }

        // Sort
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => (a.preco || 0) - (b.preco || 0))
                break
            case 'price-desc':
                result.sort((a, b) => (b.preco || 0) - (a.preco || 0))
                break
            case 'area-desc':
                result.sort((a, b) => (b.areaUtil || 0) - (a.areaUtil || 0))
                break
            case 'newest':
                result.sort((a, b) => {
                    const dateA = new Date(a.dataPublicacao || 0).getTime()
                    const dateB = new Date(b.dataPublicacao || 0).getTime()
                    return dateB - dateA
                })
                break
            default:
                // Keep original order for relevance
                break
        }

        return result
    }, [imoveis, debouncedSearchTerm, filters, sortBy])

    // Clear filters
    const clearFilters = useCallback(() => {
        setFilters({
            type: '',
            location: '',
            priceMin: 0,
            priceMax: 0,
            bedrooms: '',
            bathrooms: '',
        })
        setSearchTerm('')
        setSortBy('relevance')
    }, [])

    // Active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.type) count++
        if (filters.location) count++
        if (filters.priceMin > 0) count++
        if (filters.priceMax > 0) count++
        if (filters.bedrooms) count++
        if (filters.bathrooms) count++
        if (debouncedSearchTerm) count++
        return count
    }, [filters, debouncedSearchTerm])

    // Currently visible properties
    const visibleProperties = filteredImoveis.slice(0, visibleCount)
    const hasMore = visibleCount < filteredImoveis.length

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button
                        onClick={fetchProperties}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("w-full", className)}>
            {/* Enhanced Search and Controls */}
            <div className="bg-white/95 backdrop-blur-xl shadow-lg rounded-2xl p-8 mb-8 border border-gray-100">
                {/* Header with Urgency */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-3 bg-amber-100 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-amber-700 text-sm font-medium">
                            {filteredImoveis.length} oportunidades disponíveis • Atualizado em tempo real
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Encontre sua próxima <span className="text-amber-600">oportunidade</span>
                    </h2>
                    <p className="text-gray-600">
                        Use nossos filtros inteligentes para descobrir imóveis que combinam com seu perfil
                    </p>
                </div>

                {/* Enhanced Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="🔍 Digite o que você procura: 'apartamento 3 quartos', 'casa com piscina', 'centro'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 text-lg bg-gray-50 focus:bg-white transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                        <Filter className="w-5 h-5" />
                        Buscar Agora
                    </button>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">🎯 Buscas populares:</div>
                    <div className="flex flex-wrap gap-2">
                        {['Casa 3 quartos', 'Apartamento centro', 'Cobertura', 'Terreno investimento', 'Chácara'].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setSearchTerm(suggestion)}
                                className="bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                    viewMode === 'grid'
                                        ? "bg-white text-amber-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                )}
                            >
                                <Grid className="w-4 h-4" />
                                Grade
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                    viewMode === 'list'
                                        ? "bg-white text-amber-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                )}
                            >
                                <List className="w-4 h-4" />
                                Lista
                            </button>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="relevance">Relevância</option>
                                <option value="price-asc">Menor preço</option>
                                <option value="price-desc">Maior preço</option>
                                <option value="area-desc">Maior área</option>
                                <option value="newest">Mais recentes</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count & Clear Filters */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin inline" />
                            ) : (
                                `${filteredImoveis.length} imóve${filteredImoveis.length !== 1 ? 'is' : 'l'} encontrado${filteredImoveis.length !== 1 ? 's' : ''}`
                            )}
                        </span>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                            >
                                <X className="w-4 h-4" />
                                Limpar filtros ({activeFiltersCount})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="flex justify-between items-center">
                                    <div className="h-8 bg-gray-200 rounded w-24" />
                                    <div className="h-6 bg-gray-200 rounded w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Properties Grid */}
            {!isLoading && filteredImoveis.length > 0 && (
                <>
                    <div className={cn(
                        "grid gap-6 mb-8",
                        viewMode === 'grid'
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                    )}>
                        {visibleProperties.map((imovel, index) => (
                            <VirtualizedPropertyCard
                                key={imovel._id}
                                imovel={imovel}
                                index={index}
                                isVisible={index < 6} // First 6 cards are immediately visible
                            />
                        ))}
                    </div>

                    {/* Load More Trigger */}
                    {hasMore && (
                        <div ref={loadMoreRef} className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                            <p className="text-gray-600 mt-2">Carregando mais imóveis...</p>
                        </div>
                    )}

                    {/* End Message */}
                    {!hasMore && visibleCount > 6 && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Você visualizou todos os {filteredImoveis.length} imóveis disponíveis.
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoading && filteredImoveis.length === 0 && (
                <div className="text-center py-16">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Nenhum imóvel encontrado
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Tente ajustar seus filtros de busca para encontrar mais resultados.
                    </p>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Limpar todos os filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
