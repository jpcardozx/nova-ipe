// lib/sanity/development-proxy.ts
'use client';

/**
 * This is a utility for local development to avoid CORS issues
 * that proxies Sanity requests through a local API endpoint
 */

export async function fetchSanityWithProxy<T = any>(
    query: string,
    params: Record<string, any> = {}
): Promise<T> {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const useMockData = isDevelopment && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

        // Em modo de desenvolvimento, verificar se devemos usar dados mockados
        if (useMockData) {
            console.log('Usando dados mockados para desenvolvimento');
            const { mockImoveisDestaque, mockImoveisAluguel } = await import('../mock-data');

            // Retornar dados mockados com base na consulta
            if (query.includes('destaque == true')) {
                return mockImoveisDestaque as T;
            } else if (query.includes('finalidade == "Aluguel"')) {
                return mockImoveisAluguel as T;
            } else {
                return [] as unknown as T;
            }
        }
        // Caso contrário, usar proxy em desenvolvimento
        else if (isDevelopment) {
            try {
                // In development, use the proxy to avoid CORS issues
                const response = await fetch('/api/sanity-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, params }),
                    signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
                });

                if (!response.ok) {
                    throw new Error(`Proxy request failed with status ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'Unknown error from Sanity proxy');
                }

                return result.data;
            } catch (error) {
                console.warn('Falha no proxy, usando dados mockados:', error);
                const { mockImoveisDestaque, mockImoveisAluguel } = await import('../mock-data');

                // Fallback para dados mockados em caso de erro
                if (query.includes('destaque == true')) {
                    return mockImoveisDestaque as T;
                } else if (query.includes('finalidade == "Aluguel"')) {
                    return mockImoveisAluguel as T;
                } else {
                    return [] as unknown as T;
                }
            }
        } else {
            // In production, use the standard client-side fetch logic
            // This would be imported from your main Sanity client
            const { sanityClient } = await import('./sanity.client');
            return sanityClient.fetch<T>(query, params);
        }
    } catch (error) {
        console.error('Error fetching from Sanity:', error);
        // Return an empty result with appropriate shape based on the expected return type
        return ([] as unknown) as T;
    }
}
