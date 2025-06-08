"use client"

import React, { useState, memo, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    Heart,
    Eye,
    ArrowRight,
    Star,
    Sparkles,
    Award,
    Clock,
    TrendingUp,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { novaIpeColors } from '@/app/utils/nova-ipe-gradients'

interface PropertyImage {
    url: string
    alt?: string
}

interface PremiumPropertyCardOptimizedProps {
    id: string
    title: string
    price: number
    address: string
    location?: string
    images: PropertyImage[]
    mainImage?: PropertyImage
    bedrooms?: number
    bathrooms?: number
    area?: number
    parkingSpots?: number
    type?: 'sale' | 'rent'
    tags?: string[]
    featured?: boolean
    isNew?: boolean
    isPremium?: boolean
    exclusive?: boolean
    trend?: string
    className?: string
    variant?: 'default' | 'compact' | 'featured' | 'hero'
    onFavoriteToggle?: (id: string) => void
    isFavorited?: boolean
}

const PremiumPropertyCardOptimized = memo<PremiumPropertyCardOptimizedProps>(({
    id,
    title,
    price,
    address,
    location,
    images = [],
    mainImage,
    bedrooms,
    bathrooms,
    area,
    parkingSpots,
    type = 'sale',
    tags = [],
    featured = false,
    isNew = false,
    isPremium = false,
    exclusive = false,
    trend,
    className,
    variant = 'default',
    onFavoriteToggle,
    isFavorited = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [isTouching, setIsTouching] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const displayImage = mainImage || images[0];
    const allImages = mainImage ? [mainImage, ...images] : images;
    const hasMultipleImages = allImages.length > 1;

    // Responsive handling
    useEffect(() => {
        const checkSize = () => {
            if (cardRef.current) {
                const width = cardRef.current.clientWidth;
                if (width < 300) {
                    cardRef.current.classList.add('xs-card');
                } else {
                    cardRef.current.classList.remove('xs-card');
                }
            }
        };

        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // Price formatting
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);

    // Handle image navigation
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
        setIsTouching(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isTouching) return;

        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50 && hasMultipleImages) {
            if (diff > 0) {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            } else {
                setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
            }
            setIsTouching(false);
        }
    };

    const handleTouchEnd = () => {
        setIsTouching(false);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        }
    };

    // Render badges with better accessibility and mobile optimization
    const renderBadges = () => {
        return (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 max-w-[80%]">
                {isNew && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50/95 border border-emerald-200/50 text-emerald-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Clock className="w-2.5 h-2.5" />
                        <span className="hidden xs:inline">Novo</span>
                    </motion.div>
                )}

                {featured && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50/95 border border-amber-200/50 text-amber-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span className="hidden xs:inline">Destaque</span>
                    </motion.div>
                )}

                {isPremium && !featured && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50/95 border border-blue-200/50 text-blue-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Star className="w-2.5 h-2.5" />
                        <span className="hidden xs:inline">Premium</span>
                    </motion.div>
                )}

                {exclusive && !featured && !isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50/95 border border-purple-200/50 text-purple-700 text-xs font-medium shadow-sm backdrop-blur-sm"
                    >
                        <Award className="w-2.5 h-2.5" />
                        <span className="hidden xs:inline">Exclusivo</span>
                    </motion.div>
                )}
            </div>
        );
    };

    // Render action buttons with improved mobile experience
    const renderActionButtons = () => (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            {onFavoriteToggle && (
                <motion.button
                    onClick={handleFavorite}
                    className={cn(
                        "p-2 sm:p-2.5 rounded-lg backdrop-blur-sm border transition-all duration-300 shadow-sm hover:shadow-md",
                        isFavorited
                            ? "bg-red-50/95 text-red-600 border-red-200/50 hover:bg-red-100/95"
                            : "bg-white/90 hover:bg-white text-gray-600 border-gray-200/50 hover:text-red-500"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isFavorited && "fill-current")} />
                </motion.button>
            )}

            <motion.button
                className="p-2 sm:p-2.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visualização rápida"
            >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.button>
        </div>
    );

    // Render image navigation arrows (visible when hover or on touch devices)
    const renderImageNav = () => {
        if (!hasMultipleImages) return null;

        return (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 touch-manipulation">
                <motion.button
                    onClick={prevImage}
                    className="p-1.5 sm:p-2.5 rounded-full bg-white/80 text-gray-800 hover:bg-white hover:text-gray-900 shadow-md backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Imagem anterior"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                <motion.button
                    onClick={nextImage}
                    className="p-1.5 sm:p-2.5 rounded-full bg-white/80 text-gray-800 hover:bg-white hover:text-gray-900 shadow-md backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Próxima imagem"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
            </div>
        );
    };

    // Render property features with adaptive display
    const renderFeatures = () => (
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
            {bedrooms !== undefined && (
                <div className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{bedrooms}</span>
                </div>
            )}

            {bathrooms !== undefined && (
                <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{bathrooms}</span>
                </div>
            )}

            {parkingSpots !== undefined && (
                <div className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{parkingSpots}</span>
                </div>
            )}

            {area && (
                <div className="flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{area}m²</span>
                </div>
            )}
        </div>
    );

    // Render image indicators with enhanced accessibility
    const renderImageIndicators = () => {
        if (!hasMultipleImages) return null;

        return (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                {allImages.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300",
                            currentImageIndex === index
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/60 hover:bg-white/80"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                        }}
                        aria-label={`Ver imagem ${index + 1} de ${allImages.length}`}
                    />
                ))}
            </div>
        );
    };

    // Get variant-specific classes with responsive adjustments
    const getVariantClasses = () => {
        switch (variant) {
            case 'compact':
                return {
                    container: "h-[360px] sm:h-80",
                    image: "h-36 sm:h-44",
                    content: "p-3 sm:p-4"
                };
            case 'featured':
                return {
                    container: "h-[420px] sm:h-[450px]",
                    image: "h-52 sm:h-64",
                    content: "p-4 sm:p-6"
                };
            case 'hero':
                return {
                    container: "h-[450px] sm:h-[520px]",
                    image: "h-60 sm:h-80",
                    content: "p-5 sm:p-8"
                };
            default:
                return {
                    container: "h-[400px] sm:h-[440px]",
                    image: "h-48 sm:h-52",
                    content: "p-4 sm:p-5"
                };
        }
    };

    const variantClasses = getVariantClasses();

    return (
        <motion.div
            ref={cardRef}
            className={cn(
                "group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 flex flex-col",
                variantClasses.container,
                isHovered && "shadow-xl border-amber-200/80 -translate-y-1 sm:-translate-y-2",
                "hover:shadow-xl hover:border-amber-200/80 hover:-translate-y-1 sm:hover:-translate-y-2",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
                boxShadow: isHovered
                    ? `0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 0 20px -5px ${novaIpeColors.primary.ipe}15`
                    : `0 6px 15px -3px rgba(0, 0, 0, 0.08), 0 3px 6px -2px rgba(0, 0, 0, 0.03)`
            }}
        >
            <Link href={`/imovel/${id}`} className="flex-1 flex flex-col">
                {/* Image Container with touch support */}
                <div
                    className={cn("relative overflow-hidden", variantClasses.image)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="relative w-full h-full"
                            initial={{ opacity: 0.8, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.8, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Image
                                src={allImages[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
                                alt={allImages[currentImageIndex]?.alt || title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                quality={80}
                                priority={featured}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Subtle gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {renderBadges()}
                    {renderActionButtons()}
                    {renderImageNav()}
                    {renderImageIndicators()}

                    {/* Type badge */}
                    <div className="absolute bottom-3 right-3 z-20">
                        <span className={cn(
                            "px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium backdrop-blur-md border shadow-sm",
                            type === 'sale'
                                ? "bg-emerald-500/90 text-white border-emerald-400/30"
                                : "bg-blue-500/90 text-white border-blue-400/30"
                        )}>
                            {type === 'sale' ? 'VENDA' : 'ALUGUEL'}
                        </span>
                    </div>
                </div>

                {/* Content with responsive layout */}
                <div className={cn("flex-1 flex flex-col", variantClasses.content)}>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                            {location || address}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-primary-dark transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Features */}
                    <div className="mb-3 sm:mb-4">
                        {renderFeatures()}
                    </div>

                    {/* Price and trend */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                {formattedPrice}
                            </div>
                            {trend && (
                                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    {trend}
                                </div>
                            )}
                        </div>

                        {/* Call to action */}
                        <div
                            className={cn(
                                "flex items-center justify-between text-primary-dark font-medium transition-opacity duration-300",
                                isHovered ? "opacity-100" : "opacity-0 sm:opacity-60"
                            )}
                        >
                            <span className="text-xs sm:text-sm">Ver detalhes</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});

PremiumPropertyCardOptimized.displayName = 'PremiumPropertyCardOptimized';

export default PremiumPropertyCardOptimized;
