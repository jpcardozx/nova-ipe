/**
 * Grid Personalizado com Design Profissional
 * Interface limpa, espaçamentos adequados e ícones profissionais
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Grid3x3, 
    List, 
    Maximize2,
    Minimize2,
    Settings,
    Share2,
    MessageCircle,
    Phone,
    MapPin,
    Bed,
    Bath,
    Square as SquareIcon,
    Heart,
    TrendingUp
} from 'lucide-react';

interface GridPersonalizadoProps {
    properties: any[];
    onPropertyClick?: (property: any) => void;
    onFavoriteToggle?: (propertyId: string) => void;
    onPropertyView?: (propertyId: string, property: any) => (() => void);
    onContactClick?: (propertyId: string, method: string) => void;
    favorites?: string[];
}

type ViewMode = 'compact' | 'comfortable' | 'spacious' | 'list';
type SortMode = 'price_asc' | 'price_desc' | 'newest' | 'area_desc' | 'relevance';

export default function GridPersonalizado({ 
    properties, 
    onPropertyClick, 
    onFavoriteToggle,
    onPropertyView,
    onContactClick,
    favorites = [] 
}: GridPersonalizadoProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
    const [sortMode, setSortMode] = useState<SortMode>('relevance');
    const [showCustomization, setShowCustomization] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);

    // Propriedades processadas e ordenadas
    const processedProperties = useMemo(() => {
        let sorted = [...properties];
        
        switch (sortMode) {
            case 'price_asc':
                sorted.sort((a, b) => (a.preco || 0) - (b.preco || 0));
                break;
            case 'price_desc':
                sorted.sort((a, b) => (b.preco || 0) - (a.preco || 0));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                break;
            case 'area_desc':
                sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
                break;
            default:
                break;
        }
        
        return sorted;
    }, [properties, sortMode]);

    // Componente de card individual
    const PropertyCard = useCallback(({ property, index }: { property: any; index: number }) => {
        const isFavorite = favorites.includes(property.id);
        const [viewTimeTracker, setViewTimeTracker] = useState<(() => void) | null>(null);

        useEffect(() => {
            if (onPropertyView) {
                const tracker = onPropertyView(property.id, property);
                setViewTimeTracker(() => tracker);
            }
            
            return () => {
                if (viewTimeTracker) {
                    viewTimeTracker();
                }
            };
        }, [property.id, onPropertyView, viewTimeTracker]);

        const handleShare = async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
                await navigator.share({
                    title: property.titulo,
                    text: `Confira este imóvel em ${property.bairro}`,
                    url: window.location.href + `/${property.slug || property.id}`
                });
            } catch {
                navigator.clipboard.writeText(window.location.href + `/${property.slug || property.id}`);
            }
        };

        if (viewMode === 'list') {
            return (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 * animationSpeed, delay: (index % 6) * 0.05 * animationSpeed }}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer mb-6"
                    onClick={() => onPropertyClick?.(property)}
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Imagem */}
                        <div className="relative h-64 lg:h-48 lg:w-80 flex-shrink-0">
                            {property.imagemPrincipal && (
                                <img
                                    src={property.imagemPrincipal}
                                    alt={property.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            )}
                            
                            {property.destaque && (
                                <div className="absolute top-4 left-4">
                                    <div className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-lg">
                                        DESTAQUE
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {property.titulo}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <MapPin className="w-5 h-5" />
                                    <span className="text-base">{property.bairro}, Guararema</span>
                                </div>
                                
                                <div className="flex items-center gap-6 text-gray-600 mb-6">
                                    {property.quartos && (
                                        <div className="flex items-center gap-2">
                                            <Bed className="w-5 h-5" />
                                            <span className="font-medium">{property.quartos} quartos</span>
                                        </div>
                                    )}
                                    {property.banheiros && (
                                        <div className="flex items-center gap-2">
                                            <Bath className="w-5 h-5" />
                                            <span className="font-medium">{property.banheiros} banheiros</span>
                                        </div>
                                    )}
                                    {property.area && (
                                        <div className="flex items-center gap-2">
                                            <SquareIcon className="w-5 h-5" />
                                            <span className="font-medium">{property.area}m²</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-amber-600">
                                    {property.preco ? `R$ ${(property.preco / 1000).toFixed(0)}k` : 'Consulte'}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onContactClick?.(property.id, 'whatsapp');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onFavoriteToggle?.(property.id);
                                        }}
                                        className={`p-3 rounded-xl transition-colors ${
                                            isFavorite 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        // Card mode (grid)
        const cardHeight = viewMode === 'compact' ? 'h-80' : viewMode === 'comfortable' ? 'h-96' : 'h-[28rem]';
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 * animationSpeed, delay: (index % 12) * 0.05 * animationSpeed }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer ${cardHeight}`}
                onClick={() => onPropertyClick?.(property)}
            >
                {/* Imagem */}
                <div className="relative h-48 overflow-hidden">
                    {property.imagemPrincipal && (
                        <img
                            src={property.imagemPrincipal}
                            alt={property.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                    )}
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-4 right-4 flex gap-3">
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
                                className={`p-2 backdrop-blur-sm border rounded-lg transition-all ${
                                    isFavorite 
                                        ? 'bg-red-500 border-red-500 text-white' 
                                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                                }`}
                                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        
                        {/* Botões de contato */}
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'whatsapp');
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'phone');
                                }}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Ligar
                            </button>
                        </div>
                    </div>

                    {property.destaque && (
                        <div className="absolute top-4 left-4">
                            <div className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-lg">
                                DESTAQUE
                            </div>
                        </div>
                    )}
                </div>

                {/* Conteúdo do card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors text-lg">
                            {property.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{property.bairro}, Guararema</span>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-bold text-amber-600 mb-4">
                            {property.preco ? `R$ ${(property.preco / 1000).toFixed(0)}k` : 'Consulte'}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            {property.quartos && (
                                <div className="flex items-center gap-1">
                                    <Bed className="w-4 h-4" />
                                    <span>{property.quartos}</span>
                                </div>
                            )}
                            {property.banheiros && (
                                <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4" />
                                    <span>{property.banheiros}</span>
                                </div>
                            )}
                            {property.area && (
                                <div className="flex items-center gap-1">
                                    <SquareIcon className="w-4 h-4" />
                                    <span>{property.area}m²</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }, [favorites, onPropertyClick, onFavoriteToggle, onPropertyView, onContactClick, animationSpeed, viewMode]);

    const getGridClasses = () => {
        if (viewMode === 'list') return '';
        
        const baseClasses = 'grid gap-6 lg:gap-8';
        switch (viewMode) {
            case 'compact':
                return `${baseClasses} grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
            case 'comfortable':
                return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
            case 'spacious':
                return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
            default:
                return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
        }
    };

    return (
        <div className="space-y-8">
            {/* Controles profissionais */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                {/* View Mode */}
                <div className="flex items-center gap-4">
                    <span className="text-base font-semibold text-gray-800">Visualização:</span>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {[
                            { mode: 'compact' as ViewMode, icon: Minimize2, label: 'Compacto' },
                            { mode: 'comfortable' as ViewMode, icon: Grid3x3, label: 'Confortável' },
                            { mode: 'spacious' as ViewMode, icon: Maximize2, label: 'Espaçoso' },
                            { mode: 'list' as ViewMode, icon: List, label: 'Lista' }
                        ].map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`p-3 rounded-lg transition-all duration-200 ${
                                    viewMode === mode
                                        ? 'bg-white shadow-md text-amber-600 scale-105'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                                title={label}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-gray-800">Ordenar:</span>
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as SortMode)}
                        className="px-4 py-3 bg-white border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-w-[180px]"
                    >
                        <option value="relevance">Mais Relevantes</option>
                        <option value="price_asc">Menor Preço</option>
                        <option value="price_desc">Maior Preço</option>
                        <option value="newest">Mais Recentes</option>
                        <option value="area_desc">Maior Área</option>
                    </select>
                </div>

                {/* Customização */}
                <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-medium ${
                        showCustomization
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                >
                    <Settings className="w-5 h-5" />
                    Personalizar
                </button>
            </div>

            {/* Painel de personalização */}
            <AnimatePresence>
                {showCustomization && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50 rounded-2xl border border-amber-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Personalização Avançada</h3>
                            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg">
                                Mostrando {processedProperties.length} imóveis
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Velocidade de Animação: {animationSpeed}x
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={animationSpeed}
                                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid de propriedades */}
            <div className="min-h-screen">
                {viewMode === 'list' ? (
                    <div className="space-y-6">
                        {processedProperties.map((property, index) => (
                            <PropertyCard key={property.id} property={property} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className={getGridClasses()}>
                        {processedProperties.map((property, index) => (
                            <PropertyCard key={property.id} property={property} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}