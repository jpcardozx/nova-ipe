'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    TrendingUp,
    Star,
    Eye,
    Filter,
    MapPin,
    Home as HomeIcon,
    Zap,
    Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisDestaqueVenda } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

// Animações específicas para vendas
const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    }
};

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    }
};

// Componente de estatísticas em tempo real
const LiveStats = ({ properties }: { properties: PropertyCardProps[] }) => {
    const [visibleStats, setVisibleStats] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisibleStats(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const stats = {
        total: properties.length,
        featured: properties.filter(p => p.isHighlight).length,
        avgPrice: properties.length > 0
            ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
            : 0,
        newListings: properties.filter(p => p.isNew).length
    };

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `R$ ${(price / 1000000).toFixed(1)}M`;
        }
        return `R$ ${(price / 1000).toFixed(0)}K`;
    };

    return (
        <AnimatePresence>
            {visibleStats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Propriedades', value: stats.total, icon: Building2, color: 'amber' },
                        { label: 'Em Destaque', value: stats.featured, icon: Star, color: 'yellow' },
                        { label: 'Preço Médio', value: formatPrice(stats.avgPrice), icon: TrendingUp, color: 'orange' },
                        { label: 'Novos', value: stats.newListings, icon: Zap, color: 'red' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-4 rounded-2xl border backdrop-blur-sm overflow-hidden group",
                                `bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100`,
                                `border-${stat.color}-200 hover:border-${stat.color}-300`
                            )}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon size={20} className={`text-${stat.color}-600`} />
                                    <div className={`w-2 h-2 rounded-full bg-${stat.color}-500 animate-pulse`} />
                                </div>
                                <div className={`text-2xl font-bold text-${stat.color}-900 mb-1`}>
                                    {stat.value}
                                </div>
                                <div className={`text-sm text-${stat.color}-700`}>
                                    {stat.label}
                                </div>
                            </div>
                            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Propriedade em destaque (hero card)
const FeaturedProperty = ({ property }: { property: PropertyCardProps }) => (
    <motion.div
        variants={heroVariants}
        className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group cursor-pointer"
    >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 via-transparent to-orange-900/60 z-10" />

        {/* Property image */}
        <div
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${property.mainImage.url})` }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 p-8 lg:p-12 flex flex-col justify-end">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
            >
                {/* Badges */}
                <div className="flex gap-2">
                    {property.isHighlight && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
                            <Crown size={14} />
                            <span>Destaque</span>
                        </div>
                    )}
                    {property.isNew && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                            <Zap size={14} />
                            <span>Novo</span>
                        </div>
                    )}
                </div>

                {/* Property info */}
                <div className="space-y-2">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90">
                        <MapPin size={16} />
                        <span>{property.location}, {property.city}</span>
                    </div>
                </div>

                {/* Price and features */}
                <div className="space-y-3">
                    <div className="text-3xl lg:text-4xl font-bold text-amber-400">
                        R$ {property.price.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-6 text-white/90">
                        {property.bedrooms && (
                            <div className="flex items-center gap-1">
                                <HomeIcon size={16} />
                                <span>{property.bedrooms} quartos</span>
                            </div>
                        )}
                        {property.area && (
                            <div className="flex items-center gap-1">
                                <span>{property.area}m²</span>
                            </div>
                        )}
                    </div>
                </div>                {/* CTA */}
                <Link
                    href={`/imovel/${typeof property.slug === 'string' ? property.slug : property.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-900 rounded-xl font-semibold hover:bg-amber-50 transition-colors group/cta"
                >
                    <Eye size={18} />
                    <span>Ver Detalhes</span>
                    <ArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    </motion.div>
);

// Grid de propriedades secundárias
const PropertyGrid = ({ properties }: { properties: PropertyCardProps[] }) => {
    const secondaryProperties = properties.slice(1, 7); // Pega até 6 propriedades secundárias

    return (
        <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {secondaryProperties.map((property) => (
                <motion.div
                    key={property.id}
                    variants={cardVariants}
                    className="group"
                >                    <PropertyCardUnified
                        {...property}
                        className="h-full transform-gpu group-hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl"
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

// Hook para dados das propriedades
function useVendaProperties() {
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const transformPropertyData = useCallback((imovel: ImovelClient): PropertyCardProps | null => {
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
                propertyType: 'sale',
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

                const imoveis = await getImoveisDestaqueVenda();
                const transformedProperties = imoveis
                    .map(transformPropertyData)
                    .filter(Boolean) as PropertyCardProps[];

                // Ordena por destaque primeiro, depois por novos
                const sortedProperties = transformedProperties.sort((a, b) => {
                    if (a.isHighlight && !b.isHighlight) return -1;
                    if (!a.isHighlight && b.isHighlight) return 1;
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return 0;
                });

                setProperties(sortedProperties);
            } catch (err) {
                console.error('Erro ao buscar propriedades:', err);
                setError('Erro ao carregar propriedades de venda.');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, [transformPropertyData]);

    return { properties, loading, error };
}

// Componente principal da seção de vendas
export function PremiumSalesSection() {
    const { properties, loading, error } = useVendaProperties();

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-6">
                            <div className="h-8 bg-amber-200 rounded animate-pulse" />
                            <div className="h-12 bg-amber-300 rounded animate-pulse" />
                            <div className="h-6 bg-amber-100 rounded w-3/4 animate-pulse" />
                        </div>
                        <div className="h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl animate-pulse" />
                    </div>
                    <div className="h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl animate-pulse mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-amber-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </section>
        );
    }

    const featuredProperty = properties.find(p => p.isHighlight) || properties[0];

    return (
        <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header da seção */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white">
                                <Building2 size={28} />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-200/50 rounded-full text-sm font-medium text-amber-800">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                <span>Mercado Aquecido</span>
                            </div>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
                            Oportunidades
                            <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Exclusivas
                            </span>
                        </h2>

                        <p className="text-xl text-stone-600 leading-relaxed">
                            Descubra imóveis premium em Guararema com potencial de alta valorização.
                            Investimentos estratégicos na Serra da Mantiqueira.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/comprar"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl group"
                            >
                                <Eye size={20} />
                                <span>Ver Todos</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-700 rounded-xl font-semibold hover:bg-white transition-all border border-amber-200">
                                <Filter size={20} />
                                <span>Filtrar</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats em tempo real */}
                    <div>
                        <LiveStats properties={properties} />
                    </div>
                </motion.div>

                {/* Propriedade em destaque */}
                {featuredProperty && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <FeaturedProperty property={featuredProperty} />
                    </motion.div>
                )}

                {/* Grid de propriedades */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={gridVariants}
                >
                    <PropertyGrid properties={properties} />
                </motion.div>

                {/* Call to action final */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/comprar"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg font-bold rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        <span>Explorar Mais Oportunidades</span>
                        <ArrowRight size={24} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default PremiumSalesSection;
