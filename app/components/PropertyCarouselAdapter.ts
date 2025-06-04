/**
 * PropertyCarouselAdapter
 * 
 * Este arquivo fornece adaptadores para converter props do OptimizedPropertyCarousel
 * para os formatos necessários para usar em componentes UI internos.
 */

import React from 'react';
import type { OptimizedPropertyCarouselProps } from './OptimizedPropertyCarousel';
import { PropertyCard as OptimizedPropertyCard } from '@/app/components/ui/property/PropertyCardUnified';

// Interface para o slide
interface Slide {
    id: string;
    content: React.ReactNode;
}

// Interface para as opções do carrossel
interface CarouselOptions {
    slidesToShow: number;
    loop: boolean;
    autoplay: boolean;
    autoplayDelay: number;
    showControls: boolean;
    spacing: number;
    controlsType: 'light' | 'dark';
    breakpoints: {
        [key: string]: {
            slidesToShow: number;
            spacing: number;
        };
    };
}

// Interface para o resultado do adaptador
interface AdaptedCarouselProps {
    slides: Slide[];
    options: CarouselOptions;
}

/**
 * Adapta as propriedades do PropertyCarousel para serem usadas com o OptimizedCarousel
 */
export function adaptPropertyCarouselProps(props: OptimizedPropertyCarouselProps): AdaptedCarouselProps {
    const {
        properties,
        slidesToShow = 3,
        showControls = true,
        autoplay = false,
        autoplayInterval = 5000,
        hasAccentBackground = false,
    } = props;

    // Define opções do carrossel com breakpoints responsivos
    return {
        slides: properties.map((property) => ({
            id: property.id,
            content: React.createElement(
                OptimizedPropertyCard,
                {
                    key: property.id,
                    ...property,
                    className: "h-full"
                }
            ),
        })),
        options: {
            slidesToShow,
            loop: properties.length > slidesToShow,
            autoplay,
            autoplayDelay: autoplayInterval,
            showControls,
            spacing: 24,
            controlsType: hasAccentBackground ? 'light' : 'dark',
            breakpoints: {
                '(max-width: 640px)': { slidesToShow: 1, spacing: 12 },
                '(min-width: 641px) and (max-width: 1024px)': { slidesToShow: Math.min(2, slidesToShow), spacing: 16 },
                '(min-width: 1025px)': { slidesToShow, spacing: 24 },
            },
        }
    };
}
