import { NextRequest, NextResponse } from 'next/server';
import { WordPressCatalogService, WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service';
import { requireAuth } from '@/lib/auth/api-auth-middleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    // 🔐 Autenticação obrigatória - apenas admin pode atualizar status
    const authError = await requireAuth(request);
    if (authError) return authError;
    
    const body = await request.json();
    const { id, status, notes } = body;
    
    console.log('[API UpdateStatus] Called:', {
      id, status, notes
    });
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id, status' },
        { status: 400 }
      );
    }
    
    const result = await WordPressCatalogService.updatePropertyStatus(
      id as string,
      status as WordPressPropertyRecord['status'],
      notes as string | undefined
    );
    
    console.log('[API] Status updated:', result);
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('[API] Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
