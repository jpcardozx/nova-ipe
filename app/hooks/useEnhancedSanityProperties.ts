'use client';

import { useState, useEffect, useMemo } from 'react';
import { processProperties, ProcessedPropertyData } from '../components/PropertyProcessor';

export interface PropertyFilters {
    type: 'all' | 'sale' | 'rent';
    bedrooms: number | null;
    bathrooms: number | null;
    priceRange: [number, number] | null;
    areaRange: [number, number] | null;
    locations: string[] | null;
    showOnlyNew?: boolean;
}

export interface SortOptions {
    sortBy: 'price' | 'date' | 'area' | 'bedrooms';
    sortDirection: 'asc' | 'desc';
}

/**
 * Hook aprimorado para gerenciar propriedades do Sanity com filtragem e ordenação avançadas
 * 
 * @param properties Array de propriedades do Sanity
 * @param options Opções de configuração
 * @returns Objeto com propriedades processadas e estado de carregamento
 */
export function useEnhancedSanityProperties(
    properties: any[],
    options: {
        filters?: PropertyFilters;
        limit?: number;
        sortOptions?: SortOptions;
    } = {}
) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    // Opções com valores padrão
    const {
        filters = {
            type: 'all',
            bedrooms: null,
            bathrooms: null,
            priceRange: null,
            areaRange: null,
            locations: null
        },
        limit = undefined,
        sortOptions = { sortBy: 'date', sortDirection: 'desc' }
    } = options;

    // Estatísticas de propriedades para filtragem dinâmica
    const propertyStats = useMemo(() => {
        try {
            if (!properties || properties.length === 0) {
                return {
                    minPrice: 0,
                    maxPrice: 0,
                    minArea: 0,
                    maxArea: 0,
                    bedroomOptions: [],
                    bathroomOptions: [],
                    locationOptions: []
                };
            }

            // Processar todas as propriedades primeiro
            const processed = processProperties(properties);

            // Extrair estatísticas
            let minPrice = Infinity;
            let maxPrice = 0;
            let minArea = Infinity;
            let maxArea = 0;
            const bedroomsSet = new Set<number>();
            const bathroomsSet = new Set<number>();
            const locationsSet = new Set<string>();

            processed.forEach(prop => {
                // Preços
                if (prop.price < minPrice) minPrice = prop.price;
                if (prop.price > maxPrice) maxPrice = prop.price;

                // Área
                if (prop.area !== undefined) {
                    if (prop.area < minArea) minArea = prop.area;
                    if (prop.area > maxArea) maxArea = prop.area;
                }

                // Quartos
                if (prop.bedrooms !== undefined) {
                    bedroomsSet.add(prop.bedrooms);
                }

                // Banheiros
                if (prop.bathrooms !== undefined) {
                    bathroomsSet.add(prop.bathrooms);
                }

                // Localização
                if (prop.location) {
                    locationsSet.add(prop.location);
                }
            }); return {
                minPrice: minPrice !== Infinity ? minPrice : 0,
                maxPrice,
                minArea: minArea !== Infinity ? minArea : 0,
                maxArea,
                bedroomOptions: Array.from(bedroomsSet).sort((a, b) => a - b),
                bathroomOptions: Array.from(bathroomsSet).sort((a, b) => a - b),
                locationOptions: Array.from(locationsSet).sort(),
                totalProperties: processed.length
            };
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao processar estatísticas'));
            return {
                minPrice: 0,
                maxPrice: 0,
                minArea: 0,
                maxArea: 0,
                bedroomOptions: [],
                bathroomOptions: [],
                totalProperties: 0,
                locationOptions: []
            };
        }
    }, [properties]);

    // Processar propriedades com memoização
    const processedProperties = useMemo(() => {
        try {
            if (!properties || properties.length === 0) {
                return [];
            }

            // Processar todas as propriedades primeiro
            let result = processProperties(properties);

            // Aplicar filtro de tipo se necessário
            if (filters.type && filters.type !== 'all') {
                result = result.filter((p: ProcessedPropertyData) => p.propertyType === filters.type);
            }

            // Aplicar filtro de quartos se necessário
            if (filters.bedrooms !== undefined && filters.bedrooms !== null) {
                result = result.filter((p: ProcessedPropertyData) =>
                    p.bedrooms !== undefined && p.bedrooms === filters.bedrooms
                );
            }

            // Aplicar filtro de banheiros se necessário
            if (filters.bathrooms !== undefined && filters.bathrooms !== null) {
                result = result.filter((p: ProcessedPropertyData) =>
                    p.bathrooms !== undefined && p.bathrooms === filters.bathrooms
                );
            }

            // Aplicar filtro de faixa de preço se necessário
            if (filters.priceRange) {
                const [minPrice, maxPrice] = filters.priceRange;
                result = result.filter((p: ProcessedPropertyData) =>
                    p.price >= minPrice && p.price <= maxPrice
                );
            }

            // Aplicar filtro de faixa de área se necessário
            if (filters.areaRange) {
                const [minArea, maxArea] = filters.areaRange;
                result = result.filter((p: ProcessedPropertyData) =>
                    p.area !== undefined && p.area >= minArea && p.area <= maxArea
                );
            }

            // Aplicar filtro de localização se necessário
            if (filters.locations && filters.locations.length > 0) {
                result = result.filter((p: ProcessedPropertyData) =>
                    p.location && filters.locations?.includes(p.location)
                );
            }

            // Aplicar ordenação
            result = sortProperties(result, sortOptions.sortBy, sortOptions.sortDirection);

            // Aplicar limite se especificado
            if (limit && limit > 0) {
                result = result.slice(0, limit);
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao processar propriedades'));
            return [];
        }
    }, [properties, filters, limit, sortOptions]);

    // Atualizar estado de carregamento
    useEffect(() => {
        setIsLoading(false);
    }, [processedProperties]);

    // Gerar informações de ordenação para a UI
    const sortInfo = useMemo(() => {
        const sortLabels: Record<string, string> = {
            'price': 'Preço',
            'date': 'Data',
            'area': 'Área',
            'bedrooms': 'Quartos'
        };

        return {
            label: sortLabels[sortOptions.sortBy],
            direction: sortOptions.sortDirection
        };
    }, [sortOptions]);

    return {
        properties: processedProperties,
        stats: {
            ...propertyStats,
            sortInfo
        },
        isLoading,
        error,
        isEmpty: processedProperties.length === 0
    };
}

/**
 * Função auxiliar para ordenar propriedades
 */
function sortProperties(
    properties: ProcessedPropertyData[],
    sortBy: 'price' | 'date' | 'area' | 'bedrooms',
    direction: 'asc' | 'desc'
): ProcessedPropertyData[] {
    const factor = direction === 'asc' ? 1 : -1;

    return [...properties].sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return (a.price - b.price) * factor;

            case 'area':
                const areaA = a.area || 0;
                const areaB = b.area || 0;
                return (areaA - areaB) * factor;

            case 'bedrooms':
                const bedroomsA = a.bedrooms || 0;
                const bedroomsB = b.bedrooms || 0;
                return (bedroomsA - bedroomsB) * factor;

            case 'date':
            default:
                // Para data, assumimos que imóveis mais novos têm isNew=true
                // E que propriedades destacadas devem aparecer primeiro
                if (a.isNew && !b.isNew) return -1 * factor;
                if (!a.isNew && b.isNew) return 1 * factor;
                if (a.isPremium && !b.isPremium) return -1 * factor;
                if (!a.isPremium && b.isPremium) return 1 * factor;
                return 0;
        }
    });
}
