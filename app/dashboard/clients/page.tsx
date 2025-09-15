'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { CRMService, Client } from '@/lib/supabase/crm-service'
import ClientModal from '../components/ClientModal'
import {
    Users,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Phone,
    Mail,
    MapPin,
    Calendar,
    DollarSign,
    User,
    Building2,
    TrendingUp,
    Clock,
    MoreVertical,
    Star,
    Activity,
    AlertCircle,
    CheckCircle2,
    Zap,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Grid3x3,
    List,
    MessageSquare,
    RefreshCw,
    Download,
    Heart,
    Globe,
    Award,
    Briefcase,
    LineChart,
    X
} from 'lucide-react'

interface ClientStats {
    total: number
    leads: number
    prospects: number
    clients: number
    inactive: number
    hotLeads: number
    overdueFollowUps: number
    newThisMonth: number
    conversionRate: number
}

export default function ClientsPage() {
    const { user } = useCurrentUser()
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'lead' | 'prospect' | 'client' | 'inactive'>('all')
    const [assignedFilter, setAssignedFilter] = useState<'all' | 'me' | string>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [showClientModal, setShowClientModal] = useState(false)

    const [stats, setStats] = useState<ClientStats>({
        total: 0,
        leads: 0,
        prospects: 0,
        clients: 0,
        inactive: 0,
        hotLeads: 0,
        overdueFollowUps: 0,
        newThisMonth: 0,
        conversionRate: 0
    })

    // Dados filtrados
    const filteredClients = clients.filter(client => {
        const matchesSearch = searchQuery === '' ||
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone?.includes(searchQuery)

        const matchesStatus = statusFilter === 'all' || client.status === statusFilter
        const matchesAssigned = assignedFilter === 'all' ||
            (assignedFilter === 'me' && client.assigned_to === user?.id)

        return matchesSearch && matchesStatus && matchesAssigned
    })

    useEffect(() => {
        loadClients()
    }, [statusFilter, assignedFilter, searchQuery])

    const loadClients = async () => {
        setLoading(true)
        try {
            const filters: any = {}

            if (statusFilter !== 'all') {
                filters.status = statusFilter
            }

            if (assignedFilter === 'me' && user?.id) {
                filters.assigned_to = user.id
            } else if (assignedFilter !== 'all') {
                filters.assigned_to = assignedFilter
            }

            if (searchQuery) {
                filters.search = searchQuery
            }

            const { data, error } = await CRMService.getClients(filters)

            if (error) {
                console.error('Error loading clients:', error)
                return
            }

            if (data) {
                setClients(data)
                calculateStats(data)
            }
        } catch (error) {
            console.error('Error loading clients:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (allClients: Client[]) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const newThisMonth = allClients.filter(c =>
            new Date(c.created_at) >= startOfMonth
        ).length

        const totalProspects = allClients.filter(c => c.status === 'prospect').length
        const totalClients = allClients.filter(c => c.status === 'client').length
        const conversionRate = totalProspects > 0 ? Math.round((totalClients / totalProspects) * 100) : 0

        setStats({
            total: allClients.length,
            leads: allClients.filter(c => c.status === 'lead').length,
            prospects: totalProspects,
            clients: totalClients,
            inactive: allClients.filter(c => c.status === 'inactive').length,
            hotLeads: allClients.filter(c => c.status === 'lead' && c.priority === 'high').length,
            overdueFollowUps: allClients.filter(c =>
                c.next_follow_up && new Date(c.next_follow_up) < now
            ).length,
            newThisMonth,
            conversionRate
        })
    }

    const getStatusConfig = (status: string) => {
        const configs = {
            lead: {
                badge: 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200',
                icon: <Zap className="h-3 w-3" />,
                label: 'Lead'
            },
            prospect: {
                badge: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200',
                icon: <Target className="h-3 w-3" />,
                label: 'Prospect'
            },
            client: {
                badge: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
                icon: <CheckCircle2 className="h-3 w-3" />,
                label: 'Cliente'
            },
            inactive: {
                badge: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-200',
                icon: <Clock className="h-3 w-3" />,
                label: 'Inativo'
            }
        }
        return configs[status as keyof typeof configs] || configs.lead
    }

    const getSourceIcon = (source: string) => {
        const icons = {
            'site': Globe,
            'facebook': Users,
            'google': Search,
            'indicacao': Heart,
            'whatsapp': MessageSquare,
            'telefone': Phone,
            'email': Mail,
            'outros': Activity
        }
        return icons[source as keyof typeof icons] || Activity
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const getLastContactDays = (lastContact?: string) => {
        if (!lastContact) return 0
        const now = new Date()
        const contact = new Date(lastContact)
        return Math.floor((now.getTime() - contact.getTime()) / (1000 * 60 * 60 * 24))
    }

    const formatLastContact = (lastContact?: string) => {
        if (!lastContact) return 'Nunca'
        const days = getLastContactDays(lastContact)
        if (days === 0) return 'Hoje'
        if (days === 1) return 'Ontem'
        if (days < 7) return `${days} dias atrás`
        if (days < 30) return `${Math.floor(days / 7)} semanas atrás`
        return `${Math.floor(days / 30)} meses atrás`
    }

    const getPriorityConfig = (priority: string) => {
        const configs = {
            low: { color: 'text-green-600', label: 'Baixa' },
            medium: { color: 'text-yellow-600', label: 'Média' },
            high: { color: 'text-red-600', label: 'Alta' }
        }
        return configs[priority as keyof typeof configs] || configs.medium
    }

    const isFollowUpOverdue = (date?: string) => {
        if (!date) return false
        return new Date(date) < new Date()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
                >
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-blue-600 bg-clip-text text-transparent">
                            CRM Imobiliário
                        </h1>
                        <p className="text-gray-600 mt-2 flex items-center gap-2 text-sm sm:text-base">
                            <Users className="h-4 sm:h-5 w-4 sm:w-5" />
                            Gestão avançada de clientes, leads e vendas
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
                        <button
                            onClick={loadClients}
                            className="p-2 sm:p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                            title="Atualizar"
                        >
                            <RefreshCw className="h-4 sm:h-5 w-4 sm:w-5" />
                        </button>

                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 sm:p-3 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Grid3x3 className="h-4 sm:h-5 w-4 sm:w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 sm:p-3 rounded-lg transition-all ${viewMode === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <List className="h-4 sm:h-5 w-4 sm:w-5" />
                            </button>
                        </div>

                        <button
                            onClick={() => setShowClientModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-1 lg:flex-none justify-center"
                        >
                            <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
                            <span className="hidden sm:inline">Novo Cliente</span>
                            <span className="sm:hidden">Novo</span>
                        </button>
                    </div>
                </motion.div>

                {/* Advanced Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-2 sm:px-0"
                >
                    <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <Users className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
                            <span className="text-xl sm:text-3xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total de Clientes</div>
                        <div className="flex items-center mt-1 sm:mt-2">
                            <ArrowUpRight className="h-3 sm:h-4 w-3 sm:w-4 text-green-500" />
                            <span className="text-green-600 text-xs sm:text-sm ml-1">+{stats.newThisMonth} este mês</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-orange-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <Zap className="h-6 sm:h-8 w-6 sm:w-8 text-orange-600" />
                            <span className="text-xl sm:text-3xl font-bold text-orange-700">{stats.leads}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-orange-600">Leads Quentes</div>
                        <div className="text-xs text-orange-500 mt-1 sm:mt-2 hidden sm:block">Novos contatos</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-yellow-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <Target className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-600" />
                            <span className="text-xl sm:text-3xl font-bold text-yellow-700">{stats.prospects}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-yellow-600">Prospects</div>
                        <div className="text-xs text-yellow-500 mt-1 sm:mt-2 hidden sm:block">Em qualificação</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-green-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <CheckCircle2 className="h-6 sm:h-8 w-6 sm:w-8 text-green-600" />
                            <span className="text-xl sm:text-3xl font-bold text-green-700">{stats.clients}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-green-600">Clientes Ativos</div>
                        <div className="text-xs text-green-500 mt-1 sm:mt-2 hidden sm:block">Negócios fechados</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-red-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <Star className="h-6 sm:h-8 w-6 sm:w-8 text-red-600" />
                            <span className="text-xl sm:text-3xl font-bold text-red-700">{stats.hotLeads}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-red-600">Alta Prioridade</div>
                        <div className="text-xs text-red-500 mt-1 sm:mt-2 hidden sm:block">Leads prioritários</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-purple-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-purple-600" />
                            <span className="text-xl sm:text-3xl font-bold text-purple-700">{stats.conversionRate}%</span>
                        </div>
                        <div className="text-xs sm:text-sm text-purple-600">Taxa de Conversão</div>
                        <div className="text-xs text-purple-500 mt-1 sm:mt-2 hidden sm:block">Prospects → Clientes</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-6 shadow-sm border border-amber-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                            <AlertCircle className="h-6 sm:h-8 w-6 sm:w-8 text-amber-600" />
                            <span className="text-xl sm:text-3xl font-bold text-amber-700">{stats.overdueFollowUps}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-amber-600">Follow-ups Atrasados</div>
                        <div className="text-xs text-amber-500 mt-1 sm:mt-2 hidden sm:block">Requer atenção</div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Buscar clientes por nome, telefone ou email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Todos os Status</option>
                                <option value="lead">Leads</option>
                                <option value="prospect">Prospects</option>
                                <option value="client">Clientes</option>
                                <option value="inactive">Inativos</option>
                            </select>

                            <select
                                value={assignedFilter}
                                onChange={(e) => setAssignedFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Todos os Corretores</option>
                                <option value="me">Meus Clientes</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Clients Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center py-12"
                        >
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando clientes...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        >
                            {filteredClients.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
                                    <p className="text-gray-600">Tente ajustar os filtros ou adicionar um novo cliente.</p>
                                </div>
                            ) : (
                                filteredClients.map((client, index) => {
                                    const statusConfig = getStatusConfig(client.status)
                                    const lastContactDays = getLastContactDays(client.last_contact)
                                    const followUpOverdue = client.next_follow_up ? isFollowUpOverdue(client.next_follow_up) : false

                                    return (
                                        <motion.div
                                            key={client.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">
                                                            {client.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusConfig.badge}`}>
                                                                <div className="flex items-center gap-1">
                                                                    {statusConfig.icon}
                                                                    {statusConfig.label}
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2 mb-4">
                                                {client.email && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="h-4 w-4" />
                                                        <span className="truncate">{client.email}</span>
                                                    </div>
                                                )}
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{client.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="font-medium text-gray-900">Último Contato</div>
                                                    <div className={lastContactDays > 7 ? 'text-red-600' : 'text-gray-600'}>
                                                        {formatLastContact(client.last_contact)}
                                                    </div>
                                                </div>
                                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                                    <div className="font-medium text-gray-900">Interesse</div>
                                                    <div className="capitalize">{client.property_type || 'Não definido'}</div>
                                                </div>
                                            </div>

                                            {/* Next Follow-up */}
                                            {client.next_follow_up && (
                                                <div className={`text-sm p-3 rounded-lg ${followUpOverdue
                                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    }`}>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="font-medium">
                                                            {followUpOverdue ? 'Follow-up em Atraso' : 'Próximo Follow-up'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        {new Date(client.next_follow_up).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Client Modal - Replace with new ClientModal */}
                <ClientModal
                    isOpen={showClientModal}
                    onClose={() => setShowClientModal(false)}
                    onSave={() => {
                        setShowClientModal(false)
                        loadClients()
                    }}
                />

                {/* Client Details Modal */}
                <AnimatePresence>
                    {selectedClient && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setSelectedClient(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                                        <p className="text-gray-600 mt-1">{selectedClient.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedClient(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Informações de Contato</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Telefone</label>
                                                <p className="font-medium">{selectedClient.phone || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Status</label>
                                                <p className="font-medium capitalize">{selectedClient.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Histórico de Atividades</h3>
                                        <div className="space-y-3">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-900">Último contato</span>
                                                    <span className="text-sm text-gray-600">
                                                        {formatLastContact(selectedClient.last_contact)}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedClient.next_follow_up && (
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-blue-900">Próximo follow-up</span>
                                                        <span className="text-sm text-blue-600">
                                                            {new Date(selectedClient.next_follow_up).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
