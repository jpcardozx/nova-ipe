/**
 * Calendar & Notifications Service
 * Sistema completo de agenda com notificações em tempo real
 */

import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// =====================================================
// TYPES
// =====================================================

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  location?: string
  start_datetime: string
  end_datetime: string
  all_day: boolean
  timezone: string
  event_type: 'meeting' | 'viewing' | 'call' | 'task' | 'reminder' | 'appointment' | 'personal' | 'deadline'
  category?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled'
  user_id: string
  created_by: string
  assigned_to?: string[]
  client_id?: string
  property_id?: string
  task_id?: string
  is_recurring: boolean
  recurrence_rule?: RecurrenceRule
  parent_event_id?: string
  reminders?: number[]
  notification_sent: boolean
  metadata?: Record<string, any>
  attachments?: Attachment[]
  tags?: string[]
  online_meeting?: OnlineMeeting
  created_at: string
  updated_at: string
}

export interface RecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  count?: number
  until?: string
  byweekday?: number[]
  bymonthday?: number[]
}

export interface Attachment {
  name: string
  url: string
  type: string
  size: number
}

export interface OnlineMeeting {
  platform: 'zoom' | 'meet' | 'teams' | 'other'
  url: string
  meeting_id?: string
  password?: string
}

export interface Notification {
  id: string
  title: string
  message?: string
  icon?: string
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'alert' | 'task' | 'event'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  user_id: string
  event_id?: string
  task_id?: string
  client_id?: string
  property_id?: string
  scheduled_for: string
  sent_at?: string
  is_sent: boolean
  read_at?: string
  is_read: boolean
  action_url?: string
  action_label?: string
  channels?: NotificationChannels
  delivery_status?: Record<string, any>
  metadata?: Record<string, any>
  created_at: string
  expires_at?: string
}

export interface NotificationChannels {
  app: boolean
  email: boolean
  sms: boolean
  push: boolean
}

export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  status: 'pending' | 'accepted' | 'declined' | 'tentative'
  role: 'organizer' | 'attendee' | 'required' | 'optional'
  response_at?: string
  notes?: string
  notification_preferences?: NotificationChannels
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  enabled: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
  timezone: string
  email_enabled: boolean
  email_digest: boolean
  email_digest_time: string
  push_enabled: boolean
  sms_enabled: boolean
  events_enabled: boolean
  tasks_enabled: boolean
  clients_enabled: boolean
  marketing_enabled: boolean
  system_enabled: boolean
  default_event_reminders: number[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// =====================================================
// CALENDAR SERVICE
// =====================================================

export class CalendarService {
  // ==================== EVENTS ====================

  /**
   * Buscar eventos com filtros avançados
   */
  static async getEvents(filters?: {
    start_date?: string
    end_date?: string
    event_type?: string
    status?: string
    user_id?: string
    client_id?: string
    assigned_to?: string
    tags?: string[]
    search?: string
  }): Promise<{ data: CalendarEvent[] | null; error: any }> {
    try {
      let query = supabase.from('calendar_events').select('*')

      if (filters?.start_date) {
        query = query.gte('start_datetime', filters.start_date)
      }
      if (filters?.end_date) {
        query = query.lte('end_datetime', filters.end_date)
      }
      if (filters?.event_type) {
        query = query.eq('event_type', filters.event_type)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id)
      }
      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id)
      }
      if (filters?.assigned_to) {
        query = query.contains('assigned_to', [filters.assigned_to])
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('start_datetime', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in getEvents:', error)
      return { data: null, error }
    }
  }

  /**
   * Buscar evento por ID
   */
  static async getEventById(id: string): Promise<{ data: CalendarEvent | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in getEventById:', error)
      return { data: null, error }
    }
  }

  /**
   * Criar novo evento
   */
  static async createEvent(
    event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: CalendarEvent | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single()

      if (error) throw error

      // Trigger webhook
      if (data) {
        await this.triggerWebhook('event.created', data)
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in createEvent:', error)
      return { data: null, error }
    }
  }

  /**
   * Atualizar evento
   */
  static async updateEvent(
    id: string,
    updates: Partial<CalendarEvent>
  ): Promise<{ data: CalendarEvent | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Trigger webhook
      if (data) {
        await this.triggerWebhook('event.updated', data)
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in updateEvent:', error)
      return { data: null, error }
    }
  }

  /**
   * Deletar evento
   */
  static async deleteEvent(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from('calendar_events').delete().eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('❌ Error in deleteEvent:', error)
      return { error }
    }
  }

  /**
   * Cancelar evento
   */
  static async cancelEvent(id: string, reason?: string): Promise<{ data: CalendarEvent | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update({
          status: 'cancelled',
          metadata: { cancellation_reason: reason, cancelled_at: new Date().toISOString() }
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Trigger webhook
      if (data) {
        await this.triggerWebhook('event.cancelled', data)
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in cancelEvent:', error)
      return { data: null, error }
    }
  }

  /**
   * Buscar eventos do dia
   */
  static async getTodayEvents(userId: string): Promise<{ data: CalendarEvent[] | null; error: any }> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.getEvents({
      user_id: userId,
      start_date: today.toISOString(),
      end_date: tomorrow.toISOString(),
      status: 'scheduled'
    })
  }

  /**
   * Buscar próximos eventos (24h)
   */
  static async getUpcomingEvents(userId: string): Promise<{ data: CalendarEvent[] | null; error: any }> {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(now.getHours() + 24)

    return this.getEvents({
      user_id: userId,
      start_date: now.toISOString(),
      end_date: tomorrow.toISOString(),
      status: 'scheduled'
    })
  }

  // ==================== PARTICIPANTS ====================

  /**
   * Adicionar participante a evento
   */
  static async addParticipant(
    participant: Omit<EventParticipant, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: EventParticipant | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert([participant])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in addParticipant:', error)
      return { data: null, error }
    }
  }

  /**
   * Atualizar status do participante (RSVP)
   */
  static async updateParticipantStatus(
    event_id: string,
    user_id: string,
    status: 'accepted' | 'declined' | 'tentative',
    notes?: string
  ): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('event_participants')
        .update({
          status,
          response_at: new Date().toISOString(),
          notes
        })
        .eq('event_id', event_id)
        .eq('user_id', user_id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('❌ Error in updateParticipantStatus:', error)
      return { error }
    }
  }

  // ==================== WEBHOOKS ====================

  /**
   * Trigger webhook para edge function
   */
  private static async triggerWebhook(type: string, eventData: any): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('event-webhook', {
        body: {
          type,
          event_id: eventData.id,
          event_data: eventData,
          user_id: eventData.user_id,
          timestamp: new Date().toISOString()
        }
      })

      if (error) {
        console.error('❌ Webhook error:', error)
      } else {
        console.log('✅ Webhook triggered:', type)
      }
    } catch (error) {
      console.error('❌ Webhook failed:', error)
    }
  }

  // ==================== REALTIME ====================

  /**
   * Subscribe to realtime event changes
   */
  static subscribeToEvents(
    userId: string,
    callback: (event: CalendarEvent) => void
  ): RealtimeChannel {
    return supabase
      .channel('calendar-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📅 Event change:', payload)
          callback(payload.new as CalendarEvent)
        }
      )
      .subscribe()
  }
}

// =====================================================
// NOTIFICATION SERVICE
// =====================================================

export class NotificationService {
  /**
   * Buscar notificações do usuário
   */
  static async getNotifications(filters?: {
    user_id: string
    is_read?: boolean
    type?: string
    category?: string
    limit?: number
  }): Promise<{ data: Notification[] | null; error: any }> {
    try {
      let query = supabase.from('notifications').select('*').eq('user_id', filters?.user_id || '')

      if (filters?.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      // ✅ Log silencioso - não bloquear UI por falta de tabela
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'

      // Se a tabela não existe, apenas avisar (não é crítico)
      if (errorMsg.includes('relation') || errorMsg.includes('does not exist')) {
        console.warn('⚠️ Tabela de notificações não existe ainda (não crítico)')
        return { data: [], error: null }
      }

      console.warn('⚠️ Aviso ao carregar notificações:', errorMsg)
      return { data: null, error }
    }
  }

  /**
   * Criar nova notificação
   */
  static async createNotification(
    notification: Omit<Notification, 'id' | 'created_at' | 'is_sent' | 'sent_at'>
  ): Promise<{ data: Notification | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in createNotification:', error)
      return { data: null, error }
    }
  }

  /**
   * Marcar como lida
   */
  static async markAsRead(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('❌ Error in markAsRead:', error)
      return { error }
    }
  }

  /**
   * Marcar todas como lidas
   */
  static async markAllAsRead(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error)
      return { error }
    }
  }

  /**
   * Deletar notificação
   */
  static async deleteNotification(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('❌ Error in deleteNotification:', error)
      return { error }
    }
  }

  /**
   * Buscar notificações não lidas
   */
  static async getUnreadCount(userId: string): Promise<{ data: number; error: any }> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return { data: count || 0, error: null }
    } catch (error) {
      console.error('❌ Error in getUnreadCount:', error)
      return { data: 0, error }
    }
  }

  /**
   * Subscribe to realtime notifications
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): RealtimeChannel {
    return supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🔔 New notification:', payload)
          callback(payload.new as Notification)
        }
      )
      .subscribe()
  }

  /**
   * Buscar preferências de notificação
   */
  static async getPreferences(userId: string): Promise<{ data: NotificationPreferences | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in getPreferences:', error)
      return { data: null, error }
    }
  }

  /**
   * Atualizar preferências
   */
  static async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<{ data: NotificationPreferences | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({ user_id: userId, ...updates })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error in updatePreferences:', error)
      return { data: null, error }
    }
  }
}
