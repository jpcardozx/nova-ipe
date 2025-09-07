'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    Building2,
    Plus,
    Eye,
    Edit,
    Trash2,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react'

interface Appointment {
    id: string
    client_name: string
    client_phone: string
    property_title: string
    property_address: string
    date: string
    time: string
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
    type: 'viewing' | 'evaluation' | 'meeting'
    notes?: string
    created_at: string
}

export default function AppointmentsPage() {
    const { user } = useCurrentUser()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | 'viewing' | 'evaluation' | 'meeting'>('all')

    useEffect(() => {
        loadAppointments()
    }, [])

    const loadAppointments = async () => {
        try {
            // Simulando dados por enquanto
            const mockAppointments: Appointment[] = [
                {
                    id: '1',
                    client_name: 'Maria Silva',
                    client_phone: '(11) 99999-1111',
                    property_title: 'Casa 3 dormitórios - Jardins',
                    property_address: 'Rua das Flores, 123 - Jardins',
                    date: '2025-01-10',
                    time: '14:00',
                    status: 'scheduled',
                    type: 'viewing',
                    notes: 'Cliente interessado em financiamento próprio',
                    created_at: '2025-01-08T10:00:00.000Z'
                },
                {
                    id: '2',
                    client_name: 'João Santos',
                    client_phone: '(11) 99999-2222',
                    property_title: 'Apartamento 2 dormitórios - Vila Madalena',
                    property_address: 'Av. Paulista, 456 - Vila Madalena',
                    date: '2025-01-09',
                    time: '16:30',
                    status: 'completed',
                    type: 'viewing',
                    notes: 'Visita realizada com sucesso, cliente muito interessado',
                    created_at: '2025-01-07T15:30:00.000Z'
                },
                {
                    id: '3',
                    client_name: 'Ana Costa',
                    client_phone: '(11) 99999-3333',
                    property_title: 'Cobertura 4 dormitórios - Itaim',
                    property_address: 'Rua Oscar Freire, 789 - Itaim',
                    date: '2025-01-11',
                    time: '10:00',
                    status: 'scheduled',
                    type: 'evaluation',
                    created_at: '2025-01-08T12:15:00.000Z'
                }
            ]

            setAppointments(mockAppointments)
        } catch (error) {
            console.error('Error loading appointments:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />
            case 'no_show': return <AlertCircle className="h-4 w-4 text-orange-600" />
            default: return <Clock className="h-4 w-4 text-blue-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            no_show: 'bg-orange-100 text-orange-800'
        }
        
        const labels = {
            scheduled: 'Agendado',
            completed: 'Realizado',
            cancelled: 'Cancelado',
            no_show: 'Não compareceu'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        )
    }

    const getTypeBadge = (type: string) => {
        const styles = {
            viewing: 'bg-purple-100 text-purple-800',
            evaluation: 'bg-amber-100 text-amber-800',
            meeting: 'bg-indigo-100 text-indigo-800'
        }
        
        const labels = {
            viewing: 'Visita',
            evaluation: 'Avaliação',
            meeting: 'Reunião'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type as keyof typeof styles]}`}>
                {labels[type as keyof typeof labels]}
            </span>
        )
    }

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            appointment.property_title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
        const matchesType = typeFilter === 'all' || appointment.type === typeFilter
        
        return matchesSearch && matchesStatus && matchesType
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
                    <p className="text-gray-600">Gerencie visitas, avaliações e reuniões</p>
                </div>
                
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all">
                    <Plus className="h-4 w-4" />
                    Novo Agendamento
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente ou propriedade..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os status</option>
                        <option value="scheduled">Agendado</option>
                        <option value="completed">Realizado</option>
                        <option value="cancelled">Cancelado</option>
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="viewing">Visita</option>
                        <option value="evaluation">Avaliação</option>
                        <option value="meeting">Reunião</option>
                    </select>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                        <p className="text-gray-500 mb-4">Não há agendamentos que correspondam aos filtros selecionados.</p>
                        <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium">
                            Criar Primeiro Agendamento
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredAppointments.map((appointment) => (
                            <motion.div
                                key={appointment.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {getStatusIcon(appointment.status)}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {appointment.client_name}
                                                    </h3>
                                                    {getStatusBadge(appointment.status)}
                                                    {getTypeBadge(appointment.type)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{appointment.client_phone}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span>{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 md:col-span-2">
                                                        <Building2 className="h-4 w-4 text-gray-400" />
                                                        <span className="font-medium">{appointment.property_title}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 md:col-span-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span>{appointment.property_address}</span>
                                                    </div>
                                                </div>

                                                {appointment.notes && (
                                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}