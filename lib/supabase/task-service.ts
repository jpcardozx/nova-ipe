import { supabase } from '@/lib/supabase'

export interface Task {
    id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    category: string
    assigned_to?: string
    client_id?: string
    due_date?: string
    reminder_time?: string
    estimated_duration?: number
    actual_duration?: number
    tags?: string[]
    attachments?: any
    completed_at?: string
    created_at: string
    updated_at: string
    created_by?: string
    recurring_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    recurring_until?: string
    parent_task_id?: string
}

export interface Notification {
    id: string
    title: string
    message?: string
    type: 'info' | 'success' | 'warning' | 'error' | 'reminder'
    user_id: string
    task_id?: string
    client_id?: string
    scheduled_for?: string
    sent_at?: string
    read_at?: string
    is_read: boolean
    is_sent: boolean
    priority: 'low' | 'medium' | 'high' | 'urgent'
    action_url?: string
    metadata?: any
    created_at: string
}

export interface CalendarEvent {
    id: string
    title: string
    description?: string
    start_time: string
    end_time: string
    all_day: boolean
    location?: string
    event_type: 'meeting' | 'call' | 'visit' | 'deadline' | 'reminder' | 'other'
    attendees?: string[]
    task_id?: string
    client_id?: string
    color: string
    recurring_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    recurring_until?: string
    reminder_minutes: number
    created_by?: string
    created_at: string
    updated_at: string
}

export class TaskService {
    // Tasks
    static async getTasks(filters?: {
        status?: string
        priority?: string
        assigned_to?: string
        category?: string
        due_date_from?: string
        due_date_to?: string
    }): Promise<{ data: Task[] | null, error: any }> {
        try {
            let query = supabase.from('tasks').select('*')
            
            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }
            
            if (filters?.priority && filters.priority !== 'all') {
                query = query.eq('priority', filters.priority)
            }
            
            if (filters?.assigned_to && filters.assigned_to !== 'all') {
                query = query.eq('assigned_to', filters.assigned_to)
            }
            
            if (filters?.category && filters.category !== 'all') {
                query = query.eq('category', filters.category)
            }
            
            if (filters?.due_date_from) {
                query = query.gte('due_date', filters.due_date_from)
            }
            
            if (filters?.due_date_to) {
                query = query.lte('due_date', filters.due_date_to)
            }
            
            const { data, error } = await query.order('created_at', { ascending: false })
            
            if (error) {
                console.error('❌ Database error in getTasks:', error)
                return { data: this.getDemoTasks(), error: null }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in getTasks:', error)
            return { data: this.getDemoTasks(), error: null }
        }
    }

    static async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    ...task,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createTask:', error)
                return { data: this.createDemoTask(task), error: null }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in createTask:', error)
            return { data: null, error }
        }
    }

    static async updateTask(id: string, updates: Partial<Task>): Promise<{ data: Task | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in updateTask:', error)
                return { data: null, error }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in updateTask:', error)
            return { data: null, error }
        }
    }

    static async deleteTask(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
            
            return { error }
        } catch (error) {
            console.error('❌ Error in deleteTask:', error)
            return { error }
        }
    }

    // Notifications
    static async getNotifications(userId: string, filters?: {
        is_read?: boolean
        type?: string
        limit?: number
    }): Promise<{ data: Notification[] | null, error: any }> {
        try {
            // Verificar se userId é válido
            if (!userId) {
                return { data: [], error: null }
            }

            let query = supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
            
            if (filters?.is_read !== undefined) {
                query = query.eq('is_read', filters.is_read)
            }
            
            if (filters?.type && filters.type !== 'all') {
                query = query.eq('type', filters.type)
            }
            
            if (filters?.limit) {
                query = query.limit(filters.limit)
            }
            
            const { data, error } = await query.order('created_at', { ascending: false })
            
            if (error) {
                // Log interno apenas, não mostrar erro para o usuário
                console.warn('Database query failed for notifications, returning empty array')
                return { data: [], error: null }
            }
            
            return { data: data || [], error: null }
        } catch (error) {
            // Log interno apenas, retornar array vazio para não quebrar a UI
            console.warn('Notifications service temporarily unavailable')
            return { data: [], error: null }
        }
    }

    static async markNotificationAsRead(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', id)
            
            return { error }
        } catch (error) {
            console.error('❌ Error in markNotificationAsRead:', error)
            return { error }
        }
    }

    static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<{ data: Notification | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([{
                    ...notification,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createNotification:', error)
                return { data: null, error }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in createNotification:', error)
            return { data: null, error }
        }
    }

    // Calendar Events
    static async getCalendarEvents(filters?: {
        start_date?: string
        end_date?: string
        event_type?: string
    }): Promise<{ data: CalendarEvent[] | null, error: any }> {
        try {
            let query = supabase.from('calendar_events').select('*')
            
            if (filters?.start_date) {
                query = query.gte('start_time', filters.start_date)
            }
            
            if (filters?.end_date) {
                query = query.lte('end_time', filters.end_date)
            }
            
            if (filters?.event_type && filters.event_type !== 'all') {
                query = query.eq('event_type', filters.event_type)
            }
            
            const { data, error } = await query.order('start_time', { ascending: true })
            
            if (error) {
                console.error('❌ Database error in getCalendarEvents:', error)
                return { data: this.getDemoEvents(), error: null }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in getCalendarEvents:', error)
            return { data: this.getDemoEvents(), error: null }
        }
    }

    static async createCalendarEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: CalendarEvent | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('calendar_events')
                .insert([{
                    ...event,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createCalendarEvent:', error)
                return { data: null, error }
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in createCalendarEvent:', error)
            return { data: null, error }
        }
    }

    // Real-time notifications check
    static async checkPendingNotifications(userId: string): Promise<Notification[]> {
        try {
            const now = new Date().toISOString()
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .eq('is_sent', false)
                .lte('scheduled_for', now)
                .order('priority', { ascending: false })
            
            if (error || !data) {
                return []
            }

            // Mark as sent
            if (data.length > 0) {
                await supabase
                    .from('notifications')
                    .update({ is_sent: true, sent_at: now })
                    .in('id', data.map(n => n.id))
            }
            
            return data
        } catch (error) {
            console.error('❌ Error checking notifications:', error)
            return []
        }
    }

    // Demo data
    static getDemoTasks(): Task[] {
        return [
            {
                id: '1',
                title: 'Ligar para Maria Silva',
                description: 'Follow-up sobre apartamento em Vila Madalena',
                priority: 'high',
                status: 'pending',
                category: 'cliente',
                assigned_to: 'user123',
                due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Preparar contrato',
                description: 'Elaborar contrato de compra e venda',
                priority: 'medium',
                status: 'in_progress',
                category: 'documentos',
                assigned_to: 'user123',
                due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]
    }

    static createDemoTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...taskData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    }

    static getDemoEvents(): CalendarEvent[] {
        return [
            {
                id: '1',
                title: 'Reunião de equipe',
                description: 'Reunião semanal da equipe de vendas',
                start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
                all_day: false,
                event_type: 'meeting',
                color: '#10b981',
                reminder_minutes: 15,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]
    }
}
