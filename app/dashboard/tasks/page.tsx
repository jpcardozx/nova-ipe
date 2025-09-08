'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { RemindersService } from '@/lib/supabase/reminders-service'
import {
    CheckSquare,
    Plus,
    Search,
    Clock,
    AlertTriangle,
    User,
    Phone,
    Calendar,
    Building2,
    MessageCircle,
    CheckCircle2,
    X,
    Edit,
    Trash2,
    Bell,
    DollarSign
} from 'lucide-react'

// Interface simplificada para tarefas
interface Task {
    id: string
    title: string
    description?: string
    reminder_type: 'call' | 'meeting' | 'document' | 'follow_up' | 'visit' | 'payment'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'completed' | 'cancelled'
    reminder_date: string
    client_id?: string
    client_name?: string
    assigned_to: string
    assigned_to_name?: string
    created_by: string
    created_at: string
    completed_at?: string
    notification_channels?: ('email' | 'sms' | 'whatsapp' | 'push')[]
    notes?: string
    is_recurring?: boolean
}

interface TaskFormData {
    title: string
    description: string
    reminder_type: Task['reminder_type']
    priority: Task['priority']
    reminder_date: string
    reminder_time: string
    client_id: string
    assigned_to: string
    notification_channels: ('email' | 'sms' | 'whatsapp' | 'push')[]
    notes: string
    is_recurring: boolean
}

export default function TasksPage() {
    const { user } = useCurrentUser()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | 'call' | 'meeting' | 'document' | 'follow_up' | 'visit' | 'payment'>('all')
    const [showAddTask, setShowAddTask] = useState(false)

    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        reminder_type: 'follow_up',
        priority: 'medium',
        reminder_date: '',
        reminder_time: '',
        client_id: '',
        assigned_to: user?.id || '',
        notification_channels: ['email'],
        notes: '',
        is_recurring: false
    })

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        today: 0,
        thisWeek: 0
    })

    useEffect(() => {
        if (user) {
            loadTasks()
        }
    }, [user])

    const loadTasks = async () => {
        setLoading(true)
        setError('')
        try {
            // Tentar usar o RemindersService para carregar tarefas reais do Supabase
            const { data: reminders, error: remindersError } = await RemindersService.getUserReminders(user?.id || '')

            if (remindersError) {
                console.warn('Erro ao carregar do Supabase, usando dados mock:', remindersError)
                loadMockTasks()
                return
            }

            // Converter reminders para o formato Task com validação de tipos
            const tasksData: Task[] = (reminders || []).map(reminder => ({
                id: reminder.id,
                title: reminder.title,
                description: reminder.description || '',
                reminder_type: reminder.reminder_type,
                priority: reminder.priority,
                status: reminder.status,
                reminder_date: reminder.reminder_date,
                client_id: reminder.client_id || '',
                client_name: '', // Campo não disponível no Reminder padrão
                assigned_to: reminder.assigned_to || user?.id || '',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_by: reminder.created_by || user?.id || '',
                created_at: reminder.created_at,
                completed_at: reminder.completed_at,
                notification_channels: reminder.notification_channels || ['email'],
                notes: '', // Campo não disponível no Reminder padrão
                is_recurring: reminder.is_recurring || false
            }))

            setTasks(tasksData)
            calculateStats(tasksData)

        } catch (err: any) {
            console.warn('Erro ao carregar tarefas, usando dados mock:', err)
            loadMockTasks()
        } finally {
            setLoading(false)
        }
    }

    const loadMockTasks = () => {
        // Dados de demonstração com data/hora reais
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date(now)
        nextWeek.setDate(nextWeek.getDate() + 7)

        const mockTasks: Task[] = [
            {
                id: '1',
                title: 'Ligar para Maria Silva - Follow-up Apartamento',
                description: 'Cliente interessada no apartamento de 2 dormitórios no Itaim. Ligar para agendar visita presencial.',
                reminder_type: 'call',
                priority: 'high',
                status: 'pending',
                reminder_date: tomorrow.toISOString(),
                client_id: 'c1',
                client_name: 'Maria Silva',
                assigned_to: user?.id || '',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_by: user?.id || '',
                created_at: now.toISOString(),
                notification_channels: ['email', 'whatsapp']
            },
            {
                id: '2',
                title: 'Reunião com João Santos - Negociação',
                description: 'Reunião para negociar preço da casa em Vila Madalena. Cliente quer fazer proposta.',
                reminder_type: 'meeting',
                priority: 'urgent',
                status: 'pending',
                reminder_date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
                client_id: 'c2',
                client_name: 'João Santos',
                assigned_to: user?.id || '',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_by: user?.id || '',
                created_at: now.toISOString(),
                notification_channels: ['email', 'push']
            },
            {
                id: '3',
                title: 'Enviar documentos para Ana Costa',
                description: 'Enviar contrato de locação e documentos complementares por email.',
                reminder_type: 'document',
                priority: 'medium',
                status: 'completed',
                reminder_date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // ontem
                client_id: 'c3',
                client_name: 'Ana Costa',
                assigned_to: user?.id || '',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_by: user?.id || '',
                created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
                completed_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
                notification_channels: ['email']
            },
            {
                id: '4',
                title: 'Visita - Apartamento Jardins',
                description: 'Acompanhar cliente Carlos em visita ao apartamento de 3 dormitórios nos Jardins.',
                reminder_type: 'visit',
                priority: 'medium',
                status: 'pending',
                reminder_date: nextWeek.toISOString(),
                client_id: 'c4',
                client_name: 'Carlos Oliveira',
                assigned_to: user?.id || '',
                assigned_to_name: user?.email?.split('@')[0] || '',
                created_by: user?.id || '',
                created_at: now.toISOString(),
                notification_channels: ['email', 'sms'],
                is_recurring: false
            }
        ]

        setTasks(mockTasks)
        calculateStats(mockTasks)
    }

    const calculateStats = (tasksData: Task[]) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 7)

        const stats = {
            total: tasksData.length,
            pending: tasksData.filter(t => t.status === 'pending').length,
            completed: tasksData.filter(t => t.status === 'completed').length,
            overdue: tasksData.filter(t => {
                return t.status === 'pending' && new Date(t.reminder_date) < now
            }).length,
            today: tasksData.filter(t => {
                const taskDate = new Date(t.reminder_date)
                return taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }).length,
            thisWeek: tasksData.filter(t => {
                const taskDate = new Date(t.reminder_date)
                return taskDate >= weekStart && taskDate < weekEnd
            }).length
        }

        setStats(stats)
    }

    const getTypeIcon = (type: Task['reminder_type']) => {
        const icons = {
            call: Phone,
            meeting: Calendar,
            document: Building2,
            follow_up: MessageCircle,
            visit: Building2,
            payment: DollarSign
        }
        return icons[type] || MessageCircle
    }

    const getPriorityColor = (priority: Task['priority']) => {
        const colors = {
            low: 'text-green-600',
            medium: 'text-yellow-600',
            high: 'text-orange-600',
            urgent: 'text-red-600'
        }
        return colors[priority] || 'text-gray-600'
    }

    const getStatusColor = (status: Task['status']) => {
        const colors = {
            pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            completed: 'text-green-600 bg-green-50 border-green-200',
            cancelled: 'text-red-600 bg-red-50 border-red-200'
        }
        return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200'
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return 'Data inválida'
        }
    }

    const isOverdue = (dateString: string, status: string) => {
        if (status !== 'pending') return false
        return new Date(dateString) < new Date()
    }

    const handleAddTask = async () => {
        try {
            if (!formData.title || !formData.reminder_date) {
                setError('Título e data são obrigatórios')
                return
            }

            setLoading(true)
            setError('')

            // Combinar data e hora
            const reminderDateTime = formData.reminder_time
                ? `${formData.reminder_date}T${formData.reminder_time}:00.000Z`
                : `${formData.reminder_date}T09:00:00.000Z`

            const newReminder = {
                title: formData.title,
                description: formData.description || undefined,
                reminder_type: formData.reminder_type,
                priority: formData.priority,
                reminder_date: reminderDateTime,
                client_id: formData.client_id || undefined,
                assigned_to: formData.assigned_to || user?.id || '',
                notification_channels: formData.notification_channels as ('email' | 'sms' | 'whatsapp' | 'push')[],
                notes: formData.notes || undefined,
                is_recurring: formData.is_recurring || false
            }

            const { data, error: createError } = await RemindersService.createReminder(newReminder)

            if (createError) {
                throw new Error(createError.message || 'Erro ao criar tarefa')
            }

            setShowAddTask(false)
            resetForm()
            await loadTasks()

        } catch (err: any) {
            console.error('Erro ao criar tarefa:', err)
            setError(err.message || 'Erro ao criar tarefa')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            reminder_type: 'follow_up',
            priority: 'medium',
            reminder_date: '',
            reminder_time: '',
            client_id: '',
            assigned_to: user?.id || '',
            notification_channels: ['email'] as ('email' | 'sms' | 'whatsapp' | 'push')[],
            notes: '',
            is_recurring: false
        })
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
        const matchesType = typeFilter === 'all' || task.reminder_type === typeFilter
        return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando tarefas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CheckSquare className="w-6 h-6 text-blue-600" />
                            Central de Tarefas
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie suas tarefas e lembretes integrados com o Supabase
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddTask(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Tarefa
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pendentes</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-sm text-gray-600">Concluídas</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                        <div className="text-sm text-gray-600">Atrasadas</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
                        <div className="text-sm text-gray-600">Hoje</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">{stats.thisWeek}</div>
                        <div className="text-sm text-gray-600">Esta Semana</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar tarefas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="pending">Pendente</option>
                            <option value="completed">Concluída</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todas as Prioridades</option>
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos os Tipos</option>
                            <option value="call">Ligação</option>
                            <option value="meeting">Reunião</option>
                            <option value="document">Documento</option>
                            <option value="follow_up">Follow-up</option>
                            <option value="visit">Visita</option>
                            <option value="payment">Pagamento</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                        <p className="text-gray-600 mb-4">
                            {tasks.length === 0
                                ? "Você ainda não tem tarefas. Que tal criar a primeira?"
                                : "Nenhuma tarefa corresponde aos filtros aplicados."
                            }
                        </p>
                        {tasks.length === 0 && (
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Criar primeira tarefa
                            </button>
                        )}
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const IconComponent = getTypeIcon(task.reminder_type)
                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-lg border-l-4 p-6 shadow-sm hover:shadow-md transition-shadow ${isOverdue(task.reminder_date, task.status) ? 'border-l-red-500 bg-red-50' :
                                        task.priority === 'urgent' ? 'border-l-red-500' :
                                            task.priority === 'high' ? 'border-l-orange-500' :
                                                task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <IconComponent className="w-5 h-5 text-gray-600" />
                                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                {task.status === 'pending' ? 'Pendente' :
                                                    task.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="text-gray-600 mb-3">{task.description}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span className={isOverdue(task.reminder_date, task.status) ? 'text-red-600 font-medium' : ''}>
                                                    {formatDate(task.reminder_date)}
                                                </span>
                                            </div>

                                            {task.client_name && (
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{task.client_name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className={getPriorityColor(task.priority)}>
                                                    {task.priority === 'low' ? 'Baixa' :
                                                        task.priority === 'medium' ? 'Média' :
                                                            task.priority === 'high' ? 'Alta' : 'Urgente'}
                                                </span>
                                            </div>

                                            {task.notification_channels && task.notification_channels.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Bell className="w-4 h-4" />
                                                    <span>{task.notification_channels.join(', ')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {task.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    // TODO: Implementar atualização do status
                                                    console.log('Marcar como concluída:', task.id)
                                                }}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Marcar como concluída"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                // TODO: Implementar edição
                                                console.log('Editar tarefa:', task.id)
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar tarefa"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                // TODO: Implementar exclusão
                                                console.log('Excluir tarefa:', task.id)
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir tarefa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>

            {/* Modal para adicionar tarefa */}
            <AnimatePresence>
                {showAddTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowAddTask(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Nova Tarefa</h2>
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
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
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: Ligar para cliente..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Detalhes da tarefa..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo
                                            </label>
                                            <select
                                                value={formData.reminder_type}
                                                onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="call">Ligação</option>
                                                <option value="meeting">Reunião</option>
                                                <option value="document">Documento</option>
                                                <option value="follow_up">Follow-up</option>
                                                <option value="visit">Visita</option>
                                                <option value="payment">Pagamento</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Prioridade
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="medium">Média</option>
                                                <option value="high">Alta</option>
                                                <option value="urgent">Urgente</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Data *
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.reminder_date}
                                                onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Horário
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.reminder_time}
                                                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Observações
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={2}
                                            placeholder="Observações adicionais..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="recurring"
                                            checked={formData.is_recurring}
                                            onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="recurring" className="text-sm text-gray-700">
                                            Tarefa recorrente (semanal)
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddTask}
                                        disabled={loading || !formData.title || !formData.reminder_date}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Criando...' : 'Criar Tarefa'}
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