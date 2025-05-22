'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Car, Plus } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient } from '@/types/imovel-client';

interface PropertyCardProps {
    imovel: ImovelClient;
    showExpand?: boolean;
    isExpanded?: boolean;
    onExpandClick?: () => void;
}

export function PropertyCard({ imovel, showExpand, isExpanded, onExpandClick }: PropertyCardProps) {
    // Early return if no data
    if (!imovel) return null;

    const {
        titulo,
        slug,
        bairro,
        cidade,
        preco,
        dormitorios,
        banheiros,
        vagas,
        imagem,
    } = imovel;

    const handleExpandClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onExpandClick?.();
    };

    return (
        <Link
            href={`/imovel/${slug}`}
            className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            {/* Imagem */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={imagem?.url || '/placeholder-imovel.jpg'}
                    alt={imagem?.alt || titulo || 'Imóvel'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
                {showExpand && (
                    <button
                        onClick={handleExpandClick}
                        className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                        aria-label={isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                    >
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
                    </button>
                )}
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                    {titulo}
                </h3>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{bairro || cidade || 'Guararema'}</span>
                </div>

                <div className="flex gap-4 text-gray-600 text-sm mb-4">
                    {dormitorios && (
                        <div className="flex items-center">
                            <BedDouble className="w-4 h-4 mr-1" />
                            <span>{dormitorios}</span>
                        </div>
                    )}
                    {banheiros && (
                        <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{banheiros}</span>
                        </div>
                    )}
                    {vagas && (
                        <div className="flex items-center">
                            <Car className="w-4 h-4 mr-1" />
                            <span>{vagas}</span>
                        </div>
                    )}
                </div>                <div className="text-lg font-bold text-gray-900">
                    {preco ? formatarMoeda(preco) : 'Sob consulta'}
                </div>
            </div>
        </Link>
    );
}
