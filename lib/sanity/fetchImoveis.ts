/**
 * Property fetch functions - Compatibility layer
 * Maps to the new sanity/queries functions
 */
import { 
  getRentalProperties, 
  getSaleProperties, 
  getFeaturedProperties,
  getAllProperties,
  getPropertyBySlug,
  transformPropertyToImovelClient
} from './queries'
import type { ImovelClient } from '@/src/types/imovel-client'
import type { Property } from './queries'

// Re-export query functions for compatibility
export { 
  getRentalProperties, 
  getSaleProperties, 
  getFeaturedProperties,
  getAllProperties,
  getPropertyBySlug
}

// Compatibility exports with the expected function names
export async function getImoveisParaVenda(): Promise<ImovelClient[]> {
  const properties = await getSaleProperties()
  return properties.map(transformPropertyToImovelClient)
}

export async function getImoveisParaAlugar(): Promise<ImovelClient[]> {
  const properties = await getRentalProperties()
  return properties.map(transformPropertyToImovelClient)
}

export async function getImovelEmDestaque(): Promise<ImovelClient[]> {
  const properties = await getFeaturedProperties()
  return properties.map(transformPropertyToImovelClient)
}

export async function getTodosImoveis(): Promise<ImovelClient[]> {
  const properties = await getAllProperties()
  return properties.map(transformPropertyToImovelClient)
}

export async function getImovelPorSlug(slug: string): Promise<ImovelClient | null> {
  const property = await getPropertyBySlug(slug)
  return property ? transformPropertyToImovelClient(property) : null
}

// Make transformPropertyToImovelClient available externally
function transformPropertyToImovelClientLocal(property: Property): ImovelClient {
  return {
    _id: property._id,
    id: property._id,
    titulo: property.titulo,
    slug: typeof property.slug === 'object' ? property.slug.current : property.slug,
    preco: property.preco,
    finalidade: property.finalidade,
    tipoImovel: property.tipoImovel as 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro',
    bairro: property.bairro,
    cidade: property.cidade,
    dormitorios: property.dormitorios,
    banheiros: property.banheiros,
    areaUtil: property.areaUtil,
    vagas: property.vagas,
    destaque: property.destaque,
    // Campos adicionais importantes
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
}

export { transformPropertyToImovelClientLocal as transformPropertyToImovelClient }
