/**
 * React Query Hooks para Jetimob API
 * Sistema moderno de cache e fetch de dados
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jetimobService, isJetimobConfigured, JetimobLead } from './jetimob-service'
import { logger } from '@/lib/logger'

// Query Keys - Centralizados para fácil invalidação
export const jetimobKeys = {
  all: ['jetimob'] as const,
  properties: () => [...jetimobKeys.all, 'properties'] as const,
  property: (id: string) => [...jetimobKeys.properties(), id] as const,
  leads: (filters?: any) => [...jetimobKeys.all, 'leads', filters] as const,
  portals: () => [...jetimobKeys.all, 'portals'] as const,
  performance: (dateFrom: string, dateTo: string) =>
    [...jetimobKeys.all, 'performance', { dateFrom, dateTo }] as const,
}

// ==================== PROPERTIES ====================

/**
 * Hook para buscar todos os imóveis
 */
export function useJetimobProperties() {
  return useQuery({
    queryKey: jetimobKeys.properties(),
    queryFn: async () => {
      logger.info('[Jetimob] Fetching properties', {
        component: 'useJetimobProperties',
        action: 'fetch_properties'
      })

      try {
        const properties = await jetimobService.getProperties()

        logger.info('[Jetimob] Properties fetched', {
          component: 'useJetimobProperties',
          action: 'fetch_properties_success',
          metadata: { count: properties.length }
        })

        return properties
      } catch (error) {
        logger.error('[Jetimob] Failed to fetch properties', {
          component: 'useJetimobProperties',
          action: 'fetch_properties_error',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
        })
        throw error
      }
    },
    enabled: isJetimobConfigured(), // Só executa se configurado
    retry: 2, // Tentar 2x antes de falhar
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

/**
 * Hook para buscar um imóvel específico
 */
export function useJetimobProperty(propertyId: string) {
  return useQuery({
    queryKey: jetimobKeys.property(propertyId),
    queryFn: async () => {
      logger.info('[Jetimob] Fetching property', {
        component: 'useJetimobProperty',
        action: 'fetch_property',
        metadata: { propertyId }
      })

      const property = await jetimobService.getProperty(propertyId)

      if (!property) {
        throw new Error(`Property ${propertyId} not found`)
      }

      return property
    },
    enabled: isJetimobConfigured() && !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Mutation para criar imóvel
 */
export function useCreateJetimobProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jetimobService.createProperty.bind(jetimobService),
    onSuccess: (newProperty) => {
      // Invalidar lista de imóveis
      queryClient.invalidateQueries({ queryKey: jetimobKeys.properties() })

      // Adicionar ao cache
      if (newProperty && typeof newProperty === 'object' && 'id' in newProperty) {
        queryClient.setQueryData(jetimobKeys.property(newProperty.id as string), newProperty)

        logger.info('[Jetimob] Property created', {
          component: 'useCreateJetimobProperty',
          action: 'create_property_success',
          metadata: { propertyId: newProperty.id }
        })
      }
    },
    onError: (error) => {
      logger.error('[Jetimob] Failed to create property', {
        component: 'useCreateJetimobProperty',
        action: 'create_property_error'
      }, error)
    },
  })
}

/**
 * Mutation para atualizar imóvel
 */
export function useUpdateJetimobProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyId, updates }: { propertyId: string; updates: any }) =>
      jetimobService.updateProperty(propertyId, updates),
    onSuccess: (updatedProperty, variables) => {
      // Atualizar cache do imóvel específico
      queryClient.setQueryData(
        jetimobKeys.property(variables.propertyId),
        updatedProperty
      )

      // Invalidar lista de imóveis
      queryClient.invalidateQueries({ queryKey: jetimobKeys.properties() })

      logger.info('[Jetimob] Property updated', {
        component: 'useUpdateJetimobProperty',
        action: 'update_property_success',
        metadata: { propertyId: variables.propertyId }
      })
    },
  })
}

/**
 * Mutation para deletar imóvel
 */
export function useDeleteJetimobProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId: string) => jetimobService.deleteProperty(propertyId),
    onSuccess: (_data, propertyId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: jetimobKeys.property(propertyId) })

      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: jetimobKeys.properties() })

      logger.info('[Jetimob] Property deleted', {
        component: 'useDeleteJetimobProperty',
        action: 'delete_property_success',
        metadata: { propertyId }
      })
    },
  })
}

// ==================== LEADS ====================

/**
 * Hook para buscar leads
 */
export function useJetimobLeads(filters?: {
  property_id?: string
  status?: string
  date_from?: string
  date_to?: string
}) {
  return useQuery({
    queryKey: jetimobKeys.leads(filters),
    queryFn: async () => {
      logger.info('[Jetimob] Fetching leads', {
        component: 'useJetimobLeads',
        action: 'fetch_leads',
        metadata: { filters }
      })

      const leads = await jetimobService.getLeads(filters)

      logger.info('[Jetimob] Leads fetched', {
        component: 'useJetimobLeads',
        action: 'fetch_leads_success',
        metadata: { count: leads.length }
      })

      return leads
    },
    enabled: isJetimobConfigured(),
    staleTime: 1 * 60 * 1000, // 1 minuto - leads mudam rápido
  })
}

/**
 * Mutation para atualizar status de lead
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: JetimobLead['status'] }) =>
      jetimobService.updateLeadStatus(leadId, status),
    onSuccess: () => {
      // Invalidar todas as queries de leads
      queryClient.invalidateQueries({ queryKey: jetimobKeys.leads() })

      logger.info('[Jetimob] Lead status updated', {
        component: 'useUpdateLeadStatus',
        action: 'update_lead_status_success'
      })
    },
  })
}

// ==================== PORTALS ====================

/**
 * Hook para buscar portais
 */
export function useJetimobPortals() {
  return useQuery({
    queryKey: jetimobKeys.portals(),
    queryFn: jetimobService.getPortals.bind(jetimobService),
    enabled: isJetimobConfigured(),
    staleTime: 10 * 60 * 1000, // 10 minutos - portais mudam pouco
  })
}

/**
 * Mutation para sincronizar imóvel com portais
 */
export function useSyncPropertyToPortals() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyId, portalIds }: { propertyId: string; portalIds: string[] }) =>
      jetimobService.syncPropertyToPortals(propertyId, portalIds),
    onSuccess: (_data, variables) => {
      // Invalidar propriedade específica
      queryClient.invalidateQueries({
        queryKey: jetimobKeys.property(variables.propertyId),
      })

      logger.info('[Jetimob] Property synced to portals', {
        component: 'useSyncPropertyToPortals',
        action: 'sync_property_success',
        metadata: {
          propertyId: variables.propertyId,
          portals: variables.portalIds
        }
      })
    },
  })
}

// ==================== ANÚNCIOS ====================

/**
 * Hook para buscar anúncios publicados
 */
export function useJetimobAnuncios(filters?: {
  imovel_codigo?: string
  portal_id?: string
  status?: 'ativo' | 'inativo' | 'pendente'
}) {
  return useQuery({
    queryKey: [...jetimobKeys.all, 'anuncios', filters] as const,
    queryFn: () => jetimobService.getAnuncios(filters),
    enabled: isJetimobConfigured(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// ==================== ESTATÍSTICAS ====================

/**
 * Hook para buscar estatísticas gerais
 */
export function useJetimobEstatisticas(periodo: 'hoje' | 'semana' | 'mes' | 'ano' = 'mes') {
  return useQuery({
    queryKey: [...jetimobKeys.all, 'estatisticas', periodo] as const,
    queryFn: () => jetimobService.getEstatisticas(periodo),
    enabled: isJetimobConfigured(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// ==================== FOTOS ====================

/**
 * Hook para buscar fotos de um imóvel
 */
export function useJetimobPropertyPhotos(propertyId: string) {
  return useQuery({
    queryKey: [...jetimobKeys.property(propertyId), 'photos'] as const,
    queryFn: () => jetimobService.getPropertyPhotos(propertyId),
    enabled: isJetimobConfigured() && !!propertyId,
    staleTime: 15 * 60 * 1000, // 15 minutos - fotos raramente mudam
  })
}

// ==================== CORRETORES ====================

/**
 * Hook para buscar corretores
 */
export function useJetimobCorretores() {
  return useQuery({
    queryKey: [...jetimobKeys.all, 'corretores'] as const,
    queryFn: () => jetimobService.getCorretores(),
    enabled: isJetimobConfigured(),
    staleTime: 30 * 60 * 1000, // 30 minutos - lista de corretores muda raramente
  })
}

/**
 * Hook para buscar corretor específico
 */
export function useJetimobCorretor(corretorId: string) {
  return useQuery({
    queryKey: [...jetimobKeys.all, 'corretor', corretorId] as const,
    queryFn: () => jetimobService.getCorretor(corretorId),
    enabled: isJetimobConfigured() && !!corretorId,
    staleTime: 30 * 60 * 1000,
  })
}

// ==================== LEAD DETALHADO ====================

/**
 * Hook para buscar lead com detalhes
 */
export function useJetimobLead(leadId: string) {
  return useQuery({
    queryKey: [...jetimobKeys.all, 'lead', leadId] as const,
    queryFn: () => jetimobService.getLead(leadId),
    enabled: isJetimobConfigured() && !!leadId,
    staleTime: 2 * 60 * 1000, // 2 minutos - leads podem mudar rápido
  })
}

// ==================== UTILITIES ====================

/**
 * Hook para invalidar todos os dados do Jetimob
 */
export function useInvalidateJetimob() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: jetimobKeys.all })
    logger.info('[Jetimob] All queries invalidated', {
      component: 'useInvalidateJetimob',
      action: 'invalidate_all'
    })
  }
}
