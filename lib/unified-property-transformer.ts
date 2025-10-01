// Unified Property Data Transformer V2
// Resolve todos os problemas de mapeamento entre diferentes formatos de dados
// Versão robusta com validação e logs para debugging

import type { ImovelClient } from '@/src/types/imovel-client'

// Interface unificada para todos os componentes de imóveis
export interface UnifiedPropertyData {
    // Identificação
    id: string
    _id?: string
    title: string
    slug: string
    codigo?: string // Internal property code

    // Localização
    location: string
    city: string
    address?: string

    // Valores
    price: number
    propertyType: 'sale' | 'rent'

    // Características físicas (com validação)
    area?: number           // m² úteis
    totalArea?: number      // m² totais
    bedrooms?: number       // dormitórios
    bathrooms?: number      // banheiros
    parkingSpots?: number   // vagas de garagem

    // Imagens
    mainImage?: {
        url: string
        alt?: string
    }
    gallery?: Array<{
        url: string
        alt?: string
    }>

    // Informações adicionais
    description?: string
    propertyTypeDetail?: string // Casa, Apartamento, etc.
    purpose?: string            // Venda, Aluguel, etc.

    // Status e flags
    isHighlight?: boolean
    isPremium?: boolean
    isNew?: boolean
    status?: 'available' | 'sold' | 'rented' | 'reserved'

    // Características especiais
    features?: string[]
    hasGarden?: boolean
    hasPool?: boolean
    acceptsFinancing?: boolean
    documentationOk?: boolean

    // Metadados
    publishedDate?: string
    metaTitle?: string
    metaDescription?: string
}

/**
 * Transforma dados do formato ImovelClient para UnifiedPropertyData
 * Resolve todas as inconsistências de nomenclatura com validação robusta
 */
export function transformToUnifiedProperty(imovel: ImovelClient): UnifiedPropertyData {
    if (!imovel || !imovel._id) {
        console.error('❌ Dados do imóvel inválidos:', imovel)
        throw new Error('Dados do imóvel inválidos ou ausentes')
    }

    // Debug batch - coleta dados para log agrupado
    if (process.env.NODE_ENV === 'development') {
        if (!global.transformBatch) global.transformBatch = [];
        global.transformBatch.push({
            id: imovel._id?.slice(-8),
            titulo: imovel.titulo?.slice(0, 20),
            hasImage: !!(imovel.imagem?.imagemUrl || (imovel.imagem?.asset as any)?.url),
            galleryCount: imovel.galeria?.length || 0
        });
    }

    // Normalizar slug com tipo seguro
    const slug = typeof imovel.slug === 'string'
        ? imovel.slug
        : (imovel.slug as any)?.current || imovel._id

    // Normalizar localização
    const location = [imovel.bairro, imovel.cidade]
        .filter(Boolean)
        .join(', ') || 'Localização não informada'

    // Normalizar tipo de propriedade
    const propertyType: 'sale' | 'rent' =
        imovel.finalidade?.toLowerCase() === 'venda' ||
            imovel.finalidade?.toLowerCase() === 'sale'
            ? 'sale'
            : 'rent'

    // Normalizar imagem principal com validação (suporta múltiplos formatos)
    const mainImage = imovel.imagem?.imagemUrl
        ? {
            url: imovel.imagem.imagemUrl,
            alt: imovel.imagem.alt || imovel.titulo || 'Imóvel'
        }
        : (imovel.imagem?.asset as any)?.url
            ? {
                url: (imovel.imagem?.asset as any).url,
                alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel'
            }
            : undefined

    // Normalizar galeria com múltiplos formatos
    const gallery = (() => {
        if (!imovel.galeria || !Array.isArray(imovel.galeria)) {
            return [];
        }

        return imovel.galeria
            .map(img => {
                // Formato 1: imagemUrl direto
                if (img.imagemUrl) {
                    return {
                        url: img.imagemUrl,
                        alt: img.alt || imovel.titulo || 'Imagem do imóvel'
                    };
                }
                
                // Formato 2: asset.url (formato Sanity)
                if (img.asset && (img.asset as any).url) {
                    return {
                        url: (img.asset as any).url,
                        alt: img.alt || imovel.titulo || 'Imagem do imóvel'
                    };
                }

                return null;
            })
            .filter((img): img is { url: string; alt: string } => img !== null);
    })();

    // Verificar se é novo (últimos 30 dias)
    const isNew = imovel.dataPublicacao
        ? new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : false

    const transformedProperty = {
        // Identificação
        id: imovel._id,
        _id: imovel._id,
        title: imovel.titulo || 'Imóvel disponível',
        slug,
        codigo: imovel.codigo || '000000',

        // Localização
        location,
        city: imovel.cidade || 'Guararema',
        address: imovel.endereco,

        // Valores
        price: imovel.preco || 0,
        propertyType,

        // Características físicas (resolvendo inconsistências)
        area: imovel.areaUtil,
        totalArea: imovel.area,
        bedrooms: imovel.dormitorios,
        bathrooms: imovel.banheiros,
        parkingSpots: imovel.vagas,

        // Imagens
        mainImage,
        gallery,

        // Informações adicionais
        description: imovel.descricao,
        propertyTypeDetail: imovel.tipoImovel,
        purpose: imovel.finalidade,

        // Status e flags
        isHighlight: Boolean(imovel.destaque),
        isPremium: Boolean(imovel.destaque), // Usando destaque como premium por enquanto
        isNew,
        status: 'available' as const, // Por padrão, assumir disponível

        // Características especiais
        features: imovel.caracteristicas || [],
        hasGarden: imovel.possuiJardim,
        hasPool: imovel.possuiPiscina,
        acceptsFinancing: imovel.aceitaFinanciamento,
        documentationOk: imovel.documentacaoOk,

        // Metadados
        publishedDate: imovel.dataPublicacao,
        metaTitle: imovel.metaTitle,
        metaDescription: imovel.metaDescription,
    };

    // Adiciona dados brutos para processamento avançado de imagens
    const enhancedProperty = {
        ...transformedProperty,
        rawPropertyData: imovel // Dados brutos do Sanity para processamento avançado
    };

    // Log apenas se houver problemas críticos
    if (process.env.NODE_ENV === 'development' && (!transformedProperty.mainImage || !transformedProperty.title)) {
        console.warn('⚠️ Propriedade com dados críticos ausentes:', {
            id: transformedProperty.id.slice(-8),
            title: transformedProperty.title ? '✅' : '❌',
            mainImage: transformedProperty.mainImage ? '✅' : '❌'
        });
    }

    return enhancedProperty;
}

/**
 * Transforma lista de imóveis para o formato unificado
 */
export function transformToUnifiedPropertyList(imoveis: ImovelClient[]): UnifiedPropertyData[] {
    return imoveis
        .filter(imovel => imovel && imovel._id)
        .map(imovel => {
            try {
                return transformToUnifiedProperty(imovel)
            } catch (error) {
                console.error(`Erro ao transformar imóvel ${imovel._id}:`, error)
                return null
            }
        })
        .filter((property): property is UnifiedPropertyData => property !== null)
}

/**
 * Converte UnifiedPropertyData para SimplePropertyCard props
 */
export function toSimplePropertyCardProps(property: UnifiedPropertyData) {
    return {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        mainImage: property.mainImage,
        description: property.description,
        showFavoriteButton: true,
    }
}

/**
 * Converte UnifiedPropertyData para PropertyCardPremium props
 */
export function toPropertyCardPremiumProps(property: UnifiedPropertyData & { rawPropertyData?: any }) {
    return {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        parkingSpots: property.parkingSpots,
        mainImage: property.mainImage,
        rawPropertyData: property.rawPropertyData, // Dados brutos para processamento avançado
        description: property.description,
        isHighlight: property.isHighlight,
        isPremium: property.isPremium,
        isNew: property.isNew,
        status: property.status,
        publishedDate: property.publishedDate,
        slug: property.slug,
        showFavoriteButton: true,
    }
}

/**
 * Converte UnifiedPropertyData para PropertyCardUnified props
 */
export function toPropertyCardUnifiedProps(property: UnifiedPropertyData) {
    return {
        id: property.id,
        title: property.title,
        slug: property.slug,
        location: property.location,
        city: property.city,
        price: property.price,
        propertyType: property.propertyType,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parkingSpots: property.parkingSpots,
        mainImage: property.mainImage,
        isHighlight: property.isHighlight,
        isPremium: property.isPremium,
        isNew: property.isNew,
        status: property.status,
    }
}

/**
 * Função utilitária para debug - mostra o mapeamento de campos
 */
export function debugPropertyMapping(imovel: ImovelClient): void {
    console.log('🔍 Debug Property Mapping:', {
        original: {
            _id: imovel._id,
            titulo: imovel.titulo,
            codigo: imovel.codigo,
            dormitorios: imovel.dormitorios,
            banheiros: imovel.banheiros,
            areaUtil: imovel.areaUtil,
            area: imovel.area,
            vagas: imovel.vagas,
            finalidade: imovel.finalidade,
            imagem: imovel.imagem,
        },
        transformed: transformToUnifiedProperty(imovel)
    })
}

// Transformer para PropertyCardSection
export function toPropertyCardSectionProps(property: UnifiedPropertyData): {
    id: string
    title: string
    slug?: string
    price: number
    type: 'venda' | 'aluguel'
    bedrooms: number
    bathrooms: number
    garage: number
    area: number
    location: string
    mainImage: {
        url: string
        alt: string
    }
    isHighlighted?: boolean
} {
    return {
        id: property.id,
        title: property.title || 'Propriedade sem título',
        slug: property.slug,
        price: property.price || 0,
        type: property.propertyType === 'sale' ? 'venda' : 'aluguel',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        garage: property.parkingSpots || 0,
        area: property.area || 0,
        location: property.location || property.city || 'Localização não informada',
        mainImage: {
            url: property.mainImage?.url || '/placeholder-property.jpg',
            alt: property.mainImage?.alt || property.title || 'Imagem da propriedade'
        },
        isHighlighted: property.isHighlight || property.isPremium || false
    }
}

export default {
    transformToUnifiedProperty,
    transformToUnifiedPropertyList,
    toSimplePropertyCardProps,
    toPropertyCardPremiumProps,
    toPropertyCardUnifiedProps,
    toPropertyCardSectionProps,
    debugPropertyMapping
}
