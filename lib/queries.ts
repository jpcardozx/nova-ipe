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
    imagem {
      asset->{
        url
      },
      alt,
      hotspot
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
    imagem {
      asset->{
        url
      },
      alt,
      hotspot
    }
  }
`;

/**
 * Busca imóveis em destaque para a página inicial
 * Otimizado para carregamento rápido com projeção
 */
export async function getImoveisDestaque(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(queryImoveisDestaque);
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error);
    return [];
  }
}

/**
 * Busca imóveis para aluguel para a página inicial
 * Otimizado para carregamento rápido com projeção
 */
export async function getImoveisAluguel(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(queryImoveisAluguel);
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis para aluguel:', error);
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
    bairro,
    cidade,
    descricao,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    aceitaFinanciamento,
    destaque,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    imagem {
      "imagemUrl": asset->url,
      "alt": alt
    }
  }
`;

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
    },
    imagem {
      "imagemUrl": asset->url,
      "alt": alt
    },
    imagemOpenGraph {
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
    finalidade == "aluguel" &&
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
    finalidade == "aluguel"
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
      "imagemUrl": asset->url,
      "alt": alt
    }
  }
`;
