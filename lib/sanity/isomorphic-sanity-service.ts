// lib/sanity/isomorphic-sanity-service.ts
// Isomorphic Sanity Data Service - works in both Server and Client Components

import { createClient, type QueryParams } from "next-sanity";
import { projectId, dataset, apiVersion } from "../../studio/env";
import type { ImovelClient } from '../../src/types/imovel-client';
import { mapImovelToClient } from '@/lib/mapImovelToClient';

// Detect if we're on the server
const isServer = typeof window === 'undefined';

// Client-side memory cache for frequent queries
let memoryCache: Map<string, { data: any, timestamp: number }> | null = null;

if (!isServer) {
    memoryCache = new Map();
}

// Create appropriate client based on environment
const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !isServer, // Use CDN in browser, fresh data on server
    perspective: 'published',
    stega: { enabled: false },
    token: isServer ? process.env.SANITY_API_TOKEN : undefined,
    requestTagPrefix: 'nova-ipe',
    timeout: 20000,
});

// Isomorphic fetch function
export async function fetchWithIsomorphicCache<T>(
    query: string,
    params: QueryParams = {},
    options: {
        tags?: string[],
        revalidate?: number,
        maxAge?: number,
        forceFresh?: boolean,
    } = {}
): Promise<T> {
    const {
        tags = ['sanity'],
        revalidate = 3600,
        maxAge = 300000, // 5 minutes for client cache
        forceFresh = false,
    } = options;

    // Generate cache key
    const cacheKey = `sanity-${query}-${JSON.stringify(params)}`;

    // Client-side caching
    if (!isServer && memoryCache && !forceFresh) {
        const cached = memoryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < maxAge) {
            console.log('🎯 Client cache hit:', cacheKey.slice(0, 50) + '...');
            return cached.data as T;
        }
    }

    try {
        console.log('🔍 Executando query Sanity:', { 
            environment: isServer ? 'server' : 'client',
            query: query.slice(0, 100) + '...', 
            params,
            tags,
        });

        // Server-side: use Next.js cache features
        if (isServer) {
            const fetchOptions: any = {
                next: {
                    tags,
                    revalidate,
                }
            };

            const data = await sanityClient.fetch<T>(query, params, fetchOptions);
            
            console.log('✅ Server query success:', {
                resultCount: Array.isArray(data) ? data.length : 'single item',
                tags
            });
            
            return data;
        } 
        // Client-side: simple fetch with memory cache
        else {
            const data = await sanityClient.fetch<T>(query, params);
            
            // Store in client memory cache
            if (memoryCache) {
                memoryCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });

                // Clean old entries (simple LRU)
                if (memoryCache.size > 50) {
                    const oldestKey = memoryCache.keys().next().value;
                    if (oldestKey) {
                        memoryCache.delete(oldestKey);
                    }
                }
            }

            console.log('✅ Client query success:', {
                resultCount: Array.isArray(data) ? data.length : 'single item',
                cached: true
            });
            
            return data;
        }
    } catch (error) {
        console.error('❌ Sanity fetch error:', {
            environment: isServer ? 'server' : 'client',
            query: query.slice(0, 200) + '...',
            params,
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

// Optimized queries that work in both environments
export const isomorphicQueries = {
    // Featured properties
    getImoveisDestaque: async (limit: number = 6) => {
        return await fetchWithIsomorphicCache<any[]>(
            `*[_type == "imovel" && destaque == true && status == "disponivel"] | order(_createdAt desc)[0...${limit}] {
                _id, titulo, slug, preco, finalidade, tipoImovel, 
                bairro, cidade, dormitorios, banheiros, areaUtil, vagas, destaque,
                "imagem": { 
                    "asset": imagem.asset->, 
                    "_type": "image", 
                    "alt": imagem.alt, 
                    "url": imagem.asset->url 
                }
            }`,
            {},
            { tags: ['imoveis', 'destaque'], revalidate: 3600 }
        );
    },

    // Properties for rent
    getImoveisAluguel: async (limit: number = 6) => {
        return await fetchWithIsomorphicCache<any[]>(
            `*[_type == "imovel" && finalidade == "aluguel" && status == "disponivel"] | order(_createdAt desc)[0...${limit}] {
                _id, titulo, slug, preco, finalidade, tipoImovel, 
                bairro, cidade, dormitorios, banheiros, areaUtil, vagas, destaque,
                "imagem": { 
                    "asset": imagem.asset->, 
                    "_type": "image", 
                    "alt": imagem.alt, 
                    "url": imagem.asset->url 
                }
            }`,
            {},
            { tags: ['imoveis', 'aluguel'], revalidate: 3600 }
        );
    },

    // Single property by slug
    getImovelBySlug: async (slug: string): Promise<ImovelClient | null> => {
        const result = await fetchWithIsomorphicCache<any>(
            `*[_type == "imovel" && slug.current == $slug][0]{
                _id, titulo, slug, preco, finalidade, tipoImovel, 
                bairro, cidade, estado, endereco, cep, dormitorios, banheiros, areaUtil, areaTotal, vagas,
                destaque, caracteristicas, descricao, status, 
                "galeria": galeria[]{asset->, alt},
                "imagem": { 
                    "asset": imagem.asset->, 
                    "_type": "image", 
                    "alt": imagem.alt, 
                    "url": imagem.asset->url 
                },
                geolocalizacao, dataCadastro, dataAtualizacao
            }`,
            { slug },
            { tags: [`imovel:${slug}`], revalidate: 1800 }
        );
        return result ? mapImovelToClient(result) : null;
    }
};

// Server-only revalidation functions (only work on server)
export async function revalidateImoveis(type: 'all' | 'destaque' | 'aluguel' | 'venda' | string = 'all') {
    if (!isServer) {
        console.warn('⚠️ revalidateImoveis only works on server');
        return { revalidated: false, reason: 'client-side call' };
    }

    try {
        const { revalidateTag, revalidatePath } = await import('next/cache');
        
        const tags: string[] = [];

        if (type === 'all') {
            tags.push('imoveis');
            revalidatePath('/');
        } else if (['destaque', 'aluguel', 'venda'].includes(type)) {
            tags.push(`imoveis`, type);
        } else if (type.startsWith('slug:')) {
            const slug = type.replace('slug:', '');
            tags.push(`imovel:${slug}`);
            revalidatePath(`/imovel/${slug}`);
        }

        tags.forEach(tag => revalidateTag(tag));
        return { revalidated: true, tags };
    } catch (error) {
        console.error('❌ Revalidation error:', error);
        return { revalidated: false, error };
    }
}
