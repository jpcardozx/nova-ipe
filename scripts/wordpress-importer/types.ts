// Types for WordPress to Sanity migration
export interface WPLProperty {
  id: number
  kind: number
  deleted: number
  mls_id: string
  listing: number
  property_type: number
  location1_name: string // Estado
  location2_name: string // Cidade
  location3_name: string // Bairro
  location4_name: string // Sub-região
  price: number
  price_unit: number
  bedrooms: number
  bathrooms: number
  living_area: number
  living_area_unit: number
  lot_area: number
  lot_area_unit: number
  add_date: string
  field_42?: string // Rua
  field_312?: string // Título página
  field_313?: string // Título imóvel
  field_308?: string // Descrição
  pic_numb: number // Número de fotos
  
  // JSON fields
  rendered_data?: string // field_7 contains JSON with formatted data
}

export interface SanityProperty {
  _type: 'imovel'
  titulo: string
  slug: {
    _type: 'slug'
    current: string
  }
  categoria?: {
    _type: 'reference'
    _ref: string
  }
  finalidade: 'Venda' | 'Aluguel' | 'Temporada'
  descricao?: string
  dormitorios?: number
  banheiros?: number
  areaUtil?: number
  vagas?: number
  tipoImovel?: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'
  preco?: number
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  documentacaoOk?: boolean
  aceitaFinanciamento?: boolean
  status?: 'disponivel' | 'reservado' | 'vendido'
  codigoInterno?: string
  observacoesInternas?: string
  destaque?: boolean
  // Photos will be handled separately
  _wpId?: number // Store original WP ID for reference
  _wpPhotos?: number // Number of photos to fetch
}

export interface ImportCheckpoint {
  lastProcessedId: number
  totalProcessed: number
  totalFailed: number
  errors: Array<{
    id: number
    error: string
    timestamp: string
  }>
  completedBatches: number[]
  startedAt: string
  lastUpdatedAt: string
}

export interface PropertyTypeMapping {
  wpId: number
  wpName: string
  sanityType: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'
}

export interface ListingTypeMapping {
  wpId: number
  wpName: string
  sanityFinalidade: 'Venda' | 'Aluguel' | 'Temporada'
}

// Standard mappings based on WPL plugin defaults
export const PROPERTY_TYPE_MAPPINGS: Record<number, 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'> = {
  3: 'Apartamento',
  6: 'Apartamento', // Kitnet
  7: 'Casa',
  10: 'Comercial', // Loja
  13: 'Comercial', // Sala
  15: 'Outro', // Chácara
  16: 'Outro', // Sítio
  18: 'Comercial', // Salão
  0: 'Outro'
}

export const LISTING_TYPE_MAPPINGS: Record<number, 'Venda' | 'Aluguel' | 'Temporada'> = {
  9: 'Venda', // Compra e Venda
  10: 'Aluguel',
  0: 'Venda'
}
