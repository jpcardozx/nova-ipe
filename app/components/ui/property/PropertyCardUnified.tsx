'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    ArrowRight,
    BedDouble,
    Bath,
    Car,
    Ruler as Scale,
    Heart,
    Tag,
    Home,
    Calendar,
} from 'lucide-react';
import { cn, formatarMoeda, formatarArea } from '@/lib/utils';
import SanityImage from '@/app/components/SanityImage';
import { PropertyType, PropertyImage, BasePropertyProps } from './types';
import { extractSlugString } from '@/app/PropertyTypeFix';

export interface PropertyCardUnifiedProps extends BasePropertyProps {
    mainImage: PropertyImage;
    className?: string;
    onClick?: () => void;
    onFavoriteToggle?: (id: string) => void;
}

// Badge consolidado e reutilizável
const Badge = ({
    variant = 'primary',
    children,
    className,
}: {
    variant?: 'primary' | 'secondary' | 'highlight' | 'new' | 'premium';
    children: React.ReactNode;
    className?: string;
}) => {
    const variantStyles = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-emerald-500 text-white',
        highlight: 'bg-amber-500 text-white',
        new: 'bg-teal-500 text-white',
        premium: 'bg-purple-500 text-white',
    };

    return (
        <span
            className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

// Componente Feature reutilizável
const Feature = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
}) => {
    if (!value) return null;

    return (
        <div className="flex items-center gap-2 group">
            <div className="p-1.5 bg-stone-100 rounded-md text-stone-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">{label}</p>
                <p className="text-sm font-medium text-stone-700">{value}</p>
            </div>
        </div>
    );
};

// Formatador de preços
const formatPrice = (price: number, propertyType: PropertyType): string => {
    if (!price) return 'Sob consulta';
    const formattedPrice = formatarMoeda(price);
    return propertyType === 'rent' ? `${formattedPrice}/mês` : formattedPrice;
};

const PropertyCardUnified: React.FC<PropertyCardUnifiedProps> = ({
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
    isHighlight = false,
    isNew = false,
    isPremium = false,
    isFavorite: externalFavorite,
    className,
    onClick,
    onFavoriteToggle,
}) => {
    // Estados locais
    const [favorite, setFavorite] = useState(externalFavorite || false);
    const [loaded, setLoaded] = useState(false);

    // Formatação e preparação de dados
    const formattedPrice = useMemo(() => formatPrice(price, propertyType), [price, propertyType]);
    const fullLocation = useMemo(() =>
        [location, city].filter(Boolean).join(', '),
        [location, city]
    );

    // Determinar URL da imagem
    const imageUrl = useMemo(() => {
        if (mainImage?.url) return mainImage.url;
        if (mainImage?.imagemUrl) return mainImage.imagemUrl;
        return '/images/placeholder-property.jpg';
    }, [mainImage]);

    // Handler para favoritos
    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = !favorite;
        setFavorite(newState);

        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        }

        // Salvar no localStorage
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];

            if (newState && !favorites.includes(id)) {
                favorites.push(id);
            } else if (!newState) {
                const index = favorites.indexOf(id);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
            }

            localStorage.setItem('property-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Erro ao salvar favoritos:', error);
        }
    };

    // Variantes de animação
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        hover: { y: -5, transition: { duration: 0.2 } }
    };

    const url = `/imovel/${extractSlugString(slug)}`;

    return (
        <motion.div
            className={cn(
                'group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300',
                'border border-stone-200',
                isHighlight ? 'ring-2 ring-amber-200' : '',
                isPremium ? 'border-amber-300' : '',
                className
            )}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <Link href={url} className="flex flex-col h-full">
                {/* Seção da imagem */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    {!loaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse" />
                    )}

                    {mainImage?.sanityImage ? (
                        <SanityImage
                            image={mainImage.sanityImage}
                            alt={mainImage.alt || title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onLoad={() => setLoaded(true)}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt={mainImage?.alt || title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onLoad={() => setLoaded(true)}
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {propertyType === 'rent' ? (
                            <Badge variant="primary">
                                <Scale className="w-3.5 h-3.5" />
                                Aluguel
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                <Home className="w-3.5 h-3.5" />
                                Venda
                            </Badge>
                        )}

                        {isNew && (
                            <Badge variant="new">
                                <Calendar className="w-3.5 h-3.5" />
                                Novo
                            </Badge>
                        )}

                        {isHighlight && (
                            <Badge variant="highlight">
                                <Tag className="w-3.5 h-3.5" />
                                Destaque
                            </Badge>
                        )}
                    </div>

                    {/* Botão de favorito */}
                    <button
                        onClick={handleFavoriteToggle}
                        className={cn(
                            'absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm z-10',
                            'transition-all hover:scale-110 hover:shadow-md'
                        )}
                        aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Heart
                            className={cn(
                                'w-5 h-5 transition-colors',
                                favorite ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                            )}
                        />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="flex flex-col flex-grow p-5">
                    {/* Preço */}
                    <div className="mb-2">
                        <h3 className={cn(
                            'text-xl font-semibold',
                            propertyType === 'rent' ? 'text-blue-700' : 'text-emerald-700'
                        )}>
                            {formattedPrice}
                        </h3>
                    </div>

                    {/* Título */}
                    <h2 className="text-lg font-medium text-stone-900 mb-2 line-clamp-2">
                        {title}
                    </h2>

                    {/* Localização */}
                    {fullLocation && (
                        <div className="flex items-center text-stone-600 mb-4 text-sm">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{fullLocation}</span>
                        </div>
                    )}

                    {/* Características */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        {area && (
                            <Feature
                                icon={<Scale className="w-4 h-4" />}
                                label="Área"
                                value={formatarArea(area)}
                            />
                        )}

                        {bedrooms && (
                            <Feature
                                icon={<BedDouble className="w-4 h-4" />}
                                label="Dormitórios"
                                value={bedrooms}
                            />
                        )}

                        {bathrooms && (
                            <Feature
                                icon={<Bath className="w-4 h-4" />}
                                label="Banheiros"
                                value={bathrooms}
                            />
                        )}

                        {parkingSpots && (
                            <Feature
                                icon={<Car className="w-4 h-4" />}
                                label="Vagas"
                                value={parkingSpots}
                            />
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                        <div className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            Quero conhecer este imóvel
                            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// Default export
export default PropertyCardUnified;

// Named export for both import patterns
export { PropertyCardUnified };

// Exports de compatibilidade
export { PropertyCardUnified as PropertyCard };
export type { PropertyCardUnifiedProps as PropertyCardProps };

// Re-export types for backward compatibility
export type { PropertyType, PropertyStatus } from './types';
