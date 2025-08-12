'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    BedDouble,
    Bath,
    Car,
    Home,
    Building2,
    Star,
    Heart,
    Share2,
    Eye,
    Filter,
    Grid3X3,
    LayoutGrid,
    Maximize2,
    TrendingUp,
    Award,
    Sparkles,
    ArrowUpRight,
    Search,
    X,
    SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessedProperty } from '@/app/types/property';

interface PremiumPropertyCatalogProps {
    title: string;
    subtitle?: string;
    properties: ProcessedProperty[];
    badge?: string;
    viewAllLink?: string;
    viewAllText?: string;
    variant?: 'luxury' | 'modern' | 'minimal' | 'premium';
    className?: string;
    maxItems?: number;
    showFilters?: boolean;
    accentColor?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
}

interface PropertyFilters {
    type: string;
    priceRange: string;
    bedrooms: string;
    area: string;
    location: string;
}

// Componente de Card Premium
const PremiumPropertyCard = ({
    property,
    index,
    variant = 'luxury',
    accentColor = 'amber'
}: {
    property: ProcessedProperty;
    index: number;
    variant?: string;
    accentColor?: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.2 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

    // Cores dinâmicas baseadas no accent
    const accentColors = {
        amber: {
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-500',
            text: 'text-amber-600',
            light: 'bg-amber-50',
            ring: 'ring-amber-200'
        },
        emerald: {
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500',
            text: 'text-emerald-600',
            light: 'bg-emerald-50',
            ring: 'ring-emerald-200'
        },
        blue: {
            gradient: 'from-blue-500 to-indigo-500',
            bg: 'bg-blue-500',
            text: 'text-blue-600',
            light: 'bg-blue-50',
            ring: 'ring-blue-200'
        },
        purple: {
            gradient: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-500',
            text: 'text-purple-600',
            light: 'bg-purple-50',
            ring: 'ring-purple-200'
        },
        rose: {
            gradient: 'from-rose-500 to-pink-500',
            bg: 'bg-rose-500',
            text: 'text-rose-600',
            light: 'bg-rose-50',
            ring: 'ring-rose-200'
        }
    };

    const colors = accentColors[accentColor as keyof typeof accentColors];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(price);
    }; const getLocationDisplay = () => {
        return property.location || 'Guararema';
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set(event.clientX - centerX);
        mouseY.set(event.clientY - centerY);
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500",
                "hover:shadow-2xl hover:shadow-black/10",
                variant === 'luxury' && "border border-gray-100",
                variant === 'modern' && "bg-gradient-to-br from-white to-gray-50",
                variant === 'minimal' && "shadow-none border border-gray-200",
                variant === 'premium' && "bg-gradient-to-br from-white via-white to-gray-50/50"
            )}
        >
            {/* Imagem Principal */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={property.mainImage?.url || '/images/property-placeholder.jpg'}
                    alt={property.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700",
                        isHovered && "scale-110"
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay gradiente */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                    "opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-100"
                )} />                {/* Badges no topo */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {property.isHighlight && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${colors.gradient} shadow-lg`}
                        >
                            <Star className="w-3 h-3 fill-current" />
                            Destaque
                        </motion.div>
                    )}
                    {property.isNew && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium text-white bg-emerald-500 shadow-lg">
                            Novo
                        </div>
                    )}
                    {property.isPremium && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium text-white bg-purple-500 shadow-lg">
                            Premium
                        </div>
                    )}
                </div>

                {/* Ações no topo direito */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={cn(
                            "p-2 rounded-full backdrop-blur-sm transition-all",
                            isFavorited
                                ? "bg-red-500 text-white shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Preço sobreposto */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    className="absolute bottom-4 left-4 right-4 z-10"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-2xl font-bold ${colors.text}`}>
                                    {formatPrice(property.price || property.preco || 0)}
                                </p>
                                {property.propertyType === 'rent' && (
                                    <p className="text-sm text-gray-600">/mês</p>
                                )}
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`p-2 rounded-lg ${colors.light}`}
                            >
                                <Eye className={`w-5 h-5 ${colors.text}`} />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6">
                {/* Localização */}
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{getLocationDisplay()}</span>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-gray-700 transition-colors">
                    {property.title}
                </h3>

                {/* Características */}
                <div className="flex items-center gap-4 mb-4">
                    {property.area && (
                        <div className="flex items-center gap-1">
                            <Maximize2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.area}m²</span>
                        </div>
                    )}
                    {property.bedrooms && (
                        <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.bathrooms}</span>
                        </div>
                    )}
                    {property.parkingSpots && (
                        <div className="flex items-center gap-1">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.parkingSpots}</span>
                        </div>
                    )}
                </div>

                {/* Preço (versão desktop) */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-2xl font-bold ${colors.text}`}>
                            {formatPrice(property.price || property.preco || 0)}
                        </p>
                        {property.propertyType === 'rent' && (
                            <p className="text-sm text-gray-500">/mês</p>
                        )}
                    </div>

                    <Link
                        href={`/imoveis/${property.slug}`}
                        className={cn(
                            "group/btn flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                            `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`,
                            "hover:shadow-xl hover:scale-105"
                        )}
                    >
                        <span className="text-sm font-medium">Ver detalhes</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                </div>
            </div>

            {/* Efeito de brilho no hover */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"
            />
        </motion.div>
    );
};

// Componente principal
export default function PremiumPropertyCatalog({
    title,
    subtitle,
    properties,
    badge,
    viewAllLink,
    viewAllText = 'Ver todos os imóveis',
    variant = 'luxury',
    className,
    maxItems = 6,
    showFilters = true,
    accentColor = 'amber'
}: PremiumPropertyCatalogProps) {
    const [filteredProperties, setFilteredProperties] = useState<ProcessedProperty[]>(properties);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState<PropertyFilters>({
        type: 'all',
        priceRange: 'all',
        bedrooms: 'all',
        area: 'all',
        location: 'all'
    });

    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    // Aplicar filtros
    useEffect(() => {
        let results = [...properties];

        if (filters.type !== 'all') {
            results = results.filter(property =>
                property.propertyType?.toLowerCase() === filters.type
            );
        }

        if (filters.bedrooms !== 'all') {
            results = results.filter(property => {
                if (filters.bedrooms === '4+') {
                    return property.bedrooms && property.bedrooms >= 4;
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
                return property.area && property.area >= areaValue && property.area < areaValue + 100;
            });
        }

        setFilteredProperties(results);
    }, [filters, properties]);

    const displayProperties = filteredProperties.slice(0, maxItems);

    // Cores do tema
    const accentColors = {
        amber: {
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-500',
            text: 'text-amber-600',
            light: 'bg-amber-50',
            ring: 'ring-amber-200',
            border: 'border-amber-200'
        },
        emerald: {
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500',
            text: 'text-emerald-600',
            light: 'bg-emerald-50',
            ring: 'ring-emerald-200',
            border: 'border-emerald-200'
        },
        blue: {
            gradient: 'from-blue-500 to-indigo-500',
            bg: 'bg-blue-500',
            text: 'text-blue-600',
            light: 'bg-blue-50',
            ring: 'ring-blue-200',
            border: 'border-blue-200'
        },
        purple: {
            gradient: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-500',
            text: 'text-purple-600',
            light: 'bg-purple-50',
            ring: 'ring-purple-200',
            border: 'border-purple-200'
        },
        rose: {
            gradient: 'from-rose-500 to-pink-500',
            bg: 'bg-rose-500',
            text: 'text-rose-600',
            light: 'bg-rose-50',
            ring: 'ring-rose-200',
            border: 'border-rose-200'
        }
    };

    const colors = accentColors[accentColor];

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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const resetFilters = () => {
        setFilters({
            type: 'all',
            priceRange: 'all',
            bedrooms: 'all',
            area: 'all',
            location: 'all'
        });
    };

    return (
        <section
            ref={sectionRef}
            className={cn(
                "py-20 relative overflow-hidden",
                variant === 'luxury' && "bg-gradient-to-br from-white via-gray-50/30 to-white",
                variant === 'modern' && "bg-gradient-to-br from-slate-50 to-white",
                variant === 'minimal' && "bg-white",
                variant === 'premium' && "bg-gradient-to-br from-amber-50/30 via-white to-gray-50/20",
                className
            )}
        >
            {/* Background decorativo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${colors.gradient} rounded-full opacity-5 blur-3xl`} />
                <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${colors.gradient} rounded-full opacity-5 blur-3xl`} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header da seção */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    {badge && (
                        <motion.div variants={itemVariants} className="mb-4">
                            <span className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                                `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                            )}>
                                <Sparkles className="w-4 h-4" />
                                {badge}
                            </span>
                        </motion.div>
                    )}

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        {title}
                    </motion.h2>

                    {subtitle && (
                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>

                {/* Filtros e controles */}
                {showFilters && (
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={itemVariants}
                        className="mb-12"
                    >
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                {/* Filtros principais */}
                                <div className="flex flex-wrap gap-3 flex-1">
                                    {/* Tipo de propriedade */}
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                        className={cn(
                                            "px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all",
                                            `focus:${colors.ring} focus:border-transparent`
                                        )}
                                    >
                                        <option value="all">Todos os tipos</option>
                                        <option value="sale">À venda</option>
                                        <option value="rent">Para alugar</option>
                                        <option value="featured">Em destaque</option>
                                    </select>

                                    {/* Quartos */}
                                    <select
                                        value={filters.bedrooms}
                                        onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                                        className={cn(
                                            "px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all",
                                            `focus:${colors.ring} focus:border-transparent`
                                        )}
                                    >
                                        <option value="all">Qualquer quarto</option>
                                        <option value="1">1 quarto</option>
                                        <option value="2">2 quartos</option>
                                        <option value="3">3 quartos</option>
                                        <option value="4+">4+ quartos</option>
                                    </select>

                                    {/* Área */}
                                    <select
                                        value={filters.area}
                                        onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                                        className={cn(
                                            "px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-all",
                                            `focus:${colors.ring} focus:border-transparent`
                                        )}
                                    >
                                        <option value="all">Qualquer área</option>
                                        <option value="50">50-100m²</option>
                                        <option value="100">100-200m²</option>
                                        <option value="200">200-300m²</option>
                                        <option value="300+">300m²+</option>
                                    </select>

                                    {/* Botão limpar filtros */}
                                    {(filters.type !== 'all' || filters.bedrooms !== 'all' || filters.area !== 'all') && (
                                        <button
                                            onClick={resetFilters}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Limpar filtros
                                        </button>
                                    )}
                                </div>

                                {/* Controles de visualização */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                        {filteredProperties.length} imóve{filteredProperties.length !== 1 ? 'is' : 'l'}
                                    </span>

                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={cn(
                                                "p-2 rounded-md transition-all",
                                                viewMode === 'grid'
                                                    ? `${colors.bg} text-white shadow-sm`
                                                    : "text-gray-600 hover:text-gray-800"
                                            )}
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={cn(
                                                "p-2 rounded-md transition-all",
                                                viewMode === 'list'
                                                    ? `${colors.bg} text-white shadow-sm`
                                                    : "text-gray-600 hover:text-gray-800"
                                            )}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid de propriedades */}                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className={cn(
                        "grid gap-8 mb-12",
                        viewMode === 'grid'
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 max-w-4xl mx-auto"
                    )}
                >
                    {displayProperties.map((property, index) => (
                        <PremiumPropertyCard
                            key={property.id}
                            property={property}
                            index={index}
                            variant={variant}
                            accentColor={accentColor}
                        />
                    ))}
                </motion.div>

                {/* Estado vazio */}
                {filteredProperties.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum imóvel encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tente ajustar os filtros para ver mais resultados.
                        </p>
                        <button
                            onClick={resetFilters}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all",
                                `bg-gradient-to-r ${colors.gradient} hover:shadow-lg hover:scale-105`
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            Limpar filtros
                        </button>
                    </motion.div>
                )}

                {/* CTA para ver todos */}
                {viewAllLink && filteredProperties.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <Link
                            href={viewAllLink}
                            className={cn(
                                "inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-medium transition-all",
                                `bg-gradient-to-r ${colors.gradient} shadow-lg hover:shadow-xl hover:scale-105`
                            )}
                        >
                            <span>{viewAllText}</span>
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

