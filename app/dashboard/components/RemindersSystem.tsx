'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RemindersService } from '@/lib/supabase/reminders-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Bell,
    Plus,
    Calendar,
    Clock,
    User,
    Phone,
    MessageCircle,
    Eye,
    Mail,
    CheckCircle2,
    AlertTriangle,
    Search,
    Filter,
    Edit,
    Trash2,
    Play,
    Pause,
    X,
    Save,
    Users,
    Target,
    Activity,
    Star,
    Zap
} from 'lucide-react'

interface Reminder {
    id: string
    title: string
    description: string
    reminder_type: 'follow_up' | 'call' | 'visit' | 'meeting' | 'email' | 'document'
    client_id?: string
    client_name?: string
    activity_id?: string
    reminder_date: string
    reminder_time?: string
    status: 'pending' | 'sent' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assigned_to: string
    assigned_to_name?: string
    notification_channels: ('email' | 'sms' | 'whatsapp' | 'push')[]
    created_at: string
    completed_at?: string
    notes?: string
}

interface ReminderFormData {
    title: string
    description: string
    reminder_type: 'follow_up' | 'call' | 'visit' | 'meeting' | 'email' | 'document'
    client_id?: string
    reminder_date: string
    reminder_time: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assigned_to: string
    notification_channels: ('email' | 'sms' | 'whatsapp' | 'push')[]
    notes?: string
}

export default function RemindersSystem() {
    const { user } = useCurrentUser()
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [showNewReminderModal, setShowNewReminderModal] = useState(false)
    const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'completed'>('all')
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | 'follow_up' | 'call' | 'visit' | 'meeting' | 'email' | 'document'>('all')

    const [formData, setFormData] = useState<ReminderFormData>({
        title: '',
        description: '',
        reminder_type: 'follow_up',
        client_id: '',
        reminder_date: '',
        reminder_time: '',
        priority: 'medium',
        assigned_to: user?.id || '',
        notification_channels: ['email'],
        notes: ''
    })

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        today: 0,
        overdue: 0,
        completed: 0
    })

    useEffect(() => {
        loadReminders()
    }, [statusFilter, priorityFilter, typeFilter])

    const loadReminders = async () => {
        setLoading(true)
        try {
            // Mock data para demonstração - em produção, usar RemindersService
            const mockReminders: Reminder[] = [
                {
                    id: '1',
                    title: 'Ligar para João Silva',
                    description: 'Follow-up sobre proposta de apartamento no Itaim',
                    reminder_type: 'call',
                    client_id: 'client1',
                    client_name: 'João Silva',
                    reminder_date: '2024-12-08T14:30:00Z',
                    status: 'pending',
                    priority: 'high',
                    assigned_to: user?.id || '',
                    assigned_to_name: user?.email?.split('@')[0] || '',
                    notification_channels: ['email', 'push'],
                    created_at: '2024-12-07T10:00:00Z',
                    notes: 'Cliente interessado em imóveis de 2-3 quartos'
                },
                {
                    id: '2',
                    title: 'Enviar documentos para Maria',
                    description: 'Documentação do contrato de compra e venda',
                    reminder_type: 'document',
                    client_id: 'client2',
                    client_name: 'Maria Santos',
                    reminder_date: '2024-12-08T10:00:00Z',
                    status: 'pending',
                    priority: 'urgent',
                    assigned_to: user?.id || '',
                    assigned_to_name: user?.email?.split('@')[0] || '',
                    notification_channels: ['email', 'whatsapp'],
                    created_at: '2024-12-07T08:00:00Z'
                },
                {
                    id: '3',
                    title: 'Visita de apresentação',
                    description: 'Mostrar apartamento para Carlos Oliveira',
                    reminder_type: 'visit',
                    client_id: 'client3',
                    client_name: 'Carlos Oliveira',
                    reminder_date: '2024-12-09T15:00:00Z',
                    status: 'completed',
                    priority: 'medium',
                    assigned_to: user?.id || '',
                    assigned_to_name: user?.email?.split('@')[0] || '',
                    notification_channels: ['email'],
                    created_at: '2024-12-06T16:00:00Z',
                    completed_at: '2024-12-09T15:30:00Z'
                }
            ]

            setReminders(mockReminders)

            // Calcular estatísticas
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            const statsCalc = {
                total: mockReminders.length,
                pending: mockReminders.filter(r => r.status === 'pending').length,
                today: mockReminders.filter(r => {
                    const reminderDate = new Date(r.reminder_date)
                    return reminderDate >= today && reminderDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }).length,
                overdue: mockReminders.filter(r => {
                    return r.status === 'pending' && new Date(r.reminder_date) < now
                }).length,
                completed: mockReminders.filter(r => r.status === 'completed').length
            }

            setStats(statsCalc)

        } catch (error) {
            console.error('Erro ao carregar reminders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateReminder = async () => {
        try {
            if (!formData.title || !formData.reminder_date) return

            const reminderData = {
                ...formData,
                reminder_date: new Date(formData.reminder_date + 'T' + formData.reminder_time).toISOString(),
                assigned_to: formData.assigned_to || user?.id || ''
            }

            // Em produção, usar RemindersService.createReminder(reminderData)
            const newReminder: Reminder = {
                id: Date.now().toString(),
                ...reminderData,
                status: 'pending',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_at: new Date().toISOString()
            }

            setReminders(prev => [newReminder, ...prev])
            setShowNewReminderModal(false)
            resetForm()

        } catch (error) {
            console.error('Erro ao criar reminder:', error)
        }
    }

    const handleCompleteReminder = async (reminderId: string) => {
        setReminders(prev => prev.map(reminder =>
            reminder.id === reminderId
                ? { ...reminder, status: 'completed' as const, completed_at: new Date().toISOString() }
                : reminder
        ))
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            reminder_type: 'follow_up',
            client_id: '',
            reminder_date: '',
            reminder_time: '',
            priority: 'medium',
            assigned_to: user?.id || '',
            notification_channels: ['email'],
            notes: ''
        })
    }

    const filteredReminders = reminders.filter(reminder => {
        if (searchQuery && !reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !reminder.client_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        if (statusFilter !== 'all' && reminder.status !== statusFilter) {
            return false
        }

        if (priorityFilter !== 'all' && reminder.priority !== priorityFilter) {
            return false
        }

        if (typeFilter !== 'all' && reminder.reminder_type !== typeFilter) {
            return false
        }

        return true
    })

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'text-green-600 bg-green-50 border-green-200'
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
            case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-50'
            case 'sent': return 'text-blue-600 bg-blue-50'
            case 'completed': return 'text-green-600 bg-green-50'
            case 'cancelled': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone className="h-4 w-4" />
            case 'visit': return <Eye className="h-4 w-4" />
            case 'meeting': return <Calendar className="h-4 w-4" />
            case 'email': return <Mail className="h-4 w-4" />
            case 'document': return <Target className="h-4 w-4" />
            case 'follow_up': return <MessageCircle className="h-4 w-4" />
            default: return <Bell className="h-4 w-4" />
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sistema de Reminders</h1>
                        <p className="text-gray-600 mt-2">Gerencie lembretes e notificações do CRM</p>
                    </div>
                    <button
                        onClick={() => setShowNewReminderModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Novo Reminder
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pendentes</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hoje</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Atrasados</p>
                                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Concluídos</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar reminders ou clientes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos Status</option>
                        <option value="pending">Pendente</option>
                        <option value="sent">Enviado</option>
                        <option value="completed">Concluído</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todas Prioridades</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos Tipos</option>
                        <option value="call">Ligação</option>
                        <option value="visit">Visita</option>
                        <option value="meeting">Reunião</option>
                        <option value="email">E-mail</option>
                        <option value="document">Documento</option>
                        <option value="follow_up">Follow-up</option>
                    </select>
                </div>
            </div>

            {/* Reminders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredReminders.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum reminder encontrado</h3>
                        <p className="text-gray-600">Tente ajustar os filtros ou criar um novo reminder.</p>
                    </div>
                ) : (
                    filteredReminders.map(reminder => (
                        <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-full ${getPriorityColor(reminder.priority)}`}>
                                                {getTypeIcon(reminder.reminder_type)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                                                <p className="text-sm text-gray-600">{reminder.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                                                {reminder.status === 'pending' && 'Pendente'}
                                                {reminder.status === 'sent' && 'Enviado'}
                                                {reminder.status === 'completed' && 'Concluído'}
                                                {reminder.status === 'cancelled' && 'Cancelado'}
                                            </span>

                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                                                {reminder.priority === 'low' && 'Baixa'}
                                                {reminder.priority === 'medium' && 'Média'}
                                                {reminder.priority === 'high' && 'Alta'}
                                                {reminder.priority === 'urgent' && 'Urgente'}
                                            </span>

                                            {reminder.client_name && (
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    {reminder.client_name}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(reminder.reminder_date).toLocaleString('pt-BR')}
                                            </div>

                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <User className="h-4 w-4" />
                                                {reminder.assigned_to_name}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {reminder.notification_channels.map(channel => (
                                                    <span key={channel} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                                        {channel}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {reminder.status === 'pending' && (
                                            <button
                                                onClick={() => handleCompleteReminder(reminder.id)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                            >
                                                Concluir
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setSelectedReminder(reminder)}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* New Reminder Modal */}
            <AnimatePresence>
                {showNewReminderModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Novo Reminder</h2>
                                    <button
                                        onClick={() => setShowNewReminderModal(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Ex: Ligar para cliente João"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Detalhes do reminder..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo
                                            </label>
                                            <select
                                                value={formData.reminder_type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, reminder_type: e.target.value as any }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            >
                                                <option value="follow_up">Follow-up</option>
                                                <option value="call">Ligação</option>
                                                <option value="visit">Visita</option>
                                                <option value="meeting">Reunião</option>
                                                <option value="email">E-mail</option>
                                                <option value="document">Documento</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Prioridade
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="medium">Média</option>
                                                <option value="high">Alta</option>
                                                <option value="urgent">Urgente</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Data *
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.reminder_date}
                                                onChange={(e) => setFormData(prev => ({ ...prev, reminder_date: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Horário
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.reminder_time}
                                                onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Canais de Notificação
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {['email', 'sms', 'whatsapp', 'push'].map(channel => (
                                                <label key={channel} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.notification_channels.includes(channel as any)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    notification_channels: [...prev.notification_channels, channel as any]
                                                                }))
                                                            } else {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    notification_channels: prev.notification_channels.filter(c => c !== channel)
                                                                }))
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                                    />
                                                    <span className="text-sm text-gray-700 capitalize">{channel}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Observações
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Observações adicionais..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setShowNewReminderModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateReminder}
                                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                        Criar Reminder
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
