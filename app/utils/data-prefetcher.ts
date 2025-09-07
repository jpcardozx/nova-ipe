/**
 * Data Prefetcher Utility
 * 
 * Este módulo fornece funcionalidades de pré-carregamento de dados no servidor para melhorar
 * significativamente a performance inicial do site, reduzindo o tempo de LCP e o bloqueio
 * da thread principal no cliente.
 */

import { cache } from 'react';
import { getImoveisParaVenda, getImoveisParaAlugar } from '../../lib/sanity/fetchImoveis';
import type { ImovelClient } from '../../src/types/imovel-client';

/**
 * Otimiza os dados de um imóvel para pré-carregamento.
 * Processamento feito no servidor para economizar CPU no cliente
 * 
 * @param properties Array de imóveis para otimizar
 */
export async function optimizeProperties(properties: ImovelClient[]): Promise<ImovelClient[]> {
    return properties.map(p => ({
        _id: p._id, // Ensure _id is included as required by ImovelClient
        titulo: p.titulo,
        slug: p.slug,
        preco: p.preco,
        bairro: p.bairro,
        cidade: p.cidade,
        areaUtil: p.areaUtil,
        dormitorios: p.dormitorios,
        banheiros: p.banheiros,
        vagas: p.vagas,
        finalidade: p.finalidade,
        destaque: p.destaque,
        imagem: p.imagem ? {
            url: p.imagem.imagemUrl,
            alt: p.imagem.alt,
            blurDataUrl: (p.imagem as any).blurDataUrl
        } : undefined
    }));
}

// Cache das propriedades para cada tipo, atualizado a cada 5 minutos (300 segundos)
export const getPreloadedPropertiesForRent = cache(async (): Promise<{
    data: ImovelClient[];
    timestamp: number;
}> => {
    try {
        const properties = await getImoveisParaAlugar();

        // Pré-processar as imagens para garantir URLs otimizadas
        const optimizedProperties = properties.map(property => ({
            ...property,
            imagem: property.imagem ? {
                ...property.imagem,
                // Se tiver URL de blur data, garante que seja incluído para carregamento otimizado
                blurDataUrl: (property.imagem as any).blurDataUrl || undefined
            } : undefined
        }));

        return {
            data: optimizedProperties,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Erro ao pré-carregar imóveis para alugar:', error);
        return { data: [], timestamp: Date.now() };
    }
});

// Cache das propriedades para compra, atualizado a cada 5 minutos (300 segundos)
export const getPreloadedPropertiesForSale = cache(async (): Promise<{
    data: ImovelClient[];
    timestamp: number;
}> => {
    try {
        const properties = await getImoveisParaVenda();

        // Optimizar para carregamento rápido no cliente
        const optimizedProperties = properties.map(p => ({
            ...p,
            id: p._id,
            imagem: p.imagem ? {
                ...p.imagem,
                blurDataUrl: (p.imagem as any).blurDataUrl || undefined
            } : undefined
        }));

        return {
            data: optimizedProperties,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Erro ao pré-carregar imóveis para venda:', error);
        return { data: [], timestamp: Date.now() };
    }
});

/**
 * Verifica se os dados em cache estão atualizados
 * 
 * @param timestamp Timestamp do último carregamento
 * @param maxAge Idade máxima do cache em segundos (padrão: 5 min)
 */
export async function isCacheValid(timestamp: number, maxAge = 300): Promise<boolean> {
    if (!timestamp) return false;

    const now = Date.now();
    const cacheDurationMs = maxAge * 1000;
    const cacheExpiry = timestamp + cacheDurationMs;

    return cacheExpiry > now;
}

/**
 * Alias for isCacheValid - for backward compatibility
 */
export const isFreshData = isCacheValid;
