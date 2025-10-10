/**
 * API Route: /api/aliquotas/pdf/generate
 * 
 * POST: Gera PDF da carta de reajuste
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { generateAdjustmentPDF, generateFilename } from '@/lib/services/aliquotas/pdf-generation';
import { uploadPDFToR2 } from '@/lib/services/aliquotas/storage';

// Schema de validação
const GeneratePDFSchema = z.object({
  adjustment_id: z.string().uuid(),
  send_email: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const body = await request.json();
    const { adjustment_id, send_email } = GeneratePDFSchema.parse(body);
    
    // Buscar dados do reajuste
    const { data: adjustment, error: adjustmentError } = await supabase
      .from('rent_adjustments')
      .select('*')
      .eq('id', adjustment_id)
      .single();
    
    if (adjustmentError || !adjustment) {
      return NextResponse.json(
        { error: 'Reajuste não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar template (usar o especificado ou o default)
    const { data: template, error: templateError } = await supabase
      .from('pdf_templates')
      .select('*')
      .eq(adjustment.template_id ? 'id' : 'is_default', adjustment.template_id || true)
      .eq('active', true)
      .single();
    
    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      );
    }
    
    // Preparar dados para o PDF
    const pdfData = {
      adjustment_id: adjustment.id,
      client_id: adjustment.client_id,
      tenant_name: adjustment.tenant_name,
      tenant_email: adjustment.tenant_email,
      tenant_cpf: adjustment.tenant_cpf,
      property_address: adjustment.property_address,
      property_code: adjustment.property_code,
      contract_date: new Date(adjustment.contract_date),
      last_adjustment_date: adjustment.last_adjustment_date ? new Date(adjustment.last_adjustment_date) : undefined,
      current_rent: adjustment.current_rent,
      new_rent: adjustment.new_rent,
      increase_amount: adjustment.increase_amount,
      adjustment_percentage: adjustment.adjustment_percentage,
      iptu_value: adjustment.iptu_value || 0,
      condominium_value: adjustment.condominium_value || 0,
      other_charges: adjustment.other_charges || 0,
      total_monthly: adjustment.total_monthly,
      index_type: adjustment.index_type,
      index_name: adjustment.index_name || '',
      effective_date: new Date(adjustment.effective_date),
      manager_name: adjustment.manager_name,
      manager_role: adjustment.manager_role,
      manager_creci: adjustment.manager_creci,
      signature_image: adjustment.signature_image,
      notes: adjustment.notes,
    };
    
    // Gerar PDF
    const pdfResult = await generateAdjustmentPDF(template, pdfData);
    
    // Upload para R2
    const filename = generateFilename(adjustment.tenant_name, adjustment.id);
    const uploadResult = await uploadPDFToR2(
      pdfResult.buffer,
      filename,
      {
        adjustment_id: adjustment.id,
        client_id: adjustment.client_id,
        generated_at: new Date().toISOString(),
      }
    );
    
    // Atualizar registro com URL do PDF
    const { error: updateError } = await supabase
      .from('rent_adjustments')
      .update({
        pdf_url: uploadResult.url,
        pdf_filename: filename,
        pdf_generated_at: new Date().toISOString(),
        status: 'generated',
      })
      .eq('id', adjustment_id);
    
    if (updateError) {
      console.error('Error updating adjustment:', updateError);
    }
    
    // Se solicitado envio de email
    if (send_email) {
      // Importar dinamicamente para evitar erro se não configurado
      const { sendAdjustmentEmail } = await import('@/lib/services/aliquotas/email-sender');
      
      try {
        await sendAdjustmentEmail({
          recipient_email: adjustment.tenant_email,
          recipient_name: adjustment.tenant_name,
          property_address: adjustment.property_address,
          current_rent: adjustment.current_rent,
          new_rent: adjustment.new_rent,
          adjustment_percentage: adjustment.adjustment_percentage,
          effective_date: new Date(adjustment.effective_date),
          index_type: adjustment.index_type,
          pdf_url: uploadResult.url,
          pdf_filename: filename,
        });
        
        // Atualizar status para enviado
        await supabase
          .from('rent_adjustments')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', adjustment_id);
        
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Não falhar a request se o email falhou
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        pdf_url: uploadResult.url,
        pdf_filename: filename,
        size: uploadResult.size,
        pages: pdfResult.pages,
        generated_at: pdfResult.generated_at,
        email_sent: send_email,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    
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
        error: 'Erro ao gerar PDF',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
