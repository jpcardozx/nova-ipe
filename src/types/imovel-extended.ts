import type { Imovel } from "./sanity-schema"

type ImagemComUrl = {
    asset: {
        url: string
    }
}

export interface ImovelExtended extends Omit<Imovel, "imagem" | "imagemOpenGraph" | "categoria"> {
    _id: string
    imagem?: ImagemComUrl
    imagemOpenGraph?: ImagemComUrl
    categoria?: {
        titulo: string
        slug: {
            current: string
        }
    }
}
