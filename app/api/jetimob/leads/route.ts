/**
 * API Route: /api/jetimob/leads
 * Gerencia leads através da API Jetimob
 */

import { NextRequest, NextResponse } from 'next/server'
import { jetimobService } from '@/lib/jetimob/jetimob-service'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Construir filtros a partir dos query parameters
        const filters: any = {}
        
        const propertyId = searchParams.get('property_id')
        const status = searchParams.get('status')
        const dateFrom = searchParams.get('date_from')
        const dateTo = searchParams.get('date_to')
        
        if (propertyId) filters.property_id = propertyId
        if (status) filters.status = status
        if (dateFrom) filters.date_from = dateFrom
        if (dateTo) filters.date_to = dateTo

        const leads = await jetimobService.getLeads(Object.keys(filters).length > 0 ? filters : undefined)
        
        return NextResponse.json({
            success: true,
            leads,
            total: leads.length,
            filters: filters
        })
    } catch (error) {
        console.error('Erro ao buscar leads:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao buscar leads da Jetimob',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { leadId, status } = body

        if (!leadId || !status) {
            return NextResponse.json(
                { success: false, error: 'Lead ID e status são obrigatórios' },
                { status: 400 }
            )
        }

        const success = await jetimobService.updateLeadStatus(leadId, status)
        
        if (!success) {
            return NextResponse.json(
                { success: false, error: 'Erro ao atualizar status do lead' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Status do lead atualizado com sucesso'
        })
    } catch (error) {
        console.error('Erro ao atualizar lead:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao atualizar lead',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}
