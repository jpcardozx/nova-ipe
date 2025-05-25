'use client';

import React, { useState } from 'react';
import { PropertyCard, PropertyCardProps } from '@/components/ui/property/PropertyCard';
import { cn } from '../../../../lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyCarouselProps {
    properties: Omit<PropertyCardProps, 'onClick'>[];
    title?: string;
    subtitle?: string;
    className?: string;
    itemClassName?: string;
    variant?: 'default' | 'compact' | 'featured';
    showControls?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    slidesToShow?: number;
}

// Define a basic Carousel component since we don't have access to the original
const Carousel = ({ children, className, opts, setApi }: any) => (
    <div className={className}>{children}</div>
);

const CarouselContent = ({ children, className }: any) => (
    <div className={className}>{children}</div>
);

const CarouselItem = ({ children, className }: any) => (
    <div className={className}>{children}</div>
);

const CarouselNext = ({ className }: any) => (
    <button className={className}><ChevronRight /></button>
);

const CarouselPrevious = ({ className }: any) => (
    <button className={className}><ChevronLeft /></button>
);

export function PropertyCarousel({
    properties,
    title,
    subtitle,
    className,
    itemClassName,
    variant = 'default',
    showControls = true,
    autoplay = false,
    autoplayInterval = 5000,
    slidesToShow = 3,
}: PropertyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Ajusta o número de slides para exibir com base no tamanho da tela
    const responsiveSlidesToShow = {
        default: slidesToShow,
        lg: Math.min(slidesToShow, 3),
        md: Math.min(slidesToShow, 2),
        sm: 1,
    };

    // Configuração de opções do carrossel
    const carouselOptions = {
        align: 'start' as const,
        loop: true,
    };

    return (
        <div
            className={cn("w-full", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Cabeçalho do carrossel */}
            {(title || subtitle) && (
                <div className="flex flex-col items-center text-center mb-8">
                    {title && (
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h2>
                    )}
                    {subtitle && (
                        <motion.p
                            className="text-neutral-600 text-lg max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            )}

            {/* Carrossel */}
            <div className="relative">
                <Carousel
                    opts={carouselOptions}
                    className="w-full"
                    setApi={(api: any) => {
                        if (autoplay && api) {
                            const interval = setInterval(() => {
                                if (!isHovering) {
                                    api.scrollNext();
                                }
                            }, autoplayInterval);
                            return () => clearInterval(interval);
                        }
                    }}
                >
                    <CarouselContent className="-ml-4">
                        {properties.map((property, index) => (
                            <CarouselItem
                                key={property.id}
                                className={cn(
                                    "pl-4 md:basis-1/2 lg:basis-1/3",
                                    slidesToShow === 4 && "xl:basis-1/4",
                                    itemClassName
                                )}
                            >
                                <div className="h-full p-1">                                    <PropertyCard
                                    {...property}
                                />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {showControls && (
                        <>
                            <CarouselPrevious
                                className={cn(
                                    "left-0 -translate-x-1/2 bg-white/80 backdrop-blur-sm border-neutral-200 hover:bg-white",
                                    "hidden md:flex"
                                )}
                            />
                            <CarouselNext
                                className={cn(
                                    "right-0 translate-x-1/2 bg-white/80 backdrop-blur-sm border-neutral-200 hover:bg-white",
                                    "hidden md:flex"
                                )}
                            />
                        </>
                    )}
                </Carousel>

                {/* Indicadores de paginação para mobile */}
                <div className="flex justify-center gap-1.5 mt-6 md:hidden">
                    {Array.from({ length: Math.ceil(properties.length / responsiveSlidesToShow.sm) }).map((_, idx) => (
                        <button
                            key={idx}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                Math.floor(currentIndex / responsiveSlidesToShow.sm) === idx
                                    ? "bg-primary-500 w-4"
                                    : "bg-neutral-300 hover:bg-neutral-400"
                            )}
                            aria-label={`Ir para página ${idx + 1}`}
                            onClick={() => setCurrentIndex(idx * responsiveSlidesToShow.sm)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PropertyCarousel;