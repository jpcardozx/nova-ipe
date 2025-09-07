/**
 * PropertyCard Premium para Seções de Venda e Aluguel
 * Design completamente refatorado com UX/UI premium
 * Inspirado na paleta do hero com micro-interações avançadas
 */

"use client"

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Car, Heart, Eye, Star, ArrowRight, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion'
import { formatarMoeda, cn } from '@/lib/utils'

export interface PropertyCardNewProps {
    id: string
    title: string
    slug?: string
    price: number
    type: 'venda' | 'aluguel'
    bedrooms: number
    bathrooms: number
    garage: number
    area: number
    location: string
    mainImage: {
        url: string
        alt: string
    }
    isHighlighted?: boolean
    className?: string
}

export default function PropertyCardNew({
    id,
    title,
    slug,
    price,
    type,
    bedrooms,
    bathrooms,
    garage,
    area,
    location,
    mainImage,
    isHighlighted = false,
    className = ""
}: PropertyCardNewProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const cardRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(cardRef, { once: true, margin: '-50px' })

    // Motion values para efeito 3D
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [2, -2])
    const rotateY = useTransform(x, [-100, 100], [-2, 2])
    const springX = useSpring(rotateX, { damping: 20, stiffness: 150 })
    const springY = useSpring(rotateY, { damping: 20, stiffness: 150 })

    const propertyUrl = `/imovel/${slug || id}`

    const formatPrice = (value: number) => {
        return formatarMoeda(value)
    }

    const handleImageError = () => {
        setImageError(true)
        setImageLoading(false)
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLiked(!isLiked)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        x.set(e.clientX - (rect.left + rect.width / 2))
        y.set(e.clientY - (rect.top + rect.height / 2))
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={cn("group relative", className)}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={propertyUrl}
                className="block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-2xl"
                aria-label={`Ver detalhes do imóvel: ${title} em ${location}`}
            >
                <motion.article
                    className={cn(
                        "relative bg-white rounded-2xl overflow-hidden",
                        "shadow-md hover:shadow-xl border border-gray-200",
                        "transition-all duration-300 ease-out h-full flex flex-col",
                        "hover:border-amber-300/50",
                        "max-w-sm mx-auto", // Tamanho mais compacto
                        isHighlighted ? 'ring-2 ring-amber-400/50 shadow-amber-100/50' : ''
                    )}
                    style={{ rotateX: springX, rotateY: springY }}
                    whileHover={{
                        y: -6,
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeOut" }
                    }}
                >
                    {/* Container de Imagem Premium - Tamanho otimizado */}
                    <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {/* Loading Skeleton Premium */}
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Overlay de hover premium */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-orange-800/5 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        {!imageError ? (
                            <Image
                                src={mainImage.url}
                                alt={mainImage.alt || title}
                                fill
                                className={cn(
                                    "object-cover transition-all duration-500",
                                    "group-hover:scale-105 group-hover:brightness-105",
                                    imageLoading ? 'opacity-0' : 'opacity-100'
                                )}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                priority={isHighlighted}
                                quality={85}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium">Imagem indisponível</p>
                                </div>
                            </div>
                        )}

                        {/* Badge de Tipo Premium */}
                        <div className="absolute top-3 left-3">
                            <motion.span
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                    "backdrop-blur-sm border border-white/20 shadow-md",
                                    type === 'venda'
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                )}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {type === 'venda' ? 'À Venda' : 'Aluguel'}
                            </motion.span>
                        </div>

                        {/* Botão de Favorito Premium */}
                        <div className="absolute top-3 right-3">
                            <motion.button
                                onClick={handleLike}
                                className={cn(
                                    "w-9 h-9 rounded-full backdrop-blur-sm border border-white/20",
                                    "flex items-center justify-center shadow-md",
                                    "transition-all duration-300",
                                    isLiked
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                                )}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Heart
                                    className="w-4 h-4"
                                    fill={isLiked ? "currentColor" : "none"}
                                />
                            </motion.button>
                        </div>

                        {/* Badge de Destaque Premium */}
                        {isHighlighted && (
                            <div className="absolute bottom-3 left-3">
                                <motion.span
                                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Destaque
                                </motion.span>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo do Card - Compacto e elegante */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                        {/* Cabeçalho: Preço premium */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        {formatPrice(price)}
                                    </span>
                                    {type === 'aluguel' && (
                                        <span className="text-sm font-medium text-gray-500">/mês</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-700 font-medium uppercase tracking-wide">
                                        Disponível
                                    </span>
                                </div>
                            </div>

                            {/* Badge de tipo premium */}
                            <div className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                                type === 'venda'
                                    ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200"
                                    : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
                            )}>
                                {type === 'venda' ? 'Venda' : 'Aluguel'}
                            </div>
                        </div>

                        {/* Título e localização */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-tight">
                                {title}
                            </h3>

                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-amber-500" />
                                <span className="text-sm font-medium truncate">{location}</span>
                            </div>
                        </div>

                        {/* Características premium */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-4">
                                {bedrooms > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Bed className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold">{bedrooms}</span>
                                    </div>
                                )}
                                {bathrooms > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Bath className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold">{bathrooms}</span>
                                    </div>
                                )}
                                {garage > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Car className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold">{garage}</span>
                                    </div>
                                )}
                            </div>

                            {area > 0 && (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                                    <span className="text-sm font-bold text-amber-700">
                                        {area}m²
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Call to Action premium */}
                        <div className="pt-3">
                            <div className={cn(
                                "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group-hover:shadow-md",
                                type === 'venda'
                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 group-hover:from-amber-100 group-hover:to-orange-100"
                                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 group-hover:from-blue-100 group-hover:to-indigo-100"
                            )}>
                                <span className={cn(
                                    "text-sm font-semibold",
                                    type === 'venda' ? "text-amber-700" : "text-blue-700"
                                )}>
                                    Ver todos os detalhes
                                </span>
                                <ArrowRight className={cn(
                                    "w-4 h-4 transition-transform group-hover:translate-x-1",
                                    type === 'venda' ? "text-amber-600" : "text-blue-600"
                                )} />
                            </div>
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    )
}
