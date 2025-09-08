import { createClient } from '@supabase/supabase-js'
import { Reminder, ReminderNotification, NotificationTemplate, UserSettings } from '@/app/types/reminders'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export class RemindersService {
    // ========== REMINDERS ==========
    
    /**
     * Criar novo reminder
     */
    static async createReminder(reminderData: Partial<Reminder>): Promise<{ data: Reminder | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_reminders')
                .insert([reminderData])
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao criar reminder:', error)
            return { data: null, error }
        }
    }

    /**
     * Listar reminders do usuário
     */
    static async getUserReminders(
        userId: string,
        filters: {
            status?: string
            type?: string
            dateFrom?: string
            dateTo?: string
            priority?: string
        } = {}
    ): Promise<{ data: Reminder[] | null, error: any }> {
        try {
            let query = supabase
                .from('crm_reminders')
                .select(`
                    *,
                    client:crm_clients(name, email, phone),
                    property:crm_properties(title, address)
                `)
                .eq('assigned_to', userId)
                .order('reminder_date', { ascending: true })

            // Aplicar filtros
            if (filters.status) {
                query = query.eq('status', filters.status)
            }
            if (filters.type) {
                query = query.eq('reminder_type', filters.type)
            }
            if (filters.priority) {
                query = query.eq('priority', filters.priority)
            }
            if (filters.dateFrom) {
                query = query.gte('reminder_date', filters.dateFrom)
            }
            if (filters.dateTo) {
                query = query.lte('reminder_date', filters.dateTo)
            }

            const { data, error } = await query

            return { data, error }
        } catch (error) {
            console.error('Erro ao buscar reminders:', error)
            return { data: null, error }
        }
    }

    /**
     * Reminders pendentes hoje
     */
    static async getTodayReminders(userId: string): Promise<{ data: Reminder[] | null, error: any }> {
        try {
            const today = new Date()
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

            const { data, error } = await supabase
                .from('crm_reminders')
                .select(`
                    *,
                    client:crm_clients(name, email, phone),
                    property:crm_properties(title, address)
                `)
                .eq('assigned_to', userId)
                .eq('status', 'pending')
                .gte('reminder_date', startOfDay)
                .lte('reminder_date', endOfDay)
                .order('reminder_date', { ascending: true })

            return { data, error }
        } catch (error) {
            console.error('Erro ao buscar reminders de hoje:', error)
            return { data: null, error }
        }
    }

    /**
     * Marcar reminder como completado
     */
    static async completeReminder(reminderId: string): Promise<{ data: Reminder | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_reminders')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString()
                })
                .eq('id', reminderId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao completar reminder:', error)
            return { data: null, error }
        }
    }

    /**
     * Adiar reminder (snooze)
     */
    static async snoozeReminder(
        reminderId: string, 
        minutes: number
    ): Promise<{ data: Reminder | null, error: any }> {
        try {
            const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()

            const { data, error } = await supabase
                .from('crm_reminders')
                .update({
                    snooze_until: snoozeUntil
                })
                .eq('id', reminderId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao adiar reminder:', error)
            return { data: null, error }
        }
    }

    // ========== NOTIFICAÇÕES ==========

    /**
     * Criar notificação
     */
    static async createNotification(
        notificationData: Partial<ReminderNotification>
    ): Promise<{ data: ReminderNotification | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_notifications')
                .insert([notificationData])
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao criar notificação:', error)
            return { data: null, error }
        }
    }

    /**
     * Listar notificações do usuário
     */
    static async getUserNotifications(
        userId: string,
        limit: number = 50
    ): Promise<{ data: ReminderNotification[] | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit)

            return { data, error }
        } catch (error) {
            console.error('Erro ao buscar notificações:', error)
            return { data: null, error }
        }
    }

    /**
     * Marcar notificação como lida
     */
    static async markNotificationAsRead(
        notificationId: string
    ): Promise<{ data: ReminderNotification | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error)
            return { data: null, error }
        }
    }

    // ========== CONFIGURAÇÕES ==========

    /**
     * Obter configurações do usuário
     */
    static async getUserSettings(userId: string): Promise<{ data: UserSettings | null, error: any }> {
        try {
            let { data, error } = await supabase
                .from('crm_user_settings')
                .select('*')
                .eq('user_id', userId)
                .single()

            // Se não existir, criar configurações padrão
            if (!data && !error) {
                const defaultSettings = {
                    user_id: userId,
                    email_notifications: true,
                    sms_notifications: false,
                    whatsapp_notifications: false,
                    push_notifications: true,
                    notification_hours: { start: '09:00', end: '18:00' },
                    timezone: 'America/Sao_Paulo',
                    reminder_advance_time: 60,
                    daily_digest: true,
                    weekly_summary: true,
                    reminder_channel: 'email',
                    urgent_channel: 'sms'
                }

                const { data: newData, error: createError } = await supabase
                    .from('crm_user_settings')
                    .insert([defaultSettings])
                    .select()
                    .single()

                return { data: newData, error: createError }
            }

            return { data, error }
        } catch (error) {
            console.error('Erro ao buscar configurações:', error)
            return { data: null, error }
        }
    }

    /**
     * Atualizar configurações do usuário
     */
    static async updateUserSettings(
        userId: string,
        settings: Partial<UserSettings>
    ): Promise<{ data: UserSettings | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_user_settings')
                .update(settings)
                .eq('user_id', userId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error)
            return { data: null, error }
        }
    }

    // ========== TEMPLATES ==========

    /**
     * Listar templates de notificação
     */
    static async getNotificationTemplates(): Promise<{ data: NotificationTemplate[] | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_notification_templates')
                .select('*')
                .eq('is_active', true)
                .order('name')

            return { data, error }
        } catch (error) {
            console.error('Erro ao buscar templates:', error)
            return { data: null, error }
        }
    }

    // ========== AUTOMAÇÃO ==========

    /**
     * Criar reminder automático após atividade
     */
    static async createAutomaticReminder(
        activityId: string,
        clientId: string,
        assignedTo: string,
        type: 'follow_up' | 'call' | 'visit',
        daysDelay: number = 3
    ): Promise<{ data: Reminder | null, error: any }> {
        try {
            const reminderDate = new Date()
            reminderDate.setDate(reminderDate.getDate() + daysDelay)

            const reminderData = {
                title: `Follow-up - ${type}`,
                description: `Lembrete automático para ${type} com cliente`,
                reminder_type: type,
                client_id: clientId,
                activity_id: activityId,
                reminder_date: reminderDate.toISOString(),
                assigned_to: assignedTo,
                priority: 'medium' as const,
                notification_channels: ['email' as const]
            }

            return await this.createReminder(reminderData)
        } catch (error) {
            console.error('Erro ao criar reminder automático:', error)
            return { data: null, error }
        }
    }

    // ========== ESTATÍSTICAS ==========

    /**
     * Estatísticas de reminders
     */
    static async getReminderStats(userId: string): Promise<{
        pending: number
        completed: number
        overdue: number
        today: number
    }> {
        try {
            const now = new Date().toISOString()
            const today = new Date()
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

            const [pendingRes, completedRes, overdueRes, todayRes] = await Promise.all([
                supabase
                    .from('crm_reminders')
                    .select('id', { count: 'exact', head: true })
                    .eq('assigned_to', userId)
                    .eq('status', 'pending'),
                
                supabase
                    .from('crm_reminders')
                    .select('id', { count: 'exact', head: true })
                    .eq('assigned_to', userId)
                    .eq('status', 'completed'),
                
                supabase
                    .from('crm_reminders')
                    .select('id', { count: 'exact', head: true })
                    .eq('assigned_to', userId)
                    .eq('status', 'pending')
                    .lt('reminder_date', now),
                
                supabase
                    .from('crm_reminders')
                    .select('id', { count: 'exact', head: true })
                    .eq('assigned_to', userId)
                    .eq('status', 'pending')
                    .gte('reminder_date', startOfDay)
                    .lte('reminder_date', endOfDay)
            ])

            return {
                pending: pendingRes.count || 0,
                completed: completedRes.count || 0,
                overdue: overdueRes.count || 0,
                today: todayRes.count || 0
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            return { pending: 0, completed: 0, overdue: 0, today: 0 }
        }
    }
}
