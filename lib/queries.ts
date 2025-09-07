/**
 * Main queries file - Updated to use new Sanity structure
 */

import { getFeaturedProperties, getRentalProperties, getSaleProperties, getHomePageData as getSanityHomeData } from './sanity/queries'

// Re-export the functions from the new Sanity queries
export { getFeaturedProperties, getRentalProperties, getSaleProperties }

// Main function to get home page data
export async function getHomePageData() {
  return await getSanityHomeData()
}

// Export the specific queries needed by lib/data.ts
export const queryImovelPorSlug = `*[_type == "imovel" && slug.current == $slug][0]{
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
  destaque,
  imagemUrl,
  imagemOpenGraph,
  imagem,
  galeria,
  descricao,
  caracteristicas,
  localizacao,
  infraestrutura,
  _createdAt,
  _updatedAt
}`

export const queryImoveisRelacionados = `*[
  _type == "imovel" && 
  (bairro == $bairro || tipoImovel == $tipoImovel) && 
  _id != $id
][0...4]{
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
  imagemUrl,
  imagem
}`