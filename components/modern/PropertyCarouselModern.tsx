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
    Heart
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

    const colorScheme = variant === 'sales'
        ? {
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            badge: 'bg-amber-100 text-amber-800'
        }
        : {
            gradient: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            badge: 'bg-emerald-100 text-emerald-800'
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

    if (!properties?.length) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={cn("h-0.5 w-16 bg-gradient-to-r rounded-full", colorScheme.gradient)} />
                            <span className={cn("text-sm font-medium tracking-wide", colorScheme.text)}>
                                {variant === 'sales' ? 'Propriedades disponíveis' : 'Opções para locação'}
                            </span>
                        </div>
                        {title && (
                            <h2 className="text-3xl font-semibold text-gray-800">
                                {title}
                            </h2>
                        )}                        {showViewAll && (
                            <Button variant="ghost" className="group hover:bg-gray-50 p-0">
                                <span className={cn("text-sm font-medium", colorScheme.text)}>
                                    Explorar portfólio completo
                                </span>
                                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {properties.map((property, index) => (<CarouselItem key={property.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">                            <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 shadow-sm">
                            <CardContent className="p-0">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={property.mainImage.url}
                                        alt={property.mainImage.alt}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

                                    {/* Heart Icon */}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => toggleFavorite(property.id)}
                                            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                                        >
                                            <Heart className={cn(
                                                "h-4 w-4",
                                                favorites.has(property.id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-600'
                                            )} />
                                        </button>
                                        <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
                                            <Eye className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Badge */}
                                    <Badge className={cn("absolute top-3 left-3", colorScheme.badge, "border-0 font-medium text-xs")}>
                                        {variant === 'sales' ? 'Venda' : 'Locação'}
                                    </Badge>
                                </div>                                    {/* Content */}                                        <div className="p-5 space-y-3">
                                    {/* Title */}
                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[48px]">
                                        {property.title}
                                    </h3>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn("text-xl font-medium", colorScheme.text)}>
                                            {formatPrice(property.price)}
                                        </span>
                                        {variant === 'rentals' && (
                                            <span className="text-gray-500 text-sm ml-1">/mês</span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="text-xs line-clamp-1">{property.location}</span>
                                    </div>

                                    {/* Features */}
                                    <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                                        {property.area && (
                                            <div className="flex items-center gap-1">
                                                <Square className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {property.area}m²
                                                </span>
                                            </div>
                                        )}
                                        {property.bedrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bed className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {property.bedrooms}
                                                </span>
                                            </div>
                                        )}
                                        {property.bathrooms && (
                                            <div className="flex items-center gap-1">
                                                <Bath className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {property.bathrooms}
                                                </span>
                                            </div>
                                        )}
                                        {property.parkingSpots && (
                                            <div className="flex items-center gap-1">
                                                <Car className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {property.parkingSpots}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}                                            <div className="pt-3">
                                        <Link
                                            href={`/imovel/${property.slug}`}
                                            className={cn(
                                                "w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md transition-all",
                                                "border font-medium text-sm",
                                                variant === 'sales'
                                                    ? "border-amber-600 text-amber-700 hover:bg-amber-50"
                                                    : "border-emerald-600 text-emerald-700 hover:bg-emerald-50",
                                                "hover:shadow-sm"
                                            )}
                                        >
                                            <span>Ver detalhes</span>
                                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>                    <CarouselPrevious className="left-4 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 shadow-lg" />
                    <CarouselNext className="right-4 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 shadow-lg" />
                </Carousel>
            </div>
        </section>
    );
}

export default PropertyCarouselModern;
