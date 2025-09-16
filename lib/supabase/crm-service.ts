import { supabase } from '@/lib/supabase'

export interface Client {
    id: string
    name: string
    email?: string
    phone?: string
    client_code?: string  // Código interno do cliente para controle comercial
    status: 'lead' | 'prospect' | 'client' | 'inactive'
    priority?: 'low' | 'medium' | 'high'
    assigned_to?: string
    notes?: string
    budget_min?: number
    budget_max?: number
    document?: string
    source?: string
    address?: string
    city?: string
    state?: string
    zip_code?: string
    property_type?: 'house' | 'apartment' | 'commercial' | 'land' | 'other' | ''
    transaction_type?: 'rent' | 'buy' | 'sell' | ''
    last_contact?: string  // Data do último contato
    next_follow_up?: string  // Data do próximo follow-up
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
    task_type: 'internal' | 'client' | 'team' // Tipo da tarefa para controle de visibilidade
    visibility: 'private' | 'shared' // Privada (só o criador vê) ou compartilhada (equipe vê)
    category?: 'follow_up' | 'property_visit' | 'document_review' | 'contract' | 'marketing' | 'administrative' | 'other'
    start_time?: string // Horário de início opcional
    end_time?: string // Horário de término opcional
    reminders?: string[] // Array de timestamps para lembretes
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
    // Client code generation
    static generateClientCode(name: string, status: string): string {
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const randomId = Math.floor(Math.random() * 999) + 1;
        const sequencial = randomId.toString().padStart(3, '0');

        // Status code
        const statusMap = {
            'lead': 'LD',
            'prospect': 'PR',
            'client': 'CL',
            'inactive': 'IN'
        };
        const statusCode = statusMap[status as keyof typeof statusMap] || 'LD';

        // First two letters of name
        const nameCode = name.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X');

        return `${statusCode}${nameCode}${currentYear}${sequencial}`;
    }

    static async ensureClientCodeUnique(code: string): Promise<string> {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .select('client_code')
                .eq('client_code', code)
                .maybeSingle(); // Use maybeSingle() to avoid error when no record found

            // If there's an error (not just "no records found"), handle it
            if (error) {
                console.warn('Warning checking client code uniqueness:', error.message);
                // Return original code if we can't check (better than infinite loop)
                return code;
            }

            if (data) {
                // Code exists, generate a new one
                const randomSuffix = Math.floor(Math.random() * 99) + 1;
                const newCode = code.slice(0, -2) + randomSuffix.toString().padStart(2, '0');
                return await this.ensureClientCodeUnique(newCode);
            }

            return code;
        } catch (error) {
            console.warn('Error checking client code uniqueness:', error);
            return code;
        }
    }

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

    // Create client
    static async createClient(clientData: Partial<Client>): Promise<{ data: Client | null, error: any }> {
        try {
            // Generate client code if not provided
            if (!clientData.client_code && clientData.name && clientData.status) {
                const code = this.generateClientCode(clientData.name, clientData.status)
                clientData.client_code = await this.ensureClientCodeUnique(code)
            }

            // Clean the data object to avoid issues
            const cleanData = {
                name: clientData.name,
                email: clientData.email || null,
                phone: clientData.phone || null,
                client_code: clientData.client_code || null,
                status: clientData.status || 'lead',
                priority: clientData.priority || 'medium',
                document: clientData.document || null,
                source: clientData.source || null,
                address: clientData.address || null,
                city: clientData.city || null,
                state: clientData.state || null,
                zip_code: clientData.zip_code || null,
                property_type: clientData.property_type || null,
                transaction_type: clientData.transaction_type || null,
                notes: clientData.notes || null,
                budget_min: clientData.budget_min || null,
                budget_max: clientData.budget_max || null,
                assigned_to: clientData.assigned_to || null,
                created_by: clientData.created_by || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('crm_clients')
                .insert([cleanData])
                .select()
                .maybeSingle()

            if (error) {
                console.error('❌ Database error in createClient:', error)
                // Return demo data if database fails (for development)
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 Using demo data as fallback')
                    const demoClient: Client = {
                        id: 'demo-' + Date.now(),
                        name: clientData.name || 'Demo Client',
                        ...cleanData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } as Client
                    return { data: demoClient, error: null }
                }
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error creating client:', error)
            return { data: null, error }
        }
    }

    // Update client
    static async updateClient(clientId: string, clientData: Partial<Client>): Promise<{ data: Client | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .update({
                    ...clientData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', clientId)
                .select()
                .maybeSingle()

            if (error) {
                console.error('❌ Database error in updateClient:', error)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error updating client:', error)
            return { data: null, error }
        }
    }

    // Delete client
    static async deleteClient(clientId: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('crm_clients')
                .delete()
                .eq('id', clientId)

            if (error) {
                console.error('❌ Database error in deleteClient:', error)
                throw error
            }

            return { error: null }
        } catch (error) {
            console.error('❌ Error deleting client:', error)
            return { error }
        }
    }

    // Get client by ID
    static async getClientById(clientId: string): Promise<{ data: Client | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .select('*')
                .eq('id', clientId)
                .maybeSingle()

            if (error) {
                console.error('❌ Database error in getClientById:', error)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error getting client:', error)
            return { data: null, error }
        }
    }

    // Task management methods
    static async getTasks(filters?: {
        status?: string
        assigned_to?: string
        client_id?: string
        task_type?: string
        visibility?: string
    }): Promise<{ data: Task[] | null, error: any }> {
        try {
            // Start with basic query without joins to avoid RLS issues
            let query = supabase.from('crm_tasks').select('*')

            if (filters?.status && filters.status !== 'all') {
                query = query.eq('status', filters.status)
            }

            if (filters?.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }

            if (filters?.client_id) {
                query = query.eq('client_id', filters.client_id)
            }

            if (filters?.task_type) {
                query = query.eq('task_type', filters.task_type)
            }

            if (filters?.visibility) {
                query = query.eq('visibility', filters.visibility)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) {
                console.error('❌ Database error in getTasks:', error)
                console.log('🔄 Using demo data as fallback')
                return { data: this.getDemoTasks(), error: null }
            }

            if (!data || data.length === 0) {
                console.log('🔄 No tasks found, using demo data')
                return { data: this.getDemoTasks(), error: null }
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Database error in getTasks:', error)
            console.log('🔄 Using demo data as fallback')
            return { data: this.getDemoTasks(), error: null }
        }
    }

    // Create task
    static async createTask(taskData: Partial<Task>): Promise<{ data: Task | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_tasks')
                .insert([{
                    ...taskData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .maybeSingle()

            if (error) {
                console.error('❌ Database error in createTask:', error)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error creating task:', error)
            return { data: null, error }
        }
    }

    // Update task
    static async updateTask(taskId: string, taskData: Partial<Task>): Promise<{ data: Task | null, error: any }> {
        try {
            const { data, error } = await supabase
                .from('crm_tasks')
                .update({
                    ...taskData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', taskId)
                .select()
                .maybeSingle()

            if (error) {
                console.error('❌ Database error in updateTask:', error)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            console.error('❌ Error updating task:', error)
            return { data: null, error }
        }
    }

    // Delete task
    static async deleteTask(taskId: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('crm_tasks')
                .delete()
                .eq('id', taskId)

            if (error) {
                console.error('❌ Database error in deleteTask:', error)
                throw error
            }

            return { error: null }
        } catch (error) {
            console.error('❌ Error deleting task:', error)
            return { error }
        }
    }

    static getDemoTasks(): Task[] {
        return [
            {
                id: '1',
                title: 'Follow-up com João Silva',
                description: 'Entrar em contato para apresentar novas opções',
                priority: 'high',
                status: 'pending',
                task_type: 'client',
                visibility: 'shared',
                category: 'follow_up',
                due_date: new Date(Date.now() + 86400000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                client_id: '1',
                assigned_to: 'user1',
                created_by: 'user1'
            },
            {
                id: '2',
                title: 'Preparar apresentação de imóveis',
                description: 'Selecionar 5 imóveis que atendem ao perfil da Maria',
                priority: 'medium',
                status: 'in_progress',
                task_type: 'internal',
                visibility: 'private',
                category: 'administrative',
                due_date: new Date(Date.now() + 172800000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                client_id: '2',
                assigned_to: 'user1',
                created_by: 'user1'
            }
        ]
    }

    static getDemoClients(): Client[] {
        return [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao.silva@email.com',
                phone: '(11) 99999-1111',
                status: 'lead',
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
                budget_min: 200000,
                budget_max: 350000,
                notes: 'Comprou apartamento no centro',
                created_at: new Date('2024-01-05').toISOString(),
                updated_at: new Date('2024-01-25').toISOString()
            }
        ]
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
            const { error } = await supabase.from('crm_clients').select('id').limit(1)
            return !error
        } catch (error) {
            console.error('Supabase connection test failed:', error)
            return false
        }
    }
}
