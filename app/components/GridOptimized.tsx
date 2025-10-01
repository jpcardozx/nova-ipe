/**
 * Grid Personalizado Otimizado com Analytics Integrado
 * Usa Intersection Observer e Virtual Scrolling manual
 */

'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
    Grid3x3, 
    List, 
    Square, 
    LayoutGrid,
    Eye,
    Heart,
    Maximize2,
    Minimize2,
    Settings,
    Share2,
    Phone,
    MessageCircle
} from 'lucide-react';

interface GridOptimizedProps {
    properties: any[];
    onPropertyClick?: (property: any) => void;
    onFavoriteToggle?: (propertyId: string) => void;
    onPropertyView?: (propertyId: string, property: any) => (() => void);
    onContactClick?: (propertyId: string, method: string) => void;
    favorites?: string[];
}

type ViewMode = 'compact' | 'comfortable' | 'spacious' | 'list';
type SortMode = 'price_asc' | 'price_desc' | 'newest' | 'area_desc' | 'relevance';

const GRID_CONFIGS = {
    compact: { columns: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', gap: 'gap-3', cardHeight: 'h-80' },
    comfortable: { columns: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', gap: 'gap-4', cardHeight: 'h-96' },
    spacious: { columns: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap: 'gap-6', cardHeight: 'h-[28rem]' },
    list: { columns: 'grid-cols-1', gap: 'gap-4', cardHeight: 'h-48' }
};

export default function GridOptimized({ 
    properties, 
    onPropertyClick, 
    onFavoriteToggle,
    onPropertyView,
    onContactClick,
    favorites = [] 
}: GridOptimizedProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
    const [sortMode, setSortMode] = useState<SortMode>('relevance');
    const [showCustomization, setShowCustomization] = useState(false);
    const [visibleItems, setVisibleItems] = useState(12);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const { ref: loadMoreInView, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px'
    });

    // Carregamento progressivo
    useEffect(() => {
        if (inView && visibleItems < properties.length) {
            setVisibleItems(prev => Math.min(prev + 12, properties.length));
        }
    }, [inView, visibleItems, properties.length]);

    // Propriedades processadas
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
        }
        
        return sorted.slice(0, visibleItems);
    }, [properties, sortMode, visibleItems]);

    const config = GRID_CONFIGS[viewMode];

    const PropertyCard = useCallback(({ property, index }: { property: any; index: number }) => {
        const [cardRef, cardInView] = useInView({
            threshold: 0.1,
            triggerOnce: true
        });

        const isFavorite = favorites.includes(property.id);
        const [viewTimeTracker, setViewTimeTracker] = useState<(() => void) | null>(null);

        useEffect(() => {
            if (cardInView && onPropertyView) {
                const tracker = onPropertyView(property.id, property);
                setViewTimeTracker(() => tracker);
            }
            
            return () => {
                if (viewTimeTracker) {
                    viewTimeTracker();
                }
            };
        }, [cardInView, property.id, onPropertyView, viewTimeTracker]);

        const handleShare = async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
                await navigator.share({
                    title: property.titulo,
                    text: `Confira este imóvel em ${property.bairro}`,
                    url: window.location.href + `/${property.slug || property.id}`
                });
            } catch {
                // Fallback para clipboard
                navigator.clipboard.writeText(window.location.href + `/${property.slug || property.id}`);
            }
        };

        if (viewMode === 'list') {
            return (
                <motion.div
                    ref={cardRef}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                        duration: 0.3 * animationSpeed, 
                        delay: (index % 6) * 0.05 * animationSpeed 
                    }}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => onPropertyClick?.(property)}
                >
                    <div className="flex flex-col sm:flex-row h-full">
                        {/* Imagem */}
                        <div className="relative h-48 sm:h-full sm:w-1/3 flex-shrink-0">
                            {property.imagemPrincipal && (
                                <img
                                    src={property.imagemPrincipal}
                                    alt={property.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            )}
                            
                            {property.destaque && (
                                <div className="absolute top-3 left-3">
                                    <div className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                        DESTAQUE
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {property.titulo}
                                </h3>
                                <p className="text-gray-600 mb-3 flex items-center gap-1">
                                    📍 {property.bairro}, Guararema
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    {property.quartos && (
                                        <div className="flex items-center gap-1">
                                            <span>🛏️</span>
                                            <span>{property.quartos}</span>
                                        </div>
                                    )}
                                    {property.banheiros && (
                                        <div className="flex items-center gap-1">
                                            <span>🚿</span>
                                            <span>{property.banheiros}</span>
                                        </div>
                                    )}
                                    {property.area && (
                                        <div className="flex items-center gap-1">
                                            <span>📐</span>
                                            <span>{property.area}m²</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-amber-600">
                                    {property.preco ? `R$ ${(property.preco / 1000).toFixed(0)}k` : 'Consulte'}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onContactClick?.(property.id, 'whatsapp');
                                        }}
                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                        title="WhatsApp"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onFavoriteToggle?.(property.id);
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${
                                            isFavorite 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        // Card mode (grid)
        return (
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                    duration: 0.3 * animationSpeed, 
                    delay: (index % 12) * 0.05 * animationSpeed 
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 overflow-hidden cursor-pointer ${config.cardHeight}`}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                                className={`p-2 backdrop-blur-sm border rounded-lg transition-all ${
                                    isFavorite 
                                        ? 'bg-red-500 border-red-500 text-white' 
                                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'whatsapp');
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                            >
                                WhatsApp
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContactClick?.(property.id, 'phone');
                                }}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                            >
                                Ligar
                            </button>
                        </div>
                    </div>

                    {property.destaque && (
                        <div className="absolute top-3 left-3">
                            <div className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">
                                DESTAQUE
                            </div>
                        </div>
                    )}
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                            {property.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            📍 {property.bairro}, Guararema
                        </p>
                    </div>

                    <div>
                        <div className="text-xl font-bold text-amber-600 mb-3">
                            {property.preco ? `R$ ${(property.preco / 1000).toFixed(0)}k` : 'Consulte'}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            {property.quartos && (
                                <div className="flex items-center gap-1">
                                    <span>🛏️</span>
                                    <span>{property.quartos}</span>
                                </div>
                            )}
                            {property.banheiros && (
                                <div className="flex items-center gap-1">
                                    <span>🚿</span>
                                    <span>{property.banheiros}</span>
                                </div>
                            )}
                            {property.area && (
                                <div className="flex items-center gap-1">
                                    <span>📐</span>
                                    <span>{property.area}m²</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }, [favorites, onPropertyClick, onFavoriteToggle, onPropertyView, onContactClick, animationSpeed, viewMode, config.cardHeight]);

    return (
        <div className="space-y-6">
            {/* Controles otimizados */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* View Mode */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Vista:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { mode: 'compact' as ViewMode, icon: Minimize2 },
                            { mode: 'comfortable' as ViewMode, icon: Grid3x3 },
                            { mode: 'spacious' as ViewMode, icon: Maximize2 },
                            { mode: 'list' as ViewMode, icon: List }
                        ].map(({ mode, icon: Icon }) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === mode
                                        ? 'bg-white shadow-sm text-amber-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort */}
                <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                    <option value="relevance">Relevância</option>
                    <option value="price_asc">Menor Preço</option>
                    <option value="price_desc">Maior Preço</option>
                    <option value="newest">Mais Recentes</option>
                    <option value="area_desc">Maior Área</option>
                </select>

                {/* Customização */}
                <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        showCustomization
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Settings className="w-4 h-4" />
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
                        className="bg-amber-50 rounded-xl border border-amber-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Personalização</h3>
                            <div className="text-sm text-gray-600">
                                Mostrando {processedProperties.length} de {properties.length}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Velocidade: {animationSpeed}x
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={animationSpeed}
                                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                    className="w-full accent-amber-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div className={`grid ${config.columns} ${config.gap}`}>
                {processedProperties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                ))}
            </div>

            {/* Load more trigger */}
            {visibleItems < properties.length && (
                <div ref={loadMoreInView} className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
            )}
        </div>
    );
}