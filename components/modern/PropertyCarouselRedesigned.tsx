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
    Camera,
    Home,
    Maximize2,
    Calendar,
    Shield,
    Award,
    Phone,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCarouselRedesignedProps {
    properties: ProcessedProperty[];
    variant: 'sales' | 'rentals';
    title?: string;
    showViewAll?: boolean;
}

const PropertyCarouselRedesigned = ({
    properties,
    variant,
    title,
    showViewAll = true
}: PropertyCarouselRedesignedProps) => {
    const [favorites, setFavorites] = React.useState(new Set<string>());
    const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = React.useState<{ [key: string]: number }>({});

    const colorScheme = variant === 'sales'
        ? {
            primary: 'from-slate-900 via-slate-800 to-slate-900',
            secondary: 'from-amber-500 to-orange-600',
            accent: 'from-amber-400 to-orange-500',
            text: 'text-slate-800',
            textSecondary: 'text-slate-600',
            bg: 'bg-white',
            border: 'border-slate-200',
            shadow: 'shadow-slate-200/50',
            price: 'text-slate-900'
        }
        : {
            primary: 'from-slate-900 via-slate-800 to-slate-900',
            secondary: 'from-emerald-500 to-teal-600',
            accent: 'from-emerald-400 to-teal-500',
            text: 'text-slate-800',
            textSecondary: 'text-slate-600',
            bg: 'bg-white',
            border: 'border-slate-200',
            shadow: 'shadow-slate-200/50',
            price: 'text-slate-900'
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
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPropertyFeatures = (property: ProcessedProperty) => {
        const features = [];

        if (property.area) {
            features.push({
                icon: Square,
                value: `${property.area}m²`,
                label: 'Área Total'
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
    }

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Redesigned Header - More Sophisticated */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-20"
                >
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-300" />
                        <div className="flex items-center gap-3 px-6 py-2 bg-slate-100 rounded-full">
                            <TrendingUp className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium tracking-wide text-slate-700 uppercase">
                                {variant === 'sales' ? 'Portfólio Exclusivo' : 'Locações Premium'}
                            </span>
                        </div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-300" />
                    </div>

                    {title && (
                        <h2 className="text-5xl lg:text-6xl font-light text-slate-900 mb-6 tracking-tight">
                            {title}
                        </h2>
                    )}

                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        {variant === 'sales'
                            ? 'Cada propriedade é cuidadosamente selecionada para oferecer não apenas um lar, mas um investimento sólido para o futuro.'
                            : 'Encontre seu novo lar com nosso serviço personalizado e carteira de propriedades excepcionais em Guararema.'
                        }
                    </p>
                </motion.div>

                {/* Completely Redesigned Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 md:-ml-6">
                        {properties.map((property, index) => {
                            const features = getPropertyFeatures(property);
                            const propertyId = property.id || property._id || '';
                            const isHovered = hoveredCard === propertyId;
                            const isFavorited = favorites.has(propertyId);

                            return (
                                <CarouselItem key={propertyId} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.7,
                                            delay: index * 0.1,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                        onHoverStart={() => setHoveredCard(propertyId)}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        className="h-full"
                                    >
                                        <Card className={cn(
                                            "group overflow-hidden transition-all duration-700 border bg-white",
                                            "hover:shadow-2xl hover:shadow-slate-200/60",
                                            colorScheme.border,
                                            "rounded-2xl h-full flex flex-col",
                                            isHovered && "border-slate-300 scale-[1.02]"
                                        )}>
                                            <CardContent className="p-0 flex flex-col h-full">
                                                {/* Redesigned Image Container - Much More Elegant */}
                                                <div className="relative h-80 overflow-hidden rounded-t-2xl bg-slate-100">
                                                    <Image
                                                        src={property.mainImage?.url || '/images/property-placeholder.jpg'}
                                                        alt={property.mainImage?.alt || property.title || property.titulo || 'Imóvel'}
                                                        fill
                                                        className={cn(
                                                            "object-cover transition-all duration-1000",
                                                            isHovered ? "scale-110 brightness-105" : "scale-100"
                                                        )}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />

                                                    {/* Sophisticated Overlay */}
                                                    <div className={cn(
                                                        "absolute inset-0 transition-all duration-700",
                                                        isHovered
                                                            ? "bg-gradient-to-t from-black/40 via-transparent to-black/10"
                                                            : "bg-gradient-to-t from-black/20 via-transparent to-transparent"
                                                    )} />

                                                    {/* Minimalist Action Buttons */}
                                                    <AnimatePresence>
                                                        {isHovered && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 20 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="absolute top-6 right-6 flex flex-col gap-3"
                                                            >
                                                                <motion.button
                                                                    onClick={() => toggleFavorite(propertyId)}
                                                                    className={cn(
                                                                        "p-3 rounded-full backdrop-blur-xl border transition-all duration-300",
                                                                        isFavorited
                                                                            ? "bg-red-500/90 border-red-400/50 text-white"
                                                                            : "bg-white/90 border-white/50 hover:bg-white text-slate-700",
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
                                                                    className="p-3 rounded-full bg-white/90 border border-white/50 hover:bg-white text-slate-700 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </motion.button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Elegant Type Badge */}
                                                    <div className="absolute top-6 left-6">
                                                        <Badge className={cn(
                                                            "px-4 py-2 text-xs font-medium tracking-wider border-0 backdrop-blur-xl",
                                                            "bg-white/90 text-slate-700 shadow-lg",
                                                            "rounded-full"
                                                        )}>
                                                            {variant === 'sales' ? 'VENDA' : 'LOCAÇÃO'}
                                                        </Badge>
                                                    </div>

                                                    {/* Premium & New Indicators - More Subtle */}
                                                    {(property.isPremium || property.featured) && (
                                                        <div className="absolute bottom-6 left-6">
                                                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 text-xs font-medium tracking-wide border-0 shadow-lg rounded-full backdrop-blur-xl">
                                                                <Star className="h-3 w-3 mr-1.5 fill-current" />
                                                                PREMIUM
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {property.isNew && (
                                                        <div className="absolute bottom-6 right-6">
                                                            <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-3 py-1.5 text-xs font-medium tracking-wide border-0 shadow-lg rounded-full backdrop-blur-xl">
                                                                <Clock className="h-3 w-3 mr-1.5" />
                                                                NOVO
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Completely Redesigned Content - Clean & Sophisticated */}
                                                <div className="p-8 flex-1 flex flex-col">
                                                    {/* Price First - Bold Statement */}
                                                    <div className="mb-6">
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <span className="text-3xl font-light text-slate-900 tracking-tight">
                                                                {formatPrice(property.price || property.preco || 0)}
                                                            </span>
                                                            {variant === 'rentals' && (
                                                                <span className="text-slate-500 text-sm font-light">/mês</span>
                                                            )}
                                                        </div>
                                                        {variant === 'sales' && (
                                                            <p className="text-xs text-slate-500 font-light tracking-wide">
                                                                Financiamento facilitado
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Property Title */}
                                                    <h3 className="text-xl font-light text-slate-900 line-clamp-2 mb-4 leading-relaxed">
                                                        {property.title || property.titulo}
                                                    </h3>

                                                    {/* Location - More Prominent */}
                                                    <div className="flex items-center gap-3 text-slate-600 mb-8">
                                                        <div className="p-2 rounded-lg bg-slate-50">
                                                            <MapPin className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-medium line-clamp-1">
                                                            {property.location || property.localizacao}
                                                        </span>
                                                    </div>

                                                    {/* Features - Cleaner Grid */}
                                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                                        {features.slice(0, 4).map((feature, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors duration-300"
                                                            >
                                                                <div className="p-2 rounded-lg bg-white shadow-sm">
                                                                    <feature.icon className="h-4 w-4 text-slate-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">
                                                                        {feature.value}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 font-light">
                                                                        {feature.label}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Dual CTA - Contact & Details */}
                                                    <div className="mt-auto space-y-3">
                                                        <Link
                                                            href={`/imovel/${typeof property.slug === 'object' ? property.slug?.current : property.slug}`}
                                                            className="block"
                                                        >
                                                            <motion.button
                                                                className={cn(
                                                                    "w-full py-4 px-6 rounded-xl font-medium text-sm tracking-wide",
                                                                    "bg-gradient-to-r transition-all duration-300",
                                                                    "shadow-lg hover:shadow-xl",
                                                                    "text-white border-0",
                                                                    colorScheme.primary,
                                                                    "hover:scale-[1.02] active:scale-95"
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

                                                        <div className="flex gap-3">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 py-3 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                                                            >
                                                                <Phone className="h-4 w-4 mr-2" />
                                                                Ligar
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 py-3 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                                                            >
                                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                                WhatsApp
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>

                    {/* Redesigned Navigation - Minimal & Elegant */}
                    <CarouselPrevious className={cn(
                        "left-8 -translate-y-1/2 w-14 h-14 border shadow-xl backdrop-blur-xl transition-all duration-300",
                        "bg-white/95 hover:bg-white border-white/50 hover:border-slate-200",
                        "hover:scale-110 hover:shadow-2xl text-slate-700"
                    )} />
                    <CarouselNext className={cn(
                        "right-8 -translate-y-1/2 w-14 h-14 border shadow-xl backdrop-blur-xl transition-all duration-300",
                        "bg-white/95 hover:bg-white border-white/50 hover:border-slate-200",
                        "hover:scale-110 hover:shadow-2xl text-slate-700"
                    )} />
                </Carousel>

                {/* Enhanced View All Section */}
                {showViewAll && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-16"
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "group px-12 py-4 rounded-full border-2 transition-all duration-500",
                                "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
                                "hover:shadow-lg hover:scale-105 font-medium tracking-wide"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <Maximize2 className="h-5 w-5" />
                                Explorar Portfólio Completo
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default PropertyCarouselRedesigned;
