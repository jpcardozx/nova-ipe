'use client'

import React, { useState, useEffect } from 'react'
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
    Home,
    ChevronLeft,
    ChevronRight,
    Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { processPropertyImages, type PropertyImageSet } from '@/lib/image-processor'
import { SystemDiagnostic, diagnoseProperty, diagnoseUX, useSystemDiagnostic } from '@/lib/system-diagnostic'

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
    rawPropertyData?: any // Dados brutos do Sanity para processamento
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
    rawPropertyData,
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
    // Estados para carrossel
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showCarousel, setShowCarousel] = useState(false)
    
    // Processa imagens do Sanity
    const imageSet: PropertyImageSet = rawPropertyData 
        ? processPropertyImages(rawPropertyData)
        : {
            principal: mainImage ? { url: mainImage.url, alt: mainImage.alt || title } : null,
            galeria: [],
            total: mainImage ? 1 : 0,
            hasImages: !!mainImage
        }
    
    // Diagnóstico completo do sistema
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // Diagnóstico de imagens
            const propertyData = rawPropertyData || { id, title, mainImage, galeria: imageSet.galeria };
            const imageDiagnostic = diagnoseProperty(propertyData);
            SystemDiagnostic.addImageDiagnostic(imageDiagnostic);
            
            // Diagnóstico de UX
            const uxDiagnostic = diagnoseUX('PropertyCard');
            SystemDiagnostic.addUXDiagnostic(uxDiagnostic);
        }
    }, [id, title, mainImage, imageSet, rawPropertyData]);
    
    // Combina imagem principal + galeria para carrossel
    const allImages = [
        ...(imageSet.principal ? [imageSet.principal] : []),
        ...imageSet.galeria
    ]
    
    const propertyUrl = `/imovel/${slug || id}`
    
    // Inicializa diagnóstico do sistema
    useSystemDiagnostic()

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }
    
    // Funções de navegação do carrossel
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }
    
    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
    
    // Auto-reset quando mudar de propriedade
    useEffect(() => {
        setCurrentImageIndex(0)
        setShowCarousel(false)
    }, [id])

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
            "group relative overflow-hidden transition-all duration-700 hover:scale-[1.02] transform-gpu",
            // Glassmorphism único
            "bg-gradient-to-br from-white/90 via-white/95 to-white/80 backdrop-blur-xl",
            "border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
            // Forma única - não apenas rounded
            "rounded-[2rem] hover:rounded-[2.5rem]",
            // Borda animada para destaques
            isFeatured && "before:absolute before:inset-0 before:rounded-[2rem] before:p-[2px] before:bg-gradient-to-r before:from-amber-500 before:via-orange-500 before:to-amber-500 before:content-[''] before:-z-10 hover:before:rounded-[2.5rem]",
            // Estados especiais
            status !== 'available' && "opacity-75 grayscale-[0.3]",
            // Efeitos de hover únicos
            "hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:bg-gradient-to-br hover:from-white/95 hover:via-white hover:to-amber-50/30",
            className
        )}>
            {/* Container de imagem com profundidade e efeitos únicos */}
            <div 
                className={cn(
                    "relative overflow-hidden group/image",
                    // Background único com textura
                    "bg-gradient-to-br from-slate-50 via-white to-amber-50/20",
                    // Altura responsiva com efeito de profundidade
                    isCompact ? "h-[200px]" : "h-[280px]",
                    // Forma única que acompanha o card
                    "rounded-t-[2rem] group-hover:rounded-t-[2.5rem] transition-all duration-700",
                    // Efeito de borda interna para profundidade
                    "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-black/5 before:z-10",
                    // Efeito de cristal no hover
                    "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/10 after:via-transparent after:to-amber-200/10 after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-700 after:z-10"
                )}
                style={{ 
                    aspectRatio: isCompact ? '5/4' : '16/11',
                    minHeight: isCompact ? '200px' : '280px'
                }}
                onMouseEnter={() => allImages.length > 1 && setShowCarousel(true)}
                onMouseLeave={() => setShowCarousel(false)}
            >
                {allImages.length > 0 ? (
                    <>
                        {/* Imagem com efeitos únicos de profundidade e diagnóstico */}
                        <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-1000 ease-out">
                            <LazyImage
                                src={allImages[currentImageIndex].url}
                                alt={allImages[currentImageIndex].alt}
                                fill
                                className="object-cover transition-all duration-1000 group-hover:brightness-110 group-hover:contrast-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={false}
                                onError={() => {
                                    // Log apenas se houver erro crítico
                                    if (process.env.NODE_ENV === 'development') {
                                        console.warn(`🖼️ Erro crítico: ${id.slice(-8)} - ${allImages[currentImageIndex].url.slice(-30)}`);
                                    }
                                }}
                            />
                        </div>
                        
                        {/* Overlay de cristal para profundidade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                        
                        {/* Image Counter */}
                        {allImages.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                <span>{currentImageIndex + 1}/{allImages.length}</span>
                            </div>
                        )}
                        
                        {/* Carousel Navigation - Responsivo */}
                        {allImages.length > 1 && (
                            <>
                                {/* Desktop: Hover to show */}
                                <div className="hidden md:block">
                                    {showCarousel && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover/image:opacity-100 hover:scale-110"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover/image:opacity-100 hover:scale-110"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Mobile: Touch/Swipe area */}
                                <div className="md:hidden absolute inset-0 flex">
                                    <button
                                        onClick={prevImage}
                                        className="flex-1 opacity-0"
                                        aria-label="Imagem anterior"
                                    />
                                    <button
                                        onClick={nextImage}
                                        className="flex-1 opacity-0"
                                        aria-label="Próxima imagem"
                                    />
                                </div>
                                
                                {/* Dots Indicator - Sempre visível em mobile, hover em desktop */}
                                <div className={cn(
                                    "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 transition-opacity duration-200",
                                    "md:opacity-0 md:group-hover/image:opacity-100", // Desktop: só no hover
                                    "opacity-100" // Mobile: sempre visível
                                )}>
                                    {allImages.slice(0, 5).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setCurrentImageIndex(index)
                                            }}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-200 shadow-sm",
                                                index === currentImageIndex
                                                    ? "bg-white scale-125 shadow-md"
                                                    : "bg-white/70 hover:bg-white/90 hover:scale-110"
                                            )}
                                        />
                                    ))}
                                    {allImages.length > 5 && (
                                        <div className="w-2 h-2 rounded-full bg-white/50 flex items-center justify-center">
                                            <span className="text-[6px] text-white font-bold">+</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
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

                {/* Badges com glassmorphism avançado e micro-animações */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {isPremium && (
                        <div className="group/badge relative overflow-hidden">
                            <span className="relative bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white px-3 py-1.5 text-xs font-semibold rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-xl border border-amber-300/30 hover:scale-105 transition-all duration-300">
                                <Star className="w-3 h-3 fill-current animate-pulse" />
                                Premium
                            </span>
                            {/* Efeito shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                    )}
                    {isNew && (
                        <div className="group/badge relative overflow-hidden">
                            <span className="relative bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white px-3 py-1.5 text-xs font-semibold rounded-xl shadow-lg backdrop-blur-xl border border-emerald-300/30 hover:scale-105 transition-all duration-300">
                                ✨ Novo
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                    )}
                    {isHighlight && (
                        <div className="group/badge relative overflow-hidden">
                            <span className="relative bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white px-3 py-1.5 text-xs font-semibold rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-xl border border-violet-300/30 hover:scale-105 transition-all duration-300">
                                <TrendingUp className="w-3 h-3 animate-bounce" />
                                Destaque
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                    )}
                    {statusBadge && (
                        <div className="group/badge relative overflow-hidden">
                            <span className={cn("relative px-3 py-1.5 text-xs font-semibold rounded-xl shadow-lg backdrop-blur-xl hover:scale-105 transition-all duration-300", statusBadge.className)}>
                                {statusBadge.text}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                    )}
                </div>

                {/* Botão de favoritos premium */}
                <div className="absolute top-4 right-4 z-20">
                    {showFavoriteButton && status === 'available' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onFavoriteToggle?.(id)
                            }}
                            className={cn(
                                "group/heart relative overflow-hidden backdrop-blur-xl rounded-full p-3 shadow-lg transition-all duration-500 hover:scale-110 active:scale-95",
                                isFavorite 
                                    ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white border border-red-300/30" 
                                    : "bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 border border-white/30"
                            )}
                            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <Heart className={cn(
                                "w-4 h-4 transition-all duration-300 relative z-10",
                                isFavorite ? "fill-current animate-pulse" : "hover:scale-110"
                            )} />
                            {/* Efeito de onda no clique */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full scale-0 group-active/heart:scale-150 transition-transform duration-300" />
                            {/* Brilho no hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/heart:translate-x-full transition-transform duration-700" />
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

            {/* Área de conteúdo premium */}
            <div className={cn(
                "relative bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-sm",
                isCompact ? "p-4" : "p-6"
            )}>
                {/* Linha decorativa superior */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
                {/* Preço premium com destaque visual */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2 group/price">
                        <span className={cn(
                            "font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover/price:from-amber-600 group-hover/price:to-amber-500 transition-all duration-300",
                            isCompact ? "text-xl" : "text-2xl"
                        )}>
                            {formatPrice(price)}
                        </span>
                        {propertyType === 'rent' && (
                            <span className="text-sm text-slate-500 font-medium bg-slate-100/50 px-2 py-0.5 rounded-full">/mês</span>
                        )}
                    </div>
                </div>

                {/* Título premium com hover effect */}
                <h3 className={cn(
                    "font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-amber-600 transition-all duration-300 tracking-tight",
                    isCompact ? "text-base" : "text-lg"
                )}>
                    <span className="relative">
                        {title}
                        {/* Underline animado no hover */}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-500 ease-out" />
                    </span>
                </h3>

                {/* Localização premium */}
                <div className="flex items-center gap-3 mb-4 group/location hover:bg-amber-50/30 -mx-2 px-2 py-1.5 rounded-lg transition-all duration-300">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover/location:from-amber-200 group-hover/location:to-orange-200 transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    </div>
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
