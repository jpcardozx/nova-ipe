/**
 * Modern Notifications Hook - React Query Version
 * 
 * Substitui hooks/useAgendaSystem.ts (useNotifications) por versão moderna:
 * - ❌ ANTES: 150+ linhas, estado manual, cache manual
 * - ✅ DEPOIS: 50 linhas, cache automático, optimistic updates
 * 
 * Features:
 * - ✅ Auto-fetch com cache inteligente
 * - ✅ Retry automático em caso de erro
 * - ✅ Background refetch (opcional)
 * - ✅ Optimistic updates (UI atualiza antes da API)
 * - ✅ Rollback automático em caso de erro
 * - ✅ Invalidation automática
 * - ✅ DevTools para debug
 * 
 * @example
 * ```tsx
 * function NotificationsList() {
 *   const { notifications, unreadCount, isLoading, markAsRead } = useNotifications(userId)
 *   
 *   if (isLoading) return <Skeleton />
 *   
 *   return notifications.map(n => (
 *     <div onClick={() => markAsRead(n.id)}>{n.title}</div>
 *   ))
 * }
 * ```
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationService, type Notification } from '@/lib/services/calendar-notifications'

/**
 * Query Key Factory
 * Centraliza as keys para evitar typos e facilitar invalidation
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: string) => [...notificationKeys.lists(), userId] as const,
  unread: (userId: string) => [...notificationKeys.all, 'unread', userId] as const,
}

/**
 * Hook principal de notificações com React Query
 * 
 * @param userId - ID do usuário para filtrar notificações
 * @param options - Opções de configuração
 * @returns Estado e métodos para gerenciar notificações
 */
export function useNotifications(userId: string, options?: {
  /** Habilita refetch automático em background (default: true) */
  enableAutoRefetch?: boolean
  /** Intervalo de refetch em ms (default: 30s) */
  refetchInterval?: number
  /** Limite de notificações (default: 50) */
  limit?: number
}) {
  const queryClient = useQueryClient()
  
  const {
    enableAutoRefetch = true,
    refetchInterval = 30000, // 30s
    limit = 50
  } = options || {}

  /**
   * QUERY: Buscar notificações
   * 
   * - queryKey: Identifica unicamente este query no cache
   * - queryFn: Função que busca os dados
   * - enabled: Só executa se userId válido
   * - staleTime: Herdado do QueryClient (5min)
   * - refetchInterval: Refetch automático a cada 30s
   */
  const notificationsQuery = useQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: async () => {
      const { data, error } = await NotificationService.getNotifications({
        user_id: userId,
        limit
      })
      
      if (error) {
        // Se tabela não existe, retorna array vazio (não é erro crítico)
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('⚠️ Tabela de notificações não existe ainda')
          return []
        }
        throw error
      }
      
      return data || []
    },
    enabled: !!userId,
    refetchInterval: enableAutoRefetch ? refetchInterval : false,
  })

  /**
   * QUERY: Contagem de não lidas
   * 
   * Derivado dos dados principais - mais eficiente que query separado
   */
  const unreadCount = notificationsQuery.data?.filter(n => !n.is_read).length || 0

  /**
   * MUTATION: Marcar como lida
   * 
   * Implementa optimistic update:
   * 1. Atualiza UI imediatamente (otimista)
   * 2. Chama API em background
   * 3. Se API falhar, faz rollback automático
   * 4. Se API suceder, revalida cache
   */
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await NotificationService.markAsRead(notificationId)
    },
    
    // Optimistic update - UI atualiza antes da API
    onMutate: async (notificationId) => {
      // Cancela queries em andamento para evitar race conditions
      await queryClient.cancelQueries({ queryKey: notificationKeys.list(userId) })
      
      // Snapshot do estado atual (para rollback)
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationKeys.list(userId)
      )
      
      // Atualiza cache otimisticamente
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId),
        (old) => old?.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        ) || []
      )
      
      // Retorna snapshot para onError usar
      return { previousNotifications }
    },
    
    // Rollback se API falhar
    onError: (error, notificationId, context) => {
      console.error('❌ Erro ao marcar como lida:', error)
      
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.list(userId),
          context.previousNotifications
        )
      }
    },
    
    // Revalida cache após sucesso
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
    }
  })

  /**
   * MUTATION: Marcar todas como lidas
   */
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await NotificationService.markAllAsRead(userId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list(userId) })
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationKeys.list(userId)
      )
      
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId),
        (old) => old?.map(n => ({ 
          ...n, 
          is_read: true, 
          read_at: new Date().toISOString() 
        })) || []
      )
      
      return { previousNotifications }
    },
    onError: (error, _, context) => {
      console.error('❌ Erro ao marcar todas como lidas:', error)
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.list(userId),
          context.previousNotifications
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
    }
  })

  /**
   * MUTATION: Deletar notificação
   */
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await NotificationService.deleteNotification(notificationId)
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list(userId) })
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationKeys.list(userId)
      )
      
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId),
        (old) => old?.filter(n => n.id !== notificationId) || []
      )
      
      return { previousNotifications }
    },
    onError: (error, _, context) => {
      console.error('❌ Erro ao deletar notificação:', error)
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.list(userId),
          context.previousNotifications
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
    }
  })

  /**
   * MUTATION: Criar notificação
   */
  const createNotificationMutation = useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'is_sent' | 'sent_at'>) => {
      const { data } = await NotificationService.createNotification(notification)
      return data
    },
    onSuccess: (newNotification) => {
      if (newNotification) {
        // Adiciona ao cache otimisticamente
        queryClient.setQueryData<Notification[]>(
          notificationKeys.list(userId),
          (old) => [newNotification, ...(old || [])]
        )
      }
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(userId) })
    }
  })

  return {
    // Data
    notifications: notificationsQuery.data || [],
    unreadCount,
    
    // Loading states
    isLoading: notificationsQuery.isLoading,
    isFetching: notificationsQuery.isFetching,
    
    // Error state
    error: notificationsQuery.error,
    
    // Methods
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    createNotification: createNotificationMutation.mutate,
    refresh: notificationsQuery.refetch,
    
    // Mutation states (para feedback de UI)
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
    isCreating: createNotificationMutation.isPending,
  }
}
