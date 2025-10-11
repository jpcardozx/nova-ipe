'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Eye,
    Clock,
    User,
    MapPin,
    Phone,
    Mail,
    Flag,
    Tag,
    Users,
    Building2,
    CheckCircle,
    AlertTriangle,
    Filter,
    Search
} from 'lucide-react'
import { Task, Client, CRMService } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import TaskModal from './TaskModal'

interface CalendarEvent {
    id: string
    title: string
    date: string
    time?: string
    type: 'task' | 'meeting' | 'appointment' | 'reminder'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    client?: Client
    task?: Task
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    duration?: number // em minutos
}

interface CalendarViewProps {
    className?: string
}

export function CalendarView({ className }: CalendarViewProps) {
    const { user } = useCurrentUser()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [filterType, setFilterType] = useState<'all' | 'task' | 'meeting' | 'appointment'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadData()
    }, [currentDate, viewMode])

    const loadData = async () => {
        setLoading(true)
        try {
            // Load tasks and clients in parallel
            const [tasksResult, clientsResult] = await Promise.all([
                CRMService.getClients({ status: 'all' }), // Simulating tasks API
                CRMService.getClients({ status: 'all' })
            ])

            if (tasksResult.data) {
                setClients(tasksResult.data)
            }

            // Generate sample calendar events based on tasks and client data
            generateSampleEvents(tasksResult.data || [])
        } catch (error) {
            console.error('Error loading calendar data:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateSampleEvents = (clientsData: Client[]) => {
        const sampleEvents: CalendarEvent[] = []
        const today = new Date()

        // Generate events for the next 30 days
        for (let i = 0; i < 30; i++) {
            const eventDate = new Date(today)
            eventDate.setDate(today.getDate() + i)

            // Add some random events for each client
            clientsData.slice(0, 5).forEach((client, index) => {
                if (Math.random() > 0.7) { // 30% chance of event per day per client
                    const eventTypes: ('task' | 'meeting' | 'appointment' | 'reminder')[] = ['task', 'meeting', 'appointment', 'reminder']
                    const priorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent']
                    const statuses: ('pending' | 'confirmed' | 'completed' | 'cancelled')[] = ['pending', 'confirmed', 'completed']

                    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
                    const priority = priorities[Math.floor(Math.random() * priorities.length)]
                    const status = statuses[Math.floor(Math.random() * statuses.length)]

                    const eventTitles = {
                        task: [`Follow-up com ${client.name}`, `Análise de crédito - ${client.name}`, `Envio de documentos - ${client.name}`],
                        meeting: [`Reunião com ${client.name}`, `Apresentação de imóveis - ${client.name}`, `Negociação - ${client.name}`],
                        appointment: [`Visita ao imóvel com ${client.name}`, `Assinatura de contrato - ${client.name}`, `Vistoria - ${client.name}`],
                        reminder: [`Lembrete: Ligar para ${client.name}`, `Lembrete: Enviar propostas`, `Lembrete: Agendar visita`]
                    }

                    const titles = eventTitles[eventType]
                    const title = titles[Math.floor(Math.random() * titles.length)]

                    // Generate random time between 8:00 and 18:00
                    const hour = 8 + Math.floor(Math.random() * 10)
                    const minute = Math.random() > 0.5 ? 0 : 30
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

                    sampleEvents.push({
                        id: `${eventType}-${client.id}-${i}`,
                        title,
                        date: eventDate.toISOString().split('T')[0],
                        time,
                        type: eventType,
                        priority,
                        client,
                        status,
                        duration: 30 + Math.floor(Math.random() * 90) // 30-120 minutes
                    })
                }
            })
        }

        setEvents(sampleEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const getEventsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0]
        return events.filter(event => {
            const matchesDate = event.date === dateString
            const matchesFilter = filterType === 'all' || event.type === filterType
            const matchesSearch = searchQuery === '' ||
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesDate && matchesFilter && matchesSearch
        })
    }

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setCurrentDate(newDate)
    }

    const getEventTypeConfig = (type: string) => {
        const configs = {
            task: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
            meeting: { color: 'bg-green-100 text-green-800 border-green-200', icon: Users },
            appointment: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Calendar },
            reminder: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle }
        }
        return configs[type as keyof typeof configs] || configs.task
    }

    const getPriorityColor = (priority: string) => {
        const colors = {
            low: 'border-l-green-500',
            medium: 'border-l-yellow-500',
            high: 'border-l-orange-500',
            urgent: 'border-l-red-500'
        }
        return colors[priority as keyof typeof colors] || colors.medium
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const filteredEvents = events.filter(event => {
        const matchesFilter = filterType === 'all' || event.type === filterType
        const matchesSearch = searchQuery === '' ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Agenda Profissional</h2>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            {(['month', 'week', 'day'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === mode
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Novo Evento
                        </button>
                    </div>
                </div>

                {/* Navigation and Filters */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
                            {formatMonth(currentDate)}
                        </h3>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Hoje
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="task">Tarefas</option>
                            <option value="meeting">Reuniões</option>
                            <option value="appointment">Compromissos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Carregando agenda...</span>
                </div>
            ) : viewMode === 'month' ? (
                <div className="p-6">
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-px mb-4">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-px">
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <div key={index} className="min-h-[120px] bg-gray-50 rounded-lg p-2">
                                {date && (
                                    <>
                                        <div className={`text-sm font-medium mb-2 ${
                                            isToday(date)
                                                ? 'text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center'
                                                : 'text-gray-900'
                                        }`}>
                                            {date.getDate()}
                                        </div>

                                        <div className="space-y-1">
                                            {getEventsForDate(date).slice(0, 3).map(event => {
                                                const typeConfig = getEventTypeConfig(event.type)
                                                const Icon = typeConfig.icon

                                                return (
                                                    <motion.div
                                                        key={event.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className={`text-xs p-2 rounded border-l-2 ${typeConfig.color} ${getPriorityColor(event.priority)} cursor-pointer hover:shadow-sm transition-shadow`}
                                                        onClick={() => setSelectedEvent(event)}
                                                        title={event.title}
                                                    >
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <Icon size={10} />
                                                            <span className="font-medium truncate">
                                                                {event.time && `${event.time} - `}
                                                                {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                                                            </span>
                                                        </div>
                                                        {event.client && (
                                                            <div className="flex items-center gap-1 text-gray-600">
                                                                <User size={8} />
                                                                <span className="truncate">{event.client.name}</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )
                                            })}

                                            {getEventsForDate(date).length > 3 && (
                                                <div className="text-xs text-gray-500 text-center py-1">
                                                    +{getEventsForDate(date).length - 3} mais
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // List view for week/day modes
                <div className="p-6">
                    <div className="space-y-4">
                        {filteredEvents.slice(0, 20).map(event => {
                            const typeConfig = getEventTypeConfig(event.type)
                            const Icon = typeConfig.icon

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`border rounded-lg p-4 ${typeConfig.color} border-l-4 ${getPriorityColor(event.priority)} hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon size={16} />
                                                <h3 className="font-medium">{event.title}</h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                    event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {event.priority === 'urgent' ? 'Urgente' :
                                                     event.priority === 'high' ? 'Alta' :
                                                     event.priority === 'medium' ? 'Média' : 'Baixa'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(event.date).toLocaleDateString('pt-BR')}
                                                </div>
                                                {event.time && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {event.time}
                                                    </div>
                                                )}
                                                {event.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Tag size={14} />
                                                        {event.duration}min
                                                    </div>
                                                )}
                                            </div>

                                            {event.client && (
                                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <User size={14} />
                                                        {event.client.name}
                                                    </div>
                                                    {event.client.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone size={14} />
                                                            {event.client.phone}
                                                        </div>
                                                    )}
                                                    {event.client.email && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={14} />
                                                            {event.client.email}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                                <p className="text-gray-600">Não há eventos para os filtros selecionados.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Task Modal */}
            <TaskModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSave={() => {
                    setShowTaskModal(false)
                    loadData() // Reload data after saving
                }}
            />

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Detalhes do Evento</h2>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">{selectedEvent.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                                            </div>
                                            {selectedEvent.time && (
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {selectedEvent.time}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedEvent.client && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    {selectedEvent.client.name}
                                                </div>
                                                {selectedEvent.client.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} />
                                                        {selectedEvent.client.phone}
                                                    </div>
                                                )}
                                                {selectedEvent.client.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} />
                                                        {selectedEvent.client.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Edit functionality
                                            setSelectedEvent(null)
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CalendarView