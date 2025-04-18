export interface ImovelData {
  titulo: string
  slug: { current: string }
  preco?: number
  categoria?: { titulo: string }
  cidade?: string
  bairro?: string
  descricao?: string
  imagem?: { asset: { url: string } }
  imagemOpenGraph?: { asset: { url: string } }
  metaTitle?: string
  metaDescription?: string
  videoTour?: string
  endereco?: string
  linkPersonalizado?: string
}
