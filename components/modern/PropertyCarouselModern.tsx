"use client"

import * as React from 'react';
import { ProcessedProperty } from '../../app/types/property';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    Card,
    CardContent,
    Badge,
    Button
} from '../../components/ui/ui';
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Square,
    ArrowRight,
    Eye,
    Heart,
    TrendingUp,
    Clock,
    Star,
    Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCarouselModernProps {
    properties: ProcessedProperty[];
    variant: 'sales' | 'rentals';
    title?: string;
    showViewAll?: boolean;
}

// Usando uma constante com 'const' em vez de 'function' para o componente
const PropertyCarouselModern = ({
    properties,
    variant,
    title,
    showViewAll = true
}: PropertyCarouselModernProps) => {
    const [favorites, setFavorites] = React.useState(new Set<string>());
    const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

    const colorScheme = variant === 'sales'
        ? {
            gradient: 'from-amber-500 via-amber-600 to-orange-700',
            gradientHover: 'from-amber-600 via-orange-600 to-orange-800',
            bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
            text: 'text-amber-700',
            badge: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
            button: 'border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-400',
            shadow: 'shadow-amber-100',
            accent: 'text-amber-600'
        }
        : {
            gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
            gradientHover: 'from-emerald-600 via-teal-600 to-teal-800',
            bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
            text: 'text-emerald-700',
            badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
            button: 'border-emerald-300 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-400',
            shadow: 'shadow-emerald-100',
            accent: 'text-emerald-600'
        };

    const toggleFavorite = (propertyId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(propertyId)) {
                newFavorites.delete(propertyId);
            } else {
                newFavorites.add(propertyId);
            }
            return newFavorites;
        });
    }; const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }; const getPropertyFeatures = (property: ProcessedProperty) => {
        const features = [];

        if (property.area) {
            features.push({
                icon: Square,
                value: `${property.area}m²`,
                label: 'Área'
            });
        }

        if (property.bedrooms || property.quartos) {
            features.push({
                icon: Bed,
                value: property.bedrooms || property.quartos,
                label: 'Quartos'
            });
        }

        if (property.bathrooms) {
            features.push({
                icon: Bath,
                value: property.bathrooms,
                label: 'Banheiros'
            });
        }

        if (property.parkingSpots) {
            features.push({
                icon: Car,
                value: property.parkingSpots,
                label: 'Vagas'
            });
        }

        return features;
    };

    if (!properties?.length) {
        return null;
    } return (
        <section className="py-20 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50/30">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className={cn("h-px w-20 bg-gradient-to-r rounded-full", colorScheme.gradient)} />
                        <div className="flex items-center gap-2">
                            <TrendingUp className={cn("h-5 w-5", colorScheme.accent)} />
                            <span className={cn("text-sm font-semibold tracking-wider uppercase", colorScheme.text)}>
                                {variant === 'sales' ? 'Oportunidades de Investimento' : 'Locações Premium'}
                            </span>
                        </div>
                        <div className={cn("h-px w-20 bg-gradient-to-l rounded-full", colorScheme.gradient)} />
                    </div>

                    {title && (
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
                            {title}
                        </h2>
                    )}

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {variant === 'sales'
                            ? 'Descubra propriedades excepcionais selecionadas pelo nosso time de especialistas.'
                            : 'Encontre o lar perfeito com nossas opções de locação premium e serviço personalizado.'
                        }
                    </p>

                    {showViewAll && (
                        <motion.div
                            className="mt-8"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "group px-8 py-3 rounded-full border-2 transition-all duration-300",
                                    colorScheme.button,
                                    "hover:shadow-lg hover:scale-105"
                                )}
                            >
                                <span className="text-sm font-semibold tracking-wide">
                                    Explorar Portfólio Completo
                                </span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </motion.div>
                    )}
                </motion.div>                {/* Enhanced Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 md:-ml-4">
                        {properties.map((property, index) => {
                            const features = getPropertyFeatures(property);
                            const propertyId = property.id || property._id || '';
                            const isHovered = hoveredCard === propertyId;
                            const isFavorited = favorites.has(propertyId);

                            return (
                                <CarouselItem key={propertyId} className="pl-3 md:pl-4 md:basis-1/3 lg:basis-1/4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        onHoverStart={() => setHoveredCard(propertyId)}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="h-full"
                                    >
                                        <Card className={cn(
                                            "group overflow-hidden transition-all duration-500 border-0 bg-white",
                                            "shadow-lg hover:shadow-2xl",
                                            colorScheme.shadow,
                                            "rounded-2xl h-full flex flex-col"
                                        )}>
                                            <CardContent className="p-0 flex flex-col h-full">
                                                {/* Enhanced Image Container */}
                                                <div className="relative h-72 overflow-hidden rounded-t-2xl">
                                                    <Image
                                                        src={property.mainImage?.url || '/images/property-placeholder.jpg'}
                                                        alt={property.mainImage?.alt || property.title || property.titulo || 'Imóvel'}
                                                        fill
                                                        className="object-cover transition-all duration-700 group-hover:scale-110"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />

                                                    {/* Dynamic Overlay */}
                                                    <div className={cn(
                                                        "absolute inset-0 transition-all duration-500",
                                                        isHovered
                                                            ? `bg-gradient-to-t from-black/60 via-transparent to-black/20`
                                                            : "bg-gradient-to-t from-black/40 via-transparent to-transparent"
                                                    )} />

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                        <motion.button
                                                            onClick={() => toggleFavorite(propertyId)}
                                                            className={cn(
                                                                "p-3 rounded-xl backdrop-blur-md transition-all duration-300",
                                                                isFavorited
                                                                    ? "bg-red-500/90 text-white"
                                                                    : "bg-white/90 hover:bg-white text-gray-700",
                                                                "shadow-lg hover:shadow-xl hover:scale-110"
                                                            )}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Heart className={cn(
                                                                "h-4 w-4 transition-colors",
                                                                isFavorited ? 'fill-current' : ''
                                                            )} />
                                                        </motion.button>
                                                        <motion.button
                                                            className="p-3 rounded-xl bg-white/90 hover:bg-white text-gray-700 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            className="p-3 rounded-xl bg-white/90 hover:bg-white text-gray-700 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Camera className="h-4 w-4" />
                                                        </motion.button>
                                                    </div>

                                                    {/* Enhanced Badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className={cn(
                                                            "px-4 py-2 text-xs font-bold tracking-wider border-0 shadow-lg backdrop-blur-md",
                                                            colorScheme.badge,
                                                            "rounded-full"
                                                        )}>
                                                            {variant === 'sales' ? 'VENDA' : 'LOCAÇÃO'}
                                                        </Badge>
                                                    </div>

                                                    {/* Premium Indicator */}
                                                    {(property.isPremium || property.featured) && (
                                                        <div className="absolute bottom-4 left-4">
                                                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold tracking-wide border-0 shadow-lg rounded-full">
                                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                                PREMIUM
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {/* New Property Indicator */}
                                                    {property.isNew && (
                                                        <div className="absolute bottom-4 right-4">
                                                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 text-xs font-bold tracking-wide border-0 shadow-lg rounded-full">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                NOVO
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>                                                {/* Enhanced Content Section */}
                                                <div className="p-6 flex-1 flex flex-col">
                                                    {/* Title */}
                                                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[56px] mb-4 leading-tight">
                                                        {property.title || property.titulo}
                                                    </h3>

                                                    {/* Price Section */}
                                                    <div className="mb-4">
                                                        <div className="flex items-baseline gap-2 mb-1">
                                                            <span className={cn(
                                                                "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                                                                colorScheme.gradient
                                                            )}>
                                                                {formatPrice(property.price || property.preco || 0)}
                                                            </span>
                                                            {variant === 'rentals' && (
                                                                <span className="text-slate-500 text-sm font-medium">/mês</span>
                                                            )}
                                                        </div>
                                                        {variant === 'sales' && (
                                                            <p className="text-xs text-slate-500 font-medium">
                                                                Valor à vista • Financiamento disponível
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Location */}
                                                    <div className="flex items-center gap-2 text-slate-600 mb-6">
                                                        <div className={cn("p-1.5 rounded-lg", colorScheme.bg)}>
                                                            <MapPin className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-medium line-clamp-1">
                                                            {property.location || property.localizacao}
                                                        </span>
                                                    </div>

                                                    {/* Features Grid */}
                                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                                        {features.slice(0, 4).map((feature, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                                            >
                                                                <div className={cn("p-1.5 rounded-lg", colorScheme.bg)}>
                                                                    <feature.icon className="h-4 w-4 text-slate-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-800">
                                                                        {feature.value}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {feature.label}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* CTA Button */}
                                                    <div className="mt-auto">
                                                        <Link
                                                            href={`/imovel/${typeof property.slug === 'object' ? property.slug?.current : property.slug}`}
                                                            className="block"
                                                        >
                                                            <motion.button
                                                                className={cn(
                                                                    "w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide",
                                                                    "bg-gradient-to-r transition-all duration-300",
                                                                    "shadow-lg hover:shadow-xl",
                                                                    "text-white border-0",
                                                                    isHovered ? colorScheme.gradientHover : colorScheme.gradient,
                                                                    "hover:scale-105 active:scale-95"
                                                                )}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <span className="flex items-center justify-center gap-2">
                                                                    VER DETALHES
                                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                                </span>
                                                            </motion.button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>                    {/* Enhanced Navigation */}
                    <CarouselPrevious className={cn(
                        "left-6 -translate-y-1/2 w-12 h-12 border-2 shadow-xl backdrop-blur-md transition-all duration-300",
                        "bg-white/95 hover:bg-white border-white/50 hover:border-white",
                        "hover:scale-110 hover:shadow-2xl",
                        colorScheme.shadow
                    )} />
                    <CarouselNext className={cn(
                        "right-6 -translate-y-1/2 w-12 h-12 border-2 shadow-xl backdrop-blur-md transition-all duration-300",
                        "bg-white/95 hover:bg-white border-white/50 hover:border-white",
                        "hover:scale-110 hover:shadow-2xl",
                        colorScheme.shadow
                    )} />
                </Carousel>
            </div>
        </section>
    );
}

export default PropertyCarouselModern;
