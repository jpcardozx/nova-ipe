import { NextResponse } from 'next/server'
import { getFeaturedProperties, transformPropertyToImovelClient, Property } from '../../../lib/sanity/queries'
import type { ImovelClient } from '../../../src/types/imovel-client'

// Removed edge runtime to support @sanity/client
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
    try {
        const imoveis = await getFeaturedProperties()
        
        // Transform to ImovelClient and filter by 'venda' if needed
        const imoveisClient = imoveis.map(transformPropertyToImovelClient)
        const imoveisVenda = imoveisClient.filter(
            (i: ImovelClient) => i.finalidade?.toLowerCase() === 'venda' &&
                (!i.status || i.status === 'disponivel')
        )

        return NextResponse.json(imoveisVenda, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        })
    } catch (error) {
        console.error('Error in imoveis-destaque API route:', error)
        return NextResponse.json(
            { error: 'Failed to fetch featured properties' },
            { status: 500 }
        )
    }
} 
