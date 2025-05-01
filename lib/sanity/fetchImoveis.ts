// lib/sanity/fetchImoveis.ts
import { sanityClient } from '@/lib/sanity'
import {
    queryTodosImoveis,
    queryImoveisParaVenda,
    queryImoveisParaAlugar,
    queryImoveisAluguelDestaque,
    queryImovelEmDestaque,
    queryImovelPorSlug,
} from '@/lib/queries'

import { mapImovelToClient } from '@/src/lib/mapImovelToClient'
import type { ImovelClient } from '@/src/types/imovel-client'
import type { Imovel as ImovelSanity } from '@/src/types/sanity-schema'

// utilzinho para evitar repetição ↓
const mapMany = (data: ImovelSanity[]): ImovelClient[] =>
    data.map(mapImovelToClient)

// ———————————————————————————————————————————————————————————————————
// LISTAGENS
// ———————————————————————————————————————————————————————————————————
export async function getTodosImoveis(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelSanity[]>(queryTodosImoveis)
    return mapMany(data)
}

export async function getImoveisParaVenda(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelSanity[]>(queryImoveisParaVenda)
    return mapMany(data)
}

export async function getImoveisParaAlugar(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelSanity[]>(queryImoveisParaAlugar)
    return mapMany(data)
}

export async function getImoveisAluguelDestaque(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelSanity[]>(
        queryImoveisAluguelDestaque
    )
    return mapMany(data)
}

// ———————————————————————————————————————————————————————————————————
// INDIVIDUAL
// ———————————————————————————————————————————————————————————————————
export async function getImovelPorSlug(
    slug: string
): Promise<ImovelClient | null> {
    const data = await sanityClient.fetch<ImovelSanity | null>(
        queryImovelPorSlug,
        { slug }
    )
    return data ? mapImovelToClient(data) : null
}

// consulta por ID se precisar (usa a mesma query; slug é ignorado)
export async function getImovelPorId(
    id: string
): Promise<ImovelClient | null> {
    const data = await sanityClient.fetch<ImovelSanity | null>(
        queryImovelPorSlug,
        { id }
    )
    return data ? mapImovelToClient(data) : null
}

// ———————————————————————————————————————————————————————————————————
// VITRINE (ex-home)
// ———————————————————————————————————————————————————————————————————
export async function getImovelEmDestaque(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelSanity[]>(
        queryImovelEmDestaque
    )
    return mapMany(data)
}
