// lib/hooks/useDataWithFallback.ts
import { useState, useEffect, useCallback } from 'react';
import type { ImovelClient } from '../../src/types/imovel-client';

interface UseDataWithFallbackOptions<T> {
    fetchFunction: () => Promise<T>;
    fallbackData: T;
    cacheKey: string;
    staleTime?: number;
    fallbackMessage?: string;
}

interface UseDataWithFallbackReturn<T> {
    data: T;
    status: 'loading' | 'success' | 'error' | 'fallback' | 'empty';
    error: string | null;
    retry: () => void;
    isFallback: boolean;
    message?: string;
}

export function useDataWithFallback<T>({
    fetchFunction,
    fallbackData,
    cacheKey,
    staleTime = 30 * 60 * 1000, // 30 minutes default
    fallbackMessage = '🔧 Dados de demonstração. Conectividade será restabelecida em breve.'
}: UseDataWithFallbackOptions<T>): UseDataWithFallbackReturn<T> {
    const [data, setData] = useState<T>(fallbackData);
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'fallback' | 'empty'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    const [isFallback, setIsFallback] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setStatus('loading');
            setError(null);
            setIsFallback(false);

            // Check cache first (only on client)
            if (typeof window !== 'undefined') {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    try {
                        const { data: cachedData, timestamp } = JSON.parse(cached);
                        if (Date.now() - timestamp < staleTime) {
                            console.log('📦 Usando dados do cache:', cacheKey);
                            setData(cachedData);
                            setStatus(Array.isArray(cachedData) && cachedData.length > 0 ? 'success' : 'empty');
                            return;
                        }
                    } catch (cacheError) {
                        console.warn('⚠️ Erro ao ler cache:', cacheError);
                        // Continue with fresh fetch
                    }
                }
            }

            console.log('🔍 Buscando dados:', cacheKey);
            const fetchedData = await fetchFunction();
            
            console.log('✅ Dados recebidos:', Array.isArray(fetchedData) ? `${fetchedData.length} itens` : 'item único');

            setData(fetchedData);
            
            // Determine status based on data content
            if (Array.isArray(fetchedData)) {
                setStatus(fetchedData.length > 0 ? 'success' : 'empty');
            } else if (fetchedData) {
                setStatus('success');
            } else {
                setStatus('empty');
            }

            // Cache successful results (only on client)
            if (typeof window !== 'undefined' && fetchedData) {
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify({ 
                        data: fetchedData, 
                        timestamp: Date.now() 
                    }));
                } catch (cacheError) {
                    console.warn('⚠️ Erro ao salvar no cache:', cacheError);
                }
            }

        } catch (err) {
            console.error('❌ Erro ao buscar dados:', err);
            
            // Try to get from cache even if stale
            if (typeof window !== 'undefined') {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    try {
                        const { data: cachedData } = JSON.parse(cached);
                        console.log('🔄 Usando dados em cache (stale) como fallback');
                        setData(cachedData);
                        setStatus('success');
                        setError(`Usando dados em cache devido a erro de conectividade: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
                        return;
                    } catch (cacheError) {
                        console.warn('⚠️ Erro ao ler cache stale:', cacheError);
                    }
                }
            }

            // Use fallback data as last resort
            console.log('🔧 Usando dados de fallback');
            setData(fallbackData);
            setStatus('fallback');
            setIsFallback(true);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        }
    }, [fetchFunction, fallbackData, cacheKey, staleTime]);

    useEffect(() => {
        fetchData();
    }, [fetchData, retry]);

    const retryFunction = useCallback(() => {
        setRetry(r => r + 1);
    }, []);

    return {
        data,
        status,
        error,
        retry: retryFunction,
        isFallback,
        message: isFallback ? fallbackMessage : undefined
    };
}
