import { NextRequest, NextResponse } from 'next/server';
import { WordPressCatalogService } from '@/lib/services/wordpress-catalog-service';
import { requireAuth } from '@/lib/auth/api-auth-middleware';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 🔐 Autenticação obrigatória
    const authError = await requireAuth(request);
    if (authError) return authError;
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');

    logger.api('/api/dashboard/wordpress-catalog/properties', 'Request', {
      status, search, page, limit
    });

    const result = await WordPressCatalogService.getProperties({
      status: status as 'pending' | 'reviewing' | 'approved' | 'migrated' | 'rejected' | undefined,
      search,
      page,
      limit
    });

    logger.api('/api/dashboard/wordpress-catalog/properties', 'Response', {
      count: result.properties?.length || 0,
      total: result.total
    });

    return NextResponse.json(result);
    
  } catch (error) {
    logger.error('[API] Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
