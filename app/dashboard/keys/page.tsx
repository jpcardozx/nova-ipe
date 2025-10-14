'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    TrendingUp,
    Plus,
    X,
    Edit,
    Trash2,
    MoreVertical,
    ArrowRight,
    Package
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

export default function KeysPagePremium() {
    const [deliveries, setDeliveries] = useState<KeyDelivery[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | KeyDelivery['delivery_status']>('all')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedDelivery, setSelectedDelivery] = useState<KeyDelivery | null>(null)
    const [showMenu, setShowMenu] = useState<string | null>(null)
    
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
                loadMockData()
            }
        } catch (error) {
            console.error('Error loading key deliveries:', error)
            loadMockData()
        } finally {
            setLoading(false)
        }
    }

    const loadMockData = () => {
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
                scheduled_date: '2025-10-14T14:00:00Z',
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
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600',
                dotColor: 'bg-blue-500',
                icon: <Calendar className="h-4 w-4" />
            },
            delivered: {
                label: 'Entregue',
                color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-600',
                dotColor: 'bg-emerald-500',
                icon: <CheckCircle className="h-4 w-4" />
            },
            returned: {
                label: 'Devolvido',
                color: 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600',
                dotColor: 'bg-gray-500',
                icon: <CheckCircle className="h-4 w-4" />
            },
            pending: {
                label: 'Pendente',
                color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-600',
                dotColor: 'bg-orange-500',
                icon: <AlertCircle className="h-4 w-4" />
            },
            cancelled: {
                label: 'Cancelado',
                color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-600',
                dotColor: 'bg-red-500',
                icon: <XCircle className="h-4 w-4" />
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
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        })
    }

    const handleUpdateStatus = async (delivery: KeyDelivery, newStatus: KeyDelivery['delivery_status']) => {
        try {
            const response = await fetch('/api/keys', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: delivery.lead_id,
                    status: newStatus,
                    date: new Date().toISOString()
                })
            })

            if (response.ok) {
                loadKeyDeliveries()
                setShowMenu(null)
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="text-muted-foreground text-sm">Carregando entregas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 
                                     dark:from-amber-400 dark:via-amber-300 dark:to-amber-400 
                                     bg-clip-text text-transparent mb-2">
                            Gestão de Chaves
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                            <Package className="h-5 w-5 text-amber-500" />
                            Controle completo de entregas e devoluções
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={loadKeyDeliveries}
                            className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 
                                     dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl 
                                     hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600
                                     transition-all flex items-center gap-2 font-semibold"
                        >
                            <TrendingUp className="h-5 w-5" />
                            Atualizar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                                     hover:from-amber-400 hover:to-amber-500
                                     text-white rounded-xl hover:shadow-xl hover:shadow-amber-500/40
                                     transition-all flex items-center gap-2 font-semibold"
                        >
                            <Plus className="h-5 w-5" />
                            Nova Entrega
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                    {[
                        { label: 'Total', value: stats.total, icon: Key, gradient: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/10', borderColor: 'border-amber-200 dark:border-amber-800/30' },
                        { label: 'Agendados', value: stats.scheduled, icon: Calendar, gradient: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/10', borderColor: 'border-blue-200 dark:border-blue-800/30' },
                        { label: 'Entregues', value: stats.delivered, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/10', borderColor: 'border-emerald-200 dark:border-emerald-800/30' },
                        { label: 'Pendentes', value: stats.pending, icon: AlertCircle, gradient: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/10', borderColor: 'border-orange-200 dark:border-orange-800/30' },
                        { label: 'Devolvidos', value: stats.returned, icon: CheckCircle, gradient: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20', borderColor: 'border-gray-200 dark:border-gray-700/50' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${stat.bgColor} rounded-2xl p-5 border-2 ${stat.borderColor}
                                     hover:shadow-xl transition-all duration-200 group cursor-pointer`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{stat.label}</span>
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} 
                                              flex items-center justify-center shadow-lg transform 
                                              group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                             rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 
                                            text-amber-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, imóvel ou endereço..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800
                                         border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                                         text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium
                                         focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 
                                         focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 
                                             text-amber-500 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800
                                         border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                                         text-gray-900 dark:text-white appearance-none cursor-pointer font-medium
                                         focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 
                                         focus:border-amber-500 dark:focus:border-amber-400 transition-all"
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
                    <AnimatePresence mode="popLayout">
                        {filteredDeliveries.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 
                                         rounded-2xl p-16 text-center border-2 border-amber-200 dark:border-gray-700"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br 
                                              from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30
                                              flex items-center justify-center">
                                    <Key className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-gray-900 dark:text-white text-lg font-bold mb-2">
                                    Nenhuma entrega encontrada
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    Tente ajustar os filtros ou criar uma nova entrega
                                </p>
                            </motion.div>
                        ) : (
                            filteredDeliveries.map((delivery, index) => {
                                const statusConfig = getStatusConfig(delivery.delivery_status)

                                return (
                                    <motion.div
                                        key={delivery.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 
                                                 border-2 border-gray-200 dark:border-gray-700
                                                 hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-500
                                                 transition-all duration-300 group relative overflow-hidden"
                                    >
                                        {/* Background Gradient on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-amber-400/3 to-transparent
                                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="relative">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Left Section */}
                                                <div className="flex-1 space-y-4">
                                                    {/* Property Info */}
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 
                                                                      flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                                                            <Home className="h-7 w-7 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white
                                                                             group-hover:text-amber-600 dark:group-hover:text-amber-400 
                                                                             transition-colors line-clamp-2">
                                                                    {delivery.property_title}
                                                                </h3>
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 
                                                                                rounded-lg text-xs font-semibold ${statusConfig.color} 
                                                                                whitespace-nowrap flex-shrink-0`}>
                                                                    <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} 
                                                                                   animate-pulse`}></span>
                                                                    {statusConfig.label}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                <MapPin className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                                                <span className="line-clamp-1">{delivery.property_address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                                                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                                                    <Key className="h-4 w-4 text-amber-500" />
                                                                    <span className="font-semibold">{delivery.keys_count}</span>
                                                                    {delivery.keys_count === 1 ? 'chave' : 'chaves'}
                                                                </span>
                                                                {delivery.contract_id && (
                                                                    <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                                                        <FileText className="h-4 w-4 text-amber-500" />
                                                                        <span className="font-mono text-xs px-2 py-1 bg-amber-50 dark:bg-amber-900/20
                                                                                       border border-amber-200 dark:border-amber-800 rounded font-semibold">
                                                                            {delivery.contract_id}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Client Info */}
                                                    <div className="pl-[72px] space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="h-4 w-4 text-amber-500" />
                                                            <span className="font-semibold text-gray-900 dark:text-white">{delivery.client_name}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                            <a href={`tel:${delivery.client_phone}`}
                                                               className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400
                                                                        hover:text-amber-600 dark:hover:text-amber-400 
                                                                        transition-colors font-medium">
                                                                <Phone className="h-4 w-4" />
                                                                {delivery.client_phone}
                                                            </a>
                                                            <a href={`mailto:${delivery.client_email}`}
                                                               className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400
                                                                        hover:text-amber-600 dark:hover:text-amber-400 
                                                                        transition-colors font-medium">
                                                                <Mail className="h-4 w-4" />
                                                                {delivery.client_email}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    {delivery.notes && (
                                                        <div className="pl-[72px]">
                                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 
                                                                          border border-amber-200 dark:border-amber-800/30 
                                                                          rounded-lg">
                                                                <p className="text-sm text-amber-900 dark:text-amber-200">
                                                                    💡 {delivery.notes}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Section - Timeline */}
                                                <div className="lg:w-64 flex-shrink-0">
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 
                                                                  rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                                                        <div className="space-y-3">
                                                            {delivery.scheduled_date && (
                                                                <div className="flex gap-3">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                                                                                      shadow-lg shadow-blue-500/30 flex items-center justify-center">
                                                                            <Calendar className="h-4 w-4 text-white" />
                                                                        </div>
                                                                        {(delivery.delivered_date || delivery.returned_date) && (
                                                                            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-gray-300 
                                                                                          dark:from-blue-500 dark:to-gray-600" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                                                                            Agendado
                                                                        </p>
                                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                            {formatDateShort(delivery.scheduled_date)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {delivery.delivered_date && (
                                                                <div className="flex gap-3">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600
                                                                                      shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                                        </div>
                                                                        {delivery.returned_date && (
                                                                            <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-gray-300
                                                                                          dark:from-emerald-500 dark:to-gray-600" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                                                                            Entregue
                                                                        </p>
                                                                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                                            {formatDateShort(delivery.delivered_date)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {delivery.returned_date && (
                                                                <div className="flex gap-3">
                                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-500 to-gray-600
                                                                                  shadow-lg shadow-gray-500/30 flex items-center justify-center">
                                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                                                                            Devolvido
                                                                        </p>
                                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                            {formatDateShort(delivery.returned_date)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Corretor</p>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{delivery.broker_name}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="mt-3 flex gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setSelectedDelivery(delivery)}
                                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 
                                                                     hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30
                                                                     text-white rounded-lg text-sm font-semibold 
                                                                     transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Editar
                                                        </motion.button>
                                                        <div className="relative">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setShowMenu(showMenu === delivery.id ? null : delivery.id)}
                                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600
                                                                         hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-amber-400
                                                                         rounded-lg transition-all"
                                                            >
                                                                <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                                            </motion.button>
                                                            <AnimatePresence>
                                                                {showMenu === delivery.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                                                                                 rounded-lg shadow-xl border border-gray-200 
                                                                                 dark:border-gray-700 z-50 overflow-hidden"
                                                                    >
                                                                        {[
                                                                            { status: 'delivered' as const, label: 'Marcar como Entregue', icon: CheckCircle },
                                                                            { status: 'returned' as const, label: 'Marcar como Devolvido', icon: ArrowRight },
                                                                            { status: 'cancelled' as const, label: 'Cancelar', icon: XCircle }
                                                                        ].map((action) => (
                                                                            <button
                                                                                key={action.status}
                                                                                onClick={() => handleUpdateStatus(delivery, action.status)}
                                                                                className="w-full px-4 py-3 text-left text-sm text-foreground 
                                                                                         hover:bg-gray-50 dark:hover:bg-gray-700 
                                                                                         transition-colors flex items-center gap-3"
                                                                            >
                                                                                <action.icon className="h-4 w-4 text-muted-foreground" />
                                                                                {action.label}
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || selectedDelivery) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                                 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowCreateModal(false)
                            setSelectedDelivery(null)
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                                     max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b 
                                          border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {selectedDelivery ? 'Editar Entrega' : 'Nova Entrega de Chaves'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false)
                                        setSelectedDelivery(null)
                                    }}
                                    className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                                             flex items-center justify-center transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-center text-muted-foreground py-12">
                                    Formulário de criação/edição será implementado aqui
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
