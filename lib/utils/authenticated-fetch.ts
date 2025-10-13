/**
 * 🔐 Authenticated Fetch - Dashboard API Client
 * Cliente HTTP autenticado para chamadas de API do dashboard
 */

import { WordPressPropertyRecord } from '@/lib/services/wordpress-catalog-service'

export interface DashboardApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PropertyFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface StatsData {
  total: number
  ready_to_migrate: number
  by_status: Record<string, number>
  pending?: number
  reviewing?: number
  approved?: number
  migrated?: number
  rejected?: number
}

export interface PropertiesResponse {
  properties: WordPressPropertyRecord[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  totalPages: number
}

class DashboardApiClient {
  private baseUrl = '/api/dashboard'

  /**
   * Faz requisição autenticada para API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Inclui cookies (sessão Supabase)
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[DashboardApi] Request error:', error)
      throw error
    }
  }

  /**
   * Busca estatísticas do catálogo WordPress
   */
  async getStats(): Promise<StatsData> {
    return this.request<StatsData>('/wordpress-catalog/stats')
  }

  /**
   * Busca propriedades com filtros
   */
  async getProperties(filters: PropertyFilters = {}): Promise<PropertiesResponse> {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = `/wordpress-catalog/properties${queryString ? `?${queryString}` : ''}`
    
    return this.request<PropertiesResponse>(endpoint)
  }

  /**
   * Atualiza status de uma propriedade
   */
  async updatePropertyStatus(
    propertyId: string,
    status: WordPressPropertyRecord['status'],
    notes?: string
  ): Promise<DashboardApiResponse<{ success: boolean }>> {
    return this.request<DashboardApiResponse<{ success: boolean }>>(
      '/wordpress-catalog/update-status',
      {
        method: 'POST',
        body: JSON.stringify({ propertyId, status, notes }),
      }
    )
  }

  /**
   * Busca detalhes de uma propriedade específica
   */
  async getProperty(propertyId: string): Promise<WordPressPropertyRecord> {
    return this.request<WordPressPropertyRecord>(
      `/wordpress-catalog/properties/${propertyId}`
    )
  }

  /**
   * Aprova uma propriedade
   */
  async approveProperty(
    propertyId: string,
    notes?: string
  ): Promise<DashboardApiResponse<{ success: boolean }>> {
    return this.updatePropertyStatus(propertyId, 'approved', notes)
  }

  /**
   * Rejeita uma propriedade
   */
  async rejectProperty(
    propertyId: string,
    reason: string
  ): Promise<DashboardApiResponse<{ success: boolean }>> {
    return this.updatePropertyStatus(propertyId, 'rejected', reason)
  }

  /**
   * Marca propriedade como migrada
   */
  async markAsMigrated(
    propertyId: string,
    sanityId?: string
  ): Promise<DashboardApiResponse<{ success: boolean }>> {
    return this.request<DashboardApiResponse<{ success: boolean }>>(
      '/wordpress-catalog/update-status',
      {
        method: 'POST',
        body: JSON.stringify({ 
          propertyId, 
          status: 'migrated',
          sanityId 
        }),
      }
    )
  }
}

// Singleton instance
export const dashboardApi = new DashboardApiClient()
