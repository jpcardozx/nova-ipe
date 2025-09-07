'use client'

import React from 'react'
import LazyImage from './LazyImage'
import Link from 'next/link'
import {
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    Heart,
    Eye,
    Star,
    Shield,
    TrendingUp,
    ArrowRight,
    Calendar,
    Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyCardPremiumProps {
    id: string
    title: string
    location: string
    price: number
    propertyType: 'sale' | 'rent'
    bedrooms?: number
    bathrooms?: number
    area?: number
    parkingSpots?: number
    mainImage?: { url: string; alt?: string }
    description?: string
    className?: string
    showFavoriteButton?: boolean
    isFavorite?: boolean
    onFavoriteToggle?: (id: string) => void
    isHighlight?: boolean
    isPremium?: boolean
    isNew?: boolean
    status?: 'available' | 'sold' | 'rented' | 'reserved'
    publishedDate?: string
    slug?: string
    variant?: 'default' | 'compact' | 'featured'
}

export default function PropertyCardPremium({
    id,
    title,
    location,
    price,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    parkingSpots,
    mainImage,
    description,
    className,
    showFavoriteButton = true,
    isFavorite = false,
    onFavoriteToggle,
    isHighlight = false,
    isPremium = false,
    isNew = false,
    status = 'available',
    publishedDate,
    slug,
    variant = 'default'
}: PropertyCardPremiumProps) {
    const propertyUrl = `/imovel/${slug || id}`

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const getStatusBadge = () => {
        switch (status) {
            case 'sold':
                return { text: 'VENDIDO', className: 'bg-red-500 text-white' }
            case 'rented':
                return { text: 'ALUGADO', className: 'bg-blue-500 text-white' }
            case 'reserved':
                return { text: 'RESERVADO', className: 'bg-orange-500 text-white' }
            default:
                return null
        }
    }

    const statusBadge = getStatusBadge()
    const isCompact = variant === 'compact'
    const isFeatured = variant === 'featured'

    return (
        <div className={cn(
            "group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
            isFeatured ? "shadow-2xl border-2 border-gradient-to-r from-amber-200 to-orange-200" : "shadow-lg border border-slate-100",
            status !== 'available' && "opacity-75",
            "backdrop-blur-sm bg-white/95",
            className
        )}>
            {/* Image Container */}
            <div className={cn(
                "relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200",
                isCompact ? "aspect-[5/4]" : "aspect-[16/11]"
            )}>
                {mainImage?.url ? (
                    <LazyImage
                        src={mainImage.url}
                        alt={mainImage.alt || title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-50">
                        <div className="text-center">
                            <Home className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                            <span className="text-slate-600 text-sm font-medium">Imagem em breve</span>
                        </div>
                    </div>
                )}

                {/* Overlay gradiente aprimorado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges superiores aprimorados */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isPremium && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
                            <Star className="w-3 h-3" />
                            PREMIUM
                        </span>
                    )}
                    {isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            NOVO
                        </span>
                    )}
                    {isHighlight && (
                        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
                            <TrendingUp className="w-3 h-3" />
                            DESTAQUE
                        </span>
                    )}
                    {statusBadge && (
                        <span className={cn("px-3 py-1 text-xs font-bold rounded-full", statusBadge.className)}>
                            {statusBadge.text}
                        </span>
                    )}
                </div>

                {/* Favorito e Tipo */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {showFavoriteButton && status === 'available' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onFavoriteToggle?.(id)
                            }}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 group-hover:scale-110"
                            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <Heart className={cn(
                                "w-4 h-4 transition-colors",
                                isFavorite ? "text-red-500 fill-red-500" : "text-slate-600 hover:text-red-500"
                            )} />
                        </button>
                    )}
                </div>

                {/* Tipo de propriedade */}
                <div className="absolute bottom-3 right-3">
                    <span className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm",
                        propertyType === 'sale'
                            ? "bg-emerald-500/90 text-white"
                            : "bg-blue-500/90 text-white"
                    )}>
                        {propertyType === 'sale' ? 'VENDA' : 'ALUGUEL'}
                    </span>
                </div>

                {/* Visualizações (opcional) */}
                {!isCompact && (
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>Ver mais</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={cn("p-5", isCompact && "p-4")}>
                {/* Preço */}
                <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                        <span className={cn(
                            "font-bold text-slate-900",
                            isCompact ? "text-xl" : "text-2xl"
                        )}>
                            {formatPrice(price)}
                        </span>
                        {propertyType === 'rent' && (
                            <span className="text-sm text-slate-500 font-medium">/mês</span>
                        )}
                    </div>
                </div>

                {/* Título */}
                <h3 className={cn(
                    "font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors",
                    isCompact ? "text-base" : "text-lg"
                )}>
                    {title}
                </h3>

                {/* Localização */}
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <p className="text-slate-600 text-sm truncate">{location}</p>
                </div>

                {/* Características */}
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-4">
                        {area && (
                            <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span className="font-medium">{area}m²</span>
                            </div>
                        )}
                        {bedrooms !== undefined && bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                <span>{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms !== undefined && bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{bathrooms}</span>
                            </div>
                        )}
                        {parkingSpots !== undefined && parkingSpots > 0 && (
                            <div className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                <span>{parkingSpots}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Descrição (apenas se não for compact) */}
                {!isCompact && description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Data de publicação */}
                {publishedDate && !isCompact && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                        <Calendar className="w-3 h-3" />
                        <span>Publicado em {new Date(publishedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                )}

                {/* Botão de ação */}
                <Link
                    href={propertyUrl}
                    className={cn(
                        "block w-full text-center font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-lg",
                        status === 'available'
                            ? "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-500 hover:to-amber-600 text-white"
                            : "bg-slate-200 text-slate-500 cursor-not-allowed",
                        isCompact ? "py-2 px-3 text-sm" : "py-3 px-4"
                    )}
                    onClick={status !== 'available' ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>
                            {status === 'available' ? 'Ver Detalhes' : 'Indisponível'}
                        </span>
                        {status === 'available' && (
                            <ArrowRight className={cn("transition-transform group-hover:translate-x-1",
                                isCompact ? "w-3 h-3" : "w-4 h-4"
                            )} />
                        )}
                    </div>
                </Link>
            </div>

            {/* Overlay para status indisponível */}
            {status !== 'available' && (
                <div className="absolute inset-0 bg-slate-900/20 pointer-events-none" />
            )}
        </div>
    )
}
