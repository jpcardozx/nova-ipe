'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, CarFront, Maximize2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos
export type PropertyType = 'rent' | 'sale';

interface PropertyCardProps {
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
        blurDataUrl?: string;
    };
    status?: 'available' | 'sold' | 'rented' | 'pending';
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
    className?: string;
    onFavoriteToggle?: (id: string) => void;
    isFavorite?: boolean;
    priority?: boolean;
}

// Função para formatar preço
const formatPrice = (value: number, propertyType: PropertyType) => {
    return propertyType === 'rent'
        ? `R$ ${value.toLocaleString('pt-BR')}/mês`
        : `R$ ${value.toLocaleString('pt-BR')}`;
};

// Função para formatar área
const formatArea = (value: number) => {
    return `${value}m²`;
};

// Componente de Feature - extraído para melhorar performance
// Simplified feature component without motion effects for better performance
const PropertyFeature = memo(({ icon, value }: { icon: React.ReactNode, value: React.ReactNode }) => (
    <div className="flex items-center px-1.5 py-1 rounded-md bg-neutral-50 hover:bg-[#f8f4e3] transition-colors">
        {icon}
        <span className="ml-1">{value}</span>
    </div>
));

PropertyFeature.displayName = 'PropertyFeature';

// Componente de Badge - extraído para melhorar performance
const PropertyBadge = memo(({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full shadow-md backdrop-blur-sm", className)}>
        {children}
    </span>
));

PropertyBadge.displayName = 'PropertyBadge';

// Componente principal otimizado com memo para evitar re-renders desnecessários
const OptimizedPropertyCard = memo(function OptimizedPropertyCard({
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
    onFavoriteToggle,
    isFavorite = false,
    priority = false,
}: PropertyCardProps) {
    const [favorite, setFavorite] = useState(isFavorite);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Caminho completo para a página de detalhes
    const detailsPath = `/imovel/${slug}`;

    // Localização formatada
    const formattedLocation = location + (city ? `, ${city}` : '');

    // Preço formatado
    const formattedPrice = formatPrice(price, propertyType);

    // Handler de favoritos otimizado com evento único
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Update local state for immediate feedback
        setFavorite(!favorite);

        // Callback para estado global se disponível
        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        }
    };

    // Variantes para animação de entrada mais leve
    const cardVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3
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
                "shadow-sm hover:shadow-xl transform hover:-translate-y-1",
                isHighlight && "ring-2 ring-primary-500",
                isPremium && "ring-1 ring-primary-300",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // Usa will-change apenas durante hover para otimizar GPU
            style={{
                willChange: isHovered ? 'transform, box-shadow' : 'auto'
            }}
        >
            <Link href={detailsPath} className="block">
                <div className="relative">                    {/* Container da imagem com proporção fixa e prevenção de CLS */}
                    <div
                        className="aspect-property w-full relative overflow-hidden min-h-image"
                        style={{
                            backgroundColor: '#f0f0f0' // Placeholder background mesmo sem blur data
                        }}
                    >
                        {/* Placeholder de blur para melhor LCP */}
                        {mainImage.blurDataUrl && !imageLoaded && (
                            <div
                                className="absolute inset-0 bg-cover bg-center blur-lg scale-105"
                                style={{ backgroundImage: `url(${mainImage.blurDataUrl})` }}
                                aria-hidden="true"
                            />
                        )}

                        {/* Placeholder animado quando não tem blurDataUrl */}
                        {!mainImage.blurDataUrl && !imageLoaded && (
                            <div className="absolute inset-0 img-placeholder animate-pulse">
                                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
                            </div>
                        )}

                        {/* Gradient overlay para melhor contraste com texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" /><Image
                            src={mainImage.url}
                            alt={mainImage.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={cn(
                                "object-cover transition-transform duration-500",
                                isHovered ? "scale-110" : "scale-100",
                                !imageLoaded && "opacity-0",
                                imageLoaded && "opacity-100"
                            )}
                            onLoad={() => setImageLoaded(true)}
                            priority={priority}
                            loading={priority ? "eager" : "lazy"}
                            placeholder={mainImage.blurDataUrl ? "blur" : "empty"}
                            blurDataURL={mainImage.blurDataUrl}
                        />
                    </div>

                    {/* Status Tags - Position Absolute para não afetar layout */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {isPremium && (
                            <PropertyBadge className="bg-primary-500 text-white">
                                Premium
                            </PropertyBadge>
                        )}

                        {isNew && (
                            <PropertyBadge className="bg-accent-emerald-500 text-white">
                                Novo
                            </PropertyBadge>
                        )}

                        {propertyType === 'rent' && (
                            <PropertyBadge className="bg-accent-blue-500 text-white">
                                Aluguel
                            </PropertyBadge>
                        )}

                        {propertyType === 'sale' && !isPremium && (
                            <PropertyBadge className="bg-primary-500 text-white">
                                Venda
                            </PropertyBadge>
                        )}
                    </div>

                    {/* Favorite Button - Posicionamento absoluto */}
                    <button
                        onClick={handleFavoriteClick}
                        className={cn(
                            "absolute top-4 right-4 p-2.5 z-20 rounded-full transition-all shadow-md",
                            "backdrop-blur-sm transform hover:scale-110 active:scale-100",
                            favorite ? "bg-accent-red-500 text-white" : "bg-white/80 hover:bg-white text-neutral-400"
                        )}
                        aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Heart
                            size={18}
                            className={cn(favorite && "fill-white")}
                        />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                    {/* Título e localização */}
                    <div className="flex flex-col gap-1 mb-3">
                        <h3 className="font-semibold text-lg line-clamp-1 text-neutral-800 group-hover:text-primary-600 transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center text-neutral-600 text-sm">
                            <MapPin size={14} className="mr-1 inline flex-shrink-0" />
                            <span className="line-clamp-1">{formattedLocation}</span>
                        </div>
                    </div>

                    {/* Preço */}
                    <div className="mb-4">
                        <span className="text-xl font-bold text-primary-600">{formattedPrice}</span>
                    </div>

                    {/* Linha separadora */}
                    <div className="h-px bg-neutral-100 w-full my-4" />

                    {/* Características - Renderização condicional apenas dos itens disponíveis */}
                    <div className="flex items-center justify-between gap-2 text-sm text-neutral-500">
                        {area !== undefined && (
                            <PropertyFeature
                                icon={<Maximize2 size={14} className="mr-1 text-primary-500" />}
                                value={formatArea(area)}
                            />
                        )}

                        {bedrooms !== undefined && (
                            <PropertyFeature
                                icon={<BedDouble size={14} className="mr-1 text-primary-500" />}
                                value={bedrooms}
                            />
                        )}

                        {bathrooms !== undefined && (
                            <PropertyFeature
                                icon={<Bath size={14} className="mr-1 text-primary-500" />}
                                value={bathrooms}
                            />
                        )}

                        {parkingSpots !== undefined && (
                            <PropertyFeature
                                icon={<CarFront size={14} className="mr-1 text-primary-500" />}
                                value={parkingSpots}
                            />
                        )}
                    </div>
                </div>

                {/* Overlay para imóveis indisponíveis */}
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
});

OptimizedPropertyCard.displayName = 'OptimizedPropertyCard';

export default OptimizedPropertyCard;
