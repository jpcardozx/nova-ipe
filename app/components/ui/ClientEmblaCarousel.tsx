'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { OptimizedCarouselProps } from './OptimizedCarousel';

// Importação dinâmica para evitar problemas de SSR com useLayoutEffect
const DynamicOptimizedCarousel = dynamic(
    () => import('./OptimizedCarousel').then(mod => mod.OptimizedCarousel),
    { ssr: false } // Importante: desativar SSR para evitar warnings de hydration
);

// Interface para as propriedades transferidas do page.tsx
export interface ClientEmblaCarouselProps {
    properties?: any[];
    title?: string;
    subtitle?: string;
    slidesToShow?: number;
    showControls?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    viewAllLink?: string;
    viewAllLabel?: string;
    className?: string;
    hasAccentBackground?: boolean;
    showEmptyState?: boolean;
    emptyStateMessage?: string;
    mobileLayout?: string;
}

// Função para adaptar propriedades do formato antigo para o novo formato esperado pelo carrossel
function adaptProperties<T>(props: ClientEmblaCarouselProps): OptimizedCarouselProps<T> {
    if (!props.properties) return {} as OptimizedCarouselProps<T>;

    return {
        items: props.properties as unknown as T[],
        getKey: (item: any) => item.id,
        renderItem: (item: any, index: number) => (
            <div className="keen-slider__slide">
                {/* Renderiza um item de propriedade */}
                <div className="h-80 bg-white rounded-lg shadow-md p-4">
                    <h3>{item.title}</h3>
                    <p>{item.location}</p>
                    <p className="font-bold">{item.price}</p>
                </div>
            </div>
        ),
        title: props.title,
        subtitle: props.subtitle,
        options: {
            slidesToShow: props.slidesToShow || 3,
            autoplay: props.autoplay,
            autoplayDelay: props.autoplayInterval,
        },
        controls: {
            showArrows: props.showControls,
        },
        className: props.className
    } as OptimizedCarouselProps<T>;
}

export function ClientEmblaCarousel(props: ClientEmblaCarouselProps) {
    // Adaptar as propriedades para o formato esperado pelo OptimizedCarousel
    const adaptedProps = adaptProperties<any>(props);
    const [isMounted, setIsMounted] = useState(false);

    // Renderiza o carrossel apenas no lado do cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        // Retornar um placeholder com a mesma estrutura durante o SSR
        return (
            <div className={`relative w-full ${props.className || ''}`}>
                {(props.title || props.subtitle) && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        <div>
                            {props.title && <h2 className="text-2xl font-bold mb-1">{props.title}</h2>}
                            {props.subtitle && <p className="text-neutral-600">{props.subtitle}</p>}
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden">
                    <div className="flex">
                        {Array.from({ length: Math.min(props.properties?.length || 3, 3) }).map((_, i) => (
                            <div key={i} className="min-w-0 relative" style={{ flex: '0 0 33.333%', padding: '0 16px' }}>
                                <div className="h-80 bg-neutral-100 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // No lado do cliente, renderize o componente real
    return <DynamicOptimizedCarousel {...adaptedProps} />;
}

export default ClientEmblaCarousel;
