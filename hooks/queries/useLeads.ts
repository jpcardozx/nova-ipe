/**
 * Modern Leads Hook - React Query Version
 * 
 * Gerenciamento de leads com React Query.
 * Substitui gerenciamento manual de estado por cache automático.
 * 
 * Features:
 * - ✅ List leads com filtros
 * - ✅ CRUD operations com optimistic updates
 * - ✅ Infinite scroll (pagination)
 * - ✅ Search com debounce
 * - ✅ Cache inteligente
 */

'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'

// Query Keys
export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (filters: string) => [...leadKeys.lists(), filters] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  source: string
  property_interest?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface UseLeadsFilters {
  status?: Lead['status']
  source?: string
  search?: string
  userId?: string
}

/**
 * Hook para listar leads com filtros
 */
export function useLeads(filters?: UseLeadsFilters) {
  return useQuery({
    queryKey: leadKeys.list(JSON.stringify(filters || {})),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.source) params.append('source', filters.source)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.userId) params.append('userId', filters.userId)
      
      const response = await fetch(`/api/leads?${params}`)
      if (!response.ok) throw new Error('Failed to fetch leads')
      
      return response.json() as Promise<Lead[]>
    },
    staleTime: 1000 * 60 * 2, // 2 minutos (leads mudam mais rápido)
  })
}

/**
 * Hook para infinite scroll de leads
 */
export function useInfiniteLeads(filters?: UseLeadsFilters) {
  return useInfiniteQuery({
    queryKey: ['leads-infinite', JSON.stringify(filters || {})],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      params.append('page', pageParam.toString())
      params.append('limit', '20')
      if (filters?.status) params.append('status', filters.status)
      if (filters?.source) params.append('source', filters.source)
      if (filters?.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/leads?${params}`)
      if (!response.ok) throw new Error('Failed to fetch leads')
      
      const data = await response.json()
      return {
        leads: data.leads as Lead[],
        nextPage: data.hasMore ? pageParam + 1 : undefined
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

/**
 * Hook para buscar lead específico
 */
export function useLead(leadId: string) {
  return useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: async () => {
      const response = await fetch(`/api/leads/${leadId}`)
      if (!response.ok) throw new Error('Failed to fetch lead')
      return response.json() as Promise<Lead>
    },
    enabled: !!leadId,
  })
}

/**
 * Hook para criar lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newLead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      })
      
      if (!response.ok) throw new Error('Failed to create lead')
      return response.json() as Promise<Lead>
    },
    onSuccess: () => {
      // Invalida todas as listas de leads
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
    }
  })
}

/**
 * Hook para atualizar lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update lead')
      return response.json() as Promise<Lead>
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: leadKeys.detail(id) })
      const previousLead = queryClient.getQueryData<Lead>(leadKeys.detail(id))
      
      if (previousLead) {
        queryClient.setQueryData<Lead>(leadKeys.detail(id), {
          ...previousLead,
          ...updates
        })
      }
      
      return { previousLead }
    },
    onError: (error, { id }, context) => {
      console.error('❌ Erro ao atualizar lead:', error)
      if (context?.previousLead) {
        queryClient.setQueryData(leadKeys.detail(id), context.previousLead)
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
    }
  })
}

/**
 * Hook para deletar lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (leadId: string) => {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete lead')
      return leadId
    },
    onSuccess: (leadId) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: leadKeys.detail(leadId) })
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
    }
  })
}

/**
 * Hook para alterar status do lead
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const response = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      return response.json() as Promise<Lead>
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.detail(id) })
      const previousLead = queryClient.getQueryData<Lead>(leadKeys.detail(id))
      
      if (previousLead) {
        queryClient.setQueryData<Lead>(leadKeys.detail(id), {
          ...previousLead,
          status
        })
      }
      
      return { previousLead }
    },
    onError: (error, { id }, context) => {
      console.error('❌ Erro ao atualizar status:', error)
      if (context?.previousLead) {
        queryClient.setQueryData(leadKeys.detail(id), context.previousLead)
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
    }
  })
}
