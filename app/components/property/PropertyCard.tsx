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

export const PropertyCard = memo<PropertyCardProps>(({
    property,
    viewMode,
    variant = 'default',
    className,
    onFavoriteToggle,
    isFavorited = false
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onFavoriteToggle?.(property._id || property.id || '')
    }

    // Normalize property data to handle different interface formats
    const propertyData = {
        id: property._id || property.id || '',
        title: property.titulo || property.title || '',
        price: property.preco || property.price || 0,
        location: property.bairro || '',
        city: property.cidade || '',
        type: property.tipoImovel || '',
        bedrooms: property.dormitorios || property.bedrooms || 0,
        bathrooms: property.banheiros || property.bathrooms || 0,
        area: property.areaUtil || property.area || 0,
        image: property.imagem?.imagemUrl || '',
        gallery: property.galeria?.map(img => img.imagemUrl).filter(Boolean) || [],
        amenities: property.caracteristicas || property.amenities || [],
        featured: property.destaque || property.featured || false,
        slug: property.slug || '',
        description: property.descricao || property.description || '',
    }

    const displayAmenities = propertyData.amenities.slice(0, 3)
    const hasMoreAmenities = propertyData.amenities.length > 3
    const allImages = [propertyData.image, ...propertyData.gallery].filter(Boolean)

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `R$ ${(price / 1000000).toFixed(1)}M`
        } else if (price >= 1000) {
            return `R$ ${(price / 1000).toFixed(0)}K`
        }
        return `R$ ${price.toLocaleString('pt-BR')}`
    }

    if (viewMode === 'list') {
        return (
            <motion.div
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={cn(
                    "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300",
                    className
                )}
            >
                <Link href={`/imovel/${propertyData.slug}`} className="flex">
                    {/* Image Section */}
                    <div className="relative w-64 h-40 flex-shrink-0 overflow-hidden">
                        <motion.div variants={imageVariants}>
                            <Image
                                src={propertyData.image || '/images/placeholder-property.jpg'}
                                alt={propertyData.title}
                                fill
                                className="object-cover"
                                onLoad={() => setImageLoaded(true)}
                                sizes="(max-width: 768px) 100vw, 256px"
                            />
                        </motion.div>

                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}

                        {/* Image overlay badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {propertyData.featured && (
                                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Destaque
                                </span>
                            )}
                            {propertyData.type && (
                                <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                    {propertyData.type}
                                </span>
                            )}
                        </div>

                        {/* Gallery indicator */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {allImages.length}
                            </div>
                        )}

                        {/* Favorite button */}
                        <button
                            onClick={handleFavoriteClick}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                            <Heart
                                className={cn(
                                    "w-4 h-4",
                                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                                )}
                            />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {propertyData.title}
                            </h3>
                            <p className="text-2xl font-bold text-amber-600 mb-3">
                                {formatPrice(propertyData.price)}
                            </p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">
                                {[propertyData.location, propertyData.city].filter(Boolean).join(', ')}
                            </span>
                        </div>

                        {/* Property details */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            {propertyData.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bed className="w-4 h-4" />
                                    <span>{propertyData.bedrooms}</span>
                                </div>
                            )}
                            {propertyData.bathrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4" />
                                    <span>{propertyData.bathrooms}</span>
                                </div>
                            )}
                            {propertyData.area > 0 && (
                                <div className="flex items-center gap-1">
                                    <Ruler className="w-4 h-4" />
                                    <span>{propertyData.area}m²</span>
                                </div>
                            )}
                        </div>

                        {/* Amenities */}
                        {displayAmenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {displayAmenities.map((amenity, index) => {
                                    const IconComponent = amenityIcons[amenity]
                                    return (
                                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                            {IconComponent && <IconComponent className="w-3 h-3 inline mr-1" />}
                                            {amenity}
                                        </span>
                                    )
                                })}
                                {hasMoreAmenities && (
                                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                                        +{propertyData.amenities.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Action button */}
                        <div className="flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                Ver detalhes
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </Link>
            </motion.div>
        )
    }

    // Grid view
    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300",
                variant === 'featured' && "ring-2 ring-amber-200",
                className
            )}
        >
            <Link href={`/imovel/${propertyData.slug}`}>
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <motion.div variants={imageVariants}>
                        <Image
                            src={propertyData.image || '/images/placeholder-property.jpg'}
                            alt={propertyData.title}
                            fill
                            className="object-cover"
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}

                    {/* Image overlay badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {propertyData.featured && (
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Destaque
                            </span>
                        )}
                        {propertyData.type && (
                            <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                {propertyData.type}
                            </span>
                        )}
                    </div>

                    {/* Gallery indicator */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {allImages.length}
                        </div>
                    )}

                    {/* Price overlay */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                        {formatPrice(propertyData.price)}
                    </div>

                    {/* Favorite button */}
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4",
                                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                            )}
                        />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {propertyData.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">
                            {[propertyData.location, propertyData.city].filter(Boolean).join(', ')}
                        </span>
                    </div>

                    {/* Property details */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        {propertyData.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span>{propertyData.bedrooms}</span>
                            </div>
                        )}
                        {propertyData.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{propertyData.bathrooms}</span>
                            </div>
                        )}
                        {propertyData.area > 0 && (
                            <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span>{propertyData.area}m²</span>
                            </div>
                        )}
                    </div>

                    {/* Amenities */}
                    {displayAmenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {displayAmenities.map((amenity, index) => {
                                const IconComponent = amenityIcons[amenity]
                                return (
                                    <span key={index} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                                        {IconComponent && <IconComponent className="w-3 h-3 inline mr-1" />}
                                        {amenity}
                                    </span>
                                )
                            })}
                            {hasMoreAmenities && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    +{propertyData.amenities.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Action button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Ver detalhes
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </Link>
        </motion.div>
    )
})

PropertyCard.displayName = 'PropertyCard'
