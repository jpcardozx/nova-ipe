import React, { useState } from 'react';
'use client';

import { motion } from 'framer-motion';

interface Property {
    id: string;
    title: string;
    location?: string;
    city?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    mainImage?: {
        url: string;
        alt: string;
    };
    isPremium?: boolean;
    isNew?: boolean;
}

/**
 * Componente Client para a parte interativa da exibição de propriedades
 * Responsável apenas pela interatividade, não pela busca de dados
 */
export function PropertyClient({ properties }: { properties: Property[] }) {
    // State para filtros, favoritos, etc.
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Toggle para favoritos com tratamento de erro
    const toggleFavorite = (id: string) => {
        try {
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                if (newFavorites.has(id)) {
                    newFavorites.delete(id);
                } else {
                    newFavorites.add(id);
                }
                return newFavorites;
            });
        } catch (error) {
            console.error('Erro ao adicionar aos favoritos:', error);
        }
    };

    if (properties.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    Em breve, novos imóveis
                </h3>
                <p className="text-slate-500">
                    Estamos preparando uma seleção especial para você. Entre em contato para ser o primeiro a saber!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
                <motion.div
                    key={property.id || index}
                    className="group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-blue-200">
                        {/* Image */}
                        <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                            {property.mainImage && (
                                <img
                                    src={property.mainImage.url}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                            )}
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                {property.isPremium && (
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                        Destaque
                                    </span>
                                )}
                                {property.isNew && (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                        Novo
                                    </span>
                                )}
                            </div>

                            {/* Favorite button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(property.id);
                                }}
                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill={favorites.has(property.id) ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    className={`w-5 h-5 ${favorites.has(property.id) ? 'text-red-500' : 'text-gray-600'}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                {property.title}
                            </h3>
                            <p className="text-slate-600 mb-4 flex items-center">
                                <span className="mr-2">📍</span>
                                {property.location}, {property.city}
                            </p>

                            {/* Features */}
                            <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
                                <div className="flex items-center space-x-4">
                                    {property.bedrooms && (
                                        <span className="flex items-center">
                                            <span className="mr-1">🛏️</span> {property.bedrooms}
                                        </span>
                                    )}
                                    {property.bathrooms && (
                                        <span className="flex items-center">
                                            <span className="mr-1">🚿</span> {property.bathrooms}
                                        </span>
                                    )}
                                    {property.area && (
                                        <span className="flex items-center">
                                            <span className="mr-1">📐</span> {property.area}m²
                                        </span>
                                    )}
                                </div>
                            </div>                            {/* Price and CTA */}
                            <div className="flex justify-between items-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Consulte'}
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-semibold">
                                    Analisar Investimento
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
