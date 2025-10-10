/**
 * API Route: /api/aliquotas/adjustments/[id]
 * 
 * GET: Busca um reajuste específico
 * PATCH: Atualiza um reajuste
 * DELETE: Remove um reajuste
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Schema para atualização parcial
const UpdateAdjustmentSchema = z.object({
  tenant_name: z.string().min(1).optional(),
  tenant_email: z.string().email().optional(),
  tenant_cpf: z.string().optional(),
  property_address: z.string().min(1).optional(),
  property_code: z.string().optional(),
  current_rent: z.number().positive().optional(),
  new_rent: z.number().positive().optional(),
  increase_amount: z.number().optional(),
  adjustment_percentage: z.number().min(0).max(100).optional(),
  iptu_value: z.number().min(0).optional(),
  condominium_value: z.number().min(0).optional(),
  other_charges: z.number().min(0).optional(),
  total_monthly: z.number().positive().optional(),
  effective_date: z.string().transform((val) => new Date(val)).optional(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'generated', 'sent']).optional(),
});

/**
 * GET: Buscar reajuste por ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await supabase
      .from('rent_adjustments')
      .select('*, crm_clients(name, email, phone)')
      .eq('id', params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Reajuste não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    // Buscar histórico
    const { data: history } = await supabase
      .from('adjustment_history')
      .select('*')
      .eq('adjustment_id', params.id)
      .order('changed_at', { ascending: false });
    
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        history: history || [],
      },
    });
  } catch (error) {
    console.error('Error fetching adjustment:', error);
    
    return NextResponse.json(
      {
        error: 'Erro ao buscar reajuste',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Atualizar reajuste
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const body = await request.json();
    const validatedData = UpdateAdjustmentSchema.parse(body);
    
    // Verificar se existe
    const { data: existing } = await supabase
      .from('rent_adjustments')
      .select('id')
      .eq('id', params.id)
      .single();
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Reajuste não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar
    const { data, error } = await supabase
      .from('rent_adjustments')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error updating adjustment:', error);
    
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
        error: 'Erro ao atualizar reajuste',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remover reajuste
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Verificar se existe
    const { data: existing } = await supabase
      .from('rent_adjustments')
      .select('id, pdf_url')
      .eq('id', params.id)
      .single();
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Reajuste não encontrado' },
        { status: 404 }
      );
    }
    
    // Deletar PDF do R2 se existir
    if (existing.pdf_url) {
      try {
        const { deletePDFFromR2 } = await import('@/lib/services/aliquotas/storage');
        const key = existing.pdf_url.split('/').slice(-1)[0]; // Extrair key
        await deletePDFFromR2(`aliquotas/pdfs/${key}`);
      } catch (storageError) {
        console.error('Error deleting PDF from storage:', storageError);
        // Continuar mesmo se falhar
      }
    }
    
    // Deletar registro
    const { error } = await supabase
      .from('rent_adjustments')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reajuste removido com sucesso',
    });
  } catch (error) {
    console.error('Error deleting adjustment:', error);
    
    return NextResponse.json(
      {
        error: 'Erro ao remover reajuste',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
