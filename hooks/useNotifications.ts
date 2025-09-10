'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TaskService, type Notification } from '@/lib/supabase/task-service'

export interface NotificationHookReturn {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
    removeNotification: (id: string) => void
    clearAll: () => void
    loading: boolean
    error: string | null
}

export function useNotifications(userId: string): NotificationHookReturn {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastCheckRef = useRef<Date>(new Date())

    // Carregar notificações
    const loadNotifications = useCallback(async () => {
        try {
            setError(null)
            const { data, error } = await TaskService.getNotifications(userId, { limit: 50 })
            
            if (error) {
                setError('Erro ao carregar notificações')
                return
            }
            
            setNotifications(data || [])
        } catch (err) {
            setError('Erro ao carregar notificações')
            console.error('Error loading notifications:', err)
        } finally {
            setLoading(false)
        }
    }, [userId])

    // Verificar notificações pendentes (que devem ser exibidas agora)
    const checkPendingNotifications = useCallback(async () => {
        const now = new Date()
        
        try {
            const { data, error } = await TaskService.getNotifications(userId, { 
                is_read: false,
                limit: 100 
            })
            
            if (error || !data) return
            
            // Filtrar notificações que devem ser exibidas agora
            const pendingNotifications = data.filter(notification => {
                if (!notification.scheduled_for) return true // Imediatas
                
                const scheduledTime = new Date(notification.scheduled_for)
                const lastCheck = lastCheckRef.current
                
                // Notificação deve aparecer se o horário agendado passou desde a última verificação
                return scheduledTime <= now && scheduledTime > lastCheck && !notification.is_sent
            })
            
            // Atualizar notificações e exibir as novas
            if (pendingNotifications.length > 0) {
                // Mostrar notificações do navegador se permitido
                if ('Notification' in window && Notification.permission === 'granted') {
                    pendingNotifications.forEach(notification => {
                        const browserNotification = new Notification(notification.title, {
                            body: notification.message,
                            icon: '/favicon.ico',
                            tag: notification.id,
                            requireInteraction: notification.priority === 'urgent',
                            silent: notification.priority === 'low'
                        })
                        
                        browserNotification.onclick = () => {
                            window.focus()
                            markAsRead(notification.id)
                            browserNotification.close()
                        }
                        
                        // Auto fechar depois de um tempo
                        setTimeout(() => {
                            browserNotification.close()
                        }, notification.priority === 'urgent' ? 10000 : 5000)
                    })
                }
                
                // Recarregar notificações
                await loadNotifications()
            }
            
            lastCheckRef.current = now
        } catch (err) {
            console.error('Error checking pending notifications:', err)
        }
    }, [userId, loadNotifications])

    // Marcar como lida
    const markAsRead = useCallback(async (id: string) => {
        try {
            await TaskService.markNotificationAsRead(id)
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, read: true } : notif
                )
            )
        } catch (err) {
            console.error('Error marking notification as read:', err)
        }
    }, [])

    // Marcar todas como lidas
    const markAllAsRead = useCallback(async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.is_read)
            
            await Promise.all(
                unreadNotifications.map(notif => TaskService.markNotificationAsRead(notif.id))
            )
            
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, read: true }))
            )
        } catch (err) {
            console.error('Error marking all notifications as read:', err)
        }
    }, [notifications])

    // Adicionar nova notificação
    const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const { data, error } = await TaskService.createNotification(notification)
            
            if (error || !data) {
                throw new Error('Erro ao criar notificação')
            }
            
            setNotifications(prev => [data, ...prev])
            
            // Se é uma notificação imediata, exibir agora
            if (!notification.scheduled_for || new Date(notification.scheduled_for) <= new Date()) {
                if ('Notification' in window && Notification.permission === 'granted') {
                    const browserNotification = new Notification(notification.title, {
                        body: notification.message,
                        icon: '/favicon.ico',
                        tag: data.id
                    })
                    
                    setTimeout(() => browserNotification.close(), 5000)
                }
            }
        } catch (err) {
            console.error('Error adding notification:', err)
            setError('Erro ao criar notificação')
        }
    }, [])

    // Remover notificação
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, [])

    // Limpar todas
    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    // Solicitar permissão para notificações do navegador
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Notificações do navegador habilitadas')
                }
            })
        }
    }, [])

    // Carregar notificações iniciais
    useEffect(() => {
        if (userId) {
            loadNotifications()
        }
    }, [userId, loadNotifications])

    // Configurar verificação periódica de notificações
    useEffect(() => {
        if (userId) {
            // Verificar a cada 30 segundos
            intervalRef.current = setInterval(checkPendingNotifications, 30000)
            
            // Verificação inicial
            checkPendingNotifications()
            
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
            }
        }
    }, [userId, checkPendingNotifications])

    // Limpar interval ao desmontar
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification,
        clearAll,
        loading,
        error
    }
}

// Hook para estatísticas de notificações
export function useNotificationStats(userId: string) {
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        urgent: 0,
        today: 0
    })

    useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await TaskService.getNotifications(userId, { limit: 1000 })
                
                if (data) {
                    const now = new Date()
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    
                    setStats({
                        total: data.length,
                        unread: data.filter(n => !n.is_read).length,
                        urgent: data.filter(n => n.priority === 'urgent' && !n.is_read).length,
                        today: data.filter(n => new Date(n.created_at) >= startOfDay).length
                    })
                }
            } catch (err) {
                console.error('Error loading notification stats:', err)
            }
        }

        if (userId) {
            loadStats()
        }
    }, [userId])

    return stats
}
