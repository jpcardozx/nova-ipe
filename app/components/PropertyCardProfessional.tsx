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
    Camera,
    ChevronRight,
    Star
} from 'lucide-react';
import type { ImovelClient } from '@/src/types/imovel-client';
import { formatarMoeda } from '@/lib/utils';

interface PropertyCardProfessionalProps {
    imovel: ImovelClient;
    className?: string;
    variant?: 'default' | 'featured';
}

const PropertyCardProfessional = memo(({
    imovel,
    className = '',
    variant = 'default'
}: PropertyCardProfessionalProps) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const slug = imovel._id;
    const mainImage = imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg';
    const price = typeof imovel.preco === 'number' ? imovel.preco : 0;
    const galleryCount = (imovel.galeria?.length || 0) + 1;

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    // Clean design variants
    const cardVariants = {
        default: 'max-w-sm',
        featured: 'max-w-md'
    };

    const imageHeights = {
        default: 'aspect-[4/3]',
        featured: 'aspect-[16/10]'
    };

    return (
        <article className={`group ${cardVariants[variant]} ${className}`}>
            <Link href={`/imovel/${slug}`} className="block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-stone-200">

                    {/* IMAGE SECTION - Clean & Focused */}
                    <div className={`relative ${imageHeights[variant]} bg-stone-100`}>
                        <Image
                            src={mainImage}
                            alt={imovel.titulo || 'Imóvel'}
                            fill
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={variant === 'featured'}
                        />

                        {/* Subtle overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                        {/* Loading skeleton */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
                        )}

                        {/* TOP BADGES - Minimal & Meaningful */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {imovel.destaque && (
                                <div className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
                                    <Star className="w-3 h-3 fill-current" />
                                    Destaque
                                </div>
                            )}

                            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-lg ${imovel.finalidade === 'Venda' ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}>
                                {imovel.finalidade}
                            </div>
                        </div>

                        {/* TOP RIGHT - Clean Actions */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {galleryCount > 1 && (
                                <div className="bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    {galleryCount}
                                </div>
                            )}

                            <button
                                onClick={handleFavorite}
                                className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                                aria-label="Favoritar"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-600'
                                    }`} />
                            </button>
                        </div>

                        {/* PRICE - Clean positioning */}
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg">
                                <div className="text-xl font-bold text-stone-900">
                                    {formatarMoeda(price)}
                                </div>
                                {imovel.finalidade === 'Aluguel' && (
                                    <div className="text-xs text-stone-600 font-medium">
                                        por mês
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CONTENT SECTION - Clean Typography Hierarchy */}
                    <div className="p-6 space-y-4">

                        {/* TITLE & LOCATION - Clear hierarchy */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-stone-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
                                {imovel.titulo}
                            </h3>

                            <div className="flex items-center text-stone-600 text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-stone-400" />
                                <span className="truncate">
                                    {[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>

                        {/* FEATURES - Clean grid layout */}
                        <div className="grid grid-cols-4 gap-4 py-3 border-t border-stone-100">
                            {imovel.dormitorios && (
                                <div className="flex flex-col items-center text-center">
                                    <Bed className="w-5 h-5 text-stone-400 mb-1" />
                                    <span className="text-sm font-medium text-stone-700">{imovel.dormitorios}</span>
                                    <span className="text-xs text-stone-500">Quartos</span>
                                </div>
                            )}

                            {imovel.banheiros && (
                                <div className="flex flex-col items-center text-center">
                                    <Bath className="w-5 h-5 text-stone-400 mb-1" />
                                    <span className="text-sm font-medium text-stone-700">{imovel.banheiros}</span>
                                    <span className="text-xs text-stone-500">Banheiros</span>
                                </div>
                            )}

                            {imovel.vagas && (
                                <div className="flex flex-col items-center text-center">
                                    <Car className="w-5 h-5 text-stone-400 mb-1" />
                                    <span className="text-sm font-medium text-stone-700">{imovel.vagas}</span>
                                    <span className="text-xs text-stone-500">Vagas</span>
                                </div>
                            )}

                            {imovel.areaUtil && (
                                <div className="flex flex-col items-center text-center">
                                    <Maximize className="w-5 h-5 text-stone-400 mb-1" />
                                    <span className="text-sm font-medium text-stone-700">{imovel.areaUtil}m²</span>
                                    <span className="text-xs text-stone-500">Área</span>
                                </div>
                            )}
                        </div>

                        {/* FOOTER - Type and CTA */}
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg">
                                {imovel.tipoImovel}
                            </span>

                            <div className="flex items-center text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                                <span>Ver detalhes</span>
                                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
});

PropertyCardProfessional.displayName = 'PropertyCardProfessional';

export default PropertyCardProfessional;
