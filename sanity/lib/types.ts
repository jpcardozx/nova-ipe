/**
 * Sanity Types
 * Type definitions for Sanity documents
 * TODO: Replace with generated types from `sanity typegen generate`
 */

export interface SanityImage {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
    alt?: string
    hotspot?: {
        x: number
        y: number
        height: number
        width: number
    }
    crop?: {
        top: number
        bottom: number
        left: number
        right: number
    }
}

export interface SanitySlug {
    _type: 'slug'
    current: string
}

export interface Category {
    _id: string
    categoriaTitulo: string
    categoriaSlug: SanitySlug
}

export interface Property {
    _id: string
    titulo: string
    slug: SanitySlug
    preco: number
    destaque?: boolean
    finalidade: 'Venda' | 'Aluguel'
    tipoImovel: string
    bairro: string
    cidade: string
    estado?: string
    endereco?: string
    dormitorios?: number
    banheiros?: number
    areaUtil?: number
    vagas?: number
    descricao?: string
    caracteristicas?: string[]
    aceitaFinanciamento?: boolean
    documentacaoOk?: boolean
    videoTour?: string
    status: 'disponivel' | 'vendido' | 'alugado' | 'reservado'
    categoria?: Category
    imagem?: SanityImage
    galeria?: SanityImage[]
    _createdAt: string
}

// Utility type for properties with processed images
export interface ProcessedProperty extends Omit<Property, 'imagem' | 'galeria'> {
    imagem?: SanityImage & {
        url?: string
    }
    galeria?: (SanityImage & {
        url?: string
    })[]
}