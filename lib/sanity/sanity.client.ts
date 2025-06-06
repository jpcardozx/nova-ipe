// lib/sanity/sanity.client.ts
'use client'

import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/studio/env'

// Cliente Sanity para uso no browser (Client Components)
export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Usa CDN para melhor performance
    perspective: 'published',    stega: {
        enabled: false, // Desabilita stega em produção
    },
})

// Função de fetch para Client Components
export async function clientFetch<T>(
    query: string,
    params: Record<string, any> = {}
): Promise<T> {
    return sanityClient.fetch<T>(query, params)
}

// Hook personalizado para uso com SWR ou React Query
export function useSanityQuery<T>(
    query: string,
    params?: Record<string, any>
) {
    return {
        queryKey: ['sanity', query, params],
        queryFn: () => clientFetch<T>(query, params || {}),
    }
}