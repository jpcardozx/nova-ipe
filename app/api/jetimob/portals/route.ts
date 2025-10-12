/**
 * API Route: /api/jetimob/portals
 * Gerencia portais e sincronização através da API Jetimob
 */

import { NextRequest, NextResponse } from 'next/server'
import { jetimobService } from '@/lib/jetimob/jetimob-service'

export async function GET(request: NextRequest) {
    try {
        const portals = await jetimobService.getPortals()
        
        return NextResponse.json({
            success: true,
            portals,
            total: portals.length
        })
    } catch (error) {
        console.error('Erro ao buscar portais:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao buscar portais da Jetimob',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, propertyId, portalIds } = body

        if (!action || !propertyId || !portalIds) {
            return NextResponse.json(
                { success: false, error: 'Action, propertyId e portalIds são obrigatórios' },
                { status: 400 }
            )
        }

        let success = false
        let message = ''

        if (action === 'sync') {
            await jetimobService.syncPropertyToPortals(propertyId, portalIds)
            success = true
            message = 'Operação de sincronização concluída com sucesso'
        } else if (action === 'unsync') {
            await jetimobService.unsyncPropertyFromPortals(propertyId, portalIds)
            success = true
            message = 'Operação de remoção de sincronização concluída com sucesso'
        } else {
            return NextResponse.json(
                { success: false, error: 'Action deve ser "sync" ou "unsync"' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success,
            message,
            propertyId,
            portalIds,
            action
        })
    } catch (error) {
        console.error('Erro na operação de portal:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro na operação de portal',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}
