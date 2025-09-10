import { supabase } from '@/lib/supabase'
import { Task, TaskCategory, Notification } from '@/app/types/database'

export class TasksService {
    // Tasks Management
    static async getTasks(filters?: {
        status?: string
        priority?: string
        category?: string
        assigned_to?: string
        client_id?: string
        search?: string
        due_before?: string
        due_after?: string
    }): Promise<{ data: Task[] | null, error: any }> {
        try {
            let query = supabase.from('tasks').select(`
                *,
                client:crm_clients(id, name, email)
            `)
            
            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }
            
            if (filters?.priority && filters.priority !== 'all') {
                query = query.eq('priority', filters.priority)
            }
            
            if (filters?.category && filters.category !== 'all') {
                query = query.eq('category', filters.category)
            }
            
            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }
            
            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id)
            }
            
            if (filters?.search) {
                query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
            }
            
            if (filters?.due_before) {
                query = query.lte('due_date', filters.due_before)
            }
            
            if (filters?.due_after) {
                query = query.gte('due_date', filters.due_after)
            }
            
            const { data, error } = await query.order('due_date', { ascending: true, nullsFirst: false })
            
            if (error) {
                console.error('❌ Database error in getTasks:', error)
                if (process.env.NODE_ENV === 'development') {
                    return { data: this.getDemoTasks(), error: null }
                }
                throw error
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in getTasks:', error)
            if (process.env.NODE_ENV === 'development') {
                return { data: this.getDemoTasks(), error: null }
            }
            return { data: null, error }
        }
    }

    static async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null, error: any }> {
        try {
            const taskData = {
                ...task,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('tasks')
                .insert([taskData])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createTask:', error)
                if (process.env.NODE_ENV === 'development') {
                    return { data: this.createDemoTask(task), error: null }
                }
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in createTask:', error)
            if (process.env.NODE_ENV === 'development') {
                return { data: this.createDemoTask(task), error: null }
            }
            return { data: null, error }
        }
    }

    static async updateTask(id: string, updates: Partial<Task>): Promise<{ data: Task | null, error: any }> {
        try {
            const updateData = {
                ...updates,
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('tasks')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in updateTask:', error)
                throw error
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
            
            if (error) {
                console.error('❌ Database error in deleteTask:', error)
                throw error
            }

            return { error: null }
        } catch (error) {
            console.error('❌ Error in deleteTask:', error)
            return { error }
        }
    }

    // Notifications Management
    static async getNotifications(userId: string, filters?: {
        read?: boolean
        type?: string
        limit?: number
    }): Promise<{ data: Notification[] | null, error: any }> {
        try {
            let query = supabase.from('notifications').select('*').eq('user_id', userId)
            
            if (filters?.read !== undefined) {
                query = query.eq('read', filters.read)
            }
            
            if (filters?.type && filters.type !== 'all') {
                query = query.eq('type', filters.type)
            }
            
            if (filters?.limit) {
                query = query.limit(filters.limit)
            }
            
            const { data, error } = await query.order('created_at', { ascending: false })
            
            if (error) {
                console.error('❌ Database error in getNotifications:', error)
                if (process.env.NODE_ENV === 'development') {
                    return { data: this.getDemoNotifications(), error: null }
                }
                throw error
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in getNotifications:', error)
            if (process.env.NODE_ENV === 'development') {
                return { data: this.getDemoNotifications(), error: null }
            }
            return { data: null, error }
        }
    }

    static async markNotificationAsRead(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true, updated_at: new Date().toISOString() })
                .eq('id', id)
            
            if (error) {
                console.error('❌ Database error in markNotificationAsRead:', error)
                throw error
            }

            return { error: null }
        } catch (error) {
            console.error('❌ Error in markNotificationAsRead:', error)
            return { error }
        }
    }

    static async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Notification | null, error: any }> {
        try {
            const notificationData = {
                ...notification,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('notifications')
                .insert([notificationData])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createNotification:', error)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in createNotification:', error)
            return { data: null, error }
        }
    }

    // Categories Management
    static async getTaskCategories(): Promise<{ data: TaskCategory[] | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('task_categories')
                .select('*')
                .order('name')
            
            if (error) {
                console.error('❌ Database error in getTaskCategories:', error)
                if (process.env.NODE_ENV === 'development') {
                    return { data: this.getDemoCategories(), error: null }
                }
                throw error
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Error in getTaskCategories:', error)
            if (process.env.NODE_ENV === 'development') {
                return { data: this.getDemoCategories(), error: null }
            }
            return { data: null, error }
        }
    }

    // Utility functions
    static async getUpcomingTasks(userId: string, hours: number = 24): Promise<{ data: Task[] | null, error: any }> {
        const futureDate = new Date()
        futureDate.setHours(futureDate.getHours() + hours)
        
        return this.getTasks({
            assigned_to: userId,
            due_after: new Date().toISOString(),
            due_before: futureDate.toISOString(),
            status: 'pending'
        })
    }

    static async getOverdueTasks(userId?: string): Promise<{ data: Task[] | null, error: any }> {
        const filters: any = {
            status: 'overdue'
        }
        
        if (userId) {
            filters.assigned_to = userId
        }
        
        return this.getTasks(filters)
    }

    static async getTaskStats(userId?: string): Promise<{ 
        total: number, 
        pending: number, 
        completed: number, 
        overdue: number, 
        urgent: number 
    }> {
        try {
            let query = supabase.from('tasks').select('status, priority')
            
            if (userId) {
                query = query.eq('assigned_to', userId)
            }
            
            const { data, error } = await query
            
            if (error || !data) {
                return { total: 0, pending: 0, completed: 0, overdue: 0, urgent: 0 }
            }
            
            return {
                total: data.length,
                pending: data.filter(t => t.status === 'pending').length,
                completed: data.filter(t => t.status === 'completed').length,
                overdue: data.filter(t => t.status === 'overdue').length,
                urgent: data.filter(t => t.priority === 'urgent').length
            }
        } catch (error) {
            console.error('❌ Error in getTaskStats:', error)
            return { total: 0, pending: 0, completed: 0, overdue: 0, urgent: 0 }
        }
    }

    // Demo data for fallback
    static getDemoTasks(): Task[] {
        return []
    }

    static createDemoTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...task,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            type: 'other'
        }
    }

    static getDemoNotifications(): Notification[] {
        return []
    }

    static getDemoCategories(): TaskCategory[] {
        return []
    }
}