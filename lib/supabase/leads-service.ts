import { supabase } from '@/lib/supabase'

export interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    source: 'website' | 'referral' | 'social_media' | 'phone' | 'walk_in' | 'real_estate_portal'
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    budget_min?: number
    budget_max?: number
    property_type?: 'apartment' | 'house' | 'commercial' | 'land' | 'studio'
    property_purpose?: 'buy' | 'rent' | 'sell'
    location_preference?: string
    notes?: string
    assigned_to?: string
    last_contact?: string
    next_followup?: string
    created_at: string
    updated_at: string
    created_by?: string
}

export interface LeadActivity {
    id: string
    lead_id: string
    type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'property_visit' | 'proposal_sent' | 'contract_signed' | 'note'
    title: string
    description?: string
    outcome?: 'positive' | 'negative' | 'neutral'
    scheduled_for?: string
    completed_at?: string
    created_by?: string
    created_at: string
    metadata?: Record<string, any>
}

export class LeadsService {
    // ==================== LEADS CRUD ====================
    
    static async createLead(leadData: Partial<Lead>) {
        try {
            const { data: user } = await supabase.auth.getUser()
            
            const { data, error } = await supabase
                .from('leads')
                .insert([{
                    name: leadData.name,
                    email: leadData.email,
                    phone: leadData.phone,
                    source: leadData.source || 'website',
                    status: 'lead', // using crm_clients status field
                    priority: leadData.priority || 'medium',
                    notes: leadData.notes,
                    budget_min: leadData.budget_min,
                    budget_max: leadData.budget_max,
                    assigned_to: leadData.assigned_to || user.user?.id,
                    created_by: user.user?.id,
                    // Store lead-specific data in notes or custom fields
                    custom_fields: {
                        property_type: leadData.property_type,
                        property_purpose: leadData.property_purpose,
                        location_preference: leadData.location_preference,
                        lead_status: leadData.status || 'new'
                    }
                }])
                .select()
                .single()

            if (error) throw error
            
            // Log activity
            if (data) {
                await this.createActivity({
                    lead_id: data.id,
                    type: 'note',
                    title: 'Lead criado',
                    description: `Lead criado via ${leadData.source || 'sistema'}`,
                    outcome: 'positive',
                    completed_at: new Date().toISOString()
                })
            }
            
            return { lead: data, error: null }
        } catch (error) {
            console.error('Erro ao criar lead:', error)
            return { lead: null, error }
        }
    }

    static async updateLead(leadId: string, updates: Partial<Lead>) {
        try {
            const { data, error } = await supabase
                .from('leads')
                .update({
                    name: updates.name,
                    email: updates.email,
                    phone: updates.phone,
                    priority: updates.priority,
                    notes: updates.notes,
                    budget_min: updates.budget_min,
                    budget_max: updates.budget_max,
                    assigned_to: updates.assigned_to,
                    updated_at: new Date().toISOString(),
                    custom_fields: updates.property_type || updates.property_purpose || updates.location_preference ? {
                        property_type: updates.property_type,
                        property_purpose: updates.property_purpose,
                        location_preference: updates.location_preference,
                        lead_status: updates.status
                    } : undefined
                })
                .eq('id', leadId)
                .select()
                .single()

            if (error) throw error
            return { lead: data, error: null }
        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
            return { lead: null, error }
        }
    }

    static async getLeads(filters: {
        status?: string[]
        source?: string[]
        assigned_to?: string
        priority?: string[]
        search?: string
        limit?: number
        offset?: number
    } = {}) {
        try {
            let query = supabase
                .from('crm_clients')
                .select(`
                    *,
                    assigned_user:profiles!crm_clients_assigned_to_fkey(full_name, email)
                `)
                .eq('status', 'lead') // Only get leads, not clients
                .order('created_at', { ascending: false })

            if (filters.priority?.length) {
                query = query.in('priority', filters.priority)
            }

            if (filters.source?.length) {
                query = query.in('source', filters.source)
            }

            if (filters.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
            }

            if (filters.limit) {
                query = query.limit(filters.limit)
            }

            if (filters.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
            }

            const { data, error } = await query

            if (error) throw error
            
            // Transform crm_clients data to Lead format
            const leads = data?.map(client => ({
                ...client,
                status: client.custom_fields?.lead_status || 'new',
                property_type: client.custom_fields?.property_type,
                property_purpose: client.custom_fields?.property_purpose,
                location_preference: client.custom_fields?.location_preference
            })) || []

            return { leads, error: null }
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
            return { leads: [], error }
        }
    }

    static async getLeadById(leadId: string) {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .select(`
                    *,
                    assigned_user:profiles!crm_clients_assigned_to_fkey(full_name, email, phone)
                `)
                .eq('id', leadId)
                .single()

            if (error) throw error
            
            // Transform to Lead format
            const lead = {
                ...data,
                status: data.custom_fields?.lead_status || 'new',
                property_type: data.custom_fields?.property_type,
                property_purpose: data.custom_fields?.property_purpose,
                location_preference: data.custom_fields?.location_preference
            }

            return { lead, error: null }
        } catch (error) {
            console.error('Erro ao buscar lead:', error)
            return { lead: null, error }
        }
    }

    // ==================== ATIVIDADES ====================

    static async createActivity(activityData: Partial<LeadActivity>) {
        try {
            const { data: user } = await supabase.auth.getUser()
            
            // Store activities in tasks table with lead reference
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    title: activityData.title,
                    description: activityData.description,
                    type: activityData.type || 'other',
                    status: activityData.completed_at ? 'completed' : 'pending',
                    client_id: activityData.lead_id, // Reference to crm_clients (lead)
                    assigned_to: user.user?.id,
                    created_by: user.user?.id,
                    due_date: activityData.scheduled_for,
                    completed_at: activityData.completed_at,
                    custom_fields: {
                        activity_type: activityData.type,
                        outcome: activityData.outcome,
                        metadata: activityData.metadata,
                        is_lead_activity: true
                    }
                }])
                .select()
                .single()

            if (error) throw error
            return { activity: data, error: null }
        } catch (error) {
            console.error('Erro ao criar atividade:', error)
            return { activity: null, error }
        }
    }

    static async getLeadActivities(leadId: string) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    created_user:profiles!tasks_created_by_fkey(full_name)
                `)
                .eq('client_id', leadId)
                .eq('custom_fields->is_lead_activity', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            
            // Transform to LeadActivity format
            const activities = data?.map(task => ({
                id: task.id,
                lead_id: leadId,
                type: task.custom_fields?.activity_type || task.type,
                title: task.title,
                description: task.description,
                outcome: task.custom_fields?.outcome,
                scheduled_for: task.due_date,
                completed_at: task.completed_at,
                created_by: task.created_by,
                created_at: task.created_at,
                metadata: task.custom_fields?.metadata,
                created_user: task.created_user
            })) || []

            return { activities, error: null }
        } catch (error) {
            console.error('Erro ao buscar atividades:', error)
            return { activities: [], error }
        }
    }

    // ==================== ESTATÍSTICAS ====================

    static async getLeadStats(userId?: string) {
        try {
            const { leads } = await this.getLeads({ assigned_to: userId })
            
            const stats = {
                total: leads.length,
                new: leads.filter(l => l.status === 'new').length,
                contacted: leads.filter(l => l.status === 'contacted').length,
                qualified: leads.filter(l => l.status === 'qualified').length,
                hot: leads.filter(l => l.priority === 'high' || l.priority === 'urgent').length,
                thisWeek: leads.filter(l => {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return new Date(l.created_at) > weekAgo
                }).length,
                needingFollowup: leads.filter(l => {
                    if (!l.next_followup) return false
                    return new Date(l.next_followup) <= new Date()
                }).length
            }

            return { stats, error: null }
        } catch (error) {
            console.error('Erro ao calcular estatísticas:', error)
            return { stats: null, error }
        }
    }

    // ==================== FOLLOW-UP ====================

    static async scheduleFollowup(leadId: string, followupDate: string, note?: string) {
        try {
            await this.updateLead(leadId, { next_followup: followupDate })
            
            // Create follow-up task
            await this.createActivity({
                lead_id: leadId,
                type: 'note',
                title: 'Follow-up agendado',
                description: note || `Follow-up agendado para ${new Date(followupDate).toLocaleDateString('pt-BR')}`,
                scheduled_for: followupDate
            })

            return { success: true, error: null }
        } catch (error) {
            console.error('Erro ao agendar follow-up:', error)
            return { success: false, error }
        }
    }
}
