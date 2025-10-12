/**
 * API Route: /api/jetimob/properties/[id]
 * Gerencia imóvel específico através da API Jetimob
 */

import { NextRequest, NextResponse } from 'next/server'
import { jetimobService } from '@/lib/jetimob/jetimob-service'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const propertyId = params.id
        const property = await jetimobService.getProperty(propertyId)
        
        if (!property) {
            return NextResponse.json(
                { success: false, error: 'Imóvel não encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            property
        })
    } catch (error) {
        console.error('Erro ao buscar imóvel:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao buscar imóvel',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const propertyId = params.id
        const body = await request.json()
        const { updates } = body

        if (!updates) {
            return NextResponse.json(
                { success: false, error: 'Dados de atualização são obrigatórios' },
                { status: 400 }
            )
        }

        const updatedProperty = await jetimobService.updateProperty(propertyId, updates)
        
        return NextResponse.json({
            success: true,
            property: updatedProperty
        })
    } catch (error) {
        console.error('Erro ao atualizar imóvel:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao atualizar imóvel',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const propertyId = params.id
        await jetimobService.deleteProperty(propertyId)

        return NextResponse.json({
            success: true,
            message: 'Imóvel deletado com sucesso'
        })
    } catch (error) {
        console.error('Erro ao deletar imóvel:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao deletar imóvel',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}
