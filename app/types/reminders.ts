// Tipos para o Sistema de Reminders
export interface Reminder {
    id: string
    title: string
    description?: string
    reminder_type: 'call' | 'visit' | 'document' | 'meeting' | 'follow_up' | 'payment'
    status: 'pending' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    
    // Relacionamentos
    client_id?: string
    property_id?: string
    activity_id?: string
    deal_id?: string
    
    // Timing
    reminder_date: string
    completed_at?: string
    snooze_until?: string
    
    // Recorrência
    is_recurring: boolean
    recurrence_pattern?: {
        type: 'daily' | 'weekly' | 'monthly'
        interval: number
        end_date?: string
    }
    
    // Notificações
    notification_channels: ('email' | 'sms' | 'whatsapp' | 'push')[]
    notification_sent_at?: string
    notification_status: 'pending' | 'sent' | 'failed'
    
    // Metadados
    assigned_to?: string
    created_by?: string
    created_at: string
    updated_at: string
}

export interface ReminderNotification {
    id: string
    user_id: string
    reminder_id?: string
    
    // Conteúdo
    title: string
    message?: string
    type: 'reminder' | 'activity' | 'deal_update' | 'system'
    channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app'
    
    // Status
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
    is_read: boolean
    read_at?: string
    
    // Dados específicos do canal
    email_data?: {
        subject: string
        html_content: string
        attachments?: string[]
    }
    sms_data?: {
        phone_number: string
        message: string
    }
    whatsapp_data?: {
        phone_number: string
        message: string
        media_url?: string
    }
    push_data?: {
        title: string
        body: string
        icon?: string
        click_action?: string
    }
    
    // Resultado
    delivery_status?: any
    error_message?: string
    sent_at?: string
    delivered_at?: string
    
    created_at: string
}

export interface NotificationTemplate {
    id: string
    name: string
    description?: string
    type: 'reminder' | 'welcome' | 'follow_up'
    channel: 'email' | 'sms' | 'whatsapp'
    
    // Conteúdo do template
    subject_template?: string
    content_template: string
    
    // Configurações
    is_active: boolean
    variables: string[]
    
    created_at: string
    updated_at: string
}

export interface UserSettings {
    id: string
    user_id: string
    
    // Preferências de notificação
    email_notifications: boolean
    sms_notifications: boolean
    whatsapp_notifications: boolean
    push_notifications: boolean
    
    // Horários de notificação
    notification_hours: {
        start: string
        end: string
    }
    timezone: string
    
    // Frequência de reminders
    reminder_advance_time: number // minutos antes
    daily_digest: boolean
    weekly_summary: boolean
    
    // Canais preferidos por tipo
    reminder_channel: 'email' | 'sms' | 'whatsapp' | 'push'
    urgent_channel: 'email' | 'sms' | 'whatsapp' | 'push'
    
    created_at: string
    updated_at: string
}
