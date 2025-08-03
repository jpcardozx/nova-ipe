'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Car, Ruler, MapPin, Heart, Eye, Star } from 'lucide-react';
import { designSystem } from '../../../lib/design-system';

export type PropertyType = 'sale' | 'rent' | 'investment';

interface PropertyCardUnifiedProps {
    _id: string;
    titulo?: string;
    slug?: string;
    bairro?: string;
    cidade?: string;
    preco?: number;
    areaUtil?: number;
    dormitorios?: number;
    banheiros?: number;
    vagas?: number;
    imagem?: string;
    finalidade?: string;
    destaque?: boolean;
    caracteristicas?: string[];
    dataCriacao?: string;
    dataPublicacao?: string;
}

const PropertyCardUnified: React.FC<PropertyCardUnifiedProps> = ({
    _id,
    titulo = 'Imóvel à venda',
    slug,
    bairro = 'Centro',
    cidade = 'Guararema',
    preco = 0,
    areaUtil = 0,
    dormitorios = 0,
    banheiros = 0,
    vagas = 0,
    imagem = '/images/property-placeholder.jpg',
    finalidade = 'Venda',
    destaque = false,
    caracteristicas = [],
    dataPublicacao,
}) => {
    // Fallback slug if not provided
    const propertySlug = slug || `imovel-${_id}`;

    // Check if property is new (less than 30 days old)
    const isNew = dataPublicacao && new Date(dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Format price with better formatting
    const formattedPrice = preco ?
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(preco) :
        'Consulte';

    return (
        <Link href={`/imovel/${propertySlug}`} className="group block h-full">
            <article className={`
                ${designSystem.componentPatterns.card.base}
                ${designSystem.componentPatterns.card.interactive}
                bg-white rounded-2xl overflow-hidden border border-neutral-200/60
                shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary-300/50
                transition-all duration-500 group h-full flex flex-col
                backdrop-blur-sm bg-white/95
            `}>
                {/* Image container with enhanced badges */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] w-full relative">
                        <Image
                            src={imagem}
                            alt={titulo}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={destaque}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Enhanced badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {destaque && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                <Star size={12} className="fill-current" />
                                Destaque
                            </span>
                        )}
                        {isNew && (
                            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                Novo
                            </span>
                        )}
                    </div>

                    {/* Property type badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`
                            text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm
                            ${finalidade === 'Aluguel'
                                ? 'bg-blue-500/90 text-white'
                                : 'bg-purple-500/90 text-white'
                            }
                        `}>
                            {finalidade}
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200">
                            <Heart size={14} className="text-neutral-600 hover:text-red-500" />
                        </button>
                        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200">
                            <Eye size={14} className="text-neutral-600" />
                        </button>
                    </div>
                </div>

                {/* Enhanced content */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
                        <MapPin size={14} />
                        <span>{bairro}, {cidade}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-neutral-800 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                        {titulo}
                    </h3>

                    {/* Price with enhanced styling */}
                    <div className="mb-4">
                        <p className="text-2xl font-bold text-neutral-900 flex items-baseline gap-1">
                            {formattedPrice}
                            {finalidade === 'Aluguel' && (
                                <span className="text-sm font-normal text-neutral-500">/mês</span>
                            )}
                        </p>
                    </div>

                    {/* Enhanced features with icons */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600 mt-auto">
                        {areaUtil > 0 && (
                            <div className="flex items-center gap-2">
                                <Ruler size={16} className="text-primary-500 flex-shrink-0" />
                                <span className="font-medium">{areaUtil} m²</span>
                            </div>
                        )}
                        {dormitorios > 0 && (
                            <div className="flex items-center gap-2">
                                <Bed size={16} className="text-primary-500 flex-shrink-0" />
                                <span className="font-medium">{dormitorios} dorm{dormitorios > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        {banheiros > 0 && (
                            <div className="flex items-center gap-2">
                                <Bath size={16} className="text-primary-500 flex-shrink-0" />
                                <span className="font-medium">{banheiros} banh{banheiros > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        {vagas > 0 && (
                            <div className="flex items-center gap-2">
                                <Car size={16} className="text-primary-500 flex-shrink-0" />
                                <span className="font-medium">{vagas} vaga{vagas > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>

                    {/* Features tags if available */}
                    {caracteristicas && caracteristicas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-neutral-100">
                            {caracteristicas.slice(0, 3).map((feature, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md"
                                >
                                    {feature}
                                </span>
                            ))}
                            {caracteristicas.length > 3 && (
                                <span className="text-xs text-neutral-400">
                                    +{caracteristicas.length - 3} mais
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
};

export default PropertyCardUnified;
