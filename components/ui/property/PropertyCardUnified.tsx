'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

    // Format price
    const formattedPrice = preco ?
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco) :
        'Consulte';

    return (
        <Link href={`/imovel/${propertySlug}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {/* Image container with badges */}
                <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 w-full relative">
                        <Image
                            src={imagem}
                            alt={titulo}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {destaque && (
                            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                                Destaque
                            </span>
                        )}
                        {isNew && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                Novo
                            </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${finalidade === 'Aluguel'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                            {finalidade}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg leading-snug mb-1 line-clamp-2">{titulo}</h3>
                        <p className="text-gray-500 text-sm">{bairro}, {cidade}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <p className="text-lg font-bold text-gray-900">
                            {formattedPrice}
                            {finalidade === 'Aluguel' && <span className="text-sm font-normal text-gray-500"> /mês</span>}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-auto">
                        {areaUtil > 0 && (
                            <div className="flex items-center">
                                <span className="mr-1">🔲</span>
                                <span>{areaUtil} m²</span>
                            </div>
                        )}
                        {dormitorios > 0 && (
                            <div className="flex items-center">
                                <span className="mr-1">🛏️</span>
                                <span>{dormitorios} dorm{dormitorios > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        {banheiros > 0 && (
                            <div className="flex items-center">
                                <span className="mr-1">🚿</span>
                                <span>{banheiros} banh{banheiros > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        {vagas > 0 && (
                            <div className="flex items-center">
                                <span className="mr-1">🚗</span>
                                <span>{vagas} vaga{vagas > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCardUnified;
