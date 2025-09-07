


























/**
 * Sanity Queries - Type-safe and maintainable
 * Professional approach with proper TypeScript integration
 */

import { sanityFetch } from './index'

// Types for better type safety
export interface Property {
  _id: string
  titulo: string
  slug: { current: string }
  preco: number
  finalidade: 'Venda' | 'Aluguel'
  tipoImovel: string
  bairro: string
  cidade: string
  dormitorios?: number
  banheiros?: number
  areaUtil?: number
  vagas?: number
  destaque?: boolean
  // Campos adicionais para detalhes
  descricao?: string
  endereco?: string
  estado?: string
  aceitaFinanciamento?: boolean
  area?: number
  documentacaoOk?: boolean
  videoTour?: string
  caracteristicas?: string[]
  status?: string
  categoria?: {
    _id: string
    categoriaTitulo: string
    categoriaSlug: { current: string }
  }
  // Imagens
  imagemUrl?: string
  imagemOpenGraph?: {
    asset: {
      url: string
    }
  }
  imagem?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
    hotspot?: any
  }
  galeria?: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
    titulo?: string
    hotspot?: any
  }>
}

// Query fragments for reusability
const PROPERTY_FIELDS = `
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
  areaTotal,
  area,
  vagas,
  destaque,
  emAlta,
  codigoInterno,
  imagem {
    asset-> {
      _id,
      url
    },
    alt,
    hotspot
  }
`

const PROPERTY_DETAILED_FIELDS = `
  ${PROPERTY_FIELDS},
  descricao,
  endereco,
  estado,
  aceitaFinanciamento,
  documentacaoOk,
  videoTour,
  caracteristicas,
  status,
  categoria->{
    _id,
    "categoriaTitulo": titulo,
    "categoriaSlug": slug
  },
  galeria[] {
    asset-> {
      _id,
      url
    },
    alt,
    titulo,
    hotspot
  },
  valorCondominio,
  iptu,
  localizacao
`

// Query builders - more maintainable than hardcoded strings
export const queries = {
  // Featured properties (Imóveis em Alta)
  featuredProperties: () => `
    *[
      _type == "imovel" && 
      emAlta == true && 
      status == "disponivel"
    ] | order(_createdAt desc)[0...6] {
      ${PROPERTY_FIELDS}
    }
  `,

  // Properties for rent
  rentalProperties: () => `
    *[
      _type == "imovel" && 
      finalidade == "Aluguel" && 
      status == "disponivel"
    ] | order(_createdAt desc)[0...6] {
      ${PROPERTY_FIELDS}
    }
  `,

  // Properties for sale
  saleProperties: () => `
    *[
      _type == "imovel" && 
      finalidade == "Venda" && 
      status == "disponivel"
    ] | order(_createdAt desc)[0...6] {
      ${PROPERTY_FIELDS}
    }
  `,

  // Single property by slug
  propertyBySlug: () => `
    *[_type == "imovel" && slug.current == $slug][0] {
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
      areaTotal,
      area,
      vagas,
      destaque,
      emAlta,
      codigoInterno,
      descricao,
      endereco,
      estado,
      aceitaFinanciamento,
      documentacaoOk,
      videoTour,
      caracteristicas,
      status,
      categoria->{
        _id,
        "categoriaTitulo": titulo,
        "categoriaSlug": slug
      },
      imagem {
        asset-> {
          _id,
          url
        },
        alt,
        hotspot
      },
      galeria[] {
        asset-> {
          _id,
          url
        },
        alt,
        titulo,
        hotspot
      },
      valorCondominio,
      iptu,
      localizacao
    }
  `,

  // All available properties
  allProperties: () => `
    *[
      _type == "imovel" && 
      status == "disponivel"
    ] | order(_createdAt desc) {
      ${PROPERTY_FIELDS}
    }
  `
} as const

// Type-safe fetch functions
export async function getFeaturedProperties(): Promise<Property[]> {
  return sanityFetch<Property[]>(queries.featuredProperties(), {}, 1800)
}

export async function getRentalProperties(): Promise<Property[]> {
  return sanityFetch<Property[]>(queries.rentalProperties(), {}, 1800)
}

export async function getSaleProperties(): Promise<Property[]> {
  return sanityFetch<Property[]>(queries.saleProperties(), {}, 1800)
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const result = await sanityFetch<Property>(queries.propertyBySlug(), { slug }, 3600)
  
  // Debug log para verificar os dados
  console.log('🔍 Dados do Sanity para slug:', slug, {
    id: result?._id,
    titulo: result?.titulo,
    descricao: result?.descricao ? 'Presente' : 'Ausente',
    galeriaCount: result?.galeria?.length || 0,
    imagemPrincipal: result?.imagem?.asset?.url ? 'Presente' : 'Ausente'
  })
  
  return result
}

export async function getAllProperties(): Promise<Property[]> {
  return sanityFetch<Property[]>(queries.allProperties(), {}, 1800)
}

// Import ImovelClient type
import type { ImovelClient } from '@/src/types/imovel-client'

// Transform Property to ImovelClient for compatibility
export function transformPropertyToImovelClient(property: Property): ImovelClient {
  const transformed = {
    _id: property._id,
    id: property._id,
    titulo: property.titulo,
    slug: typeof property.slug === 'object' ? property.slug.current : property.slug,
    codigo: (property as any).codigoInterno || '000000',
    preco: property.preco,
    finalidade: property.finalidade,
    tipoImovel: property.tipoImovel as 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro',
    bairro: property.bairro,
    cidade: property.cidade,
    dormitorios: property.dormitorios,
    banheiros: property.banheiros,
    areaUtil: property.areaUtil,
    area: (property as any).areaTotal || property.area || 0,
    vagas: property.vagas,
    destaque: property.destaque,
    // Campos adicionais
    descricao: property.descricao,
    endereco: property.endereco,
    estado: property.estado,
    aceitaFinanciamento: property.aceitaFinanciamento,
    documentacaoOk: property.documentacaoOk,
    caracteristicas: property.caracteristicas,
    status: property.status as 'disponivel' | 'reservado' | 'vendido',
    categoria: property.categoria ? {
      _id: property.categoria._id,
      titulo: property.categoria.categoriaTitulo,
      slug: typeof property.categoria.categoriaSlug === 'object' 
        ? property.categoria.categoriaSlug.current 
        : property.categoria.categoriaSlug
    } : undefined,
    // Transform Sanity image structure to ImovelClient structure
    imagem: property.imagem ? {
      imagemUrl: property.imagem.asset?.url,
      alt: property.imagem.alt,
      asset: {
        _ref: property.imagem.asset?._id,
        _type: 'sanity.imageAsset'
      }
    } : undefined,
    // Transform galeria properly
    galeria: property.galeria?.map(img => ({
      imagemUrl: img.asset?.url,
      alt: img.alt || img.titulo,
      asset: {
        _ref: img.asset?._id,
        _type: 'sanity.imageAsset'
      }
    })) || []
  }

  // Debug log para verificar a transformação
  console.log('🔄 Transformação Property -> ImovelClient:', {
    id: transformed._id,
    titulo: transformed.titulo,
    descricao: transformed.descricao ? 'Transformada' : 'Ausente',
    galeriaCount: transformed.galeria?.length || 0,
    imagemPrincipal: transformed.imagem?.imagemUrl ? 'Transformada' : 'Ausente'
  })

  return transformed
}

// Additional exports for compatibility with existing code
export async function getImoveisDestaqueVenda(): Promise<ImovelClient[]> {
  const properties = await getSaleProperties()
  return properties.filter(p => p.destaque).map(transformPropertyToImovelClient)
}

export async function getImoveisAluguel(): Promise<ImovelClient[]> {
  const properties = await getRentalProperties()
  return properties.map(transformPropertyToImovelClient)
}

export async function getImoveisDestaque(): Promise<ImovelClient[]> {
  const properties = await getFeaturedProperties()
  return properties.map(transformPropertyToImovelClient)
}

// Query exports for dynamic imports
export const queryImovelPorSlug = queries.propertyBySlug()
export const queryImoveisRelacionados = `*[
  _type == "imovel" && 
  _id != $imovelId && 
  categoria._ref == $categoriaId && 
  cidade == $cidade &&
  status == "disponivel"
] | order(_createdAt desc)[0...4] {
  ${PROPERTY_FIELDS}
}`

// Utility function for home page data
export async function getHomePageData() {
  try {
    const [featured, rental, sale] = await Promise.all([
      getFeaturedProperties(),
      getRentalProperties(),
      getSaleProperties()
    ])

    return {
      featuredProperties: featured.map(transformPropertyToImovelClient),
      rentalProperties: rental.map(transformPropertyToImovelClient),
      saleProperties: sale.map(transformPropertyToImovelClient)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('🚨 Error fetching data from Sanity, using fallback:', errorMessage)
    
    // Import fallback service dynamically to avoid circular dependencies
    const { FallbackDataService } = await import('../fallback-data/fallback-service')
    
    return {
      featuredProperties: FallbackDataService.getImoveisDestaque(),
      rentalProperties: FallbackDataService.getImoveisParaAluguel(),
      saleProperties: FallbackDataService.getImoveisParaVenda()
    }
  }
}