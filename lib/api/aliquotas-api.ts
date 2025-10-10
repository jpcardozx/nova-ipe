// ========================================
// ALÍQUOTAS API CLIENT
// Uses authenticated-fetch with React Query
// ========================================

import { createClient } from '@supabase/supabase-js'
import type {
  RentAdjustment,
  AdjustmentHistory,
  CalculationSettings,
  PDFTemplate,
  CRMClient,
  CalculationRequest,
  CalculationResponse,
  AdjustmentStats,
  AdjustmentFilters,
  ApiResponse,
  PaginatedResponse
} from '@/types/aliquotas'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================================
// Helper: Get Auth Headers
// ========================================
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Usuário não autenticado')
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  }
}

// ========================================
// Helper: Fetch with Auth
// ========================================
async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders()
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// ========================================
// CALCULATIONS
// ========================================

/**
 * Calculate rent adjustment
 */
export async function calculateRentAdjustment(
  data: CalculationRequest
): Promise<CalculationResponse> {
  return authenticatedFetch<CalculationResponse>(
    '/api/aliquotas/calculate',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}

/**
 * Get calculation settings
 */
export async function getCalculationSettings(): Promise<CalculationSettings[]> {
  const { data, error } = await supabase
    .from('calculation_settings')
    .select('*')
    .eq('active', true)
    .order('is_default', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get default calculation settings
 */
export async function getDefaultCalculationSettings(): Promise<CalculationSettings | null> {
  const { data, error } = await supabase
    .from('calculation_settings')
    .select('*')
    .eq('active', true)
    .eq('is_default', true)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

// ========================================
// ADJUSTMENTS CRUD
// ========================================

/**
 * Create new adjustment
 */
export async function createAdjustment(
  data: Partial<RentAdjustment>
): Promise<RentAdjustment> {
  return authenticatedFetch<RentAdjustment>(
    '/api/aliquotas/adjustments',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}

/**
 * Get adjustment by ID
 */
export async function getAdjustment(id: string): Promise<RentAdjustment> {
  return authenticatedFetch<RentAdjustment>(
    `/api/aliquotas/adjustments/${id}`
  )
}

/**
 * Update adjustment
 */
export async function updateAdjustment(
  id: string,
  data: Partial<RentAdjustment>
): Promise<RentAdjustment> {
  return authenticatedFetch<RentAdjustment>(
    `/api/aliquotas/adjustments/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data)
    }
  )
}

/**
 * Delete adjustment (soft delete)
 */
export async function deleteAdjustment(id: string): Promise<void> {
  return authenticatedFetch<void>(
    `/api/aliquotas/adjustments/${id}`,
    {
      method: 'DELETE'
    }
  )
}

/**
 * List adjustments with filters
 */
export async function listAdjustments(
  filters: AdjustmentFilters = {},
  page = 1,
  limit = 20
): Promise<PaginatedResponse<RentAdjustment>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  })
  
  return authenticatedFetch<PaginatedResponse<RentAdjustment>>(
    `/api/aliquotas/adjustments?${params}`
  )
}

// ========================================
// APPROVALS
// ========================================

/**
 * Approve adjustment
 */
export async function approveAdjustment(
  id: string,
  notes?: string
): Promise<RentAdjustment> {
  return authenticatedFetch<RentAdjustment>(
    `/api/aliquotas/adjustments/${id}/approve`,
    {
      method: 'POST',
      body: JSON.stringify({ notes })
    }
  )
}

/**
 * Reject adjustment
 */
export async function rejectAdjustment(
  id: string,
  reason: string
): Promise<RentAdjustment> {
  return authenticatedFetch<RentAdjustment>(
    `/api/aliquotas/adjustments/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ reason })
    }
  )
}

// ========================================
// PDF GENERATION
// ========================================

/**
 * Generate PDF for adjustments
 */
export async function generatePDF(
  adjustmentIds: string[],
  templateId?: string
): Promise<{ pdfUrl: string; filename: string }> {
  return authenticatedFetch<{ pdfUrl: string; filename: string }>(
    '/api/aliquotas/pdf/generate',
    {
      method: 'POST',
      body: JSON.stringify({ adjustmentIds, templateId })
    }
  )
}

/**
 * Send PDF via email
 */
export async function sendPDF(
  adjustmentId: string,
  emails: string[],
  message?: string
): Promise<{ sent: boolean; sentTo: string[] }> {
  return authenticatedFetch<{ sent: boolean; sentTo: string[] }>(
    '/api/aliquotas/pdf/send',
    {
      method: 'POST',
      body: JSON.stringify({ adjustmentId, emails, message })
    }
  )
}

/**
 * Get PDF templates
 */
export async function getPDFTemplates(): Promise<PDFTemplate[]> {
  const { data, error } = await supabase
    .from('pdf_templates')
    .select('*')
    .eq('active', true)
    .order('is_default', { ascending: false })
  
  if (error) throw error
  return data || []
}

// ========================================
// HISTORY
// ========================================

/**
 * Get adjustment history
 */
export async function getAdjustmentHistory(
  adjustmentId: string
): Promise<AdjustmentHistory[]> {
  const { data, error } = await supabase
    .from('adjustment_history')
    .select('*')
    .eq('adjustment_id', adjustmentId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// ========================================
// STATISTICS
// ========================================

/**
 * Get adjustment statistics
 */
export async function getAdjustmentStats(): Promise<AdjustmentStats> {
  return authenticatedFetch<AdjustmentStats>(
    '/api/aliquotas/stats'
  )
}

// ========================================
// CRM INTEGRATION
// ========================================

/**
 * Search CRM clients
 */
export async function searchCRMClients(
  query: string,
  limit = 10
): Promise<CRMClient[]> {
  const { data, error } = await supabase
    .from('crm_clients')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,cpf_cnpj.ilike.%${query}%`)
    .limit(limit)
    .order('name')
  
  if (error) throw error
  return data || []
}

/**
 * Get client by ID
 */
export async function getCRMClient(clientId: string): Promise<CRMClient | null> {
  const { data, error } = await supabase
    .from('crm_clients')
    .select('*')
    .eq('id', clientId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Get client's properties (contracts/rentals)
 */
export async function getClientProperties(clientId: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      id,
      contract_number,
      contract_type,
      total_value,
      monthly_payment,
      start_date,
      end_date,
      status,
      property:properties(
        id,
        titulo,
        endereco,
        bairro,
        cidade
      )
    `)
    .eq('client_id', clientId)
    .eq('contract_type', 'rent')
    .order('start_date', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get recent adjustments for client
 */
export async function getClientRecentAdjustments(
  clientId: string,
  limit = 5
): Promise<RentAdjustment[]> {
  const { data, error } = await supabase
    .from('rent_adjustments')
    .select('*')
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// ========================================
// BULK OPERATIONS
// ========================================

/**
 * Bulk approve adjustments
 */
export async function bulkApproveAdjustments(
  ids: string[],
  notes?: string
): Promise<{ approved: number; failed: string[] }> {
  return authenticatedFetch<{ approved: number; failed: string[] }>(
    '/api/aliquotas/bulk/approve',
    {
      method: 'POST',
      body: JSON.stringify({ ids, notes })
    }
  )
}

/**
 * Bulk send PDFs
 */
export async function bulkSendPDFs(
  adjustmentIds: string[],
  message?: string
): Promise<{ sent: number; failed: string[] }> {
  return authenticatedFetch<{ sent: number; failed: string[] }>(
    '/api/aliquotas/bulk/send',
    {
      method: 'POST',
      body: JSON.stringify({ adjustmentIds, message })
    }
  )
}

// ========================================
// VALIDATION
// ========================================

/**
 * Validate calculation data
 */
export function validateCalculationData(data: CalculationRequest): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}
  
  if (!data.property_address || data.property_address.trim().length < 10) {
    errors.property_address = 'Endereço do imóvel deve ter pelo menos 10 caracteres'
  }
  
  if (!data.tenant_name || data.tenant_name.trim().length < 3) {
    errors.tenant_name = 'Nome do inquilino deve ter pelo menos 3 caracteres'
  }
  
  if (data.tenant_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.tenant_email)) {
    errors.tenant_email = 'E-mail inválido'
  }
  
  if (data.current_rent <= 0) {
    errors.current_rent = 'Valor do aluguel atual deve ser maior que zero'
  }
  
  if (data.current_rent > 1000000) {
    errors.current_rent = 'Valor do aluguel parece muito alto'
  }
  
  if (data.reference_rate < 0 || data.reference_rate > 1) {
    errors.reference_rate = 'Taxa de referência deve estar entre 0% e 100%'
  }
  
  if (data.iptu_value && data.iptu_value < 0) {
    errors.iptu_value = 'Valor do IPTU não pode ser negativo'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ========================================
// EXPORT ALL
// ========================================

export const aliquotasApi = {
  // Calculations
  calculateRentAdjustment,
  getCalculationSettings,
  getDefaultCalculationSettings,
  
  // CRUD
  createAdjustment,
  getAdjustment,
  updateAdjustment,
  deleteAdjustment,
  listAdjustments,
  
  // Approvals
  approveAdjustment,
  rejectAdjustment,
  
  // PDF
  generatePDF,
  sendPDF,
  getPDFTemplates,
  
  // History
  getAdjustmentHistory,
  
  // Stats
  getAdjustmentStats,
  
  // CRM
  searchCRMClients,
  getCRMClient,
  getClientProperties,
  getClientRecentAdjustments,
  
  // Bulk
  bulkApproveAdjustments,
  bulkSendPDFs,
  
  // Validation
  validateCalculationData
}
