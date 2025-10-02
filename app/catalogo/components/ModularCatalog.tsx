/**
 * Catálogo Modular e Responsivo
 * Integração completa: Filtros Horizontais + Grid + Controles
 * Mobile-first design com otimizações de performance
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import HorizontalFilters, { type FilterState } from './filters/HorizontalFilters';
import PropertyGrid, { type ViewMode, type SortMode } from './grid/PropertyGrid';
import ViewControls from './grid/ViewControls';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useUserAnalytics } from '@/app/hooks/useUserAnalytics';

interface ModularCatalogProps {
    properties: any[];
    onSearch?: (query: string) => void;
}

export default function ModularCatalog({ properties, onSearch }: ModularCatalogProps) {
    // Estados locais
    const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
    const [sortMode, setSortMode] = useState<SortMode>('relevance');
    const [filters, setFilters] = useState<FilterState>({});
    
    // Hooks customizados
    const { favorites, toggleFavorite } = useFavorites();
    const analytics = useUserAnalytics();

    // Analytics de sessão
    useEffect(() => {
        analytics.trackAction({
            type: 'view',
            data: { page: 'catalog', totalProperties: properties.length }
        });
    }, [analytics, properties.length]);

    // Preparar propriedades com campo imagemPrincipal para compatibilidade
    const preparedProperties = useMemo(() => {
        const prepared = properties.map(property => {
            const imagemPrincipal = property.imagem?.imagemUrl || property.imagem?.asset?.url || '';
            
            return {
                ...property,
                // Adicionar imagemPrincipal para compatibilidade com PropertyCard
                imagemPrincipal,
                // Mapear campos para filtros - suporta tanto finalidade quanto tipoImovel
                tipo: property.finalidade || property.tipo,
                tipoImovel: property.tipoImovel,
                finalidade: property.finalidade,
                quartos: property.dormitorios || property.quartos,
                banheiros: property.banheiros,
                preco: property.preco
            };
        });
        
        // Debug apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development' && prepared.length > 0) {
            const withImages = prepared.filter(p => p.imagemPrincipal).length;
            console.log('📦 ModularCatalog preparou propriedades:', {
                total: prepared.length,
                comImagens: withImages,
                semImagens: prepared.length - withImages,
                percentual: `${Math.round((withImages / prepared.length) * 100)}%`
            });
        }
        
        return prepared;
    }, [properties]);

    // Aplicar filtros
    const filteredProperties = useMemo(() => {
        let filtered = [...preparedProperties];

        // Filtro de tipo - suporta finalidade (venda/aluguel) ou tipoImovel (casa/apartamento)
        if (filters.tipo) {
            const filterValue = filters.tipo.toLowerCase();
            filtered = filtered.filter(p => {
                const finalidade = p.finalidade?.toLowerCase();
                const tipoImovel = p.tipoImovel?.toLowerCase();
                const tipo = p.tipo?.toLowerCase();
                
                // Permite buscar por finalidade (venda/aluguel) ou tipo de imóvel (casa/apartamento)
                return finalidade === filterValue || 
                       tipoImovel === filterValue || 
                       tipo === filterValue;
            });
        }

        // Filtro de preço
        if (filters.priceMin !== undefined && filters.priceMin > 0) {
            filtered = filtered.filter(p => (p.preco || 0) >= filters.priceMin!);
        }
        if (filters.priceMax !== undefined && filters.priceMax > 0) {
            filtered = filtered.filter(p => (p.preco || 0) <= filters.priceMax!);
        }

        // Filtro de dormitórios
        if (filters.bedrooms) {
            const minBedrooms = parseInt(filters.bedrooms.replace('+', ''));
            filtered = filtered.filter(p => (p.quartos || 0) >= minBedrooms);
        }

        // Filtro de banheiros
        if (filters.bathrooms) {
            const minBathrooms = parseInt(filters.bathrooms.replace('+', ''));
            filtered = filtered.filter(p => (p.banheiros || 0) >= minBathrooms);
        }

        // Filtro de área mínima
        if (filters.areaMin !== undefined && filters.areaMin > 0) {
            filtered = filtered.filter(p => (p.area || 0) >= filters.areaMin!);
        }

        // Filtro de localização
        if (filters.location) {
            const location = filters.location.toLowerCase();
            filtered = filtered.filter(p => 
                p.bairro?.toLowerCase().includes(location) ||
                p.cidade?.toLowerCase().includes(location) ||
                p.endereco?.toLowerCase().includes(location)
            );
        }

        return filtered;
    }, [preparedProperties, filters]);

    // Handlers
    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        analytics.trackSearch('filter_change', newFilters, filteredProperties.length);
    };

    const handlePropertyClick = (property: any) => {
        window.location.href = `/imovel/${property.slug || property.id}`;
    };

    const handleFavoriteToggle = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        toggleFavorite(propertyId);
        if (property) {
            analytics.trackFavorite(propertyId, property);
        }
    };

    const handleContactClick = (propertyId: string, method: string) => {
        analytics.trackContact(method, propertyId);
        
        if (method === 'whatsapp') {
            const phone = '5511999999999'; // TODO: Pegar do settings
            const message = `Olá! Tenho interesse no imóvel ${propertyId}`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        } else if (method === 'phone') {
            window.open('tel:+5511999999999', '_self');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Filtros Horizontais */}
                <HorizontalFilters
                    onFilterChange={handleFilterChange}
                    activeFilters={filters}
                    totalResults={filteredProperties.length}
                />

                {/* Controles de Visualização */}
                <ViewControls
                    viewMode={viewMode}
                    sortMode={sortMode}
                    totalResults={filteredProperties.length}
                    onViewModeChange={setViewMode}
                    onSortModeChange={setSortMode}
                />

                {/* Grid de Propriedades */}
                <PropertyGrid
                    properties={filteredProperties}
                    viewMode={viewMode}
                    sortMode={sortMode}
                    onPropertyClick={handlePropertyClick}
                    onFavoriteToggle={handleFavoriteToggle}
                    onContactClick={handleContactClick}
                    favorites={Array.from(favorites)}
                />

                {/* Footer de resultados (mobile) */}
                <div className="lg:hidden sticky bottom-4 left-0 right-0 px-4">
                    <div className="bg-amber-500 text-white rounded-2xl shadow-2xl p-4 text-center">
                        <p className="font-bold text-lg">
                            {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel' : 'imóveis'} encontrado{filteredProperties.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
