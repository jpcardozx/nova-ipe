'use client';

import { useState, memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Maximize,
    Heart,
    ChevronRight
} from 'lucide-react';
import type { ImovelClient } from '@/src/types/imovel-client';
import { formatarMoeda } from '@/lib/utils';

interface PropertyCardOptimizedProps {
    imovel: ImovelClient;
    className?: string;
    priority?: boolean;
}

// Memoized components for better performance
const FeatureIcon = memo(({ icon: Icon, value, label }: {
    icon: any;
    value: number;
    label: string;
}) => (
    <div className="flex flex-col items-center text-center">
        <Icon className="w-4 h-4 text-stone-400 mb-1" />
        <span className="text-sm font-medium text-stone-700">{value}</span>
        <span className="text-xs text-stone-500">{label}</span>
    </div>
));

FeatureIcon.displayName = 'FeatureIcon';

const PropertyCardOptimized = memo(({
    imovel,
    className = '',
    priority = false
}: PropertyCardOptimizedProps) => {
    const [isFavorited, setIsFavorited] = useState(false);

    // Memoized values to prevent recalculation
    const memoizedData = useMemo(() => ({
        slug: imovel._id, // Using _id directly as slug
        mainImage: imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg',
        price: typeof imovel.preco === 'number' ? imovel.preco : 0,
        location: [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')
    }), [imovel]);

    // Optimized click handlers
    const handleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(prev => !prev);
    }, []);

    // Features array for better organization
    const features = useMemo(() => [
        imovel.dormitorios && { icon: Bed, value: imovel.dormitorios, label: 'Quartos' },
        imovel.banheiros && { icon: Bath, value: imovel.banheiros, label: 'Banheiros' },
        imovel.vagas && { icon: Car, value: imovel.vagas, label: 'Vagas' },
        imovel.areaUtil && { icon: Maximize, value: imovel.areaUtil, label: 'Área m²' }
    ].filter(Boolean), [imovel]);

    return (
        <article className={`group max-w-sm ${className}`}>
            <Link
                href={`/imovel/${memoizedData.slug}`}
                className="block"
                prefetch={false} // Optimize prefetching
            >
                <div className="bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:border-stone-300 transition-colors duration-200 hover:shadow-lg">

                    {/* Optimized Image Section */}
                    <div className="relative aspect-[4/3] bg-stone-100">
                        <Image
                            src={memoizedData.mainImage}
                            alt={imovel.titulo || 'Imóvel'}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={priority}
                            quality={80} // Optimize quality for performance
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kcp4//9k="
                        />

                        {/* Minimal favorite button */}
                        <button
                            onClick={handleFavorite}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors duration-150"
                            aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <Heart className={`w-4 h-4 transition-colors duration-150 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-600'
                                }`} />
                        </button>

                        {/* Optimized price tag */}
                        <div className="absolute bottom-3 left-3">
                            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                <div className="text-lg font-bold text-stone-900">
                                    {formatarMoeda(memoizedData.price)}
                                </div>
                                {imovel.finalidade === 'Aluguel' && (
                                    <div className="text-xs text-stone-600 font-medium">
                                        por mês
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Optimized Content Section */}
                    <div className="p-4 space-y-3">

                        {/* Title - Optimized for performance */}
                        <h3 className="text-lg font-semibold text-stone-900 truncate group-hover:text-stone-700 transition-colors duration-150">
                            {imovel.titulo}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-stone-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-stone-400 flex-shrink-0" />
                            <span className="truncate">{memoizedData.location}</span>
                        </div>

                        {/* Features - Optimized rendering */}
                        {features.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 text-sm text-stone-600">
                                {features.map((feature, index) => {
                                    // Type guard to ensure feature is valid
                                    if (!feature || typeof feature === 'number' || !feature.icon) {
                                        return null;
                                    }
                                    return (
                                        <FeatureIcon
                                            key={index}
                                            icon={feature.icon}
                                            value={feature.value}
                                            label={feature.label}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer - Type and CTA */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                            <span className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                                {imovel.tipoImovel}
                            </span>

                            <div className="flex items-center text-stone-500 group-hover:text-stone-700 transition-colors duration-150">
                                <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
});

PropertyCardOptimized.displayName = 'PropertyCardOptimized';

export default PropertyCardOptimized;
