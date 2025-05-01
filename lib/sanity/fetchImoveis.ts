// lib/sanity/fetchImoveis.ts
import { sanityClient } from "@/lib/sanity"
import {
    queryTodosImoveis,
    queryImoveisParaVenda,
    queryImoveisParaAlugar,
    queryImoveisAluguelDestaque,
    queryImovelPorSlug
} from "@/lib/queries"
import type { ImovelExtended } from "@/src/types/imovel-extended"

export async function getTodosImoveis(): Promise<ImovelExtended[]> {
    return sanityClient.fetch(queryTodosImoveis)
}

export async function getImoveisParaVenda(): Promise<ImovelExtended[]> {
    return sanityClient.fetch(queryImoveisParaVenda)
}

export async function getImoveisParaAlugar(): Promise<ImovelExtended[]> {
    return sanityClient.fetch(queryImoveisParaAlugar)
}

export async function getImoveisAluguelDestaque(): Promise<ImovelExtended[]> {
    return sanityClient.fetch(queryImoveisAluguelDestaque)
}

export async function getImovelPorSlug(slug: string): Promise<ImovelExtended | null> {
    return sanityClient.fetch(queryImovelPorSlug, { slug })
}

export async function getImovelPorId(id: string): Promise<ImovelExtended | null> {
    return sanityClient.fetch(queryImovelPorSlug, { id })
}

export async function getImovelEmDestaque(): Promise<ImovelExtended[]> {
    return sanityClient.fetch(queryImoveisAluguelDestaque)
}
