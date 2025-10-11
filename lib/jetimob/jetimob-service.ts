/**
 * Serviço de Integração com Jetimob API
 * Documentação: https://jetimob.docs.apiary.io/#reference/0/portais-e-anuncios
 */

interface JetimobConfig {
    webserviceKey: string
    publicKey: string
    privateKey: string
    baseUrl: string
}

interface JetimobProperty {
    id: string
    title: string
    description: string
    property_type: string
    transaction_type: 'sale' | 'rent'
    price: number
    area: number
    bedrooms: number
    bathrooms: number
    parking_spaces: number
    address: {
        street: string
        number: string
        neighborhood: string
        city: string
        state: string
        zipcode: string
        latitude?: number
        longitude?: number
    }
    features: string[]
    images: string[]
    status: 'active' | 'inactive' | 'sold' | 'rented'
    created_at: string
    updated_at: string
}

interface JetimobLead {
    id: string
    name: string
    email: string
    phone: string
    property_id: string
    message: string
    source: string
    created_at: string
    status: 'new' | 'contacted' | 'qualified' | 'converted'
}

interface JetimobPortal {
    id: string
    name: string
    status: 'active' | 'inactive'
    configuration: {
        auto_sync: boolean
        sync_frequency: number
        image_quality: 'high' | 'medium' | 'low'
    }
}

export class JetimobService {
    private config: JetimobConfig
    private authToken: string | null = null

    constructor(config: JetimobConfig) {
        this.config = config
    }

    /**
     * Autenticação com a API Jetimob V2
     * Usa webservice key para autenticação
     */
    async authenticate(): Promise<boolean> {
        try {
            // Jetimob V2 usa webservice key diretamente nos headers
            this.authToken = this.config.webserviceKey
            
            // Testar autenticação fazendo uma request simples
            const response = await fetch(`${this.config.baseUrl}/imoveis`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                }
            })

            if (!response.ok) {
                throw new Error(`Erro de autenticação: ${response.status}`)
            }

            const data = await response.json()
            this.authToken = data.access_token
            
            // Salvar token no localStorage para persistência
            if (typeof window !== 'undefined') {
                localStorage.setItem('jetimob_token', this.authToken)
                localStorage.setItem('jetimob_token_expires', data.expires_at)
            }

            return true
        } catch (error) {
            console.error('Erro na autenticação Jetimob:', error)
            return false
        }
    }

    /**
     * Headers padrão para requisições autenticadas Jetimob V2
     */
    private getAuthHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken || this.config.webserviceKey}`,
            'X-Public-Key': this.config.publicKey
        }
    }

    /**
     * Verificar se o token ainda é válido
     */
    private isTokenValid(): boolean {
        if (typeof window === 'undefined') return false
        
        const token = localStorage.getItem('jetimob_token')
        const expires = localStorage.getItem('jetimob_token_expires')
        
        if (!token || !expires) return false
        
        return new Date(expires) > new Date()
    }

    /**
     * Garantir autenticação antes de fazer requisições
     */
    private async ensureAuthenticated(): Promise<void> {
        if (!this.authToken || !this.isTokenValid()) {
            const success = await this.authenticate()
            if (!success) {
                throw new Error('Falha na autenticação com Jetimob')
            }
        }
    }

    // === IMÓVEIS ===

    /**
     * Buscar todos os imóveis
     */
    async getProperties(): Promise<JetimobProperty[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties`, {
                headers: this.getAuthHeaders()
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar imóveis: ${response.status}`)
            }

            const data = await response.json()
            return data.properties || []
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error)
            throw error
        }
    }

    /**
     * Buscar imóvel específico
     */
    async getProperty(propertyId: string): Promise<JetimobProperty | null> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}`, {
                headers: this.getAuthHeaders()
            })

            if (!response.ok) {
                if (response.status === 404) return null
                throw new Error(`Erro ao buscar imóvel: ${response.status}`)
            }

            const data = await response.json()
            return data.property
        } catch (error) {
            console.error('Erro ao buscar imóvel:', error)
            throw error
        }
    }

    /**
     * Criar novo imóvel
     */
    async createProperty(property: Omit<JetimobProperty, 'id' | 'created_at' | 'updated_at'>): Promise<JetimobProperty> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ property })
            })

            if (!response.ok) {
                throw new Error(`Erro ao criar imóvel: ${response.status}`)
            }

            const data = await response.json()
            return data.property
        } catch (error) {
            console.error('Erro ao criar imóvel:', error)
            throw error
        }
    }

    /**
     * Atualizar imóvel
     */
    async updateProperty(propertyId: string, updates: Partial<JetimobProperty>): Promise<JetimobProperty> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ property: updates })
            })

            if (!response.ok) {
                throw new Error(`Erro ao atualizar imóvel: ${response.status}`)
            }

            const data = await response.json()
            return data.property
        } catch (error) {
            console.error('Erro ao atualizar imóvel:', error)
            throw error
        }
    }

    /**
     * Deletar imóvel
     */
    async deleteProperty(propertyId: string): Promise<boolean> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            })

            return response.ok
        } catch (error) {
            console.error('Erro ao deletar imóvel:', error)
            return false
        }
    }

    // === PORTAIS ===

    /**
     * Buscar portais disponíveis
     */
    async getPortals(): Promise<JetimobPortal[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/portals`, {
                headers: this.getAuthHeaders()
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar portais: ${response.status}`)
            }

            const data = await response.json()
            return data.portals || []
        } catch (error) {
            console.error('Erro ao buscar portais:', error)
            throw error
        }
    }

    /**
     * Sincronizar imóvel com portais
     */
    async syncPropertyToPortals(propertyId: string, portalIds: string[]): Promise<boolean> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}/sync`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    portal_ids: portalIds,
                    auto_sync: true
                })
            })

            return response.ok
        } catch (error) {
            console.error('Erro ao sincronizar imóvel:', error)
            return false
        }
    }

    /**
     * Remover imóvel dos portais
     */
    async unsyncPropertyFromPortals(propertyId: string, portalIds: string[]): Promise<boolean> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}/unsync`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    portal_ids: portalIds
                })
            })

            return response.ok
        } catch (error) {
            console.error('Erro ao remover imóvel dos portais:', error)
            return false
        }
    }

    // === LEADS ===

    /**
     * Buscar leads
     */
    async getLeads(filters?: {
        property_id?: string
        status?: string
        date_from?: string
        date_to?: string
    }): Promise<JetimobLead[]> {
        await this.ensureAuthenticated()

        try {
            const params = new URLSearchParams()
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value)
                })
            }

            const url = `${this.config.baseUrl}/leads${params.toString() ? `?${params.toString()}` : ''}`
            const response = await fetch(url, {
                headers: this.getAuthHeaders()
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar leads: ${response.status}`)
            }

            const data = await response.json()
            return data.leads || []
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
            throw error
        }
    }

    /**
     * Atualizar status do lead
     */
    async updateLeadStatus(leadId: string, status: string): Promise<boolean> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/leads/${leadId}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    status: status
                })
            })

            return response.ok
        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
            return false
        }
    }

    // === UPLOAD DE IMAGENS ===

    /**
     * Upload de imagem para um imóvel
     */
    async uploadPropertyImage(propertyId: string, imageFile: File): Promise<string | null> {
        await this.ensureAuthenticated()

        try {
            const formData = new FormData()
            formData.append('image', imageFile)
            formData.append('property_id', propertyId)

            const response = await fetch(`${this.config.baseUrl}/properties/${propertyId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken || this.config.webserviceKey}`,
                    'X-Public-Key': this.config.publicKey
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Erro no upload: ${response.status}`)
            }

            const data = await response.json()
            return data.image_url
        } catch (error) {
            console.error('Erro no upload de imagem:', error)
            return null
        }
    }

    // === RELATÓRIOS ===

    /**
     * Buscar relatórios de performance
     */
    async getPerformanceReport(dateFrom: string, dateTo: string): Promise<any> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`${this.config.baseUrl}/reports/performance`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    date_from: dateFrom,
                    date_to: dateTo
                })
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar relatório: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erro ao buscar relatório:', error)
            throw error
        }
    }

    // === WEBHOOK HANDLERS ===

    /**
     * Processar webhook de novo lead
     */
    static processLeadWebhook(webhookData: any): JetimobLead {
        return {
            id: webhookData.lead_id,
            name: webhookData.name,
            email: webhookData.email,
            phone: webhookData.phone,
            property_id: webhookData.property_id,
            message: webhookData.message,
            source: webhookData.source,
            created_at: webhookData.created_at,
            status: 'new'
        }
    }

    /**
     * Processar webhook de atualização de imóvel
     */
    static processPropertyWebhook(webhookData: any): Partial<JetimobProperty> {
        return {
            id: webhookData.property_id,
            status: webhookData.status,
            updated_at: webhookData.updated_at
        }
    }
}

// Configuração padrão para desenvolvimento (Jetimob V2)
export const jetimobConfig: JetimobConfig = {
    webserviceKey: process.env.JETIMOB_WEBSERVICE_KEY || '',
    publicKey: process.env.JETIMOB_PUBLIC_KEY || '',
    privateKey: process.env.JETIMOB_PRIVATE_KEY || '',
    baseUrl: process.env.JETIMOB_BASE_URL || 'https://api.jetimob.com/v2'
}

// Instância global do serviço
export const jetimobService = new JetimobService(jetimobConfig)
