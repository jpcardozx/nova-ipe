import React from 'react';
// file: app/components/server/PropertyShowcaseServer.tsx
import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { UnifiedLoading } from '../ui/UnifiedComponents';
import { transformPropertyData } from '@/lib/property-transformers';
import { ensureNonNullProperties } from '@/app/PropertyTypeFix';
import { PropertyType } from '../../../types/imovel';
import PremiumPropertyCatalog from '../premium/PremiumPropertyCatalog';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { ProcessedProperty } from '@/app/page';

/**
 * Enhanced Property transformer for premium catalog integration
 */
function transformToProperty(imovel: ImovelClient, propertyType: PropertyType): ProcessedProperty | null {
    try {
        if (!imovel || !imovel._id) return null;

        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const slug = extractSlugString(imovel.slug);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        return {
            id: imovel._id,
            title: imovel.titulo || 'Imóvel disponível', slug: slug || `imovel-${imovel._id}`,
            location: imovel.bairro || 'Guararema',
            city: 'Guararema',
            price: imovel.preco || 0,
            propertyType,
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas,
            mainImage: {
                url: processedImage.url,
                alt: processedImage.alt
            },
            isPremium: Boolean(imovel.destaque),
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo)),
            isHighlight: Boolean(imovel.destaque)
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// Premium Wrapper para dados de venda - Usando PremiumPropertyCatalog
export async function PropertiesSale() {
    try {
        // Buscar dados do servidor diretamente
        const imoveisDestaque = await getImoveisDestaque();

        // Normalizar documentos
        const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];        // Transformar em formato ProcessedProperty para o PremiumPropertyCatalog
        const propertiesFormatted: ProcessedProperty[] = destaqueNormalizados
            .map(imovel => transformToProperty(imovel, 'sale'))
            .filter((property): property is ProcessedProperty => property !== null);

        return (
            <Suspense fallback={<UnifiedLoading variant="property" height="600px" title="Carregando imóveis em destaque..." />}>
                <PremiumPropertyCatalog
                    title="Imóveis Premium para Venda"
                    subtitle="Encontre o imóvel perfeito em Guararema com nossa seleção exclusiva de propriedades para venda"
                    properties={propertiesFormatted}
                    badge="Imóveis à Venda"
                    viewAllLink="/comprar"
                    viewAllText="Ver todos os imóveis à venda"
                    variant="premium"
                    accentColor="blue"
                    maxItems={6}
                    showFilters={true}
                    className="bg-gradient-to-br from-neutral-50 to-blue-50/30"
                />
            </Suspense>
        );
    } catch (error) {
        console.error('Erro ao carregar imóveis para venda:', error);
        return (
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500">Erro ao carregar imóveis. Tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }
}

// Premium Wrapper para dados de aluguel - Usando PremiumPropertyCatalog
export async function PropertiesRental() {
    try {
        // Buscar dados do servidor diretamente
        const imoveisAluguel = await getImoveisAluguel();

        // Normalizar documentos
        const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];        // Transformar em formato ProcessedProperty para o PremiumPropertyCatalog
        const propertiesFormatted: ProcessedProperty[] = aluguelNormalizados
            .map(imovel => transformToProperty(imovel, 'rent'))
            .filter((property): property is ProcessedProperty => property !== null);

        return (
            <Suspense fallback={<UnifiedLoading variant="property" height="600px" title="Carregando imóveis para aluguel..." />}>
                <PremiumPropertyCatalog
                    title="Imóveis Premium para Aluguel"
                    subtitle="Descubra as melhores opções de aluguel em Guararema com localização privilegiada e estrutura completa"
                    properties={propertiesFormatted}
                    badge="Para Alugar"
                    viewAllLink="/alugar"
                    viewAllText="Ver todos os imóveis para aluguel"
                    variant="modern"
                    accentColor="emerald"
                    maxItems={6}
                    showFilters={true}
                    className="bg-gradient-to-br from-slate-50 to-emerald-50/50"
                />
            </Suspense>
        );
    } catch (error) {
        console.error('Erro ao carregar imóveis para aluguel:', error);
        return (
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500">Erro ao carregar imóveis. Tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }
}

// Legacy interfaces and components removed - now using PremiumPropertyCatalog
// All property display functionality has been modernized to use the premium catalog system
