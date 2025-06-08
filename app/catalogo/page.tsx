'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, MapPin, Bed, Bath, Square, Heart, Eye, Star, Sparkles, ArrowUpRight, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodosImoveis } from '@/lib/sanity/fetchImoveis'
import type { ImovelClient } from '@/src/types/imovel-client'

interface Property {
    id: string
    title: string
    price: number
    location: string
    type: string
    bedrooms: number
    bathrooms: number
    area: number
    image: string
    featured?: boolean
    isPremium?: boolean
    isNew?: boolean
    description?: string
    slug?: string
    gallery?: string[]
    amenities?: string[]
}

// Helper function to format prices
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

// PropertyCard Component
const PropertyCard = ({ property }: { property: Property }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Premium Badge */}
                {property.isPremium && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                    >
                        <Sparkles className="w-3 h-3" />
                        Premium
                    </motion.div>
                )}

                {/* New Badge */}
                {property.isNew && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        🆕 Novo
                    </div>
                )}

                {/* Featured Badge */}
                {property.featured && !property.isPremium && !property.isNew && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Destaque
                    </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                    >
                        <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                    >
                        <Eye className="w-4 h-4 text-gray-700 hover:text-blue-500 transition-colors" />
                    </motion.button>
                </div>

                {/* Quick Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                {property.bedrooms > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Bed className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-800">{property.bedrooms}</span>
                                    </div>
                                )}
                                {property.bathrooms > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Bath className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-800">{property.bathrooms}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Square className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium text-gray-800">{property.area}m²</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-medium">+2.1%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Location */}
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-600">{property.location}, Guararema</span>
                    <div className="flex-1" />
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{property.type}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                    {property.title}
                </h3>

                {/* Description */}
                {property.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {property.description}
                    </p>
                )}

                {/* Amenities Preview */}
                {property.amenities && property.amenities.length > 0 && (
                    <div className="flex gap-1 mb-4 flex-wrap">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                            <span
                                key={index}
                                className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-200"
                            >
                                {amenity}
                            </span>
                        ))}
                        {property.amenities.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{property.amenities.length - 3} mais
                            </span>
                        )}
                    </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatPrice(property.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {formatPrice(Math.round(property.price / property.area))}/m²
                        </div>
                    </div>

                    <Link
                        href={`/imovel/${property.slug || property.id}`}
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Ver Detalhes
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </Link>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-amber-500/20" />
            </div>
        </motion.div>
    )
}

export default function CatalogoPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [properties, setProperties] = useState<Property[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [priceRange, setPriceRange] = useState([0, 2000000])
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState('price')
    const [showFilters, setShowFilters] = useState(false)

    // Load properties from Sanity
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setIsLoading(true)
                const sanityProperties = await getTodosImoveis()
                // Transform Sanity data to local format
                const transformedProperties: Property[] = sanityProperties.map((prop: ImovelClient) => ({
                    id: prop._id,
                    title: prop.titulo || 'Sem título',
                    price: prop.preco || 0,
                    location: prop.bairro || '',
                    type: prop.tipoImovel || '',
                    bedrooms: prop.dormitorios || 0,
                    bathrooms: prop.banheiros || 0,
                    area: prop.areaUtil || 0,
                    image: prop.imagem?.imagemUrl || '/images/placeholder-property.jpg',
                    featured: prop.destaque || false,
                    isPremium: false,
                    isNew: false,
                    description: prop.descricao || '',
                    slug: prop.slug || '',
                    gallery: prop.galeria?.map(img => img.imagemUrl || '') || [],
                    amenities: prop.caracteristicas || []
                }))

                setProperties(transformedProperties)
            } catch (error) {
                console.error('Error loading properties:', error)
                // Fallback to mock data if Sanity fails
                setProperties([])
            } finally {
                setIsLoading(false)
            }
        }

        loadProperties()
    }, [])

    // Get filter params from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const q = urlParams.get('q')
        const tipo = urlParams.get('tipo')
        const local = urlParams.get('local')

        if (q) setSearchQuery(q)
        if (tipo) setSelectedType(tipo)
        if (local) setSelectedLocation(local)
    }, [])

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = searchQuery === '' ||
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = selectedType === '' || property.type === selectedType
        const matchesLocation = selectedLocation === '' || property.location.toLowerCase().includes(selectedLocation.toLowerCase())
        const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]

        return matchesSearch && matchesType && matchesLocation && matchesPrice
    })

    // Sort properties
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
                                    <PropertyCard property={property} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
