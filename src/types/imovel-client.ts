import Image from 'next/image';
// src/types/imovel-client.ts

import type { Imovel as SanityImovel } from '@/types/sanity-schema'

// Tipo para categoria expandida
export interface CategoriaFull {
    _id: string
    titulo?: string
    slug?: {
        current: string
    }
    categoriaSlug?: string  // Campo adicional para facilitar acesso
    categoriaTitulo?: string  // Campo adicional para facilitar acesso
    disponibilidadeImediata?: boolean
}

// Tipo de imagem que o toClientImage retorna
export interface ImagemClient {
    imagemUrl?: string  // Alterado de url para imagemUrl para compatibilidade
    alt?: string
    url: string  // URL da imagem, compatível com o que o Sanity retorna
    asset?: {
        _ref?: string  // Referência do Sanity para a imagem (ex: image-abc123-800x600-jpg)
        url?: string   // URL direta do asset
    }
}

/**
 * Interface para o imóvel já processado para o cliente
 * Contém apenas os campos necessários para a UI
 */
export interface ImovelClient {
    _id: string
    _type?: string
    titulo?: string
    slug: string
    preco?: number
    finalidade?: 'Venda' | 'Aluguel' | 'Temporada'
    tipoImovel?: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'
    destaque?: boolean
    bairro?: string
    cidade?: string
    estado?: string
    descricao?: string
    mapaLink?: string

    // Características principais
    dormitorios?: number
    banheiros?: number
    areaUtil?: number
    vagas?: number

    // Flags
    aceitaFinanciamento?: boolean
    documentacaoOk?: boolean

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
    categoria?: CategoriaFull
}
