/**
 * Sistema de Notificações usando Sonner
 * Toast notifications modernas e elegantes
 */

'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/hooks/useAgendaSystem'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { toast, Toaster } from 'sonner'
import { Bell, Check, X, Info, AlertTriangle, AlertCircle } from 'lucide-react'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser()

  const {
    notifications,
    unreadCount,
    markAsRead
  } = useNotifications({
    userId: user?.id || '',
    enableRealtime: true,
    playSound: true,
    showBrowserNotification: true
  })

  // Listen for realtime notifications and show toast
  useEffect(() => {
    if (!user) return

    // Mostrar toast para novas notificações não lidas
    const latestUnread = notifications.find(n => !n.is_read && !n.is_sent)
    if (latestUnread) {
      showNotificationToast(latestUnread, () => markAsRead(latestUnread.id))
    }
  }, [notifications, user, markAsRead])

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={5000}
        toastOptions={{
          style: {
            padding: '16px',
          },
        }}
      />
      {children}
    </>
  )
}

// Helper: Show toast with custom styling based on type
function showNotificationToast(notification: any, onMarkAsRead: () => void) {
  const icon = notification.icon || getIconForType(notification.type)
  
  const toastConfig = {
    description: notification.message,
    action: notification.action_url ? {
      label: notification.action_label || 'Ver',
      onClick: () => {
        onMarkAsRead()
        window.location.href = notification.action_url
      }
    } : undefined,
    onDismiss: onMarkAsRead,
    duration: notification.priority === 'urgent' ? 10000 : 5000,
  }

  switch (notification.type) {
    case 'success':
      toast.success(`${icon} ${notification.title}`, toastConfig)
      break
    case 'error':
      toast.error(`${icon} ${notification.title}`, toastConfig)
      break
    case 'warning':
    case 'alert':
      toast.warning(`${icon} ${notification.title}`, toastConfig)
      break
    case 'reminder':
      toast.info(`${icon} ${notification.title}`, {
        ...toastConfig,
        duration: 10000 // Lembretes duram mais
      })
      break
    default:
      toast(`${icon} ${notification.title}`, toastConfig)
  }

  // Play sound for urgent notifications
  if (notification.priority === 'urgent' && typeof window !== 'undefined') {
    const audio = new Audio('/sounds/urgent.mp3')
    audio.play().catch(() => {})
  }
}

function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    reminder: '⏰',
    alert: '🚨',
    task: '📝',
    event: '📅'
  }
  return icons[type] || '🔔'
}

// Export toast utility functions
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description })
  },
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  },
  custom: (message: string, options?: any) => {
    toast(message, options)
  }
}
