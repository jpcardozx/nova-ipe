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
    Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatarMoeda } from '@/lib/utils'
import type { ImovelClient } from '@/src/types/imovel-client'

interface PropertyCardSimpleProps {
    property: ImovelClient
    className?: string
}

export default function PropertyCardSimple({
    property,
    className
}: PropertyCardSimpleProps) {
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
            color: 'bg-emerald-500',
            textColor: 'text-white'
        },
        'Aluguel': {
            label: 'ALUGUEL',
            color: 'bg-blue-500',
            textColor: 'text-white'
        },
        'Temporada': {
            label: 'TEMPORADA',
            color: 'bg-purple-500',
            textColor: 'text-white'
        }
    }

    const typeConfig = propertyTypeConfig[property.finalidade || 'Venda']

    return (
        <div className={cn(
            "group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
            "transform hover:-translate-y-1",
            className
        )}>
            {/* Container da Imagem */}
            <div className="relative h-48 md:h-56 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={property.titulo || 'Imóvel'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {property.destaque && (
                        <span className="bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            DESTAQUE
                        </span>
                    )}
                    <span className={cn(
                        "px-2 py-1 text-xs font-bold rounded-full shadow-md",
                        typeConfig?.color,
                        typeConfig?.textColor
                    )}>
                        {typeConfig?.label}
                    </span>
                </div>

                {/* Preço */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                        <div className="text-lg font-bold text-slate-900">
                            {formatarMoeda(price)}
                            {property.finalidade === 'Aluguel' && (
                                <span className="text-sm text-slate-500 font-normal">/mês</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                {/* Título */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {property.titulo}
                </h3>

                {/* Localização */}
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm truncate">
                        {property.endereco || `${property.bairro || ''} ${property.cidade || 'Guararema'}`.trim()}
                    </span>
                </div>

                {/* Características */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {property.dormitorios && property.dormitorios > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Bed className="w-4 h-4 text-amber-500" />
                            <span className="text-sm">
                                {property.dormitorios} {property.dormitorios === 1 ? 'quarto' : 'quartos'}
                            </span>
                        </div>
                    )}

                    {property.banheiros && property.banheiros > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Bath className="w-4 h-4 text-amber-500" />
                            <span className="text-sm">
                                {property.banheiros} {property.banheiros === 1 ? 'banheiro' : 'banheiros'}
                            </span>
                        </div>
                    )}

                    {property.areaUtil && property.areaUtil > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Square className="w-4 h-4 text-amber-500" />
                            <span className="text-sm">{property.areaUtil}m²</span>
                        </div>
                    )}

                    {property.vagas && property.vagas > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Car className="w-4 h-4 text-amber-500" />
                            <span className="text-sm">
                                {property.vagas} {property.vagas === 1 ? 'vaga' : 'vagas'}
                            </span>
                        </div>
                    )}
                </div>

                {/* CTA - Link simples sem event handlers */}
                <Link
                    href={`/imovel/${slug}`}
                    className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors text-center"
                >
                    Ver detalhes
                </Link>
            </div>
        </div>
    )
}
