'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    X,
    Phone,
    MessageCircle,
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Star,
    Heart
} from 'lucide-react'

interface Notification {
    id: string
    type: 'lead' | 'appointment' | 'sale' | 'review' | 'reminder' | 'system'
    title: string
    message: string
    timestamp: Date
    read: boolean
    priority: 'high' | 'medium' | 'low'
    actionUrl?: string
    actionLabel?: string
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // Simular notificações em tempo real
        const mockNotifications: Notification[] = [
            {
                id: '1',
                type: 'lead',
                title: 'Novo Lead Quente!',
                message: 'Maria Silva demonstrou interesse na cobertura do Itaim Bibi',
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
                read: false,
                priority: 'high',
                actionLabel: 'Entrar em contato'
            },
            {
                id: '2',
                type: 'appointment',
                title: 'Visita em 30 minutos',
                message: 'João Carlos - Apartamento Vila Madalena às 16:00',
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
                read: false,
                priority: 'high',
                actionLabel: 'Ver detalhes'
            },
            {
                id: '3',
                type: 'review',
                title: 'Nova avaliação 5 estrelas!',
                message: 'Cliente Ana Paula deixou uma excelente avaliação',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
                read: false,
                priority: 'medium',
                actionLabel: 'Ver avaliação'
            },
            {
                id: '4',
                type: 'reminder',
                title: 'Follow-up pendente',
                message: 'Retornar ligação para Carlos Eduardo sobre proposta',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
                read: true,
                priority: 'medium',
                actionLabel: 'Marcar como feito'
            }
        ]

        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.read).length)

        // Simular novas notificações a cada 30 segundos (para demo)
        const interval = setInterval(() => {
            const newNotification: Notification = {
                id: Math.random().toString(),
                type: ['lead', 'appointment', 'review'][Math.floor(Math.random() * 3)] as any,
                title: 'Nova atividade!',
                message: 'Algo interessante aconteceu...',
                timestamp: new Date(),
                read: false,
                priority: 'medium'
            }

            setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep only 10
            setUnreadCount(prev => prev + 1)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    const removeNotification = (id: string) => {
        const notification = notifications.find(n => n.id === id)
        setNotifications(prev => prev.filter(n => n.id !== id))
        if (notification && !notification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'lead': return <Phone className="h-4 w-4 text-green-600" />
            case 'appointment': return <Calendar className="h-4 w-4 text-blue-600" />
            case 'sale': return <TrendingUp className="h-4 w-4 text-purple-600" />
            case 'review': return <Star className="h-4 w-4 text-yellow-600" />
            case 'reminder': return <Clock className="h-4 w-4 text-orange-600" />
            case 'system': return <AlertTriangle className="h-4 w-4 text-red-600" />
            default: return <Bell className="h-4 w-4 text-gray-600" />
        }
    }

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        if (diff < 60 * 1000) return 'Agora'
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}min`
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h`
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Notificações
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Marcar todas como lidas
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p>Nenhuma notificação</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {notifications.map((notification, index) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`p-3 rounded-lg mb-2 border transition-all hover:shadow-sm ${notification.read
                                                        ? 'bg-gray-50 border-gray-200'
                                                        : 'bg-blue-50 border-blue-200'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'
                                                                }`}>
                                                                {notification.title}
                                                            </h4>
                                                            {!notification.read && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            )}
                                                        </div>

                                                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'
                                                            }`}>
                                                            {notification.message}
                                                        </p>

                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-xs text-gray-400">
                                                                {formatTimestamp(notification.timestamp)}
                                                            </span>

                                                            <div className="flex items-center gap-1">
                                                                {notification.actionLabel && (
                                                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                                                        {notification.actionLabel}
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => removeNotification(notification.id)}
                                                                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-gray-200 text-center">
                                    <button className="text-sm text-gray-600 hover:text-gray-900">
                                        Ver todas as notificações
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// Toast Notifications Component
export function ToastNotifications() {
    const [toasts, setToasts] = useState<Array<{
        id: string
        type: 'success' | 'error' | 'warning' | 'info'
        title: string
        message?: string
    }>>([])

    const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
        const id = Math.random().toString()
        setToasts(prev => [...prev, { ...toast, id }])

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 5000)
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const getToastIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case 'info': return <Bell className="h-5 w-5 text-blue-600" />
            default: return <Bell className="h-5 w-5 text-gray-600" />
        }
    }

    const getToastColors = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800'
            case 'error': return 'bg-red-50 border-red-200 text-red-800'
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
            default: return 'bg-gray-50 border-gray-200 text-gray-800'
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        className={`p-4 rounded-lg border shadow-lg max-w-sm ${getToastColors(toast.type)}`}
                    >
                        <div className="flex items-start gap-3">
                            {getToastIcon(toast.type)}
                            <div className="flex-1">
                                <h4 className="font-medium">{toast.title}</h4>
                                {toast.message && (
                                    <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-current opacity-60 hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
