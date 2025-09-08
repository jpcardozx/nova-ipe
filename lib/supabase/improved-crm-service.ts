// Sistema integrado de CRM melhorado com integração de documentos e pendências
import { supabase } from '@/lib/supabase'
import { DocumentManagementService, Document } from './document-service'

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
    created_at: string
    updated_at: string
    created_by: string

    // Campos calculados
    missing_documents?: number
    pending_tasks?: number
    last_activity?: string
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

export interface LeadTask {
    id: string
    lead_id: string
    title: string
    description?: string
    task_type: 'call' | 'email' | 'meeting' | 'document' | 'follow-up'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    assigned_to?: string
    due_date?: string
    completed_at?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface LeadNote {
    id: string
    lead_id: string
    content: string
    is_important: boolean
    created_by: string
    created_at: string
}

export class ImprovedCRMService {
    
    /**
     * Cria novo lead com tarefas e documentos automáticos
     */
    static async createLead(leadData: Partial<Lead>): Promise<Lead | null> {
        try {
            const score = this.calculateLeadScore(leadData)
            
            const { data, error } = await supabase
                .from('leads')
                .insert({
                    ...leadData,
                    score,
                    priority: this.calculatePriority(score, leadData.source),
                    status: 'new'
                })
                .select()
                .single()

            if (error) throw error

            // Cria tarefas automáticas
            await this.createInitialTasks(data.id, data.created_by)

            // Registra atividade inicial
            await this.addActivity(data.id, data.created_by, 'lead_created', 'Lead criado no sistema', {
                source: leadData.source,
                interest: leadData.interest
            })

            return data
        } catch (error) {
            console.error('Erro ao criar lead:', error)
            return null
        }
    }

    /**
     * Calcula pontuação do lead
     */
    static calculateLeadScore(lead: Partial<Lead>): number {
        let score = 0

        // Pontuação por fonte
        const sourceScores = {
            'referral': 30,
            'website': 25,
            'walk-in': 20,
            'google': 15,
            'facebook': 10,
            'phone': 15
        }
        score += sourceScores[lead.source!] || 0

        // Pontuação por orçamento
        if (lead.budget_min && lead.budget_max) {
            if (lead.budget_min > 500000) score += 25
            else if (lead.budget_min > 300000) score += 15
            else score += 10
        }

        // Pontuação por interesse
        if (lead.interest === 'sell') score += 25
        else if (lead.interest === 'buy') score += 20
        else score += 10

        // Pontuação por dados completos
        if (lead.phone) score += 10
        if (lead.email) score += 10
        if (lead.property_preferences) score += 5

        return Math.min(score, 100)
    }

    /**
     * Calcula prioridade baseado na pontuação
     */
    static calculatePriority(score: number, source?: string): Lead['priority'] {
        if (score >= 80 || source === 'referral') return 'high'
        if (score >= 60) return 'medium'
        return 'low'
    }

    /**
     * Busca leads com filtros avançados
     */
    static async getLeads(filters: {
        status?: string[]
        source?: string[]
        assigned_to?: string
        priority?: string[]
        search?: string
        date_range?: { start: string, end: string }
        page?: number
        limit?: number
    } = {}): Promise<{ leads: Lead[], total: number }> {
        try {
            let query = supabase
                .from('leads')
                .select(`
                    *,
                    activities:lead_activities(activity_date),
                    tasks:lead_tasks(status),
                    documents:documents(status)
                `, { count: 'exact' })
                .order('created_at', { ascending: false })

            // Aplicar filtros
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

            if (filters.date_range) {
                query = query
                    .gte('created_at', filters.date_range.start)
                    .lte('created_at', filters.date_range.end)
            }

            // Paginação
            const page = filters.page || 1
            const limit = filters.limit || 20
            const offset = (page - 1) * limit
            query = query.range(offset, offset + limit - 1)

            const { data, error, count } = await query

            if (error) throw error

            // Enriquecer dados
            const enrichedLeads = (data || []).map(lead => ({
                ...lead,
                missing_documents: this.countMissingDocuments(lead.documents),
                pending_tasks: this.countPendingTasks(lead.tasks),
                last_activity: this.getLastActivity(lead.activities)
            }))

            return {
                leads: enrichedLeads,
                total: count || 0
            }
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
            return { leads: [], total: 0 }
        }
    }

    /**
     * Busca lead por ID com dados completos
     */
    static async getLead(leadId: string): Promise<Lead | null> {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    *,
                    activities:lead_activities(*),
                    tasks:lead_tasks(*),
                    notes:lead_notes(*),
                    documents:documents(*)
                `)
                .eq('id', leadId)
                .single()

            if (error) throw error

            // Buscar documentos faltantes
            const missingDocs = await DocumentManagementService.getMissingDocuments(leadId)

            return {
                ...data,
                missing_documents: missingDocs.length,
                pending_tasks: this.countPendingTasks(data.tasks),
                last_activity: this.getLastActivity(data.activities)
            }
        } catch (error) {
            console.error('Erro ao buscar lead:', error)
            return null
        }
    }

    /**
     * Atualiza status do lead com automações
     */
    static async updateLeadStatus(
        leadId: string,
        newStatus: Lead['status'],
        userId: string,
        note?: string
    ): Promise<boolean> {
        try {
            // Atualiza o lead
            const { error } = await supabase
                .from('leads')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString(),
                    last_contact: new Date().toISOString()
                })
                .eq('id', leadId)

            if (error) throw error

            // Registra atividade
            await this.addActivity(leadId, userId, 'status_change', `Status alterado para: ${newStatus}`, {
                previous_status: 'unknown',
                new_status: newStatus,
                note
            })

            // Cria tarefas automáticas baseado no novo status
            await this.createStatusTasks(leadId, newStatus, userId)

            // Adiciona nota se fornecida
            if (note) {
                await this.addNote(leadId, userId, note, false)
            }

            return true
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            return false
        }
    }

    /**
     * Adiciona atividade ao lead
     */
    static async addActivity(
        leadId: string,
        userId: string,
        activityType: LeadActivity['activity_type'],
        subject: string,
        additionalData?: any
    ): Promise<LeadActivity | null> {
        try {
            const { data, error } = await supabase
                .from('lead_activities')
                .insert({
                    lead_id: leadId,
                    activity_type: activityType,
                    subject,
                    description: additionalData?.description,
                    outcome: additionalData?.outcome,
                    activity_date: new Date().toISOString(),
                    created_by: userId
                })
                .select()
                .single()

            if (error) throw error

            // Atualiza última data de contato
            await supabase
                .from('leads')
                .update({ last_contact: new Date().toISOString() })
                .eq('id', leadId)

            return data
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error)
            return null
        }
    }

    /**
     * Cria tarefa para o lead
     */
    static async createTask(taskData: Partial<LeadTask>): Promise<LeadTask | null> {
        try {
            const { data, error } = await supabase
                .from('lead_tasks')
                .insert(taskData)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            return null
        }
    }

    /**
     * Adiciona nota ao lead
     */
    static async addNote(
        leadId: string,
        userId: string,
        content: string,
        isImportant: boolean = false
    ): Promise<LeadNote | null> {
        try {
            const { data, error } = await supabase
                .from('lead_notes')
                .insert({
                    lead_id: leadId,
                    content,
                    is_important: isImportant,
                    created_by: userId
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Erro ao adicionar nota:', error)
            return null
        }
    }

    /**
     * Busca leads que precisam de follow-up
     */
    static async getLeadsNeedingFollowUp(): Promise<Lead[]> {
        try {
            const threeDaysAgo = new Date()
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .not('status', 'in', ['closed', 'lost'])
                .or(`last_contact.is.null,last_contact.lt.${threeDaysAgo.toISOString()}`)
                .order('score', { ascending: false })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Erro ao buscar leads para follow-up:', error)
            return []
        }
    }

    /**
     * Busca tarefas pendentes do usuário
     */
    static async getUserTasks(userId: string): Promise<LeadTask[]> {
        try {
            const { data, error } = await supabase
                .from('lead_tasks')
                .select(`
                    *,
                    lead:leads(name, phone, status)
                `)
                .eq('assigned_to', userId)
                .in('status', ['pending', 'in_progress'])
                .order('due_date', { ascending: true, nullsLast: true })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Erro ao buscar tarefas do usuário:', error)
            return []
        }
    }

    /**
     * Estatísticas do pipeline
     */
    static async getPipelineStats(userId?: string): Promise<{
        total: number
        by_status: Record<string, number>
        by_source: Record<string, number>
        conversion_rate: number
        avg_score: number
        hot_leads: number
        tasks_pending: number
        follow_up_needed: number
    }> {
        try {
            let query = supabase.from('leads').select('*')
            
            if (userId) {
                query = query.eq('assigned_to', userId)
            }

            const { data: leads } = await query

            if (!leads) return this.getEmptyStats()

            const total = leads.length
            const by_status = this.groupBy(leads, 'status')
            const by_source = this.groupBy(leads, 'source')
            
            const closed = by_status.closed || 0
            const conversion_rate = total > 0 ? (closed / total) * 100 : 0
            
            const avg_score = total > 0 
                ? leads.reduce((sum, lead) => sum + lead.score, 0) / total 
                : 0

            const hot_leads = leads.filter(lead => lead.score >= 80).length

            // Buscar tarefas pendentes
            let taskQuery = supabase
                .from('lead_tasks')
                .select('*', { count: 'exact', head: true })
                .in('status', ['pending', 'in_progress'])

            if (userId) {
                taskQuery = taskQuery.eq('assigned_to', userId)
            }

            const { count: tasks_pending } = await taskQuery

            // Leads precisando follow-up
            const followUpLeads = await this.getLeadsNeedingFollowUp()
            const follow_up_needed = userId 
                ? followUpLeads.filter(lead => lead.assigned_to === userId).length
                : followUpLeads.length

            return {
                total,
                by_status,
                by_source,
                conversion_rate: Math.round(conversion_rate * 100) / 100,
                avg_score: Math.round(avg_score * 100) / 100,
                hot_leads,
                tasks_pending: tasks_pending || 0,
                follow_up_needed
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            return this.getEmptyStats()
        }
    }

    /**
     * Cria tarefas iniciais para novo lead
     */
    private static async createInitialTasks(leadId: string, userId: string): Promise<void> {
        const tasks = [
            {
                lead_id: leadId,
                title: 'Primeiro contato',
                description: 'Fazer contato inicial com o lead',
                task_type: 'call',
                priority: 'high',
                assigned_to: userId,
                created_by: userId,
                due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
            },
            {
                lead_id: leadId,
                title: 'Qualificar interesse',
                description: 'Entender necessidades e orçamento do cliente',
                task_type: 'follow-up',
                priority: 'medium',
                assigned_to: userId,
                created_by: userId,
                due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48h
            }
        ]

        for (const task of tasks) {
            await this.createTask(task)
        }
    }

    /**
     * Cria tarefas baseado no status
     */
    private static async createStatusTasks(leadId: string, status: Lead['status'], userId: string): Promise<void> {
        const tasksByStatus: Record<string, Partial<LeadTask>[]> = {
            qualified: [
                {
                    title: 'Enviar opções de imóveis',
                    description: 'Selecionar e enviar imóveis compatíveis',
                    task_type: 'follow-up',
                    priority: 'high'
                }
            ],
            viewing: [
                {
                    title: 'Follow-up pós-visita',
                    description: 'Contactar cliente após visita para feedback',
                    task_type: 'call',
                    priority: 'high',
                    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            proposal: [
                {
                    title: 'Acompanhar proposta',
                    description: 'Verificar status da proposta com o cliente',
                    task_type: 'follow-up',
                    priority: 'high',
                    due_date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
                }
            ]
        }

        const tasks = tasksByStatus[status] || []
        
        for (const taskData of tasks) {
            await this.createTask({
                ...taskData,
                lead_id: leadId,
                assigned_to: userId,
                created_by: userId
            })
        }
    }

    // Métodos auxiliares
    private static countMissingDocuments(documents: any[]): number {
        // Implementar lógica para contar documentos faltantes
        return 0
    }

    private static countPendingTasks(tasks: any[]): number {
        return tasks?.filter(task => ['pending', 'in_progress'].includes(task.status)).length || 0
    }

    private static getLastActivity(activities: any[]): string | undefined {
        const latest = activities?.sort((a, b) => 
            new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()
        )[0]
        return latest?.activity_date
    }

    private static groupBy(array: any[], key: string): Record<string, number> {
        return array.reduce((acc, item) => {
            const group = item[key] || 'undefined'
            acc[group] = (acc[group] || 0) + 1
            return acc
        }, {})
    }

    private static getEmptyStats() {
        return {
            total: 0,
            by_status: {},
            by_source: {},
            conversion_rate: 0,
            avg_score: 0,
            hot_leads: 0,
            tasks_pending: 0,
            follow_up_needed: 0
        }
    }
}
