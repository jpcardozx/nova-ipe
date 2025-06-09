'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Filter,
    Grid,
    List,
    ArrowUpRight
} from 'lucide-react'
import PremiumPropertyCardOptimized from '@/app/components/premium/PremiumPropertyCardOptimized'
import { getTodosImoveis } from '@/lib/sanity/fetchImoveis'

interface Property {
    id: string
    title: string
    price: number
    location: string
    city: string
    type: string
    bedrooms: number
    bathrooms: number
    area: number
    image: string
    gallery: string[]
    amenities: string[]
    featured: boolean
    slug: string
    description: string
    address: string
}

interface CatalogoPageProps {
    searchParams?: {
        q?: string
        tipo?: string
        local?: string
        precoMin?: string
        precoMax?: string
        ordem?: string
    }
}

export default function CatalogoPage({ searchParams }: CatalogoPageProps) {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [priceRange, setPriceRange] = useState([0, 2000000])
    const [sortBy, setSortBy] = useState('price')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    // Load properties on mount
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setIsLoading(true)
                const sanityProperties = await getTodosImoveis()

                const transformedProperties: Property[] = sanityProperties.map((prop: any) => ({
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
                    gallery: prop.galeria?.map((img: any) => img.imagemUrl).filter(Boolean) || [],
                    amenities: prop.caracteristicas || [],
                    featured: prop.destaque || false,
                    slug: prop.slug || '',
                    description: prop.descricao || '',
                    address: prop.endereco || ''
                }))

                setProperties(transformedProperties)
            } catch (error) {
                console.error('Error loading properties:', error)
                setProperties([])
            } finally {
                setIsLoading(false)
            }
        }

        loadProperties()
    }, [])

    // Get filter params from URL
    useEffect(() => {
        if (searchParams) {
            if (searchParams.q) setSearchQuery(searchParams.q)
            if (searchParams.tipo) setSelectedType(searchParams.tipo)
            if (searchParams.local) setSelectedLocation(searchParams.local)
        }
    }, [searchParams])

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = searchQuery === '' ||
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = selectedType === '' || property.type === selectedType
        const matchesLocation = selectedLocation === '' || property.location.toLowerCase().includes(selectedLocation.toLowerCase())
        const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]

        return matchesSearch && matchesType && matchesLocation && matchesPrice
    })    // Sort properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price
            case 'price-desc':
                return b.price - a.price
            case 'area':
                return b.area - a.area
            default:
                return 0
        }
    })

    // Transform property to premium card format
    const transformPropertyToPremium = (property: Property) => {
        const mapPropertyType = (type: string): 'sale' | 'rent' => {
            const lowerType = type.toLowerCase();
            if (lowerType.includes('aluguel') || lowerType.includes('locacao') || lowerType.includes('rent')) {
                return 'rent';
            }
            return 'sale';
        };

        return {
            id: property.id,
            title: property.title,
            price: property.price,
            address: property.address || property.location,
            location: property.location,
            images: property.gallery?.map((url: string) => ({ url, alt: property.title })) || [],
            mainImage: property.image ? { url: property.image, alt: property.title } : undefined,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            parkingSpots: 0, // Add default parking spots
            type: mapPropertyType(property.type),
            tags: property.amenities || [],
            featured: property.featured,
            isNew: false, // Add default value
            isPremium: property.featured, // Use featured as premium indicator
            exclusive: false, // Add default value
            slug: property.slug
        };
    }

    // Format price helper
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando imóveis...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Enhanced Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
            >
                <div className="container mx-auto px-4 py-6">
                    {/* Header Top Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left Side - Branding & Navigation */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className="group flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-all duration-200"
                            >
                                <ArrowUpRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                                <span className="font-medium">Voltar ao início</span>
                            </Link>

                            <div className="h-6 w-px bg-gray-300" />

                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Catálogo de Imóveis
                                </h1>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-gray-600">
                                        {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                                    </p>
                                    {filteredProperties.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span>Atualizado agora</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Search & Controls */}
                        <div className="flex items-center gap-4">
                            {/* Enhanced Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título, localização..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-3 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-white shadow-sm text-amber-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-white shadow-sm text-amber-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Filters Toggle */}
                            <motion.button
                                onClick={() => setShowFilters(!showFilters)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium shadow-sm ${showFilters
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filtros
                                {(selectedType || selectedLocation || priceRange[0] > 0 || priceRange[1] < 2000000) && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Enhanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border-b border-gray-200 shadow-sm"
                    >
                        <div className="container mx-auto px-4 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Property Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Imóvel
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all duration-200"
                                    >
                                        <option value="">Todos os tipos</option>
                                        <option value="casa">🏠 Casa</option>
                                        <option value="apartamento">🏢 Apartamento</option>
                                        <option value="terreno">🌱 Terreno</option>
                                        <option value="chacara">🌳 Chácara</option>
                                        <option value="comercial">🏪 Comercial</option>
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Localização
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all duration-200"
                                    >
                                        <option value="">Todas as regiões</option>
                                        <option value="centro">📍 Centro</option>
                                        <option value="tanque">📍 Bairro do Tanque</option>
                                        <option value="ponte-alta">📍 Ponte Alta</option>
                                        <option value="itapema">📍 Itapema</option>
                                        <option value="rural">🌾 Zona Rural</option>
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preço máximo
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="2000000"
                                            step="50000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full accent-amber-500"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>R$ 0</span>
                                            <span className="font-medium text-amber-600">{formatPrice(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ordenar por
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all duration-200"
                                    >
                                        <option value="price">Relevância</option>
                                        <option value="price-asc">💰 Menor preço</option>
                                        <option value="price-desc">💎 Maior preço</option>
                                        <option value="area">📐 Maior área</option>
                                    </select>
                                </div>
                            </div>

                            {/* Active Filters & Clear */}
                            {(selectedType || selectedLocation || priceRange[1] < 2000000) && (
                                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedType && (
                                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {selectedType}
                                                <button
                                                    onClick={() => setSelectedType('')}
                                                    className="ml-2 text-amber-600 hover:text-amber-800"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        )}
                                        {selectedLocation && (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {selectedLocation}
                                                <button
                                                    onClick={() => setSelectedLocation('')}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        )}
                                        {priceRange[1] < 2000000 && (
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Até {formatPrice(priceRange[1])}
                                                <button
                                                    onClick={() => setPriceRange([0, 2000000])}
                                                    className="ml-2 text-green-600 hover:text-green-800"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedType('')
                                            setSelectedLocation('')
                                            setPriceRange([0, 2000000])
                                            setSortBy('price')
                                        }}
                                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Limpar todos
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Properties Grid */}
                <div className="flex-1">
                    {sortedProperties.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-400 text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhum imóvel encontrado
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Tente ajustar seus filtros para encontrar mais opções
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedType('')
                                    setSelectedLocation('')
                                    setPriceRange([0, 2000000])
                                    setSortBy('price')
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                            >
                                Limpar Filtros
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                : 'space-y-6'
                            }
                        >
                            {sortedProperties.map((property, index) => (
                                <motion.div
                                    key={property.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <PremiumPropertyCardOptimized
                                        {...transformPropertyToPremium(property)}
                                        variant="default"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
