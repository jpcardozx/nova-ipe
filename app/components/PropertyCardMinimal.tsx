'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Maximize,
    Heart,
    ArrowUpRight
} from 'lucide-react';
import type { ImovelClient } from '@/src/types/imovel-client';
import { formatarMoeda } from '@/lib/utils';

interface PropertyCardMinimalProps {
    imovel: ImovelClient;
    className?: string;
}

const PropertyCardMinimal = memo(({
    imovel,
    className = ''
}: PropertyCardMinimalProps) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const slug = imovel._id;
    const mainImage = imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg';
    const price = typeof imovel.preco === 'number' ? imovel.preco : 0;

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    return (
        <article className={`group max-w-sm ${className}`}>
            <Link href={`/imovel/${slug}`} className="block">
                <div className="bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:border-stone-300 transition-all duration-300 hover:shadow-lg">

                    {/* IMAGE - Ultra clean */}
                    <div className="relative aspect-[4/3] bg-stone-100">
                        <Image
                            src={mainImage}
                            alt={imovel.titulo || 'Imóvel'}
                            fill
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Loading skeleton */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                        )}

                        {/* Minimal favorite button */}
                        <button
                            onClick={handleFavorite}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                            aria-label="Favoritar"
                        >
                            <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-600'
                                }`} />
                        </button>

                        {/* Clean price tag */}
                        <div className="absolute bottom-3 left-3">
                            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                <div className="text-lg font-bold text-stone-900">
                                    {formatarMoeda(price)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT - Minimal padding and clean typography */}
                    <div className="p-4 space-y-3">

                        {/* Title - Single line for cleanliness */}
                        <h3 className="text-lg font-semibold text-stone-900 truncate group-hover:text-stone-700 transition-colors">
                            {imovel.titulo}
                        </h3>

                        {/* Location - Clean with icon */}
                        <div className="flex items-center text-stone-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-stone-400 flex-shrink-0" />
                            <span className="truncate">
                                {[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
                            </span>
                        </div>

                        {/* Features - Horizontal minimal layout */}
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                            {imovel.dormitorios && (
                                <div className="flex items-center gap-1">
                                    <Bed className="w-4 h-4 text-stone-400" />
                                    <span className="font-medium">{imovel.dormitorios}</span>
                                </div>
                            )}

                            {imovel.banheiros && (
                                <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4 text-stone-400" />
                                    <span className="font-medium">{imovel.banheiros}</span>
                                </div>
                            )}

                            {imovel.vagas && (
                                <div className="flex items-center gap-1">
                                    <Car className="w-4 h-4 text-stone-400" />
                                    <span className="font-medium">{imovel.vagas}</span>
                                </div>
                            )}

                            {imovel.areaUtil && (
                                <div className="flex items-center gap-1">
                                    <Maximize className="w-4 h-4 text-stone-400" />
                                    <span className="font-medium">{imovel.areaUtil}m²</span>
                                </div>
                            )}
                        </div>

                        {/* Footer - Type and subtle CTA */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                            <span className="text-xs font-medium text-stone-600 uppercase tracking-wide">
                                {imovel.tipoImovel}
                            </span>

                            <div className="flex items-center text-stone-500 group-hover:text-stone-700 transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
});

PropertyCardMinimal.displayName = 'PropertyCardMinimal';

export default PropertyCardMinimal;
