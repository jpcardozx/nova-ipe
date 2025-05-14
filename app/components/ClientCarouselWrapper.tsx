'use client';

import dynamic from 'next/dynamic';

// Ajuste o caminho para onde está seu componente real
const PropertyCarousel = dynamic(
    () => import('./OptimizedPropertyCarousel'),
    {
        ssr: false,
        loading: () => (
            <div className="space-y-6">
                <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-neutral-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-neutral-200 animate-pulse rounded-md w-3/4"></div>
                                <div className="h-4 bg-neutral-200 animate-pulse rounded-md w-2/3"></div>
                                <div className="h-6 bg-neutral-200 animate-pulse rounded-md w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
);

interface CarouselConfig {
    title: string;
    subtitle: string;
    slidesToShow: number;
    showControls: boolean;
    autoplay: boolean;
    autoplayInterval: number;
    viewAllLink: string;
    viewAllLabel: string;
    className?: string;
    hasAccentBackground: boolean;
    showEmptyState: boolean;
    emptyStateMessage: string;
    mobileLayout: 'scroll' | 'stack';  // Changed from 'carousel' to 'scroll' to match OptimizedPropertyCarouselProps
}

interface ClientCarouselWrapperProps {
    properties: any[];
    config: CarouselConfig;
}

export default function ClientCarouselWrapper({ properties, config }: ClientCarouselWrapperProps) {
    // Passar todas as props diretamente para o componente
    return <PropertyCarousel properties={properties} {...config} />;
}