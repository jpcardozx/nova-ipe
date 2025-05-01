// src/lib/sanity/fragments.groq.ts
export const FRAGMENT_CAPA = /* groq */ `
  _id,
  titulo,
  slug,
  preco,
  destaque,
  finalidade,
  bairro,
  cidade,
  imagem {
    "url": asset->url,
    "alt": alt
  },
  categoria->{
    _id,
    titulo,
    slug
  }
`;

export const FRAGMENT_DETALHES = /* groq */ `
  ${FRAGMENT_CAPA},
  descricao,
  endereco,
  estado,
  imagemOpenGraph {
    "url": asset->url
  },
  aceitaFinanciamento,
  area,
  areaUtil,
  documentacaoOk,
  videoTour,
  metaTitle,
  metaDescription,
  tags
`;
