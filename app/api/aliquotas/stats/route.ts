/**
 * API Route: /api/aliquotas/stats
 * 
 * GET: Retorna estatísticas do dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Buscar estatísticas da view
    const { data: stats, error: statsError } = await supabase
      .from('adjustment_statistics')
      .select('*')
      .single();
    
    if (statsError) {
      throw statsError;
    }
    
    // Buscar reajustes recentes (últimos 5)
    const { data: recent, error: recentError } = await supabase
      .from('rent_adjustments')
      .select('id, tenant_name, property_address, new_rent, status, effective_date')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      throw recentError;
    }
    
    // Buscar reajustes pendentes de aprovação
    const { data: pending, error: pendingError } = await supabase
      .from('rent_adjustments')
      .select('id, tenant_name, property_address, new_rent, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5);
    
    if (pendingError) {
      throw pendingError;
    }
    
    // Calcular tendências (comparação com mês anterior)
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const { count: thisMonthCount } = await supabase
      .from('rent_adjustments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayThisMonth.toISOString());
    
    const { count: lastMonthCount } = await supabase
      .from('rent_adjustments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayLastMonth.toISOString())
      .lt('created_at', firstDayThisMonth.toISOString());
    
    const trend = lastMonthCount && lastMonthCount > 0
      ? ((thisMonthCount || 0) - lastMonthCount) / lastMonthCount * 100
      : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total: stats?.total_adjustments || 0,
          pending: stats?.pending_adjustments || 0,
          approved: stats?.approved_adjustments || 0,
          sent: stats?.sent_adjustments || 0,
          draft: stats?.draft_adjustments || 0,
          generated: stats?.generated_adjustments || 0,
          trend: Math.round(trend * 10) / 10, // 1 casa decimal
        },
        recent: recent || [],
        pending_approval: pending || [],
        monthly: {
          this_month: thisMonthCount || 0,
          last_month: lastMonthCount || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    return NextResponse.json(
      {
        error: 'Erro ao buscar estatísticas',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
