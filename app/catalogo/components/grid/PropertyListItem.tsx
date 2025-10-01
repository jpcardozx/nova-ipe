/**
 * Item de Lista de Propriedade
 * Componente para visualização em lista (horizontal)
 * Mobile-friendly e responsivo
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, MessageCircle, Phone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyListItemProps {
    property: any;
    index: number;
    isFavorite: boolean;
    onPropertyClick?: (property: any) => void;
    onFavoriteToggle?: (propertyId: string) => void;
    onContactClick?: (propertyId: string, method: string) => void;
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.3
        }
    }
};

export default function PropertyListItem({
    property,
    index,
    isFavorite,
    onPropertyClick,
    onFavoriteToggle,
    onContactClick
}: PropertyListItemProps) {

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => onPropertyClick?.(property)}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Imagem */}
                <div className="relative h-56 sm:h-48 sm:w-80 lg:w-96 flex-shrink-0 overflow-hidden">
                    {property.imagemPrincipal && (
                        <img
                            src={property.imagemPrincipal}
                            alt={property.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    )}
                    
                    {/* Badges */}
                    {property.destaque && (
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-lg shadow-lg">
                                <TrendingUp className="w-4 h-4" />
                                DESTAQUE
                            </div>
                        </div>
                    )}

                    {/* Tipo */}
                    {property.tipo && (
                        <div className="absolute bottom-4 left-4">
                            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-lg">
                                {property.tipo}
                            </div>
                        </div>
                    )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                {property.titulo}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-5 h-5 flex-shrink-0" />
                                <span className="text-base">{property.bairro}, {property.cidade || 'Guararema'}</span>
                            </div>
                        </div>
                        
                        {/* Características */}
                        <div className="flex items-center flex-wrap gap-4 lg:gap-6 text-gray-600">
                            {property.quartos && (
                                <div className="flex items-center gap-2">
                                    <Bed className="w-5 h-5" />
                                    <span className="font-medium">{property.quartos} {property.quartos === 1 ? 'quarto' : 'quartos'}</span>
                                </div>
                            )}
                            {property.banheiros && (
                                <div className="flex items-center gap-2">
                                    <Bath className="w-5 h-5" />
                                    <span className="font-medium">{property.banheiros} {property.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
                                </div>
                            )}
                            {property.area && (
                                <div className="flex items-center gap-2">
                                    <Square className="w-5 h-5" />
                                    <span className="font-medium">{property.area}m²</span>
                                </div>
                            )}
                        </div>

                        {/* Descrição - opcional */}
                        {property.descricao && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {property.descricao}
                            </p>
                        )}
                    </div>

                    {/* Footer com preço e ações */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl lg:text-4xl font-bold text-amber-600">
                                {property.preco ? (
                                    <>
                                        R$ {(property.preco / 1000).toFixed(0)}
                                        <span className="text-lg">k</span>
                                    </>
                                ) : (
                                    <span className="text-2xl">Consulte</span>
                                )}
                            </span>
                            {property.precoM2 && (
                                <span className="text-sm text-gray-500">
                                    (R$ {property.precoM2}/m²)
                                </span>
                            )}
                        </div>
                        
                        {/* Botões de ação */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'whatsapp');
                                }}
                                className="flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'phone');
                                }}
                                className="flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium text-sm"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="hidden lg:inline">Ligar</span>
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavoriteToggle?.(property.id);
                                }}
                                className={cn(
                                    "p-2.5 rounded-xl transition-colors",
                                    isFavorite 
                                        ? "bg-red-500 text-white" 
                                        : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500"
                                )}
                            >
                                <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
