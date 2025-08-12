import React from 'react'
import { Metadata } from 'next'
import CatalogoHeroClean from './components/CatalogoHeroClean'
import PropertyCatalogClean from './components/PropertyCatalogClean'

export const metadata: Metadata = {
    title: 'Catálogo de Imóveis | Ipê Concept',
    description: 'Explore nossa seleção premium de imóveis em Guararema e região.',
}

interface SearchParams {
    q?: string
    tipo?: string
    local?: string
    preco?: string
    quartos?: string
}

interface CatalogoPageProps {
    searchParams: Promise<SearchParams>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
    const params = await searchParams

    return (
        <main className="min-h-screen">
            <CatalogoHeroClean />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PropertyCatalogClean searchParams={params as Record<string, string>} />
            </div>
        </main>
    )
}