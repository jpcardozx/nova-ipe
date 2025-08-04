'use client'

import React, { Suspense } from 'react'
import PropertyCatalogFixed from '@/app/components/property/PropertyCatalogFixed'
import CatalogoHero from './components/CatalogoHero'
import DiferenciacaoCompetitiva from './components/DiferenciacaoCompetitiva'
import { PropertySearchParams } from '@/app/types/property'

interface CatalogoPageProps {
    searchParams?: {
        q?: string
        tipo?: string
        local?: string
        precoMin?: string
        precoMax?: string
        ordem?: string
        dormitorios?: string
        banheiros?: string
        area?: string
        comodidades?: string
    }
}

// Enhanced loading component
function CatalogLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-gray-200"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function CatalogoPageEnhanced({ searchParams }: CatalogoPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <CatalogoHero />

            {/* Main Catalog Content */}
            <main id="oportunidades" className="relative -mt-8">
                <Suspense fallback={<CatalogLoadingSkeleton />}>
                    <PropertyCatalogFixed
                        searchParams={searchParams}
                        variant="catalog"
                        className="relative z-10"
                    />
                </Suspense>
            </main>

            {/* Diferenciação Competitiva */}
            <DiferenciacaoCompetitiva />
        </div>
    )
}