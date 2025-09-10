// app/dashboard/components/modules/crm/ClientList.tsx
'use client'

import { useState } from 'react'
import { Search, Filter, Plus, User, Phone, Mail, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'
import { Client } from '@/lib/supabase/crm-service'

interface ClientListProps {
    clients: Client[]
    loading?: boolean
    onRefresh?: () => void
}

export function ClientList({ clients, loading = false, onRefresh }: ClientListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone?.includes(searchTerm)

        const matchesStatus = statusFilter === 'all' || client.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'lead': return 'bg-yellow-100 text-yellow-800'
            case 'prospect': return 'bg-blue-100 text-blue-800'
            case 'client': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getTransactionIcon = (transaction: string) => {
        switch (transaction) {
            case 'buy': return '🏠'
            case 'sell': return '💰'
            case 'rent': return '🔑'
            default: return '📋'
        }
    }

    const formatBudget = (min?: number, max?: number) => {
        if (!min && !max) return 'Não informado'
        if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`
        if (min) return `A partir de R$ ${min.toLocaleString()}`
        if (max) return `Até R$ ${max.toLocaleString()}`
        return 'Não informado'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header com Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="lead">Leads</option>
                        <option value="prospect">Prospects</option>
                        <option value="client">Clientes</option>
                        <option value="inactive">Inativos</option>
                    </select>

                    <Link
                        href="/dashboard/clients/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </Link>
                </div>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                {filteredClients.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || statusFilter !== 'all' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Tente ajustar os filtros de busca'
                                : 'Comece adicionando seu primeiro cliente'
                            }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Link
                                href="/dashboard/clients/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Cliente
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                            <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                            </span>
                                            <span className="text-lg">{getTransactionIcon(client.transaction_type || 'buy')}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {client.email || 'Email não informado'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {client.phone || 'Telefone não informado'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                {formatBudget(client.budget_min, client.budget_max)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/clients/${client.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Ver detalhes"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer com Estatísticas */}
            {filteredClients.length > 0 && (
                <div className="text-sm text-gray-500 text-center">
                    Mostrando {filteredClients.length} de {clients.length} clientes
                </div>
            )}
        </div>
    )
}
