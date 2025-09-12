/**
 * Exemplo prático de como usar a integração com Jetimob
 * 
 * Este arquivo demonstra casos de uso comuns da integração
 * com a API da Jetimob para sincronização de imóveis.
 */

import { jetimobService } from '@/lib/jetimob/jetimob-service'
import { useJetimob, useJetimobProperties, useJetimobLeads } from '@/lib/jetimob/use-jetimob'

// ============================================================================
// EXEMPLO 1: Sincronizar um imóvel com múltiplos portais
// ============================================================================

async function exemploSincronizarImovel() {
    try {
        // 1. Criar o imóvel na Jetimob
        const novoImovel = await jetimobService.createProperty({
            title: 'Apartamento 3 quartos na Vila Madalena',
            description: 'Lindo apartamento com vista para o parque, 3 quartos sendo 1 suíte, 2 vagas de garagem.',
            property_type: 'Apartamento',
            transaction_type: 'sale',
            price: 850000,
            area: 85,
            bedrooms: 3,
            bathrooms: 2,
            parking_spaces: 2,
            address: {
                street: 'Rua Harmonia',
                number: '123',
                neighborhood: 'Vila Madalena',
                city: 'São Paulo',
                state: 'SP',
                zipcode: '05435-000',
                latitude: -23.5505,
                longitude: -46.6333
            },
            features: [
                'Sacada',
                'Área de lazer',
                'Piscina',
                'Academia',
                'Portaria 24h',
                'Elevador'
            ],
            images: [
                'https://exemplo.com/foto1.jpg',
                'https://exemplo.com/foto2.jpg',
                'https://exemplo.com/foto3.jpg'
            ]
        })

        console.log('Imóvel criado:', novoImovel.id)

        // 2. Sincronizar com portais específicos
        await jetimobService.syncPropertyToPortals(novoImovel.id, [
            'viva_real',
            'zap',
            'olx'
        ])

        console.log('Imóvel sincronizado com os portais!')

    } catch (error) {
        console.error('Erro ao sincronizar imóvel:', error)
    }
}

// ============================================================================
// EXEMPLO 2: Monitorar leads em tempo real
// ============================================================================

function ExemploMonitorarLeads() {
    const {
        leads,
        loadLeads,
        updateLeadStatus,
        isLoading,
        error
    } = useJetimobLeads()

    React.useEffect(() => {
        loadLeads()

        // Verificar novos leads a cada 30 segundos
        const interval = setInterval(loadLeads, 30000)

        return () => clearInterval(interval)
    }, [])

    const handleLeadContact = async (leadId: string) => {
        try {
            await updateLeadStatus(leadId, 'contacted')

            // Aqui você pode adicionar lógica adicional
            // como enviar email automático, criar tarefa no CRM, etc.

        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
        }
    }

    if (isLoading) return <div>Carregando leads...</div>
    if (error) return <div>Erro: {error}</div>

    return (
        <div>
            <h2>Leads Recentes</h2>
            {leads.map(lead => (
                <div key={lead.id} className="border p-4 rounded mb-2">
                    <h3>{lead.name}</h3>
                    <p>{lead.email} | {lead.phone}</p>
                    <p><strong>Interesse:</strong> {lead.property_id}</p>
                    <p><strong>Origem:</strong> {lead.source}</p>
                    <p><strong>Mensagem:</strong> {lead.message}</p>

                    {lead.status === 'new' && (
                        <button
                            onClick={() => handleLeadContact(lead.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Marcar como Contatado
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

// ============================================================================
// EXEMPLO 3: Dashboard de performance dos portais
// ============================================================================

function ExemploPortalsDashboard() {
    const [portals, setPortals] = React.useState([])
    const [properties, setProperties] = React.useState([])
    const [stats, setStats] = React.useState({
        totalProperties: 0,
        activeSyncs: 0,
        totalLeads: 0,
        conversionRate: 0
    })

    React.useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const [portalsData, propertiesData] = await Promise.all([
                jetimobService.getPortals(),
                jetimobService.getProperties()
            ])

            setPortals(portalsData)
            setProperties(propertiesData)

            // Calcular estatísticas
            const activeSyncs = propertiesData.filter(p => p.status === 'active').length
            const totalLeads = await jetimobService.getLeads().then(leads => leads.length)

            setStats({
                totalProperties: propertiesData.length,
                activeSyncs,
                totalLeads,
                conversionRate: totalLeads > 0 ? (activeSyncs / totalLeads * 100) : 0
            })

        } catch (error) {
            console.error('Erro ao carregar dados:', error)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Estatísticas */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total de Imóveis</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Sincronizações Ativas</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeSyncs}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total de Leads</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalLeads}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Taxa de Conversão</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.conversionRate.toFixed(1)}%</p>
            </div>

            {/* Status dos Portais */}
            <div className="col-span-full bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Status dos Portais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {portals.map(portal => (
                        <div key={portal.id} className="border rounded p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">{portal.name}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${portal.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {portal.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {portal.synced_properties || 0} imóveis sincronizados
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// EXEMPLO 4: Formulário de criação de imóvel com sync automático
// ============================================================================

function ExemploFormularioCriacao() {
    const { createProperty, syncToPortals, isLoading } = useJetimobProperties()
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        property_type: 'Apartamento',
        transaction_type: 'sale',
        price: 0,
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        parking_spaces: 0,
        address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipcode: ''
        },
        features: [],
        selectedPortals: ['viva_real', 'zap'] // Portais padrão
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // 1. Criar o imóvel
            const novoImovel = await createProperty(formData)

            // 2. Sincronizar automaticamente com os portais selecionados
            await syncToPortals(novoImovel.id, formData.selectedPortals)

            // 3. Resetar formulário
            setFormData({ ...formData, title: '', description: '' })

            alert('Imóvel criado e sincronizado com sucesso!')

        } catch (error) {
            console.error('Erro ao criar imóvel:', error)
            alert('Erro ao criar imóvel. Tente novamente.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows={4}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        value={formData.property_type}
                        onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Sobrado">Sobrado</option>
                        <option value="Studio">Studio</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Transação</label>
                    <select
                        value={formData.transaction_type}
                        onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as 'sale' | 'rent' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="sale">Venda</option>
                        <option value="rent">Aluguel</option>
                    </select>
                </div>
            </div>

            {/* Portais para sincronização */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sincronizar com:
                </label>
                <div className="space-y-2">
                    {['viva_real', 'zap', 'olx', 'imovelweb'].map(portal => (
                        <label key={portal} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.selectedPortals.includes(portal)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFormData({
                                            ...formData,
                                            selectedPortals: [...formData.selectedPortals, portal]
                                        })
                                    } else {
                                        setFormData({
                                            ...formData,
                                            selectedPortals: formData.selectedPortals.filter(p => p !== portal)
                                        })
                                    }
                                }}
                                className="mr-2"
                            />
                            {portal.replace('_', ' ').toUpperCase()}
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? 'Criando e Sincronizando...' : 'Criar e Sincronizar Imóvel'}
            </button>
        </form>
    )
}

// ============================================================================
// EXEMPLO 5: Webhook handler personalizado
// ============================================================================

export async function exemploWebhookHandler(event: any) {
    switch (event.type) {
        case 'lead.created':
            // Novo lead recebido
            const lead = event.data

            // Enviar notificação para o corretor responsável
            await enviarNotificacaoCorretor(lead)

            // Adicionar lead ao CRM interno
            await adicionarLeadCRM(lead)

            // Enviar email de boas-vindas automático
            await enviarEmailBoasVindas(lead)
            break

        case 'property.updated':
            // Imóvel foi atualizado em um portal
            const property = event.data

            // Sincronizar mudanças com outros portais
            await sincronizarMudancas(property)

            // Atualizar cache local
            await atualizarCacheLocal(property)
            break

        case 'portal.status_changed':
            // Status de um portal mudou
            const portal = event.data

            if (portal.status === 'offline') {
                // Portal ficou offline - notificar administrador
                await notificarAdministrador(`Portal ${portal.name} ficou offline`)
            } else if (portal.status === 'online') {
                // Portal voltou - ressincronizar imóveis pendentes
                await ressincronizarImoveisPendentes(portal.id)
            }
            break

        default:
            console.log('Evento não reconhecido:', event.type)
    }
}

// Funções auxiliares (implementar conforme necessário)
async function enviarNotificacaoCorretor(lead: any) {
    // Implementar notificação via email, SMS, push, etc.
}

async function adicionarLeadCRM(lead: any) {
    // Integrar com sistema CRM interno
}

async function enviarEmailBoasVindas(lead: any) {
    // Implementar email automático
}

async function sincronizarMudancas(property: any) {
    // Propagar mudanças para outros portais
}

async function atualizarCacheLocal(property: any) {
    // Atualizar cache/banco local
}

async function notificarAdministrador(message: string) {
    // Notificar administrador sobre problemas
}

async function ressincronizarImoveisPendentes(portalId: string) {
    // Ressincronizar quando portal voltar
}

export {
    exemploSincronizarImovel,
    ExemploMonitorarLeads,
    ExemploPortalsDashboard,
    ExemploFormularioCriacao,
    exemploWebhookHandler
}
