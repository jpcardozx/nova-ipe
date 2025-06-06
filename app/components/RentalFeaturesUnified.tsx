'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { OptimizedIcons } from '@/app/utils/optimized-icons';
import { cn } from '@/lib/utils';
import type { ImovelClient } from '../../src/types/imovel-client';

interface RentalFeaturesProps {
    imoveis: ImovelClient[];
    className?: string;
}

interface FilterOption {
    id: string;
    label: string;
    value: string;
    count?: number;
}

const RentalFeaturesUnified: React.FC<RentalFeaturesProps> = ({
    imoveis,
    className = ''
}) => {
    const [filteredImoveis, setFilteredImoveis] = useState<ImovelClient[]>(imoveis);
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Handlers para favoritos
    const handleToggleFavorite = (id: string) => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];

            if (favorites.includes(id)) {
                const index = favorites.indexOf(id);
                favorites.splice(index, 1);
            } else {
                favorites.push(id);
            }

            localStorage.setItem('property-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Erro ao processar favoritos:', error);
        }
    };

    const isFavorite = (id: string): boolean => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            const favorites = JSON.parse(savedFavorites) as string[];
            return favorites.includes(id);
        } catch {
            return false;
        }
    };    // Filtros disponíveis
    const filterOptions: FilterOption[] = [
        { id: 'all', label: 'Todos', value: 'all', count: imoveis.length },
        { id: 'house', label: 'Casas', value: 'Casa', count: imoveis.filter(i => i.tipoImovel === 'Casa').length },
        { id: 'apartment', label: 'Apartamentos', value: 'Apartamento', count: imoveis.filter(i => i.tipoImovel === 'Apartamento').length },
        { id: 'commercial', label: 'Comercial', value: 'Comercial', count: imoveis.filter(i => i.tipoImovel === 'Comercial').length },
    ];

    // Opções de ordenação
    const sortOptions = [
        { value: 'relevance', label: 'Relevância' },
        { value: 'price_low', label: 'Menor preço' },
        { value: 'price_high', label: 'Maior preço' },
        { value: 'newest', label: 'Mais recentes' },
        { value: 'area_large', label: 'Maior área' },
    ];

    // Aplicar filtros e ordenação
    useEffect(() => {
        let filtered = [...imoveis];        // Aplicar filtro de tipo
        if (activeFilter !== 'all') {
            filtered = filtered.filter(imovel =>
                imovel.tipoImovel === activeFilter
            );
        }

        // Aplicar ordenação
        switch (sortBy) {
            case 'price_low':
                filtered.sort((a, b) => (a.preco || 0) - (b.preco || 0));
                break;
            case 'price_high':
                filtered.sort((a, b) => (b.preco || 0) - (a.preco || 0));
                break;
            case 'area_large':
                filtered.sort((a, b) => (b.areaUtil || 0) - (a.areaUtil || 0));
                break; case 'newest':
                filtered.sort((a, b) => new Date(b.dataPublicacao || 0).getTime() - new Date(a.dataPublicacao || 0).getTime());
                break;
            default:
                // Manter ordem original (relevância)
                break;
        }

        setFilteredImoveis(filtered);
    }, [imoveis, activeFilter, sortBy]);

    return (
        <div className={cn("space-y-8", className)}>
            {/* Header com Estatísticas */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-8 border border-emerald-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                            {imoveis.length}
                        </div>
                        <div className="text-emerald-800 font-medium">Imóveis Disponíveis</div>
                        <div className="text-emerald-600 text-sm">Documentação verificada</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-teal-600 mb-2">
                            R$ {Math.round(imoveis.reduce((acc, i) => acc + (i.preco || 0), 0) / imoveis.length).toLocaleString()}
                        </div>
                        <div className="text-teal-800 font-medium">Preço Médio</div>
                        <div className="text-teal-600 text-sm">Valores competitivos</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                            24h
                        </div>
                        <div className="text-emerald-800 font-medium">Resposta Média</div>
                        <div className="text-emerald-600 text-sm">Atendimento rápido</div>
                    </div>
                </div>
            </div>

            {/* Filtros e Controles */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                {/* Filtros de Tipo */}
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => setActiveFilter(option.value)}
                            className={cn(
                                "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
                                activeFilter === option.value
                                    ? "bg-emerald-500 text-white shadow-lg"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
                            )}
                        >
                            <span>{option.label}</span>
                            {option.count && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-md text-xs",
                                    activeFilter === option.value
                                        ? "bg-emerald-600 text-white"
                                        : "bg-neutral-200 text-neutral-600"
                                )}>
                                    {option.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Controles de Visualização e Ordenação */}
                <div className="flex items-center gap-4">
                    {/* Ordenação */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Toggle de Visualização */}
                    <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all duration-200",
                                viewMode === 'grid'
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                <div className="bg-current rounded-sm"></div>
                                <div className="bg-current rounded-sm"></div>
                                <div className="bg-current rounded-sm"></div>
                                <div className="bg-current rounded-sm"></div>
                            </div>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all duration-200",
                                viewMode === 'list'
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <div className="w-4 h-4 flex flex-col gap-0.5">
                                <div className="bg-current h-0.5 rounded-full"></div>
                                <div className="bg-current h-0.5 rounded-full"></div>
                                <div className="bg-current h-0.5 rounded-full"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Resultados */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-neutral-900">
                        {filteredImoveis.length === imoveis.length
                            ? `${filteredImoveis.length} imóveis encontrados`
                            : `${filteredImoveis.length} de ${imoveis.length} imóveis`
                        }
                    </h3>

                    {activeFilter !== 'all' && (
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            <span>Limpar filtros</span>
                            <OptimizedIcons.XCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {filteredImoveis.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-16 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300"
                        >
                            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <OptimizedIcons.Search className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                                Nenhum imóvel encontrado
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                Tente ajustar os filtros ou entre em contato conosco para mais opções.
                            </p>
                            <button
                                onClick={() => setActiveFilter('all')}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                            >
                                Ver todos os imóveis
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                                "gap-8",
                                viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    : "flex flex-col"
                            )}
                        >
                            {filteredImoveis.map(imovel => (
                                <motion.div
                                    key={imovel._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <PropertyCardUnified
                                        id={imovel._id}
                                        title={imovel.titulo || 'Imóvel para alugar'}
                                        slug={imovel.slug as string || imovel._id}
                                        location={imovel.bairro || ''}
                                        city={imovel.cidade}
                                        price={imovel.preco || 0}
                                        propertyType="rent"
                                        area={imovel.areaUtil}
                                        bedrooms={imovel.dormitorios}
                                        bathrooms={imovel.banheiros}
                                        parkingSpots={imovel.vagas}
                                        mainImage={{
                                            url: imovel.imagem?.imagemUrl || '',
                                            alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel para alugar',
                                            sanityImage: imovel.imagem
                                        }}
                                        isHighlight={imovel.destaque}
                                        isFavorite={isFavorite(imovel._id)}
                                        onFavoriteToggle={handleToggleFavorite}
                                        className={viewMode === 'list' ? 'lg:flex lg:gap-6' : ''}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Call to Action */}
            {filteredImoveis.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        Não encontrou o que procurava?
                    </h3>
                    <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                        Temos outras opções disponíveis que podem não estar listadas online.
                        Entre em contato e encontraremos o imóvel ideal para você.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2 justify-center">
                            <OptimizedIcons.Phone className="w-5 h-5" />
                            <span>Ligar Agora</span>
                        </button>
                        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors border border-emerald-400 flex items-center gap-2 justify-center">
                            <OptimizedIcons.ArrowRight className="w-5 h-5" />
                            <span>Solicitar Contato</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentalFeaturesUnified;
