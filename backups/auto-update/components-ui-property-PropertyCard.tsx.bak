'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BedDouble, Bath, CarFront, Maximize2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos
export type PropertyType = 'rent' | 'sale';

export interface PropertyCardProps {
    id: string;
    title: string;
    slug: string;
    location: string;
    city?: string;
    price: number;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
        blurDataUrl?: string; // Para blur placeholder
    };
    status?: 'available' | 'sold' | 'rented' | 'pending';
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
    className?: string;
    onAddToFavorites?: (id: string) => void;
    isFavorite?: boolean;
    priority?: boolean; // Para carregar imagens com prioridade
}

export function PropertyCard({
    id,
    title,
    slug,
    location,
    city,
    price,
    propertyType,
    area,
    bedrooms,
    bathrooms,
    parkingSpots,
    mainImage,
    status = 'available',
    isNew,
    isHighlight,
    isPremium,
    className,
    onAddToFavorites,
    isFavorite = false,
    priority = false,
}: PropertyCardProps) {
    const [favorite, setFavorite] = React.useState(isFavorite);
    const [loaded, setLoaded] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const formatPrice = (value: number) => {
        return propertyType === 'rent'
            ? `R$ ${value.toLocaleString('pt-BR')}/mês`
            : `R$ ${value.toLocaleString('pt-BR')}`;
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Animação de favorito
        setFavorite(!favorite);
        if (onAddToFavorites) {
            onAddToFavorites(id);
        }
    };

    // Variantes para animação de entrada
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.1
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className={cn(
                "group relative rounded-xl overflow-hidden bg-white transition-all",
                "shadow-sm hover:shadow-xl",
                isHighlight && "ring-2 ring-primary-500",
                isPremium && "ring-1 ring-primary-300",
                className
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Link href={`/propriedades/${slug}`} className="block">
                <div className="relative">
                    {/* Container da imagem com proporção fixa */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden">
                        {/* Efeito de blur placeholder */}
                        {mainImage.blurDataUrl && !loaded && (
                            <div
                                className="absolute inset-0 bg-cover bg-center blur-lg scale-105"
                                style={{ backgroundImage: `url(${mainImage.blurDataUrl})` }}
                            />
                        )}

                        {/* Gradient overlay para melhor contraste com texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={cn(
                                "object-cover transition-all duration-700",
                                hovered ? "scale-110" : "scale-100",
                                !loaded && "opacity-0",
                                loaded && "opacity-100"
                            )}
                            onLoad={() => setLoaded(true)}
                            priority={priority}
                            loading={priority ? "eager" : "lazy"}
                        />
                    </div>

                    {/* Status Tags */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {isPremium && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full shadow-md backdrop-blur-sm">
                                <Star size={12} className="fill-white" />
                                <span>Premium</span>
                            </div>
                        )}

                        {isNew && (
                            <span className="px-2.5 py-1 bg-accent-emerald-500 text-white text-xs font-medium rounded-full shadow-md backdrop-blur-sm">
                                Novo
                            </span>
                        )}

                        {propertyType === 'rent' && (
                            <span className="px-2.5 py-1 bg-accent-blue-500 text-white text-xs font-medium rounded-full shadow-md backdrop-blur-sm">
                                Aluguel
                            </span>
                        )}

                        {propertyType === 'sale' && !isPremium && (
                            <span className="px-2.5 py-1 bg-primary-500 text-white text-xs font-medium rounded-full shadow-md backdrop-blur-sm">
                                Venda
                            </span>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        className={cn(
                            "absolute top-4 right-4 p-2.5 z-20 rounded-full transition-all shadow-md",
                            "backdrop-blur-sm hover:scale-110 active:scale-100",
                            favorite ? "bg-accent-red-500 text-white" : "bg-white/80 hover:bg-white text-neutral-400"
                        )}
                        aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={favorite ? 'filled' : 'outline'}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Heart
                                    size={18}
                                    className={cn(favorite && "fill-white")}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                    <div className="flex flex-col gap-1 mb-3">
                        <h3 className="font-semibold text-lg line-clamp-1 text-neutral-800 group-hover:text-primary-600 transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center text-neutral-600 text-sm">
                            <span>{location}</span>
                            {city && <span className="ml-1">, {city}</span>}
                        </div>
                    </div>

                    {/* Preço */}
                    <div className="mb-4">
                        <span className="text-xl font-bold text-primary-600">{formatPrice(price)}</span>
                    </div>

                    {/* Linha separadora */}
                    <div className="h-px bg-neutral-100 w-full my-4" />

                    {/* Características com animações sutis */}
                    <div className="flex items-center justify-between gap-2 text-sm text-neutral-500">
                        {area !== undefined && (
                            <motion.div
                                className="flex items-center px-1.5 py-1 rounded-md bg-neutral-50"
                                whileHover={{ backgroundColor: "#f8f4e3" }}
                            >
                                <Maximize2 size={14} className="mr-1 text-primary-500" />
                                <span>{area}m²</span>
                            </motion.div>
                        )}

                        {bedrooms !== undefined && (
                            <motion.div
                                className="flex items-center px-1.5 py-1 rounded-md bg-neutral-50"
                                whileHover={{ backgroundColor: "#f8f4e3" }}
                            >
                                <BedDouble size={14} className="mr-1 text-primary-500" />
                                <span>{bedrooms}</span>
                            </motion.div>
                        )}

                        {bathrooms !== undefined && (
                            <motion.div
                                className="flex items-center px-1.5 py-1 rounded-md bg-neutral-50"
                                whileHover={{ backgroundColor: "#f8f4e3" }}
                            >
                                <Bath size={14} className="mr-1 text-primary-500" />
                                <span>{bathrooms}</span>
                            </motion.div>
                        )}

                        {parkingSpots !== undefined && (
                            <motion.div
                                className="flex items-center px-1.5 py-1 rounded-md bg-neutral-50"
                                whileHover={{ backgroundColor: "#f8f4e3" }}
                            >
                                <CarFront size={14} className="mr-1 text-primary-500" />
                                <span>{parkingSpots}</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Gradient overlay para quando indisponível */}
                {status !== 'available' && (
                    <div className="absolute inset-0 bg-neutral-800/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
                        <span className="text-lg font-semibold mb-2">
                            {status === 'sold' && "Vendido"}
                            {status === 'rented' && "Alugado"}
                            {status === 'pending' && "Reservado"}
                        </span>
                        {status === 'pending' && (
                            <span className="text-sm opacity-90">
                                Entre em contato para mais informações
                            </span>
                        )}
                    </div>
                )}
            </Link>
        </motion.div>
    );
} 