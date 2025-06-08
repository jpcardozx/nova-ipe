'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bookmark, ChevronLeft } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import type { ProcessedProperty } from '@/app/page';
import { cn } from '@/lib/utils';
import PropertyAdapter from './adapters/PropertyAdapter';

interface PropertySectionProps {
    title: string;
    description?: string;
    properties: ProcessedProperty[];
    badge?: string;
    viewAllLink?: string;
    viewAllText?: string;
    variant?: 'grid' | 'carousel' | 'featured' | 'compact';
    className?: string;
    maxItems?: number;
    showFilters?: boolean;
}

export default function PropertyShowcase({
    title,
    description,
    properties,
    badge,
    viewAllLink,
    viewAllText = 'Ver todos',
    variant = 'grid',
    className,
    maxItems = 6,
    showFilters = false,
}: PropertySectionProps) {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [filteredProperties, setFilteredProperties] = useState<ProcessedProperty[]>(properties);
    const [filters, setFilters] = useState({
        type: 'all',
        bedrooms: 'all',
        area: 'all'
    });

    const carouselRef = useRef<HTMLDivElement>(null);
    const displayItems = filteredProperties.slice(0, maxItems);
    const totalSlides = Math.ceil(filteredProperties.length / (variant === 'compact' ? 3 : 1));

    // Animar quando entrar na tela
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    // Filtrar propriedades
    useEffect(() => {
        let results = [...properties];

        if (filters.type !== 'all') {
            results = results.filter(property =>
                property.propertyType ? property.propertyType.toLowerCase() === filters.type : true
            );
        }

        if (filters.bedrooms !== 'all') {
            results = results.filter(property => {
                if (filters.bedrooms === '3+') {
                    return property.bedrooms && property.bedrooms >= 3;
                }
                return property.bedrooms === parseInt(filters.bedrooms);
            });
        }

        if (filters.area !== 'all') {
            results = results.filter(property => {
                const areaValue = parseInt(filters.area);
                if (filters.area.includes('+')) {
                    return property.area && property.area >= areaValue;
                }
                return property.area && property.area >= areaValue && property.area < areaValue + 50;
            });
        }

        setFilteredProperties(results);
        setActiveIndex(0);
    }, [filters, properties]);

    // Navegar no carrossel
    const handlePrev = () => {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    };

    const handleNext = () => {
        setActiveIndex(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
    };

    // Obter tipos únicos de propriedade para o filtro
    const propertyTypes = ['all', ...new Set(properties.filter(p => p.propertyType).map(p => p.propertyType.toLowerCase()))];

    // Configurações de variantes
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Renderizar filtros
    const renderFilters = () => {
        if (!showFilters) return null;

        return (
            <div className="mb-8 flex flex-wrap gap-4">
                {/* Filtro de tipo */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="all">Todos os tipos</option>
                        {propertyTypes.filter(t => t !== 'all').map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de quartos */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quartos</label>
                    <select
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={filters.bedrooms}
                        onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    >
                        <option value="all">Qualquer</option>
                        <option value="1">1 quarto</option>
                        <option value="2">2 quartos</option>
                        <option value="3+">3+ quartos</option>
                    </select>
                </div>

                {/* Filtro de área */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Área</label>
                    <select
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={filters.area}
                        onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    >
                        <option value="all">Qualquer</option>
                        <option value="50">Até 100m²</option>
                        <option value="100">100-150m²</option>
                        <option value="150">150-200m²</option>
                        <option value="200+">200m²+</option>
                    </select>
                </div>
            </div>
        );
    };

    // Renderizações por variante
    const renderGrid = () => (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {displayItems.map((property, index) => (
                <motion.div key={property.id || index} variants={itemVariants}>
                    <PropertyAdapter property={property} variant="grid" />
                </motion.div>
            ))}

            {filteredProperties.length === 0 && (
                <div className="col-span-full py-12 text-center">
                    <p className="text-gray-500">Nenhuma propriedade encontrada com os filtros selecionados.</p>
                </div>
            )}
        </motion.div>
    );

    const renderCarousel = () => (
        <div className="relative">
            <div className="overflow-hidden" ref={carouselRef}>
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={
                            variant === 'compact'
                                ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                                : "flex flex-col"
                        }
                    >
                        {variant === 'compact' ? (
                            // Renderiza 3 propriedades por slide para carousel compacto
                            filteredProperties
                                .slice(activeIndex * 3, activeIndex * 3 + 3)
                                .map((property, index) => (
                                    <div key={property.id || index}>
                                        <PropertyAdapter property={property} variant="compact" />
                                    </div>
                                ))
                        ) : (                            // Renderiza 1 propriedade por slide para carousel normal
                            <PropertyAdapter
                                property={filteredProperties[activeIndex]}
                                variant={variant === 'featured' ? 'featured' : 'carousel'}
                            />
                        )}

                        {filteredProperties.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">Nenhuma propriedade encontrada com os filtros selecionados.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {totalSlides > 1 && (
                <div className="flex justify-center mt-6 gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={activeIndex === 0}
                        className={`p-2 rounded-full transition ${activeIndex === 0
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-700 bg-white hover:bg-amber-50 border border-gray-200 shadow-sm'
                            }`}
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-1.5">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-colors ${activeIndex === idx ? 'bg-amber-500' : 'bg-gray-300'
                                    }`}
                                aria-label={`Ir para slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={activeIndex === totalSlides - 1}
                        className={`p-2 rounded-full transition ${activeIndex === totalSlides - 1
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-700 bg-white hover:bg-amber-50 border border-gray-200 shadow-sm'
                            }`}
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );

    const renderFeatured = () => (
        <div className="relative">
            <motion.div
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* Propriedade em destaque */}
                {filteredProperties.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-8"
                    >
                        <PropertyAdapter property={filteredProperties[0]} variant="featured" />
                    </motion.div>
                )}

                {/* Lista lateral de propriedades secundárias */}
                <div className="lg:col-span-4 space-y-4">
                    {filteredProperties.slice(1, 4).map((property, index) => (
                        <motion.div key={property.id || index} variants={itemVariants}>
                            <PropertyAdapter property={property} variant="horizontal" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {filteredProperties.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-gray-500">Nenhuma propriedade encontrada com os filtros selecionados.</p>
                </div>
            )}
        </div>
    );

    return (
        <section className={cn("py-16 px-4", className)}>
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold">{title}</h2>
                            {badge && (
                                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-gray-600 max-w-2xl">{description}</p>}
                    </div>

                    {viewAllLink && filteredProperties.length > maxItems && (
                        <Link
                            href={viewAllLink}
                            className="mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors group"
                        >
                            {viewAllText}
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}
                </div>

                {renderFilters()}

                {variant === 'grid' && renderGrid()}
                {(variant === 'carousel' || variant === 'compact') && renderCarousel()}
                {variant === 'featured' && renderFeatured()}

                {viewAllLink && filteredProperties.length > maxItems && (
                    <div className="mt-8 text-center">
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center px-4 py-2 border border-amber-700 text-amber-700 bg-transparent hover:bg-amber-50 rounded-lg transition-colors"
                        >
                            {viewAllText}
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
