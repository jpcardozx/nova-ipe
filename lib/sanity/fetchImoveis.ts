// lib/sanity/fetchImoveis.ts
import { sanityClient } from '@/lib/sanity'
import {
    queryTodosImoveis,
    queryImoveisParaVenda,
    queryImoveisParaAlugar,
    queryImoveisAluguelDestaque,
    queryImovelEmDestaque,
    queryImovelPorSlug,
} from '@lib/queries'

import { mapImovelToClient } from '@core/mapImovelToClient'
import type { ImovelClient } from '@/types/imovel-client'
import type { ImovelProjetado } from '@/types/imovel-client'

// utilzinho para evitar repetição ↓
const mapMany = (data: ImovelProjetado[]): ImovelClient[] =>
    data.map(mapImovelToClient)

// ———————————————————————————————————————————————————————————————————
// LISTAGENS
// ———————————————————————————————————————————————————————————————————
export async function getTodosImoveis(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelProjetado[]>(queryTodosImoveis)
    return mapMany(data)
}

export async function getImoveisParaVenda(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelProjetado[]>(queryImoveisParaVenda)
    return mapMany(data)
}

export async function getImoveisParaAlugar(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelProjetado[]>(queryImoveisParaAlugar)
    return mapMany(data)
}

export async function getImoveisAluguelDestaque(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelProjetado[]>(
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
    const data = await sanityClient.fetch<ImovelProjetado | null>(
        queryImovelPorSlug,
        { slug }
    )
    return data ? mapImovelToClient(data) : null
}

// consulta por ID se precisar (usa a mesma query; slug é ignorado)
export async function getImovelPorId(
    id: string
): Promise<ImovelClient | null> {
    const data = await sanityClient.fetch<ImovelProjetado | null>(
        queryImovelPorSlug,
        { id }
    )
    return data ? mapImovelToClient(data) : null
}

// ———————————————————————————————————————————————————————————————————
// VITRINE (ex-home)
// ———————————————————————————————————————————————————————————————————
export async function getImovelEmDestaque(): Promise<ImovelClient[]> {
    const data = await sanityClient.fetch<ImovelProjetado[]>(
        queryImovelEmDestaque
    )
    return mapMany(data)
}
