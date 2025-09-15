import { supabase } from '@/lib/supabase'

export interface Lead {
    id: string
    name: string
    email?: string | null
    phone?: string
    source: string
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    budget_min?: number
    budget_max?: number
    property_type?: string
    interest_type?: string
    preferred_location?: string
    notes?: string | null
    created_at: string
    updated_at: string
}

export class LeadsService {
    // Demo mode fallback
    private static isDemo = process.env.NODE_ENV === 'development'
    
    private static demoLeads: Lead[] = [
        {
            id: '1',
            name: 'Maria Silva',
            email: 'maria@email.com',
            phone: '(11) 99999-1111',
            source: 'website',
            status: 'new',
            priority: 'high',
            budget_min: 300000,
            budget_max: 500000,
            property_type: 'Casa',
            interest_type: 'buy',
            preferred_location: 'Guararema, Centro',
            notes: 'Interessada em casa no centro',
            created_at: new Date('2024-01-15').toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '2',
            name: 'João Santos',
            email: 'joao@email.com',
            phone: '(11) 88888-2222',
            source: 'facebook',
            status: 'contacted',
            priority: 'medium',
            budget_min: 250000,
            budget_max: 400000,
            property_type: 'Apartamento',
            interest_type: 'sell',
            preferred_location: 'Guararema, Jardim São João',
            notes: 'Quer vender apartamento',
            created_at: new Date('2024-01-10').toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Ana Costa',
            email: 'ana@email.com',
            phone: '(11) 77777-3333',
            source: 'referral',
            status: 'qualified',
            priority: 'high',
            budget_min: 400000,
            budget_max: 600000,
            property_type: 'Casa',
            interest_type: 'rent_as_tenant',
            preferred_location: 'Guararema, Centro',
            notes: 'Família grande procura casa',
            created_at: new Date('2024-01-05').toISOString(),
            updated_at: new Date().toISOString()
        }
    ]

    private static getDemoLeads(): Lead[] {
        const stored = localStorage.getItem('demo_leads')
        return stored ? JSON.parse(stored) : this.demoLeads
    }

    static async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<{
        lead?: Lead;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const newLead: Lead = {
                    ...leadData,
                    id: Date.now().toString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }

                const existingLeads = this.getDemoLeads()
                const updatedLeads = [...existingLeads, newLead]
                localStorage.setItem('demo_leads', JSON.stringify(updatedLeads))

                return { lead: newLead }
            } else {
                // Production mode - use Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .insert([leadData])
                    .select()
                    .single()
                
                if (error) throw error
                return { lead: data }
            }
        } catch (error) {
            console.error('Error creating lead:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao criar lead' 
                } 
            }
        }
    }

    static async getLeads(): Promise<{ leads: Lead[]; error?: { message: string } }> {
        try {
            if (this.isDemo) {
                return { leads: this.getDemoLeads() }
            } else {
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false })
                
                if (error) throw error
                return { leads: data || [] }
            }
        } catch (error) {
            console.error('Error fetching leads:', error)
            // Fallback to demo data
            return { leads: this.getDemoLeads() }
        }
    }

    static async getLeadStats(): Promise<{
        stats?: {
            total: number;
            newLeads: number;
            qualified: number;
            converted: number;
            conversionRate: number;
        };
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                const leads = this.getDemoLeads()
                const newLeads = leads.filter(l => l.status === 'new').length
                const qualified = leads.filter(l => l.status === 'qualified').length
                const converted = leads.filter(l => l.status === 'won').length
                const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0

                return {
                    stats: {
                        total: leads.length,
                        newLeads,
                        qualified,
                        converted,
                        conversionRate: Math.round(conversionRate * 100) / 100
                    }
                }
            } else {
                const { data, error } = await supabase
                    .from('leads')
                    .select('status')
                
                if (error) throw error
                
                const leads = data || []
                const newLeads = leads.filter(l => l.status === 'new').length
                const qualified = leads.filter(l => l.status === 'qualified').length
                const converted = leads.filter(l => l.status === 'won').length
                const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0

                return {
                    stats: {
                        total: leads.length,
                        newLeads,
                        qualified,
                        converted,
                        conversionRate: Math.round(conversionRate * 100) / 100
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching lead stats:', error)
            // Fallback to demo stats
            const leads = this.getDemoLeads()
            const newLeads = leads.filter(l => l.status === 'new').length
            const qualified = leads.filter(l => l.status === 'qualified').length
            const converted = leads.filter(l => l.status === 'won').length
            const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0

            return {
                stats: {
                    total: leads.length,
                    newLeads,
                    qualified,
                    converted,
                    conversionRate: Math.round(conversionRate * 100) / 100
                }
            }
        }
    }

    static async updateLead(id: string, leadData: Partial<Lead>): Promise<{
        lead?: Lead;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                const existingLeads = this.getDemoLeads()
                const updatedLeads = existingLeads.map(lead => 
                    lead.id === id 
                        ? { ...lead, ...leadData, updated_at: new Date().toISOString() }
                        : lead
                )
                localStorage.setItem('demo_leads', JSON.stringify(updatedLeads))
                const updatedLead = updatedLeads.find(lead => lead.id === id)
                return { lead: updatedLead }
            } else {
                const { data, error } = await supabase
                    .from('leads')
                    .update(leadData)
                    .eq('id', id)
                    .select()
                    .single()
                
                if (error) throw error
                return { lead: data }
            }
        } catch (error) {
            console.error('Error updating lead:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar lead' 
                } 
            }
        }
    }

    static async deleteLead(id: string): Promise<{ error?: { message: string } }> {
        try {
            if (this.isDemo) {
                const existingLeads = this.getDemoLeads()
                const updatedLeads = existingLeads.filter(lead => lead.id !== id)
                localStorage.setItem('demo_leads', JSON.stringify(updatedLeads))
                return {}
            } else {
                const { error } = await supabase
                    .from('leads')
                    .delete()
                    .eq('id', id)
                
                if (error) throw error
                return {}
            }
        } catch (error) {
            console.error('Error deleting lead:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao deletar lead' 
                } 
            }
        }
    }
}