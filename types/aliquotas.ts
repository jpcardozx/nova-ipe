// ========================================
// TYPES - Alíquotas
// ========================================

export interface RentAdjustment {
  id: string
  
  // Referências
  property_id?: string | null
  client_id?: string | null
  
  // Identificação
  property_address: string
  property_code?: string | null
  
  // Inquilino
  tenant_name: string
  tenant_email?: string | null
  tenant_phone?: string | null
  tenant_document?: string | null
  
  // Valores
  current_rent: number
  iptu_value?: number
  condominium_value?: number
  other_charges?: number
  
  // Cálculo
  reference_rate: number
  adjustment_percentage?: number
  calculation_method: 'igpm' | 'ipca' | 'incc' | 'custom'
  
  // Resultado
  new_rent: number
  increase_amount?: number
  
  // Datas
  calculation_date: string
  effective_date?: string | null
  review_date?: string | null
  
  // Status
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'cancelled'
  approval_status: 'pending' | 'approved' | 'rejected'
  
  // Aprovação
  approved_by?: string | null
  approved_at?: string | null
  approval_notes?: string | null
  
  // PDF
  pdf_url?: string | null
  pdf_filename?: string | null
  pdf_generated_at?: string | null
  sent_at?: string | null
  sent_by?: string | null
  sent_to_emails?: string[]
  
  // Resposta inquilino
  tenant_response?: 'accepted' | 'rejected' | 'negotiating' | null
  tenant_response_date?: string | null
  tenant_response_notes?: string | null
  
  // Metadados
  notes?: string | null
  internal_notes?: string | null
  tags?: string[]
  metadata?: Record<string, any>
  calculation_config?: Record<string, any>
  
  // Audit
  created_at: string
  updated_at: string
  created_by?: string | null
  updated_by?: string | null
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface AdjustmentHistory {
  id: string
  adjustment_id: string
  action: string
  action_description?: string | null
  performed_by?: string | null
  performed_by_name?: string | null
  performed_by_role?: string | null
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  metadata?: Record<string, any>
  created_at: string
  ip_address?: string | null
  user_agent?: string | null
}

export interface CalculationSettings {
  id: string
  name: string
  description?: string | null
  code?: string | null
  index_type: 'igpm' | 'ipca' | 'incc' | 'custom'
  base_rate?: number | null
  applies_to: 'residential' | 'commercial' | 'industrial' | 'all'
  property_types?: string[]
  calculation_formula?: string | null
  min_rate?: number | null
  max_rate?: number | null
  valid_from?: string | null
  valid_until?: string | null
  active: boolean
  is_default: boolean
  settings?: Record<string, any>
  created_at: string
  updated_at: string
  created_by?: string | null
  updated_by?: string | null
}

export interface PDFTemplate {
  id: string
  name: string
  description?: string | null
  code: string
  template_type: 'standard' | 'formal' | 'informal' | 'custom'
  header_html?: string | null
  body_html?: string | null
  footer_html?: string | null
  styles_css?: string | null
  page_size: 'A4' | 'Letter' | 'Legal'
  orientation: 'portrait' | 'landscape'
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  available_variables?: string[]
  preview_image_url?: string | null
  active: boolean
  is_default: boolean
  created_at: string
  updated_at: string
  created_by?: string | null
  updated_by?: string | null
}

// CRM Client (já existe no sistema)
export interface CRMClient {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  cpf_cnpj?: string | null
  document?: string | null
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipcode?: string
  }
  client_code?: string | null
  status?: string | null
  priority?: string | null
  assigned_to?: string | null
  budget_min?: number | null
  budget_max?: number | null
  property_type?: string | null
  transaction_type?: string | null
  lead_source?: string | null
  source?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
  created_by?: string | null
}

// Property (simplified from CRM)
export interface Property {
  id: string
  address: string
  code?: string
  monthly_rent?: number
  iptu?: number
  condominium?: number
  tenant_name?: string
  tenant_id?: string
  client_id?: string
}

// Calculation Request
export interface CalculationRequest {
  propertyId?: string
  clientId?: string
  property_address: string
  tenant_name: string
  tenant_email?: string
  tenant_phone?: string
  current_rent: number
  iptu_value?: number
  condominium_value?: number
  reference_rate: number
  calculation_method: 'igpm' | 'ipca' | 'incc' | 'custom'
  effective_date?: string
  notes?: string
}

// Calculation Response
export interface CalculationResponse {
  new_rent: number
  increase_amount: number
  increase_percentage: number
  effective_date: string
  calculation_details: {
    method: string
    rate_applied: number
    base_value: number
    adjustments: Array<{
      type: string
      value: number
      description: string
    }>
  }
}

// Stats & Analytics
export interface AdjustmentStats {
  total: number
  by_status: {
    draft: number
    pending: number
    approved: number
    sent: number
    accepted: number
    rejected: number
    cancelled: number
  }
  by_month: Array<{
    period: string
    count: number
    total_increase: number
    avg_rate: number
  }>
  avg_increase_amount: number
  avg_increase_percentage: number
  total_increase_value: number
  acceptance_rate: number
  pending_approvals: number
  ready_to_send: number
}

// Form States
export interface AdjustmentFormData {
  // Step 1: Client Selection
  useExistingClient: boolean
  client_id?: string
  tenant_name: string
  tenant_email: string
  tenant_phone: string
  tenant_document?: string
  
  // Step 2: Property & Values
  property_address: string
  property_code?: string
  current_rent: string // String for form, converted to number
  iptu_value: string
  condominium_value: string
  other_charges: string
  
  // Step 3: Calculation
  calculation_method: 'igpm' | 'ipca' | 'incc' | 'custom'
  reference_rate: string
  effective_date: string
  review_date?: string
  
  // Step 4: Additional Info
  notes?: string
  internal_notes?: string
  tags?: string[]
}

// Wizard Steps
export type WizardStep = 1 | 2 | 3 | 4

export interface WizardState {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  formData: AdjustmentFormData
  calculationResult?: CalculationResponse
  isCalculating: boolean
  isSaving: boolean
  errors: Record<string, string>
}

// API Responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filters
export interface AdjustmentFilters {
  status?: RentAdjustment['status'] | 'all'
  approval_status?: RentAdjustment['approval_status'] | 'all'
  client_id?: string
  calculation_method?: string
  date_from?: string
  date_to?: string
  search?: string
  sort_by?: 'created_at' | 'calculation_date' | 'new_rent' | 'tenant_name'
  sort_order?: 'asc' | 'desc'
}
