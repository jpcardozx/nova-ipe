// lib/auth/types.ts
export interface UserRole {
  id: string
  name: string
  permissions: Permission[]
  hierarchy_level: number
}

export interface Permission {
  id: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  department?: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login?: string
  permissions: Permission[]
}

export interface AccessRequest {
  id: string
  full_name: string
  email: string
  phone: string
  department: string
  requested_role: string
  justification: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  reviewer_notes?: string
  documents?: AccessRequestDocument[]
}

export interface AccessRequestDocument {
  id: string
  request_id: string
  file_name: string
  file_type: string
  file_url: string
  uploaded_at: string
}

export interface LoginAttempt {
  id: string
  email: string
  ip_address: string
  user_agent: string
  success: boolean
  failure_reason?: string
  attempted_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource: string
  resource_id?: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}