'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import NotificationCenter from './NotificationCenter'

interface NotificationBellProps {
    className?: string
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [hasNewNotification, setHasNewNotification] = useState(false)

    useEffect(() => {
        // Simulate loading unread count
        loadUnreadCount()

        // Set up real-time updates (in a real app, this would be WebSocket or polling)
        const interval = setInterval(() => {
            // Simulate new notifications occasionally
            if (Math.random() > 0.95) {
                setUnreadCount(prev => prev + 1)
                setHasNewNotification(true)
                setTimeout(() => setHasNewNotification(false), 2000)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const loadUnreadCount = async () => {
        try {
            // Em produção: const response = await fetch('/api/notifications/unread-count')
            // Em produção: const count = await response.json()

            setUnreadCount(0) // Sem notificações até conectar com backend
        } catch (error) {
            console.error('Error loading unread count:', error)
        }
    }

    const handleMarkAllRead = () => {
        setUnreadCount(0)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
            >
                <motion.div
                    animate={hasNewNotification ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <Bell className="h-5 w-5 text-gray-600" />
                </motion.div>

                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}

                {hasNewNotification && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 bg-red-400 rounded-lg"
                        style={{ zIndex: -1 }}
                    />
                )}
            </button>

            <NotificationCenter
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onMarkAllRead={handleMarkAllRead}
            />
        </>
    )
}
