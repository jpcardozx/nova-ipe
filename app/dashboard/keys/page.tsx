'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Key,
    Home,
    User,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    Download,
    MapPin,
    Phone,
    Mail,
    FileText,
    TrendingUp
} from 'lucide-react'

interface KeyDelivery {
    id: string
    lead_id: string
    property_id: string
    client_name: string
    client_email: string
    client_phone: string
    property_title: string
    property_address: string
    delivery_status: 'scheduled' | 'delivered' | 'returned' | 'pending' | 'cancelled'
    scheduled_date?: string
    delivered_date?: string
    returned_date?: string
    notes?: string
    broker_name: string
    contract_id?: string
    deposit_amount?: number
    keys_count: number
    created_at: string
    updated_at: string
}

export default function KeysPage() {
    const [deliveries, setDeliveries] = useState<KeyDelivery[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | KeyDelivery['delivery_status']>('all')
    const [stats, setStats] = useState({
        total: 0,
        scheduled: 0,
        delivered: 0,
        pending: 0,
        returned: 0
    })

    useEffect(() => {
        loadKeyDeliveries()
    }, [])

    const loadKeyDeliveries = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/keys')
            const data = await response.json()

            if (response.ok) {
                setDeliveries(data.deliveries)
                setStats(data.stats)
            } else {
                console.error('Error loading key deliveries:', data.error)
                // Fallback para dados mock em caso de erro
                loadMockData()
            }
        } catch (error) {
            console.error('Error loading key deliveries:', error)
            // Fallback para dados mock em caso de erro
            loadMockData()
        } finally {
            setLoading(false)
        }
    }

    const loadMockData = () => {
        // Mock data for development/fallback
        const mockDeliveries: KeyDelivery[] = [
            {
                id: '1',
                lead_id: 'lead-123',
                property_id: 'prop-456',
                client_name: 'João Silva',
                client_email: 'joao@email.com',
                client_phone: '(11) 99999-1234',
                property_title: 'Apartamento 3 Quartos - Pinheiros',
                property_address: 'Rua dos Pinheiros, 1234 - Pinheiros, SP',
                delivery_status: 'delivered',
                scheduled_date: '2025-10-09T10:00:00Z',
                delivered_date: '2025-10-09T10:30:00Z',
                broker_name: 'Maria Corretora',
                contract_id: 'CTR-2025-001',
                deposit_amount: 500,
                keys_count: 2,
                notes: 'Chaves entregues com termo de responsabilidade assinado.',
                created_at: '2025-10-05T14:00:00Z',
                updated_at: '2025-10-09T10:30:00Z'
            },
            {
                id: '2',
                lead_id: 'lead-456',
                property_id: 'prop-789',
                client_name: 'Ana Costa',
                client_email: 'ana@email.com',
                client_phone: '(11) 98888-5678',
                property_title: 'Casa em Condomínio - Vila Madalena',
                property_address: 'Rua Harmonia, 567 - Vila Madalena, SP',
                delivery_status: 'scheduled',
                scheduled_date: '2025-10-12T14:00:00Z',
                broker_name: 'Carlos Corretor',
                keys_count: 3,
                notes: 'Cliente solicitou entrega após às 14h',
                created_at: '2025-10-08T09:00:00Z',
                updated_at: '2025-10-08T09:00:00Z'
            },
            {
                id: '3',
                lead_id: 'lead-789',
                property_id: 'prop-321',
                client_name: 'Pedro Santos',
                client_email: 'pedro@email.com',
                client_phone: '(11) 97777-4321',
                property_title: 'Apartamento Studio - Jardins',
                property_address: 'Alameda Jaú, 890 - Jardins, SP',
                delivery_status: 'pending',
                broker_name: 'Luciana Corretora',
                keys_count: 1,
                notes: 'Aguardando confirmação do cliente',
                created_at: '2025-10-10T11:00:00Z',
                updated_at: '2025-10-10T11:00:00Z'
            }
        ]

        setDeliveries(mockDeliveries)
        calculateStats(mockDeliveries)
    }

    const calculateStats = (data: KeyDelivery[]) => {
        setStats({
            total: data.length,
            scheduled: data.filter(d => d.delivery_status === 'scheduled').length,
            delivered: data.filter(d => d.delivery_status === 'delivered').length,
            pending: data.filter(d => d.delivery_status === 'pending').length,
            returned: data.filter(d => d.delivery_status === 'returned').length
        })
    }

    const getStatusConfig = (status: KeyDelivery['delivery_status']) => {
        const configs = {
            scheduled: {
                label: 'Agendado',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                icon: <Calendar className="h-3 w-3" />
            },
            delivered: {
                label: 'Entregue',
                color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
                icon: <CheckCircle className="h-3 w-3" />
            },
            returned: {
                label: 'Devolvido',
                color: 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
                icon: <CheckCircle className="h-3 w-3" />
            },
            pending: {
                label: 'Pendente',
                color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
                icon: <AlertCircle className="h-3 w-3" />
            },
            cancelled: {
                label: 'Cancelado',
                color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
                icon: <XCircle className="h-3 w-3" />
            }
        }
        return configs[status]
    }

    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesSearch =
            delivery.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.property_address.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || delivery.delivery_status === statusFilter

        return matchesSearch && matchesStatus
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Gestão de Chaves
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Controle de entregas e devoluções
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadKeyDeliveries}
                        className="px-4 py-2 bg-surface border border-border text-foreground rounded-lg 
                                 hover:bg-surface-hover transition-colors flex items-center gap-2
                                 shadow-sm hover:shadow-md"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Atualizar
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 
                                     dark:from-blue-500 dark:to-cyan-500
                                     text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 
                                     dark:hover:from-blue-600 dark:hover:to-cyan-600
                                     transition-all flex items-center gap-2 
                                     shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
            >
                <div className="bg-surface rounded-xl p-6 border border-border shadow-sm 
                              hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 
                                      dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                            <Key className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm
                              hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Agendados</p>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.scheduled}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 
                                      dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-sm
                              hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400">Entregues</p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.delivered}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 
                                      dark:from-green-900/50 dark:to-green-800/50 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 shadow-sm
                              hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pendentes</p>
                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 
                                      dark:from-yellow-900/50 dark:to-yellow-800/50 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-border shadow-sm
                              hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Devolvidos</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{stats.returned}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 
                                      dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface rounded-xl p-6 border border-border shadow-sm mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, imóvel ou endereço..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg 
                                     text-foreground placeholder:text-muted-foreground
                                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                     focus:border-blue-500 dark:focus:border-blue-400
                                     transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg 
                                     text-foreground appearance-none cursor-pointer
                                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                     focus:border-blue-500 dark:focus:border-blue-400
                                     transition-colors"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="scheduled">Agendados</option>
                            <option value="delivered">Entregues</option>
                            <option value="pending">Pendentes</option>
                            <option value="returned">Devolvidos</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Deliveries List */}
            <div className="space-y-4">
                {filteredDeliveries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-surface rounded-xl p-12 text-center border border-border"
                    >
                        <Key className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">Nenhuma entrega encontrada</p>
                        <p className="text-sm text-muted-foreground/70 mt-2">
                            Tente ajustar os filtros ou buscar por outro termo
                        </p>
                    </motion.div>
                ) : (
                    filteredDeliveries.map((delivery, index) => {
                        const statusConfig = getStatusConfig(delivery.delivery_status)

                        return (
                            <motion.div
                                key={delivery.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-surface rounded-xl p-6 border border-border 
                                         hover:shadow-lg hover:border-border-hover 
                                         transition-all duration-200 group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 
                                                          dark:from-blue-900/50 dark:to-cyan-900/50 
                                                          flex items-center justify-center flex-shrink-0">
                                                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-foreground 
                                                                 group-hover:text-blue-600 dark:group-hover:text-blue-400 
                                                                 transition-colors">
                                                        {delivery.property_title}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                                                        {statusConfig.icon}
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                    <span className="line-clamp-1">{delivery.property_address}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Key className="h-4 w-4" />
                                                        {delivery.keys_count} {delivery.keys_count === 1 ? 'chave' : 'chaves'}
                                                    </span>
                                                    {delivery.contract_id && (
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="font-mono text-xs">{delivery.contract_id}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Client Info */}
                                        <div className="ml-16 space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">{delivery.client_name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 
                                                               transition-colors cursor-pointer">
                                                    <Phone className="h-4 w-4" />
                                                    {delivery.client_phone}
                                                </span>
                                                <span className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 
                                                               transition-colors cursor-pointer">
                                                    <Mail className="h-4 w-4" />
                                                    {delivery.client_email}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {delivery.notes && (
                                            <div className="ml-16 mt-3 p-3 bg-background/50 dark:bg-background/30 
                                                          border border-border rounded-lg">
                                                <p className="text-sm text-foreground/80">{delivery.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Section - Dates */}
                                    <div className="lg:text-right space-y-3 lg:min-w-[220px] 
                                                  border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                                        {delivery.scheduled_date && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Agendado para</p>
                                                <p className="font-semibold text-foreground flex items-center gap-2 lg:justify-end">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    {formatDate(delivery.scheduled_date)}
                                                </p>
                                            </div>
                                        )}
                                        {delivery.delivered_date && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Entregue em</p>
                                                <p className="font-semibold text-green-600 dark:text-green-400 
                                                            flex items-center gap-2 lg:justify-end">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {formatDate(delivery.delivered_date)}
                                                </p>
                                            </div>
                                        )}
                                        {delivery.returned_date && (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">Devolvido em</p>
                                                <p className="font-semibold text-foreground flex items-center gap-2 lg:justify-end">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {formatDate(delivery.returned_date)}
                                                </p>
                                            </div>
                                        )}
                                        <div className="text-sm pt-2 border-t border-border">
                                            <p className="text-muted-foreground text-xs">Corretor</p>
                                            <p className="font-medium text-foreground">{delivery.broker_name}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
