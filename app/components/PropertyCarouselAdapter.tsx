'use client';

import React from 'react';
import { OptimizedPropertyCarouselProps } from '@/app/components/OptimizedPropertyCarousel';
import { OptimizedCarouselProps } from '@/app/components/ui/OptimizedCarousel';
import OptimizedPropertyCard from './OptimizedPropertyCard';

// Function to adapt OptimizedPropertyCarouselProps to OptimizedCarouselProps
export function adaptPropertyCarouselProps(props: OptimizedPropertyCarouselProps): OptimizedCarouselProps<any> {
    return {
        items: props.properties || [],
        getKey: (item) => item.id,
        renderItem: (property, index) => (
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
        ),
        options: {
            align: 'start',
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
        },
        className: props.className,
        title: props.title,
        subtitle: props.subtitle,
        controls: {
            showArrows: props.showControls || true,
            showDots: false,
            arrowPosition: 'outside',
            arrowSize: 'md',
        },
    };
}
