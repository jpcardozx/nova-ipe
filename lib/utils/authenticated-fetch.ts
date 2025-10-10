import { supabase } from '@/lib/supabase'

/**
 * Helper para fazer requisições autenticadas às API routes
 */

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // 🚀 DESENVOLVIMENTO: Liberar acesso em localhost
  const isDevelopment = process.env.NODE_ENV === 'development' &&
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost')

  if (isDevelopment) {
    console.log('🔓 [authenticatedFetch] Modo desenvolvimento: bypass de autenticação')
    const headers = new Headers(options.headers)
    headers.set('Content-Type', 'application/json')
    headers.set('X-Dev-Mode', 'true')

    return fetch(url, {
      ...options,
      headers
    })
  }

  // Obtém a sessão atual do Supabase
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session - please login first')
  }

  // Adiciona o token de autenticação no header
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${session.access_token}`)
  headers.set('Content-Type', 'application/json')

  return fetch(url, {
    ...options,
    headers
  })
}

/**
 * Helper específico para o dashboard
 */
export const dashboardApi = {
  async getStats() {
    const response = await authenticatedFetch('/api/dashboard/wordpress-catalog/stats')
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },

  async getProperties(params: {
    status?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params.status) searchParams.set('status', params.status)
    if (params.search) searchParams.set('search', params.search)
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())

    const response = await authenticatedFetch(
      `/api/dashboard/wordpress-catalog/properties?${searchParams}`
    )
    if (!response.ok) throw new Error('Failed to fetch properties')
    return response.json()
  },

  async updatePropertyStatus(
    id: string,
    status: string,
    notes?: string
  ) {
    const response = await authenticatedFetch(
      '/api/dashboard/wordpress-catalog/update-status',
      {
        method: 'PATCH',
        body: JSON.stringify({ id, status, notes })
      }
    )
    if (!response.ok) throw new Error('Failed to update status')
    return response.json()
  }
}
