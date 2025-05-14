'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home, BedDouble, Bath, Car } from 'lucide-react';
import type { ImovelClient } from '@/types/imovel-client';

interface PropertyFeature {
    icon: React.ElementType;
    label: string;
    value: string | number | undefined;
    showWhen: boolean;
}

interface FeaturedPropertyProps {
    property: ImovelClient;
    className?: string;
}

export default function FeaturedProperty({ property, className = '' }: FeaturedPropertyProps) {
    // Dados formatados
    const imageUrl = property.imagem?.url || property.imagem?.imagemUrl || '/images/placeholder.jpg';
    const price = property.preco ?
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco) :
        'Sob consulta';
    const location = [property.bairro, property.cidade].filter(Boolean).join(', ') || 'Localização não informada';
    const area = property.areaUtil ? `${property.areaUtil}m²` : undefined;
    const propertyUrl = `/imovel/${property.slug || property._id}`;

    // Características do imóvel
    const features: PropertyFeature[] = [
        {
            icon: Home,
            label: 'Área',
            value: area,
            showWhen: !!area
        },
        {
            icon: BedDouble,
            label: 'Quartos',
            value: property.dormitorios,
            showWhen: !!property.dormitorios
        },
        {
            icon: Bath,
            label: 'Banheiros',
            value: property.banheiros,
            showWhen: !!property.banheiros
        },
        {
            icon: Car,
            label: 'Vagas',
            value: property.vagas,
            showWhen: !!property.vagas
        }
    ];

    const visibleFeatures = features.filter(f => f.showWhen);

    return (
        <article className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            {/* Imagem */}
            <div className="relative h-64 sm:h-72 lg:h-80">
                <Image
                    src={imageUrl}
                    alt={property.titulo || 'Imóvel'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                />

                {/* Badge de destaque */}
                {property.destaque && (
                    <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Destaque
                    </div>
                )}

                {/* Finalidade */}
                {property.finalidade && (
                    <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded text-sm">
                        {property.finalidade}
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="p-6">
                {/* Preço */}
                <div className="mb-3">
                    <p className="text-2xl font-bold text-gray-900">{price}</p>
                </div>

                {/* Título */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.titulo || `${property.tipoImovel || 'Imóvel'} em ${property.bairro || 'Guararema'}`}
                </h3>

                {/* Localização */}
                <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">{location}</span>
                </div>

                {/* Características */}
                {visibleFeatures.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {visibleFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <feature.icon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {feature.value} {feature.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <Link
                    href={propertyUrl}
                    className="block w-full text-center py-2 bg-amber-600 text-white font-medium rounded 
                     hover:bg-amber-700 transition-colors"
                >
                    Ver Detalhes
                </Link>
            </div>
        </article>
    );
}