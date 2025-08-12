'use client';

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Maximize,
    Heart,
    Share2,
    Camera,
    Star,
    TrendingUp,
    Shield,
    Eye,
    Plus
} from 'lucide-react';
import type { ImovelClient } from '@/src/types/imovel-client';
import { formatarMoeda } from '@/lib/utils';

interface PremiumPropertyCardProps {
    imovel: ImovelClient;
    className?: string;
    showFavorite?: boolean;
    showShare?: boolean;
    variant?: 'default' | 'featured' | 'compact';
}

const PremiumPropertyCard = memo(({
    imovel,
    className = '',
    showFavorite = true,
    showShare = true,
    variant = 'default'
}: PremiumPropertyCardProps) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    }, [isFavorited]);

    const handleShare = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: imovel.titulo,
                text: `Confira este imóvel: ${imovel.titulo}`,
                url: `/imovel/${imovel._id}`
            });
        }
    }, [imovel]);

    const slug = imovel._id;
    const mainImage = imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg';
    const price = typeof imovel.preco === 'number' ? imovel.preco : 0;

    // Preparar galeria inteligente: imagem principal + 2 da galeria
    const galleryImages = imovel.galeria || [];
    const firstGalleryImage = galleryImages[0]?.imagemUrl;
    const secondGalleryImage = galleryImages[1]?.imagemUrl;
    const totalImages = 1 + galleryImages.length; // Imagem principal + galeria
    const hasMoreImages = galleryImages.length > 2;
    const remainingCount = galleryImages.length - 2;

    // Variant styles
    const cardStyles = {
        default: 'w-full max-w-sm',
        featured: 'w-full max-w-md',
        compact: 'w-full max-w-xs'
    };

    const imageHeights = {
        default: 'h-80',
        featured: 'h-96',
        compact: 'h-64'
    };

    return (
        <div className={`${cardStyles[variant]} ${className}`}>
            <Link href={`/imovel/${slug}`} className="block group">
                <article
                    className="relative bg-gradient-to-b from-stone-50 to-amber-25 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 ease-out overflow-hidden border border-stone-200/50 hover:border-amber-300/60 hover:scale-[1.03] transform-gpu backdrop-blur-sm"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Gallery Container - Smart Grid Layout */}
                    <div className={`relative ${imageHeights[variant]} overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50`}>
                        {/* Main Image - Takes 2/3 of width */}
                        <div className="absolute inset-0 w-2/3 h-full">
                            <Image
                                src={mainImage}
                                alt={imovel.imagem?.alt || imovel.titulo || 'Imóvel principal'}
                                fill
                                className={`object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'
                                    } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                sizes="(max-width: 768px) 66vw, (max-width: 1200px) 33vw, 25vw"
                                priority={variant === 'featured'}
                            />

                            {/* Main Image Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                        </div>

                        {/* Gallery Side Images - Takes 1/3 of width */}
                        <div className="absolute top-0 right-0 w-1/3 h-full flex flex-col">
                            {/* First Gallery Image */}
                            {firstGalleryImage ? (
                                <div className="flex-1 relative border-l border-b border-white/20">
                                    <Image
                                        src={firstGalleryImage}
                                        alt={galleryImages[0]?.alt || 'Galeria 1'}
                                        fill
                                        className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'
                                            }`}
                                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>
                            ) : (
                                <div className="flex-1 bg-gradient-to-br from-stone-200 via-amber-100 to-stone-200 border-l border-b border-white/20 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-stone-400" />
                                </div>
                            )}

                            {/* Second Gallery Image or "More" Overlay */}
                            <div className="flex-1 relative border-l border-white/20">
                                {secondGalleryImage ? (
                                    <>
                                        <Image
                                            src={secondGalleryImage}
                                            alt={galleryImages[1]?.alt || 'Galeria 2'}
                                            fill
                                            className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'
                                                }`}
                                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                        {/* "Ver Mais" Overlay se houver mais imagens */}
                                        {hasMoreImages && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 via-orange-600/85 to-amber-700/90 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-all duration-300 group-hover:from-amber-500/95 group-hover:via-orange-500/90 group-hover:to-amber-600/95">
                                                <Plus className="w-5 h-5 mb-1 animate-pulse" />
                                                <span className="text-xs font-bold">+{remainingCount}</span>
                                                <span className="text-xs font-medium">FOTOS</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-gradient-to-br from-stone-200 via-amber-100 to-stone-200 h-full flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-stone-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Loading Skeleton para imagem principal */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-amber-100 to-stone-200 animate-pulse" />
                        )}

                        {/* Top Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                            {/* Gallery Counter */}
                            <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <Camera className="w-3 h-3" />
                                <span>{totalImages}</span>
                            </div>

                            {/* Favorite Button */}
                            {showFavorite && (
                                <button
                                    onClick={handleFavorite}
                                    className="bg-white/95 backdrop-blur-sm hover:bg-white text-stone-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                                    aria-label="Favoritar imóvel"
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-600'
                                            }`}
                                    />
                                </button>
                            )}

                            {/* Share Button */}
                            {showShare && (
                                <button
                                    onClick={handleShare}
                                    className="bg-white/95 backdrop-blur-sm hover:bg-white text-stone-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                                    aria-label="Compartilhar imóvel"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Property Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                            {/* Destaque Badge */}
                            {imovel.destaque && (
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>DESTAQUE</span>
                                </div>
                            )}

                            {/* Finalidade Badge */}
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${imovel.finalidade === 'Venda'
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-blue-500/90 text-white'
                                }`}>
                                {imovel.finalidade?.toUpperCase()}
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-4 left-4 z-20">
                            <div className="bg-white/98 backdrop-blur-md text-stone-800 px-4 py-2.5 rounded-2xl shadow-xl border border-white/50">
                                <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    {formatarMoeda(price)}
                                </div>
                                {imovel.finalidade === 'Aluguel' && (
                                    <div className="text-xs text-stone-600 font-medium">por mês</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-stone-25/50">
                        {/* Title and Location */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-stone-800 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
                                {imovel.titulo}
                            </h3>

                            <div className="flex items-center text-stone-600 text-sm">
                                <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                                <span className="truncate">
                                    {[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className="flex items-center justify-between text-stone-600 text-sm">
                            <div className="flex items-center gap-4">
                                {imovel.dormitorios && (
                                    <div className="flex items-center gap-1">
                                        <Bed className="w-4 h-4 text-amber-500" />
                                        <span className="font-medium">{imovel.dormitorios}</span>
                                    </div>
                                )}

                                {imovel.banheiros && (
                                    <div className="flex items-center gap-1">
                                        <Bath className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium">{imovel.banheiros}</span>
                                    </div>
                                )}

                                {imovel.vagas && (
                                    <div className="flex items-center gap-1">
                                        <Car className="w-4 h-4 text-emerald-500" />
                                        <span className="font-medium">{imovel.vagas}</span>
                                    </div>
                                )}
                            </div>

                            {/* Area */}
                            {imovel.areaUtil && (
                                <div className="flex items-center gap-1 text-stone-700 font-medium">
                                    <Maximize className="w-4 h-4 text-purple-500" />
                                    <span>{imovel.areaUtil}m²</span>
                                </div>
                            )}
                        </div>

                        {/* Property Type and Trust Indicators */}
                        <div className="flex items-center justify-between pt-3 border-t border-stone-200/60">
                            <span className="text-sm font-semibold text-stone-700 bg-gradient-to-r from-stone-100 to-amber-50 px-3 py-1.5 rounded-full border border-stone-200/40">
                                {imovel.tipoImovel}
                            </span>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-2">
                                {imovel.documentacaoOk && (
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                        <Shield className="w-3 h-3" />
                                        <span>Docs OK</span>
                                    </div>
                                )}

                                {imovel.aceitaFinanciamento && (
                                    <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>Financia</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="pt-2">
                            <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-center py-3.5 rounded-2xl font-bold text-sm group-hover:from-amber-600 group-hover:via-orange-600 group-hover:to-amber-700 transition-all duration-300 shadow-lg group-hover:shadow-xl backdrop-blur-sm">
                                Ver Detalhes Completos
                            </div>
                        </div>
                    </div>

                    {/* Hover Effect Ring */}
                    <div className="absolute inset-0 ring-2 ring-amber-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                </article>
            </Link>
        </div>
    );
});

PremiumPropertyCard.displayName = 'PremiumPropertyCard';

export default PremiumPropertyCard;
