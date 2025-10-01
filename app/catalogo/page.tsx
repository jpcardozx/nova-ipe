import React from 'react'
import { Metadata } from 'next'
import CatalogWrapper from './components/CatalogWrapper'
import ImageDiagnostic from '../components/ImageDiagnostic'
import { getAllProperties, transformPropertyToImovelClient } from '@/lib/sanity/queries'

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
    
    // Fetch real properties from Sanity
    let properties: any[] = []
    try {
        const sanityProperties = await getAllProperties()
        properties = sanityProperties.map(transformPropertyToImovelClient)
        console.log('✅ Carregadas', properties.length, 'propriedades do Sanity para o catálogo')
    } catch (error) {
        console.error('❌ Erro ao carregar propriedades do Sanity:', error)
        // Fallback to empty array - the component will handle this
        properties = []
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Componente de diagnóstico invisível */}
            <ImageDiagnostic properties={properties} />
            
            {/* Wrapper com hero específico e catálogo */}
            <CatalogWrapper properties={properties} />
        </div>
    )
}