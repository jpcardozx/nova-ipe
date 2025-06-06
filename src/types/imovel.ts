// src/types/imovel.ts

type AssetWithUrl = {
  url: string
}

export type ImagemComUrl = {
  asset: AssetWithUrl
}

export interface ImovelData {
  _id: string
  titulo: string
  slug: { current: string }
  preco?: number
  categoria?: {
    titulo: string
    slug: { current: string }
  }
  cidade?: string
  bairro?: string
  descricao?: string
  metaTitle?: string
  metaDescription?: string
  imagem?: ImagemComUrl
  imagemOpenGraph?: ImagemComUrl
  videoTour?: string
  endereco?: string
  mapaLink?: string
  metros?: string
  finalidade?: "Venda" | "Aluguel" | "Temporada"
  destaque?: boolean
  aceitaFinanciamento?: boolean
  linkPersonalizado?: string
  dormitorios?: number;
  banheiros?: number;
  areaUtil?: number;
  vagas?: number;
  tipoImovel?: string;
}
