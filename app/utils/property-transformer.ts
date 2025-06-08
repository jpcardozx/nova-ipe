// Property transformer to convert ProcessedProperty to Premium component format
import { ProcessedProperty } from '../types/property'

interface PropertyData {
    id: string
    title: string
    price: number
    address: string
    location?: string
    images: { url: string; alt?: string }[]
    mainImage?: { url: string; alt?: string }
    bedrooms?: number
    bathrooms?: number
    area?: number
    parkingSpots?: number
    type?: 'sale' | 'rent'
    tags?: string[]
    featured?: boolean
    isNew?: boolean
    isPremium?: boolean
    exclusive?: boolean
    trend?: string
}

export function transformProcessedPropertyToPremium(property: ProcessedProperty): PropertyData {
    // Extract image URLs from Sanity references
    const images = (property.imagens || []).map(img => ({
        url: img.asset?.url || img.asset?._ref || '',
        alt: img.alt || property.title || property.titulo || 'Imagem do imóvel'
    })).filter(img => img.url)

    // Get main image
    const mainImage = property.mainImage || (images.length > 0 ? images[0] : undefined)

    // Determine type from categoria
    const type = property.categoria === 'venda' ? 'sale' : 'rent'

    // Generate tags based on property features
    const tags: string[] = []
    if (property.destaque || property.featured || property.isPremium) tags.push('Destaque')
    if (property.isNew) tags.push('Novo')
    if (property.garagem || (property.parkingSpots && property.parkingSpots > 0)) tags.push('Garagem')
    if (property.area && property.area > 200) tags.push('Espaçoso')
    if (type === 'sale' && property.preco > 1000000) tags.push('Premium')

    return {
        id: property._id || property.id || '',
        title: property.title || property.titulo || '',
        price: property.price || property.preco || 0,
        address: property.location || property.localizacao || '',
        location: property.location || property.localizacao || '',
        images,
        mainImage,
        bedrooms: property.bedrooms || property.quartos,
        bathrooms: property.bathrooms || property.banheiros,
        area: property.area,
        parkingSpots: property.parkingSpots || (property.garagem ? 1 : 0),
        type,
        tags,
        featured: property.featured || property.destaque || false,
        isNew: property.isNew || false,
        isPremium: property.isPremium || property.destaque || false,
        exclusive: property.featured || property.destaque || false,
        trend: type === 'sale' ? 'Vendas' : 'Locações'
    }
}

export function transformPropertiesArrayToPremium(properties: ProcessedProperty[]): PropertyData[] {
    return properties.map(transformProcessedPropertyToPremium)
}
