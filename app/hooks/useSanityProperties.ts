'use client';

import { useState, useEffect, useMemo } from 'react';
import { processProperties, ProcessedPropertyData } from '../components/PropertyProcessor';

/**
 * Hook personalizado para carregar e processar propriedades do Sanity com memoização
 * 
 * @param properties Array de propriedades do Sanity
 * @param options Opções de configuração
 * @returns Objeto com propriedades processadas e estado de carregamento
 */
export function useSanityProperties(
    properties: any[],
    options: {
        filterType?: 'all' | 'sale' | 'rent';
        limit?: number;
        sortBy?: 'price' | 'date' | 'area';
        sortDirection?: 'asc' | 'desc';
    } = {}
) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Opções com valores padrão
    const {
        filterType = 'all',
        limit = undefined,
        sortBy = 'date',
        sortDirection = 'desc'
    } = options;

    // Processar propriedades com memoização
    const processedProperties = useMemo(() => {
        try {
            if (!properties || properties.length === 0) {
                return [];
            }

            // Processar todas as propriedades primeiro
            let result = processProperties(properties);            // Aplicar filtro de tipo se necessário
            if (filterType !== 'all') {
                result = result.filter((p: ProcessedPropertyData) => p.propertyType === filterType);
            }

            // Aplicar ordenação
            result = sortProperties(result, sortBy, sortDirection);

            // Aplicar limite se especificado
            if (limit && limit > 0) {
                result = result.slice(0, limit);
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao processar propriedades'));
            return [];
        }
    }, [properties, filterType, limit, sortBy, sortDirection]);

    // Atualizar estado de carregamento
    useEffect(() => {
        setIsLoading(false);
    }, [processedProperties]);

    return {
        properties: processedProperties,
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
    sortBy: 'price' | 'date' | 'area',
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
            case 'date':
            default:
                // Para data, assumimos que imóveis mais novos têm isNew=true
                // E que propriedades destacadas devem aparecer primeiro
                if (a.isNew && !b.isNew) return -1 * factor;
                if (!a.isNew && b.isNew) return 1 * factor;
                if (a.isHighlight && !b.isHighlight) return -1 * factor;
                if (!a.isHighlight && b.isHighlight) return 1 * factor;
                return 0;
        }
    });
}
