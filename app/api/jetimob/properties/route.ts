/**
 * API Route: /api/jetimob/properties
 * Gerencia imóveis através da API Jetimob
 */

import { NextRequest, NextResponse } from 'next/server'
import { jetimobService } from '@/lib/jetimob/jetimob-service'

export async function GET(request: NextRequest) {
    try {
        // Verificar autenticação do usuário primeiro
        // const session = await getServerSession(authOptions)
        // if (!session) {
        //     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        // }

        const properties = await jetimobService.getProperties()
        
        return NextResponse.json({
            success: true,
            properties,
            total: properties.length
        })
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao buscar imóveis da Jetimob',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions)
        // if (!session) {
        //     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        // }

        const body = await request.json()
        const { property } = body

        if (!property) {
            return NextResponse.json(
                { success: false, error: 'Dados do imóvel são obrigatórios' },
                { status: 400 }
            )
        }

        const newProperty = await jetimobService.createProperty(property)
        
        return NextResponse.json({
            success: true,
            property: newProperty
        }, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar imóvel:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao criar imóvel na Jetimob',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}
