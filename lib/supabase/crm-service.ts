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
    neighborhood?: string
    source?: 'website' | 'referral' | 'social_media' | 'phone' | 'walk_in'
    status: 'lead' | 'prospect' | 'client' | 'inactive'
    priority?: 'low' | 'medium' | 'high'
    assigned_to?: string
    notes?: string
    budget_min?: number
    budget_max?: number
    property_type?: 'apartment' | 'house' | 'commercial' | 'land' | 'other'
    transaction_type?: 'buy' | 'rent' | 'sell'
    urgency?: 'low' | 'medium' | 'high'
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
    status: 'available' | 'sold' | 'rented' | 'pending'
    assigned_agent?: string
    images?: string[]
    features?: string[]
    created_at: string
    updated_at: string
}

export interface Task {
    id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    assigned_to?: string
    client_id?: string
    property_id?: string
    due_date?: string
    completed_at?: string
    created_at: string
    updated_at: string
    created_by?: string
}

export interface Activity {
    id: string
    type: 'client_interaction' | 'property_update' | 'task_completion' | 'meeting_scheduled' | 'document_upload' | 'lead_captured'
    title: string
    description?: string
    client_id?: string
    property_id?: string
    task_id?: string
    created_by?: string
    created_at: string
    metadata?: any
}

export interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    source: string
    message?: string
    property_interest?: string
    budget_range?: string
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
    assigned_to?: string
    created_at: string
    updated_at: string
}

export class CRMService {
    // Client management
    static async getClients(filters?: {
        status?: string
        assigned_to?: string
        search?: string
    }): Promise<{ data: Client[] | null, error: any }> {
        try {
            let query = supabase.from('crm_clients').select('*')
            
            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }
            
            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }
            
            if (filters?.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
            }
            
            const { data, error } = await query.order('created_at', { ascending: false })
            
            if (error) {
                console.error('❌ Database error in getClients:', error)
                // Se falhar, use dados demo como fallback apenas para desenvolvimento
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 Using demo data as fallback')
                    return { data: this.getDemoClients(), error: null }
                }
                throw error
            }
            
            return { data, error: null }
        } catch (error) {
            console.error('❌ Database error in getClients:', error)
            // Se falhar, use dados demo como fallback apenas para desenvolvimento
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Using demo data as fallback')
                return { data: this.getDemoClients(), error: null }
            }
            return { data: null, error }
        }
    }

    static getDemoClients(): Client[] {
        return [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao.silva@email.com',
                phone: '(11) 99999-1111',
                status: 'lead',
                source: 'website',
                budget_min: 300000,
                budget_max: 500000,
                notes: 'Interessado em apartamentos na zona sul',
                created_at: new Date('2024-01-15').toISOString(),
                updated_at: new Date('2024-01-15').toISOString()
            },
            {
                id: '2',
                name: 'Maria Santos',
                email: 'maria.santos@email.com',
                phone: '(11) 88888-2222',
                status: 'prospect',
                source: 'referral',
                budget_min: 500000,
                budget_max: 800000,
                notes: 'Procura casa com quintal para família',
                created_at: new Date('2024-01-10').toISOString(),
                updated_at: new Date('2024-01-20').toISOString()
            },
            {
                id: '3',
                name: 'Carlos Oliveira',
                email: 'carlos.oliveira@email.com',
                phone: '(11) 77777-3333',
                status: 'client',
                source: 'social_media',
                budget_min: 200000,
                budget_max: 350000,
                notes: 'Comprou apartamento no centro',
                created_at: new Date('2024-01-05').toISOString(),
                updated_at: new Date('2024-01-25').toISOString()
            },
            {
                id: '4',
                name: 'Ana Costa',
                email: 'ana.costa@email.com',
                phone: '(11) 66666-4444',
                status: 'lead',
                source: 'social_media',
                budget_min: 400000,
                budget_max: 600000,
                notes: 'Primeira compra, precisa de orientação',
                created_at: new Date('2024-02-01').toISOString(),
                updated_at: new Date('2024-02-01').toISOString()
            },
            {
                id: '5',
                name: 'Pedro Ferreira',
                email: 'pedro.ferreira@email.com',
                phone: '(11) 55555-5555',
                status: 'inactive',
                source: 'referral',
                budget_min: 150000,
                budget_max: 250000,
                notes: 'Perdeu interesse, pode retomar no futuro',
                created_at: new Date('2023-12-15').toISOString(),
                updated_at: new Date('2024-01-30').toISOString()
            }
        ]
    }

    static async getClient(id: string): Promise<{ data: Client | null, error: any }> {
        try {
            const result = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()
            
            if (result.error) {
                console.error('Database error in getClient:', result.error)
                // Return demo client
                const demoClients = this.getDemoClients()
                const demoClient = demoClients.find(c => c.id === id) || demoClients[0]
                return {
                    data: demoClient,
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getClient:', error)
            return {
                data: null,
                error: error
            }
        }
    }

    static async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Client | null, error: any }> {
        try {
            const clientData = {
                ...client,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('crm_clients')
                .insert([clientData])
                .select()
                .single()
            
            if (error) {
                console.error('❌ Database error in createClient:', error)
                // Se falhar, use demo como fallback apenas para desenvolvimento
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 Creating demo client as fallback')
                    return {
                        data: this.createDemoClient(client),
                        error: null
                    }
                }
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Database error in createClient:', error)
            // Se falhar, use demo como fallback apenas para desenvolvimento
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Creating demo client as fallback')
                return {
                    data: this.createDemoClient(client),
                    error: null
                }
            }
            return { data: null, error }
        }
    }

    static createDemoClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Client {
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...clientData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    }

    static async updateClient(id: string, updates: Partial<Client>): Promise<{ data: Client | null, error: any }> {
        try {
            const updateData = {
                ...updates,
                updated_at: new Date().toISOString()
            }

            const result = await supabase
                .from('clients')
                .update(updateData)
                .eq('id', id)
                .select()
                .single()
            
            if (result.error) {
                console.error('Database error in updateClient:', result.error)
                return {
                    data: null,
                    error: result.error
                }
            }

            return result
        } catch (error) {
            console.error('Error in updateClient:', error)
            return {
                data: null,
                error: error
            }
        }
    }

    static async deleteClient(id: string): Promise<{ error: any }> {
        try {
            const result = await supabase
                .from('clients')
                .delete()
                .eq('id', id)
            
            if (result.error) {
                console.error('Database error in deleteClient:', result.error)
            }

            return result
        } catch (error) {
            console.error('Error in deleteClient:', error)
            return { error: error }
        }
    }

    // Client interactions
    static async getClientInteractions(clientId: string): Promise<{ data: ClientInteraction[] | null, error: any }> {
        try {
            const result = await supabase
                .from('client_interactions')
                .select('*')
                .eq('client_id', clientId)
                .order('interaction_date', { ascending: false })

            if (result.error) {
                console.error('Database error in getClientInteractions:', result.error)
                return {
                    data: [],
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getClientInteractions:', error)
            return {
                data: [],
                error: error
            }
        }
    }

    static async createClientInteraction(interaction: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<{ data: ClientInteraction | null, error: any }> {
        try {
            const interactionData = {
                ...interaction,
                created_at: new Date().toISOString()
            }

            const result = await supabase
                .from('client_interactions')
                .insert([interactionData])
                .select()
                .single()

            if (result.error) {
                console.error('Database error in createClientInteraction:', result.error)
            }

            return result
        } catch (error) {
            console.error('Error in createClientInteraction:', error)
            return {
                data: null,
                error: error
            }
        }
    }

    // Properties
    static async getProperties(filters?: {
        status?: string
        property_type?: string
        transaction_type?: string
        assigned_agent?: string
    }): Promise<{ data: Property[] | null, error: any }> {
        try {
            let query = supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false })

            if (filters?.status) {
                query = query.eq('status', filters.status)
            }

            if (filters?.property_type) {
                query = query.eq('property_type', filters.property_type)
            }

            if (filters?.transaction_type) {
                query = query.eq('transaction_type', filters.transaction_type)
            }

            if (filters?.assigned_agent) {
                query = query.eq('assigned_agent', filters.assigned_agent)
            }

            const result = await query

            if (result.error) {
                console.error('Database error in getProperties:', result.error)
                return {
                    data: [],
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getProperties:', error)
            return {
                data: [],
                error: error
            }
        }
    }

    // Tasks
    static async getTasks(filters?: {
        status?: string
        assigned_to?: string
        client_id?: string
    }): Promise<{ data: Task[] | null, error: any }> {
        try {
            let query = supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })

            if (filters?.status) {
                query = query.eq('status', filters.status)
            }

            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id)
            }

            const result = await query

            if (result.error) {
                console.error('Database error in getTasks:', result.error)
                return {
                    data: [],
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getTasks:', error)
            return {
                data: [],
                error: error
            }
        }
    }

    // Activities (for dashboard feed)
    static async getRecentActivities(limit: number = 10): Promise<{ data: Activity[] | null, error: any }> {
        try {
            const result = await supabase
                .from('activities')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit)

            if (result.error) {
                console.error('Database error in getRecentActivities:', result.error)
                return {
                    data: [],
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getRecentActivities:', error)
            return {
                data: [],
                error: error
            }
        }
    }

    // Leads
    static async getLeads(filters?: {
        status?: string
        source?: string
        assigned_to?: string
    }): Promise<{ data: Lead[] | null, error: any }> {
        try {
            let query = supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })

            if (filters?.status) {
                query = query.eq('status', filters.status)
            }

            if (filters?.source) {
                query = query.eq('source', filters.source)
            }

            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }

            const result = await query

            if (result.error) {
                console.error('Database error in getLeads:', result.error)
                return {
                    data: [],
                    error: null
                }
            }

            return result
        } catch (error) {
            console.error('Error in getLeads:', error)
            return {
                data: [],
                error: error
            }
        }
    }

    static async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Lead | null, error: any }> {
        try {
            const leadData = {
                ...lead,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const result = await supabase
                .from('leads')
                .insert([leadData])
                .select()
                .single()

            if (result.error) {
                console.error('Database error in createLead:', result.error)
            }

            return result
        } catch (error) {
            console.error('Error in createLead:', error)
            return {
                data: null,
                error: error
            }
        }
    }

    // Utility methods
    static async testConnection(): Promise<boolean> {
        try {
            const { error } = await supabase.from('clients').select('id').limit(1)
            return !error
        } catch (error) {
            console.error('Supabase connection test failed:', error)
            return false
        }
    }
}
