'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Home, Building2, Eye, Star, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { MarketStatsOverview, MarketAlert } from './MarketStats';
import { QuickFilters, QuickSort, ScrollIndicator } from './PropertyNavigation';
import useProperties from '@/app/hooks/useProperties';
import type { PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

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

// Componente de estatísticas da seção
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
    viewAllLabel,
    onRefresh,
    isRefreshing
}: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    count: number;
    type: 'sale' | 'rent';
    viewAllLink: string;
    viewAllLabel: string;
    onRefresh: () => void;
    isRefreshing: boolean;
}) => (
    <motion.div
        variants={cardVariants}
        className="flex flex-col gap-4 mb-6"
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

            <div className="flex items-center gap-3">
                <SectionStats count={count} type={type} />
                <motion.button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-stone-600 hover:bg-white/40 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RefreshCw
                        size={18}
                        className={cn("transition-transform", isRefreshing && "animate-spin")}
                    />
                </motion.button>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
        </div>
    </motion.div>
);

// Componente de grid de propriedades
const PropertyGrid = ({
    properties,
    type,
    isLoading,
    onLoadMore,
    hasMore
}: {
    properties: PropertyCardProps[];
    type: 'sale' | 'rent';
    isLoading: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
}) => {
    if (isLoading && properties.length === 0) {
        return (
            <div className={cn(
                "grid gap-6",
                type === 'sale'
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
            )}>
                {[...Array(type === 'sale' ? 6 : 4)].map((_, i) => (
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
        <>
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
                        >                            <PropertyCardUnified
                                {...property}
                                className="h-full transform-gpu group-hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {hasMore && (
                <ScrollIndicator hasMore={hasMore} onLoadMore={onLoadMore} />
            )}
        </>
    );
};

// Componente individual de seção
const PropertySection = ({
    type,
    title,
    subtitle,
    icon,
    viewAllLink,
    viewAllLabel,
    gradient,
    borderGradient
}: {
    type: 'sale' | 'rent';
    title: string;
    subtitle: string;
    icon: React.ElementType;
    viewAllLink: string;
    viewAllLabel: string;
    gradient: string;
    borderGradient: string;
}) => {
    const {
        filteredProperties,
        loading,
        error,
        activeFilter,
        activeSort,
        hasMore,
        stats,
        setFilter,
        setSort,
        loadMore,
        refresh
    } = useProperties({ type });

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    }, [refresh]);

    if (error) {
        return (
            <div className={cn(
                "relative p-8 lg:p-10 rounded-3xl border backdrop-blur-sm",
                `bg-gradient-to-br ${gradient}`,
                `border-gradient-to-r ${borderGradient}`
            )}>
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <motion.button
                        onClick={handleRefresh}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Tentar novamente
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className={cn(
                "relative p-8 lg:p-10 rounded-3xl border backdrop-blur-sm",
                `bg-gradient-to-br ${gradient}`,
                `border-gradient-to-r ${borderGradient}`
            )}
        >
            {/* Header da seção */}
            <SectionHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                count={stats.total}
                type={type}
                viewAllLink={viewAllLink}
                viewAllLabel={viewAllLabel}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />

            {/* Market Stats */}
            <MarketStatsOverview type={type} />

            {/* Market Alert */}
            <MarketAlert type={type} />

            {/* Filtros e ordenação */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <QuickFilters
                    type={type}
                    activeFilter={activeFilter}
                    onFilterChange={setFilter}
                />
                <QuickSort
                    activeSort={activeSort}
                    onSortChange={setSort}
                />
            </div>

            {/* Grid de propriedades */}
            <PropertyGrid
                properties={filteredProperties}
                type={type}
                isLoading={loading}
                onLoadMore={loadMore}
                hasMore={hasMore}
            />

            {/* Badge de destaque */}
            {stats.featured > 0 && (
                <motion.div
                    variants={cardVariants}
                    className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-amber-700"
                >
                    <Star size={14} className="fill-current" />
                    {stats.featured} Destaques
                </motion.div>
            )}
        </motion.div>
    );
};

// Componente principal melhorado
export function EnhancedStrategicPropertySections() {
    const sections = [
        {
            id: 'sale',
            type: 'sale' as const,
            title: 'Oportunidades Exclusivas',
            subtitle: 'Imóveis premium para compra em Guararema',
            icon: Building2,
            viewAllLink: '/comprar',
            viewAllLabel: 'Ver todos à venda',
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
            gradient: 'from-blue-50 via-slate-50 to-stone-50',
            borderGradient: 'from-blue-200 to-slate-200'
        }
    ];

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
                    {/* Seção de vendas (7/12) */}
                    <div className="lg:col-span-7">
                        <PropertySection {...sections[0]} />
                    </div>

                    {/* Seção de aluguéis (5/12) */}
                    <div className="lg:col-span-5">
                        <PropertySection {...sections[1]} />
                    </div>
                </div>

                {/* Call-to-action final */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4">
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

export default EnhancedStrategicPropertySections;
