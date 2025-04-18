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
