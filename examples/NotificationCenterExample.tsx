/**
 * Exemplo Completo: NotificationCenter com React Query
 * 
 * Demonstra como usar os novos hooks modernos em uma página real.
 * Compare com a versão antiga para ver a diferença.
 */

'use client'

import { useNotifications } from '@/hooks/queries/useNotifications'
import { useNotificationsRealtime } from '@/hooks/queries/useRealtimeSync'
import { Bell, Check, CheckCheck, Trash2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  /**
   * Hook principal - React Query
   * 
   * Antes (200 linhas):
   * - useState para data, loading, error
   * - useEffect para fetch
   * - useEffect para realtime
   * - Manual cache management
   * 
   * Depois (1 linha):
   * - Tudo automático!
   */
  const {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
  } = useNotifications(userId, {
    enableAutoRefetch: true,
    refetchInterval: 30000, // 30s
    limit: 50
  })

  /**
   * Realtime sync - 1 linha!
   * 
   * Antes:
   * - useEffect manual
   * - Subscribe/unsubscribe
   * - Update state manual
   * 
   * Depois:
   * - Just add this line
   * - React Query handles everything
   */
  useNotificationsRealtime(userId, {
    enabled: true,
    playSound: true,
    showBrowserNotification: true,
    onNewNotification: (notification) => {
      toast.success(`Nova notificação: ${notification.title}`)
    }
  })

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando notificações...</p>
        </div>
      </div>
    )
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive font-medium">Erro ao carregar notificações</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <button
          onClick={() => refresh()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  /**
   * Empty state
   */
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma notificação
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Você está em dia! Não há notificações pendentes no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Notificações</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={() => refresh()}
            disabled={isFetching}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Atualizar"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllAsRead()
                toast.success('Todas marcadas como lidas')
              }}
              disabled={isMarkingAllAsRead}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4 inline mr-1" />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`
                p-4 rounded-lg border transition-colors
                ${notification.is_read 
                  ? 'bg-background border-border' 
                  : 'bg-surface border-primary/20'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Status indicator */}
                <div className={`
                  h-2 w-2 rounded-full mt-2 shrink-0
                  ${notification.is_read ? 'bg-muted' : 'bg-primary'}
                `} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1">
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notification.is_read && (
                    <button
                      onClick={() => {
                        markAsRead(notification.id)
                        toast.success('Marcada como lida')
                      }}
                      disabled={isMarkingAsRead}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      deleteNotification(notification.id)
                      toast.success('Notificação removida')
                    }}
                    disabled={isDeleting}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-muted-foreground p-4">
        Atualização automática a cada 30 segundos • Realtime habilitado 📡
      </div>
    </div>
  )
}

/**
 * Exemplo de uso em uma página
 */
export default function NotificationsPage() {
  // Pegar userId do auth context ou props
  const userId = 'user-id-here'

  return (
    <div className="max-w-4xl mx-auto p-6">
      <NotificationCenter userId={userId} />
    </div>
  )
}
