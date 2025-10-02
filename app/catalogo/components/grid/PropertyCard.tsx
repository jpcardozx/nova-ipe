/**
 * Card de Propriedade Individual
 * Componente modular e reutilizável para grid view
 * Responsivo e otimizado para performance
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Share2, MessageCircle, Phone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from './PropertyGrid';

interface PropertyCardProps {
    property: any;
    index: number;
    viewMode: ViewMode;
    isFavorite: boolean;
    onPropertyClick?: (property: any) => void;
    onFavoriteToggle?: (propertyId: string) => void;
    onContactClick?: (propertyId: string, method: string) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.3
        }
    }
};

export default function PropertyCard({
    property,
    index,
    viewMode,
    isFavorite,
    onPropertyClick,
    onFavoriteToggle,
    onContactClick
}: PropertyCardProps) {

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.share({
                title: property.titulo,
                text: `Confira este imóvel em ${property.bairro}`,
                url: `${window.location.origin}/imovel/${property.slug || property.id}`
            });
        } catch {
            navigator.clipboard.writeText(`${window.location.origin}/imovel/${property.slug || property.id}`);
        }
    };

    // Configurações de altura baseadas no viewMode
    const heightConfig = {
        compact: 'h-[350px]',
        comfortable: 'h-[420px]',
        spacious: 'h-[480px]',
        list: 'h-auto'
    };

    const imageHeight = {
        compact: 'h-36',
        comfortable: 'h-48',
        spacious: 'h-56',
        list: 'h-auto'
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col",
                heightConfig[viewMode]
            )}
            onClick={() => onPropertyClick?.(property)}
        >
            {/* Imagem */}
            <div className={cn("relative overflow-hidden flex-shrink-0", imageHeight[viewMode])}>
                {property.imagemPrincipal ? (
                    <img
                        src={property.imagemPrincipal}
                        alt={property.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                            // Fallback para imagem quebrada
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Sem imagem</span>
                        </div>
                    </div>
                )}
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all"
                            title="Compartilhar"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onFavoriteToggle?.(property.id);
                            }}
                            className={cn(
                                "p-2 backdrop-blur-sm border rounded-lg transition-all",
                                isFavorite 
                                    ? "bg-red-500 border-red-500 text-white" 
                                    : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                            )}
                            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                        </button>
                    </div>
                    
                    {/* Botões de contato - só aparecem em hover */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onContactClick?.(property.id, 'whatsapp');
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onContactClick?.(property.id, 'phone');
                            }}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">Ligar</span>
                        </button>
                    </div>
                </div>

                {/* Badge de destaque */}
                {property.destaque && (
                    <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            DESTAQUE
                        </div>
                    </div>
                )}

                {/* Badge de tipo */}
                {property.tipo && (
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-md">
                            {property.tipo}
                        </div>
                    </div>
                )}
            </div>

            {/* Conteúdo do card */}
            <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2 md:space-y-3">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors text-base md:text-lg">
                        {property.titulo}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{property.bairro}, {property.cidade || 'Guararema'}</span>
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4 mt-auto">
                    {/* Preço */}
                    <div className="text-2xl md:text-3xl font-bold text-amber-600">
                        {property.preco ? (
                            <>
                                R$ {(property.preco / 1000).toFixed(0)}
                                <span className="text-lg">k</span>
                            </>
                        ) : (
                            <span className="text-lg">Consulte</span>
                        )}
                    </div>

                    {/* Características */}
                    <div className="flex items-center gap-3 md:gap-4 text-sm text-gray-600 flex-wrap">
                        {property.quartos && (
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span className="font-medium">{property.quartos}</span>
                            </div>
                        )}
                        {property.banheiros && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span className="font-medium">{property.banheiros}</span>
                            </div>
                        )}
                        {property.area && (
                            <div className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                <span className="font-medium">{property.area}m²</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
