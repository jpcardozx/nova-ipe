/**
 * Card de Propriedade Individual
 * Componente modular e reutilizável para grid view
 * Responsivo e otimizado para performance
 * ✅ Imagens otimizadas com Next.js Image
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Share2, MessageCircle, Phone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImovelImageUrl, useImovelImage } from '@/lib/helpers/imageHelpers';
import { PropertyCardImage } from '@/app/components/ui/OptimizedImage';
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

    // 🔧 PRIORIDADE: Imagem do Sanity > Lightsail > Placeholder
    // Se property tem imagem do Sanity, usa ela. Senão, tenta Lightsail.
    const sanityImageUrl = property.imagemPrincipal || property.imagem?.imagemUrl || property.imagem?.asset?.url

    // Hook para gerenciar imagens do Lightsail com fallback (só usado se não tiver imagem Sanity)
    const { primaryUrl: lightsailUrl, handleImageError } = useImovelImage(
        property.codigo || property.id || property._id,
        {
            size: viewMode === 'list' ? '285x140' : '640x480',
            fotoNumero: 1
        }
    )

    // URL final: Sanity (se existir) > Lightsail > Fallback
    const primaryUrl = sanityImageUrl || lightsailUrl

    // 🐛 DEBUG: Log apenas do primeiro card (index 0) em desenvolvimento
    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && index === 0) {
            console.log('🖼️ PropertyCard Debug (primeiro card):', {
                propertyId: property._id || property.id,
                titulo: property.titulo,
                sanityImageUrl,
                lightsailUrl,
                primaryUrl_usado: primaryUrl,
                fonte: sanityImageUrl ? '✅ Sanity' : lightsailUrl ? '⚠️ Lightsail (fallback)' : '❌ Placeholder'
            })
        }
    }, [index, property._id, property.id, property.titulo, sanityImageUrl, lightsailUrl, primaryUrl])

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
        compact: 'h-[360px] md:h-[380px]',
        comfortable: 'h-[440px] md:h-[460px]',
        spacious: 'h-[500px] md:h-[520px]',
        list: 'h-auto'
    };

    const imageHeight = {
        compact: 'h-40 md:h-44',
        comfortable: 'h-52 md:h-56',
        spacious: 'h-60 md:h-64',
        list: 'h-auto'
    };

    return (
        <motion.article
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ 
                y: -12, 
                scale: 1.01,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            className={cn(
                "group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary/40 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col",
                heightConfig[viewMode]
            )}
            onClick={() => onPropertyClick?.(property)}
        >
            {/* Imagem otimizada com overlay gradiente premium */}
            <div className={cn("relative overflow-hidden flex-shrink-0", imageHeight[viewMode])}>
                <PropertyCardImage
                    src={primaryUrl}
                    alt={property.titulo || 'Imóvel'}
                    priority={index < 6}
                    className="group-hover:scale-110 transition-transform duration-700"
                    onError={() => handleImageError({ target: null } as any)}
                />
                
                {/* Overlay premium gradiente - Sempre visível com transição suave */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-secondary/40 to-transparent"
                    initial={{ opacity: 0.3 }}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute top-3 right-3 flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShare}
                            className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all shadow-lg"
                            title="Compartilhar"
                        >
                            <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onFavoriteToggle?.(property.id);
                            }}
                            className={cn(
                                "p-2.5 backdrop-blur-md border rounded-xl transition-all shadow-lg",
                                isFavorite 
                                    ? "bg-red-500/90 border-red-500/50 text-white" 
                                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            )}
                            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <motion.div
                                animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                            </motion.div>
                        </motion.button>
                    </div>
                    
                    {/* Botões de contato - aparecem em hover com animação */}
                    <motion.div 
                        className="absolute bottom-3 left-3 right-3 flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onContactClick?.(property.id, 'whatsapp');
                            }}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-3 rounded-xl transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onContactClick?.(property.id, 'phone');
                            }}
                            className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white py-2.5 px-3 rounded-xl transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">Ligar</span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Badge de destaque - Animado com brand colors */}
                {property.destaque && (
                    <motion.div 
                        className="absolute top-3 left-3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/40 border border-primary-light/30">
                            <TrendingUp className="w-3.5 h-3.5" />
                            DESTAQUE
                        </div>
                    </motion.div>
                )}

                {/* Badge de tipo */}
                {property.tipo && (
                    <motion.div 
                        className="absolute bottom-3 left-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg shadow-lg border border-white/50">
                            {property.tipo}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Conteúdo do card - Com animações sutis */}
            <motion.div 
                className="p-5 md:p-6 flex-1 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="space-y-2.5 md:space-y-3">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-lg md:text-xl leading-tight">
                        {property.titulo}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-primary-dark transition-colors duration-300">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                        <span className="text-sm md:text-base truncate font-medium">{property.bairro}, {property.cidade || 'Guararema'}</span>
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4 mt-auto">
                    {/* Preço com gradiente brand */}
                    <motion.div 
                        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        {property.preco ? (
                            new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(property.preco)
                        ) : (
                            <span className="text-lg text-gray-600">Sob consulta</span>
                        )}
                    </motion.div>

                    {/* Características com brand colors */}
                    <div className="flex items-center gap-4 md:gap-5 text-sm text-gray-700">
                        {property.quartos && (
                            <motion.div 
                                className="flex items-center gap-1.5"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Bed className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{property.quartos}</span>
                            </motion.div>
                        )}
                        {property.banheiros && (
                            <motion.div 
                                className="flex items-center gap-1.5"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Bath className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{property.banheiros}</span>
                            </motion.div>
                        )}
                        {property.area && (
                            <motion.div 
                                className="flex items-center gap-1.5"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Square className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{property.area.toLocaleString('pt-BR')}m²</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.article>
    );
}
