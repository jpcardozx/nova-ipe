import { NextRequest, NextResponse } from 'next/server';
import { WordPressCatalogService } from '@/lib/services/wordpress-catalog-service';
import { requireAuth } from '@/lib/auth/api-auth-middleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[API Stats] Called');
    console.log('[API Stats] Dev Mode Header:', request.headers.get('x-dev-mode'));
    console.log('[API Stats] Auth Header:', request.headers.get('authorization')?.substring(0, 20) + '...');

    // 🔐 Autenticação obrigatória
    const authError = await requireAuth(request);
    if (authError) {
      console.log('[API Stats] Auth failed, returning error');
      return authError;
    }

    console.log('[API Stats] Auth passed, fetching stats...');
    const stats = await WordPressCatalogService.getStats();

    console.log('[API Stats] Success:', stats);

    return NextResponse.json(stats);

  } catch (error) {
    console.error('[API Stats] Error:', error);
    console.error('[API Stats] Error type:', typeof error);
    console.error('[API Stats] Error keys:', error ? Object.keys(error) : 'null');
    console.error('[API Stats] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('[API Stats] Error stringified:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : (typeof error === 'object' && error !== null ? JSON.stringify(error) : 'Unknown error'),
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
