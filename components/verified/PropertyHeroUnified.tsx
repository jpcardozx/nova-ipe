'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Share,
    MapPin,
    Tag,
    Maximize2,
    X,
    Twitter,
    Facebook,
    Mail,
    Copy
} from 'lucide-react';
import { cn, formatarMoeda } from '@/lib/utils';
import { Button } from '@/components/ui';
import SanityImage from '@/app/components/SanityImage';
import { PropertyType, PropertyStatus, PropertyImage } from './types';

export * from './types';

export interface PropertyHeroUnifiedProps {
    title: string;
    location: string;
    city?: string;
    state?: string;
    price: number;
    propertyType: PropertyType;
    images: PropertyImage[];
    referenceCode?: string;
    status?: PropertyStatus;
    className?: string;
    onAddToFavorites?: () => void;
    onShare?: () => void;
    onScheduleVisit?: () => void;
    isFavorite?: boolean;
    variant?: 'default' | 'immersive' | 'compact';
    showGallery?: boolean;
    showShareOptions?: boolean;
}

/**
 * PropertyHeroUnified - Componente hero unificado para páginas de propriedade
 * Suporta múltiplas variantes e fontes de imagem (URL direta, Sanity, etc.)
 */
export default function PropertyHeroUnified({
    title,
    location,
    city,
    state,
    price,
    propertyType,
    images = [],
    referenceCode,
    status = 'available',
    className,
    onAddToFavorites,
    onShare,
    onScheduleVisit,
    isFavorite = false,
    variant = 'default',
    showGallery = true,
    showShareOptions = true
}: PropertyHeroUnifiedProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);
    const [viewCount, setViewCount] = useState(0);

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    // Normalizar URLs das imagens
    const normalizedImages = images.map(img => ({
        ...img,
        url: img.url || img.imagemUrl || '',
        alt: img.alt || title
    }));

    const hasValidImages = normalizedImages.length > 0 && normalizedImages[0].url;

    useEffect(() => {
        // Simular contagem de visualizações
        const timer = setTimeout(() => {
            setViewCount(Math.floor(Math.random() * 1000) + 100);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) =>
            prev === normalizedImages.length - 1 ? 0 : prev + 1
        );
    }, [normalizedImages.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? normalizedImages.length - 1 : prev - 1
        );
    }, [normalizedImages.length]);

    const handleFavoriteToggle = useCallback(() => {
        setIsFavoriteState(!isFavoriteState);
        onAddToFavorites?.();
    }, [isFavoriteState, onAddToFavorites]); const handleShare = useCallback(async (platform?: string) => {
        // SSR-safe browser check
        if (typeof window === 'undefined') return;

        const url = window.location.href;
        const text = `Confira este imóvel: ${title} - ${formatarMoeda(price)}`;

        if (platform === 'copy') {
            if ('clipboard' in navigator) {
                await navigator.clipboard.writeText(url);
            }
            setIsShareOpen(false);
            return;
        }

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        }

        onShare?.();
        setIsShareOpen(false);
    }, [title, price, onShare]);

    // Determinar altura baseada na variante
    const heightClass = {
        compact: 'h-64 md:h-80',
        default: 'h-80 md:h-96 lg:h-[500px]',
        immersive: 'h-96 md:h-[600px] lg:h-[700px]'
    }[variant];

    return (
        <>
            <section className={cn(
                "relative overflow-hidden bg-stone-100",
                heightClass,
                className
            )}>
                {/* Imagem Principal */}
                {hasValidImages && (
                    <motion.div
                        className="absolute inset-0"
                        style={{ y: variant === 'immersive' ? y : undefined }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full h-full"
                            >
                                {normalizedImages[currentImageIndex].sanityImage ? (
                                    <SanityImage
                                        image={normalizedImages[currentImageIndex].sanityImage}
                                        alt={normalizedImages[currentImageIndex].alt}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                ) : (
                                    <Image
                                        src={normalizedImages[currentImageIndex].url}
                                        alt={normalizedImages[currentImageIndex].alt}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="100vw" placeholder={normalizedImages[currentImageIndex].blurDataURL ? "blur" : "empty"}
                                        blurDataURL={normalizedImages[currentImageIndex].blurDataURL}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-800/20 to-transparent" />
                    </motion.div>
                )}

                {/* Controles de Navegação */}
                {normalizedImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </>
                )}

                {/* Indicadores de Imagem */}
                {normalizedImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {normalizedImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    index === currentImageIndex
                                        ? "bg-white"
                                        : "bg-white/50 hover:bg-white/75"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Ações superiores */}
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    {showGallery && normalizedImages.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-black/20 hover:bg-black/40 text-white"
                            onClick={() => setIsGalleryOpen(true)}
                        >
                            <Maximize2 className="w-5 h-5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "bg-black/20 hover:bg-black/40 text-white",
                            isFavoriteState && "text-red-500 bg-white/20"
                        )}
                        onClick={handleFavoriteToggle}
                    >
                        <Heart className={cn("w-5 h-5", isFavoriteState && "fill-current")} />
                    </Button>

                    {showShareOptions && (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/20 hover:bg-black/40 text-white"
                                onClick={() => setIsShareOpen(!isShareOpen)}
                            >
                                <Share className="w-5 h-5" />
                            </Button>

                            {/* Menu de compartilhamento */}
                            <AnimatePresence>
                                {isShareOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl p-2 min-w-[200px] z-20"
                                    >
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => handleShare('whatsapp')}
                                                className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg text-left"
                                            >
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">W</span>
                                                </div>
                                                <span className="text-sm">WhatsApp</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('copy')}
                                                className="w-full flex items-center space-x-3 p-2 hover:bg-stone-50 rounded-lg text-left"
                                            >
                                                <Copy className="w-5 h-5 text-stone-600" />
                                                <span className="text-sm">Copiar link</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Informações do imóvel */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Status e referência */}
                        <div className="flex items-center space-x-4 mb-3">
                            {status !== 'available' && (
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium",
                                    status === 'sold' && "bg-red-500",
                                    status === 'rented' && "bg-blue-500",
                                    status === 'reserved' && "bg-yellow-500"
                                )}>
                                    {status === 'sold' && 'Vendido'}
                                    {status === 'rented' && 'Alugado'}
                                    {status === 'reserved' && 'Reservado'}
                                </span>
                            )}

                            {referenceCode && (
                                <span className="text-sm opacity-75">
                                    Ref: {referenceCode}
                                </span>
                            )}

                            {viewCount > 0 && (
                                <div className="flex items-center space-x-1 text-sm opacity-75">
                                    <Eye className="w-4 h-4" />
                                    <span>{viewCount} visualizações</span>
                                </div>
                            )}
                        </div>

                        {/* Título */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                            {title}
                        </h1>

                        {/* Localização */}
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-5 h-5 opacity-75" />
                            <span className="text-lg">
                                {location}
                                {city && `, ${city}`}
                                {state && `, ${state}`}
                            </span>
                        </div>

                        {/* Preço e ações */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Tag className="w-5 h-5 opacity-75" />
                                <span className="text-2xl md:text-3xl font-bold">
                                    {formatarMoeda(price)}
                                    {propertyType === 'rent' && '/mês'}
                                </span>
                            </div>

                            {onScheduleVisit && (
                                <Button
                                    onClick={onScheduleVisit}
                                    className="bg-primary-600 hover:bg-primary-700 text-white"
                                >
                                    Agendar Visita
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal da galeria */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 z-60"
                            onClick={() => setIsGalleryOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
                            {hasValidImages && (
                                <>
                                    <Image
                                        src={normalizedImages[currentImageIndex].url}
                                        alt={normalizedImages[currentImageIndex].alt}
                                        fill
                                        className="object-contain"
                                        sizes="90vw"
                                    />

                                    {normalizedImages.length > 1 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    prevImage();
                                                }}
                                            >
                                                <ChevronLeft className="w-8 h-8" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    nextImage();
                                                }}
                                            >
                                                <ChevronRight className="w-8 h-8" />
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {normalizedImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 p-2 rounded-lg">
                                {normalizedImages.slice(0, 8).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                        className={cn(
                                            "relative w-16 h-12 rounded overflow-hidden border-2",
                                            index === currentImageIndex
                                                ? "border-white"
                                                : "border-transparent hover:border-white/50"
                                        )}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.alt}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                                {normalizedImages.length > 8 && (
                                    <div className="flex items-center justify-center w-16 h-12 bg-black/50 rounded text-white text-xs">
                                        +{normalizedImages.length - 8}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>)}        </AnimatePresence>
        </>
    );
}

