export interface PropertySearchParams {
  q?: string
  tipo?: string
  local?: string
  precoMin?: number
  precoMax?: number
  dormitorios?: string
  banheiros?: string
  area?: string
  comodidades?: string[]
  ordem?: string
}

export interface PropertyData {
  id: string
  title: string
  price: number
  location: string
  city: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  gallery: string[]
  amenities: string[]
  featured: boolean
  slug: string
  description: string
  address: string
  parkingSpots?: number
  totalArea?: number
  publicationDate?: string
  exclusive?: boolean
  isNew?: boolean
  trend?: string
}
