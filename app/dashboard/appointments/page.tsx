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
    AlertCircle,
    Car,
    Navigation,
    MessageCircle,
    Bell,
    UserCheck,
    Route,
    Timer,
    Star,
    ThumbsUp,
    ThumbsDown,
    Camera,
    FileText,
    Send,
    Calendar as CalendarIcon,
    MapPin as LocationIcon
} from 'lucide-react'

interface Appointment {
    id: string
    client_name: string
    client_phone: string
    client_whatsapp?: string
    client_email?: string
    lead_id?: string
    property_id: string
    property_title: string
    property_address: string
    property_coordinates?: { lat: number; lng: number }
    property_price: number
    date: string
    time: string
    end_time: string
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
    type: 'viewing' | 'evaluation' | 'meeting' | 'showing' | 'inspection'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    notes?: string
    preparation_notes?: string
    outcome_notes?: string
    client_feedback?: {
        interested: boolean
        rating: number
        comments: string
        follow_up_needed: boolean
    }
    travel_time_minutes?: number
    distance_km?: number
    confirmation_sent: boolean
    reminder_sent: boolean
    created_at: string
    updated_at: string
    assigned_agent: string
    requires_keys: boolean
    key_location?: string
    parking_info?: string
    special_instructions?: string
}

interface TravelRoute {
    appointments: Appointment[]
    total_distance: number
    total_time: number
    optimized: boolean
}

export default function AppointmentsPage() {
    const { user } = useCurrentUser()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | Appointment['type']>('all')
    const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'week' | 'all'>('today')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [optimizedRoute, setOptimizedRoute] = useState<TravelRoute | null>(null)
    const [showRouteOptimizer, setShowRouteOptimizer] = useState(false)

    useEffect(() => {
        loadAppointments()
    }, [])

    const loadAppointments = async () => {
        try {
            // Em produção: const response = await fetch('/api/appointments')
            // Em produção: const appointments = await response.json()

            // Array vazio até conectar com backend
            setAppointments([])
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error)
        } finally {
            setLoading(false)
        }
    }

const getStatusBadge = (status: Appointment['status']) => {
    const styles = {
        scheduled: 'bg-blue-100 text-blue-800',
        confirmed: 'bg-green-100 text-green-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-red-100 text-red-800',
        no_show: 'bg-gray-100 text-gray-800',
        rescheduled: 'bg-purple-100 text-purple-800'
    }

    const labels = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        in_progress: 'Em Andamento',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        no_show: 'Não Compareceu',
        rescheduled: 'Reagendado'
    }

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
            {labels[status]}
        </span>
    )
}

const getPriorityBadge = (priority: Appointment['priority']) => {
    const styles = {
        low: 'bg-gray-100 text-gray-600',
        medium: 'bg-blue-100 text-blue-600',
        high: 'bg-orange-100 text-orange-600',
        urgent: 'bg-red-100 text-red-600'
    }

    const labels = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
        urgent: 'Urgente'
    }

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>
            {labels[priority]}
        </span>
    )
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
}

const isTomorrow = (dateString: string) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    return dateString === tomorrow
}

const getTimeStatus = (appointment: Appointment) => {
    const now = new Date()
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
    const timeDiff = appointmentDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff < 0) return 'past'
    if (hoursDiff < 1) return 'soon'
    if (hoursDiff < 24) return 'today'
    return 'future'
}

const optimizeRoute = () => {
    const todayAppointments = appointments.filter(apt =>
        isToday(apt.date) &&
        (apt.status === 'scheduled' || apt.status === 'confirmed')
    )

    // Simulação de otimização de rota
    const optimized: TravelRoute = {
        appointments: todayAppointments.sort((a, b) => a.time.localeCompare(b.time)),
        total_distance: todayAppointments.reduce((acc, apt) => acc + (apt.distance_km || 0), 0),
        total_time: todayAppointments.reduce((acc, apt) => acc + (apt.travel_time_minutes || 0), 0),
        optimized: true
    }

    setOptimizedRoute(optimized)
    setShowRouteOptimizer(true)
}

const sendReminder = async (appointmentId: string) => {
    // Simular envio de lembrete
    setAppointments(appointments.map(apt =>
        apt.id === appointmentId
            ? { ...apt, reminder_sent: true }
            : apt
    ))
}

const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
        appointment.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.property_address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter

    let matchesDate = true
    if (dateFilter === 'today') {
        matchesDate = isToday(appointment.date)
    } else if (dateFilter === 'tomorrow') {
        matchesDate = isTomorrow(appointment.date)
    } else if (dateFilter === 'week') {
        const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        matchesDate = appointment.date <= weekFromNow && appointment.date >= new Date().toISOString().split('T')[0]
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate
})

// Ordenar por data e hora
const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
})

const todayCount = appointments.filter(apt => isToday(apt.date) && apt.status !== 'cancelled').length
const pendingConfirmation = appointments.filter(apt => apt.status === 'scheduled' && !apt.confirmation_sent).length
const completedToday = appointments.filter(apt => isToday(apt.date) && apt.status === 'completed').length

if (loading) {
    return (
        <div className="p-6">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
                </div>
            </div>
        </div>
    )
}

return (
    <div className="p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Calendar className="h-7 w-7 text-amber-600" />
                        Agenda de Visitas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Gerencie visitas, avaliações e reuniões
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={optimizeRoute}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Route className="h-4 w-4" />
                        Otimizar Rota
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Nova Visita
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <CalendarIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">Hoje</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {todayCount}
                    </div>
                    <div className="text-sm text-gray-600">Agendamentos</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Bell className="h-8 w-8 text-orange-600" />
                        <span className="text-xs text-orange-600 font-medium">Pendente</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {pendingConfirmation}
                    </div>
                    <div className="text-sm text-gray-600">Confirmações</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Concluídas</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {completedToday}
                    </div>
                    <div className="text-sm text-gray-600">Hoje</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Car className="h-8 w-8 text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">Tempo</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(appointments.filter(apt => isToday(apt.date)).reduce((acc, apt) => acc + (apt.travel_time_minutes || 0), 0) / 60)}h
                    </div>
                    <div className="text-sm text-gray-600">Deslocamento</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, imóvel ou endereço..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="today">Hoje</option>
                        <option value="tomorrow">Amanhã</option>
                        <option value="week">Esta Semana</option>
                        <option value="all">Todos</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="scheduled">Agendado</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os Tipos</option>
                        <option value="viewing">Visita</option>
                        <option value="evaluation">Avaliação</option>
                        <option value="meeting">Reunião</option>
                        <option value="showing">Apresentação</option>
                    </select>
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {sortedAppointments.map((appointment) => {
                    const timeStatus = getTimeStatus(appointment)
                    const isOverdue = timeStatus === 'past' && appointment.status === 'scheduled'

                    return (
                        <motion.div
                            key={appointment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-xl border-2 shadow-sm p-6 hover:shadow-md transition-all ${isOverdue ? 'border-red-200 bg-red-50' :
                                timeStatus === 'soon' ? 'border-orange-200 bg-orange-50' :
                                    'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                                        {appointment.client_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                                            {appointment.client_name}
                                            {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                                            {timeStatus === 'soon' && <Timer className="h-4 w-4 text-orange-500" />}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {appointment.client_phone}
                                            </span>
                                            {appointment.client_whatsapp && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <MessageCircle className="h-4 w-4" />
                                                    WhatsApp
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            {getStatusBadge(appointment.status)}
                                            {getPriorityBadge(appointment.priority)}
                                            <span className="text-xs text-gray-500 capitalize">
                                                {appointment.type === 'viewing' ? 'Visita' :
                                                    appointment.type === 'evaluation' ? 'Avaliação' :
                                                        appointment.type === 'meeting' ? 'Reunião' :
                                                            appointment.type === 'showing' ? 'Apresentação' : 'Inspeção'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900 mb-1">
                                        {formatCurrency(appointment.property_price)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {appointment.type === 'viewing' && appointment.property_price < 10000 ? 'Aluguel' : 'Venda'}
                                    </div>
                                </div>
                            </div>

                            {/* Property Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-gray-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {appointment.property_title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <LocationIcon className="h-4 w-4" />
                                            {appointment.property_address}
                                        </div>
                                        {appointment.distance_km && (
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Car className="h-4 w-4" />
                                                    {appointment.distance_km} km
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {appointment.travel_time_minutes} min
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Calendar className="h-4 w-4" />
                                        Data
                                    </div>
                                    <div className="font-medium">
                                        {new Date(appointment.date).toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: '2-digit'
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Clock className="h-4 w-4" />
                                        Horário
                                    </div>
                                    <div className="font-medium">
                                        {appointment.time} - {appointment.end_time}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <UserCheck className="h-4 w-4" />
                                        Status
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {appointment.confirmation_sent ? (
                                            <span className="text-green-600 text-sm">✓ Confirmado</span>
                                        ) : (
                                            <span className="text-orange-600 text-sm">⚠ Pendente</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Key and Parking Info */}
                            {(appointment.requires_keys || appointment.parking_info) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {appointment.requires_keys && (
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="text-sm font-medium text-blue-800 mb-1">
                                                🔑 Chaves necessárias
                                            </div>
                                            <div className="text-sm text-blue-700">
                                                {appointment.key_location}
                                            </div>
                                        </div>
                                    )}

                                    {appointment.parking_info && (
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <div className="text-sm font-medium text-green-800 mb-1">
                                                🚗 Estacionamento
                                            </div>
                                            <div className="text-sm text-green-700">
                                                {appointment.parking_info}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            {appointment.notes && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="text-sm font-medium text-gray-800 mb-1">Observações:</div>
                                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                                </div>
                            )}

                            {/* Preparation Notes */}
                            {appointment.preparation_notes && (
                                <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                                    <div className="text-sm font-medium text-yellow-800 mb-1">📋 Preparação:</div>
                                    <p className="text-sm text-yellow-700">{appointment.preparation_notes}</p>
                                </div>
                            )}

                            {/* Client Feedback (for completed appointments) */}
                            {appointment.status === 'completed' && appointment.client_feedback && (
                                <div className="bg-green-50 rounded-lg p-3 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-sm font-medium text-green-800">Feedback do Cliente:</div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: appointment.client_feedback.rating }, (_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-700 mb-2">{appointment.client_feedback.comments}</p>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${appointment.client_feedback.interested ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {appointment.client_feedback.interested ? '👍 Interessado' : '👎 Não interessado'}
                                        </span>
                                        {appointment.client_feedback.follow_up_needed && (
                                            <span className="text-sm text-blue-600">🔄 Precisa follow-up</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {appointment.special_instructions && (
                                        <span className="text-blue-600">ℹ️ Instruções especiais</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!appointment.confirmation_sent && appointment.status === 'scheduled' && (
                                        <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Send className="h-4 w-4" />
                                            Confirmar
                                        </button>
                                    )}

                                    {!appointment.reminder_sent && (isToday(appointment.date) || isTomorrow(appointment.date)) && (
                                        <button
                                            onClick={() => sendReminder(appointment.id)}
                                            className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <Bell className="h-4 w-4" />
                                            Lembrete
                                        </button>
                                    )}

                                    {appointment.client_whatsapp && (
                                        <button className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                            <MessageCircle className="h-4 w-4" />
                                            WhatsApp
                                        </button>
                                    )}

                                    <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Navigation className="h-4 w-4" />
                                        Rota
                                    </button>

                                    <button className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {sortedAppointments.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                    <p className="text-gray-600">
                        {searchQuery ? 'Tente ajustar os filtros ou termo de busca.' : 'Comece agendando sua primeira visita.'}
                    </p>
                </div>
            )}

            {/* Route Optimizer Modal */}
            {showRouteOptimizer && optimizedRoute && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Rota Otimizada - Hoje</h3>
                            <button
                                onClick={() => setShowRouteOptimizer(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-sm text-blue-600">Total de Distância</div>
                                    <div className="text-lg font-bold text-blue-900">
                                        {optimizedRoute.total_distance.toFixed(1)} km
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="text-sm text-green-600">Tempo de Viagem</div>
                                    <div className="text-lg font-bold text-green-900">
                                        {Math.round(optimizedRoute.total_time / 60)}h {optimizedRoute.total_time % 60}min
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {optimizedRoute.appointments.map((apt, index) => (
                                <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{apt.time} - {apt.client_name}</div>
                                        <div className="text-sm text-gray-600">{apt.property_title}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {apt.distance_km} km
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowRouteOptimizer(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Fechar
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Abrir no Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)
}
