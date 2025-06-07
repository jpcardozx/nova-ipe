'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import PropertyDebugger from './PropertyDebugger';
import { XCircle } from 'lucide-react';

interface PropertiesGridProps {
    properties: any[];
    stats: {
        totalProperties: number;
        [key: string]: any;
    };
    isLoading: boolean;
    resetFilters: () => void;
    onFavoriteToggle?: (id: string) => void;
}

export default function ImprovedPropertiesGrid({
    properties,
    stats,
    isLoading,
    resetFilters,
    onFavoriteToggle
}: PropertiesGridProps) {
    if (isLoading) {
        return <PropertiesLoadingSkeleton />;
    }
    if (properties.length === 0) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-10 text-center shadow-inner">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-md">
                        <XCircle className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-amber-700 mb-3">Nenhum imóvel encontrado</h3>
                    <p className="text-amber-600 mb-6">Não encontramos imóveis que correspondam aos critérios de filtro que você selecionou. Tente modificar seus filtros para ver mais opções.</p>
                    <button
                        onClick={resetFilters}
                        className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow hover:shadow-md"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Limpar todos os filtros
                    </button>
                </div>
            </div>
        );
    } return (
        <>
            {/* Componente de diagnóstico só visível em desenvolvimento */}
            <PropertyDebugger properties={properties} />

            {/* Grid de imóveis com animação */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {properties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                                delay: Math.min(index * 0.1, 0.5),
                                duration: 0.4,
                                ease: [0.25, 0.1, 0.25, 1.0]
                            }}
                            layout
                            className="flex"
                        >              <PropertyCardUnified
                                id={property.id}
                                title={property.title}
                                slug={property.slug}
                                location={property.location}
                                city={property.city}
                                price={property.price}
                                propertyType={property.propertyType}
                                area={property.area}
                                bedrooms={property.bedrooms}
                                bathrooms={property.bathrooms}
                                parkingSpots={property.parkingSpots}
                                mainImage={property.mainImage}
                                isHighlight={property.isHighlight}
                                isPremium={property.isPremium}
                                isNew={property.isNew}
                                isFavorite={property.isFavorite}
                                onFavoriteToggle={onFavoriteToggle}
                                className="w-full h-full"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Contador de resultados e indicador de ordenação */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-center gap-3 text-sm text-gray-500">
                <div>
                    Exibindo <span className="font-medium text-gray-700">{properties.length}</span> de{" "}
                    {stats.totalProperties} imóveis disponíveis
                </div>
                {stats.sortInfo && (
                    <div className="flex items-center px-3 py-1 bg-amber-50 rounded-full">
                        <span className="text-amber-700">
                            {stats.sortInfo.label} {stats.sortInfo.direction === 'asc' ? '↑' : '↓'}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}

// Componente de esqueleto de carregamento aprimorado
const PropertiesLoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    {/* Imagem */}
                    <div className="relative h-56 bg-gradient-to-r from-gray-200 to-gray-100">
                        {/* Tag simulada */}
                        <div className="absolute top-3 left-3 h-6 w-16 bg-green-100 rounded-full"></div>
                        {/* Tipo simulado */}
                        <div className="absolute top-3 right-3 h-6 w-20 bg-amber-100 rounded-full"></div>
                        {/* Preço simulado */}
                        <div className="absolute bottom-3 left-3 h-8 w-32 bg-gradient-to-r from-gray-800/50 to-gray-600/50 rounded-md"></div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5">
                        {/* Título */}
                        <div className="h-7 bg-gray-200 rounded-md w-4/5 mb-2"></div>

                        {/* Localização */}
                        <div className="h-5 bg-gray-100 rounded-md w-3/5 mb-4"></div>

                        {/* Características */}
                        <div className="py-3 px-1 my-3 border-y border-gray-100">
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map(j => (
                                    <div key={j} className="flex flex-col items-center space-y-1">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                                        <div className="h-3 w-6 bg-gray-200 rounded-md"></div>
                                        <div className="h-2 w-12 bg-gray-100 rounded-md"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botão */}
                        <div className="flex justify-end mt-3">
                            <div className="h-5 w-24 bg-amber-100 rounded-md"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-6 flex justify-center">
            <div className="h-5 w-44 bg-gray-100 rounded-md"></div>
        </div>
    </div>
);
