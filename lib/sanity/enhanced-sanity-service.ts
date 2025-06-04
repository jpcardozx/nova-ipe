//
// Enhanced Sanity Data Service with sophisticated caching and performance optimizations
// This module provides high-performance data fetching capabilities for Nova-IPE
//

import { createClient, type QueryParams, type FilteredResponseQueryOptions } from "next-sanity";
import { projectId, dataset, apiVersion } from "../../studio/env";
import { revalidateTag, revalidatePath } from "next/cache";
import { unstable_cache } from 'next/cache';
import { LRUCache } from 'lru-cache';
import type { ImovelClient } from '../../src/types/imovel-client';
import { mapImovelToClient } from '@/lib/mapImovelToClient';

// Create a memory cache for very frequent queries to avoid hitting the Next.js cache
// This will reduce memory pressure on the server's persistent cache
const memoryCache = new LRUCache<string, any>({
    max: 100, // Maximum number of items to store
    ttl: 1000 * 60 * 5, // Keep items in memory for 5 minutes
    allowStale: true, // Allow returning stale items while revalidating 
});

// Enhanced server client with advanced options
export const enhancedServerClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Always fetch fresh content on the server
    perspective: 'published',
    stega: { enabled: false },
    token: process.env.SANITY_API_TOKEN,

    // Advanced configuration
    requestTagPrefix: 'nova-ipe-server',
    timeout: 20000, // 20 second timeout
    withCredentials: true, // Include credentials (cookies) with the request    // Retry configuration for more reliable data fetching
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000), // Exponential backoff with max 3s
    maxRetries: 3, // Maximum 3 retry attempts
});

// Query function with multiple caching layers
export async function fetchWithOptimizedCache<T>(
    query: string,
    params: QueryParams = {},
    options: {
        tags?: string[],
        revalidate?: number | false,
        dedupingInterval?: number,
        forceFresh?: boolean,
    } = {}
): Promise<T> {
    // Define default options
    const {
        tags = ['sanity'],
        revalidate = 3600, // Default to 1 hour cache
        dedupingInterval = 5000, // Dedupe identical requests within 5s
        forceFresh = false,
    } = options;

    // Generate cache key based on query and params
    const cacheKey = `sanity-${query}-${JSON.stringify(params)}`;

    // First check in-memory cache for very recent identical queries
    const memCached = memoryCache.get(cacheKey);
    if (memCached && !forceFresh) {
        return memCached as T;
    }

    try {        // Use Next.js unstable_cache with tags for revalidation
        const fetchFunction = async () => {
            // Check if we should force fresh data
            const fetchOptions: FilteredResponseQueryOptions = {
                cache: forceFresh ? 'no-store' : 'default',
                next: {
                    // Apply tags for revalidation - revalidate is handled by unstable_cache
                    tags,
                },
            };

            // Execute the actual query
            const result = await enhancedServerClient.fetch<T>(query, params, fetchOptions);

            // Store in memory cache for very frequent repeated queries
            memoryCache.set(cacheKey, result);

            return result;
        };

        // Use Next.js cache with tags for revalidation
        return await unstable_cache(
            fetchFunction,
            [cacheKey],
            {
                tags,
                revalidate,
            }
        )();
    } catch (error) {
        console.error(`[SanityFetchError] Query failed:`, error);
        throw new Error(`Failed to fetch from Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Optimized versions of the most common queries
export const optimizedQueries = {
    // Featured properties with efficient projection
    getImoveisDestaque: async (limit: number = 6) => {
        return await fetchWithOptimizedCache<any[]>(
            `*[_type == "imovel" && destaque == true && status == "disponivel"] | order(_createdAt desc)[0...${limit}] {
        _id, titulo, slug, preco, finalidade, tipoImovel, 
        bairro, cidade, dormitorios, banheiros, areaUtil, vagas, destaque,
        "imagem": { "asset": imagem.asset->, "_type": "image", "alt": imagem.alt, "url": imagem.asset->url }
      }`,
            {},
            { tags: ['imoveis', 'destaque'], revalidate: 3600 }
        );
    },

    // Property for rent with efficient projection
    getImoveisAluguel: async (limit: number = 6) => {
        return await fetchWithOptimizedCache<any[]>(
            `*[_type == "imovel" && finalidade == "aluguel" && status == "disponivel"] | order(_createdAt desc)[0...${limit}] {
        _id, titulo, slug, preco, finalidade, tipoImovel, 
        bairro, cidade, dormitorios, banheiros, areaUtil, vagas, destaque,
        "imagem": { "asset": imagem.asset->, "_type": "image", "alt": imagem.alt, "url": imagem.asset->url }
      }`,
            {},
            { tags: ['imoveis', 'aluguel'], revalidate: 3600 }
        );
    },

    // Get a single property with all details - no need to cache for long
    getImovelBySlug: async (slug: string) => {
        const result = await fetchWithOptimizedCache<any>(
            `*[_type == "imovel" && slug.current == $slug][0]{
        _id, titulo, slug, preco, finalidade, tipoImovel, 
        bairro, cidade, estado, endereco, cep, dormitorios, banheiros, areaUtil, areaTotal, vagas,
        destaque, caracteristicas, descricao, status, "galeria": galeria[]{asset->, alt},
        "imagem": { "asset": imagem.asset->, "_type": "image", "alt": imagem.alt, "url": imagem.asset->url },
        geolocalizacao, dataCadastro, dataAtualizacao
      }`,
            { slug },
            { tags: [`imovel:${slug}`], revalidate: 1800 } // Shorter cache for individual property
        );
        return result ? mapImovelToClient(result) : null;
    }
};

// Function to manually trigger revalidation for all or specific properties
export async function revalidateImoveis(type: 'all' | 'destaque' | 'aluguel' | 'venda' | string = 'all') {
    const tags: string[] = [];

    if (type === 'all') {
        tags.push('imoveis');
        revalidatePath('/');
    } else if (['destaque', 'aluguel', 'venda'].includes(type)) {
        tags.push(`imoveis`, type);
    } else if (type.startsWith('slug:')) {
        // Revalidate a specific property by slug
        const slug = type.replace('slug:', '');
        tags.push(`imovel:${slug}`);
        revalidatePath(`/imovel/${slug}`);
    }

    // Apply tag-based revalidation
    tags.forEach(tag => revalidateTag(tag));

    return { revalidated: true, tags };
}
