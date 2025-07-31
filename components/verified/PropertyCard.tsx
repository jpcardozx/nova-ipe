"use client"

import React, { useState, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    MapPin, Bed, Bath, Ruler, Heart, Eye, Star, ArrowRight,
    Car, Wifi, Droplets, Trees, Zap, Shield, Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyData } from '@/app/types/property'

interface PropertyCardProps {
    property: PropertyData
    viewMode: 'grid' | 'list'
    variant?: 'default' | 'featured' | 'compact'
    className?: string
    onFavoriteToggle?: (id: string) => void
    isFavorited?: boolean
}

const amenityIcons: Record<string, React.ComponentType<any>> = {
    'Piscina': Droplets,
    'Garagem': Car,
    'Internet': Wifi,
    'Jardim': Trees,
    'Energia': Zap,
    'Segurança': Shield,
}

// Animation variants
const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
}

const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 }
}

export default PropertyCard;