/**
 * API Route: /api/aliquotas/adjustments
 * 
 * GET: Lista reajustes com filtros
 * POST: Cria novo reajuste
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Schema para criação
const CreateAdjustmentSchema = z.object({
  client_id: z.string().uuid('ID do cliente inválido'),
  tenant_name: z.string().min(1, 'Nome do locatário é obrigatório'),
  tenant_email: z.string().email('Email inválido'),
  tenant_cpf: z.string().optional(),
  property_address: z.string().min(1, 'Endereço é obrigatório'),
  property_code: z.string().optional(),
  contract_date: z.string().transform((val) => new Date(val)),
  last_adjustment_date: z.string().transform((val) => new Date(val)).optional(),
  current_rent: z.number().positive('Valor do aluguel deve ser positivo'),
  new_rent: z.number().positive('Novo valor deve ser positivo'),
  increase_amount: z.number(),
  adjustment_percentage: z.number().min(0).max(100),
  iptu_value: z.number().min(0).default(0),
  condominium_value: z.number().min(0).default(0),
  other_charges: z.number().min(0).default(0),
  total_monthly: z.number().positive(),
  index_type: z.enum(['igpm', 'ipca', 'incc', 'custom']),
  effective_date: z.string().transform((val) => new Date(val)),
  notes: z.string().optional(),
  template_id: z.string().uuid().optional(),
});

/**
 * GET: Lista reajustes
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const searchParams = request.nextUrl.searchParams;
    
    // Filtros
    const status = searchParams.get('status');
    const client_id = searchParams.get('client_id');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');
    const search = searchParams.get('search');
    
    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Query base
    let query = supabase
      .from('rent_adjustments')
      .select('*, crm_clients(name, email)', { count: 'exact' });
    
    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }
    
    if (client_id) {
      query = query.eq('client_id', client_id);
    }
    
    if (from_date) {
      query = query.gte('effective_date', from_date);
    }
    
    if (to_date) {
      query = query.lte('effective_date', to_date);
    }
    
    if (search) {
      query = query.or(`tenant_name.ilike.%${search}%,property_address.ilike.%${search}%`);
    }
    
    // Ordenação e paginação
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching adjustments:', error);
    
    return NextResponse.json(
      {
        error: 'Erro ao buscar reajustes',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Cria novo reajuste
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const body = await request.json();
    
    // Validar input
    const validatedData = CreateAdjustmentSchema.parse(body);
    
    // Inserir no banco
    const { data, error } = await supabase
      .from('rent_adjustments')
      .insert({
        ...validatedData,
        status: 'draft',
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating adjustment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Erro ao criar reajuste',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
