/**
 * Sanity GROQ Queries
 * Type-safe queries for the application
 */

import { groq } from 'next-sanity'

// Base image projection for consistent image handling
const imageProjection = `{
  "asset": asset->,
  "_type": "image",
  "alt": alt,
  "hotspot": hotspot,
  "crop": crop
}`

// Featured properties query - simplified for testing
export const FEATURED_PROPERTIES_QUERY = groq`
  *[_type == "imovel"][0...6] {
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
    destaque
  }
`

// Rental properties query - simplified
export const RENTAL_PROPERTIES_QUERY = groq`
  *[_type == "imovel" && finalidade == "Aluguel"][0...6] {
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
    destaque
  }
`

// Sale properties query - simplified
export const SALE_PROPERTIES_QUERY = groq`
  *[_type == "imovel" && finalidade == "Venda"][0...6] {
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
    destaque
  }
`

// Property by slug query
export const PROPERTY_BY_SLUG_QUERY = groq`
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
    dormitorios,
    banheiros,
    vagas,
    tipoImovel,
    caracteristicas,
    status,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    "imagem": imagem${imageProjection},
    "galeria": galeria[]${imageProjection}
  }
`

// All properties query
export const ALL_PROPERTIES_QUERY = groq`
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
    tipoImovel,
    bairro,
    cidade,
    estado,
    endereco,
    dormitorios,
    banheiros,
    areaUtil,
    vagas,
    descricao,
    caracteristicas,
    aceitaFinanciamento,
    documentacaoOk,
    _createdAt,
    categoria->{
      _id,
      "categoriaTitulo": titulo,
      "categoriaSlug": slug
    },
    "imagem": imagem${imageProjection}
  }
`