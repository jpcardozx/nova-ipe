'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    MapPin,
    BedDouble as Bed,
    Bath,
    Car,
    ArrowUpRight,
    Star,
    Clock,
    Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Property } from '../types/property';

interface EnhancedPropertySectionProps {
    title: string;
    description?: string;
    properties: Property[];
    badge?: string;
    viewAllLink: string;
    viewAllText: string;
    className?: string;
    variant?: 'grid' | 'carousel' | 'featured';
}

// Componente de card de propriedade aprimorado
function PremiumPropertyCard({ property, index }: { property: Property; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    // Formatação de preço
    const formatPrice = (price: number): string => {
        if (property.propertyType === 'rent') {
            return `R$ ${price.toLocaleString('pt-BR')}/mês`;
        } else {
            return `R$ ${price.toLocaleString('pt-BR')}`;
        }
    };
    // Removido motion.div e useInView do card, animação só no container
    return (
        <div
            className={`relative group transition-all duration-500 ease-out ${isHovered ? 'shadow-xl shadow-amber-900/10 scale-[1.02]' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-xl bg-white shadow-md">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {property.isPremium && (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                        </span>
                    )}
                    {property.isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-500 text-white rounded-full">
                            Novo
                        </span>
                    )}
                    {property.propertyType === 'rent' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                            Aluguel
                        </span>
                    ) : property.propertyType === 'sale' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-500 text-white rounded-full">
                            Venda
                        </span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
                            Destaque
                        </span>
                    )}
                </div>

                {/* Imagem */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={property.mainImage?.url || '/images/placeholder-property.jpg'}
                        alt={property.mainImage?.alt || property.title}
                        fill
                        className={`
              object-cover transition-all duration-700
              ${isHovered ? 'scale-105 filter contrast-110' : ''}
            `}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                    />
                    <div className={`
            absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
            transition-opacity duration-500
            ${isHovered ? 'opacity-70' : 'opacity-50'}
          `} />
                </div>

                {/* Conteúdo */}
                <div className="relative z-10 p-5">                    <div className="flex items-center text-gray-500 text-xs mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>
                        {typeof property.location === 'object'
                            ? `${property.location.neighborhood || ''}${property.location.city ? `, ${property.location.city}` : ''}`
                            : property.location}
                    </span>
                </div>

                    <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                        {property.title}
                    </h3>

                    <div className="flex justify-between items-baseline">
                        <p className="text-amber-700 font-bold text-xl mb-3">
                            {formatPrice(property.price)}
                        </p>
                        {property.isPremium && (
                            <div className="flex items-center text-amber-600">
                                <Sparkles className="w-4 h-4 mr-1" />
                                <span className="text-xs">Exclusivo</span>
                            </div>
                        )}
                    </div>

                    {/* Características */}
                    <div className="flex items-center gap-3 text-gray-600 text-sm border-t border-gray-100 pt-3">
                        {property.bedrooms && (
                            <div className="flex items-center">
                                <Bed className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{property.bedrooms}</span>
                            </div>
                        )}

                        {property.bathrooms && (
                            <div className="flex items-center">
                                <Bath className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{property.bathrooms}</span>
                            </div>
                        )}

                        {property.area && (
                            <div className="flex items-center">
                                <span className="text-gray-400 mr-1 text-xs">m²</span>
                                <span>{property.area}</span>
                            </div>
                        )}

                        {property.parkingSpots && (
                            <div className="flex items-center">
                                <Car className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{property.parkingSpots}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Link overlay */}
                <Link
                    href={`/imovel/${property.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver detalhes de ${property.title}`}
                >
                    <span className="sr-only">Ver detalhes</span>
                </Link>

                {/* Call to action no hover */}
                <div className={`
          absolute bottom-0 right-0 m-4 
          bg-amber-600 text-white p-2 rounded-full
          transform transition-all duration-500 ease-out
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

export default function EnhancedPropertySection({
    title,
    description,
    properties,
    badge,
    viewAllLink,
    viewAllText,
    className,
    variant = 'grid'
}: EnhancedPropertySectionProps) {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.2 });

    const filterCategories = [
        { id: 'all', label: 'Todos' },
        { id: 'premium', label: 'Premium' },
        { id: 'new', label: 'Novos' },
    ];

    // Filtragem de propriedades
    const filteredProperties = properties.filter(property => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'premium') return property.isPremium;
        if (activeFilter === 'new') return property.isNew;
        return true;
    });

    // Controle do carousel
    const totalSlides = Math.ceil(filteredProperties.length / 3);

    const nextSlide = () => {
        setCurrentSlide(current => (current + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide(current => (current - 1 + totalSlides) % totalSlides);
    };

    // Animações
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section
            ref={containerRef}
            className={cn(
                "py-20 bg-gradient-to-br from-slate-50 to-amber-50/50 overflow-hidden",
                className
            )}
        >
            <div className="container mx-auto px-4">
                {/* Cabeçalho */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="md:max-w-2xl"
                    >
                        {badge && (
                            <motion.span
                                variants={titleVariants}
                                className="inline-block px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full mb-4"
                            >
                                {badge}
                            </motion.span>
                        )}

                        <motion.h2
                            variants={titleVariants}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                        >
                            {title}
                        </motion.h2>

                        {description && (
                            <motion.p
                                variants={titleVariants}
                                className="text-gray-600 text-lg"
                            >
                                {description}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Filtros e link para todos */}
                    <motion.div
                        className="flex flex-col md:flex-row md:items-center gap-4 mt-6 md:mt-0"
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex gap-2">
                            {variant !== 'carousel' && (
                                <div className="flex flex-wrap gap-2">
                                    {filterCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveFilter(category.id)}
                                            className={cn(
                                                "px-3 py-1 text-sm rounded-full transition-all",
                                                activeFilter === category.id
                                                    ? "bg-amber-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            {category.id === 'premium' && <Star className="w-3 h-3 inline mr-1" />}
                                            {category.id === 'new' && <Clock className="w-3 h-3 inline mr-1" />}
                                            {category.id === 'all' && <Filter className="w-3 h-3 inline mr-1" />}
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href={viewAllLink}
                            className="group flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors ml-2"
                        >
                            <span>{viewAllText}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                {/* Grid de propriedades */}
                {variant === 'grid' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {filteredProperties.map((property, index) => (
                            <PremiumPropertyCard
                                key={property.id}
                                property={property}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Carousel de propriedades */}
                {variant === 'carousel' && (
                    <div className="relative overflow-hidden">
                        {/* Apenas animação no container do carousel, não nos cards */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                ref={carouselRef}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {filteredProperties
                                    .slice(currentSlide * 3, (currentSlide + 1) * 3)
                                    .map((property, index) => (
                                        <PremiumPropertyCard
                                            key={property.id}
                                            property={property}
                                            index={index}
                                        />
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-end gap-2 mt-8">
                            <button
                                onClick={prevSlide}
                                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                aria-label="Próximo"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Versão "featured" especial */}
                {variant === 'featured' && filteredProperties.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Propriedade destaque maior */}
                        <div
                            className="lg:col-span-6 transition-all duration-700"
                            style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)' }}
                        >
                            <div className="relative overflow-hidden rounded-xl bg-white shadow-xl h-full">
                                {/* Badges */}
                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                    {filteredProperties[0].isPremium && (
                                        <span className="px-3 py-1 text-sm font-medium bg-amber-500 text-white rounded-full flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Destaque Premium
                                        </span>
                                    )}
                                </div>

                                {/* Imagem */}
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={filteredProperties[0].mainImage?.url || '/images/placeholder-property.jpg'}
                                        alt={filteredProperties[0].mainImage?.alt || filteredProperties[0].title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Conteúdo sobreposto */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">                                    <div className="flex items-center text-amber-200 text-sm mb-2">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>
                                        {typeof filteredProperties[0].location === 'object'
                                            ? `${filteredProperties[0].location.neighborhood || ''}${filteredProperties[0].location.city ? `, ${filteredProperties[0].location.city}` : ''}`
                                            : filteredProperties[0].location}
                                    </span>
                                </div>

                                    <h3 className="text-2xl font-bold mb-2">
                                        {filteredProperties[0].title}
                                    </h3>

                                    <p className="text-2xl font-bold text-amber-300 mb-4">
                                        {filteredProperties[0].propertyType === 'rent'
                                            ? `R$ ${filteredProperties[0].price.toLocaleString('pt-BR')}/mês`
                                            : `R$ ${filteredProperties[0].price.toLocaleString('pt-BR')}`
                                        }
                                    </p>

                                    {/* Características */}
                                    <div className="flex items-center gap-4 text-gray-300">
                                        {filteredProperties[0].bedrooms && (
                                            <div className="flex items-center">
                                                <Bed className="w-5 h-5 mr-2 text-amber-200" />
                                                <span>{filteredProperties[0].bedrooms} Quartos</span>
                                            </div>
                                        )}

                                        {filteredProperties[0].bathrooms && (
                                            <div className="flex items-center">
                                                <Bath className="w-5 h-5 mr-2 text-amber-200" />
                                                <span>{filteredProperties[0].bathrooms} Banheiros</span>
                                            </div>
                                        )}

                                        {filteredProperties[0].area && (
                                            <div className="flex items-center">
                                                <span className="text-amber-200 mr-2">m²</span>
                                                <span>{filteredProperties[0].area} m²</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/imovel/${filteredProperties[0].slug}`}
                                        className="mt-5 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 transition-colors text-white px-4 py-2 rounded-lg"
                                    >
                                        Ver detalhes
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <Link
                                    href={`/imovel/${filteredProperties[0].slug}`}
                                    className="absolute inset-0 z-10"
                                    aria-label={`Ver detalhes de ${filteredProperties[0].title}`}
                                >
                                    <span className="sr-only">Ver detalhes</span>
                                </Link>
                            </div>
                        </div>

                        {/* Grid de propriedades secundárias */}
                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProperties.slice(1, 5).map((property, index) => (
                                    <PremiumPropertyCard
                                        key={property.id}
                                        property={property}
                                        index={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
