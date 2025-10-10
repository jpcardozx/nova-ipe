/**
 * API Route: POST /api/aliquotas/calculate
 * 
 * Calcula reajuste de aluguel sem salvar no banco
 * Útil para simulações e preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateRentAdjustment, calculateEffectiveDate, validateAdjustment, CalculationInput } from '@/lib/services/aliquotas/calculation';

// Schema de validação
const CalculationSchema = z.object({
  current_rent: z.number().positive('Valor do aluguel deve ser positivo'),
  index_type: z.enum(['igpm', 'ipca', 'incc', 'custom'], {
    errorMap: () => ({ message: 'Índice inválido' })
  }),
  adjustment_percentage: z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100'),
  contract_date: z.string().transform((val) => new Date(val)),
  last_adjustment_date: z.string().transform((val) => new Date(val)).optional(),
  iptu_value: z.number().min(0).optional().default(0),
  condominium_value: z.number().min(0).optional().default(0),
  other_charges: z.number().min(0).optional().default(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar input
    const validatedData = CalculationSchema.parse(body);
    
    // Validar se pode aplicar reajuste
    const validation = validateAdjustment(
      validatedData.contract_date,
      validatedData.last_adjustment_date
    );
    
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.reason,
          months_remaining: validation.months_remaining,
        },
        { status: 400 }
      );
    }
    
    // Calcular reajuste
    const calculationInput: CalculationInput = {
      current_rent: validatedData.current_rent,
      index_type: validatedData.index_type,
      adjustment_percentage: validatedData.adjustment_percentage,
      contract_date: validatedData.contract_date,
      last_adjustment_date: validatedData.last_adjustment_date,
      iptu_value: validatedData.iptu_value,
      condominium_value: validatedData.condominium_value,
      other_charges: validatedData.other_charges,
    };
    const result = calculateRentAdjustment(calculationInput);
    
    // Calcular data de vigência
    const effective_date = calculateEffectiveDate(
      validatedData.contract_date,
      validatedData.last_adjustment_date
    );
    
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        effective_date,
      },
    });
  } catch (error) {
    console.error('Error calculating adjustment:', error);
    
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
        error: 'Erro ao calcular reajuste',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
