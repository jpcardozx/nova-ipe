import { supabase } from '@/lib/supabase'

export interface Client {
    id: string
    name: string
    email?: string | null
    phone?: string
    status: 'active' | 'inactive' | 'vip' | 'prospect' | 'blacklist'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    birth_date?: string | null
    notes?: string | null
    user_id: string
    client_type?: 'individual' | 'company'
    document_number?: string
    document_type?: 'cpf' | 'cnpj' | 'passport' | 'rg'
    profession?: string
    income?: number
    company_name?: string
    company_role?: string
    address?: {
        street: string
        number: string
        complement?: string
        neighborhood: string
        city: string
        state: string
        zip_code: string
        country: string
    }
    tags?: string[]
    preferences?: {
        preferred_contact: 'phone' | 'email' | 'whatsapp'
        contact_time: 'morning' | 'afternoon' | 'evening' | 'any'
        marketing_consent: boolean
    }
    transactions?: Array<{
        type: 'purchase' | 'sale' | 'rental'
        property_type: string
        value: number
        date: string
        status: 'completed' | 'in_progress' | 'cancelled'
        notes?: string
    }>
    emergency_contact?: {
        name: string
        relationship: string
        phone: string
    }
    created_at: string
    updated_at: string
}

export class ClientsService {
    // Demo mode fallback - in a real implementation, this would connect to Supabase
    private static isDemo = process.env.NODE_ENV === 'development'
    
    private static demoClients: Client[] = [
        {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 99999-1111',
            status: 'active',
            priority: 'high',
            birth_date: '1985-03-15T00:00:00.000Z',
            notes: 'Cliente VIP, comprou 3 imóveis conosco',
            user_id: 'current-user-id',
            client_type: 'individual',
            document_number: '123.456.789-00',
            document_type: 'cpf',
            profession: 'Engenheiro',
            income: 8500,
            address: {
                street: 'Rua das Flores',
                number: '123',
                complement: 'Apto 45',
                neighborhood: 'Centro',
                city: 'Guararema',
                state: 'SP',
                zip_code: '08900-000',
                country: 'Brasil'
            },
            tags: ['VIP', 'Investidor', 'Indicações'],
            preferences: {
                preferred_contact: 'whatsapp',
                contact_time: 'evening',
                marketing_consent: true
            },
            transactions: [
                {
                    type: 'purchase',
                    property_type: 'Casa',
                    value: 450000,
                    date: '2023-06-15',
                    status: 'completed',
                    notes: 'Primeira casa própria'
                },
                {
                    type: 'purchase',
                    property_type: 'Apartamento',
                    value: 320000,
                    date: '2023-12-10',
                    status: 'completed',
                    notes: 'Investimento para aluguel'
                }
            ],
            emergency_contact: {
                name: 'Maria Silva',
                relationship: 'Esposa',
                phone: '(11) 99999-2222'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Tech Solutions Ltda',
            email: 'contato@techsolutions.com',
            phone: '(11) 3333-4444',
            status: 'vip',
            priority: 'urgent',
            notes: 'Empresa de tecnologia em expansão',
            user_id: 'current-user-id',
            client_type: 'company',
            document_number: '12.345.678/0001-99',
            document_type: 'cnpj',
            company_name: 'Tech Solutions',
            company_role: 'Diretor Comercial',
            address: {
                street: 'Av. Empresarial',
                number: '500',
                complement: 'Sala 1001',
                neighborhood: 'Distrito Industrial',
                city: 'Guararema',
                state: 'SP',
                zip_code: '08900-100',
                country: 'Brasil'
            },
            tags: ['Pessoa Jurídica', 'Tech', 'Expansão'],
            preferences: {
                preferred_contact: 'email',
                contact_time: 'afternoon',
                marketing_consent: false
            },
            transactions: [
                {
                    type: 'rental',
                    property_type: 'Comercial',
                    value: 15000,
                    date: '2024-01-10',
                    status: 'in_progress',
                    notes: 'Contrato de 5 anos'
                }
            ],
            emergency_contact: {
                name: 'Carlos Santos',
                relationship: 'Sócio',
                phone: '(11) 99999-5555'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Ana Costa',
            email: 'ana.costa@email.com',
            phone: '(11) 99999-3333',
            status: 'prospect',
            priority: 'medium',
            birth_date: '1990-07-22T00:00:00.000Z',
            notes: 'Interesse em casa para família',
            user_id: 'current-user-id',
            client_type: 'individual',
            document_number: '987.654.321-00',
            document_type: 'cpf',
            profession: 'Professora',
            income: 4500,
            address: {
                street: 'Rua dos Professores',
                number: '78',
                neighborhood: 'Vila Educação',
                city: 'Guararema',
                state: 'SP',
                zip_code: '08900-200',
                country: 'Brasil'
            },
            tags: ['Primeira compra', 'Família'],
            preferences: {
                preferred_contact: 'phone',
                contact_time: 'morning',
                marketing_consent: true
            },
            transactions: [],
            emergency_contact: {
                name: 'Pedro Costa',
                relationship: 'Marido',
                phone: '(11) 99999-6666'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ]

    static async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<{
        client?: Client;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const newClient: Client = {
                    ...clientData,
                    id: Date.now().toString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }

                const existingClients = this.getDemoClients()
                const updatedClients = [...existingClients, newClient]
                localStorage.setItem('demo_clients', JSON.stringify(updatedClients))

                return { client: newClient }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('clients')
                    .insert([clientData])
                    .select()
                    .single()
                
                if (error) throw error
                return { client: data }
            }
        } catch (error) {
            console.error('Error creating client:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao criar cliente' 
                } 
            }
        }
    }

    static async updateClient(id: string, clientData: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<{
        client?: Client;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const existingClients = this.getDemoClients()
                const clientIndex = existingClients.findIndex(client => client.id === id)
                
                if (clientIndex === -1) {
                    throw new Error('Cliente não encontrado')
                }

                const updatedClient: Client = {
                    ...existingClients[clientIndex],
                    ...clientData,
                    updated_at: new Date().toISOString()
                }

                existingClients[clientIndex] = updatedClient
                localStorage.setItem('demo_clients', JSON.stringify(existingClients))

                return { client: updatedClient }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('clients')
                    .update(clientData)
                    .eq('id', id)
                    .select()
                    .single()
                
                if (error) throw error
                return { client: data }
            }
        } catch (error) {
            console.error('Error updating client:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente' 
                } 
            }
        }
    }

    static async deleteClient(id: string): Promise<{
        success?: boolean;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - use localStorage
                const existingClients = this.getDemoClients()
                const filteredClients = existingClients.filter(client => client.id !== id)
                
                if (filteredClients.length === existingClients.length) {
                    throw new Error('Cliente não encontrado')
                }

                localStorage.setItem('demo_clients', JSON.stringify(filteredClients))
                return { success: true }
            } else {
                // Production mode - would use Supabase
                const { error } = await supabase
                    .from('clients')
                    .delete()
                    .eq('id', id)
                
                if (error) throw error
                return { success: true }
            }
        } catch (error) {
            console.error('Error deleting client:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao deletar cliente' 
                } 
            }
        }
    }

    static async getClients(): Promise<{
        clients?: Client[];
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - get from localStorage or use default demo data
                const clients = this.getDemoClients()
                return { clients }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('clients')
                    .select('*')
                    .order('created_at', { ascending: false })
                
                if (error) throw error
                return { clients: data }
            }
        } catch (error) {
            console.error('Error getting clients:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar clientes' 
                } 
            }
        }
    }

    static async getClientById(id: string): Promise<{
        client?: Client;
        error?: { message: string };
    }> {
        try {
            if (this.isDemo) {
                // Demo mode - get from localStorage or use default demo data
                const clients = this.getDemoClients()
                const client = clients.find(c => c.id === id)
                
                if (!client) {
                    throw new Error('Cliente não encontrado')
                }

                return { client }
            } else {
                // Production mode - would use Supabase
                const { data, error } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', id)
                    .single()
                
                if (error) throw error
                return { client: data }
            }
        } catch (error) {
            console.error('Error getting client by id:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar cliente' 
                } 
            }
        }
    }

    private static getDemoClients(): Client[] {
        if (typeof window === 'undefined') return this.demoClients
        
        try {
            const stored = localStorage.getItem('demo_clients')
            if (stored) {
                return JSON.parse(stored)
            }
        } catch (error) {
            console.warn('Error reading clients from localStorage:', error)
        }
        
        // Initialize localStorage with demo data
        localStorage.setItem('demo_clients', JSON.stringify(this.demoClients))
        return this.demoClients
    }

    // Statistics and analytics methods
    static async getClientStats(): Promise<{
        stats?: {
            total: number;
            active: number;
            inactive: number;
            vip: number;
            prospect: number;
            blacklist: number;
            averageTransactionValue: number;
            totalTransactions: number;
        };
        error?: { message: string };
    }> {
        try {
            const { clients, error } = await this.getClients()
            
            if (error || !clients) {
                throw new Error(error?.message || 'Erro ao buscar clientes para estatísticas')
            }

            const total = clients.length
            const active = clients.filter(c => c.status === 'active').length
            const inactive = clients.filter(c => c.status === 'inactive').length
            const vip = clients.filter(c => c.status === 'vip').length
            const prospect = clients.filter(c => c.status === 'prospect').length
            const blacklist = clients.filter(c => c.status === 'blacklist').length

            // Calculate transaction statistics
            const allTransactions = clients.flatMap(c => c.transactions || [])
            const totalTransactions = allTransactions.length
            const completedTransactions = allTransactions.filter(t => t.status === 'completed')
            const averageTransactionValue = completedTransactions.length > 0 
                ? completedTransactions.reduce((sum, t) => sum + t.value, 0) / completedTransactions.length 
                : 0

            return {
                stats: {
                    total,
                    active,
                    inactive,
                    vip,
                    prospect,
                    blacklist,
                    averageTransactionValue,
                    totalTransactions
                }
            }
        } catch (error) {
            console.error('Error getting client stats:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao calcular estatísticas' 
                } 
            }
        }
    }

    // Search clients by name, email, phone, or document
    static async searchClients(query: string): Promise<{
        clients?: Client[];
        error?: { message: string };
    }> {
        try {
            const { clients, error } = await this.getClients()
            
            if (error || !clients) {
                throw new Error(error?.message || 'Erro ao buscar clientes')
            }

            const searchTerm = query.toLowerCase()
            const filteredClients = clients.filter(client => 
                client.name.toLowerCase().includes(searchTerm) ||
                client.email?.toLowerCase().includes(searchTerm) ||
                client.phone?.includes(searchTerm) ||
                client.document_number?.includes(searchTerm) ||
                client.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            )

            return { clients: filteredClients }
        } catch (error) {
            console.error('Error searching clients:', error)
            return { 
                error: { 
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao pesquisar clientes' 
                } 
            }
        }
    }
}