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

export default PropertyFilters;

// Auto-generated type exports
export type { PropertyFiltersProps } from './PropertyFilters';