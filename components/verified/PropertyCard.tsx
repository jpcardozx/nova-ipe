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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
}

const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 }
}

function PropertyCard({
    property,
    viewMode = 'grid',
    variant = 'default',
    className,
    onFavoriteToggle,
    isFavorited = false
}: PropertyCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isFavorite, setIsFavorite] = useState(isFavorited)

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        onFavoriteToggle?.(property.id || '')
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className={cn(
                "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200",
                "hover:shadow-xl transition-shadow duration-300",
                viewMode === 'list' && "flex flex-row",
                className
            )}
        >
            <div className={cn(
                "relative overflow-hidden",
                viewMode === 'grid' ? "h-48" : "w-48 h-full"
            )}>
                <Image
                    src={property.imagem?.imagemUrl || '/placeholder-property.jpg'}
                    alt={property.titulo || property.title || 'Imóvel'}
                    fill
                    className="object-cover"
                    onLoad={() => setImageLoaded(true)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                    <Heart className={cn(
                        "h-4 w-4",
                        isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    )} />
                </button>
            </div>

            <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {property.titulo || property.title}
                    </h3>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm line-clamp-1">
                        {property.bairro}, {property.cidade}
                    </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    {(property.dormitorios || property.bedrooms) && (
                        <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.dormitorios || property.bedrooms}</span>
                        </div>
                    )}
                    {(property.banheiros || property.bathrooms) && (
                        <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.banheiros || property.bathrooms}</span>
                        </div>
                    )}
                    {(property.areaUtil || property.area) && (
                        <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            <span>{property.areaUtil || property.area}m²</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-blue-600">
                            R$ {(property.preco || property.price)?.toLocaleString('pt-BR')}
                        </span>
                        {property.finalidade === 'Aluguel' && (
                            <span className="text-gray-500 text-sm">/mês</span>
                        )}
                    </div>

                    <Link
                        href={`/imovel/${property.slug || property._id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Ver mais
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default PropertyCard;