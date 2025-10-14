/**
 * Sistema de notificações em tempo real conectado ao Supabase
 * Substitui completamente o sistema com mocks
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client-singleton'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { Bell, CheckCircle2, AlertCircle, Info, XCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isYesterday, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

export interface RealTimeNotification {
  id: string
  user_id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  action_url?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

interface RealTimeNotificationsProps {
  onUnreadCountChange?: (count: number) => void
}

export default function RealTimeNotifications({
  onUnreadCountChange
}: RealTimeNotificationsProps) {
  const { user } = useCurrentUser()
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()

  // Carregar notificações do banco
  const loadNotifications = useCallback(async () => {
    // ✅ PROTEÇÃO: Não fazer query sem user_id válido
    if (!user?.id) {
      console.warn('⚠️ loadNotifications: user.id não disponível')
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      console.log('📡 Carregando notificações para user:', user.id)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('❌ Error in getNotifications:', error)
        throw error
      }

      setNotifications(data || [])

      const unread = (data as any[] || []).filter(n => !n.read).length
      setUnreadCount(unread)
      onUnreadCountChange?.(unread)
      
    } catch (err) {
      console.error('Erro ao carregar notificações:', err)
      setError('Erro ao carregar notificações')
      toast.error('Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [user?.id, supabase, onUnreadCountChange])

  // Configurar realtime
  useEffect(() => {
    if (!user?.id) return

    loadNotifications()

    // Subscription para mudanças em tempo real
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Notification change:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as RealTimeNotification
            setNotifications(prev => [newNotification, ...prev])
            setUnreadCount(prev => prev + 1)
            onUnreadCountChange?.(unreadCount + 1)
            
            // Toast para nova notificação
            toast.success(newNotification.title, {
              description: newNotification.message,
              action: newNotification.action_url ? {
                label: 'Ver',
                onClick: () => window.location.href = newNotification.action_url!
              } : undefined
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as RealTimeNotification
            setNotifications(prev => prev.map(n => 
              n.id === updatedNotification.id ? updatedNotification : n
            ))
            
            // Atualizar contador se mudou o status de lido
            loadNotifications()
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id
            setNotifications(prev => prev.filter(n => n.id !== deletedId))
            loadNotifications()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, supabase, loadNotifications, unreadCount, onUnreadCountChange])

  // Marcar como lida
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        // @ts-expect-error - Supabase schema type not available
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      if (error) throw error

      // Atualizar estado local
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      onUnreadCountChange?.(Math.max(0, unreadCount - 1))
      
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
      toast.error('Erro ao marcar notificação como lida')
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        // @ts-expect-error - Supabase schema type not available
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
      onUnreadCountChange?.(0)
      
      toast.success('Todas as notificações foram marcadas como lidas')
      
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
      toast.error('Erro ao marcar todas as notificações como lidas')
    }
  }

  // Deletar notificação
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      if (error) throw error

      const notification = notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
        onUnreadCountChange?.(Math.max(0, unreadCount - 1))
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success('Notificação removida')
      
    } catch (err) {
      console.error('Erro ao deletar notificação:', err)
      toast.error('Erro ao remover notificação')
    }
  }

  // Ação da notificação
  const handleNotificationAction = (notification: RealTimeNotification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100'
      case 'warning':
        return 'bg-yellow-50 border-yellow-100'
      case 'error':
        return 'bg-red-50 border-red-100'
      default:
        return 'bg-blue-50 border-blue-100'
    }
  }

  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt)
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ptBR })
    } else if (isYesterday(date)) {
      return 'Ontem'
    } else {
      const daysDiff = differenceInDays(new Date(), date)
      if (daysDiff < 7) {
        return `${daysDiff}d atrás`
      } else {
        return format(date, 'dd/MM', { locale: ptBR })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <XCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
        <button 
          onClick={loadNotifications}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Nenhuma notificação</p>
            <p className="text-sm">Você está em dia!</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`group relative border-l-4 ${
                  notification.read 
                    ? 'bg-white border-l-gray-200' 
                    : getNotificationBg(notification.type)
                } border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors`}
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleNotificationAction(notification)}
                      >
                        <p className={`text-sm font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </p>
                        
                        <p className={`text-xs mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                          
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover notificação"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => window.location.href = '/dashboard/notifications'}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  )
}

// Hook para usar as notificações em outros componentes
export function useRealTimeNotifications() {
  const { user } = useCurrentUser()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([])
  const supabase = getSupabaseClient()

  useEffect(() => {
    // ✅ PROTEÇÃO: Não fazer query sem user_id válido
    if (!user?.id) {
      console.warn('⚠️ useRealTimeNotifications: user.id não disponível')
      return
    }

    // Carregar contador inicial
    const loadUnreadCount = async () => {
      console.log('📡 Carregando contador de notificações para user:', user.id)

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) {
        console.error('❌ Error loading unread count:', error)
        return
      }

      setUnreadCount(count || 0)
    }

    loadUnreadCount()

    // Subscription em tempo real
    const channel = supabase
      .channel(`notifications-count:${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          loadUnreadCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, supabase])

  return { unreadCount, notifications }
}