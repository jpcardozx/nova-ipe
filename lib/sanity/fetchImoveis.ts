// lib/sanity/fetchImoveis.ts

import { serverClient } from './sanity.server';
import {
    queryTodosImoveis,
    queryImoveisParaVenda,
    queryImoveisParaAlugar,
    queryImoveisAluguelDestaque,
    queryImovelEmDestaque,
    queryImoveisDestaqueVenda,
    queryImovelPorSlug,
} from '@lib/queries'
import type { ImovelClient, ImovelProjetado } from '../../src/types/imovel-client'
import { mapImovelToClient } from '@lib/mapImovelToClient'


// Server-side fetcher with caching
async function fetchWithCache<T>(
    query: string,
    params = {},
    tags: string[] = []
): Promise<T> {
    try {        const data = await serverClient.fetch<T>(query, params, {
            next: { 
                tags,
                revalidate: 3600 // Default 1 hour cache
            },
        });
        return data;
    } catch (err) {
        console.error('Sanity fetch error:', err);
        throw new Error(`Failed to fetch from Sanity: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
}

// utilzinho para evitar repetição ↓
const mapMany = (data: ImovelProjetado[]): ImovelClient[] =>
    data.map(mapImovelToClient)

// ———————————————————————————————————————————————————————————————————
// LISTAGENS
// ———————————————————————————————————————————————————————————————————
export async function getTodosImoveis(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryTodosImoveis,
        {},
        ['imoveis']
    )
    return mapMany(data)
}

export async function getImoveisParaVenda(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisParaVenda,
        {},
        ['imoveis', 'venda']
    )
    return mapMany(data)
}

export async function getImoveisParaAlugar(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisParaAlugar,
        {},
        ['imoveis', 'aluguel']
    )
    return mapMany(data)
}

export async function getImoveisAluguelDestaque(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisAluguelDestaque,
        {},
        ['imoveis', 'aluguel', 'destaque']
    )
    return mapMany(data)
}

// ———————————————————————————————————————————————————————————————————
// INDIVIDUAL
// ———————————————————————————————————————————————————————————————————
export async function getImovelPorSlug(
    slug: string
): Promise<ImovelClient | null> {
    try {
        const data = await fetchWithCache<ImovelProjetado | null>(
            queryImovelPorSlug,
            { slug },
            [`imovel:${slug}`]
        )
        return data ? mapImovelToClient(data) : null
    } catch (error) {
        console.error(`Error fetching imovel with slug ${slug}:`, error)
        return null
    }
}

// consulta por ID se precisar (usa a mesma query; slug é ignorado)
export async function getImovelPorId(
    id: string
): Promise<ImovelClient | null> {
    try {
        const data = await fetchWithCache<ImovelProjetado | null>(
            queryImovelPorSlug,
            { id },
            [`imovel:${id}`]
        )
        return data ? mapImovelToClient(data) : null
    } catch (error) {
        console.error(`Error fetching imovel with id ${id}:`, error)
        return null
    }
}

// ———————————————————————————————————————————————————————————————————
// VITRINE (ex-home)
// ———————————————————————————————————————————————————————————————————
export async function getImovelEmDestaque(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImovelEmDestaque,
        {},
        ['imoveis', 'destaque']
    )
    return mapMany(data)
}

export async function getImoveisDestaqueVenda(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisDestaqueVenda,
        {},
        ['imoveis', 'destaque', 'venda']
    )
    return mapMany(data)
}

export async function getImoveisDestaqueAluguel(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisAluguelDestaque,
        {},
        ['imoveis', 'destaque', 'aluguel']
    )
    return mapMany(data)
}
