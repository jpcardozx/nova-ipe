'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Star,
    Heart,
    Eye,
    ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatarMoeda } from '@/lib/utils'
import type { ImovelClient } from '@/src/types/imovel-client'

interface PropertyCardProps {
    property: ImovelClient
    variant?: 'default' | 'compact' | 'featured'
    className?: string
}

export default function PropertyCard({
    property,
    variant = 'default',
    className
}: PropertyCardProps) {
    // Garantir que temos dados válidos
    const hasValidData = property && property.titulo && property.preco

    if (!hasValidData) {
        return null
    }

    const imageSrc = property.imagem?.imagemUrl || '/placeholder-property.jpg'
    const price = property.preco || 0
    const slug = property.slug || property.id || property._id

    // Determinar tipo de propriedade e cor
    const propertyTypeConfig = {
        'Venda': {
            label: 'VENDA',
            color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
            textColor: 'text-white'
        },
        'Aluguel': {
            label: 'ALUGUEL',
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            textColor: 'text-white'
        },
        'Temporada': {
            label: 'TEMPORADA',
            color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            textColor: 'text-white'
        }
    }

    const typeConfig = propertyTypeConfig[property.finalidade || 'Venda']

    return (
        <div className={cn(
            "group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden",
            "transform hover:-translate-y-2 hover:scale-[1.02]",
            variant === 'compact' && "max-w-sm",
            variant === 'featured' && "border-2 border-amber-200",
            className
        )}>
            {/* Container da Imagem */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={property.titulo || 'Imóvel'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {property.destaque && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            DESTAQUE
                        </span>
                    )}
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full shadow-lg",
                        typeConfig?.color,
                        typeConfig?.textColor
                    )}>
                        {typeConfig?.label}
                    </span>
                </div>

                {/* Ações no hover */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                {/* Preço no canto inferior */}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                        <div className="text-xl font-bold text-slate-900">
                            {formatarMoeda(price)}
                            {property.finalidade === 'Aluguel' && (
                                <span className="text-sm text-slate-500 font-normal">/mês</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
                {/* Título */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {property.titulo}
                </h3>

                {/* Localização */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">
                        {property.endereco || `${property.bairro || ''} ${property.cidade || 'Guararema'}`.trim()}
                    </span>
                </div>

                {/* Características */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {property.dormitorios && property.dormitorios > 0 && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Bed className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium">
                                {property.dormitorios} {property.dormitorios === 1 ? 'quarto' : 'quartos'}
                            </span>
                        </div>
                    )}

                    {property.banheiros && property.banheiros > 0 && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Bath className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium">
                                {property.banheiros} {property.banheiros === 1 ? 'banheiro' : 'banheiros'}
                            </span>
                        </div>
                    )}

                    {property.areaUtil && property.areaUtil > 0 && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Square className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium">{property.areaUtil}m²</span>
                        </div>
                    )}

                    {property.vagas && property.vagas > 0 && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <Car className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium">
                                {property.vagas} {property.vagas === 1 ? 'vaga' : 'vagas'}
                            </span>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <Link
                    href={`/imovel/${slug}`}
                    className="group/btn w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    Ver detalhes
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    )
}
