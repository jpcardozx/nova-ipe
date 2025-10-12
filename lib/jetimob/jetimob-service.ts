/**
 * Serviço de Integração com Jetimob API
 * Documentação: https://jetimob.docs.apiary.io/#reference/0/portais-e-anuncios
 */

export interface JetimobConfig {
    webserviceKey: string
    publicKey: string
    privateKey: string
    baseUrl: string
}

export interface JetimobProperty {
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

export interface JetimobLead {
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

export interface JetimobPortal {
    id: string
    name: string
    status: 'active' | 'inactive'
    configuration: {
        auto_sync: boolean
        sync_frequency: number
        image_quality: 'high' | 'medium' | 'low'
    }
}

export interface JetimobAnuncio {
    id: string
    imovel_codigo: string
    portal_id: string
    portal_nome: string
    status: 'ativo' | 'inativo' | 'pendente' | 'erro'
    destaque: boolean
    super_destaque: boolean
    url_anuncio?: string
    data_publicacao: string
    ultima_sincronizacao: string
    visualizacoes?: number
    leads_gerados?: number
}

export interface JetimobDashboardStats {
    total_imoveis: number
    imoveis_ativos: number
    imoveis_inativos: number
    leads_mes: number
    leads_pendentes: number
    visualizacoes_mes: number
    taxa_conversao: number
    portais_ativos: number
}

export interface JetimobEstatisticas {
    periodo: 'hoje' | 'semana' | 'mes' | 'ano'
    total_imoveis: number
    imoveis_ativos: number
    imoveis_inativos: number
    leads_recebidos: number
    leads_convertidos: number
    taxa_conversao: number
    portais_ativos: number
    anuncios_ativos: number
}

export interface JetimobRelatorioPortal {
    portal_id: string
    portal_nome: string
    anuncios_ativos: number
    visualizacoes: number
    leads_gerados: number
    taxa_conversao: number
    custo?: number
}

export interface JetimobRelatorioLeads {
    total_leads: number
    leads_por_status: {
        novo: number
        contatado: number
        qualificado: number
        convertido: number
    }
    leads_por_portal: Array<{
        portal: string
        quantidade: number
    }>
    taxa_conversao_geral: number
}

export interface JetimobCorretor {
    id: string
    nome: string
    email: string
    telefone: string
    creci: string
    ativo: boolean
    foto?: string
}

export interface JetimobLeadDetalhado extends JetimobLead {
    imovel_titulo?: string
    imovel_endereco?: string
    observacoes?: Array<{
        id: string
        texto: string
        data: string
        usuario: string
    }>
    historico?: Array<{
        acao: string
        data: string
        usuario: string
    }>
}

export class JetimobService {
    private config: JetimobConfig
    private authToken: string | null = null

    constructor(config: JetimobConfig) {
        this.config = config
    }

    /**
     * Autenticação com a API Jetimob
     * A API Jetimob não requer login - usa webservice key diretamente
     * Usando proxy interno para evitar problemas de CORS
     */
    async authenticate(): Promise<boolean> {
        try {
            // Verificar se tem credenciais
            if (!this.config.webserviceKey) {
                console.warn('⚠️ Jetimob webserviceKey não configurado')
                return false
            }

            // Jetimob usa webservice key diretamente - não há endpoint de autenticação
            this.authToken = this.config.webserviceKey

            // Testar conexão usando proxy interno (evita CORS)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

            const response = await fetch('/api/jetimob?endpoint=imoveis&v=v6', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro de autenticação: ${response.status} - ${errorData.error || response.statusText}`)
            }

            // Salvar token no localStorage para persistência
            if (typeof window !== 'undefined') {
                localStorage.setItem('jetimob_token', this.authToken)
            }

            console.log('✅ Jetimob: Autenticado com sucesso via proxy')
            return true
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error('❌ Jetimob: Timeout na conexão (10s)')
                } else if (error.message.includes('fetch')) {
                    console.error('❌ Jetimob: Erro de rede - verifique conectividade')
                } else {
                    console.error('❌ Jetimob: Erro na autenticação:', error.message)
                }
            } else {
                console.error('❌ Jetimob: Erro desconhecido na autenticação:', error)
            }
            return false
        }
    }

    /**
     * Headers padrão para requisições autenticadas Jetimob
     */
    private getAuthHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'token': this.authToken || this.config.webserviceKey
        }
    }

    /**
     * Verificar se o token existe
     */
    private isTokenValid(): boolean {
        if (typeof window === 'undefined') return !!this.authToken
        
        const token = localStorage.getItem('jetimob_token')
        return !!token
    }

    /**
     * Garantir autenticação antes de fazer requisições
     */
    private async ensureAuthenticated(): Promise<void> {
        // Verificar se há configuração antes de tentar autenticar
        if (!this.config.webserviceKey || !this.config.publicKey || !this.config.privateKey) {
            throw new Error('Jetimob não configurado. Verifique as variáveis de ambiente.')
        }

        if (!this.authToken || !this.isTokenValid()) {
            const success = await this.authenticate()
            if (!success) {
                throw new Error('Falha na autenticação com Jetimob')
            }
        }
    }

    // === IMÓVEIS ===

    /**
     * Buscar todos os imóveis (via proxy)
     * Endpoint oficial: GET /webservice/{KEY}/imoveis?v=v6
     */
    async getProperties(): Promise<JetimobProperty[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch('/api/jetimob?endpoint=imoveis&v=v6', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar imóveis: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            
            // API Jetimob retorna: { "imoveis": [...] }
            const imoveis = data.imoveis || data || []
            console.log('✅ Jetimob: Imóveis carregados:', Array.isArray(imoveis) ? imoveis.length : 0)

            // Normalizar dados da API (PascalCase para camelCase)
            return Array.isArray(imoveis) ? imoveis.map(this.normalizeProperty) : []
        } catch (error) {
            console.error('❌ Erro ao buscar imóveis:', error)
            throw error
        }
    }

    /**
     * Normalizar imóvel da API Jetimob (PascalCase -> camelCase)
     */
    private normalizeProperty(apiProperty: any): JetimobProperty {
        return {
            id: apiProperty.Codigo || apiProperty.id || '',
            title: apiProperty.TituloSite || apiProperty.TipoImovel || '',
            description: apiProperty.Descricao || '',
            property_type: apiProperty.TipoImovel || '',
            transaction_type: apiProperty.Finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent',
            price: parseFloat(apiProperty.Valor || apiProperty.ValorVenda || '0'),
            area: parseFloat(apiProperty.AreaTotal || apiProperty.AreaUtil || '0'),
            bedrooms: parseInt(apiProperty.QuartoQtd || '0'),
            bathrooms: parseInt(apiProperty.BanheiroQtd || '0'),
            parking_spaces: parseInt(apiProperty.VagaQtd || '0'),
            address: {
                street: apiProperty.Endereco || '',
                number: apiProperty.Numero || '',
                neighborhood: apiProperty.Bairro || '',
                city: apiProperty.Cidade || '',
                state: apiProperty.Estado || '',
                zipcode: apiProperty.CEP || '',
                latitude: parseFloat(apiProperty.Latitude || '0'),
                longitude: parseFloat(apiProperty.Longitude || '0')
            },
            features: apiProperty.Caracteristicas || [],
            images: apiProperty.Fotos || [],
            status: this.normalizeStatus(apiProperty.Status),
            created_at: apiProperty.DataCadastro || new Date().toISOString(),
            updated_at: apiProperty.DataAtualizacao || new Date().toISOString()
        }
    }

    /**
     * Normalizar status do imóvel
     */
    private normalizeStatus(status: string): 'active' | 'inactive' | 'sold' | 'rented' {
        const statusLower = (status || '').toLowerCase()
        if (statusLower.includes('vendido')) return 'sold'
        if (statusLower.includes('alugado') || statusLower.includes('locado')) return 'rented'
        if (statusLower.includes('inativo') || statusLower.includes('indisponível')) return 'inactive'
        return 'active'
    }

    /**
     * Buscar imóvel específico (via proxy)
     * Endpoint oficial: GET /webservice/{KEY}/imovel/{CODIGO}?v=v6
     */
    async getProperty(propertyId: string): Promise<JetimobProperty | null> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`/api/jetimob?endpoint=imovel/${propertyId}&v=v6`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                if (response.status === 404) return null
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar imóvel: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            const imovel = data.imovel || data
            return imovel ? this.normalizeProperty(imovel) : null
        } catch (error) {
            console.error('❌ Erro ao buscar imóvel:', error)
            throw error
        }
    }

    /**
     * Buscar fotos de um imóvel
     * Endpoint oficial: GET /webservice/{KEY}/imovel/{CODIGO}/fotos?v=v6
     */
    async getPropertyPhotos(propertyId: string): Promise<string[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`/api/jetimob?endpoint=imovel/${propertyId}/fotos&v=v6`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                return []
            }

            const data = await response.json()
            const fotos = data.fotos || data || []
            console.log('✅ Jetimob: Fotos carregadas:', Array.isArray(fotos) ? fotos.length : 0)
            
            // API retorna array de objetos com URL
            return Array.isArray(fotos) ? fotos.map((f: any) => f.Url || f.url || f) : []
        } catch (error) {
            console.error('❌ Erro ao buscar fotos:', error)
            return []
        }
    }

    // NOTA: API Jetimob é SOMENTE LEITURA
    // Para criar/atualizar/deletar imóveis, use o painel web: https://jetimob.com
    // Os métodos abaixo estão desabilitados por limitação da API

    // === PORTAIS ===

    /**
     * Buscar portais disponíveis (via proxy)
     * Endpoint oficial: GET /webservice/{KEY}/portais?v=v5
     */
    async getPortals(): Promise<JetimobPortal[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch('/api/jetimob?endpoint=portais&v=v5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar portais: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            const portais = data.portais || data.portals || data || []
            console.log('✅ Jetimob: Portais carregados:', Array.isArray(portais) ? portais.length : 0)
            
            // Normalizar dados da API
            return Array.isArray(portais) ? portais.map(this.normalizePortal.bind(this)) : []
        } catch (error) {
            console.error('❌ Erro ao buscar portais:', error)
            throw error
        }
    }

    /**
     * Normalizar portal da API Jetimob
     */
    private normalizePortal(apiPortal: any): JetimobPortal {
        return {
            id: apiPortal.Id || apiPortal.id || '',
            name: apiPortal.Nome || apiPortal.name || '',
            status: apiPortal.Status?.toLowerCase() === 'ativo' || apiPortal.status === 'active' ? 'active' : 'inactive',
            configuration: {
                auto_sync: apiPortal.SincronizacaoAutomatica || false,
                sync_frequency: apiPortal.FrequenciaSincronizacao || 60,
                image_quality: 'high'
            }
        }
    }

    // === LEADS ===

    /**
     * Buscar leads (via proxy)
     * Endpoint oficial: GET /webservice/{KEY}/leads?v=v5
     * Nota: Filtros são aplicados client-side (API não suporta filtros)
     */
    async getLeads(filters?: {
        property_id?: string
        status?: string
        date_from?: string
        date_to?: string
    }): Promise<JetimobLead[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch('/api/jetimob?endpoint=leads&v=v5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar leads: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            let leads = data.leads || data || []
            
            // Normalizar dados
            leads = Array.isArray(leads) ? leads.map(this.normalizeLead.bind(this)) : []
            
            console.log('✅ Jetimob: Leads carregados:', leads.length)

            // Aplicar filtros client-side
            if (filters) {
                if (filters.property_id) {
                    leads = leads.filter((l: any) => l.property_id === filters.property_id)
                }
                if (filters.status) {
                    leads = leads.filter((l: any) => l.status === filters.status)
                }
                if (filters.date_from || filters.date_to) {
                    leads = leads.filter((l: any) => {
                        const leadDate = new Date(l.created_at)
                        if (filters.date_from && leadDate < new Date(filters.date_from)) return false
                        if (filters.date_to && leadDate > new Date(filters.date_to)) return false
                        return true
                    })
                }
            }

            return leads
        } catch (error) {
            console.error('❌ Erro ao buscar leads:', error)
            throw error
        }
    }

    /**
     * Normalizar lead da API Jetimob
     */
    private normalizeLead(apiLead: any): JetimobLead {
        return {
            id: apiLead.Id || apiLead.id || '',
            name: apiLead.Nome || apiLead.name || '',
            email: apiLead.Email || apiLead.email || '',
            phone: apiLead.Telefone || apiLead.phone || '',
            property_id: apiLead.ImovelCodigo || apiLead.property_id || '',
            message: apiLead.Mensagem || apiLead.message || '',
            source: apiLead.Portal || apiLead.source || '',
            created_at: apiLead.Data || apiLead.created_at || new Date().toISOString(),
            status: this.normalizeLeadStatus(apiLead.Status)
        }
    }

    /**
     * Normalizar status do lead
     */
    private normalizeLeadStatus(status: string): 'new' | 'contacted' | 'qualified' | 'converted' {
        const statusLower = (status || 'novo').toLowerCase()
        if (statusLower.includes('convertido') || statusLower.includes('fechado')) return 'converted'
        if (statusLower.includes('qualificado')) return 'qualified'
        if (statusLower.includes('contatado') || statusLower.includes('em atendimento')) return 'contacted'
        return 'new'
    }

    /**
     * Buscar lead específico
     * Endpoint oficial: GET /webservice/{KEY}/lead/{ID}?v=v5
     */
    async getLead(leadId: string): Promise<JetimobLeadDetalhado | null> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`/api/jetimob?endpoint=lead/${leadId}&v=v5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                if (response.status === 404) return null
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar lead: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            const lead = data.lead || data
            return lead ? { ...this.normalizeLead(lead), observacoes: [], historico: [] } : null
        } catch (error) {
            console.error('❌ Erro ao buscar lead:', error)
            throw error
        }
    }

    // === ANÚNCIOS (PUBLICAÇÕES) ===

    /**
     * Listar todos os anúncios publicados
     * Endpoint oficial: GET /webservice/{KEY}/anuncios?v=v5
     */
    async getAnuncios(filters?: {
        imovel_codigo?: string
        portal_id?: string
        status?: 'ativo' | 'inativo' | 'pendente'
    }): Promise<JetimobAnuncio[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch('/api/jetimob?endpoint=anuncios&v=v5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar anúncios: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            let anuncios = data.anuncios || data || []
            
            // Normalizar dados
            anuncios = Array.isArray(anuncios) ? anuncios.map(this.normalizeAnuncio.bind(this)) : []
            
            console.log('✅ Jetimob: Anúncios carregados:', anuncios.length)

            // Aplicar filtros client-side
            if (filters) {
                if (filters.imovel_codigo) {
                    anuncios = anuncios.filter((a: any) => a.imovel_codigo === filters.imovel_codigo)
                }
                if (filters.portal_id) {
                    anuncios = anuncios.filter((a: any) => a.portal_id === filters.portal_id)
                }
                if (filters.status) {
                    anuncios = anuncios.filter((a: any) => a.status === filters.status)
                }
            }

            return anuncios
        } catch (error) {
            console.error('❌ Erro ao buscar anúncios:', error)
            throw error
        }
    }

    /**
     * Normalizar anúncio da API Jetimob
     */
    private normalizeAnuncio(apiAnuncio: any): JetimobAnuncio {
        return {
            id: apiAnuncio.Id || apiAnuncio.id || '',
            imovel_codigo: apiAnuncio.ImovelCodigo || apiAnuncio.imovel_codigo || '',
            portal_id: apiAnuncio.PortalId || apiAnuncio.portal_id || '',
            portal_nome: apiAnuncio.PortalNome || apiAnuncio.portal_nome || '',
            status: this.normalizeAnuncioStatus(apiAnuncio.Status),
            destaque: apiAnuncio.Destaque || false,
            super_destaque: apiAnuncio.SuperDestaque || false,
            url_anuncio: apiAnuncio.UrlAnuncio || apiAnuncio.url_anuncio,
            data_publicacao: apiAnuncio.DataPublicacao || apiAnuncio.data_publicacao || new Date().toISOString(),
            ultima_sincronizacao: apiAnuncio.UltimaSincronizacao || apiAnuncio.ultima_sincronizacao || new Date().toISOString(),
            visualizacoes: parseInt(apiAnuncio.Visualizacoes || '0'),
            leads_gerados: parseInt(apiAnuncio.LeadsGerados || '0')
        }
    }

    /**
     * Normalizar status do anúncio
     */
    private normalizeAnuncioStatus(status: string): 'ativo' | 'inativo' | 'pendente' | 'erro' {
        const statusLower = (status || '').toLowerCase()
        if (statusLower.includes('ativo') || statusLower.includes('publicado')) return 'ativo'
        if (statusLower.includes('erro') || statusLower.includes('falha')) return 'erro'
        if (statusLower.includes('pendente') || statusLower.includes('aguardando')) return 'pendente'
        return 'inativo'
    }

    // === ESTATÍSTICAS E RELATÓRIOS ===

    /**
     * Buscar estatísticas gerais
     * Endpoint oficial: GET /webservice/{KEY}/estatisticas?v=v5&periodo={hoje|semana|mes|ano}
     */
    async getEstatisticas(periodo: 'hoje' | 'semana' | 'mes' | 'ano' = 'mes'): Promise<JetimobEstatisticas> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`/api/jetimob?endpoint=estatisticas&v=v5&periodo=${periodo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar estatísticas: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            console.log('✅ Jetimob: Estatísticas carregadas:', periodo)
            
            return {
                periodo,
                total_imoveis: parseInt(data.TotalImoveis || data.total_imoveis || '0'),
                imoveis_ativos: parseInt(data.ImoveisAtivos || data.imoveis_ativos || '0'),
                imoveis_inativos: parseInt(data.ImoveisInativos || data.imoveis_inativos || '0'),
                leads_recebidos: parseInt(data.LeadsRecebidos || data.leads_recebidos || '0'),
                leads_convertidos: parseInt(data.LeadsConvertidos || data.leads_convertidos || '0'),
                taxa_conversao: parseFloat(data.TaxaConversao || data.taxa_conversao || '0'),
                portais_ativos: parseInt(data.PortaisAtivos || data.portais_ativos || '0'),
                anuncios_ativos: parseInt(data.AnunciosAtivos || data.anuncios_ativos || '0')
            }
        } catch (error) {
            console.error('❌ Erro ao buscar estatísticas:', error)
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

    // === CORRETORES ===

    /**
     * Listar todos os corretores
     * Endpoint oficial: GET /webservice/{KEY}/corretores?v=v5
     */
    async getCorretores(): Promise<JetimobCorretor[]> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch('/api/jetimob?endpoint=corretores&v=v5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar corretores: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            const corretores = data.corretores || data || []
            console.log('✅ Jetimob: Corretores carregados:', Array.isArray(corretores) ? corretores.length : 0)
            
            // Normalizar dados
            return Array.isArray(corretores) ? corretores.map(this.normalizeCorretor.bind(this)) : []
        } catch (error) {
            console.error('❌ Erro ao buscar corretores:', error)
            throw error
        }
    }

    /**
     * Normalizar corretor da API Jetimob
     */
    private normalizeCorretor(apiCorretor: any): JetimobCorretor {
        return {
            id: apiCorretor.Id || apiCorretor.id || '',
            nome: apiCorretor.Nome || apiCorretor.nome || '',
            email: apiCorretor.Email || apiCorretor.email || '',
            telefone: apiCorretor.Telefone || apiCorretor.telefone || '',
            creci: apiCorretor.Creci || apiCorretor.creci || '',
            ativo: apiCorretor.Ativo !== false && apiCorretor.ativo !== false,
            foto: apiCorretor.Foto || apiCorretor.foto
        }
    }

    /**
     * Buscar corretor específico
     * Endpoint oficial: GET /webservice/{KEY}/corretor/{ID}?v=v5
     */
    async getCorretor(corretorId: string): Promise<JetimobCorretor | null> {
        await this.ensureAuthenticated()

        try {
            const response = await fetch(`/api/jetimob?endpoint=corretor/${corretorId}&v=v5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                if (response.status === 404) return null
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`Erro ao buscar corretor: ${response.status} - ${errorData.error || ''}`)
            }

            const data = await response.json()
            const corretor = data.corretor || data
            return corretor ? this.normalizeCorretor(corretor) : null
        } catch (error) {
            console.error('❌ Erro ao buscar corretor:', error)
            throw error
        }
    }

    // === Métodos de Escrita (API Somente Leitura - Stubs para compatibilidade) ===
    // NOTA: A API Jetimob é SOMENTE LEITURA. Use o painel web para criar/editar/deletar: https://jetimob.com

    async createProperty(propertyData: Partial<JetimobProperty>): Promise<JetimobProperty> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para criar imóveis: https://jetimob.com')
        throw new Error('API Jetimob não suporta criação de imóveis via API. Use o painel web.')
    }

    async updateProperty(propertyId: string, propertyData: Partial<JetimobProperty>): Promise<JetimobProperty> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para atualizar imóveis: https://jetimob.com')
        throw new Error('API Jetimob não suporta atualização de imóveis via API. Use o painel web.')
    }

    async deleteProperty(propertyId: string): Promise<boolean> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para deletar imóveis: https://jetimob.com')
        return false // Não deletou porque não é suportado
    }

    async uploadPropertyImage(propertyId: string, imageUrl: string): Promise<{ url: string }> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para fazer upload de imagens: https://jetimob.com')
        throw new Error('API Jetimob não suporta upload de imagens via API. Use o painel web.')
    }
    
    async updateLeadStatus(leadId: string, status: string): Promise<boolean> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para atualizar status de leads: https://jetimob.com')
        return false // Não atualizou porque não é suportado
    }

    async syncPropertyToPortals(propertyId: string, portalIds: string[]): Promise<boolean> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para sincronizar com portais: https://jetimob.com')
        return false // Não sincronizou porque não é suportado
    }

    async unsyncPropertyFromPortals(propertyId: string, portalIds: string[]): Promise<boolean> {
        console.warn('⚠️ Jetimob API é somente leitura. Use o painel web para remover de portais: https://jetimob.com')
        return false // Não removeu porque não é suportado
    }
    
    // TODO: Implementar busca de relatório de performance
    async getPerformanceReport(propertyId: string): Promise<any> {
        console.warn('`getPerformanceReport` is not yet implemented.')
        return Promise.resolve({
            views: 0,
            leads: 0,
            conversionRate: 0
        })
    }
}

// Configuração padrão - suporta tanto server-side quanto client-side
export const jetimobConfig: JetimobConfig = {
    webserviceKey: process.env.NEXT_PUBLIC_JETIMOB_WEBSERVICE_KEY || process.env.JETIMOB_WEBSERVICE_KEY || '',
    publicKey: process.env.NEXT_PUBLIC_JETIMOB_PUBLIC_KEY || process.env.JETIMOB_PUBLIC_KEY || '',
    privateKey: process.env.NEXT_PUBLIC_JETIMOB_PRIVATE_KEY || process.env.JETIMOB_PRIVATE_KEY || '',
    baseUrl: process.env.NEXT_PUBLIC_JETIMOB_BASE_URL || process.env.JETIMOB_BASE_URL || 'https://api.jetimob.com/webservice'
}

// Função para verificar se configuração está completa
export function isJetimobConfigured(): boolean {
    const hasKeys = !!(jetimobConfig.webserviceKey && jetimobConfig.publicKey && jetimobConfig.privateKey)

    if (!hasKeys && typeof window !== 'undefined') {
        console.warn('⚠️ Jetimob não configurado corretamente')
        console.warn('📝 Variáveis necessárias no .env.local:')
        console.warn('   - NEXT_PUBLIC_JETIMOB_WEBSERVICE_KEY')
        console.warn('   - NEXT_PUBLIC_JETIMOB_PUBLIC_KEY')
        console.warn('   - NEXT_PUBLIC_JETIMOB_PRIVATE_KEY')
        console.warn('   - NEXT_PUBLIC_JETIMOB_BASE_URL (opcional, padrão: https://api.jetimob.com)')
    }

    return hasKeys
}

// Instância global do serviço
export const jetimobService = new JetimobService(jetimobConfig)

// Log detalhado da configuração no desenvolvimento
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    console.group('🔧 Jetimob Configuration Status')
    console.log('Base URL:', jetimobConfig.baseUrl)
    console.log('Webservice Key:', jetimobConfig.webserviceKey ? `${jetimobConfig.webserviceKey.slice(0, 8)}...` : '❌ MISSING')
    console.log('Public Key:', jetimobConfig.publicKey ? `${jetimobConfig.publicKey.slice(0, 8)}...` : '❌ MISSING')
    console.log('Private Key:', jetimobConfig.privateKey ? `${jetimobConfig.privateKey.slice(0, 8)}...` : '❌ MISSING')
    console.log('Status:', isJetimobConfigured() ? '✅ Configured' : '❌ Not Configured')
    console.groupEnd()
}
