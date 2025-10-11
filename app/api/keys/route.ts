import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET /api/keys - Lista todas as entregas de chaves
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { searchParams } = new URL(request.url)

        // Filtros opcionais
        const status = searchParams.get('status')
        const client_name = searchParams.get('client_name')

        // Query base usando a view
        let query = supabase
            .from('key_deliveries')
            .select('*')
            .order('updated_at', { ascending: false })

        // Aplicar filtros se fornecidos
        if (status && status !== 'all') {
            query = query.eq('delivery_status', status)
        }

        if (client_name) {
            query = query.ilike('client_name', `%${client_name}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching key deliveries:', error)
            return NextResponse.json(
                { error: 'Failed to fetch key deliveries', details: error.message },
                { status: 500 }
            )
        }

        // Calcular estatísticas
        const stats = {
            total: data?.length || 0,
            scheduled: data?.filter(d => d.delivery_status === 'scheduled').length || 0,
            delivered: data?.filter(d => d.delivery_status === 'delivered').length || 0,
            pending: data?.filter(d => d.delivery_status === 'pending').length || 0,
            returned: data?.filter(d => d.delivery_status === 'returned').length || 0
        }

        return NextResponse.json({
            deliveries: data || [],
            stats
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/keys - Registra nova entrega de chave
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const body = await request.json()

        const {
            lead_id,
            property_id,
            property_title,
            property_address,
            scheduled_date,
            contract_id,
            deposit_amount,
            keys_count = 1,
            notes,
            broker_name
        } = body

        // Validações
        if (!lead_id || !property_id || !property_title || !property_address) {
            return NextResponse.json(
                { error: 'Missing required fields: lead_id, property_id, property_title, property_address' },
                { status: 400 }
            )
        }

        // Verificar se o lead existe e está no status "won"
        const { data: lead, error: leadError } = await supabase
            .from('document_management_leads')
            .select('id, status')
            .eq('id', lead_id)
            .single()

        if (leadError || !lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            )
        }

        if (lead.status !== 'won') {
            return NextResponse.json(
                { error: 'Lead must be in "won" status to register key delivery' },
                { status: 400 }
            )
        }

        // Chamar a function do PostgreSQL
        const { data, error } = await supabase.rpc('register_key_delivery', {
            p_lead_id: lead_id,
            p_property_id: property_id,
            p_property_title: property_title,
            p_property_address: property_address,
            p_scheduled_date: scheduled_date || null,
            p_contract_id: contract_id || null,
            p_deposit_amount: deposit_amount || null,
            p_keys_count: keys_count,
            p_notes: notes || null,
            p_broker_name: broker_name || null
        })

        if (error) {
            console.error('Error registering key delivery:', error)
            return NextResponse.json(
                { error: 'Failed to register key delivery', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Key delivery registered successfully'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH /api/keys - Atualiza status de entrega
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const body = await request.json()

        const { lead_id, status, date } = body

        // Validações
        if (!lead_id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: lead_id, status' },
                { status: 400 }
            )
        }

        const validStatuses = ['scheduled', 'delivered', 'returned', 'pending', 'cancelled']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            )
        }

        // Chamar a function do PostgreSQL
        const { data, error } = await supabase.rpc('update_key_delivery_status', {
            p_lead_id: lead_id,
            p_status: status,
            p_date: date || new Date().toISOString()
        })

        if (error) {
            console.error('Error updating key delivery status:', error)
            return NextResponse.json(
                { error: 'Failed to update key delivery status', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Key delivery status updated successfully'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
