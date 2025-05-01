// src/lib/queries.ts

import { FRAGMENT_CAPA, FRAGMENT_DETALHES } from './sanity/fragments.groq';

export const queryTodosImoveis = /* groq */ `
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
