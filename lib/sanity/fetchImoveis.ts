// lib/sanity/fetchImoveis.ts
// Enhanced Sanity fetchers with isomorphic caching and robust error handling

import { fetchWithIsomorphicCache, isomorphicQueries } from './isomorphic-sanity-service';
import {
    queryTodosImoveis,
    queryImoveisParaVenda,
    queryImoveisParaAlugar,
    queryImoveisAluguelDestaque,
    queryImovelEmDestaque,
    queryImoveisDestaqueVenda,
    queryImovelPorSlug,
    queryImoveisEmAlta,
} from '../queries'
import type { ImovelClient, ImovelProjetado } from '../../src/types/imovel-client'
import { mapImovelToClient } from '../mapImovelToClient'

// Enhanced fetcher with isomorphic caching and error handling
async function fetchWithCache<T>(
    query: string,
    params = {},
    tags: string[] = []
): Promise<T> {
    try {
        console.log('🔍 Executando query Sanity:', { 
            query: query.slice(0, 100) + '...', 
            params,
            tags,
        });
        
        const data = await fetchWithIsomorphicCache<T>(query, params, {
            tags,
            revalidate: 3600 // Default 1 hour cache
        });
        
        console.log('✅ Query Sanity executada com sucesso:', {
            resultCount: Array.isArray(data) ? data.length : 'single item',
            tags
        });
        
        return data;
    } catch (err) {
        console.error('❌ Erro na query Sanity:', {
            query: query.slice(0, 200) + '...',
            params,
            tags,
            error: err instanceof Error ? err.message : String(err)
        });
        throw err;
    }
}

// Utility function to map arrays
const mapMany = (data: ImovelProjetado[]): ImovelClient[] =>
    data.map(mapImovelToClient)

// ———————————————————————————————————————————————————————————————————
// LISTAGENS OTIMIZADAS
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
    console.log('🏠 Buscando imóveis para alugar com cache isomórfico...');
    
    try {
        const data = await isomorphicQueries.getImoveisAluguel(9);
        console.log('🔄 Mapeando', data.length, 'imóveis de aluguel...');
        return data.map(mapImovelToClient);
    } catch (error) {
        console.warn('⚠️ Fallback para query tradicional:', error);
        const data = await fetchWithCache<ImovelProjetado[]>(
            queryImoveisParaAlugar,
            {},
            ['imoveis', 'aluguel']
        );
        return mapMany(data);
    }
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
// INDIVIDUAL OTIMIZADO
// ———————————————————————————————————————————————————————————————————

export async function getImovelPorSlug(
    slug: string
): Promise<ImovelClient | null> {
    try {
        console.log('🔍 Buscando imóvel por slug com cache isomórfico:', slug);
        
        // Usar query isomórfica
        const result = await isomorphicQueries.getImovelBySlug(slug);
        
        if (result) {
            console.log('✅ Imóvel encontrado:', result.titulo);
            return result;
        }
        
        console.log('⚠️ Imóvel não encontrado para slug:', slug);
        return null;
    } catch (error) {
        console.error(`❌ Erro ao buscar imóvel com slug ${slug}:`, error);
        return null;
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
// VITRINE OTIMIZADA
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
    console.log('🏆 Buscando imóveis destaque venda com cache isomórfico...');
    
    // Usar query isomórfica se disponível
    try {
        const data = await isomorphicQueries.getImoveisDestaque(9);
        console.log('🔄 Mapeando', data.length, 'imóveis de destaque venda...');
        return data.map(mapImovelToClient);
    } catch (error) {
        console.warn('⚠️ Fallback para query tradicional:', error);
        // Fallback para query tradicional
        const data = await fetchWithCache<ImovelProjetado[]>(
            queryImoveisDestaqueVenda,
            {},
            ['imoveis', 'destaque', 'venda']
        );
        return mapMany(data);
    }
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
