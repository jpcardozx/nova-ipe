// src/lib/queries.ts

import { FRAGMENT_CAPA, FRAGMENT_DETALHES } from './sanity/fragments.groq';
import { sanityClient } from './sanity';
import { buildImageProjectionQuery, normalizeDocuments } from './sanity-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// Queries para a nova Home Page otimizada
export const queryImoveisDestaque = /* groq */ `
  *[
    _type == "imovel" && 
    destaque == true && 
    status == "disponivel"
  ] | order(_createdAt desc)[0...6] {
    _id,
    titulo,
    slug,
    preco,
    finalidade,
    tipoImovel,
    bairro,
    cidade,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    destaque,
    "imagem": {
      "asset": imagem.asset->,
      "_type": "image", 
      "alt": imagem.alt,
      "hotspot": imagem.hotspot
    }
  }
`;

// Query específica para imóveis em destaque APENAS para venda
export const queryImoveisDestaqueVenda = /* groq */ `
  *[
    _type == "imovel" && 
    destaque == true && 
    status == "disponivel" &&
    finalidade == "Venda"
  ] | order(_createdAt desc)[0...6] {
    _id,
    titulo,
    slug,
    preco,
    finalidade,
    tipoImovel,
    bairro,
    cidade,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    destaque,
    "imagem": {
      "asset": imagem.asset->,
      "_type": "image", 
      "alt": imagem.alt,
      "hotspot": imagem.hotspot
    }
  }
`;

export const queryImoveisAluguel = /* groq */ `
  *[
    _type == "imovel" && 
    finalidade == "Aluguel" && 
    status == "disponivel"
  ] | order(_createdAt desc)[0...6] {
    _id,
    titulo,
    slug,
    preco,
    finalidade,
    tipoImovel,
    bairro,
    cidade,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    destaque,
    "imagem": {
      "asset": imagem.asset->,
      "_type": "image", 
      "alt": imagem.alt,
      "hotspot": imagem.hotspot
    }
  }
`;

// Cache para queries para evitar requisições desnecessárias
const queryCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 300000; // 5 minutos

/**
 * Busca imóveis em destaque para a página inicial
 * Otimizado para carregamento rápido com projeção
 * Inclui correção automática de referências de imagem
 */
export async function getImoveisDestaque(): Promise<any[]> {
  const cacheKey = 'imoveis-destaque';
  const now = Date.now();
  
  // Verificar cache primeiro
  const cached = queryCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Import dinâmico para evitar ciclos de dependência
    const { fixSanityImageReferences } = await import('./image-fix');    const data = await sanityClient.fetch(queryImoveisDestaque, {}, {
      next: { 
        revalidate: 3600, // Revalidar a cada hora
        tags: ['imoveis', 'destaque']
      }
    });

    // Corrigir referências de imagens para todos os imóveis
    let processedData: any[] = [];
    if (Array.isArray(data)) {
      processedData = data.map(imovel => {
        if (imovel && imovel.imagem) {
          return {
            ...imovel,
            imagem: fixSanityImageReferences(imovel.imagem)
          };
        }
        return imovel;
      });
    }

    // Armazenar no cache
    queryCache.set(cacheKey, { data: processedData, timestamp: now });
    return processedData || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error);
    return [];
  }
}

/**
 * Busca imóveis para aluguel para a página inicial
 * Otimizado para carregamento rápido com projeção
 * Inclui correção automática de referências de imagem
 */
export async function getImoveisAluguel(): Promise<any[]> {
  const cacheKey = 'imoveis-aluguel';
  const now = Date.now();
  
  // Verificar cache primeiro
  const cached = queryCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Import dinâmico para evitar ciclos de dependência
    const { fixSanityImageReferences } = await import('./image-fix');    const data = await sanityClient.fetch(queryImoveisAluguel, {}, {
      next: { 
        revalidate: 3600, // Revalidar a cada hora      tags: ['imoveis', 'aluguel']
      }
    });

    // Corrigir referências de imagens para todos os imóveis
    let processedData: any[] = [];
    if (Array.isArray(data)) {
      processedData = data.map(imovel => {
        if (imovel && imovel.imagem) {
          return {
            ...imovel,
            imagem: fixSanityImageReferences(imovel.imagem)
          };
        }
        return imovel;
      });
    }

    // Armazenar no cache
    queryCache.set(cacheKey, { data: processedData, timestamp: now });
    return processedData || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis para aluguel:', error);
    return [];
  }
}

/**
 * Busca imóveis em destaque APENAS para venda
 * Otimizado para carregamento rápido com projeção
 * Inclui correção automática de referências de imagem
 */
export async function getImoveisDestaqueVenda(): Promise<any[]> {
  const cacheKey = 'imoveis-destaque-venda';
  const now = Date.now();
  
  // Verificar cache primeiro
  const cached = queryCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Import dinâmico para evitar ciclos de dependência
    const { fixSanityImageReferences } = await import('./image-fix');    const data = await sanityClient.fetch(queryImoveisDestaqueVenda, {}, {
      next: { 
        revalidate: 3600, // Revalidar a cada hora        tags: ['imoveis', 'destaque', 'venda']
      }
    });

    // Corrigir referências de imagens para todos os imóveis
    let processedData: any[] = [];
    if (Array.isArray(data)) {
      processedData = data.map(imovel => {
        if (imovel && imovel.imagem) {
          return {
            ...imovel,
            imagem: fixSanityImageReferences(imovel.imagem)
          };
        }
        return imovel;
      });
    }

    // Armazenar no cache
    queryCache.set(cacheKey, { data: processedData, timestamp: now });
    return processedData || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque para venda:', error);
    return [];
  }
}

/**
 * Busca imóveis em destaque APENAS para aluguel
 * Otimizado para carregamento rápido com projeção
 * Inclui correção automática de referências de imagem
 */
export async function getImoveisDestaqueAluguel(): Promise<any[]> {
  const cacheKey = 'imoveis-destaque-aluguel';
  const now = Date.now();
  
  // Verificar cache primeiro
  const cached = queryCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Import dinâmico para evitar ciclos de dependência
    const { fixSanityImageReferences } = await import('./image-fix');
    
    const data = await sanityClient.fetch(queryImoveisAluguelDestaque, {}, {
      next: { 
        revalidate: 3600, // Revalidar a cada hora
        tags: ['imoveis', 'destaque', 'aluguel']
      }
    });

    // Corrigir referências de imagens para todos os imóveis
    let processedData: any[] = [];
    if (Array.isArray(data)) {
      processedData = data.map(imovel => {
        if (imovel && imovel.imagem) {
          return {
            ...imovel,
            imagem: fixSanityImageReferences(imovel.imagem)
          };
        }
        return imovel;
      });
    }

    // Armazenar no cache
    queryCache.set(cacheKey, { data: processedData, timestamp: now });
    return processedData || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque para aluguel:', error);
    return [];
  }
}

export const queryTodosImoveis = /* groq */`
  *[
    _type == "imovel" &&
    status == "disponivel"
  ] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    }
  }
`;

export const queryImovelEmDestaque = /* groq */ `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    destaque == true
  ] | order(_createdAt desc)[0...6] {
    _id,
    titulo,
    slug,
    preco,
    finalidade,
    tipoImovel,
    cidade,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    imagem {
      "imagemUrl": asset->url
    }
  }
`;

// Suggestion: Add indexes in Sanity for `status`, `destaque`, and `_createdAt` to improve query performance.

export const queryImovelPorSlug = /* groq */ `
  *[_type == "imovel" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    descricao,
    endereco,
    estado,
    aceitaFinanciamento,
    area,
    areaUtil,
    documentacaoOk,
    videoTour,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    },
    imagemOpenGraph {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url
    },
    metaTitle,
    metaDescription,
    tags
  }
`;

export const queryImoveisAluguelDestaque = /* groq */ `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    finalidade == "Aluguel" &&
    destaque == true
  ] | order(_createdAt desc)[0...6] {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    },
    aceitaFinanciamento,
    area,
    areaUtil
  }
`;

export const queryImoveisParaVenda = /* groq */ `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    finalidade == "venda"
  ] | order(_createdAt desc)[0...30] {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    },
    aceitaFinanciamento,
    area,
    areaUtil
  }
`;

export const queryImoveisParaAlugar = /* groq */ `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    finalidade == "Aluguel"
  ] | order(_createdAt desc)[0...30] {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    },
    aceitaFinanciamento,
    area,
    areaUtil
  }
`;

export const queryImoveisRelacionados = /* groq */ `
  *[
    _type == "imovel" &&
    _id != $imovelId &&
    (!defined($categoriaId) || categoria._ref == $categoriaId) &&
    (!defined($cidade) || cidade == $cidade)
  ][0...6] {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    finalidade,
    bairro,
    cidade,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "asset": asset->,
      "_type": "image",
      "imagemUrl": asset->url,
      "alt": alt
    }
  }
`;
