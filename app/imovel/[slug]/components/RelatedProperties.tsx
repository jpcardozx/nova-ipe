'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Car, Ruler } from 'lucide-react';

interface RelatedProperty {
    id: string;
    slug: string;
    title: string;
    price: number;
    location: string;
    images: string[];
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    type: string;
}

interface RelatedPropertiesProps {
    properties: RelatedProperty[];
    currentPropertyId?: string;
}

export default function RelatedProperties({
    properties,
    currentPropertyId
}: RelatedPropertiesProps) {
    // Filtrar o imóvel atual se fornecido
    const filteredProperties = properties.filter(
        property => property.id !== currentPropertyId
    );

    if (filteredProperties.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
                Imóveis Relacionados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProperties.slice(0, 6).map((property) => (
                    <Link
                        key={property.id}
                        href={`/imovel/${property.slug}`}
                        className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        {/* Imagem */}
                        <div className="relative aspect-[4/3] bg-slate-200">
                            {property.images && property.images.length > 0 ? (
                                <Image
                                    src={property.images[0]}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    <span className="text-slate-400 text-sm">Sem foto</span>
                                </div>
                            )}

                            {/* Badge do tipo */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                                {property.type}
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4">
                            {/* Preço */}
                            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                                R$ {property.price.toLocaleString('pt-BR')}
                            </div>

                            {/* Título */}
                            <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {property.title}
                            </h4>

                            {/* Localização */}
                            <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="line-clamp-1">{property.location}</span>
                            </div>

                            {/* Características */}
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                {property.area && (
                                    <div className="flex items-center gap-1">
                                        <Ruler className="w-3 h-3" />
                                        <span>{property.area}m²</span>
                                    </div>
                                )}
                                {property.bedrooms && property.bedrooms > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Bed className="w-3 h-3" />
                                        <span>{property.bedrooms}</span>
                                    </div>
                                )}
                                {property.bathrooms && property.bathrooms > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Bath className="w-3 h-3" />
                                        <span>{property.bathrooms}</span>
                                    </div>
                                )}
                                {property.parkingSpots && property.parkingSpots > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Car className="w-3 h-3" />
                                        <span>{property.parkingSpots}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Ver mais imóveis */}
            {filteredProperties.length > 6 && (
                <div className="mt-6 text-center">
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                        Ver Mais Imóveis
                    </Link>
                </div>
            )}
        </div>
    );
}
