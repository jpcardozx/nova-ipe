'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { PropertyShowcaseSystem } from '../premium/PropertyShowcaseSystem';
import { UnifiedLoading } from '../ui/UnifiedComponents';
import type { ImovelClient } from '@/src/types/imovel-client';

// Transform function to convert ImovelClient to PropertyData
const transformToPropertyData = (imovel: ImovelClient, type: 'sale' | 'rent') => ({
    id: imovel._id,
    title: imovel.titulo || 'Imóvel sem título',
    slug: imovel.slug || imovel._id,
    price: imovel.preco || 0,
    location: imovel.endereco || imovel.bairro || 'Localização não informada',
    city: imovel.cidade,
    mainImage: {
        url: imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '/images/placeholder-property.jpg',
        alt: imovel.imagem?.alt || imovel.titulo || 'Imagem do imóvel',
        blurDataURL: '/images/blur-placeholder.jpg'
    }, images: (imovel.galeria?.map(img => {
        const url = img.imagemUrl;
        if (!url) return null;
        return {
            url,
            alt: img.alt || imovel.titulo || 'Imagem do imóvel'
        };
    }).filter(Boolean) || []) as { url: string; alt: string }[],
    bedrooms: imovel.dormitorios,
    bathrooms: imovel.banheiros,
    area: imovel.areaUtil,
    parkingSpots: imovel.vagas,
    type,
    isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    isPremium: Boolean(imovel.destaque),
    isHighlight: Boolean(imovel.destaque),
    tags: [
        imovel.categoria?.titulo && `${imovel.categoria.titulo}`,
        imovel.tipoImovel && `${imovel.tipoImovel}`,
        imovel.vagas && imovel.vagas > 0 && 'Garagem'
    ].filter(Boolean) as string[]
});

// Enhanced Sales Section
interface EnhancedSalesSectionProps {
    properties: ImovelClient[];
    title?: string;
    subtitle?: string;
    description?: string;
    variant?: 'carousel' | 'grid' | 'hero';
    maxItems?: number;
    className?: string;
}

export const EnhancedSalesSection: React.FC<EnhancedSalesSectionProps> = ({
    properties,
    title = "Imóveis Premium para Venda",
    subtitle = "Investimentos selecionados para o seu futuro",
    description = "Descubra oportunidades únicas de investimento em Guararema. Cada propriedade é cuidadosamente avaliada para garantir o melhor retorno e qualidade de vida.",
    variant = 'carousel',
    maxItems = 6,
    className
}) => {
    const transformedProperties = properties
        .slice(0, maxItems)
        .map(property => transformToPropertyData(property, 'sale'));

    if (!transformedProperties.length) {
        return (
            <section className="py-20 bg-gradient-to-br from-emerald-50/30 via-green-50/20 to-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-white rounded-2xl shadow-sm border border-emerald-100"
                    >
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                            Novas oportunidades em breve
                        </h3>
                        <p className="text-emerald-600 mb-6">
                            Estamos preparando uma seleção especial de imóveis para venda.
                            Entre em contato para conhecer as melhores oportunidades disponíveis.
                        </p>
                        <a
                            href="/contato"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            Entre em contato
                        </a>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <div className={className}>
            <PropertyShowcaseSystem
                properties={transformedProperties}
                title={title}
                subtitle={subtitle}
                description={description}
                variant={variant}
                sectionType="sale"
                viewAllLink="/comprar"
                viewAllText="Ver todos os imóveis para venda"
                className="bg-gradient-to-br from-emerald-50/30 via-green-50/20 to-white"
            />
        </div>
    );
};

// Enhanced Rentals Section
interface EnhancedRentalsSectionProps {
    properties: ImovelClient[];
    title?: string;
    subtitle?: string;
    description?: string;
    variant?: 'carousel' | 'grid' | 'hero';
    maxItems?: number;
    className?: string;
}

export const EnhancedRentalsSection: React.FC<EnhancedRentalsSectionProps> = ({
    properties,
    title = "Imóveis Selecionados para Aluguel",
    subtitle = "Encontre seu novo lar em Guararema",
    description = "Residências cuidadosamente selecionadas com excelente localização, infraestrutura completa e o melhor custo-benefício da região para você e sua família.",
    variant = 'carousel',
    maxItems = 6,
    className
}) => {
    const transformedProperties = properties
        .slice(0, maxItems)
        .map(property => transformToPropertyData(property, 'rent'));

    if (!transformedProperties.length) {
        return (
            <section className="py-20 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-white rounded-2xl shadow-sm border border-blue-100"
                    >
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">
                            Novos imóveis disponíveis em breve
                        </h3>
                        <p className="text-blue-600 mb-6">
                            Estamos atualizando nosso portfólio de aluguéis.
                            Entre em contato para conhecer as melhores opções disponíveis.
                        </p>
                        <a
                            href="/contato"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            Entre em contato
                        </a>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <div className={className}>
            <PropertyShowcaseSystem
                properties={transformedProperties}
                title={title}
                subtitle={subtitle}
                description={description}
                variant={variant}
                sectionType="rent"
                viewAllLink="/alugar"
                viewAllText="Ver todos os imóveis para aluguel"
                className="bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-white"
            />
        </div>
    );
};

// Combined Section with Smart Layout
interface CombinedPropertySectionsProps {
    salesProperties: ImovelClient[];
    rentalProperties: ImovelClient[];
    layout?: 'stacked' | 'split' | 'hero-featured';
    className?: string;
}

export const CombinedPropertySections: React.FC<CombinedPropertySectionsProps> = ({
    salesProperties,
    rentalProperties,
    layout = 'stacked',
    className
}) => {
    const hasSales = salesProperties.length > 0;
    const hasRentals = rentalProperties.length > 0;

    if (!hasSales && !hasRentals) {
        return (
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-gray-50 rounded-2xl"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Novos imóveis em breve
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Estamos preparando uma seleção especial de imóveis.
                            Entre em contato para conhecer as melhores oportunidades.
                        </p>
                        <a
                            href="/contato"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            Entre em contato
                        </a>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (layout === 'stacked') {
        return (
            <div className={className}>
                {hasRentals && (
                    <Suspense fallback={<UnifiedLoading height="600px" title="Carregando imóveis para aluguel..." />}>
                        <EnhancedRentalsSection
                            properties={rentalProperties}
                            variant="carousel"
                            maxItems={6}
                        />
                    </Suspense>
                )}
                {hasSales && (
                    <Suspense fallback={<UnifiedLoading height="600px" title="Carregando imóveis para venda..." />}>
                        <EnhancedSalesSection
                            properties={salesProperties}
                            variant="carousel"
                            maxItems={6}
                        />
                    </Suspense>
                )}
            </div>
        );
    }

    if (layout === 'hero-featured') {
        return (
            <div className={className}>
                {hasRentals && (
                    <Suspense fallback={<UnifiedLoading height="700px" title="Carregando destaques para aluguel..." />}>
                        <EnhancedRentalsSection
                            properties={rentalProperties}
                            variant="hero"
                            maxItems={3}
                            title="Destaques para Aluguel"
                            subtitle="Os imóveis mais procurados"
                        />
                    </Suspense>
                )}
                {hasSales && (
                    <Suspense fallback={<UnifiedLoading height="600px" title="Carregando imóveis para venda..." />}>
                        <EnhancedSalesSection
                            properties={salesProperties}
                            variant="grid"
                            maxItems={6}
                        />
                    </Suspense>
                )}
            </div>
        );
    }

    // Split layout
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {hasRentals && (
                        <Suspense fallback={<UnifiedLoading height="500px" title="Carregando aluguéis..." />}>
                            <EnhancedRentalsSection
                                properties={rentalProperties.slice(0, 3)}
                                variant="grid"
                                title="Para Alugar"
                                subtitle="Encontre seu novo lar"
                                maxItems={3}
                            />
                        </Suspense>
                    )}
                    {hasSales && (
                        <Suspense fallback={<UnifiedLoading height="500px" title="Carregando vendas..." />}>
                            <EnhancedSalesSection
                                properties={salesProperties.slice(0, 3)}
                                variant="grid"
                                title="Para Comprar"
                                subtitle="Invista no seu futuro"
                                maxItems={3}
                            />
                        </Suspense>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CombinedPropertySections;

