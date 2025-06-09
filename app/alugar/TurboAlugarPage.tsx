'use client';

import { useState, useEffect } from 'react';
import type { ImovelClient } from '../../src/types/imovel-client';
import MobilePropertyCard from '../components/MobilePropertyCard';

interface TurboAlugarPageProps {
    preloadedProperties?: ImovelClient[];
}

// Transform Sanity data to MobilePropertyCard format
const transformToMobileCard = (imovel: ImovelClient) => ({
    id: imovel._id,
    title: imovel.titulo || 'Imóvel disponível',
    price: imovel.preco || 0,
    address: imovel.endereco || '',
    location: imovel.bairro || imovel.cidade || 'Guararema',
    image: imovel.imagem?.imagemUrl || '/images/property-placeholder.jpg',
    bedrooms: imovel.dormitorios,
    bathrooms: imovel.banheiros,
    area: imovel.areaUtil,
    type: 'rent' as const,
    featured: imovel.destaque || false,
});

/**
 * TurboAlugarPage - Mobile-first optimized version
 */
export default function TurboAlugarPage({ preloadedProperties }: TurboAlugarPageProps) {
    const [properties, setProperties] = useState<ImovelClient[]>(preloadedProperties || []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Imóveis para Alugar
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Encontre o imóvel ideal para alugar em Guararema e região com excelente localização, segurança e ótimo custo-benefício.
                    </p>
                </div>

                {/* Properties Grid - Mobile First */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {properties.map((property) => (
                        <MobilePropertyCard
                            key={property._id}
                            {...transformToMobileCard(property)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {properties.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <div className="text-4xl mb-4">🏠</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum imóvel disponível
                        </h3>
                        <p className="text-gray-600">
                            Nenhum imóvel disponível para aluguel no momento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
