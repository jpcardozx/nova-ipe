/**
 * PropertyCard para Seções de Venda e Aluguel
 * Componente unificado para resolver problemas de UX/UI e integração com Sanity
 */

"use client"

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Car, ArrowRight, Eye, Heart } from 'lucide-react'
import { useState } from 'react'
import { formatarMoeda } from '@/lib/utils'

export interface PropertyCardSectionProps {
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

export default function PropertyCardSection({
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
}: PropertyCardSectionProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)

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

    return (
        <div className={`group relative ${className}`}>
            <Link
                href={propertyUrl}
                className="block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-2xl"
                aria-label={`Ver detalhes do imóvel: ${title} em ${location}`}
            >
                <article className={`
                    relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                    hover:shadow-2xl hover:border-amber-300/30 
                    transition-all duration-300 ease-out
                    group-hover:scale-[1.02] group-hover:-translate-y-1
                    ${isHighlighted ? 'ring-2 ring-amber-400/50 shadow-amber-100/50' : ''}
                    h-full flex flex-col
                    focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2
                `}>
                    {/* Container de Imagem com altura responsiva e performance otimizada */}
                    <div className="relative h-48 sm:h-56 md:h-52 lg:h-56 bg-gray-100 overflow-hidden">
                        {/* Loading Placeholder com skeleton */}
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-300 border-t-amber-600"></div>
                                </div>
                            </div>
                        )}

                        {/* Overlay de hover com gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        {!imageError ? (
                            <Image
                                src={mainImage.url}
                                alt={mainImage.alt || title}
                                fill
                                className={`
                                    object-cover transition-all duration-500 
                                    group-hover:scale-110 group-hover:brightness-110
                                    ${imageLoading ? 'opacity-0' : 'opacity-100'}
                                `}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={isHighlighted}
                                quality={85}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                        <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500">Imagem não disponível</p>
                                </div>
                            </div>
                        )}

                        {/* Badge de Tipo Aprimorado */}
                        <div className="absolute top-3 left-3">
                            <span className={`
                                px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                backdrop-blur-sm border border-white/20 shadow-lg
                                transition-all duration-300 group-hover:scale-105
                                ${type === 'venda'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25'
                                }
                            `}>
                                {type === 'venda' ? 'À Venda' : 'Para Alugar'}
                            </span>
                        </div>

                        {/* Botão de Favorito Aprimorado */}
                        <button
                            onClick={handleLike}
                            className={`
                                absolute top-3 right-3 w-10 h-10 rounded-full 
                                backdrop-blur-sm border border-white/20 
                                flex items-center justify-center
                                transition-all duration-300 hover:scale-110
                                transform active:scale-95
                                ${isLiked
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 border-red-500'
                                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                                }
                            `}
                            aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <svg
                                className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'scale-110' : 'group-hover:scale-105'}`}
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={isLiked ? 0 : 2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>

                            {/* Efeito de pulse quando favorited */}
                            {isLiked && (
                                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
                            )}
                        </button>

                        {/* Badge de Destaque Premium */}
                        {isHighlighted && (
                            <div className="absolute bottom-3 left-3">
                                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-lg shadow-amber-500/25">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Destaque
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo do Card - Flexível para ocupar espaço restante */}
                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                        {/* Cabeçalho: Preço e Status */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                    {formatPrice(price)}
                                    {type === 'aluguel' && (
                                        <span className="text-sm sm:text-base font-medium text-gray-500 ml-1">/mês</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    + taxas e impostos
                                </div>
                            </div>

                            {/* Indicador de disponibilidade */}
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-700 font-medium">Disponível</span>
                            </div>
                        </div>

                        {/* Título com melhor tipografia */}
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200 leading-snug">
                                {title}
                            </h3>

                            {/* Localização com melhor destaque */}
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
                                <span className="text-sm sm:text-base truncate font-medium">{location}</span>
                            </div>
                        </div>

                        {/* Características com melhor layout */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-4 flex-wrap">
                                {bedrooms > 0 && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                                        <Bed className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{bedrooms}</span>
                                        <span className="text-xs text-gray-500">quartos</span>
                                    </div>
                                )}
                                {bathrooms > 0 && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                                        <Bath className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{bathrooms}</span>
                                        <span className="text-xs text-gray-500">banheiros</span>
                                    </div>
                                )}
                                {garage > 0 && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                                        <Car className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{garage}</span>
                                        <span className="text-xs text-gray-500">vagas</span>
                                    </div>
                                )}
                            </div>

                            {area > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md">
                                    <span className="text-sm font-semibold text-blue-700">{area}m²</span>
                                </div>
                            )}
                        </div>

                        {/* Call to Action melhorado */}
                        <div className="pt-3 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                                    Ver detalhes completos
                                </span>
                                <div className="flex items-center text-amber-600 group-hover:text-amber-700 group-hover:translate-x-1 transition-all duration-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    )
}
