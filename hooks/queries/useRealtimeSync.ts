/**
 * Realtime Integration for React Query
 * 
 * Integra Supabase Realtime com React Query de forma elegante.
 * Quando um evento chega via websocket, invalida o cache do React Query
 * que automaticamente refetch os dados.
 * 
 * Benefits:
 * - ✅ Single source of truth (React Query cache)
 * - ✅ Automatic deduplication (não refetch se já está fetchando)
 * - ✅ Optimistic updates mantidos consistentes
 * - ✅ DevTools mostram tudo
 * 
 * @example
 * ```tsx
 * function NotificationsList() {
 *   const { notifications, isLoading } = useNotifications(userId)
 *   useNotificationsRealtime(userId) // Just add this line!
 *   
 *   // Tudo funciona automaticamente
 * }
 * ```
 */

'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { NotificationService } from '@/lib/services/calendar-notifications'
import { notificationKeys } from './useNotifications'

/**
 * Hook para sincronização realtime de notificações
 * 
 * Escuta eventos do Supabase Realtime e invalida cache do React Query.
 * React Query automaticamente refetch os dados quando invalidado.
 * 
 * @param userId - ID do usuário para filtrar eventos
 * @param options - Opções de configuração
 */
export function useNotificationsRealtime(
  userId: string,
  options?: {
    /** Habilita realtime (default: true) */
    enabled?: boolean
    /** Callback quando nova notificação chega */
    onNewNotification?: (notification: any) => void
    /** Toca som ao receber notificação (default: false) */
    playSound?: boolean
    /** Mostra notificação do browser (default: false) */
    showBrowserNotification?: boolean
  }
) {
  const queryClient = useQueryClient()
  
  const {
    enabled = true,
    onNewNotification,
    playSound = false,
    showBrowserNotification = false
  } = options || {}

  useEffect(() => {
    if (!enabled || !userId) return

    console.log('📡 [Realtime] Conectando ao canal de notificações...')
    
    /**
     * Subscribe ao canal do Supabase
     * 
     * Escuta todos os eventos (INSERT, UPDATE, DELETE) na tabela notifications
     * filtrados por user_id
     */
    const channel = NotificationService.subscribeToNotifications(
      userId,
      (notification) => {
        console.log('🔔 [Realtime] Nova notificação recebida:', notification.id)
        
        /**
         * Invalidação Inteligente
         * 
         * Em vez de atualizar o estado manualmente, apenas invalida o cache.
         * React Query detecta a invalidação e automaticamente:
         * 1. Refetch os dados em background
         * 2. Atualiza todos os componentes usando esse query
         * 3. Mantém UI consistente com cache
         * 4. Deduplica requests se múltiplos componentes usam o mesmo query
         */
        queryClient.invalidateQueries({ 
          queryKey: notificationKeys.list(userId) 
        })
        
        // Callback opcional
        if (onNewNotification) {
          onNewNotification(notification)
        }
        
        // Som opcional
        if (playSound) {
          playNotificationSound()
        }
        
        // Browser notification opcional
        if (showBrowserNotification) {
          showNativeNotification(notification)
        }
      }
    )

    return () => {
      console.log('🔌 [Realtime] Desconectando do canal de notificações')
      channel.unsubscribe()
    }
  }, [enabled, userId, queryClient, onNewNotification, playSound, showBrowserNotification])
}

/**
 * Helper: Toca som de notificação
 */
function playNotificationSound() {
  if (typeof window === 'undefined') return
  
  const audio = new Audio('/sounds/notification.mp3')
  audio.play().catch((error) => {
    console.warn('⚠️ Não foi possível tocar o som:', error)
  })
}

/**
 * Helper: Mostra notificação nativa do browser
 */
async function showNativeNotification(notification: any) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  
  // Request permission se necessário
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message || '',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: notification.id,
    })
  }
}

/**
 * Hook para eventos de calendário (similar pattern)
 */
export function useCalendarEventsRealtime(
  userId: string,
  options?: {
    enabled?: boolean
    onEventUpdate?: (event: any) => void
  }
) {
  const queryClient = useQueryClient()
  const { enabled = true, onEventUpdate } = options || {}

  useEffect(() => {
    if (!enabled || !userId) return

    console.log('📡 [Realtime] Conectando ao canal de eventos...')
    
    // Import dinâmico para evitar circular dependency
    import('@/lib/services/calendar-notifications').then(({ CalendarService }) => {
      const channel = CalendarService.subscribeToEvents(userId, (event) => {
        console.log('📅 [Realtime] Evento atualizado:', event.id)
        
        // Invalida cache de eventos
        queryClient.invalidateQueries({ 
          queryKey: ['calendar-events', userId] 
        })
        
        if (onEventUpdate) {
          onEventUpdate(event)
        }
      })

      return () => {
        console.log('🔌 [Realtime] Desconectando do canal de eventos')
        channel.unsubscribe()
      }
    })
  }, [enabled, userId, queryClient, onEventUpdate])
}
