'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Home, Building2, TrendingUp, MapPin, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import { MarketStatsOverview, MarketAlert } from './MarketStats';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyType, PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

// Configurações do layout estratégico
const LAYOUT_CONFIG = {
    desktop: {
        sale: { span: 7, order: 1 }, // Seção de venda ocupa mais espaço (7/12)
        rent: { span: 5, order: 2 }  // Seção de aluguel complementar (5/12)
    },
    tablet: {
        sale: { span: 12, order: 1 },
        rent: { span: 12, order: 2 }
    },
    mobile: {
        sale: { span: 12, order: 1 },
        rent: { span: 12, order: 2 }
    }
};

// Animações estratégicas
const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1.0],
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
};

// Componente de estatísticas
const SectionStats = ({ count, type }: { count: number; type: 'sale' | 'rent' }) => (
    <motion.div
        variants={cardVariants}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm"
    >
        <div className={cn(
            "w-2 h-2 rounded-full",
            type === 'sale' ? "bg-amber-400" : "bg-blue-400"
        )} />
        <span className="font-medium">{count} propriedades</span>
    </motion.div>
);

// Componente de header da seção
const SectionHeader = ({
    title,
    subtitle,
    icon: Icon,
    count,
    type,
    viewAllLink,
    viewAllLabel
}: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    count: number;
    type: 'sale' | 'rent';
    viewAllLink: string;
    viewAllLabel: string;
}) => (
    <motion.div
        variants={cardVariants}
        className="flex flex-col gap-4 mb-8"
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "p-3 rounded-xl",
                    type === 'sale'
                        ? "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700"
                        : "bg-gradient-to-br from-blue-100 to-slate-100 text-blue-700"
                )}>
                    <Icon size={24} />
                </div>
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 mb-1">
                        {title}
                    </h2>
                    <p className="text-stone-600 text-base lg:text-lg leading-relaxed">
                        {subtitle}
                    </p>
                </div>
            </div>
            <SectionStats count={count} type={type} />
        </div>

        <Link
            href={viewAllLink}
            className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 group text-base",
                type === 'sale'
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
            )}
        >
            <Eye size={18} />
            {viewAllLabel}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
    </motion.div>
);

// Componente de grid de propriedades
const PropertyGrid = ({
    properties,
    type,
    isLoading
}: {
    properties: PropertyCardProps[];
    type: 'sale' | 'rent';
    isLoading: boolean;
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-80 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    const displayProperties = properties.slice(0, type === 'sale' ? 6 : 4);

    return (
        <motion.div
            variants={sectionVariants}
            className={cn(
                "grid gap-6",
                type === 'sale'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
            )}
        >
            <AnimatePresence>
                {displayProperties.map((property, index) => (
                    <motion.div
                        key={property.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={index}
                        className="group"
                    >                        <PropertyCardUnified
                            {...property}
                            className="h-full transform-gpu group-hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

// Hook para transformar dados das propriedades
function usePropertyData(type: 'sale' | 'rent') {
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const transformPropertyData = useCallback((imovel: ImovelClient, propertyType: PropertyType): PropertyCardProps | null => {
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
                title: imovel.titulo || 'Imóvel disponível',
                slug: slug || `imovel-${imovel._id}`,
                location: imovel.bairro || 'Guararema',
                city: 'Guararema',
                price: imovel.preco || 0,
                propertyType,
                area: imovel.areaUtil,
                bedrooms: imovel.dormitorios,
                bathrooms: imovel.banheiros,
                parkingSpots: imovel.vagas,
                mainImage: {
                    url: processedImage.url || '/images/property-placeholder.jpg',
                    alt: processedImage.alt || 'Imagem do imóvel'
                },
                isHighlight: Boolean(imovel.destaque),
                isPremium: Boolean(imovel.destaque),
                isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo))
            };
        } catch (error) {
            console.error(`Erro ao transformar imóvel: ${error}`);
            return null;
        }
    }, []);

    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                setError(null);

                const fetchFunction = type === 'sale' ? getImoveisDestaqueVenda : getImoveisAluguel;
                const propertyType: PropertyType = type === 'sale' ? 'sale' : 'rent';

                const imoveis = await fetchFunction();
                const transformedProperties = imoveis
                    .map(imovel => transformPropertyData(imovel, propertyType))
                    .filter(Boolean) as PropertyCardProps[];

                setProperties(transformedProperties);
            } catch (err) {
                console.error('Erro ao buscar propriedades:', err);
                setError('Erro ao carregar propriedades. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, [type, transformPropertyData]);

    return { properties, loading, error };
}

// Componente principal das seções estratégicas
export function StrategicPropertySections() {
    const saleData = usePropertyData('sale');
    const rentData = usePropertyData('rent');

    // Configuração das seções
    const sections = useMemo(() => [
        {
            id: 'sale',
            type: 'sale' as const,
            title: 'Oportunidades Exclusivas',
            subtitle: 'Imóveis premium para compra em Guararema',
            icon: Building2,
            viewAllLink: '/comprar',
            viewAllLabel: 'Ver todos à venda',
            data: saleData,
            gradient: 'from-amber-50 via-yellow-50 to-orange-50',
            borderGradient: 'from-amber-200 to-orange-200'
        },
        {
            id: 'rent',
            type: 'rent' as const,
            title: 'Aluguéis Premium',
            subtitle: 'Casas e terrenos para locação de qualidade',
            icon: Home,
            viewAllLink: '/alugar',
            viewAllLabel: 'Ver todos para aluguel',
            data: rentData,
            gradient: 'from-blue-50 via-slate-50 to-stone-50',
            borderGradient: 'from-blue-200 to-slate-200'
        }
    ], [saleData, rentData]);

    if (saleData.loading || rentData.loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-stone-50 to-neutral-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7">
                            <div className="h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl animate-pulse" />
                        </div>
                        <div className="lg:col-span-5">
                            <div className="h-96 bg-gradient-to-br from-blue-100 to-slate-100 rounded-3xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 relative overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200 to-slate-200 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Título principal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
                        Imóveis Selecionados
                    </h2>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                        Descobra as melhores oportunidades de compra e aluguel em Guararema,
                        cuidadosamente selecionadas para você
                    </p>
                </motion.div>

                {/* Layout estratégico desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                            transition={{ delay: index * 0.2 }}
                            className={cn(
                                "relative",
                                section.type === 'sale' ? "lg:col-span-7" : "lg:col-span-5"
                            )}
                        >
                            <div className={cn(
                                "relative p-8 lg:p-10 rounded-3xl border backdrop-blur-sm",
                                `bg-gradient-to-br ${section.gradient}`,
                                `border-gradient-to-r ${section.borderGradient}`
                            )}>
                                {/* Header da seção */}
                                <SectionHeader
                                    title={section.title}
                                    subtitle={section.subtitle}
                                    icon={section.icon}
                                    count={section.data.properties.length}
                                    type={section.type}
                                    viewAllLink={section.viewAllLink}
                                    viewAllLabel={section.viewAllLabel}
                                />

                                {/* Market Stats */}
                                <MarketStatsOverview type={section.type} />

                                {/* Market Alert */}
                                <MarketAlert type={section.type} />

                                {/* Grid de propriedades */}
                                <PropertyGrid
                                    properties={section.data.properties}
                                    type={section.type}
                                    isLoading={section.data.loading}
                                />

                                {/* Badge de destaque */}
                                {section.data.properties.some(p => p.isHighlight) && (
                                    <motion.div
                                        variants={cardVariants}
                                        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-amber-700"
                                    >
                                        <Star size={14} className="fill-current" />
                                        Destaques
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call-to-action final */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center gap-4">
                        <Link
                            href="/comprar"
                            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Explorar Vendas
                        </Link>
                        <Link
                            href="/alugar"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Explorar Aluguéis
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default StrategicPropertySections;
