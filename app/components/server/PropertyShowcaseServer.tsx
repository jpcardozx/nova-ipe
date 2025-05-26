import React from 'react';
// file: app/components/server/PropertyShowcaseServer.tsx
import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { PropertyClient } from '../client/PropertyClient';
import SectionHeader from '../ui/SectionHeader';
import { UnifiedLoading } from '../ui/UnifiedComponents';
import { transformPropertyData } from '@/lib/property-transformers';
import { ensureNonNullProperties } from '@/app/PropertyTypeFix';
import { PropertyType } from '../../../types/imovel';

/**
 * Componente Server para exibir propriedades
 * Usa Server Components para dados e Client Components para interatividade
 */

// Wrapper para dados de venda
export async function PropertiesSale() {
    // Buscar dados do servidor diretamente
    const imoveisDestaque = await getImoveisDestaque();

    // Normalizar documentos
    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];

    // Transformar em formato legível para o cliente
    const destaqueFormatados = ensureNonNullProperties(
        destaqueNormalizados
            .map(imovel => transformPropertyData(imovel, 'sale'))
            .filter(Boolean)
    );

    return (
        <PropertyShowcaseServer
            properties={destaqueFormatados}
            title="Encontre seu próximo lar"
            subtitle="Imóveis selecionados para venda em Guararema e região"
            badge="Imóveis à Venda"
            badgeColor="blue"
        />
    );
}

// Wrapper para dados de aluguel
export async function PropertiesRental() {
    // Buscar dados do servidor diretamente
    const imoveisAluguel = await getImoveisAluguel();

    // Normalizar documentos
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];

    // Transformar em formato legível para o cliente
    const aluguelFormatados = ensureNonNullProperties(
        aluguelNormalizados
            .map(imovel => transformPropertyData(imovel, 'rent'))
            .filter(Boolean)
    );

    return (
        <PropertyShowcaseServer
            properties={aluguelFormatados}
            title="Imóveis para Alugar"
            subtitle="As melhores opções de aluguel em Guararema"
            badge="Para Alugar"
            badgeColor="green"
        />
    );
}

// Definição da interface para as propriedades do componente
interface Property {
    id: string;
    title: string;
    slug: string;
    location: string;
    city: string;
    price: number;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    garage?: number;
    isNew: boolean;
}

interface PropertyShowcaseProps {
    properties: Property[];
    title: string;
    subtitle: string;
    badge: string;
    badgeColor: 'blue' | 'green' | 'amber' | 'purple' | 'emerald';
    maxItems?: number;
}

// Componente base do showcase de propriedades
export function PropertyShowcaseServer({
    properties,
    title,
    subtitle,
    badge,
    badgeColor,
    maxItems = 6
}: PropertyShowcaseProps) {
    // Se não há propriedades, não renderizar
    if (!properties || properties.length === 0) {
        return null;
    }

    // Truncar para o máximo de itens
    const displayProperties = properties.slice(0, maxItems);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
                <SectionHeader
                    badge={badge}
                    badgeColor={badgeColor}
                    title={title}
                    description={subtitle}
                    align="center"
                    className="mb-16"
                />

                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12">
                        <Suspense fallback={<UnifiedLoading variant="property" height="600px" />}>
                            {/* Cliente recebe apenas os dados - separação de responsabilidades */}
                            <PropertyClient properties={displayProperties} />
                        </Suspense>

                        {/* CTA para ver mais */}
                        <div className="text-center mt-12">
                            <a
                                href="/comprar"
                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Ver Todos os Imóveis
                                <span className="ml-2">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
