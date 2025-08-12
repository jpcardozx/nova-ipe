'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    Heart,
    Share2,
    Eye,
    ArrowRight,
    Award,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface PropertyImage {
    url: string;
    alt?: string;
    blurDataURL?: string;
}

interface PropertyData {
    id: string;
    title: string;
    slug: string;
    price: number;
    location: string;
    city?: string;
    mainImage: PropertyImage;
    images?: PropertyImage[];
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parkingSpots?: number;
    type: 'sale' | 'rent';
    isNew?: boolean;
    isPremium?: boolean;
    isHighlight?: boolean;
    tags?: string[];
}

interface PropertyShowcaseProps {
    properties: PropertyData[];
    title?: string;
    subtitle?: string;
    description?: string;
    variant?: 'carousel' | 'grid' | 'hero';
    sectionType?: 'sale' | 'rent';
    viewAllLink?: string;
    viewAllText?: string;
    className?: string;
    maxItems?: number;
}

// Design tokens
const designTokens = {
    colors: {
        sale: {
            primary: 'from-emerald-600 to-green-700',
            secondary: 'from-emerald-50 to-green-50',
            accent: 'text-emerald-700',
            border: 'border-emerald-200',
            bg: 'bg-emerald-50'
        },
        rent: {
            primary: 'from-blue-600 to-indigo-700',
            secondary: 'from-blue-50 to-indigo-50',
            accent: 'text-blue-700',
            border: 'border-blue-200',
            bg: 'bg-blue-50'
        }
    },
    animations: {
        card: {
            hover: { y: -8, scale: 1.02 },
            tap: { scale: 0.98 }
        },
        container: {
            initial: { opacity: 0, y: 40 },
            animate: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" as const }
            }
        }
    }
};

// Premium Property Card Component
const PremiumPropertyCard: React.FC<{
    property: PropertyData;
    sectionType?: 'sale' | 'rent';
    variant?: 'default' | 'featured';
    index?: number;
}> = ({ property, sectionType = 'sale', variant = 'default', index = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const colors = designTokens.colors[sectionType];

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(property.price);

    const pricePerM2 = property.area
        ? `R$ ${Math.round(property.price / property.area).toLocaleString('pt-BR')}/m²`
        : null;

    const cardVariants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.6,
                ease: "easeOut" as const
            }
        },
        hover: {
            y: -12,
            scale: 1.03,
            transition: { duration: 0.3, ease: "easeOut" as const }
        }
    };

    const handleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    }, [isFavorited]);

    const handleShare = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: property.title,
                text: `Confira este imóvel: ${property.title}`,
                url: `/imovel/${property.slug}`
            });
        }
    }, [property]);

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100",
                "hover:shadow-2xl hover:border-gray-200 transition-all duration-500",
                variant === 'featured' && "lg:col-span-2 lg:row-span-2"
            )}
        >
            <Link href={`/imovel/${property.slug}`} className="block">
                {/* Image Container */}
                <div className={cn(
                    "relative overflow-hidden",
                    variant === 'featured' ? "h-80 lg:h-96" : "h-56"
                )}>
                    <Image
                        src={property.mainImage.url}
                        alt={property.mainImage.alt || property.title}
                        fill
                        className={cn(
                            "object-cover transition-all duration-700",
                            "group-hover:scale-110"
                        )}
                        blurDataURL={property.mainImage.blurDataURL}
                        placeholder={property.mainImage.blurDataURL ? "blur" : "empty"}
                        onLoad={() => setImageLoaded(true)}
                        sizes={variant === 'featured'
                            ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        }
                    />

                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {property.isNew && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg"
                            >
                                NOVO
                            </motion.span>
                        )}
                        {property.isPremium && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={cn(
                                    "px-3 py-1 bg-gradient-to-r text-white text-xs font-semibold rounded-full shadow-lg",
                                    colors.primary
                                )}
                            >
                                PREMIUM
                            </motion.span>
                        )}
                        {property.isHighlight && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg"
                            >
                                <Award className="w-3 h-3" />
                                DESTAQUE
                            </motion.span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <motion.button
                            onClick={handleFavorite}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                "p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200",
                                isFavorited
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-gray-700 hover:bg-white"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                        </motion.button>
                        <motion.button
                            onClick={handleShare}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 rounded-full shadow-lg backdrop-blur-sm hover:bg-white transition-all duration-200"
                        >
                            <Share2 className="w-4 h-4 text-gray-700" />
                        </motion.button>
                    </div>

                    {/* Price Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-4 right-4"
                    >
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                            <div className={cn("text-lg font-bold", colors.accent)}>
                                {formattedPrice}
                            </div>
                            {property.type === 'rent' && (
                                <div className="text-xs text-gray-500">/mês</div>
                            )}
                            {pricePerM2 && (
                                <div className="text-xs text-gray-500">{pricePerM2}</div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title and Location */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {property.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{property.location}</span>
                        </div>
                    </div>

                    {/* Features */}
                    {(property.bedrooms || property.bathrooms || property.area || property.parkingSpots) && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {property.bedrooms && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <BedDouble className="w-4 h-4 mr-2" />
                                    <span>{property.bedrooms} quarto{property.bedrooms !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            {property.bathrooms && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Bath className="w-4 h-4 mr-2" />
                                    <span>{property.bathrooms} banho{property.bathrooms !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            {property.area && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Ruler className="w-4 h-4 mr-2" />
                                    <span>{property.area}m²</span>
                                </div>
                            )}
                            {property.parkingSpots && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Car className="w-4 h-4 mr-2" />
                                    <span>{property.parkingSpots} vaga{property.parkingSpots !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {property.tags && property.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {property.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        colors.bg,
                                        colors.accent
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <motion.div
                        className="flex items-center justify-between pt-4 border-t border-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center text-gray-500 text-sm">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>Ver detalhes</span>
                        </div>
                        <div className={cn(
                            "flex items-center text-sm font-semibold transition-all duration-200",
                            "group-hover:translate-x-1",
                            colors.accent
                        )}>
                            <span className="mr-2">Saiba mais</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
};

// Main Property Showcase Component
export const PropertyShowcaseSystem: React.FC<PropertyShowcaseProps> = ({
    properties,
    title,
    subtitle,
    description,
    variant = 'carousel',
    sectionType = 'sale',
    viewAllLink,
    viewAllText = "Ver todos os imóveis",
    className,
    maxItems
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);

    const displayProperties = maxItems
        ? properties.slice(0, maxItems)
        : properties;

    const colors = designTokens.colors[sectionType];

    // Auto-play for carousel
    useEffect(() => {
        if (variant === 'carousel' && isAutoPlaying && displayProperties.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % Math.ceil(displayProperties.length / 3));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [variant, isAutoPlaying, displayProperties.length]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(displayProperties.length / 3));
    }, [displayProperties.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(displayProperties.length / 3)) % Math.ceil(displayProperties.length / 3));
    }, [displayProperties.length]);

    if (!displayProperties.length) {
        return (
            <section className={cn("py-20", className)}>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className={cn("p-12 rounded-2xl", colors.secondary)}>
                        <p className="text-gray-600 text-lg">
                            Nenhum imóvel encontrado no momento.
                        </p>
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className={cn(
                                    "inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                                    "bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-105",
                                    colors.primary
                                )}
                            >
                                <span>Explorar imóveis</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <motion.section
            ref={sectionRef}
            className={cn("py-20 overflow-hidden", className)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={designTokens.animations.container}
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                {(title || subtitle || description) && (
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" as const }}
                    >
                        {title && (
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                        {description && (
                            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                {description}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Content based on variant */}
                {variant === 'carousel' && (
                    <div className="relative">
                        {/* Carousel Navigation */}
                        {displayProperties.length > 3 && (
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={prevSlide}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={cn(
                                            "p-3 rounded-full shadow-lg transition-all duration-200",
                                            "bg-white border border-gray-200 hover:border-gray-300",
                                            "text-gray-700 hover:text-gray-900"
                                        )}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        onClick={nextSlide}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={cn(
                                            "p-3 rounded-full shadow-lg transition-all duration-200",
                                            "bg-white border border-gray-200 hover:border-gray-300",
                                            "text-gray-700 hover:text-gray-900"
                                        )}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {currentIndex + 1} de {Math.ceil(displayProperties.length / 3)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Carousel Container */}
                        <div
                            className="overflow-hidden"
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            <motion.div
                                className="flex gap-6"
                                animate={{ x: -currentIndex * (100 / Math.ceil(displayProperties.length / 3)) + '%' }}
                                transition={{ duration: 0.5, ease: "easeOut" as const }}
                            >
                                {Array.from({ length: Math.ceil(displayProperties.length / 3) }).map((_, slideIndex) => (
                                    <div key={slideIndex} className="flex gap-6 min-w-full">
                                        {displayProperties
                                            .slice(slideIndex * 3, (slideIndex + 1) * 3)
                                            .map((property, index) => (
                                                <div key={property.id} className="flex-1">
                                                    <PremiumPropertyCard
                                                        property={property}
                                                        sectionType={sectionType}
                                                        index={index}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}

                {variant === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProperties.map((property, index) => (
                            <PremiumPropertyCard
                                key={property.id}
                                property={property}
                                sectionType={sectionType}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {variant === 'hero' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {displayProperties.slice(0, 1).map((property, index) => (
                            <PremiumPropertyCard
                                key={property.id}
                                property={property}
                                sectionType={sectionType}
                                variant="featured"
                                index={index}
                            />
                        ))}
                        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                            {displayProperties.slice(1, 3).map((property, index) => (
                                <PremiumPropertyCard
                                    key={property.id}
                                    property={property}
                                    sectionType={sectionType}
                                    index={index + 1}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* View All Button */}
                {viewAllLink && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <Link
                            href={viewAllLink}
                            className={cn(
                                "inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300",
                                "bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-105",
                                "group",
                                colors.primary
                            )}
                        >
                            <span>{viewAllText}</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

export default PropertyShowcaseSystem;

