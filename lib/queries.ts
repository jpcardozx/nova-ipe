export const queryTodosImoveis = `
  *[_type == "imovel" && status == "disponivel"] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    preco,
    destaque,
    categoria->{ titulo, slug },
    bairro,
    cidade,
    imagem { asset->{ url } }
  }
`

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
    metaTitle,
    metaDescription,
    videoTour
  }
`

// lib/queries.ts

export const queryImoveisAluguelDestaque = `
  *[_type == "imovel" && finalidade == "Aluguel" && destaque == true] | order(_createdAt desc)[0...6] {
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
    finalidade
  }
`

export const queryImoveisParaVenda = `
  *[_type == "imovel" && categoria->slug.current == "venda"] | order(_createdAt desc)[0...6] {
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
    aceitaFinanciamento
  }
`

export const queryImoveisParaAlugar = `
  *[_type == "imovel" && categoria->slug.current == "aluguel"] | order(_createdAt desc)[0...6] {
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
    aceitaFinanciamento
  }
`

