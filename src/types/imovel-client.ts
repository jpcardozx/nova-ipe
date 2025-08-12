// src/types/imovel-client.ts

import type { Slug, Image as SanityImage, FileAsset } from '@sanity/types';
import type { Imovel as SanityImovel } from './sanity-schema'; // Geopoint and Block will be assumed to be part of SanityImovel or resolved otherwise

// Define ImagemClient based on ImagemProjetada or as a new interface
export interface ImagemClient {
    imagemUrl?: string;
    alt?: string;
    asset?: { // Common structure for Sanity image assets
        _ref?: string;
        _type?: string;
    };
}

// Placeholder for CategoriaFull - define its structure as needed
export interface CategoriaFull {
    _id: string;
    titulo?: string;
    slug?: string;
    // Add other fields relevant to CategoriaFull
}


/**
 * Interface para o imóvel já processado para o cliente
 * Contém apenas os campos necessários para a UI
 */
export interface ImovelClient {
    _id: string
    id?: string // Added for TurboComprarPage compatibility
    _type?: string
    titulo?: string
    slug: string
    preco?: number
    finalidade?: 'Venda' | 'Aluguel' | 'Temporada'
    tipoImovel?: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'
    destaque?: boolean
    emAlta?: boolean // Nova funcionalidade: Imóveis em Alta
    bairro?: string
    cidade?: string
    estado?: string
    descricao?: string
    mapaLink?: string
    dataPublicacao?: string // Added for date-related functionality

    // Características principais
    dormitorios?: number
    banheiros?: number
    areaUtil?: number
    vagas?: number

    // Flags
    aceitaFinanciamento?: boolean
    documentacaoOk?: boolean

    // Características e recursos do imóvel
    caracteristicas?: string[]
    possuiJardim?: boolean // Added for feature filtering
    possuiPiscina?: boolean // Added for feature filtering

    // Galeria de imagens
    galeria?: ImagemClient[]

    // Categoria
    categoria?: CategoriaFull

    // Imagens - agora usando ImagemClient
    imagem?: ImagemClient
    imagemOpenGraph?: ImagemClient
    // Outros campos relevantes
    endereco?: string
    metaTitle?: string
    metaDescription?: string
    tags?: string[]
    status?: 'disponivel' | 'reservado' | 'vendido'
}

export interface ImagemProjetada {
    imagemUrl?: string
    alt?: string
}

export interface ImovelProjetado extends Omit<SanityImovel, 'imagem' | 'imagemOpenGraph' | 'categoria'> {
    imagem?: ImagemProjetada
    imagemOpenGraph?: { imagemUrl?: string }
    categoria?: CategoriaFull // Ensure CategoriaFull is used here if it's part of SanityImovel
}

// Re-exporting Sanity core types if they are used directly elsewhere with these names
// export type Geopoint = SanityGeopoint; // Removed as it's not directly exported from @sanity/types
// export type Block = SanityBlock; // Removed as it's not directly exported from @sanity/types
export type Image = SanityImage;
