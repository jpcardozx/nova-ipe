import { supabase } from '@/lib/supabase'

// Interfaces principais
export interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    source: 'website' | 'facebook' | 'google' | 'referral' | 'walk-in' | 'phone'
    status: 'new' | 'contacted' | 'qualified' | 'viewing' | 'proposal' | 'negotiating' | 'closed' | 'lost'
    interest: 'buy' | 'sell' | 'rent-tenant' | 'rent-owner'
    budget_min?: number
    budget_max?: number
    property_preferences?: any
    assigned_to?: string
    priority: 'low' | 'medium' | 'high'
    score: number
    last_contact?: string
    next_follow_up?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface Document {
    id: string
    title: string
    description?: string
    file_name?: string
    file_size?: number
    file_type?: string
    file_path?: string
    status: 'draft' | 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'archived'
    version: number
    requires_signature: boolean
    lead_id?: string
    property_id?: string
    contract_id?: string
    document_type_id?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface DocumentTask {
    id: string
    document_id: string
    title: string
    description?: string
    task_type: 'review' | 'approve' | 'sign' | 'collect' | 'send' | 'update'
    assigned_to?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    due_date?: string
    completed_at?: string
    created_by: string
    created_at: string
}

export interface LeadActivity {
    id: string
    lead_id: string
    activity_type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'viewing' | 'document' | 'task'
    subject: string
    description?: string
    outcome?: string
    activity_date: string
    created_by: string
    created_at: string
}

export class CRMService {
    // ==================== LEADS ====================
    
    static async createLead(leadData: Partial<Lead>) {
        try {
            const { data, error } = await supabase
                .from('leads')
                .insert([{
                    ...leadData,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                }])
                .select()
                .single()

            if (error) throw error
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
                    ...updates,
                    updated_at: new Date().toISOString()
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
                .from('leads')
                .select(`
                    *,
                    assigned_user:users!leads_assigned_to_fkey(name, email),
                    activities_count:lead_activities(count),
                    tasks_count:lead_tasks(count),
                    documents_count:documents(count)
                `)
                .order('created_at', { ascending: false })

            if (filters.status?.length) {
                query = query.in('status', filters.status)
            }

            if (filters.source?.length) {
                query = query.in('source', filters.source)
            }

            if (filters.assigned_to) {
                query = query.eq('assigned_to', filters.assigned_to)
            }

            if (filters.priority?.length) {
                query = query.in('priority', filters.priority)
            }

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
            }

            if (filters.limit) {
                query = query.limit(filters.limit)
            }

            if (filters.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
            }

            const { data, error } = await query

            if (error) throw error
            return { leads: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
            return { leads: [], error }
        }
    }

    static async getLeadById(leadId: string) {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    *,
                    assigned_user:users!leads_assigned_to_fkey(name, email),
                    activities:lead_activities(*),
                    tasks:lead_tasks(*),
                    notes:lead_notes(*),
                    documents:documents(*)
                `)
                .eq('id', leadId)
                .single()

            if (error) throw error
            return { lead: data, error: null }
        } catch (error) {
            console.error('Erro ao buscar lead:', error)
            return { lead: null, error }
        }
    }

    static async getLeadsNeedingFollowUp() {
        try {
            const { data, error } = await supabase
                .rpc('get_leads_needing_followup', { days_threshold: 3 })

            if (error) throw error
            return { leads: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar leads para follow-up:', error)
            return { leads: [], error }
        }
    }

    // ==================== ATIVIDADES ====================

    static async createActivity(activityData: Partial<LeadActivity>) {
        try {
            const { data, error } = await supabase
                .from('lead_activities')
                .insert([{
                    ...activityData,
                    created_by: (await supabase.auth.getUser()).data.user?.id,
                    activity_date: activityData.activity_date || new Date().toISOString()
                }])
                .select()
                .single()

            if (error) throw error

            // Atualiza last_contact do lead
            if (activityData.lead_id) {
                await supabase
                    .from('leads')
                    .update({ last_contact: new Date().toISOString() })
                    .eq('id', activityData.lead_id)
            }

            return { activity: data, error: null }
        } catch (error) {
            console.error('Erro ao criar atividade:', error)
            return { activity: null, error }
        }
    }

    static async getLeadActivities(leadId: string) {
        try {
            const { data, error } = await supabase
                .from('lead_activities')
                .select(`
                    *,
                    created_user:users!lead_activities_created_by_fkey(name)
                `)
                .eq('lead_id', leadId)
                .order('activity_date', { ascending: false })

            if (error) throw error
            return { activities: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar atividades:', error)
            return { activities: [], error }
        }
    }

    // ==================== TAREFAS ====================

    static async createTask(taskData: Partial<DocumentTask>) {
        try {
            const { data, error } = await supabase
                .from('lead_tasks')
                .insert([{
                    ...taskData,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                }])
                .select()
                .single()

            if (error) throw error
            return { task: data, error: null }
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            return { task: null, error }
        }
    }

    static async updateTaskStatus(taskId: string, status: string, completionNotes?: string) {
        try {
            const updates: any = { 
                status,
                updated_at: new Date().toISOString()
            }

            if (status === 'completed') {
                updates.completed_at = new Date().toISOString()
                if (completionNotes) {
                    updates.completion_notes = completionNotes
                }
            }

            const { data, error } = await supabase
                .from('lead_tasks')
                .update(updates)
                .eq('id', taskId)
                .select()
                .single()

            if (error) throw error
            return { task: data, error: null }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error)
            return { task: null, error }
        }
    }

    static async getUserTasks(userId?: string, status?: string[]) {
        try {
            let query = supabase
                .from('lead_tasks')
                .select(`
                    *,
                    lead:leads(name, status),
                    assigned_user:users!lead_tasks_assigned_to_fkey(name)
                `)
                .order('due_date', { ascending: true })

            if (userId) {
                query = query.eq('assigned_to', userId)
            }

            if (status?.length) {
                query = query.in('status', status)
            }

            const { data, error } = await query

            if (error) throw error
            return { tasks: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error)
            return { tasks: [], error }
        }
    }

    // ==================== DOCUMENTOS ====================

    static async createDocument(documentData: Partial<Document>) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .insert([{
                    ...documentData,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                }])
                .select()
                .single()

            if (error) throw error

            // Criar atividade relacionada se for para um lead
            if (documentData.lead_id) {
                await this.createActivity({
                    lead_id: documentData.lead_id,
                    activity_type: 'document',
                    subject: 'Documento adicionado',
                    description: `Documento "${documentData.title}" foi adicionado`
                })
            }

            return { document: data, error: null }
        } catch (error) {
            console.error('Erro ao criar documento:', error)
            return { document: null, error }
        }
    }

    static async getDocuments(filters: {
        lead_id?: string
        property_id?: string
        contract_id?: string
        status?: string[]
        document_type_id?: string
        search?: string
    } = {}) {
        try {
            let query = supabase
                .from('documents')
                .select(`
                    *,
                    document_type:document_types(name, category),
                    pending_tasks:document_tasks!inner(count),
                    comments_count:document_comments(count)
                `)
                .is('deleted_at', null)
                .eq('is_latest_version', true)
                .order('created_at', { ascending: false })

            if (filters.lead_id) {
                query = query.eq('lead_id', filters.lead_id)
            }

            if (filters.property_id) {
                query = query.eq('property_id', filters.property_id)
            }

            if (filters.contract_id) {
                query = query.eq('contract_id', filters.contract_id)
            }

            if (filters.status?.length) {
                query = query.in('status', filters.status)
            }

            if (filters.document_type_id) {
                query = query.eq('document_type_id', filters.document_type_id)
            }

            if (filters.search) {
                query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,file_name.ilike.%${filters.search}%`)
            }

            const { data, error } = await query

            if (error) throw error
            return { documents: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar documentos:', error)
            return { documents: [], error }
        }
    }

    static async updateDocumentStatus(documentId: string, status: string) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .update({ 
                    status,
                    updated_by: (await supabase.auth.getUser()).data.user?.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId)
                .select()
                .single()

            if (error) throw error
            return { document: data, error: null }
        } catch (error) {
            console.error('Erro ao atualizar documento:', error)
            return { document: null, error }
        }
    }

    // ==================== ESTATÍSTICAS ====================

    static async getDashboardStats(userId?: string) {
        try {
            const [
                leadsResult,
                tasksResult,
                documentsResult,
                activitiesResult
            ] = await Promise.all([
                this.getLeads({ assigned_to: userId }),
                this.getUserTasks(userId, ['pending', 'in_progress']),
                this.getDocuments({}),
                supabase
                    .from('lead_activities')
                    .select('count')
                    .gte('activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
                    .single()
            ])

            const leads = leadsResult.leads || []
            const tasks = tasksResult.tasks || []
            const documents = documentsResult.documents || []

            const stats = {
                leads: {
                    total: leads.length,
                    new: leads.filter(l => l.status === 'new').length,
                    qualified: leads.filter(l => l.status === 'qualified').length,
                    hot: leads.filter(l => l.priority === 'high').length,
                    needingFollowUp: leads.filter(l => 
                        l.next_follow_up && new Date(l.next_follow_up) <= new Date()
                    ).length
                },
                tasks: {
                    total: tasks.length,
                    pending: tasks.filter(t => t.status === 'pending').length,
                    overdue: tasks.filter(t => 
                        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
                    ).length,
                    high_priority: tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length
                },
                documents: {
                    total: documents.length,
                    pending_review: documents.filter(d => d.status === 'pending_review').length,
                    requiring_signature: documents.filter(d => d.requires_signature).length,
                    expiring_soon: documents.filter(d => 
                        d.expiry_date && new Date(d.expiry_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length
                },
                activities: {
                    this_week: activitiesResult.data?.count || 0
                }
            }

            return { stats, error: null }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            return { stats: null, error }
        }
    }

    // ==================== UTILS ====================

    static async uploadFile(file: File, bucket: string = 'documents') {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
            const filePath = `${bucket}/${fileName}`

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (error) throw error

            return { path: data.path, error: null }
        } catch (error) {
            console.error('Erro no upload:', error)
            return { path: null, error }
        }
    }

    static async downloadFile(filePath: string, bucket: string = 'documents') {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .download(filePath)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Erro no download:', error)
            return { data: null, error }
        }
    }

    static getFileUrl(filePath: string, bucket: string = 'documents') {
        try {
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            return data.publicUrl
        } catch (error) {
            console.error('Erro ao obter URL:', error)
            return null
        }
    }
}
