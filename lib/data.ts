// src/lib/data.ts
import { cache } from 'react'
import { sanityClient } from '@/lib/sanity'
import {
    queryImovelPorSlug,
    queryImoveisRelacionados,
} from '@lib/queries'

import type { Imovel } from '../src/types/sanity-schema'

// Carrega 1 imóvel completo pelo slug (usado no SSR da página)
export const getImovelData = cache((slug: string): Promise<Imovel | null> =>
    sanityClient.fetch(queryImovelPorSlug, { slug })
)

// Carrega imóveis relacionados com filtros opcionais
export const getImoveisRelacionados = cache((
    imovelId: string,
    categoriaId?: string,
    cidade?: string
): Promise<Imovel[]> =>
    sanityClient.fetch(queryImoveisRelacionados, {
        imovelId, // ⚠️ deve corresponder ao parâmetro da query
        categoriaId: categoriaId || undefined,
        cidade: cidade || undefined,
    })
)
