'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Bell,
    Check,
    X,
    Calendar,
    Users,
    DollarSign,
    Home,
    Star,
    Target,
    AlertTriangle,
    Info,
    CheckCircle,
    Clock,
    Trash2,
    Settings
} from 'lucide-react'

interface Notification {
    id: string
    type: 'appointment' | 'lead' | 'payment' | 'property' | 'review' | 'campaign' | 'system' | 'alert'
    title: string
    message: string
    is_read: boolean
    priority: 'low' | 'medium' | 'high' | 'urgent'
    action_url?: string
    action_text?: string
    created_at: string
    data?: any
}

interface NotificationCenterProps {
    isOpen: boolean
    onClose: () => void
    onMarkAllRead: () => void
}

export default function NotificationCenter({ isOpen, onClose, onMarkAllRead }: NotificationCenterProps) {
    const { user } = useCurrentUser()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

    useEffect(() => {
        if (isOpen) {
            loadNotifications()
        }
    }, [isOpen])

    const loadNotifications = async () => {
        setLoading(true)
        try {
            // Carregar notificações do backend
            await new Promise(resolve => setTimeout(resolve, 800))

            // Em produção: const response = await fetch('/api/notifications')
            // Em produção: const notifications = await response.json()

            // Array vazio até conectar com backend
            setNotifications([])
        } catch (error) {
            console.error('Erro ao carregar notificações:', error)
        } finally {
            setLoading(false)
        }
    }

const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
        appointment: Calendar,
        lead: Users,
        payment: DollarSign,
        property: Home,
        review: Star,
        campaign: Target,
        system: Settings,
        alert: AlertTriangle
    }
    return icons[type] || Bell
}

const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-50'
    if (priority === 'high') return 'text-orange-600 bg-orange-50'

    const colors = {
        appointment: 'text-blue-600 bg-blue-50',
        lead: 'text-purple-600 bg-purple-50',
        payment: 'text-green-600 bg-green-50',
        property: 'text-indigo-600 bg-indigo-50',
        review: 'text-yellow-600 bg-yellow-50',
        campaign: 'text-pink-600 bg-pink-50',
        system: 'text-gray-600 bg-gray-50',
        alert: 'text-red-600 bg-red-50'
    }

    return colors[type] || 'text-gray-600 bg-gray-50'
}

const getPriorityBadge = (priority: Notification['priority']) => {
    const styles = {
        low: 'bg-gray-100 text-gray-600',
        medium: 'bg-blue-100 text-blue-600',
        high: 'bg-orange-100 text-orange-600',
        urgent: 'bg-red-100 text-red-600'
    }

    const labels = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
        urgent: 'Urgente'
    }

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[priority]}`}>
            {labels[priority]}
        </span>
    )
}

const markAsRead = async (notificationId: string) => {
    setNotifications(notifications.map(notification =>
        notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
    ))
}

const markAsUnread = async (notificationId: string) => {
    setNotifications(notifications.map(notification =>
        notification.id === notificationId
            ? { ...notification, is_read: false }
            : notification
    ))
}

const deleteNotification = async (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
}

const markAllAsRead = async () => {
    setNotifications(notifications.map(notification => ({ ...notification, is_read: true })))
    onMarkAllRead()
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Agora mesmo'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`

    return date.toLocaleDateString('pt-BR')
}

const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'read') return notification.is_read
    return true
})

const unreadCount = notifications.filter(n => !n.is_read).length

return (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                />

                {/* Notification Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 400 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notificações
                                {unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex border-b border-gray-200">
                        {[
                            { key: 'all', label: 'Todas' },
                            { key: 'unread', label: 'Não lidas' },
                            { key: 'read', label: 'Lidas' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key as any)}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${filter === tab.key
                                    ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                                {tab.key === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    {unreadCount > 0 && (
                        <div className="p-4 border-b border-gray-200">
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Marcar todas como lidas
                            </button>
                        </div>
                    )}

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center px-6">
                                <Bell className="h-12 w-12 text-gray-300 mb-2" />
                                <p className="text-gray-500">
                                    {filter === 'unread' ? 'Nenhuma notificação não lida' :
                                        filter === 'read' ? 'Nenhuma notificação lida' :
                                            'Nenhuma notificação'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredNotifications.map((notification) => {
                                    const Icon = getNotificationIcon(notification.type)
                                    const colorClasses = getNotificationColor(notification.type, notification.priority)

                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${colorClasses}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                                            }`}>
                                                            {notification.title}
                                                        </h4>
                                                        <div className="flex items-center gap-1">
                                                            {getPriorityBadge(notification.priority)}
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {notification.message}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {formatTimeAgo(notification.created_at)}
                                                        </span>

                                                        <div className="flex items-center gap-1">
                                                            {notification.action_url && (
                                                                <button
                                                                    onClick={() => {
                                                                        markAsRead(notification.id)
                                                                        window.location.href = notification.action_url!
                                                                    }}
                                                                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                                                                >
                                                                    {notification.action_text}
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    notification.is_read
                                                                        ? markAsUnread(notification.id)
                                                                        : markAsRead(notification.id)
                                                                }
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                            >
                                                                {notification.is_read ? (
                                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                                ) : (
                                                                    <Check className="h-3 w-3 text-gray-400" />
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={() => deleteNotification(notification.id)}
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
)
}
