"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, SlidersHorizontal, DollarSign, Home, MapPin, Bed, Bath, Ruler, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyFiltersProps {
  filters: {
    type: string
    location: string
    priceMin: number
    priceMax: number
    bedrooms: string
    bathrooms: string
    area: string
    amenities: string[]
  }
  onChange: (filters: any) => void
  onClear: () => void
  activeCount: number
}

const propertyTypes = [
  { value: 'casa', label: '🏠 Casa', icon: Home },
  { value: 'apartamento', label: '🏢 Apartamento', icon: Home },
  { value: 'terreno', label: '🌱 Terreno', icon: Home },
  { value: 'chacara', label: '🌳 Chácara', icon: Home },
  { value: 'comercial', label: '🏪 Comercial', icon: Home },
]

const locations = [
  { value: 'centro', label: '📍 Centro' },
  { value: 'tanque', label: '📍 Bairro do Tanque' },
  { value: 'ponte-alta', label: '📍 Ponte Alta' },
  { value: 'itapema', label: '📍 Itapema' },
  { value: 'rural', label: '🌾 Zona Rural' },
]

const bedroomOptions = [
  { value: '1', label: '1 quarto' },
  { value: '2', label: '2 quartos' },
  { value: '3', label: '3 quartos' },
  { value: '4', label: '4+ quartos' },
]

const bathroomOptions = [
  { value: '1', label: '1 banheiro' },
  { value: '2', label: '2 banheiros' },
  { value: '3', label: '3+ banheiros' },
]

const amenitiesList = [
  'Piscina', 'Churrasqueira', 'Garagem', 'Jardim', 'Varanda',
  'Ar condicionado', 'Aquecimento', 'Internet', 'Mobiliado',
  'Pet friendly', 'Academia', 'Playground'
]

export function PropertyFilters({ filters, onChange, onClear, activeCount }: PropertyFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    location: true,
    features: false,
    amenities: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = (key: string, value: any) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    
    updateFilter('amenities', newAmenities)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3>
            {activeCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full font-medium">
                {activeCount} {activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}
              </span>
            )}
          </div>
          <button
            onClick={onClear}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Limpar todos
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Faixa de Preço</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.price ? 180 : 0 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </button>
            
            {expandedSections.price && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pl-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço mínimo
                    </label>
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => updateFilter('priceMin', Number(e.target.value))}
                      placeholder="R$ 0"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço máximo
                    </label>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
                      placeholder="R$ 2.000.000"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={filters.priceMax}
                    onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>R$ 0</span>
                    <span className="font-medium text-amber-600">{formatPrice(filters.priceMax)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('type')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Tipo de Imóvel</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.type ? 180 : 0 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </button>
            
            {expandedSections.type && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pl-6"
              >
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateFilter('type', filters.type === type.value ? '' : type.value)}
                    className={cn(
                      "p-3 text-left border rounded-lg transition-all font-medium",
                      filters.type === type.value
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('location')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Localização</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.location ? 180 : 0 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </button>
            
            {expandedSections.location && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pl-6"
              >
                {locations.map((location) => (
                  <button
                    key={location.value}
                    onClick={() => updateFilter('location', filters.location === location.value ? '' : location.value)}
                    className={cn(
                      "p-3 text-left border rounded-lg transition-all font-medium",
                      filters.location === location.value
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    )}
                  >
                    {location.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('features')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Características</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.features ? 180 : 0 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </button>
            
            {expandedSections.features && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-6"
              >
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartos
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => updateFilter('bedrooms', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Qualquer</option>
                    {bedroomOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banheiros
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => updateFilter('bathrooms', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Qualquer</option>
                    {bathroomOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área mínima (m²)
                  </label>
                  <input
                    type="number"
                    value={filters.area}
                    onChange={(e) => updateFilter('area', e.target.value)}
                    placeholder="Ex: 100"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('amenities')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Comodidades</span>
                {filters.amenities.length > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                    {filters.amenities.length}
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: expandedSections.amenities ? 180 : 0 }}
                className="text-gray-400"
              >
                ↓
              </motion.div>
            </button>
            
            {expandedSections.amenities && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pl-6"
              >
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "p-3 text-left border rounded-lg transition-all font-medium text-sm",
                      filters.amenities.includes(amenity)
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    )}
                  >
                    {amenity}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
