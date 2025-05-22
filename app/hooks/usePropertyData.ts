'use client';

import { useState, useEffect } from 'react';
import type { ImovelClient } from '@/types/imovel-client';

// Helper function to normalize documents
function normalizeDocuments<T>(docs: any[]): T[] {
    if (!Array.isArray(docs)) return [];
    return docs.filter(doc => doc && typeof doc === 'object');
}

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const propertyCache = new Map<string, { data: ImovelClient[]; timestamp: number }>();

export function usePropertyData(endpoint: string) {
    const [data, setData] = useState<ImovelClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check cache first
                const cached = propertyCache.get(endpoint);
                if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
                    setData(cached.data);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData = await response.json();
                const normalized = normalizeDocuments<ImovelClient>(jsonData);

                // Update cache
                propertyCache.set(endpoint, {
                    data: normalized,
                    timestamp: Date.now()
                });

                setData(normalized);
                setError(null);
            } catch (err) {
                console.error(`Error fetching data from ${endpoint}:`, err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, isLoading, error };
}
