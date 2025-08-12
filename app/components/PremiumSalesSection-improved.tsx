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
    BarChart3,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisDestaqueVenda } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

// Animações naturais para vendas
const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut" as const
        }
    }
};

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
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
            ease: "easeOut" as const
        }
    }
};

// Componente de estatísticas informativas
const MarketStats = ({ properties }: { properties: PropertyCardProps[] }) => {
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
                        { label: 'Imóveis Disponíveis', value: stats.total, icon: Building2, color: 'blue' },
                        { label: 'Em Destaque', value: stats.featured, icon: Star, color: 'amber' },
                        { label: 'Preço Médio', value: formatPrice(stats.avgPrice), icon: TrendingUp, color: 'green' },
                        { label: 'Recém Listados', value: stats.newListings, icon: CheckCircle, color: 'emerald' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative p-4 rounded-xl border bg-white/80 backdrop-blur-sm hover:bg-white transition-colors group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon size={20} className="text-gray-600" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Propriedade em destaque
const FeaturedProperty = ({ property }: { property: PropertyCardProps }) => (
    <motion.div
        variants={heroVariants}
        className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
    >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/30 z-10" />        {/* Property image */}
        <div
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${property.mainImage?.url || '/images/property-placeholder.jpg'})` }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 p-8 lg:p-12 flex flex-col justify-end">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
            >
                {/* Location */}
                <div className="flex items-center gap-2 text-white/90">
                    <MapPin size={16} />
                    <span>{property.location}, {property.city}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    {property.title}
                </h3>

                {/* Price and features */}
                <div className="space-y-3">
                    <div className="text-3xl lg:text-4xl font-bold text-white">
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
                </div>

                {/* CTA */}
                <Link
                    href={`/imovel/${property.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors group/cta"
                >
                    <Eye size={18} />
                    <span>Ver Detalhes</span>
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    </motion.div>
);

// Grid de propriedades
const PropertyGrid = ({ properties }: { properties: PropertyCardProps[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(1).map((property, index) => (
            <motion.div
                key={property.id}
                variants={cardVariants}
                className="group"
            >
                <PropertyCardUnified
                    {...property}
                    className="h-full hover:shadow-lg transition-shadow duration-300"
                />
            </motion.div>
        ))}
    </div>
);

// Componente principal melhorado
export function PremiumSalesSection() {
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getImoveisDestaqueVenda();

            const transformedProperties: PropertyCardProps[] = await Promise.all(
                data.map(async (imovel: ImovelClient) => {
                    const optimizedImage = await loadImage(
                        imovel.imagem?.imagemUrl || '/images/property-placeholder.jpg'
                    );

                    return {
                        id: imovel._id,
                        title: imovel.titulo || '',
                        slug: extractSlugString(imovel.slug) || imovel._id,
                        location: imovel.bairro || '',
                        city: imovel.cidade || '',
                        price: imovel.preco || 0,
                        propertyType: 'sale' as const,
                        area: imovel.areaUtil,
                        bedrooms: imovel.dormitorios, bathrooms: imovel.banheiros,
                        parkingSpots: imovel.vagas,
                        mainImage: {
                            url: optimizedImage.url,
                            alt: imovel.imagem?.alt || imovel.titulo || ''
                        },
                        isHighlight: Boolean(imovel.destaque),
                        isPremium: Boolean(imovel.destaque),
                        isNew: false,
                        isFavorite: false
                    };
                })
            );

            setProperties(transformedProperties);
        } catch (err) {
            console.error('Erro ao carregar propriedades:', err);
            setError('Erro ao carregar imóveis');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-lg text-gray-600">Carregando imóveis...</div>
            </div>
        );
    }

    if (error || properties.length === 0) {
        return null;
    }

    const featuredProperty = properties[0];

    return (
        <section className="relative py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-6">
                {/* Header da seção */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="space-y-4">
                        <motion.div
                            className="inline-block"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" as const }}
                        >
                            <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold shadow-lg">
                                Imóveis para Venda
                            </div>
                        </motion.div>

                        <motion.h2
                            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Encontre seu Novo Lar
                        </motion.h2>

                        <motion.p
                            className="text-xl text-gray-600 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Imóveis cuidadosamente selecionados em localizações privilegiadas, com qualidade e conforto para você e sua família.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link
                                href="/comprar"
                                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                            >
                                <span>Ver Todos os Imóveis</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                <Filter className="w-5 h-5" />
                                Filtros
                            </button>
                        </motion.div>
                    </div>

                    {/* Estatísticas de mercado */}
                    <div>
                        <MarketStats properties={properties} />
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

                {/* Call to action natural */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/comprar"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl"
                    >
                        <span>Explorar Mais Imóveis</span>
                        <ArrowRight size={24} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default PremiumSalesSection;

