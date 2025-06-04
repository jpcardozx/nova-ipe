"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Search } from 'lucide-react';
import PremiumPropertyCard from './PremiumPropertyCard';
import { novaIpeColors, novaIpeGradients } from '../utils/nova-ipe-gradients';

interface Property {
    id: string;
    title: string;
    price: string | number;
    address: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    parkingSpots?: number;
    tags?: string[];
    featured?: boolean;
    new?: boolean;
    exclusive?: boolean;
    type: 'sale' | 'rent';
}

interface PremiumPropertiesSectionProps {
    title: string;
    subtitle?: string;
    properties: Property[];
    type?: 'grid' | 'slider';
    showFilters?: boolean;
}

const PremiumPropertiesSection: React.FC<PremiumPropertiesSectionProps> = ({
    title,
    subtitle,
    properties,
    type = 'grid',
    showFilters = false
}) => {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [isInView, setIsInView] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const sectionRef = useRef<HTMLDivElement>(null);

    // Categorias de filtro
    const filterCategories = [
        { id: 'all', label: 'Todos' },
        { id: 'featured', label: 'Destaques' },
        { id: 'new', label: 'Novos' },
        { id: 'exclusive', label: 'Exclusivos' },
    ];

    // Observe when section comes into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Filtra as propriedades com base no filtro ativo e na pesquisa
    const filteredProperties = properties.filter(property => {
        // Filtro por categoria
        if (activeFilter === 'featured' && !property.featured) return false;
        if (activeFilter === 'new' && !property.new) return false;
        if (activeFilter === 'exclusive' && !property.exclusive) return false;

        // Filtro por pesquisa
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                property.title.toLowerCase().includes(query) ||
                property.address.toLowerCase().includes(query)
            );
        }

        return true;
    });

    // Função para avançar ou retroceder no slider
    const navigateSlider = (direction: 'next' | 'prev') => {
        const maxSlides = Math.ceil(filteredProperties.length / 3) - 1;

        if (direction === 'next') {
            setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
        } else {
            setCurrentSlide(prev => (prev <= 0 ? maxSlides : prev - 1));
        }
    };

    return (
        <motion.section
            ref={sectionRef}
            className="py-16 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho da seção */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div className="mb-6 md:mb-0">
                        <h2
                            className="text-3xl font-bold mb-2"
                            style={{
                                background: novaIpeGradients.textPrimary,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {title}
                        </h2>

                        {subtitle && (
                            <p
                                className="text-lg"
                                style={{ color: novaIpeColors.neutral.charcoal }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Controles de navegação para slider */}
                    {type === 'slider' && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigateSlider('prev')}
                                className="p-2.5 rounded-full border transition-all duration-300 hover:shadow-md"
                                style={{
                                    borderColor: `${novaIpeColors.neutral.charcoal}20`,
                                    background: 'white'
                                }}
                                aria-label="Anterior"
                            >
                                <ChevronLeft
                                    className="w-5 h-5"
                                    style={{ color: novaIpeColors.neutral.charcoal }}
                                />
                            </button>

                            <button
                                onClick={() => navigateSlider('next')}
                                className="p-2.5 rounded-full border transition-all duration-300 hover:shadow-md"
                                style={{
                                    borderColor: `${novaIpeColors.neutral.charcoal}20`,
                                    background: 'white'
                                }}
                                aria-label="Próximo"
                            >
                                <ChevronRight
                                    className="w-5 h-5"
                                    style={{ color: novaIpeColors.neutral.charcoal }}
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* Filtros e pesquisa */}
                {showFilters && (
                    <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {filterCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300`}
                                    style={{
                                        background: activeFilter === category.id
                                            ? (category.id === 'all'
                                                ? novaIpeGradients.buttonPrimary
                                                : category.id === 'featured'
                                                    ? `linear-gradient(135deg, ${novaIpeColors.primary.ipe}, ${novaIpeColors.primary.ipeLight})`
                                                    : category.id === 'new'
                                                        ? `linear-gradient(135deg, ${novaIpeColors.primary.ipeDark}, ${novaIpeColors.primary.ipe})`
                                                        : `linear-gradient(135deg, ${novaIpeColors.earth.brown}, ${novaIpeColors.earth.warmBrown})`)
                                            : 'white',
                                        color: activeFilter === category.id ? 'white' : novaIpeColors.neutral.charcoal,
                                        border: `1px solid ${activeFilter === category.id
                                            ? 'transparent'
                                            : `${novaIpeColors.neutral.charcoal}20`}`,
                                        boxShadow: activeFilter === category.id
                                            ? `0 8px 20px -4px ${novaIpeColors.primary.ipe}30, 0 4px 10px -4px ${novaIpeColors.primary.ipe}20`
                                            : 'none'
                                    }}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar imóveis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-full w-full sm:w-64 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                style={{
                                    borderColor: `${novaIpeColors.neutral.charcoal}20`,
                                    boxShadow: `0 2px 8px ${novaIpeColors.neutral.charcoal}10`,
                                    backgroundColor: 'white',
                                    color: novaIpeColors.neutral.charcoal,
                                }}
                            />
                            <Search
                                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                                style={{ color: novaIpeColors.neutral.warmGray }}
                            />
                        </div>
                    </div>
                )}

                {/* Container de propriedades */}
                {filteredProperties.length === 0 ? (
                    <div
                        className="bg-amber-50/50 border border-amber-100 rounded-xl p-8 text-center"
                        style={{ borderColor: `${novaIpeColors.primary.ipe}30` }}
                    >
                        <h3 className="text-xl font-semibold mb-2" style={{ color: novaIpeColors.primary.ipeDark }}>
                            Nenhum imóvel encontrado
                        </h3>
                        <p className="text-gray-600">
                            Tente ajustar seus filtros ou realizar uma nova busca.
                        </p>
                    </div>
                ) : type === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredProperties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <PremiumPropertyCard {...property} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {filteredProperties
                                    .slice(currentSlide * 3, (currentSlide + 1) * 3)
                                    .map((property) => (
                                        <PremiumPropertyCard key={property.id} {...property} />
                                    ))
                                }
                            </motion.div>
                        </AnimatePresence>

                        {/* Indicadores de página para slider */}
                        <div className="flex justify-center items-center gap-1.5 mt-8">
                            {Array.from({ length: Math.ceil(filteredProperties.length / 3) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                                    style={{
                                        background: currentSlide === index
                                            ? novaIpeColors.primary.ipe
                                            : `${novaIpeColors.neutral.charcoal}20`,
                                        transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)',
                                        boxShadow: currentSlide === index
                                            ? `0 0 0 2px white, 0 0 0 4px ${novaIpeColors.primary.ipe}30`
                                            : 'none'
                                    }}
                                    aria-label={`Página ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Botão "Ver mais" */}
                {filteredProperties.length > 6 && type === 'grid' && (
                    <div className="mt-12 text-center">
                        <motion.a
                            href={activeFilter === 'all' ? '/imoveis' : `/imoveis?filter=${activeFilter}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium relative overflow-hidden group"
                            style={{
                                background: novaIpeGradients.buttonPrimary,
                                color: 'white',
                                boxShadow: `0 10px 25px -5px ${novaIpeColors.primary.ipe}30, 0 8px 15px -6px ${novaIpeColors.primary.ipe}20`
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="absolute inset-0 w-full h-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                                style={{
                                    background: `linear-gradient(45deg, ${novaIpeColors.primary.ipeDark} 0%, ${novaIpeColors.primary.ipe} 100%)`
                                }}
                            />
                            <span className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <span className="absolute inset-0 w-full h-full transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" />
                            <span className="relative z-10">
                                Ver todos os imóveis
                            </span>
                            <ChevronRight className="w-4 h-4 relative z-10" />
                        </motion.a>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default PremiumPropertiesSection;
