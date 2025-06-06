'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading skeleton para cards de propriedades
const PropertyCardSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'featured' }) => (
    <div className={cn(
        "relative bg-white rounded-2xl overflow-hidden shadow-lg",
        variant === 'featured' ? "ring-2 ring-amber-200" : ""
    )}>
        {/* Header com imagem */}
        <div className="relative h-48 bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse">
            {variant === 'featured' && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-amber-300/50 rounded-full animate-pulse" />
            )}
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
            {/* Título */}
            <div className="h-6 bg-stone-200 rounded animate-pulse" />

            {/* Localização */}
            <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse" />

            {/* Preço */}
            <div className="h-8 bg-gradient-to-r from-amber-200 to-orange-200 rounded w-1/2 animate-pulse" />

            {/* Features */}
            <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-stone-200 rounded animate-pulse" />
                        <div className="w-6 h-4 bg-stone-100 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Loading para seção de vendas
const SaleSectionSkeleton = () => (
    <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/50">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                    <Building2 size={24} className="text-amber-700" />
                </div>
                <div className="space-y-2">
                    <div className="h-8 bg-amber-200/50 rounded w-64 animate-pulse" />
                    <div className="h-5 bg-amber-100/50 rounded w-80 animate-pulse" />
                </div>
            </div>
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <div className="h-4 bg-amber-200/50 rounded w-24 animate-pulse" />
            </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
            <div className="h-12 bg-gradient-to-r from-amber-300 to-orange-300 rounded-xl w-48 animate-pulse" />
        </div>

        {/* Grid de properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} variant={i === 0 ? 'featured' : 'default'} />
            ))}
        </div>

        {/* Badge de destaque */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
            <Star size={14} className="text-amber-700" />
            <div className="h-4 bg-amber-200 rounded w-16 animate-pulse" />
        </div>
    </div>
);

// Loading para seção de aluguéis
const RentSectionSkeleton = () => (
    <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-stone-50 border border-blue-200/50">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-slate-100">
                    <Home size={24} className="text-blue-700" />
                </div>
                <div className="space-y-2">
                    <div className="h-8 bg-blue-200/50 rounded w-48 animate-pulse" />
                    <div className="h-5 bg-blue-100/50 rounded w-64 animate-pulse" />
                </div>
            </div>
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <div className="h-4 bg-blue-200/50 rounded w-24 animate-pulse" />
            </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
            <div className="h-12 bg-gradient-to-r from-blue-300 to-slate-300 rounded-xl w-52 animate-pulse" />
        </div>

        {/* Grid de properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
                <PropertyCardSkeleton key={i} variant={i === 0 ? 'featured' : 'default'} />
            ))}
        </div>
    </div>
);

// Componente principal de loading estratégico
export function StrategicPropertySectionsLoading() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 relative overflow-hidden"
        >
            {/* Background decorativo */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200 to-slate-200 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Título principal */}
                <div className="text-center mb-16">
                    <div className="h-12 bg-stone-200 rounded w-96 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-stone-100 rounded w-[600px] mx-auto animate-pulse" />
                </div>

                {/* Layout estratégico desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Seção de vendas (7/12) */}
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <SaleSectionSkeleton />
                    </motion.div>

                    {/* Seção de aluguéis (5/12) */}
                    <motion.div
                        className="lg:col-span-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <RentSectionSkeleton />
                    </motion.div>
                </div>

                {/* Call-to-action final */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center gap-4">
                        <div className="h-12 bg-gradient-to-r from-amber-300 to-orange-300 rounded-xl w-40 animate-pulse" />
                        <div className="h-12 bg-gradient-to-r from-blue-300 to-slate-300 rounded-xl w-44 animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

export default StrategicPropertySectionsLoading;
