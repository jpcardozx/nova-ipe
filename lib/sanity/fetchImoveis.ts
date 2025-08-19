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
    queryImoveisEmAlta, // Nova query para imóveis em alta
} from '../queries'
import type { ImovelClient, ImovelProjetado } from '../../src/types/imovel-client'
import { mapImovelToClient } from '../mapImovelToClient'


// Server-side fetcher with enhanced logging and caching
async function fetchWithCache<T>(
    query: string,
    params = {},
    tags: string[] = []
): Promise<T> {
    try {
        console.log('🔍 Executando query Sanity:', { 
            query: query.slice(0, 100) + '...', 
            params,
            tags 
        });
        
        const data = await serverClient.fetch<T>(query, params, {
            next: { 
                tags,
                revalidate: 3600 // Default 1 hour cache
            },
        });
        
        console.log('✅ Query Sanity executada com sucesso:', {
            resultCount: Array.isArray(data) ? data.length : 'single item',
            tags
        });
        
        return data;
    } catch (err) {
        console.error('❌ Erro na query Sanity:', {
            error: err,
            query: query.slice(0, 200) + '...',
            params,
            tags
        });
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
    console.log('📋 Buscando imóveis para venda...');
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisParaVenda,
        {},
        ['imoveis', 'venda']
    );
    
    console.log('🔄 Mapeando', data.length, 'imóveis de venda...');
    const mapped = mapMany(data);
    
    // Validar campos críticos
    mapped.forEach(imovel => {
        if (!imovel.dormitorios && imovel.dormitorios !== 0) {
            console.warn('⚠️ Dormitórios ausente:', imovel._id, imovel.titulo);
        }
        if (!imovel.banheiros && imovel.banheiros !== 0) {
            console.warn('⚠️ Banheiros ausente:', imovel._id, imovel.titulo);
        }
    });
    
    return mapped;
}

export async function getImoveisParaAlugar(): Promise<ImovelClient[]> {
    console.log('🏠 Buscando imóveis para alugar...');
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisParaAlugar,
        {},
        ['imoveis', 'aluguel']
    );
    
    console.log('🔄 Mapeando', data.length, 'imóveis de aluguel...');
    const mapped = mapMany(data);
    
    // Validar campos críticos
    mapped.forEach(imovel => {
        if (!imovel.dormitorios && imovel.dormitorios !== 0) {
            console.warn('⚠️ Dormitórios ausente:', imovel._id, imovel.titulo);
        }
        if (!imovel.banheiros && imovel.banheiros !== 0) {
            console.warn('⚠️ Banheiros ausente:', imovel._id, imovel.titulo);
        }
    });
    
    return mapped;
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

// Nova funcionalidade: Imóveis em Alta
export async function getImoveisEmAlta(): Promise<ImovelClient[]> {
    const data = await fetchWithCache<ImovelProjetado[]>(
        queryImoveisEmAlta,
        {},
        ['imoveis', 'emAlta']
    )
    return mapMany(data)
}

// Alias para compatibilidade
export const fetchProperties = getTodosImoveis;
