'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MapPin,
    BedDouble,
    Bath,
    Car,
    ArrowUpRight,
    Heart,
    Maximize2,
    Tag
} from 'lucide-react';
import { cn, formatarMoeda, formatarArea } from '../../../../lib/utils';
import { Button } from '../../../ui/core/Button';

// Interfaces
export interface PropertyImage {
    url: string;
    alt?: string;
}

export interface PropertyFeature {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'featured';
export type PropertyType = 'sale' | 'rent' | 'seasonal';

export interface PropertyCardProps {
    id: string;
    title: string;
    slug: string;
    location?: string;
    city?: string;
    price: number;
    formattedPrice?: string;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: PropertyImage;
    additionalImages?: PropertyImage[];
    status?: PropertyStatus;
    isNew?: boolean;
    isHighlight?: boolean;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'compact' | 'featured' | 'grid' | 'list';
}

export function PropertyCard({
    id,
    title,
    slug,
    location,
    city,
    price,
    formattedPrice,
    propertyType,
    area,
    bedrooms,
    bathrooms,
    parkingSpots,
    mainImage,
    additionalImages = [],
    status = 'available',
    isNew = false,
    isHighlight = false,
    className,
    onClick,
    variant = 'default',
}: PropertyCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Preparar imagens para galeria
    const allImages = [mainImage, ...additionalImages].slice(0, 5);

    // Formatação de preço
    const displayPrice = formattedPrice || formatarMoeda(price);

    // Localização formatada
    const displayLocation = [location, city].filter(Boolean).join(', ');

    // Features para mostrar
    const features = [
        area && { icon: <Maximize2 size={16} />, label: 'Área', value: formatarArea(area) },
        bedrooms && { icon: <BedDouble size={16} />, label: 'Quartos', value: bedrooms },
        bathrooms && { icon: <Bath size={16} />, label: 'Banheiros', value: bathrooms },
        parkingSpots && { icon: <Car size={16} />, label: 'Vagas', value: parkingSpots }
    ].filter(Boolean) as PropertyFeature[];

    // Status badge config
    const statusConfig = {
        available: { color: 'bg-accent-emerald-500/90', text: 'Disponível' },
        sold: { color: 'bg-accent-red-500/90', text: 'Vendido' },
        reserved: { color: 'bg-neutral-700/90', text: 'Reservado' },
        featured: { color: 'bg-primary-500/90', text: 'Destaque' },
    };

    // Property type badge config
    const propertyTypeConfig = {
        sale: { color: 'text-accent-emerald-600 bg-accent-emerald-50', text: 'Venda' },
        rent: { color: 'text-accent-blue-600 bg-accent-blue-50', text: 'Aluguel' },
        seasonal: { color: 'text-primary-600 bg-primary-50', text: 'Temporada' },
    };

    // Link handler
    const propertyLink = `/imovel/${encodeURIComponent(slug)}`;

    // Favorite toggle handler
    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    // Next image handler
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % allImages.length);
    };

    // Prev image handler
    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <Link href={propertyLink} passHref>
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="block h-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={onClick}
            >
                <div className={cn(
                    "overflow-hidden transition-all duration-300 h-full",
                    "hover:shadow-xl border-neutral-200/80",
                    variant === 'featured' && "sm:flex sm:flex-row",
                    variant === 'list' && "flex flex-row",
                    className
                )}>
                    {/* Imagem do imóvel */}
                    <div className={cn(
                        "relative overflow-hidden aspect-[4/3]",
                        variant === 'compact' ? "h-48" : "h-60",
                        variant === 'featured' && "sm:w-2/5 sm:h-auto",
                        variant === 'list' && "w-1/3 h-auto",
                    )}>
                        <Image
                            src={allImages[currentImage].url}
                            alt={allImages[currentImage].alt || title}
                            className="object-cover transition-transform duration-700 hover:scale-110"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={isHighlight}
                        />

                        {/* Status badge */}
                        {status && status !== 'available' && (
                            <div className={cn(
                                "absolute top-3 left-3 px-3 py-1.5 text-xs font-medium text-white rounded-md shadow-sm",
                                statusConfig[status].color
                            )}>
                                {statusConfig[status].text}
                            </div>
                        )}

                        {/* New property badge */}
                        {isNew && (
                            <div className="absolute top-3 left-3 px-3 py-1.5 text-xs font-medium text-white bg-primary-500/90 rounded-md shadow-sm">
                                Novo
                            </div>
                        )}

                        {/* Favorite button */}
                        <button
                            onClick={toggleFavorite}
                            className={cn(
                                "absolute top-3 right-3 p-2 rounded-full transition-all",
                                "bg-white/80 hover:bg-white shadow-md backdrop-blur-sm",
                                isFavorite ? "text-accent-red-500" : "text-neutral-600"
                            )}
                            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </button>

                        {/* Image gallery controls */}
                        {(additionalImages.length > 0 && isHovering) && (
                            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                                {allImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCurrentImage(idx);
                                        }}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all",
                                            currentImage === idx
                                                ? "bg-white w-4"
                                                : "bg-white/50 hover:bg-white/80"
                                        )}
                                        aria-label={`Ver imagem ${idx + 1} de ${allImages.length}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Property type badge */}
                        <div className={cn(
                            "absolute bottom-3 left-3 px-3 py-1.5 text-xs font-medium rounded-md shadow-sm backdrop-blur-sm",
                            propertyTypeConfig[propertyType].color
                        )}>
                            {propertyTypeConfig[propertyType].text}
                        </div>
                    </div>

                    {/* Conteúdo do card */}
                    <div className={cn(
                        "flex flex-col p-5",
                        variant === 'featured' && "sm:w-3/5",
                        variant === 'list' && "w-2/3",
                    )}>
                        {/* Preço */}
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-lg font-bold text-neutral-900">{displayPrice}</p>
                            {isHighlight && (
                                <span className="flex items-center text-sm font-medium text-primary-500">
                                    <Tag size={14} className="mr-1" />
                                    Destaque
                                </span>
                            )}
                        </div>

                        {/* Título */}
                        <h3 className="text-lg font-semibold line-clamp-2 mb-1 text-neutral-800">
                            {title}
                        </h3>

                        {/* Localização */}
                        {displayLocation && (
                            <div className="flex items-center text-sm text-neutral-600 mb-4">
                                <MapPin size={14} className="mr-1 flex-shrink-0" />
                                <span className="line-clamp-1">{displayLocation}</span>
                            </div>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-auto">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-neutral-700">
                                    <div className="p-1.5 rounded-md bg-neutral-100">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500">{feature.label}</p>
                                        <p className="text-sm font-medium">{feature.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card footer */}
                    {variant !== 'compact' && (
                        <div className="px-5 pb-5 pt-0 mt-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                rightIcon={<ArrowUpRight size={16} />}
                            >
                                Ver detalhes
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}

export default PropertyCard; 