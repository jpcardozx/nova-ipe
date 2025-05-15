'use client';

import React from 'react';
import { OptimizedPropertyCarouselProps } from '@/app/components/OptimizedPropertyCarousel';
import { OptimizedCarouselProps } from '@/app/components/ui/OptimizedCarousel';
import OptimizedPropertyCard from './OptimizedPropertyCard';

// Function to adapt OptimizedPropertyCarouselProps to OptimizedCarouselProps
export function adaptPropertyCarouselProps(props: OptimizedPropertyCarouselProps): OptimizedCarouselProps<any> {
    const accentColor = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        highlight: 'var(--color-highlight)',
        ring: 'var(--color-ring)',
        accent: 'var(--color-accent)'
    };

    const slides = props.properties?.map(property => ({
        id: property.id,
        content: (
            <OptimizedPropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                slug={property.slug}
                location={property.location}
                city={property.city}
                price={property.price}
                propertyType={property.propertyType}
                area={property.area}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                parkingSpots={property.parkingSpots}
                mainImage={property.mainImage}
                status={property.status}
                isNew={property.isNew} isHighlight={property.isHighlight}
                isPremium={property.isPremium}
                isFavorite={false} // Default value, can be updated by parent component
                onFavoriteToggle={() => { }} // No-op function, can be replaced by parent
            />
        )
    })) || [];

    const options = {
        align: "start" as "start" | "center" | "end",
        loop: false,
        dragFree: false,
        slidesToShow: props.slidesToShow || 3,
        spacing: 16,
        autoplay: props.autoplay || false,
        autoplayDelay: props.autoplayInterval || 5000,
        breakpoints: {
            '(max-width: 768px)': { slidesToShow: 1, spacing: 8 },
            '(min-width: 769px) and (max-width: 1024px)': { slidesToShow: 2, spacing: 12 },
        }
    };

    return {
        items: slides,
        getKey: (item) => item.id,
        renderItem: (slide, index) => slide.content,
        options,
        className: props.className,
        title: props.title,
        subtitle: props.subtitle,
        accentColor,
        controls: {
            showArrows: props.showControls ?? true,
            showDots: false,
            arrowPosition: 'outside',
            arrowSize: 'md',
        },
    };
}
