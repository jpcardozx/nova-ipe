'use client'

import React, { Suspense, lazy, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Search, Filter, Grid, List, MapPin, SlidersHorizontal, X, ArrowUpDown, Building2, Eye } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/app/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { PropertyCardUnified } from '@/app/components/ui/property/PropertyCardUnified'
import { getTodosImoveis } from '@/lib/sanity/fetchImoveis'
import type { ImovelClient } from '@/src/types/imovel-client'

// Lazy load components for performance
const PropertyFilters = lazy(() => import('./PropertyFilters').then(m => ({ default: m.PropertyFilters })))
const PropertySort = lazy(() => import('./PropertySort').then(m => ({ default: m.PropertySort })))

// Intersection Observer hook for lazy loading
function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    { threshold = 0.1, root = null, rootMargin = '0%' }: IntersectionObserverInit = {}
) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>()

    const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]) => {
        setEntry(entry)
    }, [])

    useEffect(() => {
        const node = elementRef?.current
        const hasIOSupport = !!window.IntersectionObserver

        if (!hasIOSupport || !node) return

        const observerParams = { threshold, root, rootMargin }
        const observer = new IntersectionObserver(updateEntry, observerParams)

        observer.observe(node)

        return () => observer.disconnect()
    }, [elementRef, threshold, root, rootMargin, updateEntry])

    return entry
}

// Virtual scrolling component for performance
interface VirtualizedPropertyCardProps {
    imovel: ImovelClient
    index: number
    isVisible: boolean
}

const VirtualizedPropertyCard: React.FC<VirtualizedPropertyCardProps> = React.memo(({ imovel, index, isVisible }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const entry = useIntersectionObserver(cardRef, { threshold: 0.1 })
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        if (entry?.isIntersecting && !hasLoaded) {
            setHasLoaded(true)
        }
    }, [entry?.isIntersecting, hasLoaded])

    if (!isVisible && !hasLoaded) {
        return (
            <div
                ref={cardRef}
                className="w-full h-96 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className="text-center">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-500">Carregando...</div>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={cardRef}
            className={cn(
                "transform transition-all duration-500",
                hasLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <PropertyCardUnified
                id={imovel._id}
                title={imovel.titulo || ''}
                slug={imovel.slug || ''}
                location={imovel.endereco || ''}
                city={imovel.cidade || ''}
                price={imovel.preco || 0}
                propertyType={imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent'}
                area={imovel.areaUtil || undefined}
                bedrooms={imovel.dormitorios || undefined}
                bathrooms={imovel.banheiros || undefined}
                parkingSpots={imovel.vagas || undefined}
                mainImage={{
                    url: imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '',
                    alt: imovel.titulo || '',
                    sanityImage: imovel.imagem
                }}
                isHighlight={imovel.destaque || false}
                isNew={Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
            />
        </div>
    )
})

VirtualizedPropertyCard.displayName = 'VirtualizedPropertyCard'

// Loading skeleton component
const PropertyCardSkeleton: React.FC<{ index: number }> = ({ index }) => (
    <div
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="aspect-[4/3] bg-slate-200"></div>
        <div className="p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-200 rounded w-24"></div>
                <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
        </div>
    </div>
)

// Enhanced search component
const EnhancedSearch: React.FC<{
    value: string
    onChange: (value: string) => void
    onFocus: () => void
    onBlur: () => void
}> = ({ value, onChange, onFocus, onBlur }) => {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder="Buscar por localização, tipo, características..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-lg"
            />
        </div>
    )
}

// Main component
interface PropertyCatalogProps {
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
    className?: string
    variant?: 'catalog' | 'featured' | 'search'
}

export default function PropertyCatalogOptimized({
    searchParams = {},
    className,
    variant = 'catalog'
}: PropertyCatalogProps) {
    const router = useRouter()
    const [imoveis, setImoveis] = useState<ImovelClient[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Search and filters
    const [searchQuery, setSearchQuery] = useState(searchParams.q || '')
    const [filters, setFilters] = useState({
        type: searchParams.tipo || '',
        location: searchParams.local || '',
        priceMin: Number(searchParams.precoMin) || 0,
        priceMax: Number(searchParams.precoMax) || 2000000,
        bedrooms: searchParams.dormitorios || '',
        bathrooms: searchParams.banheiros || '',
        area: searchParams.area || ''
    })
    const [sortBy, setSortBy] = useState(searchParams.ordem || 'relevance')

    // Performance optimizations
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 12 })
    const [batchSize] = useState(12)
    const debouncedSearch = useDebounce(searchQuery, 500)

    // Load initial data
    useEffect(() => {
        const loadImoveis = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getTodosImoveis()
                setImoveis(data || [])
            } catch (err) {
                console.error('Erro ao carregar imóveis:', err)
                setError('Erro ao carregar imóveis. Tente novamente.')
            } finally {
                setLoading(false)
            }
        }

        loadImoveis()
    }, [])

    // Filter and sort logic
    const filteredImoveis = useMemo(() => {
        let result = [...imoveis]

        // Apply search filter
        if (debouncedSearch) {
            const searchTerm = debouncedSearch.toLowerCase()
            result = result.filter(imovel =>
                imovel.titulo?.toLowerCase().includes(searchTerm) ||
                imovel.endereco?.toLowerCase().includes(searchTerm) ||
                imovel.bairro?.toLowerCase().includes(searchTerm) ||
                imovel.cidade?.toLowerCase().includes(searchTerm) ||
                imovel.descricao?.toLowerCase().includes(searchTerm)
            )
        }

        // Apply filters
        if (filters.type) {
            result = result.filter(imovel =>
                imovel.finalidade?.toLowerCase() === filters.type.toLowerCase()
            )
        }

        if (filters.location) {
            const locationTerm = filters.location.toLowerCase()
            result = result.filter(imovel =>
                imovel.endereco?.toLowerCase().includes(locationTerm) ||
                imovel.bairro?.toLowerCase().includes(locationTerm) ||
                imovel.cidade?.toLowerCase().includes(locationTerm)
            )
        }

        if (filters.priceMin > 0) {
            result = result.filter(imovel => (imovel.preco || 0) >= filters.priceMin)
        }

        if (filters.priceMax < 2000000) {
            result = result.filter(imovel => (imovel.preco || 0) <= filters.priceMax)
        }

        if (filters.bedrooms) {
            result = result.filter(imovel =>
                String(imovel.dormitorios) === filters.bedrooms
            )
        }

        if (filters.bathrooms) {
            result = result.filter(imovel =>
                String(imovel.banheiros) === filters.bathrooms
            )
        }

        // Apply sorting
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
                    const dateA = a.dataPublicacao ? new Date(a.dataPublicacao).getTime() : 0
                    const dateB = b.dataPublicacao ? new Date(b.dataPublicacao).getTime() : 0
                    return dateB - dateA
                })
                break
            default: // relevance
                result.sort((a, b) => {
                    // Priorizar imóveis em destaque
                    if (a.destaque && !b.destaque) return -1
                    if (!a.destaque && b.destaque) return 1
                    return 0
                })
        }

        return result
    }, [imoveis, debouncedSearch, filters, sortBy])

    // Virtual scrolling for performance
    const visibleImoveis = useMemo(() => {
        return filteredImoveis.slice(0, visibleRange.end)
    }, [filteredImoveis, visibleRange.end])

    // Load more handler
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const loadMoreEntry = useIntersectionObserver(loadMoreRef, { threshold: 0.1 })

    useEffect(() => {
        if (loadMoreEntry?.isIntersecting && visibleRange.end < filteredImoveis.length) {
            setVisibleRange(prev => ({
                ...prev,
                end: Math.min(prev.end + batchSize, filteredImoveis.length)
            }))
        }
    }, [loadMoreEntry?.isIntersecting, filteredImoveis.length, visibleRange.end, batchSize])

    // Error state
    if (error) {
        return (
            <div className="min-h-96 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Erro ao carregar imóveis</h3>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("relative", className)}>
            {/* Search and Filters Bar */}
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-slate-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <EnhancedSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                                showFilters
                                    ? "bg-amber-500 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>

                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
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
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <Suspense fallback={<div className="animate-pulse h-32 bg-slate-100 rounded"></div>}>
                            <PropertyFilters
                                filters={filters}
                                onChange={setFilters}
                                onReset={() => setFilters({
                                    type: '',
                                    location: '',
                                    priceMin: 0,
                                    priceMax: 2000000,
                                    bedrooms: '',
                                    bathrooms: '',
                                    area: ''
                                })}
                            />
                        </Suspense>
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {filteredImoveis.length} {filteredImoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                    </h2>
                    {debouncedSearch && (
                        <span className="text-sm text-slate-500">
                            para "{debouncedSearch}"
                        </span>
                    )}
                </div>

                <Suspense fallback={<div className="w-48 h-10 bg-slate-100 rounded animate-pulse"></div>}>
                    <PropertySort value={sortBy} onChange={setSortBy} />
                </Suspense>
            </div>

            {/* Loading State */}
            {loading && (
                <div className={cn(
                    "grid gap-6",
                    viewMode === 'grid'
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                )}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} index={i} />
                    ))}
                </div>
            )}

            {/* Properties Grid */}
            {!loading && (
                <>
                    {filteredImoveis.length === 0 ? (
                        <div className="text-center py-16">
                            <Eye className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                Nenhum imóvel encontrado
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Tente ajustar os filtros ou termo de busca
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setFilters({
                                        type: '',
                                        location: '',
                                        priceMin: 0,
                                        priceMax: 2000000,
                                        bedrooms: '',
                                        bathrooms: '',
                                        area: ''
                                    })
                                }}
                                className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    ) : (
                        <div className={cn(
                            "grid gap-6",
                            viewMode === 'grid'
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                        )}>
                            {visibleImoveis.map((imovel, index) => (
                                <VirtualizedPropertyCard
                                    key={imovel._id}
                                    imovel={imovel}
                                    index={index}
                                    isVisible={index < 6} // Show first 6 immediately
                                />
                            ))}
                        </div>
                    )}

                    {/* Load more trigger */}
                    {visibleRange.end < filteredImoveis.length && (
                        <div ref={loadMoreRef} className="mt-12 text-center">
                            <div className="animate-pulse">
                                <div className="text-slate-500">Carregando mais imóveis...</div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
