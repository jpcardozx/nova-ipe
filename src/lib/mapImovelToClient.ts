// src/lib/mapImovelToClient.ts
import { urlFor } from '@/src/lib/sanity'
import type { Imovel as SanityImovel } from '@/src/types/sanity-schema'
import type { ImovelClient, CategoriaFull } from '@/src/types/imovel-client'

// ——————————————————————————————————————————————————————————————
// Type guard para detectar referências não-populadas
interface SanityRef { _ref: string }
const isRef = (v: unknown): v is SanityRef =>
  typeof v === 'object' && v !== null && '_ref' in v

// Type guard para CategoriaFull
function isCategoriaFull(v: unknown): v is CategoriaFull {
  return (
    typeof v === 'object' &&
    v !== null &&
    'titulo' in v &&
    typeof (v as any).titulo === 'string'
  )
}

// Type guard para imagem com alt
interface SanityImageWithAlt { alt?: unknown }
const hasAlt = (v: unknown): v is SanityImageWithAlt =>
  typeof v === 'object' && v !== null && 'alt' in v

// ——————————————————————————————————————————————————————————————
// Constrói o objeto de imagem para o cliente
function toClientImage(
  img: SanityImovel['imagem'] | SanityImovel['imagemOpenGraph'],
  width = 1200
): { url: string; alt?: string } | undefined {
  if (!img) return undefined

  return {
    url: urlFor(img).width(width).url(),
    alt: hasAlt(img) && typeof img.alt === 'string' ? img.alt : undefined
  }
}

// ——————————————————————————————————————————————————————————————
// Faz o map do objeto Sanity para a forma consumida pelos componentes
export function mapImovelToClient(imovel: SanityImovel): ImovelClient {
  // Normaliza categoria: undefined se for ref, ou CategoriaFull
  const categoria =
    imovel.categoria && !isRef(imovel.categoria) && isCategoriaFull(imovel.categoria)
      ? imovel.categoria
      : undefined

  return {
    ...imovel,
    imagem: toClientImage(imovel.imagem),
    imagemOpenGraph: toClientImage(imovel.imagemOpenGraph, 1200),
    categoria
  }
}
