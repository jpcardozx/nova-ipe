'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BedDouble, Bath, Ruler, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimplePropertyCardProps {
    id: string
    title: string
    location: string
    price: number
    propertyType: string
    bedrooms?: number
    bathrooms?: number
    area?: number
    mainImage?: { url: string }
    description?: string
    className?: string
    showFavoriteButton?: boolean
    showShareButton?: boolean
    variant?: 'default' | 'compact'
}

export default function SimplePropertyCard({
    id,
    title,
    location,
    price,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    mainImage,
    description,
    className,
    showFavoriteButton = false,
    variant = 'default'
}: SimplePropertyCardProps) {
    return (
        <div className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200",
            className
        )}>
            {/* Image */}
            <div className="relative aspect-[4/3] bg-slate-100">
                {mainImage?.url ? (
                    <Image
                        src={mainImage.url}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🏠</div>
                            <div className="text-sm">Imagem não disponível</div>
                        </div>
                    </div>
                )}

                {/* Favorite button */}
                {showFavoriteButton && (
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                )}

                {/* Property type badge */}
                <div className="absolute top-3 left-3">
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        propertyType === 'sale'
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                    )}>
                        {propertyType === 'sale' ? 'Venda' : 'Aluguel'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2">
                    {title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-slate-600 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                {/* Features */}
                {(bedrooms || bathrooms || area) && (
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                        {bedrooms && (
                            <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                <span>{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{bathrooms}</span>
                            </div>
                        )}
                        {area && (
                            <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span>{area}m²</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Description */}
                {description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            R$ {price.toLocaleString()}
                        </div>
                        {propertyType === 'rent' && (
                            <div className="text-sm text-slate-500">/mês</div>
                        )}
                    </div>

                    <Link
                        href={`/imovel/${id}`}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        Ver Detalhes
                    </Link>
                </div>
            </div>
        </div>
    )
}
