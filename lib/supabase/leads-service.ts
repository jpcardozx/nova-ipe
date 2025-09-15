import { supabase } from '@/lib/supabase'

export interface Lead {
    id: string
    name: string
    email?: string | null
    phone?: string
    source: 'website' | 'facebook' | 'instagram' | 'whatsapp' | 'referral' | 'phone' | 'email' | 'walk_in' | 'other'
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    budget_min?: number
    budget_max?: number
    property_type?: string
    interest_type?: 'buy' | 'sell' | 'rent_as_tenant' | 'rent_as_owner'
    preferred_location?: string
    notes?: string | null
    follow_up_date?: string | null
    score?: number
    user_id: string
    tags?: string[]
    company?: string
    occupation?: string
    family_size?: number
    urgency_level?: 'low' | 'medium' | 'high' | 'urgent'
    created_at: string
    updated_at: string
}

export class LeadsService {
    // Demo mode fallback - in a real implementation, this would connect to Supabase
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
            score: 85,
            follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            user_id: 'current-user-id',
            tags: ['Primeira compra', 'Financiamento'],
            company: 'Tech Corp',
            occupation: 'Desenvolvedora',
            family_size: 3,
            urgency_level: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '2',
            name: 'João Santos',
            email: 'joao@email.com',
            phone: '(11) 99999-2222',
            source: 'facebook',
            status: 'contacted',
            priority: 'medium',
            budget_min: 200000,
            budget_max: 350000,
            property_type: 'Apartamento',
            interest_type: 'sell',
            preferred_location: 'Guararema, Jardins',
            notes: 'Quer vender apartamento',
            score: 65,
            follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            user_id: 'current-user-id',
            tags: ['Venda rápida'],
            company: 'Autopeças Silva',
            occupation: 'Empresário',
            family_size: 2,
            urgency_level: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Ana Costa',
            email: 'ana@email.com',
            phone: '(11) 99999-3333',
            source: 'referral',
            status: 'qualified',
            priority: 'urgent',
            budget_min: 150000,
            budget_max: 250000,
            property_type: 'Casa',
            interest_type: 'rent_as_tenant',
            preferred_location: 'Guararema, qualquer bairro',
            notes: 'Precisa urgente de casa para família',
            score: 95,
            follow_up_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            user_id: 'current-user-id',
            tags: ['Urgente', 'Família grande'],
            company: 'Escola Municipal',
            occupation: 'Professora',
            family_size: 5,
            urgency_level: 'urgent',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ]

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
                // Production mode - would use Supabase
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

    static async updateLead(id: string, leadData: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>): Promise<{
        lead?: Lead;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const existingLeads = this.getDemoLeads()
                const leadIndex = existingLeads.findIndex(lead => lead.id === id)
                
                if (leadIndex === -1) {
                    throw new Error('Lead não encontrado')
                }

                const updatedLead: Lead = {
                    ...existingLeads[leadIndex],
                    ...leadData,
                    updated_at: new Date().toISOString()
                }

                existingLeads[leadIndex] = updatedLead
                localStorage.setItem('demo_leads', JSON.stringify(existingLeads))

                return { lead: updatedLead }
            } else {
                // Production mode - would use Supabase
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

    static async deleteLead(id: string): Promise<{
        success?: boolean;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const existingLeads = this.getDemoLeads()
                const filteredLeads = existingLeads.filter(lead => lead.id !== id)
                
                if (filteredLeads.length === existingLeads.length) {
                    throw new Error('Lead não encontrado')
                }

                localStorage.setItem('demo_leads', JSON.stringify(filteredLeads))
                return { success: true }
            } else {
                // Production mode - would use Supabase
                const { error } = await supabase
                    .from('leads')
                    .delete()
                    .eq('id', id)
                
                if (error) throw error
                return { success: true }
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

    static async getLeads(): Promise<{
        leads?: Lead[];
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - get from localStorage or use default demo data
                const leads = this.getDemoLeads()
                return { leads }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false })
                
                if (error) throw error
                return { leads: data }
            }
        } catch (error) {
            console.error('Error getting leads:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar leads' 
                } 
            }
        }
    }

    static async getLeadById(id: string): Promise<{
        lead?: Lead;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - get from localStorage or use default demo data
                const leads = this.getDemoLeads()
                const lead = leads.find(l => l.id === id)
                
                if (!lead) {
                    throw new Error('Lead não encontrado')
                }

                return { lead }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('id', id)
                    .single()
                
                if (error) throw error
                return { lead: data }
            }
        } catch (error) {
            console.error('Error getting lead by id:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar lead' 
                } 
            }
        }
    }

    private static getDemoLeads(): Lead[] {
        if (typeof window === 'undefined') return this.demoLeads
        
        try {
            const stored = localStorage.getItem('demo_leads')
            if (stored) {
                return JSON.parse(stored)
            }
        } catch (error) {
            console.warn('Error reading leads from localStorage:', error)
        }
        
        // Initialize localStorage with demo data
        localStorage.setItem('demo_leads', JSON.stringify(this.demoLeads))
        return this.demoLeads
    }

    // Statistics and analytics methods
    static async getLeadStats(): Promise<{
        stats?: {
            total: number;
            new: number;
            contacted: number;
            qualified: number;
            won: number;
            lost: number;
            conversionRate: number;
            averageScore: number;
        };
        error?: { message: string };
    }> {
        try {
            const { leads, error } = await this.getLeads()
            
            if (error || !leads) {
                throw new Error(error?.message || 'Erro ao buscar leads para estatísticas')
            }

            const total = leads.length
            const new_leads = leads.filter(l => l.status === 'new').length
            const contacted = leads.filter(l => l.status === 'contacted').length
            const qualified = leads.filter(l => l.status === 'qualified').length
            const won = leads.filter(l => l.status === 'won').length
            const lost = leads.filter(l => l.status === 'lost').length
            const conversionRate = total > 0 ? (won / total) * 100 : 0
            const averageScore = total > 0 ? leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / total : 0

            return {
                stats: {
                    total,
                    new: new_leads,
                    contacted,
                    qualified,
                    won,
                    lost,
                    conversionRate,
                    averageScore
                }
            }
        } catch (error) {
            console.error('Error getting lead stats:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao calcular estatísticas' 
                } 
            }
        }
    }
}