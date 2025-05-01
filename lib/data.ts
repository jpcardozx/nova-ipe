// src/lib/data.ts (ou onde preferir)
import type { Imovel } from '@/src/types/sanity-schema'
import { sanityClient } from '@/lib/sanity'
import {
    queryImovelPorSlug,
    queryImoveisRelacionados,
} from '@/lib/queries'
import { cache } from 'react'

export const getImovelData = cache((slug: string) =>
    sanityClient.fetch<Imovel | null>(queryImovelPorSlug, { slug })
)

export const getImoveisRelacionados = cache((
    id: string,
    categoriaId?: string,
    cidade?: string,
) =>
    sanityClient.fetch<Imovel[]>(
        queryImoveisRelacionados,
        {
            imovelId: id,
            categoriaId: categoriaId ?? '',
            cidade: cidade ?? '',
        },
    )
)
