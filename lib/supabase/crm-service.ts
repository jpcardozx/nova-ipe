import { supabase } from '@/lib/supabase'

export interface Client {
    id: string
    name: string
    email?: string
    phone?: string
    document?: string
    address?: string
    city?: string
    state?: string
    zip_code?: string
    source?: string
    status: 'lead' | 'prospect' | 'client' | 'inactive'
    assigned_to?: string
    notes?: string
    budget_min?: number
    budget_max?: number
    property_preferences?: any
    last_contact?: string
    next_follow_up?: string
    created_at: string
    updated_at: string
    created_by?: string
}

export interface ClientInteraction {
    id: string
    client_id: string
    interaction_type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'visit'
    subject: string
    description?: string
    outcome?: string
    interaction_date: string
    created_by?: string
    created_at: string
}

export interface Property {
    id: string
    title: string
    description?: string
    property_type: 'house' | 'apartment' | 'commercial' | 'land'
    transaction_type: 'sale' | 'rent'
    price: number
    area?: number
    bedrooms?: number
    bathrooms?: number
    garage_spaces?: number
    address: string
    city: string
    state: string
    zip_code?: string
    latitude?: number
    longitude?: number
    features?: any
    images?: any
    status: 'available' | 'reserved' | 'sold' | 'rented'
    owner_contact?: any
    assigned_agent?: string
    created_at: string
    updated_at: string
    created_by?: string
}

export interface CalendarEvent {
    id: string
    title: string
    description?: string
    event_type: 'meeting' | 'property_visit' | 'call' | 'follow_up' | 'personal'
    start_time: string
    end_time: string
    all_day: boolean
    location?: string
    client_id?: string
    property_id?: string
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    reminder_minutes: number
    is_recurring: boolean
    recurring_pattern?: any
    created_by?: string
    created_at: string
    updated_at: string
}

export interface EventParticipant {
    id: string
    event_id: string
    user_id: string
    status: 'invited' | 'accepted' | 'declined' | 'maybe'
    is_organizer: boolean
    can_edit: boolean
    notification_sent: boolean
    created_at: string
}

export interface Notification {
    id: string
    user_id: string
    title: string
    message?: string
    type: 'event_reminder' | 'event_invite' | 'client_update' | 'system'
    reference_id?: string
    reference_type?: string
    is_read: boolean
    scheduled_for?: string
    sent_at?: string
    created_at: string
}

export class CRMService {
    // Client management
    static async getClients(filters?: {
        status?: string
        assigned_to?: string
        search?: string
    }): Promise<{ data: Client[] | null, error: any }> {
        let query = supabase
            .from('clients')
            .select('*, assigned_to:profiles!clients_assigned_to_fkey(full_name)')
            .order('created_at', { ascending: false })

        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        if (filters?.assigned_to) {
            query = query.eq('assigned_to', filters.assigned_to)
        }

        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
        }

        return await query
    }

    static async getClient(id: string): Promise<{ data: Client | null, error: any }> {
        return await supabase
            .from('clients')
            .select('*, assigned_to:profiles!clients_assigned_to_fkey(full_name)')
            .eq('id', id)
            .single()
    }

    static async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Client | null, error: any }> {
        return await supabase
            .from('clients')
            .insert([client])
            .select()
            .single()
    }

    static async updateClient(id: string, updates: Partial<Client>): Promise<{ data: Client | null, error: any }> {
        return await supabase
            .from('clients')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    }

    static async deleteClient(id: string): Promise<{ error: any }> {
        return await supabase
            .from('clients')
            .delete()
            .eq('id', id)
    }

    // Client interactions
    static async getClientInteractions(clientId: string): Promise<{ data: ClientInteraction[] | null, error: any }> {
        return await supabase
            .from('client_interactions')
            .select('*, created_by:profiles!client_interactions_created_by_fkey(full_name)')
            .eq('client_id', clientId)
            .order('interaction_date', { ascending: false })
    }

    static async createClientInteraction(interaction: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<{ data: ClientInteraction | null, error: any }> {
        return await supabase
            .from('client_interactions')
            .insert([interaction])
            .select()
            .single()
    }

    // Properties
    static async getProperties(filters?: {
        status?: string
        property_type?: string
        transaction_type?: string
        assigned_agent?: string
        search?: string
    }): Promise<{ data: Property[] | null, error: any }> {
        let query = supabase
            .from('properties')
            .select('*, assigned_agent:profiles!properties_assigned_agent_fkey(full_name)')
            .order('created_at', { ascending: false })

        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        if (filters?.property_type && filters.property_type !== 'all') {
            query = query.eq('property_type', filters.property_type)
        }

        if (filters?.transaction_type && filters.transaction_type !== 'all') {
            query = query.eq('transaction_type', filters.transaction_type)
        }

        if (filters?.assigned_agent) {
            query = query.eq('assigned_agent', filters.assigned_agent)
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
        }

        return await query
    }

    static async getProperty(id: string): Promise<{ data: Property | null, error: any }> {
        return await supabase
            .from('properties')
            .select('*, assigned_agent:profiles!properties_assigned_agent_fkey(full_name)')
            .eq('id', id)
            .single()
    }

    static async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Property | null, error: any }> {
        return await supabase
            .from('properties')
            .insert([property])
            .select()
            .single()
    }

    static async updateProperty(id: string, updates: Partial<Property>): Promise<{ data: Property | null, error: any }> {
        return await supabase
            .from('properties')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    }

    // Calendar events
    static async getCalendarEvents(filters?: {
        start_date?: string
        end_date?: string
        event_type?: string
        status?: string
    }): Promise<{ data: CalendarEvent[] | null, error: any }> {
        let query = supabase
            .from('calendar_events')
            .select(`
                *, 
                client:clients(name),
                property:properties(title),
                created_by:profiles!calendar_events_created_by_fkey(full_name),
                participants:event_participants(
                    id,
                    status,
                    is_organizer,
                    user:profiles(full_name)
                )
            `)
            .order('start_time', { ascending: true })

        if (filters?.start_date) {
            query = query.gte('start_time', filters.start_date)
        }

        if (filters?.end_date) {
            query = query.lte('start_time', filters.end_date)
        }

        if (filters?.event_type && filters.event_type !== 'all') {
            query = query.eq('event_type', filters.event_type)
        }

        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        return await query
    }

    static async getCalendarEvent(id: string): Promise<{ data: CalendarEvent | null, error: any }> {
        return await supabase
            .from('calendar_events')
            .select(`
                *, 
                client:clients(name, email, phone),
                property:properties(title, address),
                created_by:profiles!calendar_events_created_by_fkey(full_name),
                participants:event_participants(
                    id,
                    user_id,
                    status,
                    is_organizer,
                    can_edit,
                    user:profiles(full_name, email)
                )
            `)
            .eq('id', id)
            .single()
    }

    static async createCalendarEvent(
        event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>,
        participants: string[] = []
    ): Promise<{ data: CalendarEvent | null, error: any }> {
        const { data: eventData, error: eventError } = await supabase
            .from('calendar_events')
            .insert([event])
            .select()
            .single()

        if (eventError || !eventData) {
            return { data: null, error: eventError }
        }

        // Add participants
        if (participants.length > 0) {
            const participantData = participants.map(userId => ({
                event_id: eventData.id,
                user_id: userId,
                status: 'invited' as const,
                is_organizer: userId === event.created_by,
                can_edit: userId === event.created_by
            }))

            await supabase
                .from('event_participants')
                .insert(participantData)
        }

        return { data: eventData, error: null }
    }

    static async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<{ data: CalendarEvent | null, error: any }> {
        return await supabase
            .from('calendar_events')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    }

    static async deleteCalendarEvent(id: string): Promise<{ error: any }> {
        return await supabase
            .from('calendar_events')
            .delete()
            .eq('id', id)
    }

    // Event participants
    static async updateParticipantStatus(eventId: string, userId: string, status: 'accepted' | 'declined' | 'maybe'): Promise<{ error: any }> {
        return await supabase
            .from('event_participants')
            .update({ status })
            .eq('event_id', eventId)
            .eq('user_id', userId)
    }

    static async addEventParticipant(eventId: string, userId: string): Promise<{ data: EventParticipant | null, error: any }> {
        return await supabase
            .from('event_participants')
            .insert([{
                event_id: eventId,
                user_id: userId,
                status: 'invited' as const
            }])
            .select()
            .single()
    }

    static async removeEventParticipant(eventId: string, userId: string): Promise<{ error: any }> {
        return await supabase
            .from('event_participants')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userId)
    }

    // Notifications
    static async getUserNotifications(userId: string, unreadOnly = false): Promise<{ data: Notification[] | null, error: any }> {
        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (unreadOnly) {
            query = query.eq('is_read', false)
        }

        return await query
    }

    static async markNotificationAsRead(id: string): Promise<{ error: any }> {
        return await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
    }

    static async markAllNotificationsAsRead(userId: string): Promise<{ error: any }> {
        return await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false)
    }

    static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<{ data: Notification | null, error: any }> {
        return await supabase
            .from('notifications')
            .insert([notification])
            .select()
            .single()
    }

    // Dashboard analytics
    static async getDashboardAnalytics() {
        const [
            { data: clients },
            { data: properties },
            { data: events },
            { data: interactions }
        ] = await Promise.all([
            supabase.from('clients').select('id, status, created_at'),
            supabase.from('properties').select('id, status, price, transaction_type, created_at'),
            supabase.from('calendar_events').select('id, status, start_time, event_type'),
            supabase.from('client_interactions').select('id, interaction_type, interaction_date')
        ])

        const today = new Date()
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

        return {
            clients: {
                total: clients?.length || 0,
                active: clients?.filter(c => c.status === 'client')?.length || 0,
                leads: clients?.filter(c => c.status === 'lead')?.length || 0,
                prospects: clients?.filter(c => c.status === 'prospect')?.length || 0,
                thisMonth: clients?.filter(c => new Date(c.created_at) >= thisMonth)?.length || 0
            },
            properties: {
                total: properties?.length || 0,
                available: properties?.filter(p => p.status === 'available')?.length || 0,
                sold: properties?.filter(p => p.status === 'sold')?.length || 0,
                rented: properties?.filter(p => p.status === 'rented')?.length || 0,
                forSale: properties?.filter(p => p.transaction_type === 'sale' && p.status === 'available')?.length || 0,
                forRent: properties?.filter(p => p.transaction_type === 'rent' && p.status === 'available')?.length || 0
            },
            events: {
                total: events?.length || 0,
                thisWeek: events?.filter(e => {
                    const eventDate = new Date(e.start_time)
                    const weekStart = new Date(today)
                    weekStart.setDate(today.getDate() - today.getDay())
                    const weekEnd = new Date(weekStart)
                    weekEnd.setDate(weekStart.getDate() + 6)
                    return eventDate >= weekStart && eventDate <= weekEnd
                })?.length || 0,
                today: events?.filter(e => {
                    const eventDate = new Date(e.start_time)
                    return eventDate.toDateString() === today.toDateString()
                })?.length || 0,
                pending: events?.filter(e => e.status === 'scheduled')?.length || 0
            },
            interactions: {
                total: interactions?.length || 0,
                thisMonth: interactions?.filter(i => new Date(i.interaction_date) >= thisMonth)?.length || 0,
                lastMonth: interactions?.filter(i => {
                    const date = new Date(i.interaction_date)
                    return date >= lastMonth && date < thisMonth
                })?.length || 0
            }
        }
    }

    // Get team members for assignments
    static async getTeamMembers(): Promise<{ data: any[] | null, error: any }> {
        return await supabase
            .from('profiles')
            .select('id, full_name, email, role, department')
            .eq('is_approved', true)
            .eq('is_active', true)
            .order('full_name')
    }
}