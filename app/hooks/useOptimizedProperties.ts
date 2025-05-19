'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ImovelClient } from '@/types/imovel-client';

interface UseOptimizedPropertiesOptions {
    limit?: number;
    sortBy?: 'price' | 'date' | 'relevance';
    sortDirection?: 'asc' | 'desc';
    filterByType?: 'Venda' | 'Aluguel' | 'Temporada';
    filterByFeature?: string[];
    preloadCount?: number;
}

interface PropertyFeatures {
    minPrice: number;
    maxPrice: number;
    minArea: number;
    maxArea: number;
    bedroomCounts: number[];
    bathroomCounts: number[];
    cities: string[];
    neighborhoods: string[];
}

interface UseOptimizedPropertiesResult {
    properties: ImovelClient[];
    isLoading: boolean;
    hasMore: boolean;
    features: PropertyFeatures;
    loadMore: () => void;
    error: Error | null;
    stats: {
        totalProperties: number;
        loadedCount: number;
        renderTime: number;
    };
}

/**
 * Custom hook for optimized property loading with performance optimizations
 * - Progressive loading with pagination
 * - Memoized data processing 
 * - Performance metrics tracking
 * - Feature extraction for filters
 */
export function useOptimizedProperties(
    getPropertiesFunction: () => Promise<ImovelClient[]>,
    options: UseOptimizedPropertiesOptions = {}
): UseOptimizedPropertiesResult {
    const [allProperties, setAllProperties] = useState<ImovelClient[]>([]);
    const [displayedProperties, setDisplayedProperties] = useState<ImovelClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [startTime] = useState(() => performance.now());
    const [renderTime, setRenderTime] = useState(0);

    // Options with defaults
    const {
        limit = 12,
        sortBy = 'relevance',
        sortDirection = 'desc',
        filterByType,
        filterByFeature,
        preloadCount = 6
    } = options;

    // Load properties with performance tracking
    useEffect(() => {
        const loadProperties = async () => {
            try {
                const fetchStart = performance.now();
                const data = await getPropertiesFunction();
                const fetchTime = performance.now() - fetchStart;

                // Log performance metrics
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Performance] Properties fetch time: ${Math.round(fetchTime)}ms`);
                }

                setAllProperties(data);

                // Initial batch of properties
                const initialBatch = processProperties(data, {
                    limit: preloadCount,
                    sortBy,
                    sortDirection,
                    filterByType,
                    filterByFeature
                });

                setDisplayedProperties(initialBatch);
                setRenderTime(performance.now() - startTime);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
                console.error('Error fetching properties:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, [getPropertiesFunction, filterByType, filterByFeature, preloadCount, sortBy, sortDirection, startTime]);

    // Process and sort properties based on options
    const processProperties = useCallback((
        properties: ImovelClient[],
        options: UseOptimizedPropertiesOptions
    ): ImovelClient[] => {
        // Filter properties if needed
        let filtered = [...properties];

        if (options.filterByType) {
            filtered = filtered.filter(p => p.finalidade === options.filterByType);
        } if (options.filterByFeature && options.filterByFeature.length > 0) {
            filtered = filtered.filter(p => {
                return options.filterByFeature?.some(feature =>
                    p.caracteristicas?.includes(feature) ||
                    (feature === 'garden' && Boolean(p.possuiJardim)) ||
                    (feature === 'pool' && Boolean(p.possuiPiscina)) ||
                    (feature === 'garage' && p.vagas && p.vagas > 0)
                );
            });
        }

        // Sort properties
        const sorted = [...filtered].sort((a, b) => {
            if (options.sortBy === 'price') {
                return options.sortDirection === 'asc'
                    ? (a.preco || 0) - (b.preco || 0)
                    : (b.preco || 0) - (a.preco || 0);
            }

            if (options.sortBy === 'date') {
                const dateA = a.dataPublicacao ? new Date(a.dataPublicacao).getTime() : 0;
                const dateB = b.dataPublicacao ? new Date(b.dataPublicacao).getTime() : 0;
                return options.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Default sort by relevance (featured/highlight items first)
            return a.destaque && !b.destaque ? -1 : b.destaque && !a.destaque ? 1 : 0;
        });

        // Apply limit
        return options.limit ? sorted.slice(0, options.limit) : sorted;
    }, []);

    // Load more properties
    const loadMore = useCallback(() => {
        if (displayedProperties.length < allProperties.length) {
            setDisplayedProperties(prev => {
                const currentCount = prev.length;
                const nextBatch = processProperties(allProperties, {
                    limit: currentCount + limit,
                    sortBy,
                    sortDirection,
                    filterByType,
                    filterByFeature
                });
                return nextBatch;
            });
        }
    }, [allProperties, displayedProperties.length, filterByFeature, filterByType, limit, processProperties, sortBy, sortDirection]);

    // Extract property features for filtering
    const features = useMemo(() => {
        // Skip if still loading
        if (isLoading || allProperties.length === 0) {
            return {
                minPrice: 0,
                maxPrice: 0,
                minArea: 0,
                maxArea: 0,
                bedroomCounts: [],
                bathroomCounts: [],
                cities: [],
                neighborhoods: []
            };
        }

        const prices = allProperties.map(p => p.preco || 0).filter(p => p > 0);
        const areas = allProperties.map(p => p.areaUtil || 0).filter(a => a > 0);

        // Get unique bedroom and bathroom counts
        const bedrooms = [...new Set(allProperties
            .map(p => p.dormitorios)
            .filter(Boolean) as number[])]
            .sort((a, b) => a - b);

        const bathrooms = [...new Set(allProperties
            .map(p => p.banheiros)
            .filter(Boolean) as number[])]
            .sort((a, b) => a - b);

        // Get unique cities and neighborhoods
        const cities = [...new Set(allProperties
            .map(p => p.cidade)
            .filter(Boolean) as string[])];

        const neighborhoods = [...new Set(allProperties
            .map(p => p.bairro)
            .filter(Boolean) as string[])];

        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            minArea: Math.min(...areas),
            maxArea: Math.max(...areas),
            bedroomCounts: bedrooms,
            bathroomCounts: bathrooms,
            cities,
            neighborhoods
        };
    }, [allProperties, isLoading]);

    // Statistics for monitoring
    const stats = useMemo(() => ({
        totalProperties: allProperties.length,
        loadedCount: displayedProperties.length,
        renderTime
    }), [allProperties.length, displayedProperties.length, renderTime]);

    return {
        properties: displayedProperties,
        isLoading,
        hasMore: displayedProperties.length < allProperties.length,
        features,
        loadMore,
        error,
        stats
    };
}
