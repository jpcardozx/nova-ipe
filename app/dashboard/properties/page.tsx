'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Building2,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    MapPin,
    DollarSign,
    Home,
    Bed,
    Bath,
    Square
} from 'lucide-react'

interface Property {
    id: string
    title: string
    price: number
    type: 'sale' | 'rent'
    propertyType: 'house' | 'apartment' | 'commercial'
    bedrooms?: number
    bathrooms?: number
    area: number
    location: string
    status: 'active' | 'sold' | 'rented' | 'pending'
    images: string[]
    description: string
    createdAt: Date
}

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold' | 'rented' | 'pending'>('all')

    useEffect(() => {
        loadProperties()
    }, [])

    const loadProperties = async () => {
        try {
            // Simulate loading properties
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setProperties([
                {
                    id: '1',
                    title: 'Casa 3 Quartos - Centro',
                    price: 485000,
                    type: 'sale',
                    propertyType: 'house',
                    bedrooms: 3,
                    bathrooms: 2,
                    area: 150,
                    location: 'Centro, Ipê',
                    status: 'active',
                    images: [],
                    description: 'Casa ampla no centro da cidade',
                    createdAt: new Date()
                },
                {
                    id: '2',
                    title: 'Apartamento Vista Alegre',
                    price: 1200,
                    type: 'rent',
                    propertyType: 'apartment',
                    bedrooms: 2,
                    bathrooms: 1,
                    area: 75,
                    location: 'Vista Alegre, Ipê',
                    status: 'active',
                    images: [],
                    description: 'Apartamento moderno com vista',
                    createdAt: new Date()
                },
                {
                    id: '3',
                    title: 'Casa Familiar - Jardim das Flores',
                    price: 650000,
                    type: 'sale',
                    propertyType: 'house',
                    bedrooms: 4,
                    bathrooms: 3,
                    area: 220,
                    location: 'Jardim das Flores, Ipê',
                    status: 'pending',
                    images: [],
                    description: 'Casa espaçosa para família grande',
                    createdAt: new Date()
                },
                {
                    id: '4',
                    title: 'Loft Moderno Centro',
                    price: 900,
                    type: 'rent',
                    propertyType: 'apartment',
                    bedrooms: 1,
                    bathrooms: 1,
                    area: 45,
                    location: 'Centro, Ipê',
                    status: 'rented',
                    images: [],
                    description: 'Loft moderno e compacto',
                    createdAt: new Date()
                }
            ])
            setLoading(false)
        } catch (error) {
            console.error('Error loading properties:', error)
            setLoading(false)
        }
    }

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              property.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || property.type === filterType
        const matchesStatus = filterStatus === 'all' || property.status === filterStatus
        
        return matchesSearch && matchesType && matchesStatus
    })

    const formatPrice = (price: number, type: string) => {
        if (type === 'rent') {
            return `R$ ${price.toLocaleString()}/mês`
        }
        return `R$ ${price.toLocaleString()}`
    }

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            sold: 'bg-blue-100 text-blue-800',
            rented: 'bg-purple-100 text-purple-800'
        }

        const statusLabels = {
            active: 'Ativo',
            pending: 'Pendente',
            sold: 'Vendido',
            rented: 'Alugado'
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
                {statusLabels[status as keyof typeof statusLabels]}
            </span>
        )
    }

    const getPropertyIcon = (propertyType: string) => {
        switch (propertyType) {
            case 'house': return <Home className="h-5 w-5" />
            case 'apartment': return <Building2 className="h-5 w-5" />
            default: return <Building2 className="h-5 w-5" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Imóveis</h1>
                    <p className="text-gray-600">Gerencie seu portfólio de imóveis</p>
                </div>
                <Link
                    href="/dashboard/properties/new"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Novo Imóvel
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar por título ou localização..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="sale">Venda</option>
                            <option value="rent">Locação</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os status</option>
                            <option value="active">Ativo</option>
                            <option value="pending">Pendente</option>
                            <option value="sold">Vendido</option>
                            <option value="rented">Alugado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Property Image Placeholder */}
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-gray-400" />
                            </div>

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        {getPropertyIcon(property.propertyType)}
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                            {property.title}
                                        </h3>
                                    </div>
                                    {getStatusBadge(property.status)}
                                </div>

                                {/* Price */}
                                <div className="mb-3">
                                    <span className="text-2xl font-bold text-amber-600">
                                        {formatPrice(property.price, property.type)}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 mb-4 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">{property.location}</span>
                                </div>

                                {/* Details */}
                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-1">
                                            <Bed className="h-4 w-4" />
                                            <span>{property.bedrooms}</span>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex items-center gap-1">
                                            <Bath className="h-4 w-4" />
                                            <span>{property.bathrooms}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Square className="h-4 w-4" />
                                        <span>{property.area}m²</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {property.description}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/properties/${property.id}`}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver
                                    </Link>
                                    <Link
                                        href={`/dashboard/properties/${property.id}/edit`}
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                            ? 'Tente ajustar os filtros para encontrar imóveis.'
                            : 'Adicione seu primeiro imóvel para começar.'}
                    </p>
                    <Link
                        href="/dashboard/properties/new"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Adicionar Primeiro Imóvel
                    </Link>
                </div>
            )}
        </div>
    )
}