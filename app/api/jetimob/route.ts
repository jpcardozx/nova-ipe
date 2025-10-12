/**
 * API Proxy para Jetimob
 * Resolve problemas de CORS fazendo requests server-side
 */

import { NextRequest, NextResponse } from 'next/server'

const JETIMOB_BASE_URL = process.env.JETIMOB_BASE_URL || 'https://api.jetimob.com/webservice'
const JETIMOB_WEBSERVICE_KEY = process.env.JETIMOB_WEBSERVICE_KEY || ''

export async function GET(request: NextRequest) {
    try {
        // Extrair parâmetros da query
        const { searchParams } = new URL(request.url)
        const endpoint = searchParams.get('endpoint') || 'imoveis'
        const version = searchParams.get('v') || 'v6'

        // Construir URL da Jetimob
        const jetimobUrl = `${JETIMOB_BASE_URL}/${JETIMOB_WEBSERVICE_KEY}/${endpoint}?v=${version}`

        console.log('🔄 [Jetimob Proxy] Fetching:', jetimobUrl)

        // Fazer request para Jetimob
        const response = await fetch(jetimobUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            console.error('❌ [Jetimob Proxy] Error:', response.status, response.statusText)
            return NextResponse.json(
                {
                    error: 'Erro ao buscar dados do Jetimob',
                    status: response.status,
                    statusText: response.statusText
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('✅ [Jetimob Proxy] Success:', endpoint, 'items:', Array.isArray(data) ? data.length : 'N/A')

        return NextResponse.json(data)

    } catch (error) {
        console.error('❌ [Jetimob Proxy] Exception:', error)
        return NextResponse.json(
            {
                error: 'Erro interno no proxy Jetimob',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { endpoint, method = 'POST', data } = body

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint não especificado' },
                { status: 400 }
            )
        }

        // Construir URL da Jetimob
        const jetimobUrl = `${JETIMOB_BASE_URL}/${JETIMOB_WEBSERVICE_KEY}/${endpoint}`

        console.log(`🔄 [Jetimob Proxy] ${method}:`, jetimobUrl)

        // Fazer request para Jetimob
        const response = await fetch(jetimobUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: data ? JSON.stringify(data) : undefined
        })

        if (!response.ok) {
            console.error('❌ [Jetimob Proxy] Error:', response.status, response.statusText)
            return NextResponse.json(
                {
                    error: 'Erro ao enviar dados para Jetimob',
                    status: response.status,
                    statusText: response.statusText
                },
                { status: response.status }
            )
        }

        const responseData = await response.json()
        console.log('✅ [Jetimob Proxy] Success:', method, endpoint)

        return NextResponse.json(responseData)

    } catch (error) {
        console.error('❌ [Jetimob Proxy] Exception:', error)
        return NextResponse.json(
            {
                error: 'Erro interno no proxy Jetimob',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}
