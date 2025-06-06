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
    "imagemUrl": asset->url,
    "alt": alt
  },
  categoria->{
    _id,
    "categoriaTitulo": titulo,
    "categoriaSlug": slug
  }
`;

export const FRAGMENT_DETALHES = /* groq */ `
  ${FRAGMENT_CAPA},
  descricao,
  endereco,
  estado,
  imagemOpenGraph {
    "imagemUrl": asset->url
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
