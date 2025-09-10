'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { CRMService, Client } from '@/lib/supabase/crm-service'
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
    Grid3x3,
    List
} from 'lucide-react'

export default function ClientsPage() {
    const { user } = useCurrentUser()
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'lead' | 'prospect' | 'client' | 'inactive'>('all')
    const [assignedFilter, setAssignedFilter] = useState<'all' | 'me' | string>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [quickActions, setQuickActions] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        leads: 0,
        prospects: 0,
        clients: 0,
        inactive: 0,
        hotLeads: 0,
        overdueFollowUps: 0
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

                // Advanced stats calculation
                const now = new Date()
                setStats({
                    total: data.length,
                    leads: data.filter(c => c.status === 'lead').length,
                    prospects: data.filter(c => c.status === 'prospect').length,
                    clients: data.filter(c => c.status === 'client').length,
                    inactive: data.filter(c => c.status === 'inactive').length,
                    hotLeads: data.filter(c => c.status === 'lead' && c.priority === 'high').length,
                    overdueFollowUps: data.filter(c =>
                        c.next_follow_up && new Date(c.next_follow_up) < now
                    ).length
                })
            }
        } catch (error) {
            console.error('Error loading clients:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusConfig = (status: string) => {
        const configs = {
            lead: {
                badge: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200',
                icon: <Zap className="h-3 w-3" />,
                label: 'Lead Quente'
            },
            prospect: {
                badge: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200',
                icon: <Target className="h-3 w-3" />,
                label: 'Prospecto'
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

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-green-500'
            default: return 'text-gray-400'
        }
    }

    const formatBudget = (min?: number, max?: number) => {
        if (!min && !max) return 'A negociar'
        if (!max) return `A partir de R$ ${min?.toLocaleString()}`
        if (!min) return `Até R$ ${max?.toLocaleString()}`
        return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`
    }

    const isFollowUpOverdue = (date?: string) => {
        if (!date) return false
        return new Date(date) < new Date()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Pipeline de Clientes
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Gerencie leads, prospectos e fechamentos
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-all ${viewMode === 'grid'
                                        ? 'bg-amber-100 text-amber-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-all ${viewMode === 'list'
                                        ? 'bg-amber-100 text-amber-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <Link
                            href="/dashboard/clients/new"
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5" />
                            Novo Cliente
                        </Link>
                    </div>
                </motion.div>

                {/* Advanced Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <div className="text-sm text-gray-600">Total de Contatos</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Zap className="h-8 w-8 text-yellow-600" />
                            <span className="text-3xl font-bold text-yellow-700">{stats.leads}</span>
                        </div>
                        <div className="text-sm text-yellow-600">Leads Ativos</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Target className="h-8 w-8 text-blue-600" />
                            <span className="text-3xl font-bold text-blue-700">{stats.prospects}</span>
                        </div>
                        <div className="text-sm text-blue-600">Prospectos</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Building2 className="h-8 w-8 text-green-600" />
                            <span className="text-3xl font-bold text-green-700">{stats.clients}</span>
                        </div>
                        <div className="text-sm text-green-600">Clientes</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Star className="h-8 w-8 text-red-600" />
                            <span className="text-3xl font-bold text-red-700">{stats.hotLeads}</span>
                        </div>
                        <div className="text-sm text-red-600">Leads Quentes</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <AlertCircle className="h-8 w-8 text-orange-600" />
                            <span className="text-3xl font-bold text-orange-700">{stats.overdueFollowUps}</span>
                        </div>
                        <div className="text-sm text-orange-600">Follow-ups Atrasados</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <Clock className="h-8 w-8 text-gray-600" />
                            <span className="text-3xl font-bold text-gray-900">{stats.inactive}</span>
                        </div>
                        <div className="text-sm text-gray-600">Inativos</div>
                    </div>
                </motion.div>

                {/* Enhanced Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search with enhanced styling */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, email, telefone ou cidade..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Enhanced Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[160px]"
                                >
                                    <option value="all">Todos os status</option>
                                    <option value="lead">🔥 Leads</option>
                                    <option value="prospect">🎯 Prospectos</option>
                                    <option value="client">✅ Clientes</option>
                                    <option value="inactive">⏸️ Inativos</option>
                                </select>
                            </div>

                            <select
                                value={assignedFilter}
                                onChange={(e) => setAssignedFilter(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[180px]"
                            >
                                <option value="all">Todos os responsáveis</option>
                                <option value="me">👤 Meus clientes</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Clients Display */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center py-20"
                        >
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent absolute top-0"></div>
                            </div>
                        </motion.div>
                    ) : clients.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-10 w-10 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum cliente encontrado</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Tente ajustar os filtros para encontrar clientes ou adicione novos contatos.'
                                    : 'Comece adicionando seu primeiro cliente para construir seu pipeline de vendas.'}
                            </p>
                            <Link
                                href="/dashboard/clients/new"
                                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="h-5 w-5" />
                                Adicionar Primeiro Cliente
                            </Link>
                        </motion.div>
                    ) : viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {clients.map((client, index) => {
                                const statusConfig = getStatusConfig(client.status)
                                return (
                                    <motion.div
                                        key={client.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group"
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-amber-700">
                                                        {client.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                        {client.name}
                                                    </h3>
                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.badge}`}>
                                                        {statusConfig.icon}
                                                        {statusConfig.label}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {client.priority && (
                                                    <Star className={`h-4 w-4 ${getPriorityColor(client.priority)}`} fill="currentColor" />
                                                )}
                                                <button className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </button>
                                            </div>
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
                                            {client.city && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{client.city}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Budget & Follow-up */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span className="text-gray-700 font-medium">
                                                    {formatBudget(client.budget_min, client.budget_max)}
                                                </span>
                                            </div>
                                            {client.next_follow_up && (
                                                <div className={`flex items-center gap-2 text-sm ${isFollowUpOverdue(client.next_follow_up) ? 'text-red-600' : 'text-gray-600'
                                                    }`}>
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        Follow-up: {new Date(client.next_follow_up).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <Link
                                                href={`/dashboard/clients/${client.id}`}
                                                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/dashboard/clients/${client.id}/edit`}
                                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Editar
                                            </Link>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Contato
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Orçamento
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Follow-up
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {clients.map((client, index) => {
                                            const statusConfig = getStatusConfig(client.status)
                                            return (
                                                <motion.tr
                                                    key={client.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                                <span className="text-sm font-semibold text-amber-700">
                                                                    {client.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-900">{client.name}</div>
                                                                {client.source && (
                                                                    <div className="text-xs text-gray-500 capitalize">
                                                                        {client.source.replace('_', ' ')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {client.priority && (
                                                                <Star className={`h-4 w-4 ${getPriorityColor(client.priority)}`} fill="currentColor" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <div className="space-y-1">
                                                            {client.email && (
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-3 w-3" />
                                                                    <span className="truncate max-w-[200px]">{client.email}</span>
                                                                </div>
                                                            )}
                                                            {client.phone && (
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="h-3 w-3" />
                                                                    <span>{client.phone}</span>
                                                                </div>
                                                            )}
                                                            {client.city && (
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span>{client.city}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
                                                            {statusConfig.icon}
                                                            {statusConfig.label}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">
                                                                {formatBudget(client.budget_min, client.budget_max)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {client.next_follow_up ? (
                                                            <div className={`flex items-center gap-2 ${isFollowUpOverdue(client.next_follow_up)
                                                                    ? 'text-red-600 font-medium'
                                                                    : 'text-gray-600'
                                                                }`}>
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {new Date(client.next_follow_up).toLocaleDateString('pt-BR')}
                                                                </span>
                                                                {isFollowUpOverdue(client.next_follow_up) && (
                                                                    <AlertCircle className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">Não agendado</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/dashboard/clients/${client.id}`}
                                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                title="Ver detalhes"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={`/dashboard/clients/${client.id}/edit`}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}