/**
 * React Hooks para Calendar & Notifications
 * Com suporte a realtime updates
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CalendarService, NotificationService, type CalendarEvent, type Notification } from '@/lib/services/calendar-notifications'
import { RealtimeChannel } from '@supabase/supabase-js'

// =====================================================
// CALENDAR HOOKS
// =====================================================

export interface UseCalendarOptions {
  userId: string
  startDate?: string
  endDate?: string
  eventType?: string
  status?: string
  enableRealtime?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export interface UseCalendarReturn {
  events: CalendarEvent[]
  loading: boolean
  error: any
  refresh: () => Promise<void>
  createEvent: (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<CalendarEvent | null>
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | null>
  deleteEvent: (id: string) => Promise<boolean>
  cancelEvent: (id: string, reason?: string) => Promise<CalendarEvent | null>
  todayEvents: CalendarEvent[]
  upcomingEvents: CalendarEvent[]
  stats: {
    total: number
    today: number
    upcoming: number
    completed: number
    cancelled: number
  }
}

export function useCalendar(options: UseCalendarOptions): UseCalendarReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await CalendarService.getEvents({
        user_id: options.userId,
        start_date: options.startDate,
        end_date: options.endDate,
        event_type: options.eventType,
        status: options.status
      })

      if (err) throw err
      setEvents(data || [])
    } catch (err) {
      console.error('❌ Error loading events:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [options.userId, options.startDate, options.endDate, options.eventType, options.status])

  // Initial load
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Realtime subscription
  useEffect(() => {
    if (!options.enableRealtime) return

    console.log('📡 Setting up realtime subscription for events')
    channelRef.current = CalendarService.subscribeToEvents(options.userId, (event) => {
      console.log('📅 Realtime event update:', event)
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === event.id)
        if (index >= 0) {
          // Update existing
          const updated = [...prev]
          updated[index] = event
          return updated
        } else {
          // Add new
          return [...prev, event]
        }
      })
    })

    return () => {
      if (channelRef.current) {
        console.log('🔌 Unsubscribing from events channel')
        channelRef.current.unsubscribe()
      }
    }
  }, [options.enableRealtime, options.userId])

  // Auto refresh
  useEffect(() => {
    if (!options.autoRefresh) return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing events')
      loadEvents()
    }, options.refreshInterval || 60000) // Default 1 minuto

    return () => clearInterval(interval)
  }, [options.autoRefresh, options.refreshInterval, loadEvents])

  // Methods
  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error: err } = await CalendarService.createEvent(event)
    if (err) {
      console.error('❌ Error creating event:', err)
      return null
    }
    if (data) {
      setEvents((prev) => [...prev, data])
    }
    return data
  }, [])

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    const { data, error: err } = await CalendarService.updateEvent(id, updates)
    if (err) {
      console.error('❌ Error updating event:', err)
      return null
    }
    if (data) {
      setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))
    }
    return data
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    const { error: err } = await CalendarService.deleteEvent(id)
    if (err) {
      console.error('❌ Error deleting event:', err)
      return false
    }
    setEvents((prev) => prev.filter((e) => e.id !== id))
    return true
  }, [])

  const cancelEvent = useCallback(async (id: string, reason?: string) => {
    const { data, error: err } = await CalendarService.cancelEvent(id, reason)
    if (err) {
      console.error('❌ Error cancelling event:', err)
      return null
    }
    if (data) {
      setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))
    }
    return data
  }, [])

  // Computed values
  const todayEvents = events.filter((e) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const eventDate = new Date(e.start_datetime)
    return eventDate >= today && eventDate < tomorrow && e.status === 'scheduled'
  })

  const upcomingEvents = events.filter((e) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(now.getHours() + 24)
    const eventDate = new Date(e.start_datetime)
    return eventDate >= now && eventDate <= tomorrow && e.status === 'scheduled'
  })

  const stats = {
    total: events.length,
    today: todayEvents.length,
    upcoming: upcomingEvents.length,
    completed: events.filter((e) => e.status === 'completed').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length
  }

  return {
    events,
    loading,
    error,
    refresh: loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
    todayEvents,
    upcomingEvents,
    stats
  }
}

// =====================================================
// NOTIFICATION HOOKS
// =====================================================

export interface UseNotificationsOptions {
  userId: string
  enableRealtime?: boolean
  autoMarkAsRead?: boolean
  playSound?: boolean
  showBrowserNotification?: boolean
}

export interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: any
  refresh: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  createNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_sent' | 'sent_at'>) => Promise<void>
}

export function useNotifications(options: UseNotificationsOptions): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize notification sound
  useEffect(() => {
    if (options.playSound && typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3')
    }
  }, [options.playSound])

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await NotificationService.getNotifications({
        user_id: options.userId,
        limit: 50
      })

      if (err) throw err
      setNotifications(data || [])

      // Load unread count
      const { data: count } = await NotificationService.getUnreadCount(options.userId)
      setUnreadCount(count)
    } catch (err) {
      console.error('❌ Error loading notifications:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [options.userId])

  // Initial load
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Realtime subscription
  useEffect(() => {
    if (!options.enableRealtime) return

    console.log('📡 Setting up realtime subscription for notifications')
    channelRef.current = NotificationService.subscribeToNotifications(options.userId, (notification) => {
      console.log('🔔 New notification received:', notification)
      
      // Add to list
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Play sound
      if (options.playSound && audioRef.current) {
        audioRef.current.play().catch((e) => console.warn('Could not play sound:', e))
      }

      // Show browser notification
      if (options.showBrowserNotification && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message || '',
          icon: '/logo.png',
          tag: notification.id,
          badge: '/logo.png'
        })
      }
    })

    return () => {
      if (channelRef.current) {
        console.log('🔌 Unsubscribing from notifications channel')
        channelRef.current.unsubscribe()
      }
    }
  }, [options.enableRealtime, options.userId, options.playSound, options.showBrowserNotification])

  // Request browser notification permission
  useEffect(() => {
    if (options.showBrowserNotification && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('📬 Notification permission:', permission)
      })
    }
  }, [options.showBrowserNotification])

  // Methods
  const markAsRead = useCallback(async (id: string) => {
    await NotificationService.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await NotificationService.markAllAsRead(options.userId)
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    )
    setUnreadCount(0)
  }, [options.userId])

  const deleteNotification = useCallback(async (id: string) => {
    await NotificationService.deleteNotification(id)
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id)
      if (notification && !notification.is_read) {
        setUnreadCount((count) => Math.max(0, count - 1))
      }
      return prev.filter((n) => n.id !== id)
    })
  }, [])

  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'is_sent' | 'sent_at'>) => {
    const { data } = await NotificationService.createNotification(notification)
    if (data) {
      setNotifications((prev) => [data, ...prev])
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  }
}

// =====================================================
// COMBINED HOOK
// =====================================================

export interface UseAgendaSystemOptions {
  userId: string
  enableRealtime?: boolean
  autoRefresh?: boolean
  playSound?: boolean
  showBrowserNotification?: boolean
}

export function useAgendaSystem(options: UseAgendaSystemOptions) {
  const calendar = useCalendar({
    userId: options.userId,
    enableRealtime: options.enableRealtime,
    autoRefresh: options.autoRefresh
  })

  const notifications = useNotifications({
    userId: options.userId,
    enableRealtime: options.enableRealtime,
    playSound: options.playSound,
    showBrowserNotification: options.showBrowserNotification
  })

  return {
    calendar,
    notifications,
    loading: calendar.loading || notifications.loading,
    error: calendar.error || notifications.error
  }
}
