'use client'

import { useState, useEffect } from 'react'
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
    Clock
} from 'lucide-react'

export default function ClientsPage() {
    const { user } = useCurrentUser()
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'lead' | 'prospect' | 'client' | 'inactive'>('all')
    const [assignedFilter, setAssignedFilter] = useState<'all' | 'me' | string>('all')
    const [stats, setStats] = useState({
        total: 0,
        leads: 0,
        prospects: 0,
        clients: 0,
        inactive: 0
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
                console.warn('Error loading clients:', error)
                // Set empty state instead of breaking
                setClients([])
                setStats({
                    total: 0,
                    leads: 0,
                    prospects: 0,
                    clients: 0,
                    inactive: 0
                })
                return
            }

            if (data) {
                setClients(data)

                // Calculate stats
                setStats({
                    total: data.length,
                    leads: data.filter(c => c.status === 'lead').length,
                    prospects: data.filter(c => c.status === 'prospect').length,
                    clients: data.filter(c => c.status === 'client').length,
                    inactive: data.filter(c => c.status === 'inactive').length
                })
            } else {
                // Fallback to empty state
                setClients([])
                setStats({
                    total: 0,
                    leads: 0,
                    prospects: 0,
                    clients: 0,
                    inactive: 0
                })
            }
        } catch (error) {
            console.warn('Error loading clients:', error)
            // Set empty state on error
            setClients([])
            setStats({
                total: 0,
                leads: 0,
                prospects: 0,
                clients: 0,
                inactive: 0
            })
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            lead: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            prospect: 'bg-blue-100 text-blue-800 border-blue-200',
            client: 'bg-green-100 text-green-800 border-green-200',
            inactive: 'bg-gray-100 text-gray-800 border-gray-200'
        }

        const statusLabels = {
            lead: 'Lead',
            prospect: 'Prospecto',
            client: 'Cliente',
            inactive: 'Inativo'
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
                {statusLabels[status as keyof typeof statusLabels]}
            </span>
        )
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'website': return <Building2 className="h-4 w-4" />
            case 'referral': return <Users className="h-4 w-4" />
            case 'social_media': return <TrendingUp className="h-4 w-4" />
            default: return <User className="h-4 w-4" />
        }
    }

    const formatBudget = (min?: number, max?: number) => {
        if (!min && !max) return 'Não informado'
        if (!max) return `A partir de R$ ${min?.toLocaleString()}`
        if (!min) return `Até R$ ${max?.toLocaleString()}`
        return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`
    }

    const isFollowUpOverdue = (date?: string) => {
        if (!date) return false
        return new Date(date) < new Date()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">CRM - Clientes</h1>
                    <p className="text-gray-600">Gerencie sua carteira de clientes e prospects</p>
                </div>
                <Link
                    href="/dashboard/clients/new"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Novo Cliente
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                        <span className="text-2xl font-bold text-gray-900">{stats.leads}</span>
                    </div>
                    <div className="text-sm text-gray-600">Leads</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <User className="h-6 w-6 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">{stats.prospects}</span>
                    </div>
                    <div className="text-sm text-gray-600">Prospectos</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Building2 className="h-6 w-6 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">{stats.clients}</span>
                    </div>
                    <div className="text-sm text-gray-600">Clientes</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="h-6 w-6 text-gray-600" />
                        <span className="text-2xl font-bold text-gray-900">{stats.inactive}</span>
                    </div>
                    <div className="text-sm text-gray-600">Inativos</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou telefone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os status</option>
                            <option value="lead">Leads</option>
                            <option value="prospect">Prospectos</option>
                            <option value="client">Clientes</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>

                    {/* Assignment Filter */}
                    <div>
                        <select
                            value={assignedFilter}
                            onChange={(e) => setAssignedFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os responsáveis</option>
                            <option value="me">Meus clientes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Clients List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {clients.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Tente ajustar os filtros para encontrar clientes.'
                                    : 'Adicione seu primeiro cliente para começar.'}
                            </p>
                            <Link
                                href="/dashboard/clients/new"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                Adicionar Primeiro Cliente
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orçamento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Follow-up
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-amber-800">
                                                                {client.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                                        {client.source && (
                                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                {getSourceIcon(client.source)}
                                                                <span className="capitalize">{client.source.replace('_', ' ')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    {client.email && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-4 w-4" />
                                                            <span>{client.email}</span>
                                                        </div>
                                                    )}
                                                    {client.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            <span>{client.phone}</span>
                                                        </div>
                                                    )}
                                                    {client.city && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{client.city}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(client.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>{formatBudget(client.budget_min, client.budget_max)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {client.next_follow_up ? (
                                                    <div className={`flex items-center gap-1 ${isFollowUpOverdue(client.next_follow_up) ? 'text-red-600' : 'text-gray-500'
                                                        }`}>
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(client.next_follow_up).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">Não agendado</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/dashboard/clients/${client.id}`}
                                                        className="text-amber-600 hover:text-amber-900 transition-colors"
                                                        title="Ver detalhes"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/clients/${client.id}/edit`}
                                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}