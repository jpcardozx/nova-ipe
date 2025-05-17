'use client';

import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SectionHeader from './ui/SectionHeader';
import { cn } from '@/lib/utils';
import { processProperties, ProcessedPropertyData } from './PropertyProcessor';
import type { PropertyType } from './OptimizedPropertyCard';
import { motion } from 'framer-motion';

// Lazy load ícones para melhor performance
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })), { ssr: true });
const ChevronRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })), { ssr: true });
const ChevronLeft = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })), { ssr: true });
const Star = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), { ssr: true });
const FilterIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Filter })), { ssr: true });

// Componente principal otimizado com carregamento dinâmico
const OptimizedPropertyCarousel = dynamic(() => import('@/app/components/OptimizedPropertyCarousel').then(mod => ({ default: mod.OptimizedPropertyCarousel })),
    {
        ssr: false,
        loading: () => <PropertiesLoadingSkeleton />,
    }
);

// Componente de esqueleto de carregamento otimizado e mais bonito
const PropertiesLoadingSkeleton = memo(() => (
    <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="h-9 w-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg mb-3"></div>
                <div className="h-5 w-96 bg-gradient-to-r from-gray-100 to-gray-50 rounded-md"></div>
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100"></div>
                    <div className="p-5">
                        <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                        <div className="h-5 bg-gray-100 rounded-md w-1/2 mb-5"></div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                            <div className="h-8 bg-gray-50 rounded-md"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

PropertiesLoadingSkeleton.displayName = 'PropertiesLoadingSkeleton';

// Botões de controle melhorados
interface CarouselControlProps {
    direction: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
}

const CarouselControl = memo(({ direction, onClick, disabled }: CarouselControlProps) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:text-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
            disabled && "opacity-40 cursor-not-allowed"
        )}
        aria-label={direction === 'next' ? 'Próximo' : 'Anterior'}
    >
        {direction === 'next' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
    </motion.button>
));

CarouselControl.displayName = 'CarouselControl';

// Filtro de tipos de propriedade
interface PropertyFilterProps {
    activeFilter: PropertyType | 'all';
    onChange: (filter: PropertyType | 'all') => void;
}

const PropertyFilter = memo(({ activeFilter, onChange }: PropertyFilterProps) => (
    <div className="flex flex-wrap gap-2 mb-6">
        <FilterBadge
            isActive={activeFilter === 'all'}
            onClick={() => onChange('all')}
        >
            <FilterIcon className="w-3.5 h-3.5 mr-1.5" />
            Todos
        </FilterBadge>
        <FilterBadge
            isActive={activeFilter === 'sale'}
            onClick={() => onChange('sale')}
        >
            Venda
        </FilterBadge>
        <FilterBadge
            isActive={activeFilter === 'rent'}
            onClick={() => onChange('rent')}
        >
            Aluguel
        </FilterBadge>
    </div>
));

PropertyFilter.displayName = 'PropertyFilter';

// Badge do filtro
interface FilterBadgeProps {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const FilterBadge = memo(({ children, isActive, onClick }: FilterBadgeProps) => (
    <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center",
            isActive
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300"
        )}
    >
        {children}
    </motion.button>
));

FilterBadge.displayName = 'FilterBadge';

// Componente principal de Destaques com imóveis do Sanity CMS
export function DestaquesSanityCarousel({
    rawProperties,
    title = "Imóveis em Destaque",
    subtitle = "Confira nossas opções selecionadas de imóveis com ótimo potencial em toda Guararema"
}: {
    rawProperties: any[];
    title?: string;
    subtitle?: string;
}) {
    // Estado para filtro de propriedades
    const [activeFilter, setActiveFilter] = useState<PropertyType | 'all'>('all');    // Better error handling during property processing
    const processedProperties = useMemo(() => {
        try {
            // Handle empty or invalid properties gracefully
            if (!rawProperties || !Array.isArray(rawProperties) || rawProperties.length === 0) {
                console.log('No properties available to process');
                return [];
            }

            return processProperties(rawProperties);
        } catch (error) {
            console.error('Error processing properties:', error);
            return [];
        }
    }, [rawProperties]);

    // Filtragem de propriedades baseada no filtro ativo with error handling
    const filteredProperties = useMemo(() => {
        try {
            if (activeFilter === 'all') return processedProperties;
            return processedProperties.filter(prop => prop && prop.propertyType === activeFilter);
        } catch (error) {
            console.error('Error filtering properties:', error);
            return [];
        }
    }, [processedProperties, activeFilter]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="container mx-auto py-16 px-4 md:px-6"
        >
            <div className="mb-10">
                <SectionHeader
                    title={
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-amber-500" />
                            <span>{title}</span>
                        </div>
                    }
                    subtitle={subtitle}
                    align="left"
                    className="max-w-3xl"
                    titleClassName="text-3xl md:text-4xl font-bold text-gray-800"
                    subtitleClassName="text-gray-600 mt-2 text-lg"
                />

                <PropertyFilter activeFilter={activeFilter} onChange={setActiveFilter} />
            </div>

            {filteredProperties.length > 0 ? (
                <OptimizedPropertyCarousel
                    properties={filteredProperties}
                    variant="featured"
                    slidesToShow={3}
                    showControls={true}
                    autoplay={true}
                    autoplayInterval={6000}
                    className="pb-8"
                />
            ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-amber-700 mb-2">Nenhum imóvel encontrado</h3>
                    <p className="text-amber-600">Não encontramos imóveis com os critérios de filtro selecionados.</p>
                    <button
                        onClick={() => setActiveFilter('all')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                    >
                        Ver todos os imóveis
                    </button>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <Link href="/imoveis" className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                    Ver todos os imóveis
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.span>
                </Link>
            </div>
        </motion.section>
    );
}

export default DestaquesSanityCarousel;
