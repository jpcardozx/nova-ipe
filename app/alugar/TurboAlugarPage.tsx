'use client';

import { useState, useEffect } from 'react';
import type { ImovelClient } from '../../src/types/imovel-client';

interface TurboAlugarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * TurboAlugarPage - Simplified version for build stability
 */
export default function TurboAlugarPage({ preloadedProperties }: TurboAlugarPageProps) {
    const [properties, setProperties] = useState<ImovelClient[]>(preloadedProperties || []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Imóveis para Alugar</h1>
            <p className="text-gray-600 mb-8">
                Encontre o imóvel ideal para alugar em Guararema e região com excelente localização, segurança e ótimo custo-benefício.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div key={property._id} className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-lg">{property.titulo}</h3>
                        <p className="text-gray-600">{property.endereco}</p>
                        <p className="text-green-600 font-bold">
                            R$ {property.preco?.toLocaleString('pt-BR')}
                        </p>
                    </div>
                ))}
            </div>

            {properties.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    Nenhum imóvel disponível para aluguel no momento.
                </div>
            )}
        </div>
    );
}
