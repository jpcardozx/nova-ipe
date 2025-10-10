/**
 * Serviço de Cálculo de Reajuste de Aluguel
 * 
 * Implementa a lógica de cálculo de reajuste baseado em índices
 * (IGPM, IPCA, INCC) conforme Lei do Inquilinato 8.245/1991
 */

import { format, differenceInMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CalculationInput {
  current_rent: number;
  index_type: 'igpm' | 'ipca' | 'incc' | 'custom';
  adjustment_percentage: number;
  contract_date: Date;
  last_adjustment_date?: Date;
  iptu_value?: number;
  condominium_value?: number;
  other_charges?: number;
}

export interface CalculationResult {
  // Valores base
  current_rent: number;
  adjustment_percentage: number;
  increase_amount: number;
  new_rent: number;
  
  // Valores adicionais
  iptu_value: number;
  condominium_value: number;
  other_charges: number;
  current_total: number;
  new_total: number;
  total_increase: number;
  
  // Metadados
  index_type: string;
  index_name: string;
  calculation_date: Date;
  months_since_last_adjustment: number;
  is_annual_adjustment: boolean;
  
  // Breakdown detalhado
  breakdown: {
    label: string;
    current_value: number;
    new_value: number;
    change: number;
  }[];
}

/**
 * Calcula o reajuste de aluguel
 */
export function calculateRentAdjustment(input: CalculationInput): CalculationResult {
  const {
    current_rent,
    index_type,
    adjustment_percentage,
    contract_date,
    last_adjustment_date,
    iptu_value = 0,
    condominium_value = 0,
    other_charges = 0,
  } = input;

  // Calcular incremento
  const increase_amount = (current_rent * adjustment_percentage) / 100;
  const new_rent = current_rent + increase_amount;

  // Calcular totais
  const current_total = current_rent + iptu_value + condominium_value + other_charges;
  const new_total = new_rent + iptu_value + condominium_value + other_charges;
  const total_increase = new_total - current_total;

  // Calcular meses desde último reajuste
  const referenceDate = last_adjustment_date || contract_date;
  const months_since_last_adjustment = differenceInMonths(new Date(), referenceDate);
  const is_annual_adjustment = months_since_last_adjustment >= 12;

  // Nome do índice
  const index_name = getIndexName(index_type);

  // Breakdown detalhado
  const breakdown = [
    {
      label: 'Aluguel',
      current_value: current_rent,
      new_value: new_rent,
      change: increase_amount,
    },
  ];

  if (iptu_value > 0) {
    breakdown.push({
      label: 'IPTU (mensal)',
      current_value: iptu_value,
      new_value: iptu_value,
      change: 0,
    });
  }

  if (condominium_value > 0) {
    breakdown.push({
      label: 'Condomínio',
      current_value: condominium_value,
      new_value: condominium_value,
      change: 0,
    });
  }

  if (other_charges > 0) {
    breakdown.push({
      label: 'Outras taxas',
      current_value: other_charges,
      new_value: other_charges,
      change: 0,
    });
  }

  breakdown.push({
    label: 'TOTAL',
    current_value: current_total,
    new_value: new_total,
    change: total_increase,
  });

  return {
    current_rent,
    adjustment_percentage,
    increase_amount,
    new_rent,
    iptu_value,
    condominium_value,
    other_charges,
    current_total,
    new_total,
    total_increase,
    index_type,
    index_name,
    calculation_date: new Date(),
    months_since_last_adjustment,
    is_annual_adjustment,
    breakdown,
  };
}

/**
 * Calcula a data de vigência do reajuste
 */
export function calculateEffectiveDate(
  contract_date: Date,
  last_adjustment_date?: Date
): Date {
  const referenceDate = last_adjustment_date || contract_date;
  return addMonths(referenceDate, 12);
}

/**
 * Valida se o reajuste pode ser aplicado
 */
export function validateAdjustment(
  contract_date: Date,
  last_adjustment_date?: Date
): {
  valid: boolean;
  reason?: string;
  months_remaining?: number;
} {
  const referenceDate = last_adjustment_date || contract_date;
  const months_since_last = differenceInMonths(new Date(), referenceDate);

  if (months_since_last < 12) {
    return {
      valid: false,
      reason: 'Reajuste só pode ser aplicado após 12 meses do último reajuste ou data do contrato',
      months_remaining: 12 - months_since_last,
    };
  }

  return { valid: true };
}

/**
 * Obtém o nome completo do índice
 */
export function getIndexName(index_type: string): string {
  const names: Record<string, string> = {
    'igpm': 'Índice Geral de Preços do Mercado',
    'ipca': 'Índice Nacional de Preços ao Consumidor Amplo',
    'incc': 'Índice Nacional de Custo da Construção',
    'custom': 'Taxa Customizada',
  };
  return names[index_type.toLowerCase()] || index_type;
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Formata data
 */
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Formata data por extenso
 */
export function formatDateLong(date: Date): string {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/**
 * Gera texto legal para carta
 */
export function generateLegalText(index_type: string): string {
  return `O reajuste é baseado na variação acumulada do índice ${getIndexName(index_type)} no período de 12 meses anteriores à data de aniversário do contrato, em conformidade com a Lei nº 8.245/1991 (Lei do Inquilinato).`;
}

/**
 * Calcula projeção de reajuste futuro
 */
export function projectFutureAdjustment(
  current_rent: number,
  annual_percentage: number,
  years: number
): number {
  let projected_rent = current_rent;
  
  for (let i = 0; i < years; i++) {
    projected_rent = projected_rent * (1 + annual_percentage / 100);
  }
  
  return projected_rent;
}

/**
 * Calcula economia/custo adicional comparado a outro índice
 */
export function compareIndexes(
  current_rent: number,
  percentage1: number,
  percentage2: number
): {
  difference_percentage: number;
  difference_amount: number;
  cheaper_index: number;
} {
  const new_rent1 = current_rent * (1 + percentage1 / 100);
  const new_rent2 = current_rent * (1 + percentage2 / 100);
  
  const difference_amount = Math.abs(new_rent1 - new_rent2);
  const difference_percentage = (difference_amount / current_rent) * 100;
  const cheaper_index = new_rent1 < new_rent2 ? 1 : 2;

  return {
    difference_percentage,
    difference_amount,
    cheaper_index,
  };
}
