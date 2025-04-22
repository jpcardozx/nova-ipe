// Todos os imóveis disponíveis (com fallback para listagem geral)
export const queryTodosImoveis = `
  *[
    _type == "imovel" &&
    status == "disponivel"
  ] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    categoria->{ titulo, slug },
    finalidade,
    bairro,
    cidade,
    imagem { asset->{ url } }
  }
`

// Imóvel individual por slug (detalhes simbólicos + SEO)
export const queryImovelPorSlug = `
  *[_type == "imovel" && slug.current == $slug][0] {
    titulo,
    descricao,
    preco,
    endereco,
    bairro,
    cidade,
    estado,
    categoria->{ titulo, slug },
    imagem { asset->{ url } },
    imagemOpenGraph { asset->{ url } },
    aceitaFinanciamento,
    metros,
    area,
    finalidade,
    destaque,
    documentacaoOk,
    videoTour,
    metaTitle,
    metaDescription,
    tags
  }
`

// Imóveis para aluguel com destaque (Home)
export const queryImoveisAluguelDestaque = `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    lower(finalidade) == "aluguel" &&
    destaque == true
  ] | order(_createdAt desc)[0...6] {
    _id,
    slug,
    titulo,
    cidade,
    bairro,
    preco,
    destaque,
    categoria->{ titulo, slug },
    imagem { asset->{ url } },
    aceitaFinanciamento,
    area,
    metros,
    finalidade
  }
`

// Imóveis para venda (ex: página /comprar)
export const queryImoveisParaVenda = `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    lower(finalidade) == "venda"
  ] | order(_createdAt desc)[0...30] {
    _id,
    slug,
    titulo,
    preco,
    cidade,
    bairro,
    imagem { asset->{ url } },
    categoria->{ titulo, slug },
    destaque,
    area,
    metros,
    aceitaFinanciamento
  }
`

// Imóveis para aluguel (ex: página /alugar)
export const queryImoveisParaAlugar = `
  *[
    _type == "imovel" &&
    status == "disponivel" &&
    lower(finalidade) == "aluguel"
  ] | order(_createdAt desc)[0...30] {
    _id,
    slug,
    titulo,
    preco,
    cidade,
    bairro,
    imagem { asset->{ url } },
    categoria->{ titulo, slug },
    destaque,
    area,
    metros,
    aceitaFinanciamento
  }
`
