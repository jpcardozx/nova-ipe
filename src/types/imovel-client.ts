// src/types/imovel-client.ts
import type { Imovel as CoreImovel } from "@/src/types/sanity-schema"

// ——————————————————————————————————————————————————————————————————————————————
// Quando a categoria vem só como referência do Sanity
export interface CategoriaRef {
    _type: "reference"
    _ref: string
}

// Quando a categoria está populada (full) diretamente do Sanity
export interface CategoriaFull {
    _type: "categoria"
    slug: { current: string }
    titulo: string
}

// União: pode ser ref _ou_ full
export type Categoria = CategoriaRef | CategoriaFull

// ——————————————————————————————————————————————————————————————————————————————
// Nosso payload de cliente: herda tudo de CoreImovel,
// exceto imagem, imagemOpenGraph e categoria
export interface ImovelClient
    extends Omit<CoreImovel, "imagem" | "imagemOpenGraph" | "categoria"> {

    // imagens normalizadas
    imagem?: { url?: string; alt?: string }
    imagemOpenGraph?: { url?: string }

    // categoria somente se veio populada
    categoria?: Categoria
}
